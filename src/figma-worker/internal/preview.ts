import { PreviewConstants, WorkspaceConstants } from '../../config';

export const createPreview = (
  workspaceName: string,
  lastNodePosition: number
) => {
  const preview = figma.createFrame();
  preview.name = `[${workspaceName}] ${PreviewConstants.suffix}`;
  preview.resize(PreviewConstants.width, PreviewConstants.height);
  preview.x = lastNodePosition + WorkspaceConstants.margin;
  preview.y = WorkspaceConstants.height + WorkspaceConstants.margin;
  return preview;
};