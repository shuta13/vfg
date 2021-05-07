import './Inspector.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectWorkspace,
  setWorkspaceName,
  deleteWorkspaceName,
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

  const inspectorValues = useAppSelector(selectWorkspace);
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
  };

  const handleOnClickFocus = (workspaceName: Workspace['name']) => {
    parent.postMessage(
      {
        pluginMessage: { type: 'focus-workspace', workspaceName },
      },
      '*'
    );
  };

  useEffect(() => {
    onmessage = (event) => {
      event.data.pluginMessage.map((msg: { id: string; name: string }) => {
        dispatch(setWorkspaceName({ workspaceName: msg.name }));
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
                  className="Inspector_workspace_name"
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
          <span>no workspaces</span>
        )}
      </div>
      <form onSubmit={handleSubmit(addWorkspace)} className="Inspector_form">
        <input
          {...register('name', { required: true })}
          className="Inspector_form_input"
        />
        <input type="submit" value="new" className="Inspector_form_submit" />
      </form>
      {errors.name && (
        <p className="Inspector_form_warning">required workspace name</p>
      )}
      {isDuplicated && !errors.name && (
        <p className="Inspector_form_warning">this name is duplicated</p>
      )}
    </section>
  );
};
