import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa6";


import {
  deleteJobPost,
  getJobPostList,
} from "./JobPostFeatures/_job_post_reducers";
import { domainName, inputAntdSelectClassNameFilter } from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";

import { decrypt, encrypt } from "../../../../config/Encryption";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";

import { BsLink } from "react-icons/bs";
import { Modal, Select, Tooltip, Dropdown } from "antd";

import dayjs from "dayjs";
import { FaEye, FaRegCopy } from "react-icons/fa";

import { BiFile } from "react-icons/bi";
import usePermissions from "../../../../config/usePermissions";

import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../../global_layouts/ListLoader";

function JobPostList() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();


  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();



  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobPostData, totaljobPostCount, loading } = useSelector((state) => state.jobPost);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    jobpost: {}
  })

  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);

  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const [copiedUrl, setCopiedUrl] = useState("");
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
    getJobPostRequestData();
  }, [departmentId, branchId, designationId, status, searchText, currentPage]);

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





  const getJobPostRequestData = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        text: searchText,
        status: status,
        sort: true,
        isPagination: true,
        employeId: '',
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        departmentId: departmentId,
        designationId: designationId
      },
    };
    dispatch(getJobPostList(data));
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
        dispatch(deleteJobPost(reqData)).then((data) => {
          if (currentPage > 1 && jobPostData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            getJobPostRequestData();
          }
        });
      }
    });
  };

  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector" ||
      userInfoglobal?.userType === "companyBranch"

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
        departmentId: departmentId,
        isPagination: false,
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




  const handleCopyUrl = (companyId, jobId) => {
    const url = `${window.location.origin}/applicationonjobpost/${encrypt(jobId)}`;

    navigator.clipboard.writeText(url)
      .then(() => {
        setCopiedUrl(url);
        Swal.fire({
          title: 'URL copied!',
          text: 'The URL has been successfully copied to your clipboard.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      })
      .catch(err => {
        console.error("Failed to copy URL:", err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to copy URL.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  };


  const handleRedirect = () => {
    if (copiedUrl) {
      window.location.href = copiedUrl;
    } else {
      Swal.fire({
        title: "No URL copied!",
        text: "Please copy a URL first before redirecting.",
        icon: "warning",
        confirmButtonText: "OK"
      });
    }
  };

  return (
    <GlobalLayout onChange={onChange}>
      <Modal className="antmodalclassName" title={modal?.data?.status ? `${modal?.data?.status} Application  for ${modal?.jobpost?.title} Job Post (${modal?.data?.count})` : `Application  for ${modal?.jobpost?.title} Job Post`} width={1000} footer={false} open={modal.isOpen} onOk={() => setModal({ open: false, data: {}, jobpost: {} })} onCancel={() => setModal({ open: false, data: {}, jobpost: {} })}>
        <table className="w-full max-w-full rounded-xl ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
              <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
              <th className="p-2 whitespace-nowrap"> Applicant Name</th>
              <th className="p-2 whitespace-nowrap">Applied date</th>
              <th className="p-2 whitespace-nowrap">Email</th>
              <th className="p-2 whitespace-nowrap">Mobile Number</th>
              <th className="p-2 whitespace-nowrap">Status</th>
              <th className="p-2 whitespace-nowrap w-[10%]">Resume</th>
            </tr>
          </thead>
          <tbody>
            {modal?.data?.employees && modal?.data?.employees?.length > 0 ? (
              modal?.data?.employees?.map((element, index) => (
                <tr
                  className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                    } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                >
                  <td className="whitespace-nowrap p-2">{index + 1}</td>
                  <td className="whitespace-nowrap p-2">{element?.fullName ?? "-"}</td>
                  <td className="whitespace-nowrap p-2">{dayjs(element?.appliedDate).format("DD/MM/YYYY")}</td>
                  <td className="whitespace-nowrap p-2">{element?.email}</td>
                  <td className="whitespace-nowrap p-2">{element?.mobile?.code} {element?.mobile?.number}</td>
                  <td className="whitespace-nowrap p-2">{element?.status}</td>
                  <td className="whitespace-nowrap p-2">
                    <span className="py-1.5 flex justify-start items-center space-x-2.5">
                      <Tooltip placement="topLeft"  title="Resume">
                        <button
                          onClick={() => {
                            if (element?.resumeUrl) {
                              const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.resumeUrl}`;
                              const link = document.createElement("a");
                              link.href = pdfLink;
                              link.target = "_blank";
                              link.rel = "noopener noreferrer";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <BiFile
                            className="hover:text-rose-800 text-rose-800"
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
      </Modal>

      <>
        <div className="">
          <div class="xl:flex justify-between items-center py-1 2xl:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 sm:gap-3 gap-1">
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
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
            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                  handleResetFilters()

                }}
                className="bg-header py-[6px] rounded-md flex px-5 justify-center items-center text-white">
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate && (
                <Tooltip placement="topLeft"  title='Add JobPost'>
                  <button
                    onClick={() => {
                      navigate("/admin/job-post/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="whitespace-nowrap text-[12px]">Add Job Post</span>
                  </button>
                </Tooltip>)}
            </div>
          </div>
        </div>
        {canRead &&
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">S.No.</th>
                  <th className="tableHead">Job Post Name</th>
                  <th className="tableHead">Department</th>
                  <th className="tableHead">Designation</th>
                  <th className="tableHead">Total Vacancy</th>
                  <th className="tableHead">Applied</th>
                  <th className="tableHead">Shortlisted</th>
                  <th className="tableHead">Hold</th>
                  <th className="tableHead">Rejected</th>
                  <th className="tableHead">Selected</th>
                  <th className="tableHead">Hired</th>
                  <th className="tableHead">Created At</th>
                  <th className="tableHead">Created By</th>
                  <th className="tableHead">status</th>
                  <th className="tableHead w-[10%]">Action</th>
                </tr>
              </thead>
              {loading ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={15}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : <tbody>
                {jobPostData && jobPostData?.length > 0 ? (
                  jobPostData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">{index + 1 + ((currentPage - 1) * limit)}</td>

                      <td className="tableData">
                        {element?.title}
                      </td>
                      <td className="tableData">
                        {element?.departmentData?.name}
                      </td>
                      <td className="tableData">
                        {element?.designationData?.name}
                      </td>

                      <td className="tableData">
                        {element?.noOfVacancy ?? "-"}
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.totalApplications) {
                            setModal({
                              isOpen: true,
                              data: {
                                employees: element?.applicationData?.applicationsByStatus?.flatMap(group => group.employees) ?? []
                              },
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.totalApplications ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {element?.applicationData?.totalApplications ? element?.applicationData?.totalApplications : "-"}
                          {element?.applicationData?.totalApplications ? (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          ) : null}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Shortlisted")?.count) {
                            setModal({
                              isOpen: true,
                              data: element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Shortlisted"),
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Shortlisted")?.count ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Shortlisted")?.count ?? "-"}
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Shortlisted")?.count && (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          )}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hold")?.count) {
                            setModal({
                              isOpen: true,
                              data: element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hold"),
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hold")?.count ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hold")?.count ?? "-"}
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hold")?.count && (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          )}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Rejected")?.count) {
                            setModal({
                              isOpen: true,
                              data: element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Rejected"),
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Rejected")?.count ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Rejected")?.count ?? "-"}
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Rejected")?.count && (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          )}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Selected")?.count) {
                            setModal({
                              isOpen: true,
                              data: element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Selected"),
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Selected")?.count ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex justify-center items-center">
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Selected")?.count ?? "-"}
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Selected")?.count && (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          )}
                        </div>
                      </td>
                      <td
                        onClick={() => {
                          if (element?.applicationData?.applicationsByStatus?.find((el) => el?.status === "Hired")?.count) {
                            setModal({
                              isOpen: true,
                              data: element?.applicationData?.applicationsByStatus?.find((el) => el?.status === "Hired"),
                              jobpost: element
                            });
                          }
                        }}
                        className={`tableData ${element?.applicationData?.applicationsByStatus?.find((el) => el?.status === "Hired")?.count ? 'text-header font-bold cursor-pointer' : ''}`}
                      >
                        <div className="flex items-center justify-center">
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hired")?.count ?? "-"}
                          {element?.applicationData?.applicationsByStatus.find((el) => el?.status === "Hired")?.count && (
                            <FaEye className="ml-2 cursor-pointer" /> // View Icon
                          )}
                        </div>
                      </td>









                      <td className="tableData">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="tableData">
                        {element?.createdBy}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        <td className="whitespace-nowrap border-none p-2">
                          <span
                            className={`${element?.status?.toLowerCase() === "open"
                              ? "bg-white !text-cyan-500 border-cyan-500"
                              : element?.status?.toLowerCase() === "closed"
                                ? "bg-red-100 text-red-600 "
                                : element?.status?.toLowerCase() === "draft"
                                  ? "bg-gray-100 text-gray-700 border-gray-400"
                                  : "bg-gray-100 text-gray-400"
                              } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status?.toLowerCase() === "open"
                              ? "actively hiring"
                              : element?.status?.toLowerCase() === "closed"
                                ? "closed"
                                : element?.status?.toLowerCase() === "draft"
                                  ? "not hiring"
                                  : "unavailable"}
                          </span>
                        </td>
                      </td>

                      <td className="tableData">

                        <span className="py-1.5 flex justify-start items-center space-x-2.5">

                          <Tooltip placement="topLeft"  title="Copy URL">
                            <button
                              onClick={() => handleCopyUrl(element?.companyId, element?._id)}
                              className="px-1.5 py-1 text-xs rounded-md bg-transparent border border-muted flex justify-center items-center gap-1"
                              type="button"
                            >
                              <FaRegCopy
                                className=" hover:text-[#337ab7] text-[#347ca6]"
                                size={14}
                              />
                            </button>
                          </Tooltip>
                          <Tooltip placement="topLeft"  title="Redirect URL">
                            <button
                              onClick={() => {
                                window.open(`${window.location.origin}/applicationonjobpost/${encrypt(element?._id)}`, "_blank");
                              }}
                              className="px-1.5 py-1 text-xs rounded-md bg-transparent border border-muted flex justify-center items-center gap-1"
                              type="button"
                            >
                              <BsLink
                                className=" hover:text-[#337ab7] text-[#347ca6]"
                                size={14}
                              />
                            </button>
                          </Tooltip>
                          <Dropdown
                            menu={{
                              items: [
                                ...(canUpdate
                                  ? [{
                                    key: 'edit-job-post',
                                    label: (
                                      <span
                                        onClick={() => {
                                          if (element?.status !== "Closed") {
                                            navigate(`/admin/job-post/edit/${encrypt(element?._id)}`);
                                          }
                                        }}
                                        className={`flex items-center ${element?.status === "Closed" ? "text-gray-400 cursor-not-allowed" : "text-[#3c8dbc] hover:text-[#337ab7]"}`}
                                      >
                                        <FaPenToSquare className="mr-2" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  }]
                                  : []),

                                ...(canDelete
                                  ? [{
                                    key: 'delete-job-post',
                                    label: (() => {
                                      const hasApplications =
                                        element?.applicationData?.applicationsByStatus?.some(el =>
                                          ["Selected", "Applied", "Rejected", "Hired"].includes(el?._id) && el?.count > 0
                                        );

                                      return (
                                        <span
                                          onClick={() => {
                                            if (!hasApplications) handleDelete(element?._id);
                                          }}
                                          className={`flex items-center ${hasApplications ? "text-gray-400 cursor-not-allowed" : "text-rose-600 hover:text-red-500"}`}
                                        >
                                          <RiDeleteBin5Line className="mr-2" size={16} />
                                          Delete
                                        </span>
                                      );
                                    })(),
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={14}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
            </table>
          </div>}
        {jobPostData?.length > 0 && (
          <CustomPagination
            totalCount={totaljobPostCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>

    </GlobalLayout>
  );
}
export default JobPostList;