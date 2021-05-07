const PluginUIHeader = {
  height: 41,
};

export const PluginUI = {
  width: 400,
  height: 480 - PluginUIHeader.height,
};

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
