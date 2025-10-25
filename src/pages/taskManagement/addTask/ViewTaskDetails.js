import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  inputLabelClassNameReactSelect,
  inputDisabledClassName,
  inputAntdSelectClassName,
} from "../../../constents/global";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaRegFile, FaRegFileImage, FaTimes, FaPlus } from "react-icons/fa";
import { deptSearch } from "../../../pages/department/departmentFeatures/_department_reducers";
import { employeSearch } from "../../../pages/employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import {
  gettaskDetails,
  statusupdatetaskFunc,
  updatetaskFunc,
} from "./addTaskFeatures/_addTask_reducers.js";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers.js";
import { taskTypeSearch } from "../taskType/taskFeatures/_task_reducers.js";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers.js";
import moment from "moment";
import { IoIosDocument } from "react-icons/io";
import { AiTwotoneEdit } from "react-icons/ai";
import { Carousel, message, Modal, Select, Skeleton, Tooltip } from "antd";
import Swal from "sweetalert2";
import { BsBorderInner, BsEye } from "react-icons/bs";
import { MdAttachFile, MdLocalPostOffice } from "react-icons/md";
import { elements } from "chart.js";
import Loader2 from "../../../global_layouts/Loader/Loader2.js";
import FileViewerModal from "./FileViewerModal.js";

const ViewTaskDetails = () => {
  const { taskIdEnc, mainType } = useParams();
  const taskId = decrypt(taskIdEnc);
  const mainTypedec = decrypt(mainType);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm();
  const [isPreview, setIsPreview] = useState(false);
  const { employeList } = useSelector((state) => state.employe);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [viewAttachment, setViewAttachment] = useState(false);
  const [viewAttachmentData, setViewAttachmentData] = useState([]);
  const { taskDetailsData, loading } = useSelector((state) => state.addTask);
  useEffect(() => {
    dispatch(gettaskDetails({ _id: taskId }));
  }, []);
  const [attachment, setAttachment] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setAttachment((prev) => [...prev, res?.payload?.data]);
      }
    });
  };
  const handleRemoveFile = (index) => {
    setAttachment((prev) => {
      const updatedAttachments = prev?.filter((_, i) => i !== index);

      return updatedAttachments;
    });
  };


  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  })


  const onSubmit = (data) => {
    dispatch(
      statusupdatetaskFunc({
        _id: taskId,
        description: data?.comments,
        status: data?.status,
        attachment: attachment,
        workedHRS: status == 'Pending_for_approval' ? + data?.workedHRS : 0,
        employeId: (status == 'Pending_at_manager' || status == 'Pending_at_colleague' || status == 'reAssign_to_other') ? data?.employee : null
      })
    ).then((data) => {
      if (!data?.error) {
        dispatch(gettaskDetails({ _id: taskId }));
        reset();
        setValue("status", '')
        setAttachment([]);
      }
    });
  };

  const handleCancel = () => {
    setViewAttachment(false);
  };


  useEffect(() => {
    const reqData = {
      companyId: taskDetailsData?.companyId,
      branchId: taskDetailsData?.branchId,
      departmentId: status == 'reAssign_to_other' ? taskDetailsData?.departmentId : '',
      directorId: "",
      text: "",
      sort: true,
      isManager: status == 'Pending_at_manager' || (mainTypedec === "manager" && status == 'Pending_at_colleague') ? true : false,
      status: true,
      isPagination: false,
    }
    if ((status == 'Pending_at_manager' || status == 'Pending_at_colleague' || status == 'reAssign_to_other')) {
      dispatch(employeSearch(reqData))
    }
  }, [status])



  return (
    <GlobalLayout>
      {loading ?
        <div className="mt-3 p-4">
          <div className="rounded-md grid sm:grid-cols-[1fr_1fr] grid-cols-1 gap-2">

            <div className="rounded-md my-2 bg-white p-4 shadow-md">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>


            <div className="rounded-md my-2 bg-white p-4 shadow-md">
              <Skeleton active paragraph={{ rows: 6 }} />
            </div>
          </div>


          <div className="border rounded-t-xl mt-4 bg-white p-4 shadow-md">
            <Skeleton active paragraph={{ rows: 4 }} />
            <Skeleton.Button active size="large" style={{ width: 200 }} />
          </div>
        </div>
        :
        <section>
          <div className="mt-3 ">
            <div>
              <div className="rounded-md grid sm:grid-cols-[1fr_1fr] grid-cols-1 gap-2">
                <div className=" rounded-md my-2">
                  <div className="flex justify-between items-center mb-3 rounded-t-md">
                    <table className="w-full border-collapse rounded-xl shadow-md overflow-hidden bg-white">
                      <thead className="text-white bg-header ">
                        <tr className="text-white bg-header ">
                          <th>
                            <div className="mt-2 mb-1 ml-2"> Task Details</div>
                          </th>
                          <th>
                            <div className="mt-2 mb-1 ml-2"> </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        <tr className=" hover:bg-indigo-50">
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <IoIosDocument className="size-4 text-header text-lg " />
                              <span className="text-[16px] font-medium">
                                Client Name
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.clientData?.fullName}
                            </span>
                          </td>

                          {taskDetailsData?.clientBranch?.fullName &&
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <MdLocalPostOffice className="size-4 text-header text-lg " />
                                <span className="text-[16px] font-medium">
                                  Client Branch
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {taskDetailsData?.clientBranch?.fullName}
                              </span>
                            </td>

                          }
                        </tr>
                        <tr className=" hover:bg-indigo-50">


                          <td className="p-3  text-gray-600">
                            <div className="flex items-center gap-2">
                              <AiTwotoneEdit className="size-4 text-header text-lg " />
                              <span className="text-[16px] font-medium">
                                Department
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.departmentData?.name}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaRegFileImage className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Task Name
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.taskName}
                            </span>
                          </td>
                        </tr>
                        <tr className=" hover:bg-indigo-50">
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaRegFileImage className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Financial Year
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.financialYear}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaRegFileImage className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Fees
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.fee}
                            </span>
                          </td>
                        </tr>

                        <tr className=" hover:bg-indigo-50">
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaRegFileImage className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Description
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.remarks}
                            </span>
                          </td>

                        </tr>

                        {/* Create Invoice button - show only if status is Completed and isInvoiceGenerated is false */}
                        {taskDetailsData?.status === "Completed" && taskDetailsData?.isInvoiceGenerated === false && (
                          <tr className="hover:bg-indigo-50">
                            <td className="p-3 text-gray-600" colSpan="2">
                              <div className="flex items-center justify-center">
                                <button
                                  onClick={() => {
                                    // Encrypt task data to pass in URL
                                    const taskData = {
                                      taskId: taskDetailsData?._id,
                                      taskName: taskDetailsData?.taskName,
                                      clientId: taskDetailsData?.clientData?._id,
                                      clientName: taskDetailsData?.clientData?.fullName,
                                      departmentId: taskDetailsData?.departmentData?._id,
                                      departmentName: taskDetailsData?.departmentData?.name,
                                      fee: taskDetailsData?.fee,
                                      financialYear: taskDetailsData?.financialYear,
                                      type: taskDetailsData?.type,
                                      monthName: taskDetailsData?.monthName,
                                      monthQuaters: taskDetailsData?.monthQuaters,
                                      remarks: taskDetailsData?.remarks,
                                      dueDate: taskDetailsData?.dueDate,
                                      createdAt: taskDetailsData?.createdAt,
                                      taskTypeId: taskDetailsData?.taskTypeId,
                                      branchId: taskDetailsData?.branchId,
                                      companyId: taskDetailsData?.companyId,
                                    };
                                    
                                    const encryptedTaskData = encrypt(JSON.stringify(taskData));
                                    navigate(`/admin/invoice/create?taskData=${encryptedTaskData}`);
                                  }}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                  type="button"
                                >
                                  <FaPlus className="text-white" size={16} />
                                  <span className="font-medium">Create Invoice</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}

                        {/* Upload document */}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className=" rounded-md my-2">
                  <div className="flex justify-between items-center mb-3 rounded-t-md">
                    <table className="w-full border-collapse rounded-xl shadow-md overflow-hidden bg-white">
                      <thead className="text-white bg-header ">
                        <tr className="text-white bg-header ">
                          <th className="text-white bg-header ">
                            <div className="mt-2 mb-1 ml-2"> Other Details</div>
                          </th>
                          <th className="text-white bg-header ">
                            <div className="mt-2 mb-1 ml-2"> </div>
                          </th>
                          <th className="text-white bg-header ">
                            <div className="mt-2 mb-1 ml-2"> </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm text-gray-700">
                        <tr className=" hover:bg-indigo-50">
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <IoIosDocument className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Assigned To
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.assignTaskList?.map(
                                (assignTo, index) => {
                                  return assignTo?.employeData?.map(
                                    (assignTo, index) => {
                                      return `${assignTo?.fullName} ,`;
                                    }
                                  );
                                }
                              )}
                            </span>
                          </td>
                          <td className="p-3  text-gray-600">
                            <div className="flex items-center gap-2">
                              <AiTwotoneEdit className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Assigned date
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {moment(taskDetailsData?.createdAt).format(
                                "YYYY-MM-DD"
                              )}
                            </span>
                          </td>
                        </tr>
                        <tr className=" hover:bg-indigo-50">
                          <td className="p-3  text-gray-600">
                            <div className="flex items-center gap-2">
                              <AiTwotoneEdit className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Due date
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {moment(taskDetailsData?.dueDate).format(
                                "YYYY-MM-DD"
                              )}
                            </span>
                          </td>
                          <td className="p-3 text-gray-600">
                            <div className="flex items-center gap-2">
                              <FaRegFileImage className="size-4 text-header text-lg" />
                              <span className="text-[16px] font-medium">
                                Type
                              </span>
                            </div>
                            <span className="block text-[15px] ml-4 font-light mt-1">
                              {taskDetailsData?.type}
                            </span>
                          </td>
                        </tr>

                        <tr className=" hover:bg-indigo-50">
                          {taskDetailsData?.monthName !== "" && (
                            <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegFileImage className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Month
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {taskDetailsData?.monthName === ""
                                  ? "not Selected"
                                  : taskDetailsData?.monthName}
                              </span>
                            </td>
                          )}
                          {taskDetailsData?.monthQuaters !== "" && (
                            <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegFileImage className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Quarter
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {taskDetailsData?.monthQuaters === null
                                  ? "not Selected"
                                  : taskDetailsData?.monthQuaters}
                              </span>
                            </td>
                          )}
                          {taskDetailsData?.financialYear !== "" && (
                            <td className="p-3 invisible text-gray-600">
                              <div className="flex  items-center gap-2">
                                <FaRegFileImage className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Financial Year
                                </span>
                              </div>
                              <span className="block  text-[15px] ml-4 font-light mt-1">
                                {taskDetailsData?.financialYear === null
                                  ? "not Selected"
                                  : taskDetailsData?.financialYear}
                              </span>
                            </td>
                          )}
                        </tr>

                        {/* Upload document */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="border rounded-t-xl">
              <div className="w-full overflow-auto rounded-t-xl">
                <table className="min-w-full rounded-t-xl">
                  <thead className="bg-header text-white rounded-t-xl">
                    <tr>
                      <td className="p-2 text-sm whitespace-nowrap">
                        Commented By
                      </td>

                      <td className="p-2 text-sm whitespace-nowrap">
                        Commented
                      </td>
                      <td className="p-2 text-sm whitespace-nowrap">Status</td>
                      <td className="p-2 text-sm whitespace-nowrap">Task Update</td>

                      <td className="p-2 text-sm whitespace-nowrap">Date</td>
                      <td className="p-2 text-sm whitespace-nowrap">
                        Attachment
                      </td>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {taskDetailsData?.taskStatusCommentData.length > 0 ? (
                      taskDetailsData?.taskStatusCommentData?.map(
                        (commentData, index) => {
                          return (
                            <tr>
                              <td className="whitespace-nowrap border-none p-2 !text-sm capitalize">
                                {commentData?.creatorData?.fullName}
                              </td>

                              <td className="whitespace-nowrap border-none p-2 !text-sm min-w-[300px] max-w-[300px] text-wrap">
                                {commentData?.message}
                              </td>
                              <td className="whitespace-nowrap border-none p-2 !text-sm">
                                <span
                                  className={`
                              ${commentData?.status === "Assigned"
                                      ? "bg-blue-500 text-white"
                                      : commentData?.status === "Accepted"
                                        ? "bg-green-500 text-white"
                                        : commentData?.status === "Pending_at_client"
                                          ? "bg-yellow-300 text-black"
                                          : commentData?.status ===
                                            "Pending_at_department"
                                            ? "bg-purple-300 text-black"
                                            : commentData?.status ===
                                              "Pending_at_colleague"
                                              ? "bg-teal-300 text-black"
                                              : commentData?.status === "Pending_at_manager"
                                                ? "bg-orange-300 text-black"
                                                : commentData?.status === "Work_in_progress"
                                                  ? "bg-indigo-500 text-white"
                                                  : commentData?.status ===
                                                    "Pending_for_approval"
                                                    ? "bg-pink-300 text-black"
                                                    : commentData?.status === "Pending_for_fees"
                                                      ? "bg-gray-400 text-black"
                                                      : commentData?.status === "Completed"
                                                        ? "bg-green-600 text-white"
                                                        : commentData?.status === "Task_Stop"
                                                          ? "bg-red-600 text-white"
                                                          : commentData?.status === "Rejected"
                                                            ? "bg-rose-800 text-white"
                                                            : commentData?.status === "reAssign_to_other"
                                                              ? "bg-cyan-700 text-white"
                                                              : "bg-white text-black"
                                    } shadow px-2 py-1.5 rounded-xl text-[12px]`}
                                >
                                  {commentData?.status
                                    ?.replace(/_/g, ' ')
                                    .toLowerCase()
                                    .replace(/\b\w/g, char => char.toUpperCase())}
                                </span>
                              </td>
                              <td className="whitespace-nowrap border-none p-2 !text-sm">
                                {commentData?.status == 'Pending' && `Task Self Assigned By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status == 'Rejected' && `Self Assign Task Rejected By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status == 'Pending_at_client' && `Work Pending At Client Side`}
                                {commentData?.status == 'Pending_at_department' && `Work Pending At Department`}
                                {commentData?.status === 'Assigned' && `Task Assigned By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'request_rejected' && `Reassign Request Rejected By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'Accepted' && `Task Accepted By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'comment_reply' && `${commentData?.creatorData?.fullName} Replied on Comment`}
                                {commentData?.status === 'Task_Stop' && `Task Stopped ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'Work_in_progress' && `Work In Progress By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'reAssign_to_other' && `Reassign to ${commentData?.employeIdData?.fullName ?? ""} Request Sent`}
                                {commentData?.status === 're_assigned' && `Reassigned to ${commentData?.employeIdData?.fullName}`}
                                {commentData?.status === 'Pending_at_colleague' && `Work Pending at ${commentData?.employeIdData?.fullName} Side`}
                                {commentData?.status === 'Pending_at_manager' && `Work Pending at ${commentData?.employeIdData?.fullName} Side`}
                                {commentData?.status === 'Pending_for_approval' && `Work Completion Time -${commentData?.workedHRS} Hours`}
                                {commentData?.status === 'Pending_for_fees' && `Task Pending For Fees`}
                                {commentData?.status === 're_start' && `Task Restarted By ${commentData?.creatorData?.fullName}`}
                                {commentData?.status === 'Completed' && `Task Completed By ${commentData?.creatorData?.fullName}`}
                              </td>
                              <td className="whitespace-nowrap border-none p-2 !text-sm">
                                {moment(commentData?.updatedAt).format("YYYY-MM-DD hh:mm A")}
                              </td>
                              <td>
                                {commentData?.attachment?.length > 0 ? (
                                  <Tooltip placement="topLeft"
                                    title={`View Attachment ( ${commentData?.attachment.length})`}
                                  >
                                    <button

                                      onClick={() => {
                                        setViewAttachmentData(
                                          commentData?.attachment
                                        );
                                        setViewAttachment(true);
                                      }}
                                      className={`px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted relative`}
                                      type="button"
                                    >
                                      <MdAttachFile
                                        className={` text-[#3c8dbc]  ${commentData?.attachment?.length == 0
                                          ? "text-gray-400"
                                          : "hover:text-[#337ab7]"
                                          }`}
                                        size={16}
                                      />
                                      {/* Badge to show attachment length */}
                                      <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-[8px] text-white bg-cyan-700 rounded-full px-1.5 py-0.5">
                                        {commentData?.attachment.length}
                                      </span>
                                    </button>
                                  </Tooltip>
                                ) : (
                                  <Tooltip placement="topLeft" title="No Attachment Available">
                                    <button
                                      className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                      type="button"
                                    >
                                      <MdAttachFile
                                        className="hover:text-gray-700 text-gray-800"
                                        size={16}
                                      />
                                    </button>
                                  </Tooltip>
                                )}
                              </td>
                            </tr>
                          );
                        }
                      )
                    ) : (
                      <tr className="bg-white bg-opacity-5 ">
                        <td
                          colSpan={10}
                          className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                        >
                          Record Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {((mainTypedec === "manager" && taskDetailsData?.status !== "Assigned" && taskDetailsData?.status !== "Rejected" && taskDetailsData?.status !== "Pending" && taskDetailsData?.status !== "Completed") ||
                (mainTypedec !== "manager" && taskDetailsData?.status !== "Completed" && taskDetailsData?.status !== "Rejected" && taskDetailsData?.status !== "Pending" && taskDetailsData?.status !== "Assigned" && taskDetailsData?.status !== "Task_Stop" && taskDetailsData?.status !== "Pending_for_approval" && taskDetailsData?.status !== 'reAssign_to_other')) && (
                  <form
                    autoComplete="off"
                    className=" mt-2 rounded-xl"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="p-2">
                      <div className={(status == 'Pending_at_manager' || status == 'Pending_at_colleague' || status == 'reAssign_to_other' || status == 'Pending_for_approval') ? "grid grid-cols-3 gap-2" : "grid grid-cols-2 gap-2"}>
                        <div className="text-header">
                          <div className="w-full ">
                            <input
                              {...register("comments")}
                              type="text"
                              placeholder="write comments"
                              className={`${inputClassName} `}
                            ></input>
                          </div>
                        </div>
                        <div className="">
                          <Controller
                            control={control}
                            name="status"
                            rules={{ required: "status is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                defaultValue={""}
                                className={`${inputAntdSelectClassName} mt-2`}
                              >
                                <Select.Option value="" selected>
                                  {" "}
                                  Select a status
                                </Select.Option>
                                {/* <Select.Option value="Accepted">
                                Accepted
                              </Select.Option>  */}
                                {/* {mainTypedec !== "manager" && */}
                                <Select.Option value="Pending_at_client">
                                  Pending at Client
                                </Select.Option>
                                {/* // }    */}
                                <Select.Option value="Pending_at_department">
                                  Pending at Department{" "}
                                </Select.Option>
                                && <Select.Option value="Pending_at_colleague">
                                  {" "}
                                  Pending at Colleague{" "}
                                </Select.Option>
                                {mainTypedec !== "manager" && <Select.Option value="Pending_at_manager">
                                  Pending at Manager
                                </Select.Option>}
                                <Select.Option value="Work_in_progress">
                                  Work in Progress
                                </Select.Option>
                                {mainTypedec !== "manager" && <Select.Option value="reAssign_to_other">
                                  Reassign To Other
                                </Select.Option>}
                                {mainTypedec !== "manager" && <Select.Option value="Pending_for_approval">
                                  Pending for Approval{" "}
                                </Select.Option>}
                                <Select.Option value="Task_Stop">
                                  Task Stop
                                </Select.Option>
                                {mainTypedec === "manager" && (
                                  <Select.Option value="Completed">
                                    Completed
                                  </Select.Option>
                                )}
                                {/* {mainTypedec === "manager" && ( */}
                                <Select.Option value="Pending_for_fees">
                                  Pending for Fees
                                </Select.Option>
                                {/* )} */}
                                {mainTypedec === "manager" && (
                                  <Select.Option value="re_start">
                                    Task Restart
                                  </Select.Option>
                                )}
                              </Select>
                            )}
                          />
                        </div>
                        {(status == 'Pending_at_manager' || status == 'Pending_at_colleague' || status == 'reAssign_to_other') &&
                          <div className="">
                            <Controller
                              control={control}
                              name="employee"
                              rules={{ required: "employee is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  defaultValue={""}
                                  showSearch
                                  filterOption={(input, option) =>
                                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                                  }
                                  className={`${inputAntdSelectClassName} mt-2`}
                                >
                                  <Select.Option value="" selected>
                                    {" "}
                                    Select Employee
                                  </Select.Option>
                                  {
                                    employeList?.map((element, index) => {
                                      return (<Select.Option key={index} value={element?._id}>
                                        {element?.fullName}
                                      </Select.Option>)
                                    })

                                  }


                                </Select>
                              )}
                            />
                          </div>
                        }
                        {status == 'Pending_for_approval' && <div className="w-full ">
                          <input
                            {...register("workedHRS")}
                            type="number"
                            placeholder="Working Hours"
                            className={`${inputClassName} `}
                          ></input>
                        </div>}
                      </div>
                      <div className="  pt-2 mt-1">
                        {!isPreview ? (
                          <div className="space-y-4">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <label
                              htmlFor="file-upload"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                            >
                              <FaRegFile className="mr-2" /> Add Attachments
                            </label>

                            <div className="space-y-2">
                              {attachment?.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                                >
                                  <a
                                    href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                    className="flex items-center space-x-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <FaRegFile className="text-gray-500" />
                                    <span className="text-sm text-gray-600">
                                      {file}
                                    </span>
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2"></div>
                        )}
                      </div>
                      <div className="flex justify-end col-span-2 mt-4">
                        <button
                          type="submit"
                          className="bg-header text-white p-2 px-4 rounded"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                )}
            </div>  
          </div>
          <FileViewerModal
            visible={viewAttachment}
            onCancel={handleCancel}
            fileData={viewAttachmentData}
            domain={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public`}
          />
          {/* <Modal
          visible={viewAttachment}
          onCancel={handleCancel}
          className="antmodalclassName"
          footer={null}
          width="800px"
          destroyOnClose
        >
          <div className="flex gap-2 flex-wrap mt-4">
            {viewAttachmentData?.map((filePath, index) => {
              const fileExtension = filePath.split(".").pop().toLowerCase();
              const isImage = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
              ].includes(fileExtension);
              const isPdf = fileExtension === "pdf";

              return (
                <div
                  key={index}
                  style={{
                    flex: "1 1 calc(33.333% - 10px)",
                    marginBottom: "20px",
                  }}
                >
                  {isImage ? (
                    // If it's an image, show the image
                    <a
                      href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                        alt={`attachment-${index}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          borderRadius: "8px",
                        }}
                      />
                    </a>
                  ) : isPdf ? (
                    <a
                      href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                      >
                        <iframe
                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                          title={`attachment-${index}`}
                          style={{ width: "100%", height: "100%" }}
                        ></iframe>
                      </div>
                    </a>
                  ) : (
                    <p>Unsupported file type</p>
                  )}
                </div>
              );
            })}
          </div>
        </Modal> */}
        </section>}
    </GlobalLayout>
  );
};

export default ViewTaskDetails;
