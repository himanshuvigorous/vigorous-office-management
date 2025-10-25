import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from '../../../constents/global';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { deptSearch } from '../../department/departmentFeatures/_department_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { attendancegCreate } from './AttendanceFeatures/_attendance_reducers';
import { useNavigate } from 'react-router-dom';
import ReactSelect from "react-select";
import Swal from 'sweetalert2';
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker.js";
import dayjs from 'dayjs';
import { Modal, Select, TimePicker } from 'antd';
import Loader from '../../../global_layouts/Loader.js';
import ListLoader from '../../../global_layouts/ListLoader.js';
import { timeSlotSearch } from '../../timeSlot/timeSlotsFeatures/_timeSlots_reducers.js';
const ManualAttendanceModal = ({ isOpen, onClose, fetchattendanceListData }) => {
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: '',
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });
  const Option = Select.Option;
  const { timeSlotsListData } = useSelector(state => state.timeSlots)
  const navigate = useNavigate();
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

  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });
  const designationId = useWatch({
    control,
    name: "PDDesignationId",
    defaultValue: "",
  });
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { loading: atentdanceLoading } = useSelector((state) => state.attendance);
  const { employeList } = useSelector((state) => state.employe);

const parseToISOString = (date, timeStr) => {
  if (!timeStr) return null;
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  const trimmedTime = timeStr.trim();
  const hasAMPM = /AM|PM/i.test(trimmedTime);
  const format = hasAMPM ? 'YYYY-MM-DD HH:mm A' : 'YYYY-MM-DD HH:mm';
  const dateTimeString = `${formattedDate} ${trimmedTime}`;

  const parsed = moment(dateTimeString, format, true); // strict parsing
  if (!parsed.isValid()) {
    return null;
  }
  return parsed.toISOString();
};
  const onFormSubmit = (data) => {


    const reqData = {
      employeId: data?.employee,
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      attendanceDate: dayjs(data.date).format('YYYY-MM-DD'),
      // checkInTime: new Date(new Date(data.date).setHours(...data.checkInTime.split(':').map(Number), 0, 0)).toISOString(),
      // checkOutTime: data.checkOutTime ? new Date(new Date(data.date).setHours(...data.checkOutTime.split(':').map(Number), 0, 0)).toISOString() : null,
     checkInTime: parseToISOString(data.date, data.checkInTime),
    checkOutTime: data.checkOutTime ? parseToISOString(data.date, data.checkOutTime) : null,
      method: "hr_portal",
      reason: data.reason,
      employeeName: data.employeeName,
      isVerified: true,
      shift: data.shift,
    };

    dispatch(attendancegCreate(reqData)).then((response) => {
      if (!response.error) {

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Attendance record has been created successfully.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-header text-white hover:bg-[#063156]',
          },
        });
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
    if (userInfoglobal?.userType !== "admin" || companyId) {
      setValue("PDDepartmentId", "");
      setValue("PDDesignationId", "");
      setValue("PDBranchId", "");
      dispatch(deptSearch({
        companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        text: "", sort: true, status: true, isPagination: false
      }))
      dispatch(branchSearch({

        companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        text: "", sort: true, status: true, isPagination: false
      }))
    }
  }, [companyId])



  useEffect(() => {
    if ((companyId || userInfoglobal?.userType !== "admin") && (branchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee")) {
      fetchEmployeListData()

    }
  }, [companyId, branchId, departmentId, designationId])
  useEffect(() => {
    fetchTimeSlotFunc()
  }, [branchId,])

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
  const fetchTimeSlotFunc = () => {
    dispatch(timeSlotSearch({
      directorId: '',
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
    }))
  }
  if (!isOpen) return null;
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        onClose();
        reset()
      }}

      className="antmodalclassName"
      footer={null}
      title="Apply Attendence"
      width={600}
      height={400}
    >
      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            {userInfoglobal?.userType === "admin" && (
              <div>
                <label className={`${inputLabelClassName}`}>Company</label>
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

                      placeholder="Select Company"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (companyList
                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                          )))
                      }
                    </Select>
                  )}
                />
                {errors.PDCompanyId && <p className="text-red-500 text-sm">{errors.PDCompanyId.message}</p>}
              </div>
            )}

            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
              <div>
                <label className={`${inputLabelClassName}`}>Branch < span className="text-red-600" >* </span></label>
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
                        setValue("shift", '')
                        field.onChange(value);
                      }}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"} `}
                      dropdownStyle={{ zIndex: 2000 }}
                      placeholder="Select Branch"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      getPopupContainer={() => document.body}
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (sortByPropertyAlphabetically(branchList, 'fullName')
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

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee < span className="text-red-600" >* </span></label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(value) => {
                      const selectedEmployee = employeList.find(emp => emp._id === value);
                      setValue('employee', value);
                      setValue("shift", selectedEmployee?.shiftTimeSlot?._id || '');
                    }}

                    dropdownStyle={{ zIndex: 2000 }}
                    getPopupContainer={() => document.body}
                    // options={sortByPropertyAlphabetically(employeList,'fullName')?.map((employee) => ({
                    //   value: employee?._id,
                    //   label: employee?.fullName,
                    // }))}
                    classNamePrefix="react-select"
                    className={`${inputAntdSelectClassName} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Employee"
                  >
                    <Select.Option value="">Select Employee</Select.Option>
                    {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                      (sortByPropertyAlphabetically(employeList, 'fullName')
                        ?.map((element) => (
                          <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                        )))
                    }
                  </Select>
                )}
              />
              {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>Date < span className="text-red-600" >* </span></label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors}
                    disabledDate={(current) => {
                      const today = moment();
                      return current && (
                        current.isAfter(today, 'day') ||
                        !current.isSame(today, 'month')
                      );
                    }}
                  />
                )}
              />
              {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
            </div>

            {/* <div>
              <label className={`${inputLabelClassName}`}>Check-in Time < span className="text-red-600" >* </span></label>
              <input
                type="time"
                {...register('checkInTime', { required: true })}
                className={`${inputClassName} ${errors.checkInTime ? "border-[1px] " : "border-gray-300"}`}
              />
              {errors.checkInTime && <p className="text-red-500 text-sm">Check-in time is required</p>}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>Check-out Time < span className="text-red-600" >* </span></label>
              <input
                type="time"
                {...register('checkOutTime', { required: true })}
                className={`${inputClassName} ${errors.checkOutTime ? "border-[1px] " : "border-gray-300"}`}
              />
              {errors.checkOutTime && <p className="text-red-500 text-sm">Check-out time is required</p>}
            </div> */}
            <div>
              <label className={`${inputLabelClassName}`}>
                Check-in Time <span className="text-red-600">*</span>
              </label>
              <Controller
                name="checkInTime"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    format="HH:mm A"
                    getPopupContainer={(triggerNode) => document.body}
                    popupStyle={{ zIndex: 1600 }}
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(time, timeString) => field.onChange(timeString)}
                    className={`${inputClassName} w-full ${errors.checkInTime ? 'border-[1px]' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors.checkInTime && (
                <p className="text-red-500 text-sm">Check-in time is required</p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>
                Check-out Time <span className="text-red-600">*</span>
              </label>
              <Controller
                name="checkOutTime"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    format="HH:mm A"
                    getPopupContainer={(triggerNode) => document.body}
                    popupStyle={{ zIndex: 1600 }}
                    value={field.value ? dayjs(field.value, 'HH:mm') : null}
                    onChange={(time, timeString) => field.onChange(timeString)}
                    className={`${inputClassName} w-full ${errors.checkOutTime ? 'border-[1px]' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors.checkOutTime && (
                <p className="text-red-500 text-sm">Check-out time is required</p>
              )}
            </div>
            <div className="">
              {/* Select Shift */}
              <label className={`${inputLabelClassName}`}>
                Select Shift <span className="text-red-600">*</span>
              </label>
              <Controller
                name="shift"
                control={control}
                rules={{ required: "Shift is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.shift ? '' : 'border-gray-300'}`}
                    placeholder="Select Shift"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={() => document.body}
                    dropdownStyle={{ zIndex: 2000 }}

                  >
                    <Option value="">Select Shift</Option>
                    {timeSlotsListData?.map((type) =>
                      <Option key={type?._id} value={type?._id}>
                        {type?.shiftName}
                      </Option>
                    )}
                  </Select>
                )}
              />

              {errors.shift && (
                <p className="text-red-500 text-sm">
                  {errors.shift.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Reason < span className="text-red-600" >* </span></label>
              <input
                type="text"
                {...register('reason', { required: true })}
                className={`${inputClassName} ${errors.reason ? "border-[1px] " : "border-gray-300"}`}
                rows="3"
              />
              {errors.reason && <p className="text-red-500 text-sm">Reason is required </p>}
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              disabled={atentdanceLoading}
              className={`px-4 py-2 text-sm font-medium text-white ${atentdanceLoading ? "bg-gray-400" : 'bg-header hover:bg-[#063156]'} rounded-md `}
            >
              {atentdanceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Modal>


  );
};

export default ManualAttendanceModal;
