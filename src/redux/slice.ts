import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = {
  workspaceNames: string[];
  selectedWorkspace: string;
  selectedFileNameForPreview: string;
};

export type InspectorState = {
  value: InspectorValue;
};

export type WorkspacePayload = {
  workspaceName: InspectorValue['workspaceNames'][number];
};

export type PreviewPayload = {
  fileName: InspectorValue['selectedFileNameForPreview'];
};

const initialState: InspectorState = {
  value: {
    workspaceNames: [],
    selectedWorkspace: '',
    selectedFileNameForPreview: '',
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
      state.value.selectedFileNameForPreview = action.payload.fileName;
    },
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setSelectedFileNameForPreview,
} = inspectorSlice.actions;

export const selectInspector = (state: RootState) => ({
  inspectorValue: state.inspector.value,
});

export default inspectorSlice.reducer;
