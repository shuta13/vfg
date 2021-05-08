import './Inspector.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectInspector,
  setWorkspaceName,
  deleteWorkspaceName,
  setSelectedWorkspace,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';
import { MessageEventTarget } from '../../types';
import { noop, wrappedPostMessage } from '../../utils';
import { VFGButton } from '../VFGButton';

type Workspace = {
  name: string;
};

export const Inspector: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
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
  };

  const handleOnClickFocus = (workspaceName: Workspace['name']) => {
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
    dispatch(setSelectedWorkspace({ workspaceName }));
  };

  const renderFormError = () => {
    if (errors.name) {
      return <>Required workspace name</>;
    }
    if (isDuplicated && !errors.name) {
      return <>This name is duplicated</>;
    }
    return <>Enter workspace name</>;
  };

  useEffect(() => {
    // initialize
    onmessage = (event: MessageEvent<MessageEventTarget>) => {
      const {
        workspaceNames,
        selectionNames,
        mediaInputData,
      } = event.data.pluginMessage;
      workspaceNames?.map((workspaceName) => {
        dispatch(setWorkspaceName({ workspaceName }));
      });
      selectionNames?.map((selectionName) =>
        dispatch(setSelectedWorkspace({ workspaceName: selectionName }))
      );
      console.log(mediaInputData);
    };
  }, []);

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
          <span>No workspaces</span>
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
      <p className="Inspector_form_warning">{renderFormError()}</p>
    </section>
  );
};
