import {
  MediaInputConstants,
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

export const updatePreview = (msg: Msg) => {
  checkExistence(msg.workspaceName);

  const newNodes = [];

  const { x, y } = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === MediaInputConstants.suffix &&
      node.getPluginData('workspaceName') === msg.workspaceName
  ) ?? { x: 0, y: 0 };

  const preview = createSkeletonFrame({
    name: `[${msg.workspaceName}] ${PreviewConstants.suffix}`,
    type: PreviewConstants.suffix,
    size: { width: PreviewConstants.width, height: PreviewConstants.height },
    nodePosition: {
      x,
      y: y - (MediaInputConstants.height + WorkspaceConstants.margin),
    },
    workspaceName: msg.workspaceName,
  });

  const previewRect = figma.createRectangle();
  previewRect.name = `[${msg.workspaceName}] ${msg.uploadedFileName}`;
  previewRect.resize(PreviewConstants.width, PreviewConstants.height);
  previewRect.setPluginData('type', PreviewConstants.suffix);
  previewRect.setPluginData('workspaceName', msg.workspaceName);
  previewRect.setPluginData('fileName', msg.uploadedFileName);
  preview.appendChild(previewRect);

  figma.currentPage.appendChild(preview);
  newNodes.push(preview);

  figma.currentPage.selection = newNodes;
};
