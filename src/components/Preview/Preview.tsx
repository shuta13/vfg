import './Preview.css';
import React from 'react';
import type { MessageEventTarget } from '../../types';
import { InspectorList } from '../InspectorList';
import {
  selectInspector,
  setSelectedFileNameForPreview,
} from '../../redux/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { wrappedPostMessage } from '../../utils';

type Props = {
  mediaInputItems: NonNullable<
    MessageEventTarget['pluginMessage']['mediaInputItems']
  >;
};

export const Preview: React.FC<Props> = (props) => {
  const { mediaInputItems } = props;

  const { inspectorValue } = useAppSelector(selectInspector);
  const dispatch = useAppDispatch();

  const handleOnClickFocus = (fileName: string) => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'update-preview',
          workspaceName: inspectorValue.selectedWorkspace,
          uploadedFileName: fileName,
        },
      },
      '*'
    );
    dispatch(setSelectedFileNameForPreview({ fileName }));
  };

  const handleOnClickDelete = (fileName: string) => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'remove-media-input-item',
          workspaceName: inspectorValue.selectedWorkspace,
          uploadedFileName: fileName,
        },
      },
      '*'
    );
    dispatch(setSelectedFileNameForPreview({ fileName: '' }));
  };

  return (
    <details open>
      <summary className="Preview_summary">
        <strong>Preview</strong>
      </summary>
      <div className="Preview_wrap">
        {mediaInputItems?.length > 0 ? (
          <InspectorList
            currentNames={mediaInputItems.map((item) => item.uploadedFileName)}
            selectedName={inspectorValue.selectedFileNameForPreview}
            handleOnClickFocus={handleOnClickFocus}
            handleOnClickDelete={handleOnClickDelete}
          />
        ) : (
          <p className="Preview_indication">No media</p>
        )}
      </div>
      {inspectorValue.selectedWorkspace ? (
        <p className="Preview_warning">
          Select media you want to show in Preview
        </p>
      ) : (
        <p className="Preview_warning">
          Choose workspace in Workspace Inspector
        </p>
      )}
    </details>
  );
};
