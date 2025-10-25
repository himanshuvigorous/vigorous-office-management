import React, { useState, useRef, useEffect } from 'react';
import { IoClose } from "react-icons/io5";
import { FaTimes } from 'react-icons/fa';


const EditNotification = ({ content, setContent, closeEditModal, updateNotification, isNoticeOpen }) => {
    const modalRef = useRef(null);

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            closeEditModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSave = () => {
        if (content.trim()) {
            updateNotification();
        }
    };

    return (
        <>
            <div
                className={`fixed inset-0 z-[999999999999] bg-gray-900 bg-opacity-50 flex items-start top-0 mt-0 justify-center transition-opacity duration-300 ${isNoticeOpen ? "animate-[smoothSlideDown_0.5s_ease-in-out]" : ""
                    }`}
            >
                <div ref={modalRef} className="animate-slideInFromTop bg-[#F2F2F2] modalShadow rounded-[12px] shadow-lg w-11/12 max-w-md relative top-[100px] transition-transform duration-700 linear">
                    <div className="flex items-center justify-between border-b py-4 px-6">
                        <div className="text-sm font-normal">Edit Notification</div>
                        <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-700">
                            <FaTimes size={15} />
                        </button>
                    </div>
                    <div className="text-gray-700 p-3 space-y-1">
                        <div className="text-sm text-black">Content</div>
                        <textarea
                            className="border w-full h-[58px] p-2"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end items-center px-3 pt-0 pb-4">
                        <button onClick={handleSave} className="bg-header text-white px-[22px] py-[11px] rounded text-[14px] mr-2">
                            Save
                        </button>
                        <button onClick={closeEditModal} className="bg-[#d41c1c] text-white px-[22px] py-[11px] rounded text-[14px] mr-2">
                            close
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditNotification;