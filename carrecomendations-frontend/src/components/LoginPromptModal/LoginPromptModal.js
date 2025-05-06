import React from 'react';
import './LoginPromptModal.css';

const LoginPromptModal = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Login Required</h3>
        <p>You need to login before adding to favorites</p>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onLogin}>Click here to login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPromptModal;