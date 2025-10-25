import { useEffect, useState } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleUp, FaAngleDown, FaEye, } from "react-icons/fa";

import { Controller, useForm, useWatch } from "react-hook-form";
import { encrypt } from "../../config/Encryption";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import {
  getApplicationList,
} from "./applicationFeatures/_application_reducers";

import {
  domainName,

  handleSortLogic,
  inputAntdSelectClassNameFilter,

} from "../../constents/global";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers";
import Loader2 from "../../global_layouts/Loader/Loader2";
import { Select, Tooltip } from "antd";

import { BsFileEarmarkPdfFill } from "react-icons/bs";

import InterviewViewDetailModal from "./InterviewViewDetailModal";

import usePermissions from "../../config/usePermissions";
import ListLoader from "../../global_layouts/ListLoader";

function ReadyToOnboardList() {
  const [onBoardingId, setOnBoardingId] = useState(1);

  const { canRead } = usePermissions();
  const {
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
  const [statusId, setStatusId] = useState("");

  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
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
  }, [branchId, departmentId, designationId, status, searchText, currentPage]);

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

  const fetchApplicationListData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        text: searchText,
        status: "Selected",
        offerLatterStatus: "Accepted",
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

  const handleInterviewView = (data) => {
    setInterviewView(prev => !prev)
    setInterviewViewDetails(data)
  }




  return (
    <GlobalLayout onChange={onChange}>

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
            </div>
            <div className="flex justify-end mt-2 items-center gap-1">
              <button
                onClick={() => {
                  handleResetFilters()
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
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
                    <span>Round Number</span>
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
                        <Tooltip placement="topLeft" title="Resume">
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
                      <td className="tableData ">
                        {
                          element?.interviewData?.completedInterviews ? element?.interviewData?.completedInterviews : 0
                        }  {' '}
                        Out of  {
                          element?.interviewData?.totalInterviews ? element?.interviewData?.totalInterviews : 0
                        }
                      </td>

                      <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          <Tooltip placement="topLeft" title={"View Application Details"}>
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
export default ReadyToOnboardList;
