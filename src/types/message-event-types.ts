import type { Msg } from './figma-worker-types';

export type MessageEventTarget = {
  pluginMessage: {
    workspaceNames: string[];
    selectionNames: string[];
    mediaInputData: {
      workspaceName: string;
      uploadedFileName: string;
    };
  };
};

export type PostMessage = {
  pluginMessage: Omit<Msg, 'uploadedFileName'>;
};
