import './MediaUploader.css';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../../redux/hooks';
import { selectWorkspace, setUploadedFileNames } from '../../redux/slice';

export const MediaUploader: React.FC = () => {
  const {
    inspectorValues,
    selectedWorkspace,
    uploadedFileNames,
  } = useAppSelector(selectWorkspace);

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

  const dispatch = useDispatch();

  useEffect(() => {
    if (acceptedFiles.length > 0)
      dispatch(
        setUploadedFileNames({
          uploadedFileNames: acceptedFiles.map((file) => file.name),
        })
      );
  }, [acceptedFiles]);

  const handleOnClickDelete = (fileName: string) => {
    dispatch(
      setUploadedFileNames({
        uploadedFileNames: acceptedFiles
          .filter((file) => file.name !== fileName)
          .map((file) => file.name),
      })
    );
  };

  const handleOnClickUpload = () => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'create-media-input',
          workspaceName: selectedWorkspace,
          uploadedFileNames: uploadedFileNames,
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
      {uploadedFileNames.length > 0 ? (
        <ul>
          <div className="MediaUploader_uploaded_wrap_list">
            {uploadedFileNames.map((fileName) => (
              <li className="MediaUploader_uploaded_list" key={fileName}>
                <span>{fileName}</span>
                <button
                  className="MediaUploader_uploaded_delete"
                  onClick={() => handleOnClickDelete(fileName)}
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
          !(uploadedFileNames.length > 0)
            ? 'MediaUploader_upload--disabled'
            : 'MediaUploader_upload'
        }
        disabled={!(uploadedFileNames.length > 0)}
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
