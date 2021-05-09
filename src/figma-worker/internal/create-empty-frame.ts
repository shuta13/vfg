import { MediaInputConstants, PreviewConstants } from '../../config';

type Args = {
  name: string;
  type: typeof PreviewConstants.suffix | typeof MediaInputConstants.name;
  size: { width: number; height: number };
  nodePosition: { x: number; y: number };
  workspaceName: string;
};

export const createEmptyFrame = (args: Args) => {
  const { name, type, size, nodePosition, workspaceName } = args;

  const empty = figma.createFrame();
  empty.name = name;
  empty.resize(size.width, size.height);
  empty.x = nodePosition.x;
  empty.y = nodePosition.y;
  empty.setPluginData('type', type);
  empty.setPluginData('workspaceName', workspaceName);
  return empty;
};
