/// <reference path="../../node_modules/@figma/plugin-typings/index.d.ts" />

import type { Msg } from '../types';
import { createRectangles } from './create-rectangles';
import { createWorkspace } from './create-workspace';

figma.showUI(__html__);

// get frame as workspace from figma ui
// @see: https://qiita.com/seya/items/cb1a1a5350311549d41f
const componentNodes = figma.root.findAll((node) => node.type === 'FRAME');
const componentsData = componentNodes.map((node) => ({
  id: node.id,
  name: node.name,
}));
figma.ui.postMessage(componentsData);

figma.ui.onmessage = (msg: Msg) => {
  switch (msg.type) {
    case 'create-rectangles':
      createRectangles(msg);
      break;
    case 'create-workspace':
      createWorkspace(msg);
      break;
    default:
      break;
  }

  // figma.closePlugin();
};
