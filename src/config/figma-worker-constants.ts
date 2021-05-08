const PluginUIHeader = {
  height: 41,
} as const;

export const PluginUI = {
  width: 320,
  height: 600 - PluginUIHeader.height,
} as const;

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
} as const;

export const MediaInputConstants = {
  name: 'MediaInput',
  width: WorkspaceConstants.width,
  height: WorkspaceConstants.height / 4,
} as const;
