import { MediaInputConstants } from '../config';

export const createMediaInput = (workspace: any) => {
  const mediaInput = figma.createFrame();
  mediaInput.name = MediaInputConstants.name;
  mediaInput.resize(MediaInputConstants.width, MediaInputConstants.height);
  workspace.appendChild(mediaInput);
};
