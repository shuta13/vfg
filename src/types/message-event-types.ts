import type { Msg } from './figma-worker-types';

export type MessageEventTarget = {
  pluginMessage: {
    workspaceNames?: string[];
    selectionNames?: string[];
    mediaInputItems?: {
      workspaceName: string;
      uploadedFileName: string;
    }[];
    uploadedFileName?: string;
    selectedFileNameForPreview?: string;
    uploadedMediaData: {
      name: string;
      fileData: Uint8Array;
    }[];
  };
};

export type PostMessage = {
  pluginMessage: Partial<Msg>;
};
