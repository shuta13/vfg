import './MediaUploader.css';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export const MediaUploader: React.FC = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <section>
      <header>
        <h1>Media</h1>
      </header>
      <div {...getRootProps()} className="MediaUploader_wrap">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="MediaUploader_indication">Drop files here ...</p>
        ) : (
          <p className="MediaUploader_indication">
            Drag and Drop files here, or click to select files (mp4, mov)
          </p>
        )}
      </div>
    </section>
  );
};
