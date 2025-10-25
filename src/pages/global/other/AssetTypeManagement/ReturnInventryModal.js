import { Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { updateAssetInventry } from "./AssetTypeFeatures/_AssetType_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
const ReturnInventryModal = ({ returnInventryModal, onClose, getAssetInventryListListRequest }) => {
    const {
        register,
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm()
    const dispatch = useDispatch()
    const { loading: employeeDocumentLoading } = useSelector((state) => state.AssetType);
    const onSubmit = (data) => {

        const paylaod = {
            "companyId": returnInventryModal?.data?.companyId,
            "directorId": "",
            "branchId": returnInventryModal?.data?.branchId,
            "assetNameId": returnInventryModal?.data?.assetNameId,
            "_id": returnInventryModal?.data?._id,
            "employeId": returnInventryModal?.data?.employeId,
            "assignDate": returnInventryModal?.data?.assignDate,
            "conditionOnAssign": returnInventryModal?.data?.conditionOnAssign,
            "remarks": data?.remarks,
            "status": data?.status,
            "returnDate": dayjs(data?.returnDate).format("YYYY-MM-DD"),
            "conditionOnReturn": data?.conditionOnReturn,
        }



        dispatch(updateAssetInventry(paylaod)).then((data) => {
            if (!data?.error) {
                onClose()
                reset()
                getAssetInventryListListRequest()
            }
        })

    }
    return (
        <Modal
            open={returnInventryModal?.isOpen}
            onCancel={() => { onClose(); reset() }}

            title={false}
            width={1200}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
            centered
            className="antmodalclassName"
            footer={
                <div className="flex justify-end px-3 pb-2">
                    <button disabled={employeeDocumentLoading} type="button" onClick={() => handleSubmit(onSubmit)()} className={`${employeeDocumentLoading ? "bg-gray-400" : "bg-header"} text-sm text-white py-2 px-3 rounded mt-4`}>
                        {employeeDocumentLoading ? <ListLoader /> : "Submit Details"}
                    </button>
                </div>
            }
        >
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-2 px-3 md:my-4"
                    >
                        <div className="w-full">
                            <label className={`${inputLabelClassName}`}>Condition <span className="text-red-600"> *</span></label>

                            <Controller
                                name="status"
                                control={control}
                                rules={{ required: "status is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px]" : "border-gray-300"}`}
                                        getPopupContainer={() => document.parentElement}
                                        dropdownStyle={{ zIndex: 3000 }}
                                        placeholder="Select status"
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }>
                                        {["lost", "maintenance", "retired", "damaged", "returned"]?.map((item) => (
                                            <Select.Option key={item} value={item}>
                                                {item}
                                            </Select.Option>
                                        ))
                                        }
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                        </div>
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Return Date <span className="text-red-600">*</span>
                            </label>
                            <Controller
                                name="returnDate"
                                control={control}
                                rules={
                                    {
                                        required: 'Date is required'
                                    }
                                }
                                render={({ field }) => (
                                    <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                                        return current && current.isAfter(moment().endOf('day'), 'day');
                                    }} />
                                )}
                            />
                            {errors.returnDate && (
                                <p className="text-red-500 text-sm">Date is required</p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <div className="w-full">
                                <label className={`${inputLabelClassName}`}>
                                    remarks <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register(`remarks`, {
                                        required: "remarks is required",
                                    })}
                                    className={`${inputClassName} ${errors.remarks
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Enter remarks"
                                />
                                {errors.remarks && (
                                    <p className="text-red-500 text-sm">
                                        {errors.remarks.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <div className="w-full">
                                <label className={`${inputLabelClassName}`}>
                                    Condition On Return <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register(`conditionOnReturn`, {
                                        required: "Condition On Return is required",
                                    })}
                                    className={`${inputClassName} ${errors.conditionOnReturn
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Enter Condition On Return"
                                />
                                {errors.conditionOnReturn && (
                                    <p className="text-red-500 text-sm">
                                        {errors.conditionOnReturn.message}
                                    </p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default ReturnInventryModal;