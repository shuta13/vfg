import './Inspector.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectWorkspace,
  setWorkspaceName,
  deleteWorkspaceName,
  setSelectedWorkspace,
  setUploadedFileNames,
} from '../../redux/slice';

type Workspace = {
  name: string;
};

export const Inspector: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Workspace>();

  const { inspectorValues, selectedWorkspace } = useAppSelector(
    selectWorkspace
  );
  const dispatch = useAppDispatch();

  const [isDuplicated, setIsDuplicated] = useState(false);

  const addWorkspace = (data: Workspace) => {
    if (inspectorValues.some((value) => value.workspaceName === data.name)) {
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
        {inspectorValues.length > 0 ? (
          <ul>
            {inspectorValues.map((value) => (
              <li key={value.workspaceName} className="Inspector_workspace_li">
                <button
                  className={
                    value.workspaceName === selectedWorkspace
                      ? 'Inspector_workspace_name--selected'
                      : 'Inspector_workspace_name'
                  }
                  onClick={() => handleOnClickFocus(value.workspaceName)}
                >
                  {value.workspaceName}
                </button>
                <button
                  onClick={() => handleOnClickDelete(value.workspaceName)}
                  className="Inspector_workspace_delete"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
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
