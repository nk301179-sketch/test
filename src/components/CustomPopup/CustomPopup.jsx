import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import './CustomPopup.css';

const CustomPopup = ({ 
  type = 'info', 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  showCancel = true,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} />;
      case 'error':
      case 'warning':
        return <AlertTriangle size={24} />;
      default:
        return <Info size={24} />;
    }
  };

  const getIconClass = () => {
    switch (type) {
      case 'success':
        return 'success-icon';
      case 'error':
        return 'error-icon';
      case 'warning':
        return 'warning-icon';
      default:
        return 'info-icon';
    }
  };

  return (
    <div className="custom-popup-overlay">
      <div className="custom-popup-container">
        <div className="custom-popup-header">
          <div className={`custom-popup-icon ${getIconClass()}`}>
            {getIcon()}
          </div>
          <h3 className="custom-popup-title">{title}</h3>
          {onCancel && (
            <button onClick={onCancel} className="custom-popup-close">
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="custom-popup-body">
          <p className="custom-popup-message">{message}</p>
        </div>
        
        <div className="custom-popup-footer">
          {showCancel && onCancel && (
            <button onClick={onCancel} className="custom-popup-btn cancel-btn">
              {cancelText}
            </button>
          )}
          <button onClick={onConfirm} className="custom-popup-btn confirm-btn">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPopup;
