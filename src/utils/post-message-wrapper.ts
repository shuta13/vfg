import { PostMessage } from '../types';

export const postMessage = <T extends PostMessage>(
  message: T,
  targetOrigin: string,
  // eslint-disable-next-line no-undef
  transfer?: Transferable[]
) => {
  parent.postMessage(message, targetOrigin, transfer);
};
