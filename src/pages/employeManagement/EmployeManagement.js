import React, { useEffect, useState } from "react";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  FaPenToSquare,

} from "react-icons/fa6";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { Controller, get, useForm, useWatch } from "react-hook-form";
import { encrypt } from "../../config/Encryption";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import { AiOutlineFilter, AiOutlineRise } from "react-icons/ai";
import "react-vertical-timeline-component/style.min.css";
import {
  deleteEmploye, 
  employeeTrailing,
  getEmployeList,
  statusEmployefunc,
} from "./employeFeatures/_employe_reducers";
import getUserIds from "../../constents/getUserIds";
import Loader from "../../global_layouts/Loader/Loader";
import {
  domainName,

  inputAntdSelectClassNameFilter,
} from "../../constents/global";
import {
  companySearch,
  regeneratePassfunc,
} from "../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import moment from "moment";
import { Modal, Select, Switch, Tooltip, Dropdown } from "antd";
import usePermissions from "../../config/usePermissions";
import Loader2 from "../../global_layouts/Loader/Loader2";
import { TfiReload } from "react-icons/tfi";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import dayjs from "dayjs";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../global_layouts/ListLoader";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";


function EmployeManagement() {
  const {
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  const {
    userCompanyId,
    userBranchId,
    userType,
  } = getUserIds();
  
  const { employeList, totalEmployeCount, loading } = useSelector(
    (state) => state.employe
  );
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const { departmentListData, loading: departmentListloading } = useSelector((state) => state.department);
  const { employeeTrailingData } = useSelector((state) => state.employe);
  const [trailingModal, setTrailingModal] = useState(false);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  

  let step = 1;

  const timelineBoxStyle = (borderColor, bgColor) => ({
    background: bgColor,
    color: "#333",
    border: `1px solid ${borderColor}`,
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    padding: "20px",
  });
  

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
 
  const department = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });

  // const designationId = useWatch({
  //   control,
  //   name: "PDDesignationId",
  //   defaultValue: "",
  // });
  
  
  
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  
  
      const [searchParams, setSearchParams] = useSearchParams(); 
      const { canCreate, canRead, canUpdate, canDelete } = usePermissions(); 
      const urlActiveEmplyee=searchParams.get("isActive")
      const initialPage = parseInt(searchParams.get("page")) || 1;
      const initialLimit = 10;
      const initialBranchId = searchParams.get("branchId")|| "";
      const initialStatus = searchParams.get("status")|| ""; 
      const initialDepartmentId = searchParams.get("departmentId")|| "";   
      const initialDesignationId = searchParams.get("designationId")|| "";   
      const [currentPage, setCurrentPage] = useState(initialPage);
      const [limit, setLimit] = useState(initialLimit);
      const [status, setStatus] = useState(initialStatus ? initialStatus : urlActiveEmplyee=='true' ? 'true' : '');
      const [searchText, setSearchText] = useState("");
      const [branchId, setBranchId] = useState(initialBranchId);
      const [departmentId, setDepartmentId] = useState(initialDepartmentId);
       const [designationId, setDesignationId] = useState(initialDesignationId);
    


  
    
      useEffect(() => {
        const params = new URLSearchParams();
        if (currentPage > 1) params.set("page", currentPage);
        if (branchId) params.set("branchId", branchId);
        if (status) params.set("status", status);
        if (departmentId) params.set("departmentId", departmentId);
        if (designationId) params.set("designationId", designationId);
        setSearchParams(params);
      }, [branchId, status,currentPage, searchText, departmentId, designationId]);
      useEffect(() => {
        fetchEmployeListData();
      }, [branchId, status, currentPage, searchText, departmentId, designationId]);
    
      const handleResetFilters = () => {
        setCurrentPage(1);
        setBranchId("");
        setStatus("");
        setSearchText("");
        setDepartmentId("");
        setDesignationId("");
        };
      const onChange = (e) => {
        setSearchText(e);
      };
    
      const onPaginationChange = (page) => setCurrentPage(page);
      const handleBranchChange = (value) => {
        setBranchId(value);
        setCurrentPage(1);
      };
    
     
      const handleStatusChange = (value) => {
        setStatus(value);
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
        
    useEffect(() => {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      ).then((data) => {
       
      });
    }, [branchId])
    useEffect(() => {
    
      dispatch(
        designationSearch({
          text: "",
          sort: true,
          status: true,
          departmentId: departmentId,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      ).then((data) => {
       
      });
    }, [departmentId, companyId]);




  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  }, []);

  const fetchEmployeListData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        text: searchText,
        status: status === "true" ? true : status === "false" ? false : "",
        isHR: "",
        isTL: "",
        sort: true,
        isPagination: true,
        departmentId: departmentId,
        designationId: designationId,
        companyId:
        userInfoglobal?.userType === "admin"
          ? companyId
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
      },
    };
    dispatch(getEmployeList(reqData));
  };
  useEffect(() => {
    if (companyId || userType === "company" || userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
        })
      );
    }
  }, [companyId]);
  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };

    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEmploye(reqData)).then((data) => {
          if (!data.error) {
            fetchEmployeListData();
          }
        });
      }
    });
  };

  const handleTrailing = (id) => {
    dispatch(employeeTrailing({ _id: id }));

    setTrailingModal(true);
  };


  



  const handleRegeneratePassword = (element) => {
    Swal.fire({
      title: "Regenerate Password",
      text: `Are you sure to change password of ${element?.fullName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(regeneratePassfunc({ _id: element?._id })).then((data) => {
          if (!data?.error) {
            Swal.fire(
              "Password Regenerated!",
              "Password has been Regenerated.",
              "success"
            );
          } else {
            Swal.fire(
              "Error!",
              "Failed to Password Regenerated Successfully.",
              "error"
            );
          }
        });
      }
    });
  };
  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="w-full">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="grid sm:grid-cols-3 grid-cols-1 lg:grid-cols-3 sm:gap-3 gap-1">
              {userType === "admin" && (
                <div className="relative flex justify-center items-center space-x-2 text-[14px] rounded-md">
                  <HiOutlineFilter className="absolute left-2 text-gray-500" />
                  <Controller
                    control={control}
                    name="PDCompanyId" 
                    
                    rules={{ required: "Company is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        disabled={loading}
                        className={`${inputAntdSelectClassNameFilter} `}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
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
                </div>
              )}
              {(userType === "admin" ||
                userType === "company" ||
                userType === "companyDirector") && (
                  <div className="relative md:flex justify-center items-center space-x-2  text-[14px] rounded-md">
                    
                        <Select
                        
                          defaultValue={""}
                          disabled={loading}
                          className={`${inputAntdSelectClassNameFilter} `}
                          showSearch
                          onChange={handleBranchChange}
                          value={branchId}
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchListloading ? (<Select.Option disabled>
                            <ListLoader />
                          </Select.Option>) : (branchList?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          )))}
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
       
                      className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Status"
                      showSearch
                      disabled={loading}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value="true"> Active </Select.Option>
                      <Select.Option value="false"> InActive </Select.Option>
                    </Select>
                
              </div>
            </div>

            <div className="flex justify-end items-center">
              <button
                onClick={() => {
                 handleResetFilters()
                }}
                className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>

            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[5%]">
                  S.No.
                </th>

                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Employe Code</span>

                  </div>
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Employe Name</span>

                  </div>
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Department</span>

                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Designation</span>

                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mobile</span>

                  </div>{" "}
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>E-mail</span>

                  </div>{" "}
                </th>


                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Created By</span>

                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Last Updated By</span>

                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Date of joining</span>

                  </div>
                </th>

                {canUpdate && (
                  <th className="tableHead">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Status</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp />
                        <FaAngleDown />
                      </div>
                    </div>
                  </th>
                )}
                {canUpdate && (
                  <th className="tableHead w-[5%]">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {employeList && employeList?.length > 0 ? (
                  employeList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>

                      <td className="tableData">
                        {element?.userName || "-"}
                      </td>
                      <td className="tableData">
                        {element?.fullName || "-"}
                      </td>
                      <td className="tableData">
                        {element?.departmentData?.name || "-"}
                      </td>
                      <td className="tableData">
                        {element?.designationData?.name || "-"}
                      </td>
                      <td className="tableData ">
                        {element?.mobile?.code + element?.mobile?.number || "-"}{" "}
                      </td>
                      <td className="tableData ">
                        {element?.email || "-"}
                      </td>
                      <td className="tableData ">
                        {element?.createdBy || "-"}
                      </td>
                      <td className="tableData ">
                        {element?.updatedBy || "-"}
                      </td>
                      <td className="tableData ">
                        {element?.dateOfJoining
                          ? moment(element?.dateOfJoining).format("DD-MM-YYYY")
                          : "-"}
                      </td>
                      {canUpdate && (
                        <td className="tableData">
                          {canUpdate && (
                            <Tooltip placement="topLeft" 
                              title={`${element?.status
                                ? "Tap to Inactive"
                                : "Tap to Active"
                                }`}
                            >
                              <Switch
                                checked={element?.status}
                                onChange={() => {
                                  dispatch(
                                    statusEmployefunc({ _id: element?._id })
                                  ).then((data) => {
                                    if (!data?.error) {
                                      fetchEmployeListData();
                                    }
                                  });
                                }}
                                style={{
                                  backgroundColor: element?.status
                                    ? "#4caf50"
                                    : "#f44336",
                                  transition: "background-color 0.3s ease",
                                }}
                                height={20}
                                width={40}
                              />
                            </Tooltip>
                          )}
                        </td>
                      )}
                      {(canUpdate || canDelete) && (
                        <td className="tableData">
                          <Dropdown
                            menu={{
                              items: [
                                {
                                  key: 'regenerate-password',
                                  label: (
                                    <span
                                      onClick={() => handleRegeneratePassword(element)}
                                      className="flex items-center text-blue-700 hover:text-blue-600"
                                    >
                                      <TfiReload className="mr-2" size={16} />
                                      Regenerate Password
                                    </span>
                                  ),
                                },
                                {
                                  key: 'trigger-trailing',
                                  label: (
                                    <span
                                      onClick={() => handleTrailing(element?._id)}
                                      className="flex items-center text-green-600 hover:text-green-500"
                                    >
                                      <AiOutlineRise className="mr-2" size={20} />
                                      Trigger Trailing
                                    </span>
                                  ),
                                },
                                {
                                  key: 'edit',
                                  label: (
                                    <span
                                      onClick={() => {
                                        if (element?.onboardingId) {
                                          navigate(`/admin/onBoarding/edit/${encrypt(element?.onboardingId)}`);
                                        }
                                      }}
                                      className={`flex items-center ${element?.onboardingId
                                        ? 'text-[#3c8dbc] hover:text-[#337ab7]'
                                        : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                      <FaPenToSquare className="mr-2" size={16} />
                                      Edit
                                    </span>
                                  ),
                                  disabled: !element?.onboardingId,
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title="More Actions">
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

                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>

          <Modal
            title={`${employeeTrailingData?.fullName}'s Trailing`}
            open={trailingModal}
            className=""
            onCancel={() => setTrailingModal(false)}
            footer={null}
            width={800}
          >
            <VerticalTimeline lineColor="#90D1CA">
              {/* Onboarding Start */}
              <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={timelineBoxStyle("#007B83", "#D1F2F2")}
                contentArrowStyle={{ borderRight: "7px solid #007B83" }}
                iconStyle={{ background: "#007B83", color: "#fff" }}
                icon={
                  <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                    {step++}
                  </div>
                }
              >
                <h3 className="text-lg font-semibold mb-1">
                  {employeeTrailingData?.fullName}
                </h3>
                <h4 className="text-sm text-gray-600">
                  {employeeTrailingData?.designationData?.name}
                </h4>
                <h4 className="text-sm text-gray-600">
                  {" "}
                  date :{" "}
                  {`${dayjs(
                    employeeTrailingData?.onboardingData?.dateOfJoining
                  ).format("DD-MM-YYYY")} - Present`}
                </h4>
              </VerticalTimelineElement>



              {/* Department Changes */}
              {employeeTrailingData?.trackingData?.map((data, index) => {
                const typeStyles = {
                  departmentChange: {
                    borderColor: "#F9AB00", // Sweet amber
                    bgColor: "#FFF5D1", // Soft honey yellow
                  },
                  salaryIncrement: {
                    borderColor: "#34A853", // Fresh green
                    bgColor: "#E6F4EA", // Minty light green
                  },
                  designationChange: {
                    borderColor: "#5C9DFF", // Soft blue
                    bgColor: "#D9E8FF", // Powder blue
                  },
                  interview: {
                    borderColor: "#8E24AA", // Lavender purple
                    bgColor: "#F3E5F5", // Light lavender
                  },
                  application: {
                    borderColor: "#FB8C00", // Vivid orange
                    bgColor: "#FFE0B2", // Peach
                  },
                  onboarding: {
                    borderColor: "#00ACC1", // Teal blue
                    bgColor: "#E0F7FA", // Baby blue
                  },
                  salaryIncrement: {
                    borderColor: "#0984E3", // Bright ocean blue
                    bgColor: "#D7ECFF", // Light aqua blue
                  },
                  termination: {
                    borderColor: "#E53935", // Soft crimson red
                    bgColor: "#FFEBEE", // Blush pink background
                  },

                  resignation: {
                    borderColor: "#E53935", // Soft crimson red
                    bgColor: "#FFEBEE", // Blush pink background
                  },
                };

                const currentStyle = typeStyles[data?.type] || {
                  borderColor: "#999",
                  bgColor: "#f5f5f5",
                };
                return (
                  <VerticalTimelineElement
                    key={index}
                    className="vertical-timeline-element--work"
                    contentStyle={timelineBoxStyle(
                      currentStyle.borderColor,
                      currentStyle.bgColor
                    )}
                    contentArrowStyle={{
                      borderRight: `7px solid ${currentStyle.borderColor}`,
                    }}
                    iconStyle={{
                      background: currentStyle.borderColor,
                      color: "#fff",
                    }}
                    icon={
                      <div className="w-full h-full flex items-center justify-center text-white text-lg font-bold">
                        {step++}
                      </div>
                    }
                  >
                    {data?.type == "departmentChange" && (
                      <h3 className="text-lg font-semibold">
                        Department Change{" "}
                      </h3>
                    )}
                    {data?.type == "departmentChange" && (
                      <h4 className="text-sm text-gray-700">
                        New Department: {data?.changeHistory?.newDepartment}
                      </h4>
                    )}
                    {data?.type == "departmentChange" && (
                      <h4 className="text-sm text-gray-700">
                        Old Department: {data?.changeHistory?.oldDepartment}
                      </h4>
                    )}
                    {data?.type == "departmentChange" && (
                      <h4 className="text-sm text-gray-700">
                        Approved By : {data?.changeHistory?.createdBy}
                      </h4>
                    )}
                    {data?.type == "departmentChange" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Date: {dayjs(data?.updatedAt).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "salaryIncrement" && (
                      <h3 className="text-lg font-semibold">Increament </h3>
                    )}
                    {data?.type == "salaryIncrement" && (
                      <h4 className="text-sm text-gray-700">
                        Increment{" "}
                        {data?.changeHistory?.isPercentage
                          ? "Percentage"
                          : "Amount"}{" "}
                        :{" "}
                        {data?.changeHistory?.isPercentage
                          ? `${data?.changeHistory?.incrementPercentage} %`
                          : data?.changeHistory?.incrementAmount}
                      </h4>
                    )}
                    {data?.type == "salaryIncrement" && (
                      <h4 className="text-sm text-gray-700">
                        isPercentage:{" "}
                        {data?.changeHistory?.isPercentage ? "Yes" : "No"}
                      </h4>
                    )}
                    {data?.type == "salaryIncrement" && (
                      <h4 className="text-sm text-gray-700">
                        Approved By : {data?.changeHistory?.createdBy}
                      </h4>
                    )}
                    {data?.type == "salaryIncrement" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Next Increment Date:{" "}
                        {dayjs(data?.nextIncrementDate).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "salaryIncrement" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Date: {dayjs(data?.updatedAt).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "designationChange" && (
                      <h3 className="text-lg font-semibold">
                        Designation Change{" "}
                      </h3>
                    )}
                    {data?.type == "designationChange" && (
                      <h4 className="text-sm text-gray-700">
                        New Designation: {data?.changeHistory?.newDesignation}
                      </h4>
                    )}
                    {data?.type == "designationChange" && (
                      <h4 className="text-sm text-gray-700">
                        Old Designation: {data?.changeHistory?.oldDesignation}
                      </h4>
                    )}
                    {data?.type == "designationChange" && (
                      <h4 className="text-sm text-gray-700">
                        Approved By : {data?.changeHistory?.createdBy}
                      </h4>
                    )}
                    {data?.type == "designationChange" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Date: {dayjs(data?.updatedAt).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "interview" && (
                      <h3 className="text-lg font-semibold">Interview </h3>
                    )}
                    {data?.type == "interview" && (
                      <h4 className="text-sm text-gray-700">
                        Interviewer: {data?.changeHistory?.interviewerName} (
                        {data?.changeHistory?.interviewerPosition})
                      </h4>
                    )}
                    {data?.type == "interview" && (
                      <h4 className="text-sm text-gray-700">
                        Round: {data?.changeHistory?.roundName}
                      </h4>
                    )}
                    {data?.type == "interview" && (
                      <h4 className="text-sm text-gray-700">
                        Location: {data?.changeHistory?.location || "Online"}
                      </h4>
                    )}
                    {data?.type == "interview" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Date:{" "}
                        {dayjs(data?.changeHistory?.date).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "application" && (
                      <h3 className="text-lg font-semibold">Application</h3>
                    )}
                    {data?.type == "application" && (
                      <h4 className="mt-1 text-sm text-gray-700">
                        Profile Type:{" "}
                        {data?.changeHistory?.profileType ||
                          "Direct OnBoarding"}
                      </h4>
                    )}
                    {data?.type == "application" &&
                      data?.changeHistory?.totalExp && (
                        <h4 className="text-sm text-gray-700">
                          Total Experience: {data.changeHistory.totalExp} Years
                        </h4>
                      )}
                    {data?.type == "application" && (
                      <h4 className="text-sm text-gray-700 mt-1">
                        Date:{" "}
                        {dayjs(data?.changeHistory?.createdAt).format(
                          "DD-MM-YYYY"
                        )}
                      </h4>
                    )}

                    {data?.type == 'onboarding' && <h3 className="text-lg font-semibold"> OnBoarding</h3>}
                    {data?.type == "onboarding" && (
                      <h4 className="text-sm text-gray-700">
                        Date of Joining:{" "}
                        {dayjs(
                          data?.changeHistory?.dateOfJoining
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}
                    {data?.type == "onboarding" && (
                      <h4 className="text-sm text-gray-700">
                        Update By:{" "}

                        {data?.changeHistory?.createdBy}

                      </h4>
                    )}
                    {data?.type == "onboarding" && (
                      <h4 className="text-sm text-gray-700">
                        Date of Birth:{" "}
                        {dayjs(
                          data?.changeHistory?.dateOfBirth
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}


                    {data?.type == "termination" && (
                      <h3 className="text-lg font-semibold">
                        Termination{" "}
                      </h3>
                    )}

                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        applyDate:{" "}
                        {dayjs(
                          data?.changeHistory?.applyDate
                        ).format("DD-MM-YYYY")}

                      </h4>
                    )}
                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        approvalDate:{" "}

                        {dayjs(
                          data?.changeHistory?.approvalDate
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        completeDate:{" "}

                        {dayjs(
                          data?.changeHistory?.completeDate
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}


                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        Description:{" "}

                        {data?.changeHistory?.description}

                      </h4>

                    )}

                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        Reason:{" "}

                        {data?.changeHistory?.reason}

                      </h4>
                    )}
                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        Update By:{" "}

                        {data?.changeHistory?.createdBy}

                      </h4>
                    )}

                    {data?.type == "termination" && (
                      <h4 className="text-sm text-gray-700">
                        createdAt:{" "}

                        {dayjs(
                          data?.changeHistory?.createdAt
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}











                    {data?.type == "resignation" && (
                      <h3 className="text-lg font-semibold">
                        Resignation{" "}
                      </h3>
                    )}

                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        applyDate:{" "}
                        {dayjs(
                          data?.changeHistory?.applyDate
                        ).format("DD-MM-YYYY")}

                      </h4>
                    )}
                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        approvalDate:{" "}

                        {dayjs(
                          data?.changeHistory?.approvalDate
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}

                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        completeDate:{" "}

                        {dayjs(
                          data?.changeHistory?.completeDate
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}


                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        Description:{" "}

                        {data?.changeHistory?.description}

                      </h4>

                    )}

                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        Reason:{" "}

                        {data?.changeHistory?.reason}

                      </h4>
                    )}
                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        Update By:{" "}

                        {data?.changeHistory?.createdBy}

                      </h4>
                    )}

                    {data?.type == "resignation" && (
                      <h4 className="text-sm text-gray-700">
                        createdAt:{" "}

                        {dayjs(
                          data?.changeHistory?.createdAt
                        ).format("DD-MM-YYYY")}
                      </h4>
                    )}
                  </VerticalTimelineElement>
                );
              })}
            </VerticalTimeline>
          </Modal>
        </div>
        {employeList?.length > 0 && (
          <CustomPagination
            totalCount={totalEmployeCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>
    </GlobalLayout>
  );
}
export default EmployeManagement;
