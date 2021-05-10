import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = {
  workspaceNames: string[];
  selectedWorkspace: string;
  selectedFileNameForPreview: string;
  mediaInputItems: { workspaceName: string; uploadedFileName: string }[];
};

export type InspectorState = {
  value: InspectorValue;
};

export type WorkspacePayload = {
  workspaceName: InspectorValue['workspaceNames'][number];
};

export type PreviewPayload = {
  uploadedFileName: InspectorValue['selectedFileNameForPreview'];
};

export type MediaInputPayload = {
  mediaInputItems: InspectorValue['mediaInputItems'];
};

const initialState: InspectorState = {
  value: {
    workspaceNames: [],
    selectedWorkspace: '',
    selectedFileNameForPreview: '',
    mediaInputItems: [],
  },
};

export const inspectorSlice = createSlice({
  name: 'inspector',
  initialState,
  reducers: {
    setWorkspaceName: (state, action: PayloadAction<WorkspacePayload>) => {
      state.value.workspaceNames.push(action.payload.workspaceName);
    },
    resetWorkspaceNames: (state) => {
      state.value.workspaceNames = [];
    },
    deleteWorkspaceName: (state, action: PayloadAction<WorkspacePayload>) => {
      state.value.workspaceNames = state.value.workspaceNames.filter(
        (workspaceName) => workspaceName !== action.payload.workspaceName
      );
    },
    setSelectedWorkspace: (state, action: PayloadAction<WorkspacePayload>) => {
      state.value.selectedWorkspace = action.payload.workspaceName;
    },
    setSelectedFileNameForPreview: (
      state,
      action: PayloadAction<PreviewPayload>
    ) => {
      state.value.selectedFileNameForPreview = action.payload.uploadedFileName;
    },
    setMediaInputItem: (state, action: PayloadAction<MediaInputPayload>) => {
      state.value.mediaInputItems = action.payload.mediaInputItems;
    },
    resetMediaInputItems: (state) => {
      state.value.mediaInputItems = [];
    },
    deleteMediaInputItem: (state, action: PayloadAction<MediaInputPayload>) => {
      state.value.mediaInputItems = state.value.mediaInputItems.filter(
        (item) =>
          item.uploadedFileName !==
          action.payload.mediaInputItems[0].uploadedFileName
      );
    },
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setSelectedFileNameForPreview,
  setMediaInputItem,
  resetMediaInputItems,
  deleteMediaInputItem,
} = inspectorSlice.actions;

export const selectInspector = (state: RootState) => ({
  inspectorValue: state.inspector.value,
});

export default inspectorSlice.reducer;
