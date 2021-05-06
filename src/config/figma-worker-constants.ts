export const WorkspaceConstants = {
  namePrefix: '[Workspace] ',
  width: 240,
  height: 640,
  margin: 16,
} as const;

export const PreviewConstants = {
  name: 'Preview',
  width: WorkspaceConstants.width,
  height: WorkspaceConstants.height / 4,
};
