import './Inspector.css';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Workspace = {
  name: string;
};

export const Inspector: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Workspace>();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isDuplicated, setIsDuplicated] = useState(false);

  const addWorkspace = (data: Workspace) => {
    setWorkspaces((prevState) => {
      if (prevState.some((workspace) => workspace.name === data.name)) {
        setIsDuplicated(true);
        return prevState;
      } else {
        setIsDuplicated(false);
        const workspaceName = data.name;
        parent.postMessage(
          {
            pluginMessage: { type: 'create-workspace', workspaceName },
          },
          '*'
        );
        return [{ name: workspaceName }, ...prevState];
      }
    });
  };

  const handleOnClickDelete = (workspaceName: Workspace['name']) => {
    setWorkspaces((prevState) =>
      prevState.filter((workspace) => workspace.name !== workspaceName)
    );
  };

  return (
    <section>
      <header>
        <h2>Inspector</h2>
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
