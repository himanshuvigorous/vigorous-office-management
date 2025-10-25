import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { formButtonClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { useDispatch } from "react-redux";
import { AssetInventryCreate } from "./AssetTypeFeatures/_AssetType_reducers";
import { useEffect } from "react";

const UpdateInventryModal = ({ updateInventryModal,  onClose ,getAssetInventryListListRequest}) => {
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
   

    useEffect(()=>{
        if(updateInventryModal?.data){
           setValue("name",updateInventryModal?.data?.name)
           setValue("brand",updateInventryModal?.data?.brand)
           setValue("model",updateInventryModal?.data?.model)
           setValue("serialNumber",updateInventryModal?.data?.serialNumber)
        }
    },[updateInventryModal?.data])
 

    const onSubmit = (data) => {
         
        const paylaod = {
    "companyId": updateInventryModal?.data?.companyId,
    "directorId": "",
    "branchId": updateInventryModal?.data?.branchId,
    "assetNameId": updateInventryModal?.data?.assetNameId,
    "items":[{
        name:data?.name,
        brand:data?.brand,
        model:data?.model,
        serialNumber:data?.serialNumber,
        _id: updateInventryModal?.data?._id
    }]
}

dispatch(AssetInventryCreate(paylaod)).then((data)=>{
    if(!data?.error){
        onClose()
        reset()
        getAssetInventryListListRequest()
    }
})
     }
    return (
        <Modal
            open={updateInventryModal?.isOpen}
            onCancel={()=>{onClose(); reset()}}
    
            title={false}
            width={1200}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
            centered
            className="antmodalclassName"
            footer={
               <div className="flex justify-end px-3 pb-2">
                        <button type="button" onClick={()=>handleSubmit(onSubmit)()} className={`${formButtonClassName}`}>
                            Submit Details
                        </button>
                    </div>
            }
        >
            <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                <div
                                className="grid grid-cols-2 md:grid-cols-4 md:gap-8 gap-2 px-3 md:my-4"
                            >

                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`name`, {
                                                required: "Name is required",
                                            })}
                                            className={`${inputClassName} ${errors.name
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter Name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            brand <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`brand`, {
                                                required: "brand is required",
                                            })}
                                            className={`${inputClassName} ${errors.brand
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter brand"
                                        />
                                        {errors.brand && (
                                            <p className="text-red-500 text-sm">
                                                {errors.brand.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            model <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`model`, {
                                                required: "model is required",
                                            })}
                                            className={`${inputClassName} ${errors.model
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter model"
                                        />
                                        {errors.model && (
                                            <p className="text-red-500 text-sm">
                                                {errors.model.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            serialNumber <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`serialNumber`, {
                                                required: "serialNumber is required",
                                            })}
                                            className={`${inputClassName} ${errors.serialNumber
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter serialNumber"
                                        />
                                        {errors.serialNumber && (
                                            <p className="text-red-500 text-sm">
                                                {errors.serialNumber.message}
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

export default UpdateInventryModal;