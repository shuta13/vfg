import '../assets/styles/global.css';
import React from 'react';
import { Inspector } from './Inspector';
// import logo from '../assets/images/logo.svg';
// import { DefaultCount } from '../config';

const App: React.FC = () => {
  // const countRef = useRef<HTMLInputElement | null>(null);

  // const onCreate = () => {
  //   const count = parseInt(countRef.current?.value ?? `${DefaultCount}`, 10);
  //   parent.postMessage(
  //     { pluginMessage: { type: 'create-rectangles', count } },
  //     '*'
  //   );
  // };

  // const onCancel = () => {
  //   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  // };

  return (
    <main>
      <div className="container">
        <Inspector />
      </div>
      {/* <img src={logo} />
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input ref={countRef} defaultValue={DefaultCount} />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button> */}
    </main>
  );
};

export default App;
