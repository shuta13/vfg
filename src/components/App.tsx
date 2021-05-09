import '../assets/styles/global.css';
import React, { useEffect, useState } from 'react';
import { Inspector } from './Inspector';
import { MediaUploader } from './MediaUploader';
import { Preview } from './Preview';
import type { MessageEventTarget } from '../types';
import { useAppDispatch } from '../redux/hooks';
import { setSelectedWorkspace, setWorkspaceName } from '../redux/slice';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const [mediaInputItems, setMediaInputItems] = useState<
    NonNullable<MessageEventTarget['pluginMessage']['mediaInputItems']>
  >([]);

  useEffect(() => {
    // initialize
    onmessage = (event: MessageEvent<MessageEventTarget>) => {
      const {
        workspaceNames,
        selectionNames,
        mediaInputItems,
      } = event.data.pluginMessage;
      workspaceNames?.map((workspaceName) => {
        dispatch(setWorkspaceName({ workspaceName }));
      });
      selectionNames?.map((selectionName) =>
        dispatch(setSelectedWorkspace({ workspaceName: selectionName }))
      );
      mediaInputItems && setMediaInputItems(mediaInputItems);
    };
  }, []);

  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader />
        <Preview mediaInputItems={mediaInputItems} />
      </div>
    </main>
  );
};

export default App;
