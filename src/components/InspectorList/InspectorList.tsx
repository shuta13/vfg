import './InspectorList.css';
import React from 'react';

type Props = {
  currentNames: string[];
  selectedName: string;
  workspaceName?: string;
  /* eslint-disable no-unused-vars */
  handleOnClickFocus: (currentName: string) => void;
  handleOnClickDelete: (currentName: string, workspaceName?: string) => void;
  /* eslint-enable no-unused-vars */
};

export const InspectorList: React.FC<Props> = (props) => {
  const {
    currentNames,
    selectedName,
    handleOnClickFocus,
    handleOnClickDelete,
    workspaceName,
  } = props;
  return (
    <ul>
      {currentNames.map((currentName) => (
        <li key={currentName} className="InspectorList_workspace_list">
          <button
            className={
              currentName === selectedName
                ? 'InspectorList_workspace_name--selected'
                : 'InspectorList_workspace_name'
            }
            onClick={() => handleOnClickFocus(currentName)}
          >
            {currentName}
          </button>
          <button
            onClick={() => handleOnClickDelete(currentName, workspaceName)}
            className="InspectorList_workspace_delete"
          >
            ×
          </button>
        </li>
      ))}
    </ul>
  );
};
