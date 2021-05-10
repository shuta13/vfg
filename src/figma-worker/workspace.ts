import { MessageEventTarget, Msg } from '../types';
import {
  MediaInputConstants,
  MediaInputItemConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { createSkeletonFrame } from './internal';

export const createWorkspace = (msg: Msg) => {
  const nodesPositionX = figma.currentPage.children.map(
    (child) => child.x + child.width
  );
  const lastNodePositionX =
    nodesPositionX.length > 0
      ? nodesPositionX.reduce((prev, cur) => Math.max(prev, cur))
      : 0;

  const newNodes = [];

  // create empty preview
  const preview = createSkeletonFrame({
    name: `[${msg.workspaceName}] ${PreviewConstants.suffix}`,
    type: PreviewConstants.suffix,
    size: { width: PreviewConstants.width, height: PreviewConstants.height },
    nodePosition: {
      x: lastNodePositionX + WorkspaceConstants.margin,
      y: 0,
    },
    workspaceName: msg.workspaceName,
  });
  figma.currentPage.appendChild(preview);
  newNodes.push(preview);

  // create empty media input
  const mediaInput = createSkeletonFrame({
    name: `[${msg.workspaceName}] ${MediaInputConstants.suffix}`,
    type: MediaInputConstants.suffix,
    size: {
      width: MediaInputConstants.width,
      height: MediaInputConstants.height,
    },
    nodePosition: {
      x:
        figma.currentPage.findOne(
          (node) => node.getPluginData('workspaceName') === msg.workspaceName
        )?.x ?? 0,
      y: PreviewConstants.height + WorkspaceConstants.margin,
    },
    workspaceName: msg.workspaceName,
  });
  figma.currentPage.appendChild(mediaInput);
  newNodes.push(mediaInput);

  figma.currentPage.selection = newNodes;
  figma.viewport.scrollAndZoomIntoView(newNodes);
};

export const removeWorkspace = (msg: Msg) => {
  // Remove all workspace item
  figma.currentPage
    .findAll(
      (node) =>
        node.type === 'FRAME' &&
        node.getPluginData('workspaceName') === msg.workspaceName
    )
    .forEach((node) => {
      node.remove();
    });
};

export const focusWorkspace = (msg: Msg) => {
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

  const selectedFileNameForPreview =
    figma.currentPage
      .findOne(
        (node) =>
          node.type === 'RECTANGLE' &&
          node.getPluginData('type') === PreviewConstants.suffix &&
          node.getPluginData('workspaceName') === msg.workspaceName
      )
      ?.getPluginData('fileName') ?? '';

  figma.ui.postMessage({
    mediaInputItems,
    selectedFileNameForPreview,
  });

  const selected = figma.currentPage.findAll(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('workspaceName') === msg.workspaceName
  );

  if (!(selected.length > 0)) {
    figma.notify(
      'The selected workspace may have been deleted. Please restart the plugin and create new one ;)'
    );
  }

  figma.currentPage.selection = selected;
  figma.viewport.scrollAndZoomIntoView(selected);
};
