type MsgType = 'create-workspace' | 'remove-workspace' | 'focus-workspace';

export type Msg = {
  type: MsgType;
  count: number;
  workspaceName: string;
};
