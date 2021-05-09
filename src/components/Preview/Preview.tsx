import './Preview.css';
import React from 'react';

export const Preview: React.FC = () => {
  return (
    <details open>
      <summary className="Preview_summary">
        <strong>Preview</strong>
      </summary>
      <div className="Preview_wrap">
        <p className="Preview_indication">No media</p>
      </div>
      <p className="Preview_warning">
        Select media you want to show in Preview
      </p>
    </details>
  );
};
