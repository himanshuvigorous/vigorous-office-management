import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../../global_layouts/Loader/Loader";
import { encrypt } from "../../../../config/Encryption";
import {
  deleteLeaveRequest,
  getLeaveRequestList,
  updateLeaveRequestStatus,
} from "./LeaveRequestFeatures/_leave_request_reducers";
import { domainName } from "../../../../constents/global";

import CreateLeaveRequestModal from "./CreateLeaveRequestModal";
import CreateEmployeeLeaveRequestModal from "./CreateEmployeeLeaveRequestModal";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import EditLeaveRequestModal from "./EditLeaveRequestModal";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { getAssignLeaveDetails } from "../AssignLeaves/AssignLeaveFeatures/_assign_leave_reducers";
import { Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";

function EmployeeLeaveRequestList() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);
  const { leaveRequestData, totalLeaverequestCount, loading } = useSelector(
    (state) => state.leaveRequest
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const { assignLeaveRequestDetails } = useSelector(
    (state) => state.assignLeave
  );
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const limit = 10;

  useEffect(() => {
    if(userInfoglobal?.userType === "employee" && userInfoglobal?._id ){
    getLeaveRequestListRequest();
    }
  }, [currentPage]);

  const getLeaveRequestListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        employeId:
          userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        text: "",
        sort: true,
        status: "",
        isPagination: true,
      },
    };
    dispatch(getLeaveRequestList(data)).then((data) => {
      if (!data?.error) {
        getAssignRequestData()
      }
    })
  };
  useEffect(() => {
    if(userInfoglobal?.userType === "employee" && userInfoglobal?._id ){
    getAssignRequestData();
    }
  }, []);
  const getAssignRequestData = () => {
    const reqData = {
      employeId:
        userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      companyId:
        userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
      "leaveTypeId": ''

    };
    dispatch(getAssignLeaveDetails(reqData));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLeaveRequest(reqData)).then((data) => {
          getLeaveRequestListRequest();
        });
      }
    });
  };
  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    )
  }



  const handleReject = (id) => {


    dispatch(updateLeaveRequestStatus({
      "_id": id,
      "status": "Cancelled"
    })).then((data) => {
      getLeaveRequestListRequest();
    })
  };
  return (
    <GlobalLayout>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <div className="">
          <div className="flex justify-end items-center md:space-y-0 space-y-2 py-1">
           
            {(canCreate && canRead) &&
              <Tooltip placement="topLeft"  title='Add Leave Request'>
                <button
                  onClick={() => {
                    // navigate("/admin/leave-request-list/create");
                    setIsCraeteModalOpen(true);
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Leave Request</span>
                </button>
              </Tooltip>}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {assignLeaveRequestDetails?.docs?.length > 0 &&
            assignLeaveRequestDetails?.docs?.map((element, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-3 w-56">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 capitalize text-xs font-medium">Leave Type:</span>
                  <span className="text-header text-xs capitalize">{element?.leaveTypeData?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 capitalize text-xs font-medium">Total Leaves:</span>
                  <span className="text-header text-xs capitalize">{element?.totalLeaves}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-800 capitalize text-xs font-medium">Used Leaves:</span>
                  <span className="text-header text-xs capitalize">{element?.usedLeaves}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 capitalize text-xs font-medium">Available Leaves:</span>
                  <span className="text-header text-xs capitalize">{element?.availableLeaves}</span>
                </div>
              </div>
            ))}
        </div>



        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Requested days</th>
                <th className="p-2 whitespace-nowrap">Reason</th>
                <th className="p-2 whitespace-nowrap">from date</th>
                <th className="p-2 whitespace-nowrap">from date Type</th>
                <th className="p-2 whitespace-nowrap">to date</th>
                <th className="p-2 whitespace-nowrap">to date Type</th>
                <th className="p-2 whitespace-nowrap">Updated At</th>
                <th className="p-2 whitespace-nowrap">Updated By</th>
                <th className="p-2 whitespace-nowrap">Remark</th>
                <th className="p-2 whitespace-nowrap">status</th>
                {canUpdate && <th className="p-2 whitespace-nowrap w-[10%]">Action</th>}
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {leaveRequestData && leaveRequestData?.length > 0 ? (
                  leaveRequestData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.employeName}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.requestDays}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.reason}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {moment(element?.startDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.type === "Single" ? element?.subType : element?.startDateBreakDown}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {moment(element?.endDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.type === "Single" ? element?.subType : element?.endDateBreakDown}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {dayjs(element?.updatedAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.updatedBy}
                      </td>
                      <td className="whitespace-nowrap p-2">
                        {element?.remark ? element?.remark : '-'}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        <span
                          className={`${element?.status === "Approved"
                            ? "bg-green-200 border-green-500 text-black"
                            : element?.status === "Pending"
                              ? "bg-yellow-200 border-yellow-500 text-black"
                              : element?.status === "Rejected"
                                ? "bg-red-200 border-red-500 text-black"
                                : element?.status === "Cancelled"
                                  ? "bg-gray-200 border-gray-500 text-black"
                                  : "bg-gray-200 border-gray-500 text-black"
                            } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        >
                          {element?.status ? element.status : "-"}
                        </span>
                      </td>


                      {canUpdate && <td className="whitespace-nowrap p-2">
                        <span className={`py-1.5 flex justify-start items-center  space-x-2.5`}>
                          {/* Edit Button */}
                          {canUpdate && <Tooltip placement="topLeft"  title={`${element?.status === "Pending" ? "Edit Request" : `No Actions Already ${element?.status}`}`}>
                            <button
                              disabled={element?.status !== "Pending"}
                              onClick={() => {
                                // navigate(`/admin/leave-request-list/edit/${encrypt(element?._id)}`);
                                { setisEditModalOpen(true); setEditModalId(element?._id) }
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className={` ${element?.status === "Pending" ? "hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-600 hover:text-gray-500"}`}

                                size={16}
                              />
                            </button>
                          </Tooltip>}

                        </span>
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={13}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )
                }
              </tbody>}
          </table>}
        </div>
        {isCraeteModalOpen && <CreateEmployeeLeaveRequestModal
          isOpen={true}
          onClose={() => setIsCraeteModalOpen(false)}
          fetchattendanceListData={getLeaveRequestListRequest}
          leaveListData={assignLeaveRequestDetails?.docs}

        />}
        {isEditModalOpen && <EditLeaveRequestModal
          isOpen={isEditModalOpen}
          onClose={() => { setisEditModalOpen(false); setEditModalId(null) }}
          leaveRequestId={editModalId}
          fetchattendanceListData={getLeaveRequestListRequest}

        />}
        <CustomPagination
          totalCount={totalLeaverequestCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />

      </>
      {/* )} */}
    </GlobalLayout>
  );
}
export default EmployeeLeaveRequestList;
