import React from 'react';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { domainName, inputClassName, inputLabelClassName } from '../../../../constents/global';
import Swal from 'sweetalert2';
import { createCompensatoryLeaveRequest } from './CompensatoryLeaveFeature/_compensatory_request_reducers';

const CreateCompensatoryEmployeeLeaveRequestModal = ({ isOpen, onClose, fetchattendanceListData }) => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });



  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();

  const onFormSubmit = (data) => {
    const reqData = {
      employeId: userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      companyId: userInfoglobal?.companyId,
      branchId:  userInfoglobal?.branchId,
      directorId: userInfoglobal?.directorId,
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



  if (!isOpen) return null;
  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]" onClick={onClose} >
      <div className="animate-slideInFromTop bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl max-h-[60vh] 
 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div>
          <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
        
  

              <div className="grid grid-col-1 md:grid-cols-1 gap-4">
                <div>
                  <label className={`${inputLabelClassName}`}>Date</label>
                  <input
                    type="date"
                    max={moment().format('YYYY-MM-DD')}

                    {...register('fromDate', { required: true })}
                    className={`${inputClassName} ${errors.fromDate ? "border-[1px] " : "border-gray-300"}`}
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

export default CreateCompensatoryEmployeeLeaveRequestModal;
