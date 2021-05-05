import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type WorkspaceValue = { name: string };

export type workspaceState = {
  values: WorkspaceValue[];
};

const initialState: workspaceState = {
  values: [],
};

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspace: (state, action: PayloadAction<WorkspaceValue>) => {
      state.values.push({ name: action.payload.name });
    },
    resetWorkspace: (state) => {
      state.values = [];
    },
    deleteWorkspace: (state, action: PayloadAction<WorkspaceValue>) => {
      state.values = state.values.filter(
        (value) => value.name !== action.payload.name
      );
    },
  },
});

export const {
  setWorkspace,
  resetWorkspace,
  deleteWorkspace,
} = workspacesSlice.actions;

export const selectWorkspace = (state: RootState) => state.workspaces.values;

export default workspacesSlice.reducer;
