import type { MsgType } from './figma-worker-types';

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
  pluginMessage: {
    type: MsgType;
    workspaceName: string;
    uploadedFileNames: string[];
  };
};
