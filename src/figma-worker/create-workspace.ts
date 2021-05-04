import { Msg } from '../types';

export const createWorkspace = (msg: Msg) => {
  const nodes = [];
  const workspace = figma.createFrame();
  workspace.name = msg.workspaceName;

  figma.currentPage.appendChild(workspace);

  nodes.push(workspace);

  figma.currentPage.selection = nodes;

  figma.viewport.scrollAndZoomIntoView(nodes);
};
