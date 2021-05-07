import '../assets/styles/global.css';
import React from 'react';
import { Inspector } from './Inspector';
import { MediaInput } from './MediaInput';

const App: React.FC = () => {
  return (
    <main>
      <div className="container">
        <Inspector />
        <MediaInput />
      </div>
    </main>
  );
};

export default App;
