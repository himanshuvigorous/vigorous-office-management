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

const AllowanceModal = ({ closeAllowanceModal, isAllowanceOpen, getPayrollDetailsFunc }) => {
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
  const { allowanceListData } = useSelector((state) => state.allowance);

  useEffect(() => {
    getchAllowanceData();
  }, []);

  const {
    fields: allowanceDetails,
    append: appendAllowance,
    remove: removeAllowance,
  } = useFieldArray({
    control,
    name: "allowanceDetails",
  });

  const getchAllowanceData = () => {
    let reqData = {
      reqPayload: {
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        directorId: "",
        companyId: isAllowanceOpen?.data?.data?.companyId,
        branchId: isAllowanceOpen?.data?.data?.branchId,
      },
    };
    dispatch(getAllowanceList(reqData)).then((data) => {
      if (!data?.error) {
    reset();
        isAllowanceOpen?.data?.data?.allowances?.forEach(allowance => {
          const newAllowance = {
            allowance: allowance?.allowanceId,
            isPercentage: allowance?.isPercentage ? "Yes" : "No",
            amount: allowance?.value,
          };
          appendAllowance(newAllowance);
        });
      }
    });
  };

  const handleCreate = (data) => {
    const payrolldata = isAllowanceOpen?.data?.data;
    dispatch(
      updatePayrollData({
        _id: payrolldata?._id,
        companyId: payrolldata?.companyId,
        branchId: payrolldata?.branchId,
        employeId: payrolldata?.employeId,
        startDate: payrolldata?.startDate,
        endDate: payrolldata?.endDate,
        "allowances": data?.allowanceDetails?.map((allowance) => ({
          "allowanceId": allowance?.allowance,
          "name": allowanceListData?.find((item) => item?._id === allowance?.allowance)?.name,
          "isPercentage": allowance?.isPercentage === "Yes" ? true : false,
          "value": allowance?.amount
        })),
        deductions: payrolldata?.deductions,
        penalties:payrolldata?.panalty ?  payrolldata?.panalty?.map((penalty) => penalty?.penaltyId) : []

      })
    ).then((res) => {
      if (!res.error) {
        getPayrollDetailsFunc();
        closeAllowanceModal();
      }
    });
  };

  const { Option } = Select;

  return (
    <Modal
      visible={isAllowanceOpen}
      onCancel={closeAllowanceModal}
      footer={null}
      title="Add Allowance"
      width={600}
       className="antmodalclassName"
      height={600}
    >
      <form autoComplete="off" onSubmit={handleSubmit(handleCreate)}>
        <div>
          <div className="rounded-t-lg my-2 ">
            
           <div className="divide-y divide-gray-200 border border-gray-200">
           {allowanceDetails.map((item, index) => (
              <div key={index} className=" rounded-md my-2 ">
                <div key={item.id} className="">
                  <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                    <div className="flex gap-3">
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Allowance <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name={`allowanceDetails[${index}].allowance`}
                          control={control}
                          rules={{ required: "allowance is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.allowance ? '' : 'border-gray-300'}`}
                              placeholder="Select allowance"
                              getPopupContainer={(trigger) => trigger.parentNode}
                              value={field.value}
                              onChange={(value) => {
                                field.onChange(value);
                              }}
                            >
                              <Option value="">Select allowance</Option>
                              {allowanceListData?.map((item) => (
                                <Option key={item._id} value={item._id}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          )}
                        />
                        {errors.allowanceDetails?.[index]?.allowance && (
                          <p className="text-red-500 text-sm">
                            {errors.allowanceDetails[index].allowance.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Is Percentage <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        name={`allowanceDetails[${index}].isPercentage`}
                        control={control}
                        rules={{ required: "isPercentage is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName} ${errors.allowanceDetails?.[index]?.isPercentage ? '' : 'border-gray-300'}`}
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
                      {errors.allowanceDetails?.[index]?.isPercentage && (
                        <p className="text-red-500 text-sm">
                          {errors.allowanceDetails[index].isPercentage.message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        {watch(`allowanceDetails[${index}].isPercentage`) === "Yes"
                          ? "Percentage"
                          : "Amount"}{" "}
                        <span className="text-red-600">*</span>
                      </label>

                      <input
                        type="number"
                         step="0.01"
                        {...register(`allowanceDetails[${index}].amount`, {
                          required: "Amount is required",
                          valueAsNumber: true,
                          min: watch(`allowanceDetails[${index}].isPercentage`) === "Yes" ? 1 : undefined,
                        })}
                        className={`${inputClassName} ${errors.allowanceDetails?.[index]?.amount
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      />

                      {errors.allowanceDetails?.[index]?.amount && (
                        <p className="text-red-500 text-sm">
                          {errors.allowanceDetails[index].amount.message}
                        </p>
                      )}
                    </div>
                    <div className="py-2">
                      {(
                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            onClick={() => {
                              removeAllowance(item, index);
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
              onClick={() => appendAllowance({})}
              block
              style={{ marginBottom: "10px" }}
            >
              Add Allowance
            </Button>
          </div>
        </div>
        <div className="flex justify-end items-center p-6 pt-0">
          <Button type="primary" htmlType="submit" className="mr-2">
            Add
          </Button>
          <Button onClick={closeAllowanceModal} className="bg-[#d41c1c]" type="default">
            Close
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AllowanceModal;
