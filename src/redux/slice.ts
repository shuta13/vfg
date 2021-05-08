import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = {
  workspaceNames: string[];
  selectedWorkspace: string;
};

export type InspectorState = {
  value: InspectorValue;
};

export type WorkspacePayload = {
  workspaceName: InspectorValue['workspaceNames'][number];
};

const initialState: InspectorState = {
  value: {
    workspaceNames: [],
    selectedWorkspace: '',
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
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
  setSelectedWorkspace,
} = inspectorSlice.actions;

export const selectInspector = (state: RootState) => ({
  inspectorValue: state.inspector.value,
});

export default inspectorSlice.reducer;
