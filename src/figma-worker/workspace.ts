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

  // workspace
  const workspace = figma.createFrame();
  workspace.name = `[${msg.workspaceName}] ${WorkspaceConstants.suffix}`;
  workspace.resize(WorkspaceConstants.width, WorkspaceConstants.height);
  workspace.x = lastNodePosition + WorkspaceConstants.margin;

  // preview
  const preview = figma.createFrame();
  preview.name = `[${msg.workspaceName}] ${PreviewConstants.suffix}`;
  preview.resize(PreviewConstants.width, PreviewConstants.height);
  preview.x = lastNodePosition + WorkspaceConstants.margin;
  preview.y = WorkspaceConstants.height + WorkspaceConstants.margin;

  figma.currentPage.appendChild(workspace);
  figma.currentPage.appendChild(preview);

  newNodes.push(workspace);
  newNodes.push(preview);

  figma.currentPage.selection = newNodes;
  figma.viewport.scrollAndZoomIntoView(newNodes);
};

export const removeWorkspace = (msg: Msg) => {
  figma.currentPage
    .findAll(
      (node) =>
        node.type === 'FRAME' &&
        (node.name.includes(
          `[${msg.workspaceName}] ${WorkspaceConstants.suffix}`
        ) ||
          node.name.includes(
            `[${msg.workspaceName}] ${PreviewConstants.suffix}`
          ))
    )
    .forEach((node) => {
      node.remove();
    });
};

export const focusWorkspace = (msg: Msg) => {
  const selected = figma.currentPage.findAll(
    (node) =>
      node.type === 'FRAME' &&
      (node.name.includes(
        `[${msg.workspaceName}] ${WorkspaceConstants.suffix}`
      ) ||
        node.name.includes(`[${msg.workspaceName}] ${PreviewConstants.suffix}`))
  );
  figma.currentPage.selection = selected;
  figma.viewport.scrollAndZoomIntoView(selected);
};
