import './Preview.css';
import React, { useEffect } from 'react';
import type { MessageEventTarget } from '../../types';
import { InspectorList } from '../InspectorList';
import {
  selectInspector,
  setSelectedFileNameForPreview,
} from '../../redux/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { wrappedPostMessage } from '../../utils';
import { PluginUI } from '../../config';

type Props = {
  mediaInputItems: NonNullable<
    MessageEventTarget['pluginMessage']['mediaInputItems']
  >;
  isDetailsOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsDetailsOpen: (value: React.SetStateAction<boolean>) => void;
};

export const Preview: React.FC<Props> = (props) => {
  const { mediaInputItems, isDetailsOpen, setIsDetailsOpen } = props;

  const { inspectorValue } = useAppSelector(selectInspector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'resize-plugin-ui',
          pluginUISize: {
            width: PluginUI.width,
            height: isDetailsOpen ? PluginUI.height : PluginUI.height - 160,
          },
        },
      },
      '*'
    );
  }, [isDetailsOpen]);

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
    <details open={true}>
      <summary
        className="Preview_summary"
        onClick={() => setIsDetailsOpen((prevState) => !prevState)}
      >
        <strong>Preview Input</strong>
      </summary>
      {isDetailsOpen && (
        <>
          <div className="Preview_wrap">
            {mediaInputItems?.length > 0 ? (
              <InspectorList
                currentNames={mediaInputItems.map(
                  (item) => item.uploadedFileName
                )}
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
        </>
      )}
    </details>
  );
};
