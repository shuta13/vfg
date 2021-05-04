/// <reference path="../../node_modules/@figma/plugin-typings/index.d.ts" />

import type { Msg } from '../types';
import { createRectangles } from './create-rectangles';
import { createWorkspace } from './create-workspace';

figma.showUI(__html__);

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
