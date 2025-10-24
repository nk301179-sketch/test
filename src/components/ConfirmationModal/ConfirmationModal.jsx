import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-icon">
            <AlertTriangle size={24} />
          </div>
          <h3>Confirm Action</h3>
          <button onClick={onCancel} className="modal-close">
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <p>{message}</p>
        </div>
        
        <div className="modal-footer">
          <button onClick={onCancel} className="modal-btn cancel-btn">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-btn confirm-btn">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;