import { Msg } from '../types';
import { WorkspaceConstants } from '../config';
import { createPreview } from './internal';

export const createWorkspace = (msg: Msg) => {
  const nodesPositionX = figma.currentPage.children.map(
    (child) => child.x + child.width
  );
  const lastNodePosition =
    nodesPositionX.length > 0
      ? nodesPositionX.reduce((prev, cur) => Math.max(prev, cur))
      : 0;

  const newNodes = [];

  // create workspace frame
  const workspace = figma.createFrame();
  workspace.name = `[${msg.workspaceName}] ${WorkspaceConstants.suffix}`;
  workspace.resize(WorkspaceConstants.width, WorkspaceConstants.height);
  workspace.x = lastNodePosition + WorkspaceConstants.margin;
  figma.currentPage.appendChild(workspace);
  newNodes.push(workspace);

  const preview = createPreview(msg.workspaceName, lastNodePosition);
  figma.currentPage.appendChild(preview);
  newNodes.push(preview);

  figma.currentPage.selection = newNodes;
  figma.viewport.scrollAndZoomIntoView(newNodes);
};

export const removeWorkspace = (msg: Msg) => {
  figma.currentPage
    .findAll(
      (node) =>
        node.type === 'FRAME' && node.name.includes(`[${msg.workspaceName}]`)
    )
    .forEach((node) => {
      node.remove();
    });
};

export const focusWorkspace = (msg: Msg) => {
  const selected = figma.currentPage.findAll(
    (node) =>
      node.type === 'FRAME' && node.name.includes(`[${msg.workspaceName}]`)
  );
  figma.currentPage.selection = selected;
  figma.viewport.scrollAndZoomIntoView(selected);
};
