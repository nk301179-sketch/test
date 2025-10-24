import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
