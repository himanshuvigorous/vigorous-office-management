import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { employeSearch } from '../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from '../../constents/global';
import { statusApplication, getApplicationList } from '../applicationManagement/applicationFeatures/_application_reducers';

import Swal from 'sweetalert2';
import { Select } from 'antd';
import Loader from '../../global_layouts/Loader';

const InterviewStatusModal = ({ isOpen, onClose, fetchStatusData, applicationId, statusId }) => {
  const { loading:statusLoading, } = useSelector((state) => state.application);
  const { register,control, handleSubmit, formState: { errors } } = useForm({
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



  const onFormSubmit = (data) => {
    const finalPayload = {
      _id: statusId?._id,
      status: data?.status,
    };

    dispatch(statusApplication(finalPayload)).then((response) => {
      if (!response.error) {
        Swal.fire({
          title: "Success!",
          text: "Status updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          getApplicationList();
          fetchStatusData();
          onClose();
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to update status.",
          icon: "error",
          confirmButtonText: "OK",
        }).then(() => {
          fetchStatusData();

        });

      }
    });
  };

  // useEffect(() => {
  //   fetchEmployeListData()
  // }, [])

  // const fetchEmployeListData = () => {
  //   const reqPayload = {
  //     text: "",
  //     status: true,
  //     sort: true,
  //     isTL: "",
  //     isHR: "",
  //     isPagination: true,
  //     departmentId: '',
  //     designationId: '',
  //     companyId: applicationId?.companyId,
  //     branchId: applicationId?.branchId,
  //   };

  //   dispatch(employeSearch(reqPayload));
  // };

  if (!isOpen) return null;


  return (

    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1560]" onClick={onClose} >
      <div className="animate-slideInFromTop bg-gray-100 rounded-lg p-6 w-full md:mx-auto !mx-2 max-w-sm md:max-w-md " onClick={(e) => e.stopPropagation()}>
        <div>
          <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
            <div className="grid grid-cols-1 gap-4 text-black">
              <div>
                <label className={`${inputLabelClassName}`}>
                  Status <span className="text-red-600">*</span>
                </label>
                <Controller
                      name="status"
                      control={control}
                      rules={{
                        required: "status is required",
                      }}
                      render={({ field }) => (
                        <Select
                        popupClassName={'!z-[1580]'}
                        placeholder="Select Status"
                  {...field}
                  className={` ${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Hold">Hold</Select.Option>
                  <Select.Option value="Shortlisted">Shortlisted</Select.Option>
                  <Select.Option value="Rejected">Rejected</Select.Option>
                </Select>
                      )}
                    />
                
                {errors.status && (
                  <p className="text-red-500 text-sm">{errors.status.message}</p>
                )}
              </div>

            </div>
            <div className="flex justify-end space-x-2 mt-4">
            <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={statusLoading}
              className={`${statusLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {statusLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default InterviewStatusModal;