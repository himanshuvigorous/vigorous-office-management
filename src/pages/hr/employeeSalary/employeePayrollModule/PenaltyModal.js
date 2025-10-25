import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import {
  formButtonClassName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
} from "../../../../constents/global";
import { getAllowanceList } from "../Allowance/allowancefeature/_allowanceList_reducers";
import { updatePayrollData } from "./employeePayRollFeatures/_payroll_reducers";
import { Select, Modal, Button } from "antd";
import { employeePenaltyTypeSearch } from "../../../EmployeePenaltie/employeePenaltyFeatures/_employeePenalty_reducers";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const PenaltyModal = ({ closePenaltyModal, isPenaltyOpen, getPayrollDetailsFunc }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
    watch ,
  } = useForm();
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { employeePenaltyListData, loading } = useSelector(
    (state) => state.employeePenalty
  );

  useEffect(() => {
    getchPenaltyData();
  }, []);

  const {
    fields: penaltyDetails,
    append: appendPenalty,
    remove: removePenalty,
  } = useFieldArray({
    control,
    name: "penaltyDetails",
  });

  const getchPenaltyData = () => {
    let reqData = {
        text: "",
        sort: true,
        status: "Pending",
        isPagination: false,
        directorId: "",
        companyId: isPenaltyOpen?.data?.data?.companyId,
        branchId: isPenaltyOpen?.data?.data?.branchId,
        employeId: isPenaltyOpen?.data?.data?.employeId,
    };
    dispatch(employeePenaltyTypeSearch(reqData)).then((data) => {
      if (!data?.error) {
    reset();

       
    
      }
    });
  };



  const handleCreate = (data) => {
    const payrolldata = isPenaltyOpen?.data?.data;
    const penaltyMap = isPenaltyOpen?.data?.data?.panalty?.map((penalty) => penalty?.penaltyId);
    const newPenlatyMap = data?.penaltyDetails?.map((item) => item?.penalty);
  
    // Show the SweetAlert with a custom z-index before proceeding
    Swal.fire({
      title: 'Are you sure?',
      text: "After submitting, you cannot change Penalties!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, submit it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'swal-popup'  // Apply custom class to the popup
      },
      zIndex: 2000 // Custom z-index value
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with submitting the data if confirmed
        dispatch(
          updatePayrollData({
            _id: payrolldata?._id,
            companyId: payrolldata?.companyId,
            branchId: payrolldata?.branchId,
            employeId: payrolldata?.employeId,
            startDate: payrolldata?.startDate,
            endDate: payrolldata?.endDate,
            allowances: payrolldata?.allowances,
            deductions: payrolldata?.deductions,
            penalties: [...penaltyMap, ...newPenlatyMap]
          })
        ).then((res) => {
          if (!res.error) {
            getPayrollDetailsFunc();
            closePenaltyModal();
          }
        });
      }
    });
  };
  
  const { Option } = Select;

  return (
    <Modal
      visible={isPenaltyOpen}
      onCancel={closePenaltyModal}
      footer={null}
      title="Add Penalty"
      width={600}
       className="antmodalclassName"
      height={600} >
      <form autoComplete="off" onSubmit={handleSubmit(handleCreate)}>
        <div>
          <div className="rounded-t-lg my-2 ">
            
           <div className="divide-y divide-gray-200 border border-gray-200">
           {penaltyDetails.map((item, index) => (
              <div key={index} className=" rounded-md my-2 ">
                <div key={item.id} className="">
                  <div className="px-3 grid  grid-cols-1 gap-4 items-end mb-3">
                    <div className="flex gap-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          penalty <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name={`penaltyDetails[${index}].penalty`}
                          control={control}
                          rules={{ required: "penalty is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`${inputAntdSelectClassName} ${errors.penaltyDetails?.[index]?.penalty ? '' : 'border-gray-300'}`}
                              placeholder="Select penalty"
                              getPopupContainer={(trigger) => trigger.parentNode}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <Option value="">Select penalty</Option>
                              {employeePenaltyListData?.map((item) => (
                                <Option key={item._id} value={item._id}>
                                  {item.penaltyName} ({dayjs(item.issueDate).format("DD-MM-YYYY")})
                                </Option>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.penaltyDetails?.[index]?.penalty && (
                          <p className="text-red-500 text-sm">
                            {errors.penaltyDetails[index].penalty.message}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="py-2">
                      {(
                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            onClick={() => {
                              removePenalty(item, index);
                            }}
                            className="text-rose-800 hover:text-rose-900 flex items-center justify-center p-1 rounded-lg"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
           </div>
            <Button
              type="dashed"
              className="my-2"
              onClick={() => appendPenalty({})}
              block
              style={{ marginBottom: "10px" }}
            >
              Add Penalty
            </Button>
          </div>
        </div>
        <div className="flex justify-end items-center p-6 pt-0">
          <Button type="primary" htmlType="submit" className="mr-2">
            Add
          </Button>
          <Button onClick={closePenaltyModal} className="bg-[#d41c1c]" type="default">
            Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PenaltyModal;
