import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaSearch, FaUser } from "react-icons/fa";
import { HiChatAlt, HiOutlineFilter, HiViewGrid } from "react-icons/hi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { AiOutlineMessage } from "react-icons/ai";
import {
  domainName,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
  pazeSizeReport,
  showSwal,
  statusMapping,
} from "../../../constents/global";
import {
  getClientList,
  deleteClientFunc,
} from "../../client/clientManagement/clientFeatures/_client_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import {
  deletetaskFunc,
  getTaskList,
  statusupdatetaskFunc,
} from "./addTaskFeatures/_addTask_reducers";
import moment from "moment";
import ChatBox from "../employeeAddTask/ChatBox";
import { BsEye } from "react-icons/bs";
import { Modal, Select, Spin, Tooltip, Dropdown } from "antd";
import usePermissions from "../../../config/usePermissions";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { employeSearch, getEmployeDetails } from "../../employeManagement/employeFeatures/_employe_reducers";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { BiCheckCircle } from "react-icons/bi";
import { MdDelete, MdOutlineTask, MdRemove } from "react-icons/md";
import { CLIENT_TASK_STATUS_ARR } from "../../../constents/ActionConstent";
import ListLoader from "../../../global_layouts/ListLoader";
import dayjs from "dayjs";
import { GrValidate } from "react-icons/gr";
import { MdOutlineAssignment } from "react-icons/md";
import { TbPencilMinus } from "react-icons/tb";


function ManagerTaskList() {


  

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [comments, setComments] = useState(null);
  const userInfoglobal = JSON.parse( localStorage.getItem(`user_info_${domainName}`));
  const { employeList } = useSelector((state) => state.employe);
  const { taskList, totalTaskCount, loading } = useSelector((state) => state.addTask);
  const { employeDetailsData } = useSelector((state) => state.employe);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [EmployeeViewModal, setEmployeeViewModal] = useState({
    isOpen: false,
    data: null
  });
  const [searchParams, setSearchParams] = useSearchParams();
 const initialPage = parseInt(searchParams.get('page')) || 1;
  const initialLimit = parseInt(searchParams.get('limit')) || 10;
  const initialEmployeeId = searchParams.get('employeeId') || '';
  const initialStatus = searchParams.get('status') || '';
  const initialOverdue = searchParams.get('overdue') || '';




 const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [employeeId, setEmployeeId] = useState(initialEmployeeId);
  const [status, setStatus] = useState(initialStatus);
  const [isOverDue, setIsOverDue] = useState(initialOverdue);
  const [searchText, setSearchText] = useState('');

 useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set('page', currentPage);
    if (limit !== 10) params.set('limit', limit);
    if (employeeId) params.set('employeeId', employeeId);
    if (status) params.set('status', status);
    if (isOverDue) params.set('overdue', isOverDue);
    setSearchParams(params);
  }, [currentPage, limit, employeeId, status, isOverDue, searchText]);
  useEffect(() => {
    if(userInfoglobal?.roleKey == "manager" && userInfoglobal?.userType == "employee"){
      fetchClientListData();
    }
    
  }, [currentPage, limit,  employeeId, status, isOverDue, searchText]);
  

  const handleResetFilters = () => {
    setCurrentPage(1);
    setLimit(10);
    setEmployeeId('');
    setStatus('');
    setIsOverDue('');
    setSearchText('');
  };
  const onChange = (e) => {
    setSearchText(e);
  
  };





  const handlePageSizeChange = (e) => {
    setLimit(Number(e));
    setCurrentPage(Number(1))
  };
  const onPaginationChange = (page) => setCurrentPage(page)

  const handleEmployeeChange = (value) => {
    setEmployeeId(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleOverdueChange = (value) => {
    setIsOverDue(value);
    setCurrentPage(1);
  };
  const fetchClientListData = () => {
    let reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        companyId:       userInfoglobal?.companyId,
        branchId:  userInfoglobal?.branchId,
        departmentId: userInfoglobal?.departmentId ?? '',
        directorId: "",
        clientId: "",
        employeId: employeeId,
        taskTypeId: "",
        groupId: "",
        text: searchText,
        sort: true,
        status: status ? status : CLIENT_TASK_STATUS_ARR.filter(
          status => status !== 'Completed' && status !== 'Task_Stop'
        ),
        isOverDue: isOverDue === 'true' ? true : isOverDue === 'false' ? false : '',
        isPagination: true,
      },
    };
    dispatch(getTaskList(reqData));
  };


  useEffect(() => {
    if (selectedEmployee) {
      const reqData = { _id: selectedEmployee?._id };
      dispatch(getEmployeDetails(reqData));
    }
  }, [selectedEmployee]);
    useEffect(() => {

    dispatch(
      branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
      })
    )
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
      })
    )

  }, []);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();


  const handleEmployeeFocus = () => {
    dispatch(
      employeSearch({
        companyId: userInfoglobal?.companyId,
        branchId:userInfoglobal?.branchId,
        departmentId: userInfoglobal?.departmentId  ? userInfoglobal?.departmentId  : '',
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: false,
        isDirector: false,
      })
    )
  };

  const handleImageClick = (employee) => {
    setSelectedEmployee(employee);
    setModalOpen(true);
  }
  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmployee(null);
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
        dispatch(deletetaskFunc(reqData)).then((data) => {
          // fetchClientListData();
          if (currentPage > 1 && taskList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchClientListData();
          }
        });
      }
    });
  };


  const handleOpenChat = (data) => {
    setIsChatModalOpen(true);
    setComments(data?.commentData);
  };

  const handleCloseChat = () => {
    setIsChatModalOpen(false);
    setComments(null);
  };


  if(!(userInfoglobal?.roleKey === "manager" && userInfoglobal?.userType === "employee")) {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not a Manager. This page is viewable for Manager only.
          </p>
        </div>
      </GlobalLayout>
    );
  }

  return (
    <GlobalLayout onChange={onChange}>

      <section>
        <div>
          <div className="space-y-1">
            <div className="2xl:flex justify-between items-center space-y-1.5 overflow-y-auto py-1">
              {/* <div class="xl:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto"> */}
              <div className="grid sm:grid-cols-3 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:flex xl:gap-3 gap-1.5">
               
                
                
                <div className="">
                  <Select
                    value={employeeId}
                    onChange={handleEmployeeChange}
                    disabled={loading}
                    showSearch
                    filterOption={(input, option) =>
                      option?.label?.toLowerCase().includes(input.toLowerCase())
                    }
                    className={`${inputAntdSelectClassNameFilter} `}
                    placeholder="Select Employee"
                    onFocus={handleEmployeeFocus}
                    options={[
                      { label: "Select Employee", value: '' },
                      ...(employeList || []).map((element) => ({
                        label: element.fullName,
                        value: element._id,
                      })),
                    ]}
                  />
                </div>
                
                <div className="">
                  <Select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={loading}
                    defaultValue=""
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    {CLIENT_TASK_STATUS_ARR.filter(
                      status => status !== 'Completed' && status !== 'Task_Stop'
                    )?.map(dataStatus => (
                      <Select.Option value={dataStatus}>
                        {dataStatus?.replace(/_/g, ' ')
                          .toLowerCase()
                          .replace(/\b\w/g, char => char.toUpperCase())}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                
                <div>
                  <Select
                    value={isOverDue}
                    onChange={handleOverdueChange}
                    defaultValue=""
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
              
             
            </div>
            
            
              {/* </div> */}
              <div className="flex justify-end items-center gap-2 ">
                <button
                  onClick={() => {
                  handleResetFilters();

                  }}
                  className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                  <span className="text-[12px]">Reset</span>
                </button>
                {canCreate && (
                  <Tooltip placement="topLeft"  title='Add Task'>
                    <button
                      onClick={() => {
                        navigate("/admin/task/create");
                      }}
                      className="bg-header px-2 py-1.5 rounded-md flex justify-center whitespace-nowrap items-center space-x-2 text-white"
                    >
                      <FaPlus />
                      <span className="text-[12px]">Add Task</span>
                    </button>
                  </Tooltip>)}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-light text-gray-500">
                Rows per page:
              </span>
              <Select
                value={limit}
                onChange={handlePageSizeChange}
                className="text-sm font-light text-gray-700 bg-white border border-gray-200 rounded-md px-3 py-1.5 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-300 transition"
              >
                {pazeSizeReport.map((size) => (
                  <Select.Option key={size} value={size}>
                    {size}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            {canRead && (
              <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                <thead className="bg-header text-white text-[12px] font-[500]">
                  <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                    <th className="p-2 whitespace-nowrap text-left w-[50px]">S.No.</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[135px]">Client Name</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[115px]">Department</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[135px]">Task Name</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[125px]">Assign To</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[85px]">Financial Year</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[85px]">Period</th>
                    <th className="p-2 whitespace-nowrap text-left hidden 2xl:table-cell min-w-[95px]">Assigned Date</th>
                    <th className="p-2 whitespace-nowrap text-left hidden 2xl:table-cell min-w-[95px]">Due Date</th>
                    <th className="p-2 whitespace-nowrap text-left hidden 2xl:table-cell min-w-[125px]">Last Updated On</th>
                    <th className="p-2 whitespace-nowrap text-left min-w-[75px]">Status</th>
                    {(canUpdate || canDelete || canRead) && (
                      <th className="p-2 whitespace-nowrap text-left w-[75px]">Action</th>
                    )}
                  </tr>
                </thead>

                {loading ? <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={12}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr> :
                  <tbody>
                    {taskList && taskList.length > 0 ? (
                      taskList.map((element, index) => (
                        <tr
                          className={` !text-xs 
                          ${element?.isOverDue ? "bg-rose-300 text-gray-800" :
                              element?.priority == "high" ? "bg-[#FFE5B4] text-gray-800" :
                                element?.priority == "medium" ? "bg-green-300 text-gray-800" : "bg-white text-[#374151]"
                            }
                          border-b-[1px] border-[#DDDDDD]  text-[14px]`}>
                          <td className="p-2 text-left w-[50px]">
                            {index + 1 + (currentPage - 1) * limit}
                          </td>
                          <td className="p-2 text-left min-w-[135px]">
                            {element?.clientData?.fullName}
                          </td>
                          <td className="p-2 text-left min-w-[115px]">
                            {element?.departmentData?.name}
                          </td>
                          <td className="p-2 text-left min-w-[135px]">
                            {element?.taskName}
                          </td>
                          <td className="p-2 text-left min-w-[125px]">
                            <div className="flex gap-1 items-center">
                              <span>{element?.assignedEmployeData?.[0]?.fullName}</span>
                              {element?.assignedEmployeData?.length > 1 && (
                                <span className="text-header flex items-center gap-1">
                                  +
                                  <span className="h-5 w-5 bg-header text-white text-[12px] rounded-full flex items-center justify-center">
                                    {element?.assignedEmployeData?.length - 1}
                                  </span>
                                </span>
                              )}
                              <FaEye
                                className="text-[#374151] text-[14px] cursor-pointer"
                                onClick={() =>
                                  setEmployeeViewModal({ isOpen: true, data: element })
                                }
                              />
                            </div>
                          </td>
                          <td className="p-2 text-left min-w-[85px]">
                            {element?.financialYear || "-"}
                          </td>
                          <td className="p-2 text-left min-w-[85px]">
                            {element?.type === "Monthly" && element?.monthName}
                            {element?.type === "Quaterly" && element?.monthQuaters}
                            {element?.type === "Yearly" && "Yearly"}
                          </td>
                          <td className="p-2 text-left hidden 2xl:table-cell min-w-[95px]">
                            {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                          </td>
                          <td className="p-2 text-left hidden 2xl:table-cell min-w-[95px]">
                            {moment(element?.dueDate).format("DD-MM-YYYY hh:mm a")}
                          </td>
                          <td className="p-2 text-left hidden 2xl:table-cell min-w-[125px]">
                            {moment(element?.updatedAt).format("DD-MM-YYYY hh:mm a")}
                          </td>
                          <td className="p-2 text-left min-w-[75px]">
                            <span
                              className={`
                              ${element?.status === "Assigned"
                                  ? "bg-blue-500 text-white"
                                  : element?.status === "Accepted"
                                    ? "bg-green-500 text-white"
                                    : element?.status === "Pending_at_client"
                                      ? "bg-yellow-300 text-black"
                                      : element?.status === "Pending_at_department"
                                        ? "bg-purple-300 text-black"
                                        : element?.status === "Pending_at_colleague"
                                          ? "bg-teal-300 text-black"
                                          : element?.status === "Pending_at_manager"
                                            ? "bg-orange-300 text-black"
                                            : element?.status === "Work_in_progress"
                                              ? "bg-indigo-500 text-white"
                                              : element?.status === "Pending_for_approval"
                                                ? "bg-pink-300 text-black"
                                                : element?.status === "Pending_for_fees"
                                                  ? "bg-gray-400 text-black"
                                                  : element?.status === "Completed"
                                                    ? "bg-green-600 text-white"
                                                    : element?.status === "Task_Stop"
                                                      ? "bg-red-600 text-white"
                                                      : element?.status === "Rejected"
                                                        ? "bg-rose-800 text-white"
                                                        : element?.status === "reAssign_to_other"
                                                          ? "bg-cyan-700 text-white"
                                                          : "bg-white text-black"
                                } border-header border-[1px] px-2 py-1.5 rounded-lg whitespace-nowrap text-[12px]`}

                            >
                              {element?.status
                                ?.replace(/_/g, ' ')
                                .toLowerCase()
                                .replace(/\b\w/g, char => char.toUpperCase())}

                            </span>
                          </td>
                          {(canUpdate || canDelete || canRead) && (
                            <td className="p-2 text-left w-[75px]">
                              <span className="py-1.5 flex justify-start items-center space-x-2">
                                {canRead && (
                                  <Tooltip placement="topLeft"  title="View Task">
                                    <button
                                      onClick={() => {
                                        navigate(
                                          `/admin/task/view/${encrypt(
                                            element?._id
                                          )}/${encrypt(`manager`)}`
                                        );
                                      }}
                                      className="px-2 py-1.5 text-xs rounded-md bg-transparent border-gray-800 border-[1.5px]"
                                      type="button"
                                    >
                                      <BsEye
                                        className=" hover:text-gray-800 text-gray-800"
                                        size={16}
                                      />
                                    </button>
                                  </Tooltip>
                                )}

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
                                                  showSwal(dayjs(element?.dueDate).format('DD-MM-YYYY hh:mm a') || "Data not available")
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
                                      ...(canUpdate
                                        ? [{
                                          key: 'edit-task',
                                          label: (
                                            <span

                                              className={`flex justify-start items-center gap-1 ${element?.status !== 'Assigned' ? 'text-gray-500' : ''}`}
                                            >
                                              <FaPenToSquare
                                                className={`mr-2 ${element?.status !== 'Assigned' ? 'text-gray-500' : 'text-[#3c8dbc] hover:text-[#337ab7]'}`}
                                                size={16}
                                              />
                                              {'Edit Task'}
                                            </span>
                                          ),
                                          disabled: element?.status !== 'Assigned',
                                          onClick: () => {
                                            if (element?.status === 'Assigned') {
                                              navigate(`/admin/task/edit/${encrypt(element?._id)}`);
                                            }
                                          }
                                        }]
                                        : []),
                                      ...(canRead
                                        ? [{
                                          key: 'view-description',
                                          label: (
                                            <span
                                              className="flex justify-start items-center gap-1"
                                              onClick={() => handleOpenChat(element)}>
                                              <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} />
                                              View Description
                                            </span>
                                          ),
                                        }]
                                        : []),
                                      ...((canDelete && userInfoglobal?.userType !== "company")
                                        ? [{
                                          key: 'delete-task',
                                          label: (
                                            <span
                                              onClick={() => {
                                                if (element?.status === 'Assigned') handleDelete(element?._id);
                                              }}
                                              className={`flex justify-start items-center gap-1 ${element?.status !== 'Assigned' ? 'text-gray-500' : 'text-red-500'}`}
                                            >
                                              <RiDeleteBin5Line
                                                className={`mr-2 ${element?.status === 'Assigned'
                                                  ? 'text-red-600 hover:text-red-500'
                                                  : 'text-gray-500'
                                                  }`}
                                                size={16}
                                              />
                                              {'Delete Task'}
                                            </span>
                                          ),
                                        }]
                                        : []),
                                      ...(userInfoglobal?.userType === "company"
                                        ? [{
                                          key: 'delete-task',
                                          label: (
                                            <span
                                              onClick={() => {
                                                handleDelete(element?._id);
                                              }}
                                              className={`flex justify-start items-center gap-1  text-red-500`}
                                            >
                                              <RiDeleteBin5Line
                                                className={`mr-2 ${'text-red-600 hover:text-red-500'}`}
                                                size={16}
                                              />
                                              {'Delete Task'}
                                            </span>
                                          ),
                                        }]
                                        : []),

                                      // ...(canRead
                                      //   ? [{
                                      //     key: 'createdAt',
                                      //     label: (
                                      //       <span
                                      //         className="flex justify-start items-center gap-1"
                                      //       // onClick={() => handleOpenChat(element)}
                                      //       >
                                      //         {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                      //         {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                                      //       </span>
                                      //     ),
                                      //   }]
                                      //   : []),

                                      // ...(canRead
                                      //   ? [{
                                      //     key: 'createdBy',
                                      //     label: (
                                      //       <span
                                      //         className="flex justify-start items-center gap-1"
                                      //       // onClick={() => handleOpenChat(element)}
                                      //       >
                                      //         {/* <HiChatAlt className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} /> */}
                                      //         {element?.createdBy}
                                      //       </span>
                                      //     ),
                                      //   }]
                                      //   : []),
                                    ],
                                  }}
                                  trigger={['click']}
                                >
                                  <button
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border-gray-800 border-[1.5px]"
                                    type="button"
                                  >
                                    <PiDotsThreeOutlineVerticalBold
                                      className=" hover:text-gray-900 text-gray-900"
                                      size={16}
                                    />
                                  </button>
                                </Dropdown>
                              </span>
                            </td>
                          )}
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
            )}
          </div>
          {
            taskList?.length > 0 && (
              <CustomPagination
                totalCount={totalTaskCount}
                pageSize={limit}
                currentPage={currentPage}
                onChange={onPaginationChange}
              />
            )}
        </div>
      </section>

      {
        isChatModalOpen && (
          <ChatBox
            isOpen={isChatModalOpen}
            onClose={() => handleCloseChat()}
            comment={comments}
          />
        )
      }
      <Modal
        title="Employee List"
        visible={EmployeeViewModal?.isOpen}
        onCancel={() => setEmployeeViewModal({
          isOpen: false,
          employee: null,
        })}
        className="antmodalclassName"
        footer={[
          <button
            key="close"
            onClick={() => setEmployeeViewModal({
              isOpen: false,
              employee: null,
            })}
            className=" capitalize px-2 py-1 rounded-sm bg-header text-white"
          >
            Close
          </button>
        ]}
        width={800}
        centered
      >
        <div className="flex items-center">

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {EmployeeViewModal?.data?.assignedEmployeData?.map((element) => (
              <div
                key={element.id}
                onClick={() => handleImageClick(element)}
                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-all shadow-sm hover:shadow-md border border-gray-100"
              >
                {/* Avatar with subtle ring */}
                <div className="w-16 h-16 mb-2 rounded-full overflow-hidden ring-2 ring-amber-100">
                  <img
                    alt={element.fullName}
                    src={
                      element.profileImage
                        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`
                        : "/images/avatar.jpg"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name + Role (if available) */}
                <div className="text-center">
                  <p className="font-medium text-gray-800 truncate max-w-[100px]">
                    {element.fullName}
                  </p>
                  {element.designation && (
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[100px]">
                      {element.designation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Modal
          title="Employee Details"
          visible={modalOpen}
          onCancel={closeModal}
          className="antmodalclassName"
          footer={[
            <button
              key="close"
              onClick={closeModal}
              className=" capitalize px-2 py-1 rounded-sm bg-header text-white"
            >
              Close
            </button>
          ]}
          width={600}
          centered
        >
          {loading ? (
            <div className="flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            employeDetailsData?.data && (
              <div className="mt-4">
                <div className="flex flex-col md:flex-row items-center">
                  <img
                    alt=""
                    src={
                      employeDetailsData?.data?.profileImage
                        ? `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${employeDetailsData?.data?.profileImage}`
                        : `/images/avatar.jpg`
                    }
                    className="rounded-full w-16 h-16 ring-2 ring-amber-300"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{employeDetailsData?.data?.fullName}</p>
                    <p>{employeDetailsData?.data?.designationData?.name}</p>
                    <p>{employeDetailsData?.data?.email}</p>
                    <p>{employeDetailsData?.data?.companyData?.fullName}</p>
                    <p>{employeDetailsData?.data?.departmentData?.name}</p>
                    <p>{employeDetailsData?.data?.branchData?.fullName}</p>
                    <p>
                      {employeDetailsData?.data?.mobile?.code} {employeDetailsData?.data?.mobile?.number}
                    </p>
                    {/* Additional Info */}
                    <div className="mt-3">
                      <p>
                        <strong>Office Email:</strong> {employeDetailsData?.data?.officeEmail}
                      </p>
                      <p>
                        <strong>User Name:</strong> {employeDetailsData?.data?.userName}
                      </p>
                      <p>
                        <strong>Status:</strong> {employeDetailsData?.data?.status ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )
          )}
        </Modal>
      </Modal>

    </GlobalLayout >
  );
}
export default ManagerTaskList;