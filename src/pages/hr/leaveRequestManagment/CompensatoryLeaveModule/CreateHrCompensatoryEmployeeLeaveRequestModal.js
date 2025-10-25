import React, { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../../../constents/global';
import Swal from 'sweetalert2';
import { createCompensatoryLeaveRequest } from './CompensatoryLeaveFeature/_compensatory_request_reducers';
import { companySearch } from '../../../company/companyManagement/companyFeatures/_company_reducers';
import { employeSearch } from '../../../employeManagement/employeFeatures/_employe_reducers';
import { branchSearch } from '../../../branch/branchManagement/branchFeatures/_branch_reducers';
import ReactSelect from "react-select";
import CustomDatePicker from '../../../../global_layouts/DatePicker/CustomDatePicker';
const CreateHrCompensatoryEmployeeLeaveRequestModal = ({ isOpen, onClose, fetchattendanceListData }) => {
  const { branchList } = useSelector((state) => state.branch);
  const { companyList } = useSelector((state) => state.company);
  const { employeList } = useSelector((state) => state.employe);
  const { register, handleSubmit,setValue,control, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });

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

  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();

  const onFormSubmit = (data) => {
    const reqData = {
      employeId: data?.employee?.value,
      companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      "compensatoryDate": data?.fromDate,     
      "reason": data?.leaveReason,
    };

    dispatch(createCompensatoryLeaveRequest(reqData)).then((response) => {
      if (!response.error) {
    
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Leave Request sent successfully.',
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
    if ((companyId || userInfoglobal?.userType !== "admin") && (branchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee")) {
      fetchEmployeListData()
    }
  }, [companyId, branchId, ])

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


  if (!isOpen) return null;
  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]" onClick={onClose} >
      <div className="animate-slideInFromTop bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl max-h-[60vh] 
 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div>
          <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
        
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

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee</label>
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
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
              </div>

              <div className="grid grid-col-1 md:grid-cols-1 gap-4">
                <div>
                  <label className={`${inputLabelClassName}`}>Date</label>
                  <Controller
                    name="fromDate"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors}  disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} /> 
                    )}
                  />
                  {errors.fromDate && <p className="text-red-500 text-sm">fromDate is required</p>}
                </div>
              </div>
         
        
            <div className='grid grid-col-1 md:grid-cols-1 gap-4'>
              <div className="">
                <label className={`${inputLabelClassName}`}> Reason</label>
                <input
                  type="text"
                  {...register("leaveReason", {
                    required: " Reason is required",
                  })}
                  className={` ${inputClassName} ${errors.leaveReason ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter  Reason"
                />
                {errors.leaveReason && (
                  <p className="text-red-500 text-sm">
                    {errors.leaveReason.message}
                  </p>
                )}
              </div>
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
      </div>
    </div>

  );
};

export default CreateHrCompensatoryEmployeeLeaveRequestModal;
