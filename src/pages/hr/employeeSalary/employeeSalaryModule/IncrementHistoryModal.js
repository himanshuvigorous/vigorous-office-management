import { Modal, Select } from 'antd';
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import CustomDatePicker from '../../../../global_layouts/DatePicker/CustomDatePicker';
import { formButtonClassName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from '../../../../constents/global';
import moment from 'moment';
import dayjs from 'dayjs';
import { createSalaryIncrement } from './employeeSalaryFeatures/_employee_salary_reducers';
import { getOnBoardingDetails } from '../../onBoarding/onBoardingFeatures/_onBoarding_reducers';
import { useDispatch } from 'react-redux';

const IncrementHistoryModal = ({ incrementlistFunc ,onClose, isOpen, onBoardingDetailsData }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset
    } = useForm();
    const isPercentage = useWatch({
        control,
        name: "isPercentage",
        defaultValue: "",
    });
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        const reqData = {
            companyId: onBoardingDetailsData?.companyId,
            directorId: onBoardingDetailsData?.directorId,
            branchId: onBoardingDetailsData?.branchId,
            employeId: onBoardingDetailsData?.employeId,
            "incrementPercentage": data?.isPercentage === "Yes" ? + data?.incrementPercentage : 0,
            "incrementAmount": data?.isPercentage === "Yes" ? 0 : + data?.incrementAmount,
            "isPercentage": data?.isPercentage === "Yes" ? true : false,
            "nextIncrementDate": dayjs(data?.nextIncrementDate)?.format("YYYY-MM-DD"),
            "remark": data?.remark
        }

        await dispatch(createSalaryIncrement(reqData)).then((data) => {
            if (!data.error) {
                incrementlistFunc()
                onClose()
                reset()
            }
        });
    }
    return (
        <Modal
            visible={isOpen}
            onCancel={() => {
                onClose()
                reset()
            }}
            footer={null}

             className="antmodalclassName"
            title={false}
            width={1200}
            height={600}
            destroyOnClose={true}
        >
            <form autoComplete="off" className="mt-2 md:px-1" >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            Next Increment Date  <span className="text-red-600">*</span>
                        </label>
                        <Controller
                            name={'nextIncrementDate'}
                            control={control}
                            rules={{ required: "nextIncrementDate is required" }}
                            render={({ field }) => (
                                <CustomDatePicker format="DD/MM/YYYY" picker="date" field={field} errors={errors} disabledDate={(current) => {
                                    return current && current.isBefore(moment(onBoardingDetailsData?.generalInfo?.dateOfJoining).endOf('day'), 'day');
                                }} />
                            )}
                        />

                        {errors.nextIncrementDate && (
                            <p className="text-red-500 text-sm">
                                {errors.nextIncrementDate?.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            Is Percentage <span className="text-red-600">*</span>
                        </label>
                        <Controller
                            name={`isPercentage`}
                            control={control}
                            rules={{ required: "isPercentage is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className={`${inputAntdSelectClassName} ${errors?.isPercentage ? '' : 'border-gray-300'}`}
                                    placeholder="Select Is Percentage"
                                    value={field.value}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                >
                                    <Select.Option value="">Select Is Percentage</Select.Option>
                                    <Select.Option value="Yes">Yes</Select.Option>
                                    <Select.Option value="No">No</Select.Option>
                                </Select>

                            )}
                        />
                        {errors?.isPercentage && (
                            <p className="text-red-500 text-sm">
                                {errors?.isPercentage?.message}
                            </p>
                        )}
                    </div>
                    {isPercentage === "Yes" ? <div>
                        <label className={`${inputLabelClassName}`}>
                            Increment Percentage<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            {...register("incrementPercentage", {
                                required: "Increment Percentage is required",
                                max: {
                                    value: 100,
                                    message: "Increment Percentage cannot be more than 100",
                                },
                                min: {
                                    value: 0,
                                    message: "Increment Percentage cannot be less than 0",
                                },
                            })}
                            className={`${inputClassName} ${errors.incrementPercentage ? "border-[1px] border-red-600" : ""}`}
                            placeholder="Enter Increment Percentage"
                        />
                        {errors.incrementPercentage && (
                            <p className="text-red-600 text-sm">
                                {errors.incrementPercentage?.message}
                            </p>
                        )}
                    </div>
                        :
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Increment Amount<span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                {...register("incrementAmount", {
                                    required: "Increment Amount is required",
                                })}
                                className={`${inputClassName} ${errors.incrementAmount ? "border-[1px] " : ""
                                    }`}
                                placeholder="Enter Increment Amount"
                            />
                            {errors.incrementAmount && (
                                <p className="text-red-600 text-sm">
                                    {errors.incrementAmount?.message}
                                </p>
                            )}
                        </div>}
                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            Remark <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("remark", { required: "Remark is required" })}
                            className={`${inputClassName} ${errors.remark ? "border-[1px] " : "border-gray-300"}`}
                            placeholder="Enter Remark"
                        />
                        {errors.remark && (
                            <p className="text-red-500 text-sm">
                                {errors.remark.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex justify-between px-3 pb-2">
                    <button type="button" onClick={handleSubmit(onSubmit)} className={`${formButtonClassName}`}>
                        Submit Details
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default IncrementHistoryModal;