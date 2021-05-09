import {
  MediaInputConstants,
  MediaInputItemConstants,
  PreviewConstants,
  WorkspaceConstants,
} from '../config';
import { Msg } from '../types';
import { createEmptyFrame } from './internal';

const checkExistence = (workspaceName: string) => {
  const mediaInputFrame = figma.currentPage.findOne(
    (node) =>
      node.type === 'FRAME' &&
      node.getPluginData('type') === MediaInputConstants.suffix &&
      node.getPluginData('workspaceName') === workspaceName
  );
  mediaInputFrame?.remove();
};

export const createMediaInput = (msg: Msg) => {
  if (msg.workspaceName !== '') {
    checkExistence(msg.workspaceName);

    const newNodes = [];

    const mediaInput = createEmptyFrame({
      name: `[${msg.workspaceName}] ${MediaInputConstants.suffix}`,
      type: MediaInputConstants.suffix,
      size: {
        width: MediaInputConstants.width,
        height: MediaInputConstants.height,
      },
      nodePosition: {
        x:
          figma.currentPage.findOne(
            (node) => node.getPluginData('workspaceName') === msg.workspaceName
          )?.x ?? 0,
        y: PreviewConstants.height + WorkspaceConstants.margin,
      },
      workspaceName: msg.workspaceName,
    });

    msg.uploadedFileNames.forEach((fileName, index) => {
      const mediaRect = figma.createRectangle();
      mediaRect.name = `[${msg.workspaceName}] ${fileName}`;
      mediaRect.resize(
        MediaInputItemConstants.width,
        MediaInputItemConstants.height
      );
      mediaRect.x =
        MediaInputItemConstants.width *
        (index % MediaInputConstants.maxInnerNumber);
      mediaRect.y =
        MediaInputItemConstants.height *
        Math.floor(index / MediaInputConstants.maxInnerNumber);
      // mediaRect.fills = [{ type: 'IMAGE', scaleMode: 'FILL', imageHash: '' }];
      mediaRect.setPluginData('type', MediaInputItemConstants.suffix);
      mediaRect.setPluginData('workspaceName', msg.workspaceName);
      mediaRect.setPluginData('fileName', fileName);
      mediaInput.appendChild(mediaRect);
    });

    figma.currentPage.appendChild(mediaInput);
    newNodes.push(mediaInput);
  } else {
    figma.notify(
      'Select the workspace where you want to add the media input in Workspace Inspector'
    );
  }
};

/**
 * @deprecated
 */
export const removeMediaInput = (msg: Msg) => {
  if (msg.workspaceName === '') {
    figma.notify(
      'Select the workspace where you want to remove the media input in Workspace Inspector'
    );
  } else {
    figma.currentPage
      .findAll(
        (node) =>
          node.type === 'RECTANGLE' &&
          node.getPluginData('workspaceName') === msg.workspaceName &&
          node.getPluginData('type') === MediaInputConstants.suffix &&
          node.getPluginData('fileName') === msg.uploadedFileName
      )
      .forEach((node) => {
        node.remove();
      });
  }
};
