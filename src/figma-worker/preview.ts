import {
  InventoryConstants,
  InventoryItemConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { Msg } from '../types';
import { createSkeletonFrame } from './internal';

const checkExistence = (workspaceName: string) => {
  const mediaInputFrame = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === PreviewConstants.suffix &&
      node.getPluginData('workspaceName') === workspaceName
  );
  mediaInputFrame?.remove();
};

export const updatePreview = async (msg: Msg) => {
  checkExistence(msg.workspaceName);

  const mediaInputItems = figma.currentPage.findAll(
    (node) =>
      node.type === 'RECTANGLE' &&
      node.getPluginData('type') === InventoryItemConstants.suffix &&
      node.getPluginData('workspaceName') === msg.workspaceName
  );

  const selectedItem = figma.currentPage.findOne(
    (node) =>
      node.type === 'RECTANGLE' &&
      node.getPluginData('type') === InventoryItemConstants.suffix &&
      node.getPluginData('workspaceName') === msg.workspaceName &&
      node.getPluginData('fileName') === msg.uploadedFileName
  );

  console.log(selectedItem);

  const { x, y } = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === InventoryConstants.suffix &&
      node.getPluginData('workspaceName') === msg.workspaceName
  ) ?? { x: 0, y: 0 };

  const preview = createSkeletonFrame({
    name: `[${msg.workspaceName}] ${PreviewConstants.suffix}`,
    type: PreviewConstants.suffix,
    size: { width: PreviewConstants.width, height: PreviewConstants.height },
    nodePosition: {
      x,
      y: y - (InventoryConstants.height + WorkspaceConstants.margin),
    },
    workspaceName: msg.workspaceName,
  });

  if (
    mediaInputItems.length > 0 &&
    mediaInputItems.length === msg.currentInventoryItemLength &&
    selectedItem
  ) {
    const newNodes = [];
    const cloned = selectedItem.clone();
    cloned.resize(PreviewConstants.width, PreviewConstants.height);
    cloned.x = 0;
    cloned.y = 0;
    preview.appendChild(cloned);

    // const previewRect = figma.createRectangle();
    // previewRect.name = `[${msg.workspaceName}] ${msg.uploadedFileName}`;
    // previewRect.resize(PreviewConstants.width, PreviewConstants.height);
    // previewRect.fills = [
    //   {
    //     type: 'IMAGE',
    //     scaleMode: 'FILL',
    //     imageHash: image.hash,
    //   },
    // ];
    // previewRect.setPluginData('type', PreviewConstants.suffix);
    // previewRect.setPluginData('workspaceName', msg.workspaceName);
    // previewRect.setPluginData('fileName', msg.uploadedFileName);
    // preview.appendChild(selectedItem);

    newNodes.push(preview);
    figma.currentPage.appendChild(preview);
    newNodes.push(preview);

    figma.currentPage.selection = newNodes;
  } else {
    figma.currentPage.appendChild(preview);

    figma.notify(
      'The selected file may have been deleted. Please restart the plugin ;)'
    );
  }
};

export const removePreview = (msg: Msg) => {
  figma.currentPage
    .findOne(
      (node) =>
        node.type === 'RECTANGLE' &&
        node.getPluginData('type') === PreviewConstants.suffix &&
        node.getPluginData('workspaceName') === msg.workspaceName &&
        node.getPluginData('fileName') === msg.uploadedFileName
    )
    ?.remove();
};
