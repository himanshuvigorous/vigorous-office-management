import React, { useEffect, useState } from "react";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import AddNotification from "./AddNotification";
import EditNotification from "./EditNotification";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoticeBoard, listNoticeBoard, updateNoticeBoard } from "../../redux/_reducers/_noticeBoard_reducers";
import { domainName, userTypeglobal } from "../../constents/global";
import { Empty } from "antd";

const NoticeBoard = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const deleteNotice =(noticeId)=>{
    dispatch(deleteNoticeBoard({
        _id: noticeId
    })).then((data)=>{
        if(!data?.error){
            fetchNoticeboard()
        }
    })
  }
  useEffect(() => {
    fetchNoticeboard();
  }, []);
  const fetchNoticeboard = () => {
    dispatch(
      listNoticeBoard({
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        directorId: "",
        branchId:
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "companyDirector"
            ? ""
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
            isPagination:false
      })
    );
  };
  const { listNoticeBoardData } = useSelector((state) => state.noticeBoard);
  const [editContent, setEditContent] = useState("");
  const [editId, setEditId] = useState(null);

  const openNoticeModal = () => setIsNoticeOpen(true);
  const closeNoticeModal = () => setIsNoticeOpen(false);

  const openEditModal = (data, content) => {
    setEditId(data);
    setEditContent(content);
    setIsEditOpen(true);
  };

  const closeEditModal = () => setIsEditOpen(false);

  const updateNotification = (data, updatedContent) => {
    dispatch(updateNoticeBoard({
        "_id": data?._id,
        "companyId": data?.companyId ?? "",
        "directorId": "",
        "branchId": data?.branchId ?? "",
        "message": updatedContent
    })).then((data)=>{
        if(!data?.error){
            fetchNoticeboard()
            closeEditModal();
        }
    })
    
  };
//   useEffect(() => {
//     if (listNoticeBoardData?.docs) {
//       const data = listNoticeBoardData.docs.map((item) => {
//         return {
//           id: item._id,
//           content: item.message,
//         };
//       });
//       setNotifications(data);
//     }
//   }, [listNoticeBoardData]);

  return (
    <>
      {isNoticeOpen && (
        <AddNotification
          closeNoticeModal={closeNoticeModal}
          isNoticeOpen={isNoticeOpen}
          fetchNoticeboard={fetchNoticeboard}
        />
      )}
      {isEditOpen && (
        <EditNotification
          content={editContent}
          setContent={setEditContent}
          closeEditModal={closeEditModal}
          updateNotification={() => updateNotification(editId, editContent)}
        />
      )}

      <div className="w-full  h-auto !xl:h-full bg-[#ffff] overflow-x-hidden overflow-y-auto rounded-md py-[10px] px-3 space-y-3">
        <div className="w-full flex justify-between items-center">
          <div className="md:text-[18px] text-[16px] font-[500] text-header">
            Notice Board
          </div>
          {(userInfoglobal?.userType !=='employee' || userInfoglobal?.roleKey=='hr')&&<div
            onClick={openNoticeModal}
            className="bg-header py-1 text-[14px] px-2.5 rounded-md flex justify-between items-center space-x-2 text-white cursor-pointer"
          >
            <FaPlus />
            <span>Add</span>
          </div>}
        </div>

        <div className="group  ">
          <div className="space-y-2 w-full  h-full ">
            {listNoticeBoardData?.docs?.length > 0 ? listNoticeBoardData?.docs?.map((notification) => (
              <div
                key={notification?._id}
                className="w-full bg-[#D4D4D4]/40 p-2 rounded-md"
              >
                <span className="3xl:text-xs xl:text-[13px] text-[12px]">{notification?.message}</span>
                <div className="flex justify-end items-center space-x-1.5">
                  <div className="3xl:text-xs xl:text-[10px] text-[14px]">created by - {notification?.createdBy} </div>
                 {(userInfoglobal?.userType !=='employee' || userInfoglobal?.roleKey=='hr')&& <button
                    className="p-1.5 text-xs rounded-md bg-white border border-muted"
                    onClick={() =>
                      openEditModal(notification, notification?.message)
                    }
                    type="button"
                  >
                    <FaPenToSquare size={14} className="text-header" />
                  </button>}
                  {(userInfoglobal?.userType !=='employee' || userInfoglobal?.roleKey=='hr')&&<button
                    className="p-1.5 rounded-md bg-white border  text-red-500 hover:text-red-600 hover:border-red-600"
                    type="button"
                  >
                    <RiDeleteBin5Line onClick={()=>deleteNotice(notification?._id)} className="text-red-500" size={14} />
                  </button> }
                </div>
              </div>
            )) :<div className="flex justify-center items-center h-full w-full">
                    <Empty />
                  </div> }
          </div>
        </div>
      </div>
    </>
  );
};

export default NoticeBoard;
