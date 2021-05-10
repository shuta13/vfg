import './MessageIndicator.css';
import React from 'react';

type Props = {
  text: string;
  level: 'info' | 'warn';
};

export const MessageIndicator: React.FC<Props> = (props) => {
  const { text, level } = props;
  return (
    <p className="MessageIndicator_wrap">
      <span
        className={
          level === 'warn'
            ? 'MessageIndicator_text--warn'
            : 'MessageIndicator_text--info'
        }
      >
        {text}
      </span>
    </p>
  );
};
