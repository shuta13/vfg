import '../assets/styles/global.css';
import React from 'react';
import { Inspector } from './Inspector';
import { MediaUploader } from './MediaUploader';

const App: React.FC = () => {
  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaUploader />
      </div>
    </main>
  );
};

export default App;
