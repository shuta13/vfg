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
  const workspaceNames = [
    ...new Set(
      workspaceFrameNodes.map((node) => formatWorkspaceName(node.name))
    ),
  ];
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
  const workspaceHasMediaInputNames = [
    ...new Set(
      mediaInputFrameNodes.map((node) => formatWorkspaceName(node.name))
    ),
  ];
  const mediaInputData: {
    workspaceName: string;
    uploadedFileName: string;
  }[] = [];
  workspaceHasMediaInputNames.forEach((name) => {
    mediaInputFrameNodes.forEach((node) => {
      if (formatWorkspaceName(node.name) === name) {
        mediaInputData.push({
          workspaceName: name,
          uploadedFileName: formatMediaInputName(node.name),
        });
      }
    });
  });
  figma.ui.postMessage({ workspaceNames, selectionNames, mediaInputData });
};
