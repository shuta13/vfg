import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = { workspaceName: string };

export type InspectorState = {
  values: InspectorValue[];
};

const initialState: InspectorState = {
  values: [],
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
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
} = inspectorSlice.actions;

export const selectWorkspace = (state: RootState) => state.inspector.values;

export default inspectorSlice.reducer;
