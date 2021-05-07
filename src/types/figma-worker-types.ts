type MsgType =
  | 'create-workspace'
  | 'remove-workspace'
  | 'focus-workspace'
  | 'create-media-input';

export type Msg = {
  type: MsgType;
  workspaceName: string;
  uploadedFileNames: string[];
};
