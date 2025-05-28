import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideConfirm, startClosing } from '../../redux/confirm-reducer'
import './ConfirmDialog.css'

const ConfirmDialog = () => {
  const dispatch = useDispatch();
  const { isOpen, isClosing, message } = useSelector(state => state.confirm);

  const confirmCallback = useRef(null);
  ConfirmDialog.setOnConfirm = (fn) => {
    confirmCallback.current = fn;
  };

  const handleYes = () => {
    if (confirmCallback.current) confirmCallback.current();
    startClose();
  };

  const handleNo = () => startClose();

  const startClose = () => {
    dispatch(startClosing());
    setTimeout(() => dispatch(hideConfirm()), 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`confirm-overlay ${isClosing ? 'closing' : ''}`}
      onClick={startClose}
    >
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

export default ConfirmDialog;