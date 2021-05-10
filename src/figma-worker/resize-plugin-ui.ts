import { Msg } from '../types';

export const resizePluginUI = (msg: Msg) => {
  figma.ui.resize(msg.pluginUISize.width, msg.pluginUISize.height);
};
