import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../../../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputCalanderClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../../../constents/global';
import { companySearch } from '../../../company/companyManagement/companyFeatures/_company_reducers';
import { deptSearch } from '../../../department/departmentFeatures/_department_reducers';
import { branchSearch } from '../../../branch/branchManagement/branchFeatures/_branch_reducers';
import ReactSelect from "react-select";
import Swal from 'sweetalert2';
import { createPayroll, getLeaveDashboard, getPayrollEmployeeList, getPayrollList } from './employeePayRollFeatures/_payroll_reducers';
import { leaveTypeSearch } from '../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers';
import { FaRegFile, FaTimes } from 'react-icons/fa';
import { fileUploadFunc } from '../../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers';
import { getAllowanceList } from '../Allowance/allowancefeature/_allowanceList_reducers';
import { getdeductionsList } from '../Deductions/deductionsfeature/_deductionsList_reducers';
import { encrypt } from '../../../../config/Encryption';
import CustomDatePicker from '../../../../global_layouts/DatePicker/CustomDatePicker';
import { Modal, Select } from 'antd';
import ListLoader from '../../../../global_layouts/ListLoader';
import { DatePicker } from 'antd';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Loader from '../../../../global_layouts/Loader';

dayjs.extend(utc);

const CreatePayrollModal = ({ isOpen, onClose, fetchattendanceListData }) => {

  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
      month: null,
      startDate: null,
      endDate: null,
    }
  });
 const { loading, payrollEmployeeList } = useSelector(
    (state) => state.payrollReducer
  );
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();
  const { loading: payrolLoading } = useSelector((state) => state.payrollReducer);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { employeList, employeeListLoading } = useSelector((state) => state.employe);
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const monthdate = useWatch({
    control,
    name: "month",
    defaultValue: "",
  });


  const onFormSubmit = (data) => {
    const reqData = {
      employeId: data?.employee,
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      directorId: "",
      startDate: data?.startDate,
      endDate: data?.endDate,
      allowanceId: [],
      deductionId: [],
      penalties: []
    };
    dispatch(createPayroll(reqData)).then((response) => {
      if (!response.error) {

        fetchattendanceListData();
        onClose();
      }
    });
  };

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(companySearch({ text: "", sort: true, status: true, isPagination: false }))
    }
  }, [])

  useEffect(() => {
    if ((userInfoglobal?.userType === "admin" && companyId) || (userInfoglobal?.userType === "company" && userInfoglobal?._id) || userInfoglobal?.userType === "companyDirector") {
      setValue("PDDepartmentId", "");
      setValue("PDDesignationId", "");
      setValue("PDBranchId", "");

      dispatch(branchSearch({
        companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        text: "", sort: true, status: true, isPagination: false
      }))
    }
  }, [companyId])

  useEffect(() => {
    if ((companyId || userInfoglobal?.userType !== "admin") && (branchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee") && monthdate) {
      fetchEmployeListData()
      getPayrollFunc()
    }
  }, [companyId, branchId,monthdate])


  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: '',
      designationId: '',
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
  };
  const getPayrollFunc = () => {
    const selectedDate = monthdate || dayjs(); // Use current date if no date selected
    const year = selectedDate.year();
    const month = selectedDate.month() + 1; // Months are 0-indexed in dayjs
    const data = {
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      text: '',
      sort: true,
      year: year, // Add year to payload
      month: month.toString().padStart(2, '0'), // Add month to payload (with leading zero)
      status: '',
      isPagination: false,
      directorId: "",
      employeId: "",
    }

    dispatch(getPayrollEmployeeList(data));
  };
  if (!isOpen) return null;

  const handleMonthChange = (date, field, setValue) => {
    if (date && dayjs(date).isValid()) {
      const startDate = dayjs(date).startOf("month").format("YYYY-MM-DD");
      const endDate = dayjs(date).endOf("month").format("YYYY-MM-DD");
      setValue("startDate", startDate, { shouldValidate: true });
      setValue("endDate", endDate, { shouldValidate: true });
      field.onChange(date);
    } else {
      setValue("startDate", null);
      setValue("endDate", null);
      field.onChange(null);
    }
  };



  const restemployeList = employeList?.filter((emp) => {
    const isPayrollExists = payrollEmployeeList?.some((payroll) => payroll?.employeData?._id === emp?._id);
    return !isPayrollExists;
  }) || [];



  return (

    // <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]" onClick={onClose} >
    //   <div className="bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl" onClick={(e) => e.stopPropagation()}>
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      centered
      className="antmodalclassName"
      width={800}
      zIndex={1050}
    // height={800}
    // destroyOnClose
    >
      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            {userInfoglobal?.userType === "admin" && (
              <div>
                <label className={`${inputLabelClassName}`}>Company <span className="text-red-600">*</span></label>
                <Controller
                  name="PDCompanyId"
                  control={control}
                  rules={{
                    required: "Company is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      placeholder="Select Company"
                      showSearch

                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        companyList
                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                          ))
                      }
                    </Select>
                  )}
                />
                {errors.PDCompanyId && <p className="text-red-500 text-sm">{errors.PDCompanyId.message}</p>}
              </div>
            )}

            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
              <div>
                <label className={`${inputLabelClassName}`}>Branch <span className="text-red-600"> *</span></label>
                {/* <select
                    {...register("PDBranchId", { required: "Branch is required" })}
                    className={`${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                  >
                    <option value="">Select Branch</option>
                    {branchList?.map((type) => (
                      <option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </option>
                    ))}
                  </select> */}
                <Controller
                  name="PDBranchId"
                  control={control}
                  rules={{
                    required: "Branch is required",
                  }}

                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(value) => {
                        setValue("employee", '')
                        field.onChange(value);
                      }}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      getPopupContainer={() => document.body}
                      dropdownStyle={{ zIndex: 2000 }}
                      placeholder="Select Branch"
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (branchList
                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                          )))
                      }
                    </Select>
                  )}
                />
                {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
              </div>
            )}

 


            <div className=''>
              <label className={inputLabelClassName}>
                Select Month <span className="text-red-600">*</span>
              </label>

              <Controller
                name="month"
                control={control}
                rules={{ required: "Month is required" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    size={'large'}
                    picker="month"
                    format="MMMM YYYY"
                    placeholder="Select Month"
                    className={`${inputCalanderClassName}`}
                    getPopupContainer={(triggerNode) => document.body}
                    popupStyle={{ zIndex: 1600 }}
                    disabledDate={(current) => {
                      if (!current) return false;
                      const selectedMonth = current.clone().startOf("month").valueOf();
                      const nowMonth = dayjs().startOf("month").valueOf();
                      return selectedMonth >= nowMonth;
                    }}
                    onChange={(date) => handleMonthChange(date, field, setValue)}
                    value={field.value ? dayjs(field.value) : null}
                  />
                )}
              />

              {errors.month && (
                <p className="text-red-500 text-sm">{errors.month.message}</p>
              )}
            </div>
                       <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee <span className="text-red-600"> *</span></label>

              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.employee ? "border-[1px]" : "border-gray-300"}`}
                    getPopupContainer={() => document.body}
                    dropdownStyle={{ zIndex: 2000 }}
                    placeholder="Select Employee"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }                     >
                    <Select.Option value="">Select Employee</Select.Option>
                    {employeeListLoading ? (
                      <Select.Option disabled><ListLoader /></Select.Option>
                    ) : (
                      restemployeList?.map((item) => (
                        <Select.Option key={item?._id} value={item?._id}>
                          {item?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />


              {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
            </div>
          </div>

          <div className='my-2'>

            <div className="grid grid-col-1 md:grid-cols-2 gap-4">




              {/* <div>
                  <label className={`${inputLabelClassName}`}>Start Date  <span className="text-red-600"> *</span></label>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{
                      required: 'Start date is required'
                    }}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} />
                    )}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm">StartDate is required</p>}
                </div>

                <div>
                  <label className={`${inputLabelClassName}`}>End Date  <span className="text-red-600"> *</span></label>
                  <Controller
                    name="endDate"
                    control={control}
                    rules={{
                      required: 'End Date is required'
                    }}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} />
                    )}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm">EndDate is required</p>}
                </div> */}

            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              disabled={payrolLoading}

              className={` ${payrolLoading ? 'bg-gray-400' : 'bg-header'} px-4 py-2 text-sm font-medium text-white bg-header rounded-md hover:bg-[#063156]`}
            >
              {payrolLoading ? <Loader /> : 'Submit'}


            </button>
          </div>
        </form>
      </div>
    </Modal>
    //   </div>
    // </div>

  );
};

export default CreatePayrollModal;
