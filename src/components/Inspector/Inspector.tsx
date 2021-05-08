import './Inspector.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectInspector,
  setWorkspaceName,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setUploadedFileNames,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';

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
      parent.postMessage(
        {
          pluginMessage: { type: 'create-workspace', workspaceName },
        },
        '*'
      );
      dispatch(setWorkspaceName({ workspaceName: data.name }));
      dispatch(setSelectedWorkspace({ workspaceName }));
    }
  };

  const handleOnClickDelete = (workspaceName: Workspace['name']) => {
    parent.postMessage(
      {
        pluginMessage: { type: 'remove-workspace', workspaceName },
      },
      '*'
    );
    dispatch(deleteWorkspaceName({ workspaceName }));
    dispatch(setSelectedWorkspace({ workspaceName: '' }));
  };

  const handleOnClickFocus = (workspaceName: Workspace['name']) => {
    parent.postMessage(
      {
        pluginMessage: { type: 'focus-workspace', workspaceName },
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
    onmessage = (event) => {
      const {
        workspaceNames,
        selectionNames,
        mediaInputNames,
      } = event.data.pluginMessage;
      workspaceNames.map((msg: { name: string }) => {
        dispatch(setWorkspaceName({ workspaceName: msg.name }));
      });
      selectionNames.map((selectionName: string) =>
        dispatch(setSelectedWorkspace({ workspaceName: selectionName }))
      );
      mediaInputNames.forEach((mediaInputName: string) => {
        dispatch(setUploadedFileNames({ uploadedFileName: mediaInputName }));
      });
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
        <input type="submit" value="new" className="Inspector_form_submit" />
      </form>
      <p className="Inspector_form_warning">{renderFormError()}</p>
    </section>
  );
};
