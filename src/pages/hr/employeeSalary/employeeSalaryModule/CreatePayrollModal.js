import React, { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../../../constents/global';
import { companySearch } from '../../../company/companyManagement/companyFeatures/_company_reducers';
import { branchSearch } from '../../../branch/branchManagement/branchFeatures/_branch_reducers';
import ReactSelect from "react-select";

import { leaveTypeSearch } from '../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers';
import { allowanceListSearch, getAllowanceList } from '../Allowance/allowancefeature/_allowanceList_reducers';
import { deductionsListSearch, getdeductionsList } from '../Deductions/deductionsfeature/_deductionsList_reducers';
import { encrypt } from '../../../../config/Encryption';
import CustomDatePicker from '../../../../global_layouts/DatePicker/CustomDatePicker';
import { createPayroll } from '../employeePayrollModule/employeePayRollFeatures/_payroll_reducers';

const CreatePayrollModal = ({ isOpen, onClose,element, fetchEmployeListData }) => {

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });

  const dispatch = useDispatch();

  const { allowanceListData } = useSelector((state) => state.allowance);
  const { deductionsListData } = useSelector((state) => state.deductions);


  const onFormSubmit = (data) => {

    const reqData = {
      employeId: element?.employeId,
      companyId: element?.companyId,
      branchId: element?.branchId,
      directorId: "",
      startDate: data?.startDate,
      endDate: data?.endDate,
      allowanceId: data?.allowance?.map((allowance) => allowance.value),
      deductionId: data?.deductions?.map((deductions) => deductions.value),
    };
    dispatch(createPayroll(reqData)).then((response) => {
      if (!response.error) {
       
        fetchEmployeListData();
        onClose();
      }
    });
  };



  useEffect(() => {
    getchAllowanceData();
  }, []);

  const getchAllowanceData = () => {

    dispatch(allowanceListSearch({
      "text": "",
      "sort": true,
      "status": true,
      "isPagination": false,
      directorId: "",
      companyId: element?.companyId,
      branchId: element?.branchId,
    }));
  };


  useEffect(() => {
    getDeductionsData();
  }, []);

  const getDeductionsData = () => {

        
      

    dispatch(deductionsListSearch({
      text: "",
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId: element?.companyId,
        branchId: element?.branchId,
    }));
  };



  if (!isOpen) return null;
  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]" onClick={onClose} >
      <div className="bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div>
          <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">


            <div className='my-2'>

              <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`${inputLabelClassName}`}>Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                   
                    render={({ field }) => (
                      <CustomDatePicker  field={field} errors={errors}  disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} /> 
                    )}
                  />
                  {errors.startDate && <p className="text-red-500 text-sm">StartDate is required</p>}
                </div>

                <div>
                  <label className={`${inputLabelClassName}`}>End Date</label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker  field={field} errors={errors}  disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} /> 
                    )}
                  />
                  {errors.endDate && <p className="text-red-500 text-sm">EndDate is required</p>}
                </div>

              </div>
            </div>

            <div className="grid grid-col-1 md:grid-cols-2 gap-4">


              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Allowances
                </label>
                <Controller
                  name="allowance"
                  control={control}
           
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isMulti
                      options={allowanceListData?.map((allowance) => ({
                        value: allowance?._id,
                        label: allowance?.name,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.allowance ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Allowances"
                      onChange={(selectedOptions) => field.onChange(selectedOptions)}
                      value={field.value}
                    />
                  )}
                />
                {errors.allowance && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.allowance.message}
                  </p>
                )}
              </div>


              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Deductions 
                </label>
                <Controller
                  name="deductions"
                  control={control}

                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isMulti
                      options={deductionsListData?.map((deductions) => ({
                        value: deductions._id,
                        label: deductions.name,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.deductions ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Deductions"
                      onChange={(selectedOptions) => field.onChange(selectedOptions)}
                      value={field.value}
                    />
                  )}
                />
                {errors.deductions && <p className="text-red-500 text-sm">{errors.deductions.message}</p>}
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

export default CreatePayrollModal;
