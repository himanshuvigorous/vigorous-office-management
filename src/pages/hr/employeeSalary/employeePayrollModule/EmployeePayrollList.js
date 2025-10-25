import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaCircleChevronDown, FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";
import { HiOutlineDotsVertical, HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../../global_layouts/Loader/Loader";
import { encrypt } from "../../../../config/Encryption";
import {
  deleteLeaveRequest,
  deletePayroll,
  getPayrollList,
  payrollStatusFunc,
  updateLeaveRequestStatus,
} from "./employeePayRollFeatures/_payroll_reducers";
import {
  domainName,
  inputClassNameSearch,
  inputClassName,
  formatNumber,
  inputAntdSelectClassNameFilter,
  inputLabelClassName,
} from "../../../../constents/global";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { FaCheck, FaCheckCircle, FaDollarSign, FaEye, FaTimesCircle } from "react-icons/fa";
import moment from "moment";

import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { AiFillEdit } from "react-icons/ai";
import { BsFillTrash2Fill } from "react-icons/bs";
import CreatePayrollModal from "./CreatePayrollModal";
import { Select, Tooltip, Dropdown } from "antd";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import PayrollDatafullList from "../employeeSalaryModule/PayrollDatafullList";
import { CgDetailsMore } from "react-icons/cg";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import dayjs from "dayjs";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";

function EmployeePayrollList() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      date: dayjs(),
    }
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, payrollRequestData, totalPayrollquestCount,payrollSummary } = useSelector(
    (state) => state.payrollReducer
  );


  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
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
  const status = useWatch({
    control,
    name: 'status',
    defaultValue: ''
  })
  const date = useWatch({
    control,
    name: 'date',
    defaultValue: dayjs()

  })
  const [currentPage, setCurrentPage] = useState(1);
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [isEditModalOpen, setisEditModalOpen] = useState({
    _id: null,
    visible: false
  });

  const handleviewAttendacelist = (element) => {
    setisEditModalOpen({
      _id: element?._id,
      visible: true
    })
  }
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 15;

  const [searchText, setSearchText] = useState("");

  const filters = [CompanyId, BranchId, searchText, status, date].join("-");
  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      getPayrollFunc();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    getPayrollFunc();
  }, [currentPage]);

  const getPayrollFunc = () => {
    const selectedDate = date || dayjs(); // Use current date if no date selected
    const year = selectedDate.year();
    const month = selectedDate.month() + 1; // Months are 0-indexed in dayjs
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
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
        year: year, // Add year to payload
        month: month.toString().padStart(2, '0'), // Add month to payload (with leading zero)
        status: status,
        isPagination: true,
        directorId: "",
        employeId: "",
      },
    };
    dispatch(getPayrollList(data));
  };


  const handleReject = (id) => {
    dispatch(
      deletePayroll({
        _id: id,
      })
    ).then((data) => {
      // getPayrollFunc();
      if (currentPage > 1 && payrollRequestData?.length == 1) {
        setCurrentPage(Number(currentPage - 1));

      } else {
        getPayrollFunc();
      }
    });
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



  const handlePayrollStatusChange = (e, id) => {
    // Show a confirmation dialog when the user tries to change the status
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to update the payroll status as ${e} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with dispatching if the user clicks "Yes"
        dispatch(
          payrollStatusFunc({
            _id: id,
            status: e,
          })
        ).then((data) => {
          if (!data?.error) {
            // On success, show a success alert
            Swal.fire(
              'Updated!',
              'The payroll status has been updated successfully.',
              'success'
            );
            getPayrollFunc(); // Fetch updated payroll
          } else {
            // On error, show an error alert
            Swal.fire(
              'Error!',
              'Something went wrong while updating the payroll status.',
              'error'
            );
          }
        });
      }
    });
  }

  const onChange = (e) => {
    ;
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="flex justify-start items-center  my-1">
        <button
          onClick={() => navigate("/admin/standardPayroll")}
          className=" px-3 border border-black py-2 rounded-l-md flex justify-center items-center space-x-2 text-black"

        >

          <span className="text-[12px]">Standard payroll</span>
        </button>
        <button
          className="bg-header px-3 py-2 border border-header rounded-r-md flex justify-center items-center space-x-2 text-white"
        >

          <span className="text-[12px]">Actual Payslip</span>
        </button>
      </div>

      <>
        <div className="bg-grey-100 w-full">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex gap-2 md:space-y-0 space-y-1">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
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
                    <Controller
                      control={control}
                      name="PDBranchId"
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          disabled={loading}
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
              <div className="">
                <Controller
                  name="status"
                  control={control}
                  rules={{
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Status"
                      disabled={loading}
                      showSearch
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value="Draft" > Draft  </Select.Option>
                      <Select.Option value="Approved" > Approved  </Select.Option>
                      {/* <Select.Option value="Rejected" > Rejected  </Select.Option> */}
                      <Select.Option value="Paid" > Paid  </Select.Option>

                    </Select>
                  )}
                />
              </div>



              <div className="">
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      field={field}
                      errors={errors}
                      picker="month"
                      report={true}
                      format="MM/YYYY"
                      disabledDate={(current) => {
                        return (
                          current && current.isAfter(moment().endOf("day"), "day")
                        );
                      }}
                    />
                  )}
                />
              </div>



              <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PDCompanyId", "")
                  setValue("status", "")
                  setValue("date", dayjs())

                }}
                className="bg-header py-[6px] w-full rounded-md flex px-5 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
            <div className="flex justify-end items-center gap-2">

              <Tooltip placement="topLeft" title="Create Payroll">
                <button
                  onClick={() => {
                    setIsCraeteModalOpen(true);
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center whitespace-nowrap items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Generate Payslip</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        {payrollSummary && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-3">Payroll Summary for {dayjs(date).format('MMMM YYYY')}</h3>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
               
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900"> Standard Salary</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalTargetSalary).toFixed(2)}</td>   
                     <td className="px-4 py-2 text-sm font-medium text-gray-900"> Base Salary</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalBasicSalary).toFixed(2)}</td>              
                  </tr>
                  <tr>
                   
                     <td className="px-4 py-2 text-sm font-medium text-gray-900">Total Allowances</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalAllowancesFromSummary).toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">Gross Salary</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalGrossSalary).toFixed(2)}</td>
                 
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">Total Deductions</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalNetSalary - payrollSummary.totalGrossSalary ).toFixed(2)}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">Net Salary</td>
                    <td className="px-4 py-2 text-sm text-gray-900">₹{formatNumber(payrollSummary.totalNetSalary).toFixed(2)}</td>
                  </tr>
             
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead w-[10%]">Employee Name</th>
                <th className="tableHead w-[10%]">Designation</th>
                {/* <th className="tableHead">Start date</th>
                <th className="tableHead">End date</th> */}
                {/* <th className="tableHead">Basic Salary</th> */}
                                <th className="tableHead">Standard Salary</th>
                <th className="tableHead">Gross Salary</th>
                <th className="tableHead">Deductions</th>
                <th className="tableHead">Net Salary</th>

                <th className="tableHead">createdAt</th>
                <th className="tableHead">Status</th>
                <th className="tableHead w-[10%]">Action</th>
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={10}
                className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :

              <tbody>
                {payrollRequestData && payrollRequestData.length > 0 ? (
                  payrollRequestData.map((element, index) => (
                    <tr
                      key={element?._id}
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="tableData">
                        {element?.employeName}
                      </td>
                      <td className="tableData">
                        {element?.designationName || "-"}
                      </td>
                      {/* <td className="tableData">
                        {moment(element?.startDate).format("DD-MM-YYYY")}
                      </td>
                      <td className="tableData">
                        {moment(element?.endDate).format("DD-MM-YYYY")}
                      </td> */}
                      {/* <td className="tableData whitespace-nowrap">
                        {formatNumber(element?.basicSalary).toFixed(2)} ₹
                      </td> */}
                       <td className="tableData whitespace-nowrap">
                        {formatNumber(element?.currentSalaryPerMonth).toFixed(2)} ₹
                      </td>
                      <td className="tableData  whitespace-nowrap">
                        {formatNumber(element?.grossSalary).toFixed(2)} ₹
                      </td>
                      <td className="tableData  whitespace-nowrap">
                        {formatNumber(element?.grossSalary - element?.netSalary).toFixed(2)} ₹
                      </td>
                      <td className="tableData whitespace-nowrap">
                        {formatNumber(element?.netSalary).toFixed(2)} ₹
                      </td>
                     
                      <td className="tableData">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td className="tableData">
                        <span
                          className={`tableData px-2 py-1 text-xs rounded-md border-[1px] font-medium
                          ${element?.status === 'Draft'
                              ? 'text-gray-600 bg-gray-100 border-gray-300'
                              : element?.status === 'Approved'
                                ? 'text-green-600 bg-green-100 border-green-300'
                                : element?.status === 'Rejected'
                                  ? 'text-red-600 bg-red-100 border-red-300'
                                  : element?.status === 'Paid'
                                    ? 'text-yellow-600 bg-yellow-100 border-yellow-300'
                                    : ''
                            }`}
                        >
                          {element?.status}
                        </span>

                      </td>

                      <td className="tableData">
                        {/* <span
                          className={`py-1.5 flex justify-start items-center  space-x-2.5`}
                        >
                          <Tooltip placement="topLeft"  title={"Daily Report"} >
                            <button
                              onClick={() => handleviewAttendacelist(element)}
                              className={`px-2 py-1.5 rounded-md bg-transparent border border-muted `}
                              type="button"
                            >
                              <CgDetailsMore
                                className={"text-cyan-600 hover:text-cyan-500"}
                                size={16}
                              />
                            </button>
                          </Tooltip>
                          <Tooltip placement="topLeft"  title={element?.status === "Approved" || element?.status === "Rejected" || element?.status === "Paid" ? "Already Approved, Rejected, or Paid" : "Approve"}>
                            <button
                              onClick={() => handlePayrollStatusChange("Approved", element?._id)}
                              className={`px-2 py-1.5 rounded-md bg-transparent border border-muted ${element?.status === "Approved" || element?.status === "Rejected" || element?.status === "Paid" ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:text-green-500"}`}
                              type="button"
                              disabled={element?.status === "Approved" || element?.status === "Rejected" || element?.status === "Paid"} // Disable if not in Draft
                            >
                              <FaCheckCircle
                                className={` ${element?.status === "Approved" || element?.status === "Rejected" || element?.status === "Paid" ? "text-gray-400" : "text-green-600 hover:text-green-500"}`}
                                size={16}
                              />
                            </button>
                          </Tooltip>

                          <Tooltip placement="topLeft"  title={element?.status !== "Draft" ? "Cannot Reject if not in Draft" : "Reject"}>
                            <button
                              onClick={() => handlePayrollStatusChange("Rejected", element?._id)}
                              className={`px-2 py-1.5 rounded-md bg-transparent border border-muted ${element?.status !== "Draft" ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-500"}`}
                              type="button"
                              disabled={element?.status !== "Draft"}
                            >
                              <FaTimesCircle
                                className={` ${element?.status !== "Draft" ? "text-gray-400" : "text-red-600 hover:text-red-500"}`}
                                size={16}
                              />
                            </button>
                          </Tooltip>

                         


                          <Tooltip placement="topLeft"  title="View">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/paySlipData/${encrypt(element?._id)}`
                                )
                              }
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaEye
                                className={` ${"text-sky-600 hover:text-sky-500"}`}
                                size={16}
                              />
                            </button>
                          </Tooltip>
                          {
                            <Tooltip placement="topLeft"  title="Delete">
                              <button
                                onClick={() => handleReject(element?._id)}
                                className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                type="button"
                                disabled={

                                  element?.status !== "Rejected"
                                }
                              >
                                <RiDeleteBin5Line
                                  className={` ${element?.status === "Rejected"
                                    ? "text-red-600 hover:text-red-500"
                                    : "text-gray-600 hover:text-gray-500"
                                    }`}
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                          }

                        
                        </span> */}
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: [
                              {
                                key: 'daily-report',
                                label: (
                                  <span className="flex items-center text-cyan-600">
                                    <CgDetailsMore className="mr-2" /> Daily Report
                                  </span>
                                ),
                                onClick: () => handleviewAttendacelist(element),
                              },
                              {
                                key: 'approve',
                                label: (
                                  <span
                                    className={`flex items-center ${['Approved', 'Rejected', 'Paid'].includes(element?.status)
                                      ? 'text-gray-400 cursor-not-allowed'
                                      : 'text-green-600'
                                      }`}
                                  >
                                    <FaCheckCircle className="mr-2" />
                                    Approve
                                  </span>
                                ),
                                onClick: () =>
                                  !['Approved', 'Rejected', 'Paid'].includes(element?.status) &&
                                  handlePayrollStatusChange('Approved', element?._id),
                                disabled: ['Approved', 'Rejected', 'Paid'].includes(element?.status),
                              },
                              // {
                              //   key: 'reject',
                              //   label: (
                              //     <span
                              //       className={`flex items-center ${element?.status !== 'Draft'
                              //         ? 'text-gray-400 cursor-not-allowed'
                              //         : 'text-red-600'
                              //         }`}
                              //     >
                              //       <FaTimesCircle className="mr-2" />
                              //       Reject
                              //     </span>
                              //   ),
                              //   onClick: () =>
                              //     element?.status === 'Draft' &&
                              //     handlePayrollStatusChange('Rejected', element?._id),
                              //   disabled: element?.status !== 'Draft',
                              // },
                              {
                                key: 'view',
                                label: (
                                  <span className="flex items-center text-sky-600">
                                    <FaEye className="mr-2" />
                                    View
                                  </span>
                                ),
                                onClick: () =>
                                  navigate(`/admin/paySlipData/${encrypt(element?._id)}`),
                              },
                              {
                                key: 'delete',
                                label: (
                                  <span
                                    className={`flex items-center ${element?.status === 'Draft'
                                      ? 'text-red-600'
                                      : 'text-gray-500 cursor-not-allowed'
                                      }`}
                                  >
                                    <RiDeleteBin5Line className="mr-2" />
                                    Delete
                                  </span>
                                ),
                                onClick: () =>
                                  element?.status === 'Draft' && handleReject(element?._id),
                                disabled: element?.status !== 'Draft',
                              },
                            ],
                          }}
                        >
                          <Tooltip placement="topLeft" title="More">
                            <button
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <PiDotsThreeOutlineVerticalBold
                                size={16}
                                className="text-[#3c8dbc] hover:text-[#337ab7]"
                              />
                            </button>
                          </Tooltip>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={12}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>

        <CustomPagination
          totalCount={totalPayrollquestCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        {isCraeteModalOpen && (
          <CreatePayrollModal
            isOpen={true}
            onClose={() => setIsCraeteModalOpen(false)}
            fetchattendanceListData={getPayrollFunc}
          />
        )}
        {
          isEditModalOpen?.visible && <PayrollDatafullList
            isOpen={true}
            onClose={() => setisEditModalOpen({
              _id: null,
              visible: false
            })}
            element={isEditModalOpen?._id}
          />
        }
      </>
      {/* )} */}
    </GlobalLayout >
  );
}
export default EmployeePayrollList;
