import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName, inputClassNameSearch } from "../../../../constents/global";
import moment from "moment";
import { getCompensatoryLeaveRequestList, updateCompensatoryLeaveRequestStatus } from "./CompensatoryLeaveFeature/_compensatory_request_reducers";
import CreateCompensatoryEmployeeLeaveRequestModal from "./CreateCompensatoryEmployeeLeaveRequestModal";
import UpdateCompensatoryEmployeeLeaveRequestModal from "./UpdateCompensatoryEmployeeLeaveRequestModal";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import CreateHrCompensatoryEmployeeLeaveRequestModal from "./CreateHrCompensatoryEmployeeLeaveRequestModal";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { useForm, useWatch } from "react-hook-form";
import { Tooltip } from "antd";

function HrCompensatoryEmployeeLeaveRequestList() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);
  const { compensatoryleaveRequestData ,totalCompensatoryLeaverequestCount } = useSelector(
    (state) => state.compensatoryleaveRequest
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );


  const [currentPage, setCurrentPage] = useState(1);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  useEffect(() => {
    getLeaveRequestListRequest();
  }, [currentPage ,CompanyId, BranchId]);

  const getLeaveRequestListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        employeId:null,
        companyId:
        userInfoglobal?.userType === "admin"
        ? CompanyId
        :
        userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
        text: "",
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

  const handleApprove = (id) => {
    dispatch(updateCompensatoryLeaveRequestStatus({
      "_id": id,
      "status": "Approved"
    })).then((data) => {
      !data?.error && getLeaveRequestListRequest();
    })
  };

  const handleReject = (id) => {


    dispatch(updateCompensatoryLeaveRequestStatus({
      "_id": id,
      "status": "Rejected"
    })).then((data) => {
      getLeaveRequestListRequest();
    })
  };


  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);



  return (
    <GlobalLayout>
      {/* {loading ? (
        <Loader />
      ) : ( */}
      <>
        <div className="">
          <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="flex justify-center items-center gap-2">
             <div className="flex gap-2">
            {userInfoglobal?.userType === "admin" && <div className="">
                 
                 <select
                   {...register("PDCompanyId", {
                     required: "company is required",
                   })}
                   className={` ${inputClassNameSearch} ${errors.PDCompanyId
                     ? "border-[1px] "
                     : "border-gray-300"
                     }`}
                 >
                   <option className="" value="">
                     Select Comapany
                   </option>
                   {companyList?.map((type) => (
                     <option value={type?._id}>{type?.fullName}</option>
                   ))}
                 </select>
                 {errors.PDCompanyId && (
                   <p className="text-red-500 text-sm">
                     {errors.PDCompanyId.message}
                   </p>
                 )}
               </div>}
               {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
            
             <select
               {...register("PDBranchId", {
                 required: "Branch is required",
               })}
               className={` ${inputClassNameSearch} ${errors.PDBranchId
                 ? "border-[1px] "
                 : "border-gray-300"
                 }`}
             >
               <option className="" value="">
                 Select Branch
               </option>
               {branchList?.map((type) => (
                 <option value={type?._id}>{type?.fullName}</option>
               ))}
             </select>
             {errors.PDBranchId && (
               <p className="text-red-500 text-sm">
                 {errors.PDBranchId.message}
               </p>
             )}
           </div>}
            </div>
            </div>
            <Tooltip placement="topLeft"  title='Add Compensatory Leave request'>
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
            </Tooltip>
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
                      <Tooltip placement="topLeft"  title={`Request Status - ${element?.status}`}>
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
                      </span></Tooltip>
                    </td>


                    <td className="whitespace-nowrap p-2">
                      <span className={`py-1.5 flex justify-start items-center  space-x-2.5`}>
                        {/* Edit Button */}
                        <Tooltip placement="topLeft"  title='Edit'>
                        <button
                        disabled={element?.status !== "Pending"}
                          onClick={() => {
                            {setisEditModalOpen(true) ; setEditModalId(element?._id)}
                            // navigate(`/admin/leave-request-list/edit/${encrypt(element?._id)}`);
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <FaPenToSquare
                          className={` ${element?.status === "Pending" ? "hover:text-[#337ab7] text-[#3c8dbc]" : "text-gray-600 hover:text-gray-500"}`}
                         
                            size={16}
                          />
                        </button>
                        </Tooltip>

                        {/* Reject Button */}
                       <Tooltip placement="topLeft"  title='Reject Request'>
                       <button
                          onClick={() => handleReject(element?._id)}
                          className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                          type="button"
                          disabled={element?.status !== "Pending"}
                        >
                          <RiDeleteBin5Line
                          
                            className={` ${element?.status === "Pending" ? "text-red-600 hover:text-red-500" : "text-gray-600 hover:text-gray-500"}`}
                            size={16}
                          />

                        </button>
                       </Tooltip>

                        {/* Approve Button */}
                       <Tooltip placement="topLeft"  title='Approve Leave'>
                       <button
                          onClick={() => handleApprove(element?._id)}
                          className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                          type="button"
                          disabled={element?.status !== "Pending"}
                        >
                          <FaCheck
                            className={` ${element?.status === "Pending" ? "text-green-600 hover:text-green-500" : "text-gray-600 hover:text-gray-500"}`}
                            size={16}
                          />

                        </button>
                       </Tooltip>
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
        <CustomPagination
            totalCount={totalCompensatoryLeaverequestCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        {isCraeteModalOpen && <CreateHrCompensatoryEmployeeLeaveRequestModal
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

      </>
      {/* )} */}
    </GlobalLayout>
  );
}
export default HrCompensatoryEmployeeLeaveRequestList;
