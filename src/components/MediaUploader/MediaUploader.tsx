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
  const [gifUrl, setGifUrl] = useState<string[]>([]);

  const getUploadedFileData = async (files: File[]) => {
    console.log('::Start uploaded video encoding::');
    const fileUrls = await mediaConverter(files);
    setGifUrl(fileUrls);
    console.log('::End uploaded video encoding::');
  };

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
  };

  const handleOnClickUpload = async () => {
    // const selectedFiles = acceptedFiles.filter(
    //   (acceptedFile) => !uploadedFileNames.includes(acceptedFile.name)
    // );
    getUploadedFileData(acceptedFiles);
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
          {inspectorValue.workspaceNames.length > 0 ? (
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
          ) : (
            <div className="MediaUploader_wrap">
              <MessageIndicator
                text="Unable to upload media, create workspaces"
                level="warn"
              />
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
              <MessageIndicator text="No files selected" level="info" />
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
          {gifUrl.length > 0 &&
            gifUrl.map((url) => <img key={url} src={url} width={240} />)}
        </>
      )}
    </details>
  );
};
