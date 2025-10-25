import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaAngleUp, FaAngleDown, FaEye, FaPlus } from "react-icons/fa";
import { HiChatAlt, HiOutlineFilter } from "react-icons/hi";
import { domainName, inputAntdSelectClassNameFilter, showSwal, statusMapping } from "../../../constents/global";
import Loader from "../../../global_layouts/Loader/Loader";
import {
  getTaskList,
} from "./addTaskFeatures/_addTask_reducers";
import moment from "moment";

import ChatBox from "./ChatBox";
import { BsEye } from "react-icons/bs";
import { decrypt, encrypt } from "../../../config/Encryption";
import { Dropdown, Select, Tooltip } from "antd";
import { BiCheckDouble } from "react-icons/bi";
import { statusupdatetaskFunc } from "../addTask/addTaskFeatures/_addTask_reducers";
import { PiDotsThreeOutlineVerticalBold } from 'react-icons/pi';
import ListLoader from "../../../global_layouts/ListLoader";
import { GrValidate } from "react-icons/gr";
import { MdDelete, MdOutlineTask, MdOutlineAssignment, MdRemove } from "react-icons/md";
import { TbPencilMinus } from "react-icons/tb";
import dayjs from "dayjs";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { CLIENT_TASK_STATUS_ARR } from "../../../constents/ActionConstent";


function EmployeeTaskList() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  
  const { taskList, totalTaskCount, loading } = useSelector(
    (state) => state.employeeTask
  );

  const [comments, setComments] = useState(null);
  
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

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
 
  const Status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });



  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get('page')) || 1;
  const initialLimit = parseInt(searchParams.get('limit')) || 10;
  const initialStatus = decrypt(searchParams.get('status')) || '';
  const initialOverdue = decrypt(searchParams.get('overdue')) || '';

 const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [isOverDue, setIsOverDue] = useState(initialOverdue);
  const [searchText, setSearchText] = useState('');

 useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (limit !== 10) params.set('limit', limit);
    if (status) params.set('status', encrypt(status));
    if (isOverDue) params.set('overdue', encrypt(isOverDue));
    setSearchParams(params);
  }, [currentPage, limit, status, isOverDue, searchText] );
  useEffect(() => {
    userInfoglobal?.userType !== "admin" && userInfoglobal?.userType !== "company" && fetchClientListData();
  }, [isOverDue, searchText, currentPage, limit, status]);

  const fetchClientListData = () => {
    let reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,

        directorId: "",
        clientId: "",
        // "employeId": '67695d80a8929f2cf7967ff8',
        employeId:
          (userInfoglobal
            ?.userType !== "admin" && userInfoglobal
              ?.userType !== "company")
            ? userInfoglobal?._id
            : "",
        taskTypeId: "",
        groupId: "",
        text: searchText,
        sort: true,
        status: status,
        isOverDue: isOverDue,
        isPagination: true,
      },
    };
    dispatch(getTaskList(reqData));
  };



  if (userInfoglobal?.userType !== "employee" ) {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    );
  }

  const handleOpenChat = (data) => {

    setIsChatModalOpen(true); // Open chat modal
    setComments(data?.taskStatusCommentData); // Set task info if required
  };

  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setComments(null);
  };


  const handleTaskAccept = (data) => {
    Swal.fire({
      title: 'Add a Comment',
      input: 'textarea',
      inputLabel: 'Comment (optional)',
      inputPlaceholder: 'Type your comment here...',
      inputAttributes: {
        'aria-label': 'Type your comment here'
      },
      showCancelButton: true,
      confirmButtonText: 'Submit',
      preConfirm: (comment) => {
        return comment;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const comment = result.value || '';
        dispatch(statusupdatetaskFunc({
          _id: data?.taskData?._id,
          description: comment,
          status: "Accepted",
          attachment: [],
        })
        ).then((response) => {
          if (!response?.error) {
            fetchClientListData();
            Swal.fire('Success', 'Task accepted successfully!', 'success');
          } else {
            Swal.fire('Error', 'Something went wrong!', 'error');
          }
        });
      }
    });
  };

  const handleResetFilters = () => {
    setCurrentPage(1);
    setLimit(10);   
    setStatus('');
    setIsOverDue('');
    setSearchText('');
  };
  
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleOverdueChange = (value) => {
    setIsOverDue(value);
    setCurrentPage(1);
  };

  const onChange = (e) => {

    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      {loading ? (
        <Loader />
      ) : (
        <section>
          <div className="">
            <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
              <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1.5">
                <div>
              
                      <Select
                        defaultValue={""}
                        value={isOverDue}
                        onChange={handleOverdueChange}
                        disabled={loading}
                        className={`${inputAntdSelectClassNameFilter} `}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">All Task</Select.Option>
                        <Select.Option value="true">Overdue Task</Select.Option>
                        <Select.Option value="false">Other Task</Select.Option>
                      </Select>
                    
               
                </div>
                <div className="">
         
                      <Select
                       
                        className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px]" : "border-gray-300"}`}
                        placeholder="Select Status"
                        value={status}
                        onChange={handleStatusChange}
                        disabled={loading}
                        showSearch
                        filterOption={
                          (input, option) =>
                          option?.label?.toLowerCase().includes(input.toLowerCase())
                        }                       
                      >
                         <Select.Option value="">Select Status</Select.Option>
                        {CLIENT_TASK_STATUS_ARR
                          .filter(status => status !== 'Completed' && status !== 'Task_Stop')
                          .map(status => (
                            <Select.Option key={status} value={status}>{status}</Select.Option>
                          ))
                        }
                      </Select>
                  
                </div>
              </div>
              <div className="flex justify-end items-center gap-2 ">
                <button
                  onClick={() => {
                    handleResetFilters()
                  }}
                  className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                  <span className="text-[12px]">Reset</span>
                </button>

                <Tooltip placement="topLeft"  title='Add Task'>
                  <button
                    onClick={() => {
                      navigate("/admin/task-type/employee-task");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Task</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-medium h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap min-w-[35px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>S.No.</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Client Name</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Department</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[120px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Task Name</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Financial Year</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[90px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Period</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Assigned Date</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Due Date</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Last Updated At</span>
                      <button className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </button>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[90px]">
                    <span>Status</span>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap min-w-[70px]">
                    <span>Action</span>
                  </th>
                </tr>
              </thead>
              {loading ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={12}
                    className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                  >
                    <ListLoader />
                  </td>
                </tr>
              ) : <tbody>
                {taskList && taskList?.length > 0 ? (
                  taskList?.map((element, index) => (
                    <tr
                      className={`text-[13px] ${element?.taskData?.isOverDue
                        ? "bg-rose-300 text-black"
                        : element?.taskData?.priority === "high"
                          ? "bg-[#FFE5B4] text-gray-800"
                          : element?.taskData?.priority === "medium"
                            ? "bg-green-300 text-black"
                            : "bg-white text-[#374151]"
                        }`}
                    >
                      <td className="border-none p-2 min-w-[35px]">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="border-none p-2 min-w-[100px]">
                        {element?.taskData?.clientData?.fullName || '-'}
                      </td>
                      <td className="border-none p-2 min-w-[100px]">
                        {element?.taskData?.departmentData?.name || '-'}
                      </td>
                      <td className="border-none p-2 min-w-[120px]">
                        {element?.taskData?.taskName || '-'}
                      </td>
                      <td className="border-none p-2 min-w-[100px]">
                        {element?.taskData?.financialYear || '-'}
                      </td>
                      <td className="border-none p-2 min-w-[90px]">
                        {element?.taskData?.type === 'Monthly' && element?.taskData?.monthName}
                        {element?.taskData?.type === 'Quaterly' && element?.taskData?.monthQuaters}
                        {element?.taskData?.type === 'Yearly' && "Yearly"}
                      </td>
                      <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
                        {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
                        {moment(element?.taskData?.dueDate).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
                        {moment(element?.updatedAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="border-none p-2 min-w-[90px]">
                        <span
                          className={`
        px-2 py-1.5 rounded-lg text-[12px] cursor-pointer whitespace-nowrap hover:opacity-80 border border-header
        ${element?.taskData?.status === "Assigned"
                              ? "bg-blue-600 text-white"
                              : element?.taskData?.status === "Accepted"
                                ? "bg-green-600 text-white"
                                : element?.taskData?.status === "Pending_at_client"
                                  ? "bg-yellow-500 text-black"
                                  : element?.taskData?.status === "Pending_at_department"
                                    ? "bg-purple-600 text-white"
                                    : element?.taskData?.status === "Pending_at_colleague"
                                      ? "bg-teal-500 text-white"
                                      : element?.taskData?.status === "Pending_at_manager"
                                        ? "bg-orange-600 text-white"
                                        : element?.taskData?.status === "Work_in_progress"
                                          ? "bg-indigo-600 text-white"
                                          : element?.taskData?.status === "Pending_for_approval"
                                            ? "bg-pink-500 text-white"
                                            : element?.taskData?.status === "Pending_for_fees"
                                              ? "bg-gray-500 text-white"
                                              : element?.taskData?.status === "Completed"
                                                ? "bg-green-800 text-white"
                                                : element?.taskData?.status === "Task_Stop"
                                                  ? "bg-red-700 text-white"
                                                  : element?.taskData?.status === "reAssign_to_other"
                                                    ? "bg-cyan-700 text-white"
                                                    : element?.taskData?.status === "Rejected"
                                                      ? "bg-rose-800 text-white"
                                                      : "bg-gray-200 text-black"
                            }
      `}
                        >
                          {element?.taskData?.status
                            ?.replace(/_/g, ' ')
                            .toLowerCase()
                            .replace(/\b\w/g, char => char.toUpperCase())}
                        </span>
                      </td>
                      <td className="border-none p-2 min-w-[70px]">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          <button
                            onClick={() => {
                              handleTaskAccept(element)
                            }}
                            disabled={element?.taskData?.status !== "Assigned"}
                            className={`px-2 py-1.5 text-xs rounded-md bg-transparent  border-[1.5px] ${element?.taskData?.status === "Assigned" ? "border-black" : 'border-gray-300'} `}
                            type="button"
                          >
                            <BiCheckDouble
                              className={element?.taskData?.status === "Assigned" ? " hover:text-header  text-header " : "text-gray-400"}
                              size={16}
                            />
                          </button>
                          <Tooltip placement="topLeft"  title="View">
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/task/view/${encrypt(element?.taskData?._id)}/${encrypt(`employee`)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent !border-[1.5px] border-header "
                              type="button"
                            >
                              <BsEye
                                className=" hover:text-header  text-header "
                                size={16}
                              />
                            </button>
                          </Tooltip>


                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'responsive-date-info',
                                  label: (
                                    <div className="2xl:hidden block">
                                      <div className="flex flex-col space-y-1.5">
                                        <span
                                          onClick={() =>
                                            showSwal(dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
                                          }
                                          className="flex items-center text-slate-800 hover:text-slate-700"
                                        >
                                          <MdOutlineAssignment className="mr-2" size={16} />
                                          Assigned Date
                                        </span>
                                        <span
                                          onClick={() =>
                                            showSwal(dayjs(element?.taskData?.dueDate).format('DD-MM-YYYY hh:mm a') || "Data not available")
                                          }
                                          className="flex items-center text-purple-800 hover:text-purple-700"
                                        >
                                          <MdOutlineTask className="mr-2" size={16} />
                                          Due Date
                                        </span>
                                        <span
                                          onClick={() =>
                                            showSwal(dayjs(element?.updatedAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
                                          }
                                          className="flex items-center text-teal-700 hover:text-teal-600"
                                        >
                                          <GrValidate className="mr-2" size={15} />
                                          Last Updated On
                                        </span>
                                        <span
                                          onClick={() =>
                                            showSwal(element?.createdBy || "Data not available")
                                          }
                                          className="flex items-center text-sky-800 hover:text-sky-700"
                                        >
                                          <TbPencilMinus className="mr-2" size={16} />
                                          Created By
                                        </span>
                                      </div>
                                    </div>
                                  ),
                                },
                                {
                                  key: 'view-message',
                                  label: (
                                    <span
                                      onClick={() => handleOpenChat(element)}
                                      className="flex items-center text-header hover:text-header"
                                    >
                                      <HiChatAlt className="mr-2" size={16} />
                                      View Message
                                    </span>
                                  ),
                                },
                                // {
                                //   key: 'CreateAt',
                                //   label: (
                                //     <span
                                //       className="flex justify-start items-center gap-1"
                                //     // onClick={() => handleOpenChat(element)}
                                //     >
                                //       {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                //       {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                                //     </span>
                                //   ),
                                // },
                                // {
                                //   key: 'createdBy',
                                //   label: (
                                //     <span
                                //       className="flex justify-start items-center gap-1"
                                //     // onClick={() => handleOpenChat(element)}
                                //     >
                                //       {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                //       {element?.createdBy}
                                //     </span>
                                //   ),
                                // }

                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title="More Actions">
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border-[1px] border-header"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="text-header hover:text-header"
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                          </Dropdown>


                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
            </table>
          </div>

        </section>
      )}

      <CustomPagination
                          totalCount={totalTaskCount}
                          pageSize={limit}
                          currentPage={currentPage}
                          onChange={onPaginationChange}
                      />

      {isChatModalOpen && (
        <ChatBox
          isOpen={isChatModalOpen}
          onClose={() => handleCloseChat()}
          comment={comments}
        />
      )}
    </GlobalLayout>
  );
}
export default EmployeeTaskList;


































// import React, { useEffect, useState } from "react";
// import { Controller, useForm, useWatch } from "react-hook-form";
// import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
// import { FaAngleUp, FaAngleDown, FaEye, FaPlus } from "react-icons/fa";
// import { HiChatAlt, HiOutlineFilter } from "react-icons/hi";
// import { domainName, inputAntdSelectClassNameFilter, showSwal, statusMapping } from "../../../constents/global";
// import Loader from "../../../global_layouts/Loader/Loader";
// import {
//   getTaskList,
// } from "./addTaskFeatures/_addTask_reducers";
// import moment from "moment";

// import ChatBox from "./ChatBox";
// import { BsEye } from "react-icons/bs";
// import { encrypt } from "../../../config/Encryption";
// import { Dropdown, Select, Tooltip } from "antd";
// import { BiCheckDouble } from "react-icons/bi";
// import { statusupdatetaskFunc } from "../addTask/addTaskFeatures/_addTask_reducers";
// import { PiDotsThreeOutlineVerticalBold } from 'react-icons/pi';
// import ListLoader from "../../../global_layouts/ListLoader";
// import { GrValidate } from "react-icons/gr";
// import { MdDelete, MdOutlineTask, MdOutlineAssignment, MdRemove } from "react-icons/md";
// import { TbPencilMinus } from "react-icons/tb";
// import dayjs from "dayjs";


// function EmployeeTaskList() {
//   const {
//     register,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const userInfoglobal = JSON.parse(
//     localStorage.getItem(`user_info_${domainName}`)
//   );
//   const [currentPage, setCurrentPage] = useState(1);
//   const { taskList, totalTaskCount, loading } = useSelector(
//     (state) => state.employeeTask
//   );
//   const [searchText, setSearchText] = useState("");
//   const [comments, setComments] = useState(null);
//   const limit = 10;
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const onPaginationChange = (page) => {
//     setCurrentPage(page);
//   };

//   const CompanyId = useWatch({
//     control,
//     name: "PDCompanyId",
//     defaultValue: "",
//   });
//   const BranchId = useWatch({
//     control,
//     name: "PDBranchId",
//     defaultValue: "",
//   });
//   const isOverDue = useWatch({
//     control,
//     name: "PDOverdue",
//     defaultValue: "",
//   });
//   const Status = useWatch({
//     control,
//     name: "status",
//     defaultValue: "",
//   });
//   useEffect(() => {
//     userInfoglobal?.userType !== "admin" && userInfoglobal?.userType !== "company" && fetchClientListData();
//   }, [isOverDue, searchText, Status]);

//   const fetchClientListData = () => {
//     let reqData = {
//       page: currentPage,
//       limit: limit,
//       reqPayload: {
//         companyId:
//           userInfoglobal?.userType === "admin"
//             ? CompanyId
//             : userInfoglobal?.userType === "company"
//               ? userInfoglobal?._id
//               : userInfoglobal?.companyId,
//         branchId:
//           userInfoglobal?.userType === "company" ||
//             userInfoglobal?.userType === "admin" ||
//             userInfoglobal?.userType === "companyDirector"
//             ? BranchId
//             : userInfoglobal?.userType === "companyBranch"
//               ? userInfoglobal?._id
//               : userInfoglobal?.branchId,

//         directorId: "",
//         clientId: "",
//         // "employeId": '67695d80a8929f2cf7967ff8',
//         employeId:
//           (userInfoglobal
//             ?.userType !== "admin" && userInfoglobal
//               ?.userType !== "company")
//             ? userInfoglobal?._id
//             : "",
//         taskTypeId: "",
//         groupId: "",
//         text: searchText,
//         sort: true,
//         status: Status,
//         isOverDue: isOverDue,
//         isPagination: false,
//       },
//     };
//     dispatch(getTaskList(reqData));
//   };



//   if (userInfoglobal?.userType !== "employee" ) {
//     return (
//       <GlobalLayout>
//         <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
//           <p className="text-center font-semibold">
//             You are not an employee. This page is viewable for employees only.
//           </p>
//         </div>
//       </GlobalLayout>
//     );
//   }

//   const handleOpenChat = (data) => {

//     setIsChatModalOpen(true); // Open chat modal
//     setComments(data?.taskStatusCommentData); // Set task info if required
//   };

//   const handleCloseChat = () => {
//     setIsChatModalOpen(false);
//     setComments(null);
//   };


//   const handleTaskAccept = (data) => {
//     Swal.fire({
//       title: 'Add a Comment',
//       input: 'textarea',
//       inputLabel: 'Comment (optional)',
//       inputPlaceholder: 'Type your comment here...',
//       inputAttributes: {
//         'aria-label': 'Type your comment here'
//       },
//       showCancelButton: true,
//       confirmButtonText: 'Submit',
//       preConfirm: (comment) => {
//         return comment;
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         const comment = result.value || '';
//         dispatch(statusupdatetaskFunc({
//           _id: data?.taskData?._id,
//           description: comment,
//           status: "Accepted",
//           attachment: [],
//         })
//         ).then((response) => {
//           if (!response?.error) {
//             fetchClientListData();
//             Swal.fire('Success', 'Task accepted successfully!', 'success');
//           } else {
//             Swal.fire('Error', 'Something went wrong!', 'error');
//           }
//         });
//       }
//     });
//   };

//   const onChange = (e) => {

//     setSearchText(e);
//   };

//   return (
//     <GlobalLayout onChange={onChange}>
//       {loading ? (
//         <Loader />
//       ) : (
//         <section>
//           <div className="">
//             <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
//               <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1.5">
//                 <div>
//                   <Controller
//                     control={control}
//                     name="PDOverdue"
//                     render={({ field }) => (
//                       <Select
//                         {...field}
//                         defaultValue={""}
//                         disabled={loading}
//                         className={`${inputAntdSelectClassNameFilter} `}
//                         showSearch
//                         filterOption={(input, option) =>
//                           String(option?.children).toLowerCase().includes(input.toLowerCase())
//                         }
//                       >
//                         <Select.Option value={''}>All Task</Select.Option>
//                         <Select.Option value={true}>Overdue Task</Select.Option>
//                         <Select.Option value={false}>Other Task</Select.Option>
//                       </Select>
//                     )}
//                   />
//                 </div>
//                 <div className="">
//                   <Controller
//                     name="status"
//                     control={control}
//                     render={({ field }) => (
//                       <Select
//                         {...field}
//                         className={`${inputAntdSelectClassNameFilter} ${errors.shift ? "border-[1px]" : "border-gray-300"}`}
//                         placeholder="Select Status"
//                         disabled={loading}
//                         showSearch
//                         filterOption={(input, option) =>
//                           option?.label?.toLowerCase().includes(input.toLowerCase())
//                         }
//                         options={[
//                           { label: "Select Status", value: "" },
//                           ...[
//                             "Assigned", "Accepted", "reAssign_to_other", "Pending_at_client",
//                             "Pending_at_department", "Pending_at_colleague", "Pending_at_manager",
//                             "Work_in_progress", "Pending_for_approval", "Pending_for_fees",
//                             "Completed", "Task_Stop"
//                           ].map(status => ({
//                             label: status,
//                             value: status,
//                           }))
//                         ]}
//                       />
//                     )}
//                   />
//                 </div>
//               </div>
//               <div className="flex justify-end items-center gap-2 ">
//                 <button
//                   onClick={() => {
//                     setValue("PDOverdue", "");
//                     setValue("PDBranchId", '');
//                     setValue("PdDepartmentId", "");
//                     setValue("PdCompanyId", "");
//                     setValue("status", "");
//                   }}
//                   className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
//                   <span className="text-[12px]">Reset</span>
//                 </button>

//                 <Tooltip placement="topLeft"  title='Add Task'>
//                   <button
//                     onClick={() => {
//                       navigate("/admin/task-type/employee-task");
//                     }}
//                     className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
//                   >
//                     <FaPlus />
//                     <span className="text-[12px]">Add Task</span>
//                   </button>
//                 </Tooltip>
//               </div>
//             </div>
//           </div>
//           <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
//             <table className="w-full max-w-full rounded-xl overflow-x-auto ">
//               <thead className="">
//                 <tr className="border-b border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-medium h-[40px]">
//                   <th className="border-none p-2 whitespace-nowrap min-w-[35px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>S.No.</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Client Name</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Department</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[120px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Task Name</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Financial Year</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[90px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Period</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Assigned Date</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Due Date</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap hidden 2xl:table-cell min-w-[100px]">
//                     <div className="flex justify-start items-center space-x-1">
//                       <span>Last Updated At</span>
//                       <button className="flex flex-col -space-y-1.5 cursor-pointer">
//                         <FaAngleUp />
//                         <FaAngleDown />
//                       </button>
//                     </div>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[90px]">
//                     <span>Status</span>
//                   </th>
//                   <th className="border-none p-2 whitespace-nowrap min-w-[70px]">
//                     <span>Action</span>
//                   </th>
//                 </tr>
//               </thead>
//               {loading ? (
//                 <tr className="bg-white bg-opacity-5 ">
//                   <td
//                     colSpan={12}
//                     className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
//                   >
//                     <ListLoader />
//                   </td>
//                 </tr>
//               ) : <tbody>
//                 {taskList && taskList?.length > 0 ? (
//                   taskList?.map((element, index) => (
//                     <tr
//                       className={`text-[13px] ${element?.taskData?.isOverDue
//                         ? "bg-rose-300 text-black"
//                         : element?.taskData?.priority === "high"
//                           ? "bg-[#FFE5B4] text-gray-800"
//                           : element?.taskData?.priority === "medium"
//                             ? "bg-green-300 text-black"
//                             : "bg-white text-[#374151]"
//                         }`}
//                     >
//                       <td className="border-none p-2 min-w-[35px]">
//                         {index + 1 + (currentPage - 1) * limit}
//                       </td>
//                       <td className="border-none p-2 min-w-[100px]">
//                         {element?.taskData?.clientData?.fullName || '-'}
//                       </td>
//                       <td className="border-none p-2 min-w-[100px]">
//                         {element?.taskData?.departmentData?.name || '-'}
//                       </td>
//                       <td className="border-none p-2 min-w-[120px]">
//                         {element?.taskData?.taskName || '-'}
//                       </td>
//                       <td className="border-none p-2 min-w-[100px]">
//                         {element?.taskData?.financialYear || '-'}
//                       </td>
//                       <td className="border-none p-2 min-w-[90px]">
//                         {element?.taskData?.type === 'Monthly' && element?.taskData?.monthName}
//                         {element?.taskData?.type === 'Quaterly' && element?.taskData?.monthQuaters}
//                         {element?.taskData?.type === 'Yearly' && "Yearly"}
//                       </td>
//                       <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
//                         {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
//                       </td>
//                       <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
//                         {moment(element?.taskData?.dueDate).format("DD-MM-YYYY hh:mm a")}
//                       </td>
//                       <td className="border-none p-2 hidden 2xl:table-cell min-w-[100px]">
//                         {moment(element?.updatedAt).format("DD-MM-YYYY hh:mm a")}
//                       </td>
//                       <td className="border-none p-2 min-w-[90px]">
//                         <span
//                           className={`
//         px-2 py-1.5 rounded-lg text-[12px] cursor-pointer hover:opacity-80 border border-header
//         ${element?.taskData?.status === "Assigned"
//                               ? "bg-blue-600 text-white"
//                               : element?.taskData?.status === "Accepted"
//                                 ? "bg-green-600 text-white"
//                                 : element?.taskData?.status === "Pending_at_client"
//                                   ? "bg-yellow-500 text-black"
//                                   : element?.taskData?.status === "Pending_at_department"
//                                     ? "bg-purple-600 text-white"
//                                     : element?.taskData?.status === "Pending_at_colleague"
//                                       ? "bg-teal-500 text-white"
//                                       : element?.taskData?.status === "Pending_at_manager"
//                                         ? "bg-orange-600 text-white"
//                                         : element?.taskData?.status === "Work_in_progress"
//                                           ? "bg-indigo-600 text-white"
//                                           : element?.taskData?.status === "Pending_for_approval"
//                                             ? "bg-pink-500 text-white"
//                                             : element?.taskData?.status === "Pending_for_fees"
//                                               ? "bg-gray-500 text-white"
//                                               : element?.taskData?.status === "Completed"
//                                                 ? "bg-green-800 text-white"
//                                                 : element?.taskData?.status === "Task_Stop"
//                                                   ? "bg-red-700 text-white"
//                                                   : element?.taskData?.status === "reAssign_to_other"
//                                                     ? "bg-cyan-700 text-white"
//                                                     : element?.taskData?.status === "Rejected"
//                                                       ? "bg-rose-800 text-white"
//                                                       : "bg-gray-200 text-black"
//                             }
//       `}
//                         >
//                           {element?.taskData?.status
//                             ?.replace(/_/g, ' ')
//                             .toLowerCase()
//                             .replace(/\b\w/g, char => char.toUpperCase())}
//                         </span>
//                       </td>
//                       <td className="border-none p-2 min-w-[70px]">
//                         <span className="py-1.5 flex justify-start items-center space-x-2">
//                           <button
//                             onClick={() => {
//                               handleTaskAccept(element)
//                             }}
//                             disabled={element?.taskData?.status !== "Assigned"}
//                             className={`px-2 py-1.5 text-xs rounded-md bg-transparent  border-[1.5px] ${element?.taskData?.status === "Assigned" ? "border-black" : 'border-gray-300'} `}
//                             type="button"
//                           >
//                             <BiCheckDouble
//                               className={element?.taskData?.status === "Assigned" ? " hover:text-header  text-header " : "text-gray-400"}
//                               size={16}
//                             />
//                           </button>
//                           <Tooltip placement="topLeft"  title="View">
//                             <button
//                               onClick={() => {
//                                 navigate(
//                                   `/admin/task/view/${encrypt(element?.taskData?._id)}/${encrypt(`employee`)}`
//                                 );
//                               }}
//                               className="px-2 py-1.5 text-xs rounded-md bg-transparent !border-[1.5px] border-header "
//                               type="button"
//                             >
//                               <BsEye
//                                 className=" hover:text-header  text-header "
//                                 size={16}
//                               />
//                             </button>
//                           </Tooltip>


//                           <Dropdown
//                             menu={{
//                               items: [
//                                 {
//                                   key: 'responsive-date-info',
//                                   label: (
//                                     <div className="2xl:hidden block">
//                                       <div className="flex flex-col space-y-1.5">
//                                         <span
//                                           onClick={() =>
//                                             showSwal(dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
//                                           }
//                                           className="flex items-center text-slate-800 hover:text-slate-700"
//                                         >
//                                           <MdOutlineAssignment className="mr-2" size={16} />
//                                           Assigned Date
//                                         </span>
//                                         <span
//                                           onClick={() =>
//                                             showSwal(dayjs(element?.taskData?.dueDate).format('DD-MM-YYYY hh:mm a') || "Data not available")
//                                           }
//                                           className="flex items-center text-purple-800 hover:text-purple-700"
//                                         >
//                                           <MdOutlineTask className="mr-2" size={16} />
//                                           Due Date
//                                         </span>
//                                         <span
//                                           onClick={() =>
//                                             showSwal(dayjs(element?.updatedAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
//                                           }
//                                           className="flex items-center text-teal-700 hover:text-teal-600"
//                                         >
//                                           <GrValidate className="mr-2" size={15} />
//                                           Last Updated On
//                                         </span>
//                                         <span
//                                           onClick={() =>
//                                             showSwal(element?.createdBy || "Data not available")
//                                           }
//                                           className="flex items-center text-sky-800 hover:text-sky-700"
//                                         >
//                                           <TbPencilMinus className="mr-2" size={16} />
//                                           Created By
//                                         </span>
//                                       </div>
//                                     </div>
//                                   ),
//                                 },
//                                 {
//                                   key: 'view-message',
//                                   label: (
//                                     <span
//                                       onClick={() => handleOpenChat(element)}
//                                       className="flex items-center text-header hover:text-header"
//                                     >
//                                       <HiChatAlt className="mr-2" size={16} />
//                                       View Message
//                                     </span>
//                                   ),
//                                 },
//                                 // {
//                                 //   key: 'CreateAt',
//                                 //   label: (
//                                 //     <span
//                                 //       className="flex justify-start items-center gap-1"
//                                 //     // onClick={() => handleOpenChat(element)}
//                                 //     >
//                                 //       {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
//                                 //       {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
//                                 //     </span>
//                                 //   ),
//                                 // },
//                                 // {
//                                 //   key: 'createdBy',
//                                 //   label: (
//                                 //     <span
//                                 //       className="flex justify-start items-center gap-1"
//                                 //     // onClick={() => handleOpenChat(element)}
//                                 //     >
//                                 //       {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
//                                 //       {element?.createdBy}
//                                 //     </span>
//                                 //   ),
//                                 // }

//                               ],
//                             }}
//                             trigger={['click']}
//                           >
//                             <Tooltip placement="topLeft"  title="More Actions">
//                               <button
//                                 className="px-2 py-1.5 text-xs rounded-md bg-transparent border-[1px] border-header"
//                                 type="button"
//                               >
//                                 <PiDotsThreeOutlineVerticalBold
//                                   className="text-header hover:text-header"
//                                   size={16}
//                                 />
//                               </button>
//                             </Tooltip>
//                           </Dropdown>


//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr className="bg-white bg-opacity-5 ">
//                     <td
//                       colSpan={12}
//                       className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
//                     >
//                       Record Not Found
//                     </td>
//                   </tr>
//                 )}
//               </tbody>}
//             </table>
//           </div>

//         </section>
//       )}

//       {isChatModalOpen && (
//         <ChatBox
//           isOpen={isChatModalOpen}
//           onClose={() => handleCloseChat()}
//           comment={comments}
//         />
//       )}
//     </GlobalLayout>
//   );
// }
// export default EmployeeTaskList;
