/// <reference path="../../node_modules/@figma/plugin-typings/index.d.ts" />

import { PluginUI } from '../config';
import type { Msg } from '../types';
import { initialize } from './helper';
import {
  createMediaInput,
  // removeMediaInput,
} from './media-input';
import { createWorkspace, focusWorkspace, removeWorkspace } from './workspace';

figma.showUI(__html__);
figma.ui.resize(PluginUI.width, PluginUI.height);

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
    case 'create-media-input':
      console.log('うごいてるよ〜');
      createMediaInput(msg);
      break;
    // case 'remove-media-input':
    //   removeMediaInput(msg);
    //   break;
    default:
      break;
  }

  // figma.closePlugin();
};
