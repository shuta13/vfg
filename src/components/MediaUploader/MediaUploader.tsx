import './MediaUploader.css';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../../redux/hooks';
import {
  deleteUploadedFileName,
  selectInspector,
  setUploadedFileNames,
  setSelectedFileName,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';

export const MediaUploader: React.FC = () => {
  const {
    inspectorValues,
    selectedWorkspace,
    uploadedFileNames,
    selectedFileName,
  } = useAppSelector(selectInspector);

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

  const [hasDuplicatedFileName, setHasDuplicatedFileName] = useState(false);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((acceptedFile) => {
        if (uploadedFileNames.includes(acceptedFile.name)) {
          setHasDuplicatedFileName(true);
        } else {
          dispatch(
            setUploadedFileNames({
              uploadedFileName: acceptedFile.name,
            })
          );
          setHasDuplicatedFileName(false);
        }
      });
    }
  }, [acceptedFiles]);

  const handleOnClickFocus = (fileName: string) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'focus-media-input',
          uploadedFileName: fileName,
        },
      },
      '*'
    );
    dispatch(setSelectedFileName({ uploadedFileName: fileName }));
  };

  const handleOnClickDelete = (fileName: string) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: 'remove-media-input',
          uploadedFileName: fileName,
        },
      },
      '*'
    );
    dispatch(deleteUploadedFileName({ uploadedFileName: fileName }));
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
      <div className="MediaUploader_uploaded_wrap_list">
        {uploadedFileNames.length > 0 ? (
          <InspectorList
            currentNames={uploadedFileNames}
            selectedName={selectedFileName}
            handleOnClickFocus={handleOnClickFocus}
            handleOnClickDelete={handleOnClickDelete}
          />
        ) : (
          <p className="MediaUploader_indication">No media</p>
        )}
      </div>
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
      {hasDuplicatedFileName && (
        <p className="MediaUploader_warning">
          Uploaded files have duplicated ones
        </p>
      )}
    </section>
  );
};
