// import { MediaInputItemConstants } from '../../config';
import type { MessageEventTarget } from '../../types';

export const initialize = () => {
  const workspaceFrameNodes = figma.root.findAll(
    (node) => node.type === 'FRAME'
  );
  // Shape, remove duplicate workspace names
  const workspaceNames = [
    ...new Set(
      workspaceFrameNodes.map((node) => node.getPluginData('workspaceName'))
    ),
  ];
  // Set selected nodes
  const selectionNames = [
    ...new Set(
      figma.currentPage.selection.map((selection) =>
        selection.getPluginData('workspaceName')
      )
    ),
  ];

  figma.ui.postMessage(({
    workspaceNames,
    selectionNames,
    // mediaInputItems,
  } as unknown) as MessageEventTarget);
};
