import {
  MediaInputConstants,
  MediaInputItemConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { MessageEventTarget, Msg } from '../types';
import { createSkeletonFrame } from './internal';

const checkExistence = (workspaceName: string) => {
  const mediaInputFrame = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === MediaInputConstants.suffix &&
      node.getPluginData('workspaceName') === workspaceName
  );
  mediaInputFrame?.remove();
};

export const createMediaInput = (msg: Msg) => {
  if (msg.workspaceName !== '') {
    const prevMediaRects = figma.currentPage.findAll(
      (node) =>
        node.type === 'RECTANGLE' &&
        node.getPluginData('type') === MediaInputItemConstants.suffix
    );
    const prevMediaFileNames = prevMediaRects.map((rect) =>
      rect.getPluginData('fileName')
    );

    checkExistence(msg.workspaceName);

    const newNodes = [];

    const { x, y } = figma.currentPage.findOne(
      (node) =>
        node.type === 'FRAME' &&
        node.getPluginData('type') === PreviewConstants.suffix &&
        node.getPluginData('workspaceName') === msg.workspaceName
    ) ?? { x: 0, y: 0 };

    const mediaInput = createSkeletonFrame({
      name: `[${msg.workspaceName}] ${MediaInputConstants.suffix}`,
      type: MediaInputConstants.suffix,
      size: {
        width: MediaInputConstants.width,
        height: MediaInputConstants.height,
      },
      nodePosition: {
        x,
        y: y + PreviewConstants.height + WorkspaceConstants.margin,
      },
      workspaceName: msg.workspaceName,
    });

    const mediaInputItems: MessageEventTarget['pluginMessage']['mediaInputItems'] = [];
    const newFileNames = [
      ...new Set([...msg.uploadedFileNames, ...prevMediaFileNames]),
    ];

    newFileNames.forEach((fileName, index) => {
      const mediaRect = figma.createRectangle();
      mediaRect.name = `[${msg.workspaceName}] ${fileName}`;
      mediaRect.resize(
        MediaInputItemConstants.width,
        MediaInputItemConstants.height
      );
      mediaRect.x =
        MediaInputItemConstants.width *
        (index % MediaInputConstants.maxInnerNumber);
      mediaRect.y =
        MediaInputItemConstants.height *
        Math.floor(index / MediaInputConstants.maxInnerNumber);
      // mediaRect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: '' }];
      mediaRect.setPluginData('type', MediaInputItemConstants.suffix);
      mediaRect.setPluginData('workspaceName', msg.workspaceName);
      mediaRect.setPluginData('fileName', fileName);
      mediaInput.appendChild(mediaRect);

      mediaInputItems.push({
        workspaceName: msg.workspaceName,
        uploadedFileName: fileName,
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

export const removeMediaInputItem = (msg: Msg) => {
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
          node.getPluginData('type') === MediaInputItemConstants.suffix &&
          node.getPluginData('fileName') === msg.uploadedFileName
      )
      ?.remove();

    const mediaInputFrameNodes = figma.root.findAll(
      (node) => node.getPluginData('type') === MediaInputItemConstants.suffix
    );
    const mediaInputItems: MessageEventTarget['pluginMessage']['mediaInputItems'] = [];
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
