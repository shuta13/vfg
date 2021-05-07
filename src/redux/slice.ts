import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = { workspaceName: string };

export type InspectorState = {
  values: InspectorValue[];
  selectedWorkspace: string;
};

const initialState: InspectorState = {
  values: [],
  selectedWorkspace: '',
};

export const inspectorSlice = createSlice({
  name: 'inspector',
  initialState,
  reducers: {
    setWorkspaceName: (state, action: PayloadAction<InspectorValue>) => {
      state.values.push({ workspaceName: action.payload.workspaceName });
    },
    resetWorkspaceNames: (state) => {
      state.values = [];
    },
    deleteWorkspaceName: (state, action: PayloadAction<InspectorValue>) => {
      state.values = state.values.filter(
        (value) => value.workspaceName !== action.payload.workspaceName
      );
    },
    setSelectedWorkspace: (state, action: PayloadAction<InspectorValue>) => {
      state.selectedWorkspace = action.payload.workspaceName;
    },
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
  setSelectedWorkspace,
} = inspectorSlice.actions;

export const selectWorkspace = (state: RootState) => ({
  inspectorValues: state.inspector.values,
  selectedWorkspace: state.inspector.selectedWorkspace,
});

export default inspectorSlice.reducer;
