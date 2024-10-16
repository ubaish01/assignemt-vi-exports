// components/Modal.js
import React, { useEffect, useRef } from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
        <div
          ref={modalRef}
          className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full transition-transform transform"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;