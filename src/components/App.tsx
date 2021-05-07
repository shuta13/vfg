import '../assets/styles/global.css';
import React from 'react';
import { Inspector } from './Inspector';

const App: React.FC = () => {
  return (
    <main>
      <div className="container">
        <Inspector />
      </div>
    </main>
  );
};

export default App;
