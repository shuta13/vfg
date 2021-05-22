/// <reference path="../../node_modules/@figma/plugin-typings/index.d.ts" />

import { PluginUI } from '../config';
import type { Msg } from '../types';
import { initialize } from './helper';
import { createInventory, removeInventoryItem } from './media-input';
import { removePreview, updatePreview } from './preview';
import { resizePluginUI } from './resize-plugin-ui';
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
      createInventory(msg);
      break;
    case 'remove-media-input-item':
      removeInventoryItem(msg);
      break;
    case 'update-preview':
      updatePreview(msg);
      break;
    case 'resize-plugin-ui':
      resizePluginUI(msg);
      break;
    case 'remove-preview':
      removePreview(msg);
      break;
    default:
      break;
  }

  // figma.closePlugin();
};
