import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../../constents/global';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { deptSearch } from '../../department/departmentFeatures/_department_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { attendancegCreate } from './AttendanceFeatures/_attendance_reducers';
import { useNavigate } from 'react-router-dom';
import { Modal, Select, TimePicker } from 'antd';
import Swal from 'sweetalert2';
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker.js";
import dayjs from 'dayjs';
import Loader from '../../../global_layouts/Loader.js';
import { timeSlotSearch } from '../../timeSlot/timeSlotsFeatures/_timeSlots_reducers.js';
import { getOnBoardingDetails } from '../onBoarding/onBoardingFeatures/_onBoarding_reducers.js';

const ManualEmployeeAttendanceModal = ({ isOpen, onClose, fetchattendanceListData }) => {
    const onBoardingId = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?.onboardingId;
  const { loading: attendanceLoading } =
    useSelector((state) => state.attendance);
  const Option = Select.Option;
        const { timeSlotsListData } = useSelector(state => state.timeSlots)
          const { onBoardingDetailsData } = useSelector((state) => state.onBoarding);
  const { register, handleSubmit, control, setValue, reset, watch , formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: '',
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });

useEffect(()=>{
  fetchTimeSlotFunc()
},[])

  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();
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
      employeId: userInfoglobal?.userType === "employee" ? userInfoglobal?._id : data?.employeeId,
      companyId: userInfoglobal?.companyId,
      branchId: userInfoglobal?.branchId,
      directorId: userInfoglobal?.directorId,
      attendanceDate: dayjs(data.checkInTime).format('YYYY-MM-DD'),
     checkInTime: data?.checkInTime ? data?.checkInTime : null,
    checkOutTime: data.checkOutTime ? data?.checkOutTime : null,
      method: "employeReq",
      reason: data.reason,
      employeeName: userInfoglobal?.fullName,
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

        // Call the function to fetch attendance data and close the modal
        fetchattendanceListData();
        onClose();
      }
      //  else {
      //   // If there's an error, show an error alert (optional)
      //   Swal.fire({
      //     icon: 'error',
      //     title: 'Error!',
      //     text: 'There was an issue with the API call. Please try again.',
      //     confirmButtonText: 'OK',
      //     customClass: {
      //       confirmButton: 'bg-[#FF0000] text-white hover:bg-[#d9534f]',
      //     },
      //   });
      // }
    });
  };

const fetchTimeSlotFunc = ()=>{
     dispatch(timeSlotSearch({
          directorId: '',
          companyId:  userInfoglobal?.companyId,
          branchId:   userInfoglobal?.branchId,
          text: "",
          sort: true,
          status: "",
          isPagination: false,
        })).then((data)=>{
          if(!data?.error){
            dispatch(getOnBoardingDetails({_id: onBoardingId})).then(response=>{
              if(!response?.error){
                setValue("employeeName", response?.payload?.data?.employeeName);
              }
            })
          }
        })
        setValue("shift", onBoardingDetailsData?.shift)
  }
  if (!isOpen) return null;
  return (

    <Modal
      visible={isOpen}
      onCancel={() => {
        onClose();
        reset()
      }}
      footer={null}
       className="antmodalclassName"
      title="Manual Attendence"
      width={600}
      height={400}
    >
      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">

            {/* <div>
              <label className={`${inputLabelClassName}`}>Date < span className="text-red-600" >* </span></label>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Date is required" }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    const today = moment();
                    return current && (
                      current.isAfter(today, 'day') ||
                      !current.isSame(today, 'month')
                    );
                  }} />
                )}
              />
              {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
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
                  <CustomDatePicker
                    field={field}
                    showTime={true}
                    format="DD/MM/YYYY HH:mm"
                    errors={errors}
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
                  <CustomDatePicker
                  field={field}
                  showTime={true}
                  format="DD/MM/YYYY HH:mm"
                  errors={errors}
                  disabledDate={(current) => {
                    const selectedDate = watch('checkInTime'); // should be a dayjs object or parse it
                    if (!selectedDate) return true; // Disable all if no date selected
                
                    const selected = dayjs(selectedDate).startOf('day');
                    const oneExyytaDay = selected.add(1, 'day');
                
                    return (
                      !current.isSame(selected, 'day') &&
                      !current.isSame(oneExyytaDay, 'day')
                    );
                  }}
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
                                      getPopupContainer={() => document.body}
                                      dropdownStyle={{ zIndex: 2000 }}
                                      filterOption={(input, option) =>
                                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                                      }
            
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
              {errors.reason && <p className="text-red-500 text-sm">Reason is required</p>}
            </div>
            {/* <div>
              <label className={`${inputLabelClassName}`}>Day Status</label>
              <select
                {...register("status", { required: "Day Status is required" })}
                className={`${inputClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select DayStatus</option>
                {["firstHalf" , "secondHalf" , "fullDay" , "present" , "leave" , "absent"].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div> */}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              disabled={attendanceLoading}
              className={`${attendanceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {attendanceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
    //   </div>
    // </div>

  );
};

export default ManualEmployeeAttendanceModal;
