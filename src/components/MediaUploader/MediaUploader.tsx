import './MediaUploader.css';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppSelector } from '../../redux/hooks';
import { selectInspector } from '../../redux/slice';
import { InspectorList } from '../InspectorList';
import { noop, wrappedPostMessage } from '../../utils';
import { VFGButton } from '../VFGButton';

export const MediaUploader: React.FC = () => {
  const { inspectorValue } = useAppSelector(selectInspector);

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

  const [hasDuplicatedFileName, setHasDuplicatedFileName] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      acceptedFiles.forEach((acceptedFile) => {
        if (uploadedFileNames.includes(acceptedFile.name)) {
          setHasDuplicatedFileName(true);
        } else {
          setUploadedFileNames((prevState) => [
            ...prevState,
            acceptedFile.name,
          ]);
          setHasDuplicatedFileName(false);
        }
      });
    }
  }, [acceptedFiles]);

  const handleOnClickDelete = (fileName: string) => {
    setUploadedFileNames((prevState) =>
      prevState.filter((p) => p !== fileName)
    );
    // parent.wrappedPostMessage(
    //   {
    //     pluginMessage: {
    //       type: 'remove-media-input',
    //       workspaceName: workspaceName ?? '',
    //       uploadedFileName: fileName,
    //     },
    //   },
    //   '*'
    // );
    // workspaceName &&
    // dispatch(deleteUploadedFileName({ uploadedFileName: fileName }));
  };

  const handleOnClickUpload = () => {
    wrappedPostMessage(
      {
        pluginMessage: {
          type: 'create-media-input',
          workspaceName: inspectorValue.selectedWorkspace,
          uploadedFileNames: uploadedFileNames,
        },
      },
      '*'
    );
    setUploadedFileNames([]);
  };

  const renderInputFilesError = () => {
    if (hasDuplicatedFileName) {
      return (
        <p className="MediaUploader_warning">Uploaded files have duplicated</p>
      );
    }

    if (!(inspectorValue.workspaceNames.length > 0)) {
      return (
        <p className="MediaUploader_warning">
          Create a workspace and select files
        </p>
      );
    }

    if (inspectorValue.selectedWorkspace === '') {
      return (
        <p className="MediaUploader_warning">
          Choose workspace in Workspace Inspector
        </p>
      );
    }

    return <p className="MediaUploader_warning">Select files</p>;
  };

  return (
    <details open>
      <summary className="MediaUploader_summary">
        <strong>Media</strong>
      </summary>
      {inspectorValue.workspaceNames.length > 0 ? (
        <div {...getRootProps()} className="MediaUploader_wrap">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="MediaUploader_indication">Drop files here ...</p>
          ) : (
            <>
              <p className="MediaUploader_indication">
                Drag and Drop selected files here
              </p>
              <p className="MediaUploader_indication">
                Or click to select files (mp4, mov)
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="MediaUploader_wrap">
          <p className="MediaUploader_indication">
            Unable to upload media, create workspaces
          </p>
        </div>
      )}
      <div className="MediaUploader_uploaded_wrap_list">
        {uploadedFileNames.length > 0 ? (
          <InspectorList
            currentNames={uploadedFileNames}
            selectedName={''}
            handleOnClickFocus={noop}
            handleOnClickDelete={handleOnClickDelete}
            workspaceName={inspectorValue.selectedWorkspace}
          />
        ) : (
          <p className="MediaUploader_indication">No file selected</p>
        )}
      </div>
      <VFGButton
        type="normal"
        disabled={
          !(uploadedFileNames.length > 0) ||
          inspectorValue.selectedWorkspace === ''
        }
        handleOnClick={handleOnClickUpload}
        text="upload"
        bgColor="blue"
      />
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
      {renderInputFilesError()}
    </details>
  );
};
