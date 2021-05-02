import React from 'react';
// import logo from '../assets/images/logo.svg';
import '../assets/styles/global.css';
// import { DefaultCount } from '../config';
import { Controller } from './Controller';
import { Output } from './Output';
import { Uploader } from './Uploader';

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
      <Output />
      <Uploader />
      <Uploader />
      <Controller />
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
