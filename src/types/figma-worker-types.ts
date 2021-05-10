export type MsgType =
  | 'create-workspace'
  | 'remove-workspace'
  | 'focus-workspace'
  | 'create-media-input'
  | 'remove-media-input-item'
  | 'update-preview'
  | 'resize-plugin-ui'
  | 'remove-preview';

export type Msg = {
  type: MsgType;
  pluginUISize: {
    width: number;
    height: number;
  };
  workspaceName: string;
  uploadedFileNames: string[];
  uploadedFileName: string;
  currentMediaInputItemLength: number;
};
