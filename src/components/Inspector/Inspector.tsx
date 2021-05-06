import './Inspector.css';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectWorkspace,
  setWorkspace,
  deleteWorkspace,
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

  const workspaces = useAppSelector(selectWorkspace);
  const dispatch = useAppDispatch();

  const [isDuplicated, setIsDuplicated] = useState(false);

  const addWorkspace = (data: Workspace) => {
    if (workspaces.some((workspace) => workspace.name === data.name)) {
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
      dispatch(setWorkspace({ name: data.name }));
    }
  };

  const handleOnClickDelete = (workspaceName: Workspace['name']) => {
    parent.postMessage(
      {
        pluginMessage: { type: 'remove-workspace', workspaceName },
      },
      '*'
    );
    dispatch(deleteWorkspace({ name: workspaceName }));
  };

  useEffect(() => {
    onmessage = (event) => {
      event.data.pluginMessage.map((msg: { id: string; name: string }) => {
        dispatch(setWorkspace({ name: msg.name }));
      });
    };
  }, []);

  return (
    <section>
      <header>
        <h2>Workspace Inspector</h2>
      </header>
      <div className="Inspector_workspace_wrap">
        {workspaces.length > 0 ? (
          <ul>
            {workspaces.map((workspace) => (
              <li key={workspace.name} className="Inspector_workspace_li">
                <button className="Inspector_workspace_name">
                  {workspace.name}
                </button>
                <button
                  onClick={() => handleOnClickDelete(workspace.name)}
                  className="Inspector_workspace_delete"
                >
                  x
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
        {errors.name && <p>required workspace name</p>}
        {isDuplicated && !errors.name && <p>this name is duplicated</p>}
      </form>
    </section>
  );
};
