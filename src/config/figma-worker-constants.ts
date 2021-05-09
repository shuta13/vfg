const PluginUIHeader = {
  height: 41,
} as const;

export const PluginUI = {
  width: 320,
  height: 768 - PluginUIHeader.height,
} as const;

export const WorkspaceConstants = {
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
  suffix: 'MediaInput',
  width: WorkspaceConstants.width,
  height: WorkspaceConstants.height / 4,
  maxInnerNumber: 4,
} as const;

export const MediaInputItemConstants = {
  suffix: 'MediaInputItem',
  width: MediaInputConstants.width / MediaInputConstants.maxInnerNumber,
  height: MediaInputConstants.height / MediaInputConstants.maxInnerNumber,
};
