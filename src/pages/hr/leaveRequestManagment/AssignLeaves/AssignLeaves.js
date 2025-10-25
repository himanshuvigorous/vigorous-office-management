import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaChevronDown,
  FaChevronUp,
  FaDeleteLeft,
  FaPaperPlane,
  FaPenToSquare,
} from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { domainName, inputClassNameSearch } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";

import { leaveTypeSearch } from "../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import {
  assignLeaveDataSearch,
  deleteAssignedLeaveEmployee,
  getUpdateleaveRequest,
} from "./AssignLeaveFeatures/_assign_leave_reducers";
import moment from "moment";
import { encrypt } from "../../../../config/Encryption";
import { FaEdit, FaRegTimesCircle } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { BsSend } from "react-icons/bs";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";

function AssignLeaves() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { companyList } = useSelector((state) => state.company);
  const { assignleaveListData } = useSelector((state) => state.assignLeave);
  const { branchList } = useSelector((state) => state.branch);
  const [expandedBranchIndex, setExpandedBranchIndex] = useState(null);
  const [expandedEmployeeIndex, setExpandedEmployeeIndex] = useState(null);

  const toggleBranch = (index) => {
    setExpandedBranchIndex(expandedBranchIndex === index ? null : index);
  };

  const toggleEmployee = (index) => {
    setExpandedEmployeeIndex(expandedEmployeeIndex === index ? null : index);
  };
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    getAssignRequestData();
  }, [CompanyId, BranchId, searchText]);

  const getAssignRequestData = () => {
    const reqData = {
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
      text: searchText,
      sort: true,
      status: "",
      isPagination: false,
    };
    dispatch(assignLeaveDataSearch(reqData));
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
  const [inputValue, setInputValue] = useState(null);
  const [inputId, setInputId] = useState(null);
  const [openInout, setOpenInput] = useState({
    branchIndex: null,
    employeeIndex: null,
  });
  const openInput = (branchIndex, employeeIndex, id) => {
    setOpenInput({
      branchIndex: branchIndex,
      employeeIndex: employeeIndex,
    });
    setInputId(id);
  };
  const hanbdleSubmit = () => {
    dispatch(
      getUpdateleaveRequest({
        _id: inputId,
        totalLeaves: inputValue,
      })
    ).then((data) => {
      if (!data?.error) {
        getAssignRequestData();
        setOpenInput({
          branchIndex: null,
          employeeIndex: null,
        });
      }
    });
  };
  const handleDelete = (_id) => {
    dispatch(
      deleteAssignedLeaveEmployee({
        _id: _id,
      })
    ).then((data) => {
      if (!data?.error) {
        getAssignRequestData();

      }
    });
  };



  const onChange = (e) => {
    
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="flex gap-3">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  {/* <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassNameSearch} ${
                      errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select Company
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select> */}

                  <Controller
                    name="PDCompanyId"
                    control={control}
                    rules={{ required: "Company is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`w-full ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
                        showSearch
                       filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                        placeholder="Select Company"
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
                    {/* <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassNameSearch} ${
                      errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select Branch
                    </option>
                    {branchList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select> */}
                    <Controller
                      name="PDBranchId"
                      control={control}
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`w-full ${inputClassNameSearch} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          placeholder="Select Branch"
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchList?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
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
              <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PdCompanyId", "")
                }}
                className="bg-header  py-1 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
          </div>
        </div>

        {assignleaveListData?.length > 0 ?
          assignleaveListData?.map((branch, branchIndex) => (
            <div
              className="mb-2 bg-white shadow-sm rounded-lg text-xs overflow-hidden"
              key={branchIndex}
            >
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-4 bg-header text-white text-xs p-2 w-full">
                  <div className="col-span-1 text-center">Leave Name</div>
                  <div className="col-span-1 text-center">Max Days</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Is Paid</div>
                  <div className="col-span-1 text-center">Is Carry Forward</div>
                  {<div className="col-span-1 text-center">Action</div>}
                </div>

                <div
                  className="grid grid-cols-6 gap-4 border-b cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => toggleBranch(branchIndex)}
                >
                  <div className="col-span-1 text-left pl-4">{branch.name}</div>
                  <div className="col-span-1 text-center">{branch.maxDays}</div>
                  <div className="col-span-1 text-center">
                    {branch.status ? "Active" : "Inactive"}
                  </div>
                  <div className="col-span-1 text-center">
                    {branch.isPaid ? "Active" : "Inactive"}
                  </div>
                  <div className="col-span-1 text-center">
                    {branch.isCarryForword ? "Active" : "Inactive"}
                  </div>
                  <div className="col-span-1 flex gap-2 justify-center items-center text-center">
                    {canRead && <Tooltip placement="topLeft"  title='View Details'>
                      <button
                        className="text-xs py-1 px-2 bg-header text-white rounded-sm hover:bg-header transition duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBranch(branchIndex);
                        }}
                      >
                        {expandedBranchIndex === branchIndex ? (
                          <FaChevronUp size={12} />
                        ) : (
                          <FaChevronDown size={12} />
                        )}
                      </button>
                    </Tooltip>}
                    {canCreate && <Tooltip placement="topLeft"  title='Add Employee'>
                      <button
                        onClick={() => {
                          navigate(
                            `/admin/assigned-leave/create/${encrypt(branch.companyId)}/${encrypt(branch.branchId)}/${encrypt(branch._id)}`
                          );
                        }}
                        className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                      >
                        <FaPlus />
                      </button>
                    </Tooltip>}
                    {/* <button
                    onClick={() => {
                      navigate(
                        `/admin/assigned-leave/details/${encrypt(branch.companyId)}/${encrypt(branch.branchId)}/${encrypt(branch._id)}`
                      );
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <BsSend />
                  </button> */}
                  </div>
                </div>

                {expandedBranchIndex === branchIndex &&
                  branch.assignedEmployeData?.length > 0 && (
                    <>
                      <div className="grid grid-cols-5 gap-4 bg-gray-200 p-2">
                        <div className="col-span-1 text-center">Employee</div>
                        <div className="col-span-1 text-center">Total Leaves</div>
                        <div className="col-span-1 text-center">Used Leaves</div>
                        <div className="col-span-1 text-center">
                          Available Leaves
                        </div>
                        <div className="col-span-1 text-center">Action</div>
                      </div>

                      {branch.assignedEmployeData?.map(
                        (employee, employeeIndex) => (
                          <React.Fragment key={employeeIndex}>
                            <div
                              className="grid grid-cols-5 gap-4 border-b cursor-pointer hover:bg-gray-100 p-2"
                              onClick={() => toggleEmployee(employeeIndex)}
                            >
                              <div className="col-span-1 text-center">
                                {employee.employeName}
                              </div>
                              <div className="col-span-1 text-center">
                                {openInout?.branchIndex === branchIndex &&
                                  openInout?.employeeIndex === employeeIndex ? (
                                  <input
                                    value={inputValue}
                                    className="border border-header text-center"
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                  />
                                ) : (
                                  employee.totalLeaves
                                )}
                              </div>
                              <div className="col-span-1 text-center">
                                {employee.usedLeaves}
                              </div>
                              <div className="col-span-1 text-center">
                                {employee.availableLeaves}
                              </div>
                              <div className=" flex justify-center items-center gap-2">
                                {openInout?.branchIndex === branchIndex &&
                                  openInout?.employeeIndex === employeeIndex ? (
                                  <div
                                    onClick={() => {
                                      openInput("", "", "");
                                      setInputValue(null);
                                    }}
                                    className="col-span-1 text-center"
                                  >
                                    <FaRegTimesCircle size={15} />
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => {
                                      openInput(
                                        branchIndex,
                                        employeeIndex,
                                        employee?._id
                                      );
                                      setInputValue(employee.totalLeaves);
                                    }}
                                    className="col-span-1 text-center"
                                  >
                                    <FaEdit size={15} />
                                  </div>
                                )}
                                {openInout?.branchIndex === branchIndex &&
                                  openInout?.employeeIndex === employeeIndex && (
                                    <div onClick={() => hanbdleSubmit()}>
                                      <FaPaperPlane size={15} />
                                    </div>
                                  )}
                                <div onClick={() => handleDelete(employee?._id)}>
                                  <MdDeleteOutline size={15} />
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        )
                      )}
                    </>
                  )}
              </div>
            </div>
          ))
          :
          <div className="text-center text-white font-semibold rounded  py-2 bg-header">No Data Found</div>
        }
      </>
    </GlobalLayout>
  );
}
export default AssignLeaves;
