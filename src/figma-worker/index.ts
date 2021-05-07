/// <reference path="../../node_modules/@figma/plugin-typings/index.d.ts" />

import type { Msg } from '../types';
import {
  initialize,
  createWorkspace,
  focusWorkspace,
  removeWorkspace,
} from './internal';

figma.showUI(__html__);

initialize();

figma.ui.onmessage = (msg: Msg) => {
  switch (msg.type) {
    case 'create-workspace':
      createWorkspace(msg);
      break;
    case 'remove-workspace':
      removeWorkspace(msg);
      break;
    case 'focus-workspace':
      focusWorkspace(msg);
      break;
    default:
      break;
  }

  // figma.closePlugin();
};
