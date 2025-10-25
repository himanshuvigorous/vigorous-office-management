import { Empty, Modal } from "antd";
import { useFieldArray, useForm } from "react-hook-form";
import { formButtonClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AssetInventryCreate } from "./AssetTypeFeatures/_AssetType_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

const InventryCreateModal = ({ openInventryModal, setInventryModal, onClose }) => {
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
    useEffect(() => {
        if (openInventryModal?.isOpen) {
            setValue('inventry', openInventryModal?.default ? Array.from({ length: openInventryModal?.default  }, () => ({
                name: '',
                brand: '',
                model: '',
                serialNumber: ''
            })) :
                [])
        }
    }, [openInventryModal])
   const {  loading:employeeDocumentLoading } = useSelector((state) => state.AssetType);
 
    const { fields, append, remove } = useFieldArray({
        control,
        name: "inventry",
    });
    const onSubmit = (data) => {
         
        const paylaod = {
    "companyId": openInventryModal?.data?.companyId,
    "directorId": "",
    "branchId": openInventryModal?.data?.branchId,
    "assetNameId": openInventryModal?.data?._id,
    "items": data?.inventry
}

dispatch(AssetInventryCreate(paylaod)).then((data)=>{
    if(!data?.error){
        onClose()
        reset()
    }
})

     }
    return (
        <Modal
            open={openInventryModal?.isOpen}
            onCancel={()=>{onClose(); reset()}}
    
            title={false}
            width={1200}
            bodyStyle={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px' }}
            centered
            className="antmodalclassName"
            footer={
              <div className="flex gap-2 justify-center items-center">
                {openInventryModal?.default > 0 &&  <div className="flex justify-end px-3 pb-2">
                        <button type="button" disabled={employeeDocumentLoading} onClick={()=>handleSubmit(onSubmit)()} className={`${employeeDocumentLoading ? "bg-gray-400" : "bg-header"} text-sm text-white py-2 px-3 rounded mt-4`}>
                            {employeeDocumentLoading ? <ListLoader/> : 'Submit Details'}
                        </button>
                    </div>}
               <div className="flex justify-end px-3 pb-2">
                        <button type="button" onClick={()=>onClose()} className={`bg-rose-800 text-sm text-white py-2 px-3 rounded mt-4`}>
                            Cancel
                        </button>
                    </div>
              </div>
            }
        >
          {openInventryModal?.default > 0 ?  <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {fields.map((item, index) => (
                        <div key={index} className=" rounded-md py-2 border  ">
                            <div className="flex justify-between items-center mb-4 bg-header rounded-t-md px-3">
                                <div className="py-2 text-white font-semibold">
                                    Inventry Details - {index + 1 }
                                </div>

                                { openInventryModal?.default <=  index &&   <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => remove( index)}
                          className="text-gray-300 hover:text-gray-400 flex items-center justify-center p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>}

                            </div>
                            <div
                                key={item.id}
                                className="grid grid-cols-2 md:grid-cols-4 md:gap-8 gap-2 px-3 md:my-4"
                            >

                                <div className="flex gap-3">
                                    <div className="w-full">
                                        <label className={`${inputLabelClassName}`}>
                                            Name <span className="text-red-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register(`inventry[${index}].name`, {
                                                required: "Name is required",
                                            })}
                                            className={`${inputClassName} ${errors.inventry?.[index]?.name
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter Name"
                                        />
                                        {errors.inventry?.[index]?.name && (
                                            <p className="text-red-500 text-sm">
                                                {errors.inventry[index].name.message}
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
                                            {...register(`inventry[${index}].brand`, {
                                                required: "brand is required",
                                            })}
                                            className={`${inputClassName} ${errors.inventry?.[index]?.brand
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter brand"
                                        />
                                        {errors.inventry?.[index]?.brand && (
                                            <p className="text-red-500 text-sm">
                                                {errors.inventry[index].brand.message}
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
                                            {...register(`inventry[${index}].model`, {
                                                required: "model is required",
                                            })}
                                            className={`${inputClassName} ${errors.inventry?.[index]?.model
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter model"
                                        />
                                        {errors.inventry?.[index]?.model && (
                                            <p className="text-red-500 text-sm">
                                                {errors.inventry[index].model.message}
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
                                            {...register(`inventry[${index}].serialNumber`, {
                                                required: "serialNumber is required",
                                            })}
                                            className={`${inputClassName} ${errors.inventry?.[index]?.serialNumber
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                            placeholder="Enter serialNumber"
                                        />
                                        {errors.inventry?.[index]?.serialNumber && (
                                            <p className="text-red-500 text-sm">
                                                {errors.inventry[index].serialNumber.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* <div className="flex justify-between px-3 py-2">
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    name: '',
                                    brand: '',
                                    model: '',
                                    serialNumber: ''
                                })
                            }
                            className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
                        >
                            Add More
                        </button>
                    </div> */}
                   
                </div>
            </form> : <Empty />}
        </Modal>
    );
};

export default InventryCreateModal;