
import { useFieldArray, useForm } from "react-hook-form";
import { inputClassName, inputLabelClassName } from "../../../constents/global";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { clientServiceSearch } from "../clientService/clientServiceFeatures/_client_service_reducers";
import { useEffect } from "react";
import { deleteService, updateService } from "./clientFeatures/_client_reducers";

function ServicesDetails({ clientData ,fetchData }) {
    const dispatch = useDispatch();
    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            ServicesDetails: [{
                serviceId: "",
                number: ""
            }],
        },
    });

    useEffect(() => {
        dispatch(clientServiceSearch({
            companyId: clientData?.companyId,
            branchId: clientData?.branchId,
            "directorId": "",
            "text": "",
            "sort": true,
            "status": true,
            "isPagination": false,
        }))

    }, [])


    const { ClientServiceList } = useSelector(state => state.clientService)
    const { fields: ServicesDetails,
        append: appendService,
        remove: removeService } = useFieldArray({
            control,
            name: "ServicesDetails"
        });
    useEffect(() => {
        if (clientData?.data?.serviceData && ClientServiceList?.docs &&  clientData?.data?.serviceData?.length > 0) {
            reset({
                ServicesDetails: []
            });
            clientData?.data?.serviceData?.forEach((eduDetail) => {
                const formattedEduDetail = {
                    ...eduDetail,

                };
                appendService(formattedEduDetail);
            });

        }
    }, [clientData, ClientServiceList])
    const onSubmit = (data) => {

        const finalPaylaod = {
            "companyId": clientData?.data?.companyId,
            "directorId": "",
            "branchId": clientData?.data?.branchId,
            "clientId": clientData?.data?._id,
            "type": "Service",
            "serviceArr": [
                ...data?.ServicesDetails
            ]
        }

        dispatch(updateService(finalPaylaod)).then((res)=>{
            if(!res?.error){
                fetchData()
            }
        })
    };
    const deleteData = (data , index)=>{
        if(data?._id){
        dispatch( deleteService({
             _id:data?._id
         })).then((res)=>{
             if(!res?.error){
                 fetchData()
             }
         })
        }  else {
            removeService(index)
        }
     }
    return (
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <>
                {ServicesDetails.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 rounded-md my-2">
                        <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                            <div className="px-3 py-2 text-white font-semibold">Service {index + 1}</div>
                            {index !== 0 && <button
                                type="button"
                                onClick={() =>deleteData(item, index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <AiFillDelete size={20} className="m-2" />
                            </button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                            <div className="">
                                <label className={`${inputLabelClassName}`}>
                                    Service <span className="text-red-600">*</span>
                                </label>
                                <select
                                    {...register(`ServicesDetails.${index}.serviceId`, {
                                        required: "service is required",
                                    })}

                                    className={`${inputClassName} ${errors.ServicesDetails?.[index]?.serviceId
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                >
                                    <option className="text-xs" value="">
                                        Select Service
                                    </option>
                                    {ClientServiceList?.docs?.
                                        // filter((type) =>!ServicesDetails.some((doc) =>doc.serviceId === type._id ))?.
                                        map((type) => (
                                            <option value={type?._id}>{type?.name}</option>
                                        ))}
                                </select>
                                {errors.ServicesDetails?.[index]?.serviceId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.ServicesDetails?.[index]?.serviceId.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className={`${inputLabelClassName}`}>
                                    File Number <span className="text-red-600">*</span>
                                </label>
                                <input
                                    {...register(`ServicesDetails.${index}.number`, { required: "Full Name is required" })}
                                    defaultValue={item.number}
                                    className={`${inputClassName} ${errors?.ServicesDetails?.[index]?.number ? "border-[1px] " : "border-gray-300"}`}
                                />
                                {errors?.ServicesDetails?.[index]?.number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.ServicesDetails[index].number.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex gap-2 justify-between items-center my-2">
                    <button
                        type="button"
                        onClick={() => appendService({ serviceId: "", number: "" })}
                        className="bg-header px-2 py-2 text-sm rounded-md text-white"
                    >
                        Add New Service
                    </button>

                    <button type="submit" className="bg-header px-2 py-2 text-sm rounded-md text-white">
                        Submit
                    </button></div>
            </>
        </form>
    )
}

export default ServicesDetails
