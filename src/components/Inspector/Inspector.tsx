import './Inspector.css';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectInspector,
  setWorkspaceName,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setSelectedFileNameForPreview,
  resetMediaInputItems,
  setMediaInputItems,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';
import { noop, wrappedPostMessage } from '../../utils';
import { VFGButton } from '../VFGButton';
import { MessageIndicator } from '../MessageIndicator';

type Workspace = {
  name: string;
};

export const Inspector: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Workspace>();

  const { inspectorValue } = useAppSelector(selectInspector);
  const dispatch = useAppDispatch();

  const [isDuplicated, setIsDuplicated] = useState(false);

  const addWorkspace = (data: Workspace) => {
    if (
      inspectorValue.workspaceNames.some(
        (workspaceName) => workspaceName === data.name
      )
    ) {
      setIsDuplicated(true);
    } else {
      setIsDuplicated(false);
      const workspaceName = data.name;
      wrappedPostMessage(
        {
          pluginMessage: {
            type: 'create-workspace',
            workspaceName,
            uploadedFileNames: [],
          },
        },
        '*'
      );
      dispatch(setWorkspaceName({ workspaceName: data.name }));
      dispatch(setSelectedWorkspace({ workspaceName }));
      dispatch(resetMediaInputItems());
      reset({ name: '' });
    }
  };

  const handleOnClickDelete = (workspaceName: Workspace['name']) => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'remove-workspace',
          workspaceName,
          uploadedFileNames: [],
        },
      },
      '*'
    );
    dispatch(deleteWorkspaceName({ workspaceName }));
    dispatch(setSelectedWorkspace({ workspaceName: '' }));
    dispatch(setSelectedFileNameForPreview({ uploadedFileName: '' }));
    dispatch(setMediaInputItems({ mediaInputItems: [] }));
  };

  const handleOnClickFocus = (
    workspaceName: Workspace['name'],
    selectedFileNameForPreview?: string
  ) => {
    dispatch(
      setSelectedFileNameForPreview({
        uploadedFileName: selectedFileNameForPreview ?? '',
      })
    );
    dispatch(resetMediaInputItems());
    dispatch(setSelectedWorkspace({ workspaceName }));
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'focus-workspace',
          workspaceName,
          uploadedFileNames: [],
        },
      },
      '*'
    );
  };

  const getFormErrorText = () => {
    if (errors.name) {
      return 'Required workspace name';
    }
    if (isDuplicated && !errors.name) {
      return 'This name is duplicated';
    }
    return 'Enter workspace name';
  };

  return (
    <section>
      <header>
        <h1>Workspace Inspector</h1>
      </header>
      <div className="Inspector_workspace_wrap">
        {inspectorValue.workspaceNames.length > 0 ? (
          <InspectorList
            currentNames={inspectorValue.workspaceNames}
            selectedName={inspectorValue.selectedWorkspace}
            handleOnClickFocus={handleOnClickFocus}
            handleOnClickDelete={handleOnClickDelete}
          />
        ) : (
          <span className="Inspector_indication">No workspaces</span>
        )}
      </div>
      <form onSubmit={handleSubmit(addWorkspace)} className="Inspector_form">
        <input
          {...register('name', { required: true })}
          className="Inspector_form_input"
          placeholder="workspace name"
        />
        <VFGButton
          type="submit"
          text="new"
          bgColor="green"
          disabled={false}
          handleOnClick={noop}
        />
      </form>
      <MessageIndicator
        text={getFormErrorText()}
        level={errors.name || isDuplicated ? 'warn' : 'info'}
      />
    </section>
  );
};
