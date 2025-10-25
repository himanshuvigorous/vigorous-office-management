import React, { useState, useEffect } from 'react';

const Notification = ({ id, message, type = 'info', position = 'top-right', duration = 3000, onRemove }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(id), 300); // Delay removal after fade out
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onRemove]);

  const typeStyles = {
    success: 'bg-gradient-to-r from-teal-500 to-teal-600 text-white  hover:from-teal-600 hover:to-teal-700',
    error: 'bg-gradient-to-r from-rose-500 to-rose-600 text-white  hover:from-rose-600 hover:to-rose-700',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black border-yellow-600 hover:from-yellow-500 hover:to-yellow-600',
    info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-cyan-700 hover:from-cyan-600 hover:to-cyan-700',
  };

  const positionStyles = {
    'top-left': 'top-5 left-5',
    'top-center': 'top-5 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-5 right-5',
  };

  return (
    <div
      className={`fixed p-3 w-72 max-w-full rounded-lg shadow-lg flex items-center justify-between space-x-3 transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      ${typeStyles[type]} ${positionStyles[position]} `}
      style={{ zIndex: 3000 }}
    >
      <div className="text-sm font-medium">{message}</div>
      <button
        className="ml-3 text-white font-semibold hover:opacity-80 focus:outline-none transition-opacity duration-200"
        onClick={() => onRemove(id)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Notification;
