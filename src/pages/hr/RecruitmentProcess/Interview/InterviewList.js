import React, { useEffect, useState } from "react";
import { json, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  FaAngleUp,
  FaEye,
  FaIndustry,
  FaPenToSquare,
  FaPeopleGroup,
  FaRegAddressCard,
  FaRegBuilding,
} from "react-icons/fa6";
import { RiDeleteBin5Line, RiEjectFill } from "react-icons/ri";
import getUserIds from "../../../../constents/getUserIds";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineFilter } from "react-icons/hi";
import {

  MdRemoveCircle,
} from "react-icons/md";
import {
  deleteInterview,
  getInterviewList,
  sendEmailInterview,
  statusUpdateApplication,
} from "./InterviewFeatures/_interview_reducers";
import {
  domainName,
  handleSortLogic,
  inputAntdSelectClassNameFilter,
  inputClassNameSearch,
  inputLabelClassName,
} from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../../global_layouts/Loader/Loader";
import { decrypt, encrypt } from "../../../../config/Encryption";
import moment from "moment";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import EmailTemplateModal from "./EmailTemplateModal";
import { sendEmailCommon } from "../../onBoarding/onBoardingFeatures/_onBoarding_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { Select, Tooltip, Dropdown } from "antd";
import { BsFileEarmarkPdfFill, BsPassFill } from "react-icons/bs";
import { AiOutlineMail, AiOutlineTags } from "react-icons/ai";
import { FaPhoneAlt } from "react-icons/fa";
import { IoPersonSharp } from "react-icons/io5";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { applicationSearch, getApplicationList } from "../../../applicationManagement/applicationFeatures/_application_reducers";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../../global_layouts/ListLoader";
import CustomDatePickerFilter from "../../../../global_layouts/DatePicker/CustomDatePickerFilter";

function InterviewList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pdStatus: "Pending",
    },
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { interviewList, totalInterviewCount, loading } = useSelector(
    (state) => state.interview
  );
  const { applicationList, totalApplicationCount, loading: applistloading } = useSelector(
    (state) => state.application
  );
  const [interviewViewData, setInterviewerdata] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [onBoardingId, setOnBoardingId] = useState(1);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);
 
  const { userEmployeId } = getUserIds();


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


  const employeId = useWatch({
    control,
    name: "PDEmployeId",
    defaultValue: userEmployeId,
  });

 
  // const applicationId = useWatch({
  //   control,
  //   name: "applicationList",
  //   defaultValue: "",
  // });

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();



  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId")|| "";
  const initialStatus = searchParams.get("status")|| "";
  const initialDepartmentId = searchParams.get("departmentId")|| "";
  const initialDesignationId = searchParams.get("designationId")|| "";
  const initialApplicationId = searchParams.get("applicationId")|| "";
  const initialStartDate = searchParams.get("startDate")|| null;
  const initialEndDate = searchParams.get("endDate")|| null;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [searchText, setSearchText] = useState("");
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const [applicationId, setApplicationId] = useState(initialApplicationId);
  const [designationId, setDesignationId] = useState(initialDesignationId);
  const [branchId, setBranchId] = useState(initialBranchId);
  const [startDate, setStartDate] = useState(
    initialStartDate ? dayjs(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? dayjs(initialEndDate) : null
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (departmentId) params.set("departmentId", departmentId);
    if (designationId) params.set("designationId", designationId);
    if (applicationId) params.set("applicationId", applicationId);
    if (branchId) params.set("branchId", branchId);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [departmentId, branchId, designationId, status,startDate,endDate,applicationId, searchText, currentPage]);
  useEffect(() => {
    fetchApplicationListData();
  }, [ branchId, departmentId, designationId, status,startDate,endDate,applicationId, searchText, currentPage]);

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

  const handleApplicationChange = (value) => {
    setApplicationId(value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
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
  // }, []);

  const fetchApplicationListData = () => {
    let reqData = {

      reqPayload: {
        text: "",
        status: "",
        sort: true,
        isPagination: false,
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
    dispatch(applicationSearch(reqData));
  };






  useEffect(() => {
    fetchInterviewData();
  }, [
    CompanyId,
    branchId,
    departmentId,
    designationId,
    status,
    startDate,
    endDate,
    applicationId,
    searchText,
    currentPage,
  ]);
  const fetchInterviewData = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        text: searchText,
        status: status,
        sort: true,
        isPagination: true,
        employeId: employeId,
        departmentId: departmentId,
        designationId: designationId,
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

        applicationId: applicationId,
        startDate: startDate ? dayjs(startDate).format("DD-MM-YYYY") : '',
        endDate: endDate ? dayjs(endDate).format("DD-MM-YYYY") : '',
      },
    };
    dispatch(getInterviewList(data));
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
        dispatch(deleteInterview(reqData)).then((data) => {
          fetchInterviewData();
          if (currentPage > 1 && interviewList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchInterviewData();
          }
        });
      }
    });
  };

  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {
    if (interviewList) {
      handleSort();
    }
  }, [interviewList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, interviewList);
    setSortedList(sortedList);
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
  const handleStatusUpdate = (element, status) => {
    Swal.fire({
      title: "Provide feedback",
      input: "textarea",
      inputLabel: "Feedback (optional)",
      inputPlaceholder: "Type your feedback here...",
      showCancelButton: true,
      confirmButtonText: `Update as ${status}`,
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (value === undefined || value === "") {
          return "Feedback cannot be empty";
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const feedback = result.value; // Get feedback input
        // Dispatch the status update with feedback
        dispatch(
          statusUpdateApplication({
            _id: element?._id,
            applicationId: element?.applicationId,
            status: status,

            feedback: feedback, // Include feedback here
          })
        ).then((data) => {
          if (!data?.error) {
            fetchInterviewData(); // Fetch interview data after successful update
          }
        });
      }
    });
  };
  const [viewInterview, setViewInterview] = useState(false);
  const handleInterviewView = (data) => {
    setInterviewerdata(data);

    setViewInterview((prev) => !prev);
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
    }
  }, [CompanyId]);

  useEffect(() => {
    setValue("pdDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
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
  return (
    <GlobalLayout onChange={onChange}>

      <>
        <div className="">
          <div className="2xl:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="2xl:flex 2xl:flex-wrap sm:grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-3 grid-cols-1 md:gap-3 !gap-4 md:space-y-0 space-y-1.5 text-[14px] rounded-md">
          
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
                      <Select.Option value="Pending">Pending </Select.Option>
                      <Select.Option value="Passed">Passed</Select.Option>
                      <Select.Option value="Failed">Failed</Select.Option>
                      <Select.Option value="Completed">Completed</Select.Option>            
                              </Select>
              </div>
              <div className="">

              <Select
                    value={applicationId}
                    onChange={handleApplicationChange}
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
                     <Select.Option value="">
                        Select Application
                      </Select.Option>
                      {applistloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (applicationList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                  </Select>
                {/* <Controller
                  control={control}
                  name="applicationList"
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassNameFilter} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">
                        Select Application
                      </Select.Option>
                      {applistloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (applicationList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                /> */}
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>
              <div className="">
              <CustomDatePickerFilter
                  value={startDate}
                  onChange={handleStartDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
              </div>
              <div className="">
              <CustomDatePickerFilter
                  value={endDate}
                  onChange={handleEndDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
              </div>
            </div>
            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                  setBranchId("")
                  setDepartmentId("")
                  setDesignationId("")
                  setStatus("")
                  setApplicationId("")
                  setStartDate("")
                  setEndDate("")
                }}
                className="bg-header py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>

            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead ">S.No.</th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Interviewer Name
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("interviewerName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("interviewerName", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Interviewer Position
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() =>
                          handleSort("interviewerPosition", "asc")
                        }
                      />
                      <FaAngleDown
                        onClick={() =>
                          handleSort("interviewerPosition", "desc")
                        }
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Applicant Name
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("interviewerName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("interviewerName", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    position
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("interviewerName", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("interviewerName", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">Round Number</div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">Round Name</div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Type
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("type", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("type", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Interview Date
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("date", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("date", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    created At
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("date", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("createdAT", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    created By
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("date", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("createdBy", "desc")}
                      />
                    </div>
                  </div>
                </th>
                {
                  canRead && <th className="tableHead">
                    <div className="flex gap-1">Resume</div>
                  </th>
                }
                <th className="tableHead">status</th>
                {(canUpdate || canDelete || canRead) && <th className="tableHead w-[10%]">Action</th>}
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={14}
                className="px-6 py-2  whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {sortedList && sortedList?.length > 0 ? (
                  sortedList?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">  {index + 1 + (currentPage - 1) * limit}</td>
                      <td className="tableData">
                        {element?.interviewerName || '-'}
                      </td>
                      <td className="tableData">
                        {element?.interviewerPosition || '-'}
                      </td>
                      <td className="tableData">
                        {element?.applicationData?.fullName || '-'}
                      </td>
                      <td className="tableData">
                        {
                          element?.applicationData?.jobPostData?.designationData
                            ?.name || '-'
                        }
                      </td>
                      <td className="tableData">
                        {element?.roundNumber || '-'}
                      </td>
                      <td className="tableData">
                        {element?.roundName || '-'}
                      </td>
                      <td className="tableData">{element?.type}</td>
                      <td className="tableData">
                        {moment(element?.date).format("DD/MM/YYYY hh:mm A")}
                      </td>

                      <td className="tableData">
                        {moment(element?.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </td>
                      <td className="tableData">
                        {element?.createdBy ?? '-'}
                      </td>
                      {canRead && <td className="tableData">
                        {" "}
                        <button
                          onClick={() => {
                            if (element?.applicationData?.resumeUrl) {
                              const url = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.applicationData?.resumeUrl}`;
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
                      </td>}
                      <td className="whitespace-nowrap border-none p-2 ">
                        <span
                          className={`${element?.status === "Active"
                            ? "bg-[#E0FFBE] border-green-500 text-black"
                            : element?.status === "Pending"
                              ? "bg-yellow-200 border-yellow-500 text-black"
                              : element?.status === "Inactive"
                                ? "bg-red-200 border-red-500 text-black"
                                : "bg-gray-200 border-gray-500 text-black"
                            } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        >
                          {element?.status ? element.status : "-"}
                        </span>
                      </td>


                      {(canUpdate || canDelete || canRead) && <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          {canUpdate && <Tooltip placement="topLeft" 
                            title={`${element?.status === "Pending"
                              ? "Update As Failed"
                              : `Already ${element?.status}`
                              }`}
                          >
                            <button
                              onClick={() =>
                                handleStatusUpdate(element, "Failed")
                              }
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "Pending"}
                            >
                              <MdRemoveCircle
                                className={`${element?.status === "Pending"
                                  ? "hover:text-rose-500 text-rose-600"
                                  : "text-gray-500"
                                  }`}
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft" 
                            title={`${element?.status === "Pending"
                              ? "Update As Passed"
                              : `Already ${element?.status}`
                              }`}
                          >
                            <button
                              onClick={() =>
                                handleStatusUpdate(element, "Passed")
                              }
                              // onClick={() => {
                              //   dispatch(
                              //     statusUpdateApplication({
                              //       _id: element?._id,
                              //       applicationId: element?.applicationId,
                              //       status: "Passed",
                              //     })
                              //   ).then((data) => {
                              //     !data?.error && fetchInterviewData();
                              //   });
                              // }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                              disabled={element?.status !== "Pending"}
                            >
                              <BsPassFill
                                className={`${element?.status === "Pending"
                                  ? "hover:text-teal-500 text-teal-500"
                                  : "text-gray-500"
                                  }`}
                                size={16}
                              />
                            </button>
                          </Tooltip>}

                          {canRead && <Tooltip placement="topLeft"  title={"View Interview Details"}>
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
                          </Tooltip>}



                          <Dropdown
                            menu={{
                              items: [
                                ...(canUpdate
                                  ? [{
                                    key: 'edit-interview',
                                    label: (
                                      <span
                                        onClick={() =>
                                          navigate(`/admin/interview/edit/${encrypt(element?._id)}`)
                                        }
                                        className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                      >
                                        <FaPenToSquare className="mr-2" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  }]
                                  : []),

                                ...(canDelete
                                  ? [{
                                    key: 'delete-interview',
                                    label: (
                                      <span
                                        onClick={() => handleDelete(element?._id)}
                                        className="flex items-center text-red-600 hover:text-red-500"
                                      >
                                        <RiDeleteBin5Line className="mr-2" size={16} />
                                        Delete
                                      </span>
                                    ),
                                  }]
                                  : []),
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title='More Actions'>
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
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={18}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            }
          </table>
        </div>
        <CustomPagination
          totalCount={totalInterviewCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        {viewInterview && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]"
            onClick={handleInterviewView}
          >
            <div className="grid grid-cols-1 md:grid-cols-1  w-full sm:w-1/2" onClick={(e) => e.stopPropagation()}>

              <div
                className="w-full overflow-auto "
                onClick={(e) => e.preventDefault()}
              >
                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                  <thead>
                    <tr>
                      <th className="text-header ">
                        <div className="mt-2 ml-2">Interview Details</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {/* Company Name Row */}
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3 text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonSharp className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Interviewer Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.interviewerName || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Interviewer Position
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData.interviewerPosition || "N/A"}
                        </span>
                      </td>

                    </tr>

                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Application Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.applicationData.fullName ||
                            "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Round Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.roundName || "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Round No.
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.roundNumber}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            location
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.location || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Status
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.status}
                        </span>
                      </td>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Type
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {interviewViewData?.type || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Date
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {moment(interviewViewData?.date)?.format(
                            "DD/MM/YYYY"
                          ) || "N/A"}{" "}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </>

    </GlobalLayout>
  );
}
export default InterviewList;
