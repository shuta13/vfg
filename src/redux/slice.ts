import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = {
  workspaceName: string;
};

export type MediaInputValue = {
  uploadedFileName: string;
};

export type InspectorState = {
  values: InspectorValue[];
  selectedWorkspace: string;
  uploadedFileNames: string[];
};

const initialState: InspectorState = {
  values: [],
  selectedWorkspace: '',
  uploadedFileNames: [],
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
    setUploadedFileNames: (state, action: PayloadAction<MediaInputValue>) => {
      state.uploadedFileNames = [
        ...new Set([
          ...state.uploadedFileNames,
          action.payload.uploadedFileName,
        ]),
      ];
    },
    resetUploadedFileNames: (state) => {
      state.uploadedFileNames = [];
    },
  },
});

export const {
  setWorkspaceName,
  resetWorkspaceNames,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setUploadedFileNames,
  resetUploadedFileNames,
} = inspectorSlice.actions;

export const selectWorkspace = (state: RootState) => ({
  inspectorValues: state.inspector.values,
  selectedWorkspace: state.inspector.selectedWorkspace,
  uploadedFileNames: state.inspector.uploadedFileNames,
});

export default inspectorSlice.reducer;
