import '../assets/styles/global.css';
import React from 'react';
import { Inspector } from './Inspector';
import { MediaUploader } from './MediaUploader';
import { Preview } from './Preview';

const App: React.FC = () => {
  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader />
        <Preview />
      </div>
    </main>
  );
};

export default App;
