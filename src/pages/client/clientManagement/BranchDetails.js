import { AutoComplete, Input } from "antd";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteService, updateService } from "./clientFeatures/_client_reducers";
import { useEffect } from "react";
import moment from "moment";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import ListLoader from "../../../global_layouts/ListLoader";

function BranchDetails({ clientData ,fetchData }) {
    const dispatch = useDispatch();
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            BranchDetails: [{
                fullName: "",
                userType: "clientBranch",

                email: "",
                mobile: { code: "", number: "" },
                directorProfile: {
                    isShareLoginDetails: false,
                    secondaryEmail: "",
                    secondaryMobile: [{ code: "", number: "" }],
                    landline: { code: "", number: "" }
                },
                addresses: { street: "", city: "", state: "", country: "", pinCode: "" }
            }]
        },
    });
    const { countryListData,loading:countryListLoading } = useSelector((state) => state.country);
    const { stateListData } = useSelector((state) => state.states);
    const { cityListData } = useSelector((state) => state.city);
    const { fields: branchDetails,
        append: appendBranch,
        remove: removeBranch, } = useFieldArray({
            control,
            name: "BranchDetails"
        });

    useEffect(() => {
        if (clientData?.data?.branchData && clientData?.data?.branchData?.length > 0) {
          const formattedBranchData = clientData?.data?.branchData?.map((eduDetail) => {
            return {
              clientData: [], 
              addresses: {
                street: eduDetail?.addresses?.primary?.street,
                country: eduDetail?.addresses?.primary?.country,
                state: eduDetail?.addresses?.primary?.state,
                city: eduDetail?.addresses?.primary?.city,
                pinCode: eduDetail?.addresses?.primary?.pinCode,
              },
              _id: eduDetail?._id,
              fullName: eduDetail?.fullName,
              userType: "clientOwner",
              gst : eduDetail?.branchProfile?.GSTNumber,
             
              email: eduDetail?.email,
              mobile: {
                  code: eduDetail?.mobile?.code,
                  number: eduDetail?.mobile?.number,
              },
            //   landline: {
            //       code: eduDetail?.directorProfile?.landline?.code,  
            //   },
              branchProfile: {

                  isShareLoginDetails: eduDetail?.branchProfile?.isShareLoginDetails,
                  secondaryEmail: "",
                  secondaryMobile: {
                      code: "",
                      number: "",
                  },
                  landline: {
                      code: eduDetail?.branchProfile?.landline?.code,
                      number: eduDetail?.branchProfile?.landline?.number,
                  },
              },
            };
          });
    
          reset({
            BranchDetails: formattedBranchData,
          });
        }
      }, [clientData, reset]);

      
    const onSubmit = (data) => {
    

    
            const payload = {

                "companyId": clientData?.data?.companyId,
                "directorId": "",
                "branchId": clientData?.data?.branchId,
                "clientId": clientData?.data?._id,
                "type": "Branch",
                "branchArr": data?.BranchDetails?.map((owner) =>{
                   return {
                    "_id": owner?._id,
                        "fullName": owner?.fullName,
                        "userType": "clientBranch",
                        "password": "",
                        "email": owner?.email,
                        "mobile": {
                            "code": owner?.mobile?.code,
                            "number": owner?.mobile?.number
                        },
                        
                        "branchProfile": {
                            "secondaryEmail": "",
                            "secondaryMobile": {
                                "code": "",
                                "number": ""
                            },
                            "landline": {
                                "code": null,
                                "number": null
                            },
                            GSTNumber: owner?.gst,
                        },
                        // "generalInfo": {
                        //     "gender": '',
                        //     "dateOfBirth": '',
                        //     "maritalStatus": '',
                        // },
                        "addresses": {
                            "primary": {
                                "street": owner?.addresses?.street,
                                "city": owner?.addresses?.city,
                                "state": owner?.addresses?.state,
                                "country": owner?.addresses?.country,
                                "pinCode": owner?.addresses?.pinCode
                            },
                            "secondary": {
                                "street": "",
                                "city": "",
                                "state": "",
                                "country": "",
                                "pinCode": ""
                            },
                            "location": {
                                "latitude": 0,
                                "longitude": 0,
                                "address": ""
                            }
                        }
                    }
                }
                ),

            }

            dispatch(updateService(payload)).then((res)=>{
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
            removeBranch(index)
        }
     }
 
    
    return (
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <>
                {branchDetails.map((item, index) => (
                    <div key={item.id} className="border border-gray-300 rounded-md my-2">
                        <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                            <div className="px-3 py-2 text-white font-semibold">Branch {index + 1}</div>
                            {index !== 0 && <button
                                type="button"
                                onClick={() =>deleteData(item, index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <AiFillDelete size={20} className="m-2" />
                            </button>}

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                            <div>
                                <label className={`${inputLabelClassName}`}>
                                    Full Name <span className="text-red-600">*</span>
                                </label>
                                <input
                                placeholder="Full Name"
                                    {...register(`BranchDetails.${index}.fullName`, { required: "Full Name is required" })}
                                    defaultValue={item.fullName}
                                    className={`${inputClassName} ${errors?.BranchDetails?.[index]?.fullName ? "border-[1px] " : "border-gray-300"}`}
                                />
                                {errors?.BranchDetails?.[index]?.fullName && (
                                    <p className="text-red-500 text-sm">
                                        {errors.BranchDetails[index].fullName.message}
                                    </p>
                                )}
                            </div>



                            <div>
                                <label className={`${inputLabelClassName}`}>
                                    Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                placeholder="Email"
                                    {...register(`BranchDetails.${index}.email`, {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email address",
                                        },
                                    })}
                                    defaultValue={item.email}
                                    className={`${inputClassName} ${errors?.BranchDetails?.[index]?.email ? "border-[1px] " : "border-gray-300"}`}
                                />
                                {errors?.BranchDetails?.[index]?.email && (
                                    <p className="text-red-500 text-sm">
                                        {errors.BranchDetails[index].email.message}
                                    </p>
                                )}
                            </div>


                            <div>
                                <label className={`${inputLabelClassName}`}>
                                    Mobile <span className="text-red-600">*</span>
                                </label>

                                <div className="flex gap-2">
                                    <div className="w-[150px]">
                                        <Controller
                                            control={control}
                                            name={`BranchDetails.${index}.mobile.code`}
                                            rules={{ required: "code is required" }}
                                            render={({ field }) => (
                                                <CustomMobileCodePicker
                                                field={field}
                                                  errors={errors} 
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="w-full"><input
                                        type="number"
                                        {...register(`BranchDetails.${index}.mobile.number`, {
                                            required: "Mobile number is required",

                                            minLength: {
                                                value: 10,
                                                message: "Must be exactly 10 digits",
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: "Must be exactly 10 digits",
                                            },
                                        })}
                                        maxLength={10}
                                        onInput={(e) => {
                                            if (e.target.value.length > 10) {
                                                e.target.value = e.target.value.slice(0, 10);
                                            }
                                        }}
                                        placeholder="Number"
                                        className={`${inputClassName} ${errors?.BranchDetails?.[index]?.mobile?.number ? "border-[1px] " : "border-gray-300"}`}
                                    />

                                    </div>


                                </div>
                                <div className="flex gap-3">
                                    {errors?.BranchDetails?.[index]?.mobile?.code && (
                                        <p className="text-red-500 text-sm">
                                            {errors.BranchDetails[index].mobile.code.message}
                                        </p>
                                    )}
                                    {errors?.BranchDetails?.[index]?.mobile?.number && (
                                        <p className="text-red-500 text-sm">
                                            {errors.BranchDetails[index].mobile.number.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="">
                      <label className={`${inputLabelClassName}`}>
                        GST Number 
                      </label>
                      <input
                        type="text"
                        {...register(`BranchDetails.${index}.gst`, {
                          // required: "GST Number is required",
                          pattern: {
                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                            message: "Invalid GST Number format (29AAACH7409R1ZX)",
                          },

                        })}
                        className={` ${inputClassName} ${errors.BranchDetails?.[index]?.gst ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Enter GST Number"
                        maxLength={15}
                      />
                      {errors.BranchDetails?.[index]?.gst && (
                        <p className="text-red-500 text-sm">
                          {errors.BranchDetails?.[index]?.gst.message}
                        </p>
                      )}
                    </div>
                            
                            {/* <div>
                                <label className={`${inputLabelClassName}`}>
                                    Landline
                                </label>
                                <div className="flex gap-2">
                                    <div className="w-[150px]">
                                        <Controller
                                            control={control}
                                            name={`BranchDetails.${index}.branchProfile.landline.code`}
                                        
                                            render={({ field }) => (
                                                <CustomMobileCodePicker
                                                field={field}
                                                  errors={errors} 
                                                />
                                            )}
                                        /> </div>
                                    <div className="w-full">
                                        <input
                                            type="number"
                                            {...register(`BranchDetails.${index}.branchProfile.landline.number`,{
                                                minLength: {
                                                    value: 10,
                                                    message: "Must be exactly 10 digits",
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: "Must be exactly 10 digits",
                                                },
                                            })}
                                            maxLength={10}
                                            onInput={(e) => {
                                                if (e.target.value.length > 10) {
                                                    e.target.value = e.target.value.slice(0, 10);
                                                }
                                            }}
                                            placeholder="Number"
                                            className={`${inputClassName} ${errors?.BranchDetails?.[index]?.branchProfile?.landline?.number ? "border-[1px] " : "border-gray-300"}`}
                                        />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                            <div className="col-span-2">
                                <label className={`${inputLabelClassName}`}>
                                    Primary Address<span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    {...register(`BranchDetails.${index}.addresses.street`, {
                                        required: "Primary Address is required",
                                    })}
                                    className={`${inputClassName} ${errors.BranchDetails?.[index]?.addresses?.street ? "border-[1px] " : "border-gray-300"}`}
                                    placeholder="Enter Primary Address"
                                />
                                {errors.BranchDetails?.[index]?.addresses?.street && (
                                    <p className="text-red-500 text-sm">
                                        {errors.BranchDetails?.[index]?.addresses?.street.message}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">

                            <div>
                                <div className={`${inputLabelClassName}`}>
                                    Country <span className="text-red-600">*</span>
                                </div>
                                <Controller
                                    control={control}
                                    name={`BranchDetails.${index}.addresses.country`}
                                    rules={{ required: "Country is required" }}
                                    render={({ field }) => (
                                        <AutoComplete
                                            {...field}
                                            onChange={(value) => field.onChange(value)} // Handle country change
                                            className="w-full"
                                            options={sortByPropertyAlphabetically(countryListData?.docs)?.map((type) => ({
                                                value: type?.name,
                                            }))}
                                            notFoundContent={countryListLoading && <ListLoader/>}
                                        >
                                            <input
                                                placeholder="Enter Country"
                                                onFocus={() => {
                                                    dispatch(
                                                        countrySearch({
                                                            isPagination: false,
                                                            text: "",
                                                            sort: true,
                                                            status: true,
                                                        })
                                                    );
                                                }}
                                                className={`${inputClassName} ${errors.BranchDetails?.[index]?.addresses?.country
                                                    ? "border-[1px] "
                                                    : "border-gray-300"
                                                    }`}
                                            />
                                        </AutoComplete>
                                    )}
                                />
                                {errors.BranchDetails?.[index]?.addresses?.country && (
                                    <p className={`${inputerrorClassNameAutoComplete}`}>
                                        {errors.BranchDetails[index].addresses.country.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <div className={`${inputLabelClassName}`}>
                                    State <span className="text-red-600">*</span>
                                </div>
                                <Controller
                                    control={control}
                                    name={`BranchDetails.${index}.addresses.state`}
                                    rules={{ required: "State is required" }}
                                    render={({ field }) => (
                                        <AutoComplete
                                            {...field}
                                            onChange={(value) => field.onChange(value)} // Handle state change
                                            className="w-full"
                                            options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
                                                value: type?.name,
                                            }))}
                                            notFoundContent={<ListLoader/>}
                                        >
                                            <input
                                                placeholder="Enter State"
                                                onFocus={() => {
                                                    dispatch(
                                                        stateSearch({
                                                            isPagination: false,
                                                            text: "",
                                                            countryName: watch(`BranchDetails.${index}.addresses.country`),
                                                            sort: true,
                                                            status: true,
                                                        })
                                                    );
                                                }}
                                                className={`${inputClassName} ${errors.BranchDetails?.[index]?.addresses?.state
                                                    ? "border-[1px] "
                                                    : "border-gray-300"
                                                    }`}
                                            />
                                        </AutoComplete>
                                    )}
                                />
                                {errors.BranchDetails?.[index]?.addresses?.state && (
                                    <p className={`${inputerrorClassNameAutoComplete}`}>
                                        {errors.BranchDetails[index].addresses.state.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className={`${inputLabelClassName}`}>
                                    City <span className="text-red-600">*</span>
                                </div>
                                <Controller
                                    control={control}
                                    name={`BranchDetails.${index}.addresses.city`}
                                    rules={{ required: "City is required" }}
                                    render={({ field }) => (
                                        <AutoComplete
                                            {...field}
                                            onChange={(value) => field.onChange(value)} // Handle city change
                                            className="w-full"
                                            options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                                                value: type?.name,
                                            }))}
                                            notFoundContent={<ListLoader/>}
                                        >
                                            <input
                                                placeholder="Enter City"
                                                onFocus={() => {
                                                    dispatch(
                                                        citySearch({
                                                            isPagination: false,
                                                            text: "",
                                                            sort: true,
                                                            status: true,
                                                            stateName: watch(`BranchDetails.${index}.addresses.state`),
                                                        })
                                                    );
                                                }}
                                                className={`${inputClassName} ${errors.BranchDetails?.[index]?.addresses?.city
                                                    ? "border-[1px] "
                                                    : "border-gray-300"
                                                    }`}
                                            />
                                        </AutoComplete>
                                    )}
                                />
                                {errors.BranchDetails?.[index]?.addresses?.city && (
                                    <p className={`${inputerrorClassNameAutoComplete}`}>
                                        {errors.BranchDetails[index].addresses.city.message}
                                    </p>
                                )}
                            </div>
                            {/* Pin Code Field */}
                            <div>
                                <label className={`${inputLabelClassName}`}>
                                    Pin Code <span className="text-red-600">*</span>
                                </label>
                                <Controller
                                    control={control}
                                    name={`BranchDetails.${index}.addresses.pinCode`}
                                    rules={{ required: "Pin Code is required" }}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="number"
                                            placeholder="Enter Pin Code"
                                            maxLength={6}
                                            onInput={(e) => {
                                                if (e.target.value.length > 6) {
                                                    e.target.value = e.target.value.slice(0, 6);
                                                }
                                            }}
                                            className={`${inputClassName} ${errors.BranchDetails?.[index]?.addresses?.pinCode
                                                ? "border-[1px] "
                                                : "border-gray-300"
                                                }`}
                                        />
                                    )}
                                />
                                {errors.BranchDetails?.[index]?.addresses?.pinCode && (
                                    <p className="text-red-500 text-sm">
                                        {errors.BranchDetails[index].addresses.pinCode.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex gap-2 justify-between items-center my-2">
                    <button
                        type="button"
                        onClick={() => appendBranch({
                            fullName: "",
                            userType: "clientBranch",

                            email: "",
                            mobile: { code: "", number: "" },
                            directorProfile: {
                                isShareLoginDetails: false,
                                secondaryEmail: "",
                                secondaryMobile: [{ code: "", number: "" }],
                                landline: { code: "", number: "" }
                            },
                            addresses: { street: "", city: "", state: "", country: "", pinCode: "" }
                        })}
                        className="bg-header px-2 py-2 text-sm rounded-md text-white"
                    >
                        Add New Branch
                    </button>

                    <button type="submit" className="bg-header px-2 py-2 text-sm rounded-md text-white">
                        Submit
                    </button></div>
            </>
        </form>
    )
}

export default BranchDetails
