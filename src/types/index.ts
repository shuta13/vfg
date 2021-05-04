type MsgType = 'create-rectangles' | 'create-workspace';

export type Msg = {
  type: MsgType;
  count: number;
  workspaceName: string;
};
