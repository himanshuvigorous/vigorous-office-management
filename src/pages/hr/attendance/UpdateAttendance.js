import React, { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputClassName, inputLabelClassName } from '../../../constents/global';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { deptSearch } from '../../department/departmentFeatures/_department_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { designationSearch } from '../../designation/designationFeatures/_designation_reducers';
import { attendancegCreate } from './AttendanceFeatures/_attendance_reducers';
import Swal from 'sweetalert2';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { useNavigate } from 'react-router-dom';

const UpdateAttendance = () => {
  const { register, handleSubmit,  control,setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });
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
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const { companyList } = useSelector((state) => state.company);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const onFormSubmit = (data) => {
    const reqData = {
      employeId: data.employee,
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId ,
      attendanceDate: data.date,
      checkInTime: data.checkOutTime ?  new Date(new Date(data.date).setHours(...data.checkInTime.split(':').map(Number), 0, 0)).toISOString(): null,
      checkOutTime:  data.checkOutTime ?  new Date(new Date(data.date).setHours(...data.checkOutTime.split(':').map(Number), 0, 0)).toISOString(): null,
      shift: data.shift,
      workType: data?.workType,
      method: "hr_portal",
      reason: data.reason,
      employeeName: data.employeeName
    };

    dispatch(attendancegCreate(reqData)).then((response) => {
      if(!response.error){
        navigate('/admin/all-employee-attendance')
      }
    });

  };

useEffect(()=>{
if(userInfoglobal?.userType === "admin" ){
  dispatch(companySearch({text: "", sort: true, status: true, isPagination: false}))
}
},[])

useEffect(()=>{
  if( userInfoglobal?.userType !== "admin" || companyId ){
    setValue("PDDepartmentId", "");
    setValue("PDDesignationId", "");
    setValue("PDBranchId", "");
    dispatch(deptSearch({
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      text: "", sort: true, status: true, isPagination: false}))
    dispatch(branchSearch({
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      text: "", sort: true, status: true, isPagination: false}))
  }
},[companyId])

useEffect(()=>{
if(departmentId){
  dispatch(designationSearch({departmentId: departmentId, "text": "", "sort": true, "status": true, "isPagination": false}))
}
},[departmentId])


useEffect(()=>{
if((companyId || userInfoglobal?.userType !== "admin") && (branchId || userInfoglobal?.userType !== "companBranch"  || userInfoglobal?.userType === "employee") && departmentId && designationId){
  fetchEmployeListData()
}
},[companyId , branchId , departmentId , designationId])

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: departmentId,
      designationId: designationId,
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
  };



  return (
 <GlobalLayout>
     <div className="">
     <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="grid grid-col-1 md:grid-cols-2 gap-4">
          {userInfoglobal?.userType === "admin" && (
            <div>
              <label className={`${inputLabelClassName}`}>Company</label>
              <select
                {...register("PDCompanyId", { required: "Company is required" })}
                className={`${inputClassName} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Company</option>
                {companyList?.map((type) => (
                  <option key={type?._id} value={type?._id}>
                    {type?.fullName}
                  </option>
                ))}
              </select>
              {errors.PDCompanyId && <p className="text-red-500 text-sm">{errors.PDCompanyId.message}</p>}
            </div>
          )}
          
          {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
            <div>
              <label className={`${inputLabelClassName}`}>Branch</label>
              <select
                {...register("PDBranchId", { required: "Branch is required" })}
                className={`${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Branch</option>
                {branchList?.map((type) => (
                  <option key={type?._id} value={type?._id}>
                    {type?.fullName}
                  </option>
                ))}
              </select>
              {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
            </div>
          )}

          <div>
            <label className={`${inputLabelClassName}`}>Department<span className="text-red-600">*</span></label>
            <select
              {...register("PDDepartmentId", { required: "Department is required" })}
              className={`${inputClassName} ${errors.PDDepartmentId ? "border-[1px] " : "border-gray-300"}`}
            >
              <option value="">Select Department</option>
              {departmentListData?.map((element) => (
                <option key={element?._id} value={element?._id}>
                  {element?.name}
                </option>
              ))}
            </select>
            {errors.PDDepartmentId && <p className="text-red-500 text-sm">{errors.PDDepartmentId.message}</p>}
          </div>

    

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Designation</label>
              <select
                {...register("PDDesignationId", { required: "Designation is required" })}
                className={`${inputClassName} ${errors.PDDesignationId ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Designation</option>
                {designationList?.map((type) => (
                  <option key={type?._id} value={type?._id}>
                    {type?.name}
                  </option>
                ))}
              </select>
              {errors.PDDesignationId && <p className="text-red-500 text-sm">{errors.PDDesignationId.message}</p>}
            </div>
      

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee</label>
              <select
                {...register("employee")}
                className={`${inputClassName} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select Employee</option>
                {employeList?.map((type) => (
                  <option key={type?._id} value={type?._id}>
                    {type?.fullName}
                  </option>
                ))}
              </select>
              {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
            </div>
            <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Select Shift{" "}
                  </label>
                  <select
                    {...register("shift", {
                      required: "Shift is required",
                    })}
                    className={` ${inputClassName} ${errors.shift
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Shift
                    </option>
                    {['regular', 'night', 'morning']?.map((type) => (
                      <option value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.shift && (
                    <p className="text-red-500 text-sm">
                      {errors.shift.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Select Work Type
                  </label>
                  <select
                    {...register("workType", {
                      required: "Work Type is required",
                    })}
                    className={` ${inputClassName} ${errors.workType
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Work Type
                    </option>
                    {['work_from_office', 'work_from_home', 'hybrid', 'remote']?.map((type) => (
                      <option value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.workType && (
                    <p className="text-red-500 text-sm">
                      {errors.workType.message}
                    </p>
                  )}
                </div>

          <div>
            <label className={`${inputLabelClassName}`}>Date</label>
            <input
              type="date"
              {...register('date', { required: true })}
              className={`${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>Check-in Time</label>
            <input
              type="time"
              {...register('checkInTime', { required: true })}
              className={`${inputClassName} ${errors.checkInTime ? "border-[1px] " : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>Check-out Time</label>
            <input
              type="time"
              {...register('checkOutTime', { required: true })}
              className={`${inputClassName} ${errors.checkOutTime ? "border-[1px] " : "border-gray-300"}`}
            />
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>Reason</label>
            <textarea
              {...register('reason', { required: true })}
              className={`${inputClassName} ${errors.reason ? "border-[1px] " : "border-gray-300"}`}
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
           
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-header rounded-md hover:bg-[#063156]"
            >
              Submit
            </button>
          </div>
        </form>
    </div>
 </GlobalLayout>
  );
};

export default UpdateAttendance;
