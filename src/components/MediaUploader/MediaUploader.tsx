import './MediaUploader.css';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../../redux/hooks';
import { selectWorkspace } from '../../redux/slice';

export const MediaUploader: React.FC = () => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    acceptedFiles,
  } = useDropzone({
    validator: (file) => {
      const allowedFileType = /(\.mp4|\.mov)$/i;
      if (!allowedFileType.test(file.name)) {
        return {
          message: 'Upload .mp4 or .mov file',
          code: 'file-invalid-type',
        };
      }
      return null;
    },
  });
  const { inspectorValues, selectedWorkspace } = useAppSelector(
    selectWorkspace
  );

  const [uploadedFiles, setUploadFiles] = useState<File[]>([]);

  useEffect(() => {
    if (acceptedFiles.length > 0)
      setUploadFiles((prevState) => [...acceptedFiles, ...prevState]);
  }, [acceptedFiles]);

  const handleOnClickDelete = (fileName: string) => {
    setUploadFiles((prevState) =>
      prevState.filter((state) => state.name !== fileName)
    );
  };

  const handleOnClickUpload = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-media-input',
          workspaceName: selectedWorkspace,
          uploadedFileNames: uploadedFiles.map((file) => file.name),
        },
      },
      '*'
    );
  };

  return (
    <section>
      <header>
        <h1>Media</h1>
      </header>
      {inspectorValues.length > 0 ? (
        <div {...getRootProps()} className="MediaUploader_wrap">
          <input {...getInputProps()} />
          {isDragActive ? (
            <strong className="MediaUploader_indication">
              Drop files here ...
            </strong>
          ) : (
            <>
              <p>
                <strong className="MediaUploader_indication">
                  Drag and Drop files here
                </strong>
              </p>
              <p>
                <strong className="MediaUploader_indication">
                  Or click to select files (mp4, mov)
                </strong>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="MediaUploader_wrap">
          <strong className="MediaUploader_indication">
            Unable to upload media, create workspaces
          </strong>
        </div>
      )}
      <h2>Inbox</h2>
      {uploadedFiles.length > 0 ? (
        <ul>
          <div className="MediaUploader_uploaded_wrap_list">
            {uploadedFiles.map((file) => (
              <li className="MediaUploader_uploaded_list" key={file.size}>
                <span>{file.name}</span>
                <button
                  className="MediaUploader_uploaded_delete"
                  onClick={() => handleOnClickDelete(file.name)}
                >
                  ×
                </button>
              </li>
            ))}
          </div>
        </ul>
      ) : (
        <div className="MediaUploader_uploaded_wrap_list">
          <p className="MediaUploader_indication">No media</p>
        </div>
      )}
      <button
        className={
          !(uploadedFiles.length > 0)
            ? 'MediaUploader_upload--disabled'
            : 'MediaUploader_upload'
        }
        disabled={!(uploadedFiles.length > 0)}
        onClick={handleOnClickUpload}
      >
        upload
      </button>
      {fileRejections.length > 0 &&
        fileRejections.map((rejection, index) => (
          <p className="MediaUploader_warning" key={index}>
            {rejection.errors.map((error) => (
              <React.Fragment key={error.message}>
                {error.message}
              </React.Fragment>
            ))}
          </p>
        ))}
    </section>
  );
};
