export const WorkspaceConstants = {
  suffix: 'Controlls',
  width: 320,
  height: 720,
  margin: 16,
} as const;

export const PreviewConstants = {
  suffix: 'Preview',
  width: WorkspaceConstants.width,
  height: WorkspaceConstants.height / 4,
};
