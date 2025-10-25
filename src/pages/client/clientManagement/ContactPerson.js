import { Controller, useForm } from "react-hook-form";
import { inputClassName, inputLabelClassName } from "../../../constents/global";
import { AutoComplete, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { useEffect } from "react";
import { updateClientFunc } from "./clientFeatures/_client_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";

function ContactPerson({ clientData ,fetchData }) {
    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm();
    const { countryListData } = useSelector((state) => state.country);
    const dispatch = useDispatch()
    const onSubmit = (data) => {

        const finalPayload = {
            ...clientData?.data,
            clientProfile: {
                ...clientData?.data?.clientProfile,
                "contactInfo": {
                    "name": data?.name,
                    "email": data?.email,
                    "mobile": {
                        "code": data?.code,
                        "number": data?.number
                    },
                    "designation": data?.designation
                }
            }

        }
        dispatch(updateClientFunc(finalPayload)).then((res)=>{
            if(!res?.error){
                fetchData()
            }
        })
    }

    useEffect(() => {
        if (clientData?.data?.clientProfile?.contactInfo) {
            setValue("name", clientData?.data?.clientProfile?.contactInfo?.name)
            setValue("email", clientData?.data?.clientProfile?.contactInfo?.email)
            setValue("code", clientData?.data?.clientProfile?.contactInfo?.mobile?.code)
            setValue("number", clientData?.data?.clientProfile?.contactInfo?.mobile?.number)
            setValue("designation", clientData?.data?.clientProfile?.contactInfo?.designation)
        }
    }, [clientData])

    return (
        <form autoComplete="off" className="" onSubmit={handleSubmit(onSubmit)}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
                <div className="">
                    <label className={`${inputLabelClassName}`}>
                        Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("name", {
                            required: "Name is required",
                        })}
                        className={`placeholder: ${inputClassName} ${errors.name
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
                <div className="">
                    <label className={`${inputLabelClassName}`}>
                        Email <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address",
                            },
                        })}
                        className={` ${inputClassName} ${errors.email ? "border-[1px] " : "border-gray-300"
                            }`}
                        placeholder="Enter Email"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
                </div>
                <div className="">
                    <label className={`${inputLabelClassName}`}>
                        designation <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="designation"
                        {...register("designation", {
                            required: "designation is required",
                        })}
                        className={` ${inputClassName} ${errors.designation ? "border-[1px] " : "border-gray-300"
                            }`}
                        placeholder="Enter designation"
                    />
                    {errors.designation && (
                        <p className="text-red-500 text-sm">
                            {errors.designation.message}
                        </p>
                    )}
                </div>
                <div className="flex gap-3">
                    <div className="w-[150px]">
                        <label className={`${inputLabelClassName}`}>
                            code<span className="text-red-600">*</span>
                        </label>
                        <Controller
                            control={control}
                            name="code"
                            rules={{ required: "code is required" }}
                            render={({ field }) => (
                                <CustomMobileCodePicker
                                field={field}
                                  errors={errors} 
                                />
                            )}
                        />
                        {errors[`code`] && (
                            <p className="text-red-500 text-sm">
                                {errors[`code`].message}
                            </p>
                        )}
                    </div>
                    <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                            Mobile No<span className="text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            {...register(`number`, {
                                required: "Mobile No is required",
                                minLength: {
                                    value: 10,
                                    message: "Must be exactly 10 digits",
                                },
                                maxLength: {
                                    value: 10,
                                    message: "Must be exactly 10 digits",
                                },
                            })}
                            className={` ${inputClassName} ${errors[`number`]
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            placeholder="Enter Mobile No"
                            maxLength={10}
                            onInput={(e) => {
                                if (e.target.value.length > 10) {
                                    e.target.value = e.target.value.slice(0, 10);
                                }
                            }}
                        />
                        {errors[`number`] && (
                            <p className="text-red-500 text-sm">
                                {errors[`number`].message}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex justify-end ">
                <button
                    type="submit"
                    className="bg-header text-white p-2 px-4 rounded mt-4"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default ContactPerson
