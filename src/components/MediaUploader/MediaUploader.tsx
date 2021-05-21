import './MediaUploader.css';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectInspector,
  setSelectedFileNameForPreview,
} from '../../redux/slice';
import { InspectorList } from '../InspectorList';
import { noop, wrappedPostMessage } from '../../utils';
import { VFGButton } from '../VFGButton';
import { MessageIndicator } from '../MessageIndicator';
import { mediaConverter } from '../../utils/media-converter';

type Props = {
  isDetailsOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsDetailsOpen: (value: React.SetStateAction<boolean>) => void;
};

export const MediaUploader: React.FC<Props> = (props) => {
  const { isDetailsOpen, setIsDetailsOpen } = props;
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
  const [isUploading, setIsUploading] = useState(false);

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
    // console.log('::Start uploaded video encoding::');
    setIsUploading(true);
    const fileUrls = await mediaConverter(uploadedFiles);
    console.log(fileUrls);
    setIsUploading(false);
    // console.log('::End uploaded video encoding::');
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
    if (inspectorValue.workspaceNames.length > 0 && !isUploading) {
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
    } else if (isUploading) {
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
              isUploading
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
              isUploading
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
