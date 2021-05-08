import './Preview.css';
import React from 'react';

export const Preview: React.FC = () => {
  return (
    <section>
      <header>
        <h1>Preview</h1>
      </header>
      <div className="Preview_wrap">
        <p>
          <span className="Preview_indication">
            Select Rectangle you want to show in the preview from MediaInput
          </span>
        </p>
      </div>
    </section>
  );
};
