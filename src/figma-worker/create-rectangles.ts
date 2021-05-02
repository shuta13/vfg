import type { Msg } from '../types';

export const createRectangles = (msg: Msg) => {
  const nodes = [];

  for (let i = 0; i < msg.count; i++) {
    const rect = figma.createRectangle();
    rect.x = i * 150;
    rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
    figma.currentPage.appendChild(rect);
    nodes.push(rect);
  }

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
};
