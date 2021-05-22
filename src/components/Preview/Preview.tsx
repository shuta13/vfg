import './Preview.css';
import React, { useEffect } from 'react';
import type { MessageEventTarget } from '../../types';
import { InspectorList } from '../InspectorList';
import {
  deleteInventoryItem,
  selectInspector,
  setSelectedFileNameForPreview,
} from '../../redux/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { wrappedPostMessage } from '../../utils';
import { PluginUI } from '../../config';
import { MessageIndicator } from '../MessageIndicator';

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
          currentInventoryItemLength: inspectorValue.mediaInputItems.length,
        },
      },
      '*'
    );
    dispatch(setSelectedFileNameForPreview({ uploadedFileName: fileName }));
  };

  const handleOnClickDelete = (fileName: string) => {
    dispatch(
      deleteInventoryItem({
        mediaInputItems: [
          {
            workspaceName: inspectorValue.selectedWorkspace,
            uploadedFileName: fileName,
          },
        ],
      })
    );
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
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'remove-preview',
          workspaceName: inspectorValue.selectedWorkspace,
          uploadedFileName: fileName,
        },
      },
      '*'
    );
  };

  return (
    <details open={true}>
      <summary
        className="Preview_summary"
        onClick={() => setIsDetailsOpen((prevState) => !prevState)}
      >
        <strong>Inventory</strong>
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
              <MessageIndicator text="No media" level="info" />
            )}
          </div>
          {inspectorValue.selectedWorkspace ? (
            <MessageIndicator
              text="Select media you want to show in Preview"
              level="info"
            />
          ) : (
            <MessageIndicator
              text="Choose workspace in Workspace Inspector"
              level="info"
            />
          )}
        </>
      )}
    </details>
  );
};
