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
        return [{ name: data.name }, ...prevState];
      }
    });
  };

  const handleOnClickDelete = (workspaceName: Workspace['name']) => {
    setWorkspaces((prevState) =>
      prevState.filter((workspace) => workspace.name !== workspaceName)
    );
  };

  const handleOnFormInput = () => {
    // NOTE: reset duplicated error message
    setIsDuplicated(false);
  };

  return (
    <section>
      <header>
        <h2>Inspector</h2>
      </header>
      <div>
        {workspaces ? (
          <ul>
            {workspaces.map((workspace) => (
              <li key={workspace.name}>
                <span>
                  {workspace.name}
                  <button onClick={() => handleOnClickDelete(workspace.name)}>
                    x
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>no workspaces.</>
        )}
      </div>
      <form onSubmit={handleSubmit(addWorkspace)}>
        <input
          {...register('name', { required: true })}
          onChange={handleOnFormInput}
        />
        <input type="submit" value="new" />
        {errors.name && <p>required workspace name</p>}
        {isDuplicated && <p>this name is duplicated</p>}
      </form>
    </section>
  );
};
