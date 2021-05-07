import './MediaUploader.css';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../../redux/hooks';
import { selectWorkspace } from '../../redux/slice';

export const MediaUploader: React.FC = () => {
  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const inspectorValues = useAppSelector(selectWorkspace);

  return (
    <section>
      <header>
        <h1>Media</h1>
      </header>
      {inspectorValues.length > 0 ? (
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
      ) : (
        <div className="MediaUploader_wrap">
          <p className="MediaUploader_indication">
            Unable to upload media, create workspaces
          </p>
        </div>
      )}
      <button className="MediaUploader_upload">upload</button>
    </section>
  );
};
