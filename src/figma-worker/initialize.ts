export const initialize = () => {
  // Get frame as workspace from figma ui
  // @see: https://qiita.com/seya/items/cb1a1a5350311549d41f
  const componentNodes = figma.root.findAll((node) => node.type === 'FRAME');
  // Remove duplicate workspace names
  const componentNames = [
    ...new Set(
      componentNodes.map((node) => node.name.split(']')[0].replace('[', ''))
    ),
  ];
  const namesData = componentNames.map((componentName) => ({
    name: componentName,
  }));
  figma.ui.postMessage(namesData);
};
