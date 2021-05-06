import { Msg } from '../types';
import { WorkspaceConstants } from '../config';

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
  workspace.name = WorkspaceConstants.namePrefix + msg.workspaceName;
  workspace.x = lastNodePosition + WorkspaceConstants.margin;
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
