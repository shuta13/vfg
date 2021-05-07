type MsgType =
  | 'create-workspace'
  | 'remove-workspace'
  | 'focus-workspace'
  | 'create-media-input'
  | 'focus-media-input'
  | 'remove-media-input';

export type Msg = {
  type: MsgType;
  workspaceName: string;
  uploadedFileNames: string[];
  uploadedFileName: string;
};
