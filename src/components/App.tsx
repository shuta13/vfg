import '../assets/styles/global.css';
import React, { useEffect, useState } from 'react';
import { Inspector } from './Inspector';
import { MediaUploader } from './MediaUploader';
import { Preview } from './Preview';
import type { MessageEventTarget } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  setSelectedWorkspace,
  setWorkspaceName,
  setInventoryItems,
  selectInspector,
  setSelectedFileNameForPreview,
} from '../redux/slice';
import { PluginUI, PluginUIHeader } from '../config';
import { wrappedPostMessage } from '../utils';

// FIXME: help!!!
const getPluginUIHeight = (args: {
  isPreviewOpen: boolean;
  isMediaUploaderOpen: boolean;
}) => {
  const { isPreviewOpen, isMediaUploaderOpen } = args;
  if (!isPreviewOpen && !isMediaUploaderOpen) {
    return PluginUI.height / 3 + PluginUIHeader.height + 16;
  }

  if (!isPreviewOpen) {
    return PluginUI.height - (PluginUI.height / 3 - 96);
  }

  if (!isMediaUploaderOpen) {
    return PluginUI.height - (PluginUI.height / 3 + 40);
  }

  return PluginUI.height;
};

const App: React.FC = () => {
  const { inspectorValue } = useAppSelector(selectInspector);

  const dispatch = useAppDispatch();

  const [isMediaUploaderOpen, setIsMediaUploaderOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [onProcess, setOnProcess] = useState(false);
  const [mediaData, setMediaData] = useState<
    MessageEventTarget['pluginMessage']['uploadedMediaData']
  >([]);

  useEffect(() => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'resize-plugin-ui',
          pluginUISize: {
            width: PluginUI.width,
            height: getPluginUIHeight({ isPreviewOpen, isMediaUploaderOpen }),
          },
        },
      },
      '*'
    );
  }, [isMediaUploaderOpen, isPreviewOpen]);

  useEffect(() => {
    if (mediaData.length > 0 && inspectorValue.selectedWorkspace !== '') {
      wrappedPostMessage(
        {
          pluginMessage: {
            type: 'create-media-input',
            workspaceName: inspectorValue.selectedWorkspace,
            uploadedMediaData: mediaData,
          },
        },
        '*'
      );
    }
  }, [mediaData, inspectorValue.selectedWorkspace]);

  useEffect(() => {
    onmessage = (event: MessageEvent<MessageEventTarget>) => {
      const {
        workspaceNames,
        selectionNames,
        mediaInputItems,
        selectedFileNameForPreview,
        uploadedMediaData,
      } = event.data.pluginMessage;
      // initialize
      workspaceNames?.forEach((workspaceName) => {
        dispatch(setWorkspaceName({ workspaceName }));
      });
      selectionNames?.forEach((selectionName) => {
        dispatch(setSelectedWorkspace({ workspaceName: selectionName }));
      });
      if (mediaInputItems) {
        dispatch(setInventoryItems({ mediaInputItems }));
        setOnProcess(false);
      }
      selectedFileNameForPreview &&
        dispatch(
          setSelectedFileNameForPreview({
            uploadedFileName: selectedFileNameForPreview,
          })
        );
      uploadedMediaData && setMediaData(uploadedMediaData);
    };
  }, [dispatch]);

  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader
          isDetailsOpen={isMediaUploaderOpen}
          onProcess={onProcess}
          setIsDetailsOpen={setIsMediaUploaderOpen}
          setOnProcess={setOnProcess}
          setMediaData={setMediaData}
        />
        <Preview
          mediaInputItems={inspectorValue.mediaInputItems}
          isDetailsOpen={isPreviewOpen}
          setIsDetailsOpen={setIsPreviewOpen}
        />
      </div>
    </main>
  );
};

export default App;
