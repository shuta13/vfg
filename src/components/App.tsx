import React, { useRef } from 'react';
import logo from '../assets/images/logo.svg';
import '../assets/styles/ui.css';

const App: React.FC = () => {
  const countRef = useRef<HTMLInputElement | null>(null);

  const onCreate = () => {
    const count = parseInt(countRef.current?.value ?? '', 10);
    parent.postMessage(
      { pluginMessage: { type: 'create-rectangles', count } },
      '*'
    );
  };

  const onCancel = () => {
    parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  };

  return (
    <section>
      <img src={logo} />
      <h2>Rectangle Creator</h2>
      <p>
        Count: <input ref={countRef} defaultValue={5} />
      </p>
      <button id="create" onClick={onCreate}>
        Create
      </button>
      <button onClick={onCancel}>Cancel</button>
    </section>
  );
};

export default App;
