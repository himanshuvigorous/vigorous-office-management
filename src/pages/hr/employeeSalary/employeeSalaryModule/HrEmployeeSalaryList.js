import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, handleSortLogic, inputAntdSelectClassNameFilter, inputClassNameSearch } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { encrypt } from "../../../../config/Encryption";
import { deleteEmployeeSalaryDetails, getEmployeeSalaryDetailsList } from "./employeeSalaryFeatures/_employee_salary_reducers";
import Swal from "sweetalert2";
import { Select, Tooltip } from "antd";
import { IoEnter } from "react-icons/io5";
import CreatePayrollModal from "./CreatePayrollModal";
import PayrollListModal from "./PayrollListModal";
import { BsList } from "react-icons/bs";
import PayrollDatafullList from "./PayrollDatafullList";

function HrEmployeeSalaryList() {
  const {   
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { employeeSalaryList, employeeSalaryCount } = useSelector((state) => state.salaryDetails);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
  const pageSize = 10;
  const navigate = useNavigate();
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const [elementData, setElementData] = useState(null);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const [elementDataList, setElementDataList] = useState(null);
  const [isCraeteModalOpenList, setIsCraeteModalOpenList] = useState(false);
  const [isPayrollListModalOpen, setIsPayrollListModalOpen] = useState(false);
  const [payrollDatafullListId, setPayrollDatafullListId] = useState(null);
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
          isPagination:false,
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

  useEffect(() => {
    fetchEmployeListData()
  }, [CompanyId, BranchId, searchText, status])


  const fetchEmployeListData = () => {
    let reqData = {
      currentPage: currentPage,
      pageSize: pageSize,
      reqPayload: {
        text: searchText,
        status: status,
        isHR: "",
        isTL: "",
        sort: true,
        isPagination: false,
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      },
    }
    dispatch(getEmployeeSalaryDetailsList(reqData)).then((data) => {
      if (!data?.error) {
        setElementDataList(sortedList?.find((item) => item?._id === elementDataList?._id));
      }
    })
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
        dispatch(deleteEmployeeSalaryDetails(reqData)).then((data) => {
          fetchEmployeListData();
        });
      }
    });
  };
  const [sortedList, setSortedList] = useState([]);
  useEffect(() => {
    if (employeeSalaryList) {
      handleSort();
    }
  }, [employeeSalaryList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, employeeSalaryList);
    setSortedList(sortedList);
  };

  const onChange = (e) => {
    
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="flex justify-between items-center">
            <div className="flex justify-between items-center space-x-2 px-2 text-[14px] rounded-md">
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
                      Select Comapany
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select> */}

                  <Controller
                    control={control}
                    name="PDCompanyId"
                    rules={{ required: "Company is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        // onFocus={() => {
                        //   dispatch(
                        //     companySearch({
                        //       text: "",
                        //       sort: true,
                        //       status: true,
                        //       isPagination: false,
                        //     })
                        //   );
                        // }}
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
                      control={control}
                      name="PDBranchId"
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          // onFocus={() => {
                          //   dispatch(
                          //     companySearch({
                          //       text: "",
                          //       sort: true,
                          //       status: true,
                          //       isPagination: false,
                          //     })
                          //   );
                          // }}
                          className={`${inputAntdSelectClassNameFilter} `}
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

              <Select
                className={` ${inputAntdSelectClassNameFilter} `}
                value={status}
                onChange={(e) => {
                  setStatus(e);
                }}
                placeholder="Select Status"
                showSearch
              >
                <Select.Option value="">Select Status</Select.Option>
                <Select.Option value={true}>{"Active"}</Select.Option>
                <Select.Option value={false}>{"InActive"}</Select.Option>
              </Select>
            </div>
            <Tooltip placement="topLeft"  title='Create Salary'>
              <button
                onClick={() => navigate("/admin/employee-salary-list/create")}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Create Salary</span>
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[5%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Employe Name</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("employeName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("employeName", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  {/* <th className="border-none p-2 whitespace-nowrap">
                             <div className="flex justify-start items-center space-x-1">
                               <span>Address</span>
                               <div className="flex flex-col -space-y-1.5 cursor-pointer">
                                 <FaAngleUp />
                                 <FaAngleDown />
                               </div>
                             </div>
                           </th> */}
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Current Package</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("currentPackage", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("currentPackage", "desc")}
                        />
                      </div>
                    </div>{" "}
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Current Salary</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("currentSalary", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("currentSalary", "desc")}
                        />
                      </div>
                    </div>{" "}
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Per Day Salary</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("perDaySalary", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("perDaySalary", "desc")}
                        />
                      </div>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>isPf</span>

                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Pf Type</span>

                    </div>
                  </th>
                  {/* <th className="border-none p-2 whitespace-nowrap">
                             <div className="flex justify-start items-center space-x-1">
                               <span>Last Login</span>
                               <div className="flex flex-col -space-y-1.5 cursor-pointer">
                                 <FaAngleUp />
                                 <FaAngleDown />
                               </div>
                             </div>
                           </th> */}
                  <th className="border-none p-2 whitespace-nowrap">
                    <div className="flex justify-start items-center space-x-1">
                      <span>Status</span>
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">

                      </div>
                    </div>
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[5%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedList && sortedList?.length > 0 ? (
                  sortedList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1 + ((currentPage - 1) * pageSize)}
                      </td>
                      {/* <td className="whitespace-nowrap border-none p-2 ">
                                 {element.profileImage ? (
                                   <img
                                     alt=""
                                     src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                                     className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                   />
                                 ) : (
                                   <img
                                     alt=""
                                     src={`/images/avatar.jpg`}
                                     className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                                   />
                                 )}
                               </td> */}
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.employeName}
                      </td>

                      <td className="whitespace-nowrap border-none p-2 ">
                        {element?.currentPackage}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {element?.currentSalary}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {element?.perDaySalary}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.pfType ? 'Yes' : "No"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {element?.pfType || "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        <Tooltip placement="topLeft"  title={`Status - ${element?.status ? "Active" : "InActive"}`}>
                          <span
                            className={`${element?.status
                              ? "bg-[#E0FFBE] border-green-500"
                              : "bg-red-200 border-red-500"
                              } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status ? "Active" : "Inactive" ?? "-"}
                          </span>
                        </Tooltip>
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          <Tooltip placement="topLeft"  title='Create Payroll'>
                            <button
                              onClick={() => {
                                // navigate("/admin/leave-request-list/create");
                                setIsCraeteModalOpen(true);
                                setElementData(element)
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <IoEnter
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>
                          <Tooltip placement="topLeft"  title='Show Payroll List'>
                            <button
                              onClick={() => {
                                // navigate("/admin/leave-request-list/create");
                                setIsCraeteModalOpenList(true);
                                setElementDataList(element)
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <BsList
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>
                          <Tooltip placement="topLeft"  title='Edit'>
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/employee-salary-list/edit/${encrypt(element?._id)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>

                          <Tooltip placement="topLeft"  title='Delete'>
                            <button
                              onClick={() => handleDelete(element?._id)}
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <RiDeleteBin5Line
                                className="text-red-600 hover:text-red-500"
                                size={16}
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
                      colSpan={9}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <CustomPagination
          totalCount={employeeSalaryCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        {isCraeteModalOpen && <CreatePayrollModal
          isOpen={true}
          onClose={() => { setIsCraeteModalOpen(false); setElementData({}) }}
          fetchEmployeListData={fetchEmployeListData}
          element={elementData}
        />}
        {isCraeteModalOpenList && <PayrollListModal
          isOpen={true}
          onClose={() => { setIsCraeteModalOpenList(false); setElementDataList({}) }}
          fetchEmployeListData={fetchEmployeListData}
          element={elementDataList}
          isPayrollListModalOpen={isPayrollListModalOpen}
          setIsPayrollListModalOpen={setIsPayrollListModalOpen}
          payrollDatafullListId={payrollDatafullListId}
          setPayrollDatafullListId={setPayrollDatafullListId}
        />}
        {
          isPayrollListModalOpen && <PayrollDatafullList
            isOpen={true}
            onClose={() => { setIsPayrollListModalOpen(false); setPayrollDatafullListId(null) }}
            element={payrollDatafullListId}
          />
        }

      </div>
    </GlobalLayout>
  );
}

export default HrEmployeeSalaryList;
