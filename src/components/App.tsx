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
import { mediaProcesser } from '../utils/media-converter';
import { PromiseType } from '../types/util-types';

const App: React.FC = () => {
  const { inspectorValue } = useAppSelector(selectInspector);

  const dispatch = useAppDispatch();

  const [isMediaUploaderOpen, setIsMediaUploaderOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [onProcess, setOnProcess] = useState(false);
  const [processedMediaData, setProcessedMediaData] = useState<
    PromiseType<ReturnType<typeof mediaProcesser>>[]
  >([]);

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
    if (
      processedMediaData.length > 0 &&
      inspectorValue.selectedWorkspace !== ''
    ) {
      wrappedPostMessage(
        {
          pluginMessage: {
            type: 'create-media-input',
            workspaceName: inspectorValue.selectedWorkspace,
            uploadedMediaData: processedMediaData,
          },
        },
        '*'
      );
    }
    setOnProcess(false);
  }, [processedMediaData, inspectorValue.selectedWorkspace]);

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
      mediaInputItems && dispatch(setMediaInputItems({ mediaInputItems }));
      selectedFileNameForPreview &&
        dispatch(
          setSelectedFileNameForPreview({
            uploadedFileName: selectedFileNameForPreview,
          })
        );
      // process (decode, encode) gif
      if (uploadedMediaData) {
        (async () => {
          const mediaData = await Promise.all(
            uploadedMediaData.map((data) => mediaProcesser(data))
          );
          setProcessedMediaData(mediaData);
        })();
      }
    };
  }, []);

  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader
          isDetailsOpen={isMediaUploaderOpen}
          onProcess={onProcess}
          setIsDetailsOpen={setIsMediaUploaderOpen}
          setOnProcess={setOnProcess}
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
