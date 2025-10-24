import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomPopup from '../components/CustomPopup/CustomPopup';

// Custom alert function to replace window.alert
export const customAlert = (message, type = 'info') => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'custom-alert-overlay';
    document.body.appendChild(overlay);
    
    const root = createRoot(overlay);
    
    const handleConfirm = () => {
      root.unmount();
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    root.render(
      <CustomPopup
        type={type}
        message={message}
        onConfirm={handleConfirm}
        showCancel={false}
        confirmText="OK"
      />
    );
  });
};

// Custom confirm function to replace window.confirm
export const customConfirm = (message, type = 'warning') => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'custom-confirm-overlay';
    document.body.appendChild(overlay);
    
    const root = createRoot(overlay);
    
    const handleConfirm = () => {
      root.unmount();
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    const handleCancel = () => {
      root.unmount();
      document.body.removeChild(overlay);
      resolve(false);
    };
    
    root.render(
      <CustomPopup
        type={type}
        message={message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        showCancel={true}
        confirmText="Yes"
        cancelText="No"
      />
    );
  });
};

// Custom success alert
export const customSuccess = (message) => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'custom-success-overlay';
    document.body.appendChild(overlay);
    
    const root = createRoot(overlay);
    
    const handleConfirm = () => {
      root.unmount();
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    root.render(
      <CustomPopup
        type="success"
        message={message}
        onConfirm={handleConfirm}
        showCancel={false}
        confirmText="OK"
      />
    );
  });
};

// Custom error alert
export const customError = (message) => {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.id = 'custom-error-overlay';
    document.body.appendChild(overlay);
    
    const root = createRoot(overlay);
    
    const handleConfirm = () => {
      root.unmount();
      document.body.removeChild(overlay);
      resolve(true);
    };
    
    root.render(
      <CustomPopup
        type="error"
        message={message}
        onConfirm={handleConfirm}
        showCancel={false}
        confirmText="OK"
      />
    );
  });
};

// Override global alert and confirm functions
export const overrideGlobalAlerts = () => {
  // Store original functions
  window.originalAlert = window.alert;
  window.originalConfirm = window.confirm;
  
  // Override with custom functions
  window.alert = customAlert;
  window.confirm = customConfirm;
};

// Restore original functions
export const restoreGlobalAlerts = () => {
  if (window.originalAlert) {
    window.alert = window.originalAlert;
  }
  if (window.originalConfirm) {
    window.confirm = window.originalConfirm;
  }
};
