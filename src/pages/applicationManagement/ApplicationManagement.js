import React, { useEffect, useState } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaEye, } from "react-icons/fa";

import { Controller, useForm, useWatch } from "react-hook-form";
import { RiDeleteBin5Line, } from "react-icons/ri";
import { decrypt, encrypt } from "../../config/Encryption";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import { ImEnter } from "react-icons/im";
import {
  deleteApplication,

  getApplicationList,

  statusApplication,
} from "./applicationFeatures/_application_reducers";

import {
  domainName,

  handleSortLogic,
  inputAntdSelectClassNameFilter,

} from "../../constents/global";
import moment from "moment";
import CreateInterviewModal from "./CreateInterviewModal";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers";
import Loader2 from "../../global_layouts/Loader/Loader2";
import InterviewListModal from "./InterviewListModal";
import InterviewStatusModal from "./InterviewStatusModal";
import { Dropdown, Select, Tooltip } from "antd";
import {
  MdDone,
  MdEmail,
  MdOutlineChangeCircle,

} from "react-icons/md";

import { BsFileEarmarkPdfFill } from "react-icons/bs";
import EmailTemplateModal from "../hr/RecruitmentProcess/Interview/EmailTemplateModal";
import { sendEmailCommon } from "../hr/onBoarding/onBoardingFeatures/_onBoarding_reducers";

import InterviewViewDetailModal from "./InterviewViewDetailModal";

import usePermissions from "../../config/usePermissions";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../global_layouts/ListLoader";

function ApplicationManagement() {
  const [onBoardingId, setOnBoardingId] = useState(1);

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { applicationList, totalApplicationCount, loading } = useSelector(
    (state) => state.application
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const [isCreateInterview, setIsCreateInterview] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [interviewData, setInterviewerdata] = useState(false);
  const [statusId, setStatusId] = useState("");

  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isInterviewList, setIsInterviewList] = useState(false);
  const [isInterviewStatus, setIsInterviewStatus] = useState(false);
  const [interviewView, setInterviewView] = useState(false)
  const [interviewViewDetails, setInterviewViewDetails] = useState();
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
    name: "pdStatus",
    defaultValue: "",
  });
    const [searchParams, setSearchParams] = useSearchParams();
      const initialPage = parseInt(searchParams.get("page")) || 1;
      const initialLimit = 10;
      const initialBranchId = searchParams.get("branchId") || "";
      const initialStatus = searchParams.get("status") || "";
      const initialDepartmentId = searchParams.get("departmentId") || "";
      const initialDesignationId = searchParams.get("designationId") || "";
    
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);
      const [status, setStatus] = useState(initialStatus);
      const [searchText, setSearchText] = useState("");
      const [departmentId, setDepartmentId] = useState(initialDepartmentId);
      const [designationId, setDesignationId] = useState(initialDesignationId);
      const [branchId, setBranchId] = useState(initialBranchId);
    
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (departmentId) params.set("departmentId", departmentId);
        if (designationId) params.set("designationId", designationId);
        if (branchId) params.set("branchId", branchId);
        if (status) params.set("status", status);
        setSearchParams(params);
      }, [departmentId, branchId, designationId, status, searchText, currentPage]);
      useEffect(() => {
        fetchApplicationListData();
      }, [ branchId, departmentId, designationId, status, searchText, currentPage]);
    
      const handleResetFilters = () => {
        setCurrentPage(1);
        setBranchId("");
        setDepartmentId("");
        setDesignationId("");
        setStatus("");
        setSearchText("");
      };
      const onChange = (e) => {
        setSearchText(e);
      };
    
      const onPaginationChange = (page) => setCurrentPage(page);
      const handleBranchChange = (value) => {
        setBranchId(value);
        setCurrentPage(1);
      };
  
      const handleDepartmentChange = (value) => {
        setDepartmentId(value);
        setCurrentPage(1);
      };
      const handleDesignationChange = (value) => {
        setDesignationId(value);
        setCurrentPage(1);
      };
      const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
      };
  
  

  // useEffect(() => {
  //   fetchApplicationListData();
  // }, [branchId, departmentId, designationId, status, searchText, currentPage]);

  const fetchApplicationListData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        text: searchText,
        status: status,
        sort: true,
        isPagination: true,
        employeId: "",
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
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: departmentId,
        designationId: designationId,
        jobId: "",
      },
    };
    dispatch(getApplicationList(reqData));
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
        dispatch(deleteApplication(reqData)).then((data) => {
          ;
          if (currentPage > 1 && applicationList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchApplicationListData();
          }
        });
      }
    });
  };

  const handleInterviewopen = (data) => {
    setIsCreateInterview(true);
    setApplicationId(data);
  };



  const handleStatus = (data) => {
    setIsInterviewStatus(true);
    setStatusId(data);
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
      ).then((data) => {
        data.error && setValue("PDBranchId", "");
      });

    }
  }, [CompanyId]);
  useEffect(() => {
    dispatch(
      deptSearch({
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
    ).then((data) => {
      data.error && setValue("PdDepartmentId", "");
    });
  }, [BranchId])

  useEffect(() => {
    setValue("pdDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        departmentId: departmentId,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
      })
    ).then((data) => {
      data.error && setValue("pdDesignationId", "");
    });
  }, [departmentId, CompanyId]);

  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {
    if (applicationList) {
      handleSort();
    }
  }, [applicationList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, applicationList);
    setSortedList(sortedList);
  };
  const handleOfferLatterStatusChange = (e, applicationId) => {
    const finalPayload = {
      _id: applicationId,
      isOfferLatterStatus: true,
      status: e,
    };

    dispatch(statusApplication(finalPayload)).then((data) => {
      if (!data?.error) {
        fetchApplicationListData();
      }
    });
  };

  const handleEmailSubmit = (emailData) => {
    dispatch(sendEmailCommon(emailData)).then((data) => {
      if (!data.error) {
        setIsEmailModalOpen(false);
        setOnBoardingId([]);
        Swal.fire({
          icon: "success",
          title: "Email Generated",
          html: `
            <p>Interview email has been generated successfully!</p>
          `,
          confirmButtonColor: "#3085d6",
        });
      }
    });
  };


  const handleInterviewView = (data) => {
    setInterviewView(prev => !prev)
    setInterviewViewDetails(data)
  }




  return (
    <GlobalLayout onChange={onChange}>
      {isCreateInterview && (
        <CreateInterviewModal
          isOpen={true}
          applicationId={applicationId}
          fetchinterviewListData={fetchApplicationListData}
          onClose={() => setIsCreateInterview(false)}
        />
      )}

      {/* {
        interviewView && ( */}
      <InterviewViewDetailModal
        isOpen={interviewView}
        fetchinterviewListData={fetchApplicationListData}
        applicationList={applicationList}
        interviewData={interviewViewDetails}
        onClose={() => setInterviewView(false)}
      />
      {/* )
      } */}

      {isInterviewStatus && (
        <InterviewStatusModal
          isOpen={true}
          statusId={statusId}
          fetchStatusData={fetchApplicationListData}
          onClose={() => setIsInterviewStatus(false)}
        />
      )}

      {/* {!loading ? ( */}
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="lg:flex w-full justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex grid grid-cols-1 flex-wrap md:gap-3 gap-1.5">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <Controller
                    control={control}
                    name="PDCompanyId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        disabled={loading}
                        className={`${inputAntdSelectClassNameFilter} `}
                      >
                        <Select.Option value="">Select Company</Select.Option>
                        {companyList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
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
                    <Select
                                        value={branchId}
                                        onChange={handleBranchChange}
                                        defaultValue=""
                                        disabled={loading}
                                        className={`${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                          String(option?.children)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                        }
                                      >
                                        <Select.Option value="">Select Branch</Select.Option>
                                        {branchListloading ? (
                                          <Select.Option disabled>
                                            <ListLoader />
                                          </Select.Option>
                                        ) : (
                                          branchList?.map((type) => (
                                            <Select.Option key={type?._id} value={type?._id}>
                                              {type?.fullName}
                                            </Select.Option>
                                          ))
                                        )}
                                      </Select>
                  </div>
                )}
              <div className="">
              <Select
                    value={departmentId}
                    onChange={handleDepartmentChange}
                    defaultValue=""
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Department</Select.Option>
                      {departmentListloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (departmentListData?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.name}
                        </Select.Option>
                      )))}
                  </Select>
              </div>
              <div className="">
                <Select
                  value={designationId}
                  onChange={handleDesignationChange}
                  defaultValue=""
                  disabled={loading}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                                  >
                                    <Select.Option value="">Select Designation</Select.Option>
                                      {designationloading ? <Select.Option disabled>
                                        <ListLoader />
                                      </Select.Option> : (designationList?.map((type) => (
                                        <Select.Option key={type?._id} value={type?._id}>
                                          {type?.name}
                                        </Select.Option>
                                      )))}
                                  </Select>
              </div>
              <div className="">
              <Select
                  value={status}
                  onChange={handleStatusChange}
                  disabled={loading}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                   <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value={"Applied"}>Applied </Select.Option>
                      <Select.Option value="Hold">Hold</Select.Option>
                      <Select.Option value="Shortlisted">Shortlisted</Select.Option>
                      <Select.Option value="Rejected">Rejected</Select.Option>
                      {/* <Select.Option value="Selected">Selected</Select.Option> */}
                      <Select.Option value="Hired">Hired</Select.Option>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-2 items-center gap-1">
              <button
                onClick={() => {
                handleResetFilters()
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && <div className=" justify-end items-center ">
                <button
                  onClick={() => {
                    navigate("/admin/application/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px] whitespace-nowrap">Add Application</span>
                </button>
              </div>}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[5%]">
                  S.No.
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Name</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("fullName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("fullName", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Job Post Name</span>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>E-mail</span>
                  </div>{" "}
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mobile</span>
                  </div>{" "}
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Profile Type</span>
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("profileType", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("profileType", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Resume</span>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Last Round Name</span>

                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Last Round Status</span>

                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Next Round Name</span>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Round Number</span>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Application Status</span>
                  </div>
                </th>
                {canUpdate && <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Offer Latter Status</span>
                  </div>
                </th>}
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Created At</span>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Created By</span>
                  </div>
                </th>
                <th className="tableHead w-[5%]">
                  Action
                </th>
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={20}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {sortedList && sortedList?.length > 0 ? (
                  sortedList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td
                        onClick={() => {
                          if (
                            element?.status === "Hired" ||
                            element?.isOnboarded?._id
                          ) {
                            navigate(
                              `/admin/onBoarding/edit/${encrypt(
                                element?.isOnboarded?._id
                              )}`
                            );
                          }
                        }}
                        className={`${(element?.status === "Hired" ||
                          element?.isOnboarded?._id) &&
                          "text-header font-semibold cursor-pointer "
                          }  tableData  `}
                      >
                        {element?.fullName}
                      </td>

                      <td className="tableData ">
                        {element?.jobPostData?.title}
                      </td>
                      <td className="tableData ">
                        {element?.email}
                      </td>

                      <td className="tableData ">
                        {element?.mobile?.code + element?.mobile?.number}{" "}
                      </td>
                      <td className="tableData ">
                        {element?.profileType}
                      </td>
                      <td className="tableData">
                        <Tooltip placement="topLeft"  title="Resume">
                          {" "}
                          <button
                            onClick={() => {
                              if (element?.resumeUrl) {
                                const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.resumeUrl}`;
                                window.open(url, "_blank");
                              }
                            }}
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <BsFileEarmarkPdfFill
                              className=" text-rose-700"
                              size={16}
                            />
                          </button>
                        </Tooltip>
                      </td>
                      <td className="tableData">
                        {element?.interviewData?.interviewList?.find((data, index) => index + 1 === element?.interviewData?.completedInterviews)?.roundName || '-'}

                      </td>
                      <td className="tableData">
                        {element?.interviewData?.interviewList?.find((data, index) => index + 1 === element?.interviewData?.completedInterviews)?.status || '-'}

                      </td>
                      <td className="tableData">
                        {element?.interviewData?.interviewList?.find((data, index) => index === element?.interviewData?.completedInterviews)?.roundName || '-'}

                      </td>
                      <td className="tableData ">
                        {
                          element?.interviewData?.completedInterviews ? element?.interviewData?.completedInterviews : 0
                        }  {' '}
                        Out of  {
                          element?.interviewData?.totalInterviews ? element?.interviewData?.totalInterviews : 0
                        }
                      </td>



                      <td className="tableData">
                        <button
                          className={`${element?.status === "Applied"
                            ? "bg-[#E0FFBE] border-green-500 text-black"
                            : element?.status === "Hold"
                              ? "bg-yellow-200 border-yellow-500 text-black"
                              : element?.status === "Shortlisted"
                                ? "bg-blue-200 border-blue-500 text-black"
                                : element?.status === "Rejected"
                                  ? "bg-red-200 border-red-500 text-black"
                                  : element?.status === "Hired"
                                    ? "bg-green-200 border-green-500 text-black"
                                    : "bg-gray-200 border-gray-500 text-black"
                            } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        >
                          {element?.status || "-"}
                        </button>
                      </td>
                      {canUpdate && <td className="whitespace-nowrap text-center  border-none p-2">
                        {element?.status === "Selected" ||
                          element?.status === "Hired" ? (
                          <Tooltip placement="topLeft" 
                            title={`${element?.status === "Selected"
                              ? "Offer Latter Status"
                              : `Already ${element?.status}`
                              }`}
                          >
                            <select
                              className="border-[1px] px-2 py-1.5 rounded-lg text-[12px]"
                              value={element?.offerLatterStatus}
                              onChange={(e) =>
                                handleOfferLatterStatusChange(
                                  e.target.value,
                                  element?._id
                                )
                              }
                              disabled={element?.status === "Hired"}
                            >
                              <option value="NotSent">Not Sent</option>
                              <option value="Sent">Sent</option>
                              <option value="Accepted">Accepted</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </Tooltip>
                        ) : (
                          "-"
                        )}
                      </td>}
                      <td className="tableData ">
                        {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") ??
                          "-"}
                      </td>
                      <td className="tableData ">
                        {element?.createdBy ??
                          "-"}
                      </td>
                      <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          <Tooltip placement="topLeft"  title={"View Application Details"}>
                            <button
                              onClick={() => {
                                handleInterviewView(element);
                              }}
                              className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                              type="button"
                            >
                              <FaEye
                                className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
                              />
                            </button>
                          </Tooltip>
                          {canUpdate && <Tooltip placement="topLeft" 
                            title={`${element?.status === "Hired" ||
                              element?.status === "Rejected"
                              ? `No Actions (${element?.status})`
                              : element?.status === "Selected"
                                ? `No Actions (${element?.status})`
                                : "Change Status"
                              }`}
                          >
                            <button
                              onClick={() => {
                                handleStatus(element);
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={
                                element?.status === "Selected" ||
                                element?.status === "Hired" ||
                                element?.status === "Rejected"
                              }
                            >
                              <MdOutlineChangeCircle
                                className={`${element?.status === "Selected" ||
                                  element?.status === "Hired" ||
                                  element?.status === "Rejected"
                                  ? "text-gray-500"
                                  : "hover:text-[#337ab7] text-[#3c8dbc]"
                                  }`}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'create-interview',
                                  label: (
                                    <Tooltip placement="topLeft" 
                                      title={
                                        element?.status === 'Hired' || element?.status === 'Selected' || element?.status === 'Rejected'
                                          ? `No Actions (${element?.status})`
                                          : element?.status === 'Shortlisted'
                                            ? 'Create Interview'
                                            : 'Not Shortlisted'
                                      }
                                    >
                                      <span
                                        onClick={() => element?.status === 'Shortlisted' && handleInterviewopen(element)}
                                        className={`flex items-center gap-2 ${element?.status !== 'Shortlisted' ? 'text-gray-400 cursor-not-allowed' : 'text-[#3c8dbc] hover:text-[#337ab7]'}`}
                                      >
                                        <ImEnter size={16} />
                                        Create Interview
                                      </span>
                                    </Tooltip>
                                  ),
                                  disabled: element?.status !== 'Shortlisted',
                                },
                                ...(canUpdate ? [{
                                  key: 'hire',
                                  label: (
                                    <Tooltip placement="topLeft"  title={element?.interviewData?.interviewList?.find(i => i?.isLastRound)?.status === 'Passed' && element?.status === 'Shortlisted' ? 'Hire Candidate' : 'No Actions'}>
                                      <span
                                        onClick={() => {
                                          const isHireable = element?.interviewData?.interviewList?.find(i => i?.isLastRound)?.status === 'Passed' && element?.status === 'Shortlisted';
                                          if (isHireable) {
                                            dispatch(statusApplication({ _id: element?._id, status: 'Selected' }))
                                              ?.then((data) => !data?.error && fetchApplicationListData());
                                          }
                                        }}
                                        className={`flex items-center gap-2 ${element?.interviewData?.interviewList?.find(i => i?.isLastRound)?.status === 'Passed' && element?.status === 'Shortlisted'
                                          ? 'text-[#3c8dbc] hover:text-[#337ab7]'
                                          : 'text-gray-400 cursor-not-allowed'
                                          }`}
                                      >
                                        <MdDone size={16} />
                                        Hire Candidate
                                      </span>
                                    </Tooltip>
                                  ),
                                  disabled: !(element?.interviewData?.interviewList?.find(i => i?.isLastRound)?.status === 'Passed' && element?.status === 'Shortlisted'),
                                }] : []),
                                ...(canUpdate ? [{
                                  key: 'edit',
                                  label: (
                                    <Tooltip placement="topLeft"  title={['Hired', 'Selected', 'Rejected'].includes(element?.status) ? `No Actions (${element?.status})` : 'Edit'}>
                                      <span
                                        onClick={() => !['Hired', 'Selected', 'Rejected'].includes(element?.status) && navigate(`/admin/application/edit/${encrypt(element?._id)}`)}
                                        className={`flex items-center gap-2 ${['Hired', 'Selected', 'Rejected'].includes(element?.status) ? 'text-gray-400 cursor-not-allowed' : 'text-[#3c8dbc] hover:text-[#337ab7]'}`}
                                      >
                                        <FaPenToSquare size={16} />
                                        Edit
                                      </span>
                                    </Tooltip>
                                  ),
                                  disabled: ['Hired', 'Selected', 'Rejected'].includes(element?.status),
                                }] : []),
                                ...(canDelete ? [{
                                  key: 'delete',
                                  label: (
                                    <Tooltip placement="topLeft"  title={element?.status === 'Hired' || element?.status === 'Selected' ? `No Actions (${element?.status})` : 'Delete'}>
                                      <span
                                        onClick={() => {
                                          if (!(element?.status === 'Hired' || element?.status === 'Selected' || element?.interviewData)) {
                                            handleDelete(element?._id);
                                          }
                                        }}
                                        className={`flex items-center gap-2 ${element?.status === 'Hired' || element?.status === 'Selected' || element?.interviewData
                                          ? 'text-gray-400 cursor-not-allowed'
                                          : 'text-rose-800 hover:text-rose-700'
                                          }`}
                                      >
                                        <RiDeleteBin5Line size={16} />
                                        Delete
                                      </span>
                                    </Tooltip>
                                  ),
                                  disabled: element?.status === 'Hired' || element?.status === 'Selected' || element?.interviewData,
                                }] : []),
                                ...(canCreate ? [{
                                  key: 'send-mail',
                                  label: (
                                    <Tooltip placement="topLeft"  title="Send Mail">
                                      <span
                                        onClick={() => setIsEmailModalOpen(true)}
                                        className="flex items-center gap-2 text-green-600 hover:text-green-500"
                                      >
                                        <MdEmail size={16} />
                                        Send Mail
                                      </span>
                                    </Tooltip>
                                  ),
                                }] : []),
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title="Actions">
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
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
                      colSpan={18}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>}
        </div>
        <EmailTemplateModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleEmailSubmit}
          interviewData={onBoardingId}
          setOnBoardingId={setOnBoardingId}
        />
        <CustomPagination
          totalCount={totalApplicationCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
      {/* ) : (
        <Loader />
      )} */}
    </GlobalLayout>
  );
}
export default ApplicationManagement;
