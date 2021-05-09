import './Preview.css';
import React from 'react';
import type { MessageEventTarget } from '../../types';
import { InspectorList } from '../InspectorList';

type Props = {
  mediaInputItems: NonNullable<
    MessageEventTarget['pluginMessage']['mediaInputItems']
  >;
};

export const Preview: React.FC<Props> = (props) => {
  const { mediaInputItems } = props;
  return (
    <details open>
      <summary className="Preview_summary">
        <strong>Preview</strong>
      </summary>
      <div className="Preview_wrap">
        {mediaInputItems?.length > 0 ? (
          <InspectorList
            currentNames={mediaInputItems.map((item) => item.uploadedFileName)}
            selectedName={''}
            handleOnClickFocus={() => {}}
            handleOnClickDelete={() => {}}
          />
        ) : (
          <p className="Preview_indication">No media</p>
        )}
      </div>
      <p className="Preview_warning">
        Select media you want to show in Preview
      </p>
    </details>
  );
};
