import type { Msg } from './figma-worker-types';

export type MessageEventTarget = {
  pluginMessage: {
    workspaceNames?: string[];
    selectionNames?: string[];
    mediaInputItems?: {
      workspaceName: string;
      uploadedFileName: string;
    }[];
  };
};

export type PostMessage = {
  pluginMessage: Omit<Msg, 'uploadedFileName'>;
};
