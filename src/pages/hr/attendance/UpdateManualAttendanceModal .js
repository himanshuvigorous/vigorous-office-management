import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../../constents/global';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { deptSearch } from '../../department/departmentFeatures/_department_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { attendancegCreate, getattendancegDetails, updateattendanceg } from './AttendanceFeatures/_attendance_reducers';
import { useNavigate } from 'react-router-dom';
import ReactSelect from "react-select";
import Swal from 'sweetalert2';
import CustomDatePicker from '../../../global_layouts/DatePicker/CustomDatePicker';
import dayjs from 'dayjs';
import { Modal, Select, TimePicker } from 'antd';
import Loader from '../../../global_layouts/Loader';
import ListLoader from '../../../global_layouts/ListLoader';

const UpdateManualAttendanceModal = ({ isOpen, onClose, fetchattendanceListData, updateId }) => {



  const { register, handleSubmit,watch , control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: '',
      checkInTime: '',
      checkOutTime: null,
      reason: '',
      errors: {},
    }
  });
  const { loading: atentdanceLoading } = useSelector(
    (state) => state.attendance
  );
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
  const { branchList, branchListLoading } = useSelector(
    (state) => state.branch
  );
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const { attendancegDetailsData } = useSelector(
    (state) => state.attendance
  );

  useEffect(() => {
    if (attendancegDetailsData) {


      setValue('companyId', attendancegDetailsData?.companyId)
      setValue('PDBranchId', attendancegDetailsData?.branchId)
      setValue('directorId', attendancegDetailsData?.directorId)
      setValue('date', dayjs(attendancegDetailsData?.attendanceDate))
      setValue('checkInTime',attendancegDetailsData?.checkInTime ?  dayjs(attendancegDetailsData?.checkInTime) : null)
      setValue('checkOutTime', attendancegDetailsData?.checkOutTime ? dayjs(attendancegDetailsData?.checkOutTime) : null)
      const selectedEmployee = employeList?.find(employee => employee._id === attendancegDetailsData?.employeId);
      if (selectedEmployee) {
        setValue('employee', {
          value: selectedEmployee._id,
          label: selectedEmployee.fullName,
        });
      }
    }
  }, [attendancegDetailsData])

  const onFormSubmit = (data) => {
    const reqData = {
      _id: updateId,
      employeId: attendancegDetailsData?.employeId,
      companyId: attendancegDetailsData?.companyId,
      branchId: attendancegDetailsData?.branchId,
      directorId: attendancegDetailsData?.directorId,
      attendanceDate: dayjs(data.checkInTime).format('YYYY-MM-DD'),
     checkInTime: data?.checkInTime ? data?.checkInTime : null,
    checkOutTime: data.checkOutTime ? data?.checkOutTime : null,
      method: "hr_portal",
      reason: data?.reason,
      employeeName: data?.employeeName
    };

    dispatch(updateattendanceg(reqData)).then((response) => {
      if (!response.error) {
        // Show success alert using SweetAlert2
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
      // else {

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
    dispatch(employeSearch(reqPayload)).then((response) => {
      !response.error && dispatch(getattendancegDetails({ _id: updateId }))
    });
  };
  if (!isOpen) return null;
  return (
      <Modal
          visible={isOpen}
          onCancel={() => {
            onClose();
            
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
              {userInfoglobal?.userType === "admin" && (
                <div>
                  <label className={`${inputLabelClassName}`}>Company < span className="text-red-600" >* </span></label>
                  {/* <select
                {...register("PDCompanyId", { required: "Company is required" })}
                className={`${inputClassName} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Company</option>
                {companyList?.map((type) => (
                  <option key={type?._id} value={type?._id}>
                    {type?.fullName}
                  </option>
                ))}
              </select> */}
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
                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"} z-[99999]`}

                        placeholder="Select Branch"
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
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

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee < span className="text-red-600" >* </span></label>
                <Controller
                  name="employee"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={employeList?.map((employee) => ({
                        value: employee?._id,
                        label: employee?.fullName,
                      }))}
                      isDisabled={true}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
              </div>

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
                                        const currentDate = today.date(); // Day of month: 1, 2, 3, ...
                                        const isFirstThreeDays = currentDate <= 3;
                                      
                                        const startOfPrevMonth = today.clone().subtract(1, 'month').startOf('month');
                                        const endOfPrevMonth = today.clone().subtract(1, 'month').endOf('month');
                                      
                                        const isFromPrevMonth = current.isSame(startOfPrevMonth, 'month');
                                        const isFromCurrentMonth = current.isSame(today, 'month');
                                        const isAfterToday = current.isAfter(today, 'day');
                                      
                                      
                                        if (isFirstThreeDays) {
                                          return (
                                            isAfterToday ||
                                            (!isFromPrevMonth && !isFromCurrentMonth)
                                          );
                                        }
                                      
                                       
                                        return (
                                          isAfterToday ||
                                          !isFromCurrentMonth
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

export default UpdateManualAttendanceModal;
