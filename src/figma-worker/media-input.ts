import {
  MediaInputConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { Msg } from '../types';

const checkExistence = (workspaceName: string) => {
  figma.currentPage
    .findAll(
      (node) =>
        node.type === 'FRAME' &&
        node.name.includes(`[${workspaceName}] ${MediaInputConstants.name}`)
    )
    .forEach((node) => {
      node.remove();
    });
};

export const createMediaInput = (msg: Msg) => {
  if (msg.workspaceName !== '') {
    checkExistence(msg.workspaceName);

    const newNodes = [];

    const mediaInput = figma.createFrame();
    mediaInput.name = `[${msg.workspaceName}] ${MediaInputConstants.name}`;
    mediaInput.resize(MediaInputConstants.width, MediaInputConstants.height);
    mediaInput.x = figma.currentPage.findAll((node) =>
      node.name.includes(msg.workspaceName)
    )[0].x;
    mediaInput.y =
      WorkspaceConstants.height +
      PreviewConstants.height +
      WorkspaceConstants.margin * 2;

    msg.uploadedFileNames.forEach((fileName, index) => {
      const mediaRect = figma.createRectangle();
      mediaRect.name = `[${msg.workspaceName}] ${fileName}`;
      mediaRect.resize(PreviewConstants.width / 4, PreviewConstants.height / 4);
      mediaRect.x = (WorkspaceConstants.width / 4) * index;
      mediaInput.appendChild(mediaRect);
    });

    figma.currentPage.appendChild(mediaInput);
    newNodes.push(mediaInput);
  } else {
    figma.notify('Select the workspace where you want to add the media input');
  }
};
