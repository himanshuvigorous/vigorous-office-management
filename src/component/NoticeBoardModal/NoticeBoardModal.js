import React from 'react'
import { IoClose } from "react-icons/io5";

const NoticeBoardModal = ({closeNoticeModal,isNoticeOpen}) => {
    return (
        <>
            <div
                className={`fixed inset-0 z-[999999999999] bg-gray-900 bg-opacity-50 flex items-start top-0 mt-0 justify-center transition-opacity duration-300 ${
                    isNoticeOpen ? "animate-[smoothSlideDown_0.5s_ease-in-out]" : "opacity-0"
                }`}
                >
                <div className="bg-white rounded-sm shadow-lg w-11/12 max-w-md relative top-[100px] transition-transform duration-700 linear">
                    <div className="flex items-center justify-between border-b py-4 px-6">
                    <div className="text-sm font-normal">Add News</div>
                    <button onClick={() => closeNoticeModal()} className="text-gray-500 hover:text-gray-700">
                        <IoClose />
                    </button>
                    </div>
                    <div className="text-gray-700 p-6">
                    <div className="text-sm text-black">Title</div>
                    <textarea className="border w-full h-[58px] p-2" name="" id=""></textarea>
                    </div>
                    <div className="flex justify-start p-6 pt-0">
                    <button className="bg-green-700 text-white px-3 py-2 rounded text-[14px] mr-2">Create</button>
                    </div>
                </div>
                </div>
        </>
    )
}

export default NoticeBoardModal