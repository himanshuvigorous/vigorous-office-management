import { Modal, Select, Spin } from 'antd';
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { employeSearch } from '../../employeManagement/employeFeatures/_employe_reducers';
import { LeadmanagementTransferListCreate } from './LeadmanagementFeature/_LeadmanagementFeature_reducers';


const TransferReaquestCreateModal = ({ transferModal, onclose, LeadmanagementtransferLoading }) => {
  
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
      const { employeList } = useSelector((state) => state.employe);
    const dispatch = useDispatch()
    const onSubmit = (data) => {

        const reqdata = {
            "companyId": transferModal?.leadId?.companyId,
            "directorId": transferModal?.leadId?.directorId,
            "branchId": transferModal?.leadId?.branchId,
            "leadId": transferModal?.leadId?._id,
            "fromUser": transferModal?.leadId?.assignedToId,
            "toUser": data?.employeeId,
            "remark": data?.remark,
        }

        dispatch(LeadmanagementTransferListCreate(reqdata)).then((res)=>{
            if(!res.error){
                onclose()
                reset()
                
            }
        })
    }

    useEffect(() => {
    if (transferModal?.isOpen) {
            fetchEmployeListData()
        }
      }, [transferModal])
    const fetchEmployeListData = () => {
        const reqPayload = {
            text: "",
            status: true,
            sort: true,
            isTL: "",
            isHR: "",
            isPagination: false,
            departmentId: "",
            designationId: "",
            "companyId": transferModal?.leadId?.companyId,
            "directorId": transferModal?.leadId?.directorId,
            "branchId": transferModal?.leadId?.branchId,
              isBranch: true,
              isDirector :true
        };

        dispatch(employeSearch(reqPayload));
    };

    return (
        <Modal
            visible={transferModal?.isOpen}
            onCancel={() => {
                onclose()
                reset()
            }}
            footer={null}
            title="Apply Leave"
            width={1000}
            height={400}
            className="antmodalclassName"


        >

            <form autoComplete="off" className="" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">


                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            Transfer to <span className="text-red-600">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="employeeId"
                            rules={{ required: "Task Priority is required" }}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    placeholder={"Select Transfer To"}
                                    className={`${inputAntdSelectClassName} `}
                                    showSearch
                                    getPopupContainer={() => document.body}
                                    popupClassName={'!z-[1580]'}

                                    filterOption={(input, option) =>
                                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    <Select.Option value=""> Select Transfer to </Select.Option>
                                    {
                                        employeList?.map((type, index) => (
                                            <Select.Option key={index} value={type?._id}>
                                                {type?.fullName}
                                            </Select.Option>
                                        ))
                                    }

                                </Select>
                            )}
                        />
                        {errors.employeeId && (
                            <p className="text-red-500 text-sm">
                                {errors.employeeId.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            remark <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            {...register("remark", {
                                required: "remark is required",
                            })}
                            className={`placeholder: ${inputClassName} ${errors.remark
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            placeholder="Enter remark"
                        />
                        {errors.remark && (
                            <p className="text-red-500 text-sm">
                                {errors.remark.message}
                            </p>
                        )}
                    </div>



                </div>

                <div className="flex justify-end ">
                    <button
                        type="submit"
                        disabled={LeadmanagementtransferLoading}
                        className={`${LeadmanagementtransferLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3 `}
                    >
                        {LeadmanagementtransferLoading ? <Spin /> : 'Submit'}
                    </button>
                </div>
            </form>


        </Modal>
    );
};

export default TransferReaquestCreateModal;