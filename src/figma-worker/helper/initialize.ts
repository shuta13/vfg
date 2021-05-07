import { MediaInputConstants, WorkspaceConstants } from '../../config';

const formatWorkspaceName = (workspaceName: string) =>
  workspaceName.split(']')[0].replace('[', '');

const formatMediaInputName = (mediaInputName: string) =>
  mediaInputName.split(' ')[1];

export const initialize = () => {
  const workspaceFrameNodes = figma.root.findAll(
    (node) => node.getPluginData('type') === WorkspaceConstants.suffix
  );
  // Shape, remove duplicate workspace names
  const workspaceFrameNames = [
    ...new Set(
      workspaceFrameNodes.map((node) => formatWorkspaceName(node.name))
    ),
  ];
  const workspaceNames = workspaceFrameNames.map((frameName) => ({
    name: frameName,
  }));
  // Set selected nodes
  const selectionNames = [
    ...new Set(
      figma.currentPage.selection.map((selection) =>
        formatWorkspaceName(selection.name)
      )
    ),
  ];

  const mediaInputFrameNodes = figma.root.findAll(
    (node) => node.getPluginData('type') === MediaInputConstants.name
  );
  const mediaInputNames = [
    ...new Set(
      mediaInputFrameNodes.map((node) => formatMediaInputName(node.name))
    ),
  ];
  figma.ui.postMessage({ workspaceNames, selectionNames, mediaInputNames });
};
