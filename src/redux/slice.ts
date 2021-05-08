import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

export type InspectorValue = {
  workspaceNames: string[];
  uploadedFileNames: string[];
};

export type WorkspacePayload = {
  workspaceName: InspectorValue['workspaceNames'][number];
};

export type MediaInputPayload = {
  uploadedFileName: InspectorValue['uploadedFileNames'][number];
};

export type InspectorState = {
  value: InspectorValue;
  selectedWorkspace: string;
  selectedFileName: string;
};

const initialState: InspectorState = {
  value: { workspaceNames: [], uploadedFileNames: [] },
  selectedWorkspace: '',
  selectedFileName: '',
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
      state.selectedWorkspace = action.payload.workspaceName;
    },
    setUploadedFileNames: (state, action: PayloadAction<MediaInputPayload>) => {
      state.value.uploadedFileNames = [
        ...new Set([
          ...state.value.uploadedFileNames,
          action.payload.uploadedFileName,
        ]),
      ];
    },
    resetUploadedFileNames: (state) => {
      state.value.uploadedFileNames = [];
    },
    deleteUploadedFileName: (
      state,
      action: PayloadAction<MediaInputPayload>
    ) => {
      state.value.uploadedFileNames = state.value.uploadedFileNames.filter(
        (fileName) => fileName !== action.payload.uploadedFileName
      );
    },
    setSelectedFileName: (state, action: PayloadAction<MediaInputPayload>) => {
      state.selectedFileName = action.payload.uploadedFileName;
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
  deleteUploadedFileName,
  setSelectedFileName,
} = inspectorSlice.actions;

export const selectInspector = (state: RootState) => ({
  inspectorValue: state.inspector.value,
  selectedWorkspace: state.inspector.selectedWorkspace,
  selectedFileName: state.inspector.selectedFileName,
});

export default inspectorSlice.reducer;
