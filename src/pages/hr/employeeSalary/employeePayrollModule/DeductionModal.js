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
import { deductionsListSearch } from "../Deductions/deductionsfeature/_deductionsList_reducers";

const DeductionModal = ({ closeDeductionModal, isDeductionOpen, getPayrollDetailsFunc }) => {
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
  const { deductionsListData } = useSelector((state) => state.deductions);

  useEffect(() => {
    getchDeductionsData();
  }, []);

  const {
    fields: deductionDetails,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: "deductionDetails",
  });

  const getchDeductionsData = () => {
    let reqData = { 
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId: isDeductionOpen?.data?.data?.companyId,
        branchId: isDeductionOpen?.data?.data?.branchId,
    };
    dispatch(deductionsListSearch(reqData)).then((data) => {
      if (!data?.error) {
    reset();
        isDeductionOpen?.data?.data?.deductions?.forEach(deduction => {
          const newDeduction = {
            deduction: deduction?.deductionId,
            isPercentage: deduction?.isPercentage ? "Yes" : "No",
            amount: deduction?.value,
          };
          appendDeduction(newDeduction);
        });
      }
    });
  };

  const handleCreate = (data) => {
    const payrolldata = isDeductionOpen?.data?.data;
    dispatch(
      updatePayrollData({
        _id: payrolldata?._id,
        companyId: payrolldata?.companyId,
        branchId: payrolldata?.branchId,
        employeId: payrolldata?.employeId,
        startDate: payrolldata?.startDate,
        endDate: payrolldata?.endDate,
        "allowances": payrolldata?.allowances,
        deductions: data?.deductionDetails?.map((deduction) => ({
          "deductionId": deduction?.deduction,
          "name": deductionsListData?.find((item) => item?._id === deduction?.deduction)?.name,
          "isPercentage": deduction?.isPercentage === "Yes" ? true : false,
          "value": deduction?.amount
        })),
        penalties:payrolldata?.panalty ?  payrolldata?.panalty?.map((penalty) => penalty?.penaltyId) : []
      })
    ).then((res) => {
      if (!res.error) {
        getPayrollDetailsFunc();
        closeDeductionModal();
      }
    });
  };

  const { Option } = Select;

  return (
    <Modal
      visible={isDeductionOpen}
      onCancel={closeDeductionModal}
      footer={null}
      title="Add Deduction"
      width={600}
       className="antmodalclassName"
      height={600}
    >
      <form autoComplete="off" onSubmit={handleSubmit(handleCreate)}>
        <div>
          <div className="rounded-t-lg my-2 ">
            
           <div className="divide-y divide-gray-200 border border-gray-200">
           {deductionDetails.map((item, index) => (
              <div key={index} className=" rounded-md my-2 ">
                <div key={item.id} className="">
                  <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                    <div className="flex gap-3">
                    <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Deduction <span className="text-red-600">*</span>
                            </label>
                            <Controller
                              name={`deductionDetails[${index}].deduction`}
                              control={control}
                              rules={{ required: "deduction is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.deduction ? '' : 'border-gray-300'}`}
                                  placeholder="Select deduction"
                                  value={field.value}
                                  getPopupContainer={(trigger) => trigger.parentNode}
                                  onChange={(value) => {
                                    field.onChange(value);
                                  }}
                                >
                                  <Option value="">Select deduction</Option>
                                  {deductionsListData?.map((item) => (
                                    <Option key={item._id} value={item._id}>
                                      {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              )}
                            />
                            {errors.deductionDetails?.[index]?.deduction && (
                              <p className="text-red-500 text-sm">
                                {errors.deductionDetails[index].deduction.message}
                              </p>
                            )}
                          </div>
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Is Percentage <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name={`deductionDetails[${index}].isPercentage`}
                        control={control}
                        rules={{ required: "isPercentage is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.deductionDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
                            placeholder="Select Is Percentage"
                            getPopupContainer={(trigger) => trigger.parentNode}
                            value={field.value}
                            onChange={(value) => {
                              field.onChange(value);
                            }}
                          >
                            <Option value="">Select Is Percentage</Option>
                            <Option value="Yes">Yes</Option>
                            <Option value="No">No</Option>
                          </Select>
                        )}
                      />
                      {errors.deductionDetails?.[index]?.isPercentage && (
                        <p className="text-red-500 text-sm">
                          {errors.deductionDetails[index].isPercentage.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        {watch(`deductionDetails[${index}].isPercentage`) === "Yes"
                          ? "Percentage"
                          : "Amount"}{" "}
                        <span className="text-red-600">*</span>
                      </label>

                      <input
                        type="number"
                         step="0.01"
                        {...register(`deductionDetails[${index}].amount`, {
                          required: "Amount is required",
                          valueAsNumber: true,
                          min: watch(`deductionDetails[${index}].isPercentage`) === "Yes" ? 1 : undefined,
                        })}
                        className={`${inputClassName} ${errors.deductionDetails?.[index]?.amount
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      />

                      {errors.deductionDetails?.[index]?.amount && (
                        <p className="text-red-500 text-sm">
                          {errors.deductionDetails[index].amount.message}
                        </p>
                      )}
                    </div>
                    <div className="py-2">
                      {(
                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            onClick={() => {
                              removeDeduction(item, index);
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
              onClick={() => appendDeduction({})}
              block
              style={{ marginBottom: "10px" }}
            >
              Add Deduction
            </Button>
          </div>
        </div>
        <div className="flex justify-end items-center p-6 pt-0">
          <Button type="primary" htmlType="submit" className="mr-2">
            Add
          </Button>
          <Button onClick={closeDeductionModal} className="bg-[#d41c1c]" type="default">
            Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DeductionModal;
