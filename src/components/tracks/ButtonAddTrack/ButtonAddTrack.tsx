import React from 'react';
import './buttonAddTrack.css';


export interface ButtonAddTrackProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label?: string;
}

export const ButtonAddTrack = ({
  onClick,
  disabled = false,
  loading = false,
  label = '+ Add Track',
}: ButtonAddTrackProps) => {
  return (
    <button
      className="add-track-button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      data-loading={loading}
      type="button"
    >
      {label}
    </button>
  );
};
