type MsgType = 'create-rectangles' | 'create-workspace' | 'remove-workspace';

export type Msg = {
  type: MsgType;
  count: number;
  workspaceName: string;
};
