import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { domainName } from "../../constents/global";
import { createNoticeBoard } from "../../redux/_reducers/_noticeBoard_reducers";

const AddNotification = ({ closeNoticeModal, isNoticeOpen ,fetchNoticeboard }) => {
  const [newNotification, setNewNotification] = useState("");
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const handleCreate = () => {
    if (newNotification.trim()) {
      dispatch(
        createNoticeBoard({
          companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
          directorId: "",
          branchId:userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id: userInfoglobal?.roleKey === "hr" ? userInfoglobal?.branchId:'',
          message: newNotification,
        })
      ).then((data)=>{
        if(!data?.error){
            fetchNoticeboard()
            closeNoticeModal();
        }
      })
    }
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeNoticeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 z-[999999999999] bg-gray-900 bg-opacity-50 flex items-start top-0 mt-0 justify-center transition-opacity duration-300 ${
          isNoticeOpen ? "animate-[smoothSlideDown_0.5s_ease-in-out]" : ""
        }`}
      >
        <div
          ref={modalRef}
          className="animate-slideInFromTop bg-[#F2F2F2] modalShadow rounded-[12px] shadow-lg w-11/12 max-w-md relative top-[100px] transition-transform duration-700 linear"
        >
          <div className="flex items-center justify-between border-b py-4 px-6">
            <div className="text-sm font-normal">Add News</div>
            <button
              onClick={closeNoticeModal}
              className="text-gray-400 hover:text-gray-700"
            >
              <IoClose />
            </button>
          </div>
          <div className="text-gray-700 p-6">
            <div className="text-sm text-black">Title</div>
            <textarea
              className="border w-full h-[58px] p-2"
              value={newNotification}
              onChange={(e) => setNewNotification(e.target.value)}
              placeholder="Enter notification text"
            />
          </div>

          <div className="flex justify-end items-center p-6 pt-0">
            <button
              onClick={handleCreate}
              className="bg-header text-white px-[22px] py-[11px] rounded text-[14px] mr-2"
            >
              Create
            </button>
            <button
              onClick={closeNoticeModal}
              className="bg-[#d41c1c] text-white px-[22px] py-[11px] rounded text-[14px] mr-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNotification;
