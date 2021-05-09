import { MediaInputConstants } from '../../config';

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

  const mediaInputFrameNodes = figma.root.findAll(
    (node) => node.getPluginData('type') === MediaInputConstants.suffix
  );
  const workspaceHasMediaInputNames = [
    ...new Set(
      mediaInputFrameNodes.map((node) => node.getPluginData('workspaceName'))
    ),
  ];
  const mediaInputData: {
    workspaceName: string;
    uploadedFileName: string;
  }[] = [];
  workspaceHasMediaInputNames.forEach((name) => {
    mediaInputFrameNodes.forEach((node) => {
      if (
        node.getPluginData('workspaceName') === name &&
        node.getPluginData('fileName')
      ) {
        mediaInputData.push({
          workspaceName: name,
          uploadedFileName: node.getPluginData('fileName'),
        });
      }
    });
  });
  figma.ui.postMessage({ workspaceNames, selectionNames, mediaInputData });
};
