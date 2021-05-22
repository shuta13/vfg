export const PluginUIHeader = {
  height: 41,
} as const;

export const PluginUI = {
  width: 320,
  height: 776 - PluginUIHeader.height,
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

export const InventoryConstants = {
  suffix: 'Inventory',
  width: WorkspaceConstants.width,
  height: WorkspaceConstants.height / 4,
  maxInnerNumber: 4,
} as const;

export const InventoryItemConstants = {
  suffix: 'InventoryItem',
  width: InventoryConstants.width / InventoryConstants.maxInnerNumber,
  height: InventoryConstants.height / InventoryConstants.maxInnerNumber,
};
