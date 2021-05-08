import './VFGButton.css';
import React from 'react';
import { Color } from '../../config/style-variables';

type Props = {
  type: 'normal' | 'submit';
  disabled: boolean;
  handleOnClick: () => void;
  text: string;
  bgColor: keyof typeof Color['button'];
};

export const VFGButton: React.FC<Props> = (props) => {
  const { type, disabled, handleOnClick, text, bgColor } = props;

  if (type === 'normal') {
    return (
      <button
        disabled={disabled}
        onClick={handleOnClick}
        className="VFGButton"
        style={{ background: Color.button[disabled ? 'disabled' : bgColor] }}
      >
        {text}
      </button>
    );
  } else if (type === 'submit') {
    return (
      <input
        type="submit"
        value={text}
        className="VFGButton"
        style={{ background: Color.button[disabled ? 'disabled' : bgColor] }}
      />
    );
  }
  return null;
};
