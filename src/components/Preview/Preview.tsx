import './Preview.css';
import React from 'react';

export const Preview: React.FC = () => {
  return (
    <section>
      <header>
        <h1>Preview</h1>
      </header>
      <div className="Preview_wrap">
        <p className="Preview_indication">No media</p>
      </div>
      <p className="Preview_indication">
        Select media you want to show in Preview
      </p>
    </section>
  );
};
