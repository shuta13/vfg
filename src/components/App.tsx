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
  setMediaInputItems,
  selectInspector,
  setSelectedFileNameForPreview,
} from '../redux/slice';
import { PluginUI, PluginUIHeader } from '../config';
import { wrappedPostMessage } from '../utils';

const App: React.FC = () => {
  const { inspectorValue } = useAppSelector(selectInspector);

  const dispatch = useAppDispatch();

  const [isMediaUploaderOpen, setIsMediaUploaderOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);

  // FIXME: help!!!
  const getPluginUIHeight = () => {
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

  useEffect(() => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'resize-plugin-ui',
          pluginUISize: {
            width: PluginUI.width,
            height: getPluginUIHeight(),
          },
        },
      },
      '*'
    );
  }, [isMediaUploaderOpen, isPreviewOpen]);

  useEffect(() => {
    // initialize
    onmessage = (event: MessageEvent<MessageEventTarget>) => {
      const {
        workspaceNames,
        selectionNames,
        mediaInputItems,
        selectedFileNameForPreview,
      } = event.data.pluginMessage;
      workspaceNames?.forEach((workspaceName) => {
        dispatch(setWorkspaceName({ workspaceName }));
      });
      selectionNames?.forEach((selectionName) => {
        dispatch(setSelectedWorkspace({ workspaceName: selectionName }));
      });
      mediaInputItems && dispatch(setMediaInputItems({ mediaInputItems }));
      selectedFileNameForPreview &&
        dispatch(
          setSelectedFileNameForPreview({
            uploadedFileName: selectedFileNameForPreview,
          })
        );
    };
  }, []);

  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader
          isDetailsOpen={isMediaUploaderOpen}
          setIsDetailsOpen={setIsMediaUploaderOpen}
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
