import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName } from "../../../../constents/global";
import moment from "moment";
import { getCompensatoryLeaveRequestList } from "./CompensatoryLeaveFeature/_compensatory_request_reducers";
import CreateCompensatoryEmployeeLeaveRequestModal from "./CreateCompensatoryEmployeeLeaveRequestModal";
import UpdateCompensatoryEmployeeLeaveRequestModal from "./UpdateCompensatoryEmployeeLeaveRequestModal";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";

function CompensatoryEmployeeLeaveRequestList() {
  const dispatch = useDispatch();
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);
  const { compensatoryleaveRequestData , totalCompensatoryLeaverequestCount } = useSelector(
    (state) => state.compensatoryleaveRequest
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  useEffect(() => {
    getLeaveRequestListRequest();
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
    dispatch(getCompensatoryLeaveRequestList(data));
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
      // if (result.isConfirmed) {
      //   dispatch(deleteLeaveRequest(reqData)).then((data) => {
      //     getLeaveRequestListRequest();
      //   });
      // }
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




  return (
    <GlobalLayout>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <div className="">
          <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md">
              <HiOutlineFilter />
              <span>Name</span>
              <FaAngleDown />
            </div>
            <button
              onClick={() => {
                // navigate("/admin/leave-request-list/create");
                setIsCraeteModalOpen(true);
              }}
              className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add Compensatory Leave Request</span>
            </button>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Name</th>
                <th className="p-2 whitespace-nowrap">Reason</th>
                <th className="p-2 whitespace-nowrap"> date</th>
                <th className="p-2 whitespace-nowrap">status</th>
                <th className="p-2 whitespace-nowrap w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {compensatoryleaveRequestData && compensatoryleaveRequestData?.length > 0 ? (
                compensatoryleaveRequestData?.map((element, index) => (
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
                      {element?.reason}
                    </td>
                    <td className="whitespace-nowrap p-2">
                      {moment(element?.compensatoryDate).format("DD-MM-YYYY")}
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


                    <td className="whitespace-nowrap p-2">
                      <span className={`py-1.5 flex justify-start items-center  space-x-2.5`}>
                        {/* Edit Button */}
                        <button
                        disabled={element?.status !== "Pending"}
                          onClick={() => {
                            // navigate(`/admin/leave-request-list/edit/${encrypt(element?._id)}`);
                            {setisEditModalOpen(true) ; setEditModalId(element?._id)}
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <FaPenToSquare
                          className={` ${element?.status === "Pending" ? "hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-600 hover:text-gray-500"}`}
                         
                            size={16}
                          />
                        </button>

                        
                        {/* <button
                          onClick={() => handleReject(element?._id)}
                          className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                          type="button"
                          disabled={element?.status !== "Pending"}
                        >
                          <RiDeleteBin5Line
                          
                            className={` ${element?.status === "Pending" ? "text-red-600 hover:text-red-500" : "text-gray-600 hover:text-gray-500"}`}
                            size={16}
                          />

                        </button> */}

                       
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5">
                  <td
                    colSpan={5}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {isCraeteModalOpen && <CreateCompensatoryEmployeeLeaveRequestModal
          isOpen={true}
          onClose={() => setIsCraeteModalOpen(false)}
          fetchattendanceListData={getLeaveRequestListRequest}

        />}
         {isEditModalOpen && <UpdateCompensatoryEmployeeLeaveRequestModal
          isOpen={true}
          onClose={() => {setisEditModalOpen(false);setEditModalId(null)}}
          leaveId={editModalId}
          fetchattendanceListData={getLeaveRequestListRequest}

        />}
         <CustomPagination
            totalCount={totalCompensatoryLeaverequestCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />

      </>
      {/* )} */}
    </GlobalLayout>
  );
}
export default CompensatoryEmployeeLeaveRequestList;
