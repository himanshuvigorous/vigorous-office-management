import { useEffect, useRef } from 'react';

function Modal({ children, className = '', bodyClassName = '', onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {

      if (modalRef.current && !modalRef.current.contains(e.target) && onClose) {
        onClose(); 
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black bg-opacity-50 flex justify-center items-center transition-all">
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-2 ${className}`}
      >
        <div className={bodyClassName}>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
