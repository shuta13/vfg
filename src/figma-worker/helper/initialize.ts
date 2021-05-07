const formatWorkspaceName = (workspaceName: string) =>
  workspaceName.split(']')[0].replace('[', '');

export const initialize = () => {
  // Get frame as workspace from figma ui
  // @see: https://qiita.com/seya/items/cb1a1a5350311549d41f
  const componentNodes = figma.root.findAll((node) => node.type === 'FRAME');
  // Shape, remove duplicate workspace names
  const componentNames = [
    ...new Set(componentNodes.map((node) => formatWorkspaceName(node.name))),
  ];
  const workspaceNames = componentNames.map((componentName) => ({
    name: componentName,
  }));
  const selectionNames = [
    ...new Set(
      figma.currentPage.selection.map((selection) =>
        formatWorkspaceName(selection.name)
      )
    ),
  ];
  figma.ui.postMessage({ workspaceNames, selectionNames });
};
