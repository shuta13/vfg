import {
  InventoryConstants,
  InventoryItemConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { MessageEventTarget, Msg } from '../types';
import { createSkeletonFrame } from './internal';

const checkExistence = (workspaceName: string) => {
  const mediaInputFrame = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === InventoryConstants.suffix &&
      node.getPluginData('workspaceName') === workspaceName
  );
  mediaInputFrame?.remove();
};

export const createInventory = async (msg: Msg) => {
  if (msg.workspaceName !== '') {
    const prevMediaRects = figma.currentPage.findAll(
      (node) =>
        node.type === 'RECTANGLE' &&
        node.getPluginData('type') === InventoryItemConstants.suffix
    );
    const prevMediaData = prevMediaRects.map((rect) => ({
      name: rect.getPluginData('fileName'),
      imageHash: rect.getPluginData('imageHash'),
    }));

    checkExistence(msg.workspaceName);

    const newNodes = [];

    const { x, y } = figma.currentPage.findOne(
      (node) =>
        node.type === 'FRAME' &&
        node.getPluginData('type') === PreviewConstants.suffix &&
        node.getPluginData('workspaceName') === msg.workspaceName
    ) ?? { x: 0, y: 0 };

    const mediaInput = createSkeletonFrame({
      name: `[${msg.workspaceName}] ${InventoryConstants.suffix}`,
      type: InventoryConstants.suffix,
      size: {
        width: InventoryConstants.width,
        height: InventoryConstants.height,
      },
      nodePosition: {
        x,
        y: y + PreviewConstants.height + WorkspaceConstants.margin,
      },
      workspaceName: msg.workspaceName,
    });

    const mediaInputItems: MessageEventTarget['pluginMessage']['mediaInputItems'] =
      [];

    // sourced: https://stackoverflow.com/questions/63616406/how-to-merge-two-array-of-objects-based-on-same-key-and-value-in-javascript
    const newMediaData = msg.uploadedMediaData.map((uploaded) => ({
      ...uploaded,
      ...prevMediaData.find((prev) => uploaded.name === prev.name),
    }));

    newMediaData.forEach((data, index) => {
      const image = data.imageHash
        ? { hash: data.imageHash }
        : figma.createImage(data.fileData);

      const mediaRect = figma.createRectangle();
      mediaRect.name = `[${msg.workspaceName}] ${data.name}`;
      mediaRect.resize(
        InventoryItemConstants.width,
        InventoryItemConstants.height
      );
      mediaRect.x =
        InventoryItemConstants.width *
        (index % InventoryConstants.maxInnerNumber);
      mediaRect.y =
        InventoryItemConstants.height *
        Math.floor(index / InventoryConstants.maxInnerNumber);
      mediaRect.fills = [
        {
          type: 'IMAGE',
          scaleMode: 'FILL',
          imageHash: image.hash,
        },
      ];
      mediaRect.setPluginData('type', InventoryItemConstants.suffix);
      mediaRect.setPluginData('workspaceName', msg.workspaceName);
      mediaRect.setPluginData('fileName', data.name);
      mediaRect.setPluginData('imageHash', image.hash);
      mediaInput.appendChild(mediaRect);

      mediaInputItems.push({
        workspaceName: msg.workspaceName,
        uploadedFileName: data.name,
      });
    });

    figma.currentPage.appendChild(mediaInput);
    newNodes.push(mediaInput);

    figma.ui.postMessage({
      mediaInputItems,
    });
  } else {
    figma.notify(
      'Select the workspace where you want to add the media input in Workspace Inspector'
    );
  }
};

export const removeInventoryItem = (msg: Msg) => {
  if (msg.workspaceName === '') {
    figma.notify(
      'Select the workspace where you want to remove the media input in Workspace Inspector'
    );
  } else {
    figma.currentPage
      .findOne(
        (node) =>
          node.type === 'RECTANGLE' &&
          node.getPluginData('workspaceName') === msg.workspaceName &&
          node.getPluginData('type') === InventoryItemConstants.suffix &&
          node.getPluginData('fileName') === msg.uploadedFileName
      )
      ?.remove();

    const mediaInputFrameNodes = figma.root.findAll(
      (node) => node.getPluginData('type') === InventoryItemConstants.suffix
    );
    const mediaInputItems: MessageEventTarget['pluginMessage']['mediaInputItems'] =
      [];
    mediaInputFrameNodes.forEach((node) => {
      if (node.getPluginData('workspaceName') === msg.workspaceName) {
        mediaInputItems.push({
          workspaceName: msg.workspaceName,
          uploadedFileName: node.getPluginData('fileName'),
        });
      }
    });
    figma.ui.postMessage({
      mediaInputItems,
    });
  }
};
