import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideConfirm, startClosing } from '../../redux/confirm-reducer';
import './ConfirmDialog.css';
import { RootState } from '../../redux/redux-store';

type ConfirmCallback = () => void;

let confirmCallback: ConfirmCallback | null = null;

type ConfirmDialogComponent = React.FC & {
  setOnConfirm: (fn: ConfirmCallback) => void;
};

const ConfirmDialog: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, isClosing, message } = useSelector((state: RootState) => state.confirm);

  const startClose = () => {
    dispatch(startClosing());
    setTimeout(() => dispatch(hideConfirm()), 300);
  };

  const handleYes = () => {
    if (confirmCallback) confirmCallback();
    startClose();
  };

  const handleNo = () => startClose();

  if (!isOpen) return null;

  return (
    <div className={`confirm-overlay ${isClosing ? 'closing' : ''}`} onClick={startClose}>
      <div
        className={`confirm-modal ${isClosing ? 'closing' : ''}`}
        data-testid="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
          <button onClick={handleYes} className="btn btn-danger" data-testid="confirm-delete">Yes</button>
          <button onClick={handleNo} className="btn btn-secondary" data-testid="cancel-delete">No</button>
        </div>
      </div>
    </div>
  );
};

const ConfirmDialogWithMethod = ConfirmDialog as ConfirmDialogComponent;

ConfirmDialogWithMethod.setOnConfirm = (_fn: ConfirmCallback) => {
  confirmCallback = _fn;
};

export default ConfirmDialogWithMethod;