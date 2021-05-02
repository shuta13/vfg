/// <reference path="../node_modules/@figma/plugin-typings/index.d.ts" />

import type { Msg } from './types';
import { createRectangles } from './figma-worker/create-rectangles';
import { noop } from './utils';

figma.showUI(__html__);

figma.ui.onmessage = (msg: Msg) => {
  switch (msg.type) {
    case 'create-rectangles':
      createRectangles(msg);
      break;
    default:
      noop();
      break;
  }

  figma.closePlugin();
};
