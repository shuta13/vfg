import { Msg } from '../types';
import { PreviewConstants, WorkspaceConstants } from '../config';

export const createWorkspace = (msg: Msg) => {
  const nodesPositionX = figma.currentPage.children.map(
    (child) => child.x + child.width
  );
  const lastNodePosition =
    nodesPositionX.length > 0
      ? nodesPositionX.reduce((prev, cur) => Math.max(prev, cur))
      : 0;

  const newNodes = [];
  const workspace = figma.createFrame();
  // workspace frame
  workspace.name = WorkspaceConstants.namePrefix + msg.workspaceName;
  workspace.resize(WorkspaceConstants.width, WorkspaceConstants.height);
  workspace.x = lastNodePosition + WorkspaceConstants.margin;

  // preview
  const preview = figma.createRectangle();
  preview.name = PreviewConstants.name;
  preview.resize(PreviewConstants.width, PreviewConstants.height);
  workspace.appendChild(preview);

  figma.currentPage.appendChild(workspace);

  newNodes.push(workspace);
  figma.currentPage.selection = newNodes;
  figma.viewport.scrollAndZoomIntoView(newNodes);
};

export const removeWorkspace = (msg: Msg) => {
  figma.currentPage
    .findAll(
      (node) =>
        node.type === 'FRAME' &&
        node.name === WorkspaceConstants.namePrefix + msg.workspaceName
    )
    .forEach((node) => {
      node.remove();
    });
};

export const createPreview = (msg: Msg) => {
  figma.currentPage.findAll(
    (node) =>
      node.type === 'FRAME' &&
      node.name === WorkspaceConstants.namePrefix + msg.workspaceName
  );
};
