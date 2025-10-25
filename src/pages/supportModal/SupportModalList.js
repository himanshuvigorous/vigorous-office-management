import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import getUserIds from "../../constents/getUserIds";
import {
  getSupportList,
  statusupdateSupportFunc,
} from "./supportFeatures/_supportmodal_reducer";
import Loader2 from "../../global_layouts/Loader/Loader2";
import { Modal, Select, Tooltip } from "antd";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import usePermissions from "../../config/usePermissions";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import moment from "moment";
import { MdOutlineChangeCircle } from "react-icons/md";
import Loader from "../../global_layouts/Loader";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
  inputLabelClassName,
} from "../../constents/global";
import { FaEye, FaImages, FaIndustry, FaRegAddressCard } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import { IoPersonSharp } from "react-icons/io5";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import ListLoader from "../../global_layouts/ListLoader";

const SupportModalList = () => {
  const {
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const [viewSupportDetails, setViewSupportDetails] = useState(false);
  const { SupportList, loading, totalSupportCount } = useSelector(
    (state) => state.supportModal
  );
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const [viewAttachment, setViewAttachment] = useState(false)
  const [viewAttachmentData, setViewAttachmentData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
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



  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();

  useEffect(() => {
    fetchSupportList();
  }, [CompanyId, BranchId, Status]);



  const fetchSupportList = () => {
    const payload = {
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.userType === "employee" ? userCompanyId : CompanyId,
      directorId: userDirectorId,
      branchId: userType == 'companyBranch' ? userInfoglobal?._id : userInfoglobal?.userType === "employee" ? userBranchId : BranchId,
      page: currentPage,
      limit: limit,
      text: "",
      sort: '',
      status: Status,
      isPagination: true,
    };
    dispatch(getSupportList(payload));
  };

  const changeStatus = (e, element) => {
    const payload = {
      _id: element?._id,
      status: e.target.value,
    };
    dispatch(statusupdateSupportFunc(payload)).then((data) => {
      fetchSupportList();
    });
  };
  const [data, setData] = useState();
  const handleViewStatusDetails = (element) => {
    setViewSupportDetails((prev) => !prev);
    setData(element);
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
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
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
      <div className="grid sm:grid xl:grid-cols-6 lg:grid-cols-3 grid-cols-1 gap-2 sm:justify-between items-center py-1 px-2 text-[14px] rounded-md">
        {userInfoglobal?.userType === "admin" && (
          <div className="">

            <Controller
              name="PDCompanyId"
              control={control}
              rules={{
                required: "Company is required",
              }}
              render={({ field }) => (
                <Select
                  {...field}
                  className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Select Company"
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Company</Select.Option>
                  { companyListLoading ? (
                    <Select.Option disabled>
                      <ListLoader />
                    </Select.Option>
                  ) : companyList?.map((element) => (
                    <Select.Option value={element?._id}>
                      {" "}
                      {element?.fullName}{" "}
                    </Select.Option>
                  ))}
                </Select>
              )}
            />
            {errors.PDCompanyId && (
              <p className="text-red-500 text-sm">
                {errors.PDCompanyId.message}
              </p>
            )}
          </div>
        )}
        {(userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "companyDirector") && (
            <div className="">

              <Controller
                name="PDBranchId"
                control={control}
                rules={{
                  required: "Branch is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Branch"
                    showSearch
                    filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : branchList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {" "}
                        {element?.fullName}{" "}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>
          )}
        <Controller
          name="status"
          control={control}
          rules={{}}
          render={({ field }) => (
            <Select
              {...field}
              className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"
                }`}
              placeholder="Select Status"
              showSearch
              filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
              }
            >

              <Select.Option value="">Select Status</Select.Option>

              <Select.Option value="Rejected"> Rejected </Select.Option>
              <Select.Option value="Resolved"> Resolved </Select.Option>
              <Select.Option value="Open"> Open </Select.Option>

            </Select>
          )}
        />
        <button
          onClick={() => {
            setValue("PDBranchId", "");
            setValue("PDCompanyId", "");
            setValue("status", "");
          }}
          className="bg-header w-56  py-[6px] my-0.5 rounded-md flex px-5 justify-center items-center  text-white"
        >
          <span className="text-[12px]">Reset</span>
        </button>
      </div>
      <div className="w-full overflow-x-auto bg-white">
        <table className="w-full max-w-full rounded-xl  ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500]  h-[40px]">
              <th className="border-none p-2 whitespace-nowrap w-[5%]">
                <div className="flex justify-start items-center space-x-1">
                  <span>S.No.</span>
                </div>
              </th>
              <th className="border-none p-2 whitespace-nowrap w-[10%]">
                <div className="flex justify-start items-center space-x-1">
                  <span>Title</span>
                </div>
              </th>
              <th className="border-none p-2 whitespace-nowrap w-[10%]">
                <div className="flex justify-start items-center space-x-1">
                  <span>Description</span>
                </div>
              </th>
              <th className="border-none p-2 whitespace-nowrap w-[10%]">
                <div className="flex justify-start items-center space-x-1">
                  <span>Attachements</span>
                </div>
              </th>


              <th className="border-none p-2 whitespace-nowrap">
                <div className="flex justify-start items-center space-x-1">
                  <span>created By</span>
                </div>
              </th>
              <th className="border-none p-2 whitespace-nowrap">
                <div className="flex justify-start items-center space-x-1">
                  <span>created At </span>
                </div>
              </th>

              <th className="border-none p-2 whitespace-nowrap">Status</th>

              <th className="border-none p-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          {loading ? (
            <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr>
          ) : (
            <tbody>
              {SupportList && SupportList?.length > 0 ? (
                SupportList?.map((element, index) => (
                  <tr
                    className={`
                             
                            `}
                  >
                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      {element?.title}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      {element?.description}
                    </td>

                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      <Tooltip placement="topLeft"  title={`${element?.attachment?.length > 0 ? "View Attachments" : "No Attachment"}`}>
                        <button
                          onClick={() => {
                            setViewAttachment(true)
                            setViewAttachmentData(element?.attachment)
                          }}

                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                          disabled={!element?.attachment?.length > 0}
                        >
                          <FaImages
                            className={!element?.attachment?.length > 0 ? "text-gray-500" : " text-rose-700"}
                            size={16}
                          />
                        </button>
                      </Tooltip>
                    </td>



                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      {element?.createdBy || "-"}
                    </td>

                    <td className="whitespace-nowrap border-none p-2 text-[12px]">
                      {moment(element?.createdAt).format("DD-MM-YYYY")}
                    </td>
                    <td className="whitespace-nowrap border-none p-2">
                      <Tooltip placement="topLeft" 
                        title={`Status - ${element?.status === "Open"
                          ? "Open"
                          : element?.status === "Resolved"
                            ? "Resolved"
                            : "Rejected"
                          }`}
                      >
                        <span
                          className={`${element?.status === "Open"
                            ? "bg-yellow-200 border-yellow-500"
                            : element?.status === "Resolved"
                              ? "bg-[#E0FFBE] border-green-500"
                              : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status === "Open"
                            ? "Open"
                            : element?.status === "Resolved"
                              ? "Resolved"
                              : element?.status === "Rejected"
                                ? "Rejected"
                                : "-"}
                        </span>
                      </Tooltip>
                    </td>




                    <td className="whitespace-nowrap flex gap-2 border-none p-2">
                      <Tooltip placement="topLeft" >
                        <select
                          className="border-[1px] px-2 py-1.5 rounded-lg text-[12px]"
                          value={element?.status}
                          disabled={
                            element?.status == "Rejected" ||
                            element?.status == "Resolved"
                          }
                          onChange={(e) => {
                            changeStatus(e, element);
                          }}
                        >
                          <option value="Open">Open</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </Tooltip>
                      <Tooltip placement="topLeft"  title={"View Support Details"}>
                        <button
                          onClick={() => {
                            handleViewStatusDetails(element);
                          }}
                          className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                          type="button"
                        >
                          <FaEye
                            className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
                          />
                        </button>
                      </Tooltip>
                    </td>


                    {/* <td className="whitespace-nowrap border-none p-2">
                                <div className="flex   flex-row gap-1 w-full overflow-x-auto">
                                  {element?.assignedEmployeData?.map((element,index) => {
                                    return (
                                      <Tooltip placement="topLeft" 
                                        title={`${element?.fullName}`}
                                        key={element?.id}
                                      >
                                        <div
                                          onClick={() => handleImageClick(element)}
                                          className={`w-10 h-10 ${index>0 ? ' -ml-4' :'0'} rounded-full bg-gray-500 flex items-center justify-center`}
                                        >
                                          {element.profileImage ? (
                                            <img
                                              alt=""
                                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                                              className="rounded-full cursor-pointer min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                            />
                                          ) : (
                                            <img
                                              alt=""
                                              src={`/images/avatar.jpg`}
                                              className="rounded-full cursor-pointer min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                            />
                                          )}
                                        </div>
                                      </Tooltip>
                                    );
                                  })}
                                </div>
                              </td> */}
                    {/* <td className="whitespace-nowrap border-none p-2">
                                <span
                                  className={`
                                  ${
                                    element?.status === "Assigned"
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
                                      : element?.status === "reAssign_to_other"
                                      ? "bg-cyan-700 text-white"
                                      : "bg-white text-black"
                                  } border-header border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                                  // onClick={() => handleStatusClick(element)}
                                >
                                  {statusMapping[element?.status] ||
                                    "Unknown Status"}
                                </span>
                              </td> */}
                    {/* {(canUpdate || canDelete || canRead) && (
                                <td className="whitespace-nowrap border-none p-2">
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
                                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                          type="button"
                                        >
                                          <BsEye
                                            className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                            size={16}
                                          />
                                        </button>
                                      </Tooltip>
                                    )}
                                    {canUpdate &&  
                                      <Tooltip placement="topLeft"  title={(element?.status !== "Assigned" ) ? `No Actions ${element?.status}` : "Edit Task"}>
                                        <button
                                          onClick={() => {
                                            navigate(
                                              `/admin/task/edit/${encrypt(
                                                element?._id
                                              )}`
                                            );
                                          }}
                                          disabled={element?.status !== "Assigned"  }
                                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                          type="button"
                                        >
                                          <FaPenToSquare
                                            className={` ${(element?.status !== "Assigned" )  ? 'text-gray-500' :'  hover:text-[#337ab7] text-[#3c8dbc]'}`}
                                            size={16}
                                          />
                                        </button>
                                      </Tooltip>
                                    }
                                    <button
                                  onClick={() => { element?.description && handleButtonClick(element) }}
                                  className={`px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted`}
                                  type="button"
                                >
                                  <HiViewGrid
                                    className={` ${element?.description ? 'hover:text-[#337ab7] text-[#3c8dbc]' : 'text-gray-400 cursor-not-allowed'}`}
                                    size={16}
                                  />
                                </button>
                                    {canRead && (
                                      <Tooltip placement="topLeft"  title="View Description">
                                        <button
                                          onClick={() => handleOpenChat(element)}
                                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                          type="button"
                                        >
                                          <HiChatAlt
                                            className="hover:text-[#337ab7] text-[#3c8dbc]"
                                            size={16}
                                          />
                                        </button>
                                      </Tooltip>
                                    )}
    
                                    {canDelete && (
                                      <Tooltip placement="topLeft"  title={element?.status == "Assigned" ? "Delete Task" : "No Actions"}>
                                        <button
                                          onClick={() => handleDelete(element?._id)}
                                          className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                          type="button"
                                          disabled={element?.status != "Assigned"}
                                        >
                                          <RiDeleteBin5Line
                                            className={  element?.status == "Assigned" ?  "text-red-600 hover:text-red-500" : "text-gray-500"}
                                            size={16}
                                          />
                                        </button>
                                      </Tooltip>
                                    )}
                                  </span>
                                </td>
                              )} */}
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={8}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>

        {viewSupportDetails && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]"
            onClick={() => {
              handleViewStatusDetails();
            }}
          >
            <div
              className="grid grid-cols-1 md:grid-cols-1  w-full sm:w-1/2"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="w-full overflow-auto "
                onClick={(e) => e.preventDefault()}
              >
                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                  <thead>
                    <tr>
                      <th className="text-header ">
                        <div className="mt-2 ml-2">Support Details</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {/* Company Name Row */}
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonSharp className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Title</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {data?.title || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Description
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {data.description || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonSharp className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Created AT
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {moment(data?.createdAt).format("DD-MM-YYYY") ||
                            "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Created By
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {data.createdBy || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonSharp className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            status
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {data.status || "N/A"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {SupportList?.length > 0 && (
          <CustomPagination
            totalCount={totalSupportCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}

        <Modal
          visible={viewAttachment}
          onCancel={() => {
            setViewAttachment(false)
            setViewAttachmentData([])
          }}
          footer={null}
           className="antmodalclassName"
          width='700px'
          destroyOnClose
        >
          <div className="flex gap-2 flex-wrap mt-4">
            {viewAttachmentData?.map((filePath, index) => {
              const fileExtension = filePath.split('.').pop().toLowerCase();
              const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
              const isPdf = fileExtension === 'pdf';

              return (
                <div key={index} style={{ flex: '1 1 calc(33.333% - 10px)', marginBottom: '20px' }}>
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
                        style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                      />
                    </a>
                  ) : isPdf ? (<a
                    href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                      <iframe
                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                        title={`attachment-${index}`}
                        style={{ width: '100%', height: '100%' }}
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
        </Modal>
      </div>
    </GlobalLayout>
  );
};

export default SupportModalList;
