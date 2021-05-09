export type MsgType =
  | 'create-workspace'
  | 'remove-workspace'
  | 'focus-workspace'
  | 'create-media-input'
  | 'remove-media-input-item';

export type Msg = {
  type: MsgType;
  workspaceName: string;
  uploadedFileNames: string[];
  uploadedFileName: string;
};
