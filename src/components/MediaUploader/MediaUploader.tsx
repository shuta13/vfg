import './MediaUploader.css';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectInspector,
  setSelectedFileNameForPreview,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';
import { noop } from '../../utils';
import { VFGButton } from '../VFGButton';
import { MessageIndicator } from '../MessageIndicator';
import { mediaConverter } from '../../utils/media-converter';
import { MessageEventTarget } from '../../types';

type Props = {
  isDetailsOpen: boolean;
  onProcess: boolean;
  /* eslint-disable no-unused-vars */
  setIsDetailsOpen: (value: React.SetStateAction<boolean>) => void;
  setOnProcess: (value: React.SetStateAction<boolean>) => void;
  setMediaData: (
    value: React.SetStateAction<
      MessageEventTarget['pluginMessage']['uploadedMediaData']
    >
  ) => void;
  /* eslint-enable no-unused-vars */
};

export const MediaUploader: React.FC<Props> = (props) => {
  const {
    isDetailsOpen,
    onProcess,
    setIsDetailsOpen,
    setOnProcess,
    setMediaData,
  } = props;
  const { inspectorValue } = useAppSelector(selectInspector);

  const dispatch = useAppDispatch();

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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

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
          setUploadedFiles((prevState) => [...prevState, acceptedFile]);
          setHasDuplicatedFileName(false);
        }
      });
    }
  }, [acceptedFiles]);

  const handleOnClickDelete = (fileName: string) => {
    setUploadedFileNames((prevState) =>
      prevState.filter((p) => p !== fileName)
    );
  };

  const handleOnClickUpload = async () => {
    setOnProcess(true);
    const uploadedMediaData = await mediaConverter(uploadedFiles);
    setMediaData(uploadedMediaData);
    setUploadedFileNames([]);
    setUploadedFiles([]);
    dispatch(setSelectedFileNameForPreview({ uploadedFileName: '' }));
    setHasDuplicatedFileName(false);
  };

  const getInputFilesErrorText = () => {
    if (hasDuplicatedFileName) {
      return 'Uploaded files have duplicated';
    }

    if (!(inspectorValue.workspaceNames.length > 0)) {
      return 'Create workspaces and select files';
    }

    if (inspectorValue.selectedWorkspace === '') {
      return 'Choose workspace in Workspace Inspector';
    }

    return 'Select files, or upload';
  };

  const renderDropArea = () => {
    if (inspectorValue.workspaceNames.length > 0 && !onProcess) {
      return (
        <div {...getRootProps()} className="MediaUploader_wrap">
          <input {...getInputProps()} />
          {isDragActive ? (
            <MessageIndicator text="Drop files here ..." level="info" />
          ) : (
            <>
              <MessageIndicator
                text="Drag and Drop selected files here"
                level="info"
              />
              <MessageIndicator
                text="Or click to select files (mp4, mov)"
                level="info"
              />
            </>
          )}
        </div>
      );
    } else if (onProcess) {
      return (
        <div className="MediaUploader_wrap">
          <MessageIndicator text="Uploading..." level="info" />
        </div>
      );
    }
    return (
      <div className="MediaUploader_wrap">
        <MessageIndicator
          text="Unable to upload media, create workspaces"
          level="warn"
        />
      </div>
    );
  };

  return (
    <details open={true}>
      <summary
        className="MediaUploader_summary"
        onClick={() => setIsDetailsOpen((prevState) => !prevState)}
      >
        <strong>Media</strong>
      </summary>
      {isDetailsOpen && (
        <>
          {renderDropArea()}
          <div
            className={
              onProcess
                ? 'MediaUploader_uploaded_wrap_list--uploading'
                : 'MediaUploader_uploaded_wrap_list'
            }
          >
            {uploadedFileNames.length > 0 ? (
              <InspectorList
                currentNames={uploadedFileNames}
                selectedName={'all'}
                handleOnClickFocus={noop}
                handleOnClickDelete={handleOnClickDelete}
                workspaceName={inspectorValue.selectedWorkspace}
              />
            ) : (
              <MessageIndicator text="No files selected" level="info" />
            )}
          </div>
          <VFGButton
            type="normal"
            disabled={
              !(uploadedFileNames.length > 0) ||
              inspectorValue.selectedWorkspace === '' ||
              onProcess
            }
            handleOnClick={handleOnClickUpload}
            text="upload"
            bgColor="blue"
          />
          {fileRejections.length > 0 ? (
            fileRejections.map((rejection, index) =>
              rejection.errors.map((error) => (
                <MessageIndicator
                  text={error.message}
                  level="warn"
                  key={index}
                />
              ))
            )
          ) : (
            <MessageIndicator
              text={getInputFilesErrorText()}
              level={hasDuplicatedFileName ? 'warn' : 'info'}
            />
          )}
        </>
      )}
    </details>
  );
};
