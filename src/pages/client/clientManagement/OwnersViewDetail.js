// import { AutoComplete, Input } from "antd";
// import { Controller, useFieldArray, useForm } from "react-hook-form";
// import { inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName } from "../../../constents/global";
// import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
// import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
// import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
// import { AiFillDelete } from "react-icons/ai";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { deleteService, updateOwner, updateService } from "./clientFeatures/_client_reducers";
// import moment from "moment";

// function OwnersViewDetail({ clientDataParent , fetchData }) {
//     const dispatch = useDispatch();
//     const {
//         register,
//         control,
//         handleSubmit,
//         reset,

//         watch,
//         formState: { errors },
//     } = useForm({
//         defaultValues: {
//             clientData: [{
//                 fullName: "",
//                 userType: "clientBranch",
//                 password: "",
//                 email: "",
//                 mobile: { code: "", number: "" },
//                 directorProfile: {
//                     isShareLoginDetails: false,
//                     secondaryEmail: "",
//                     secondaryMobile: [{ code: "", number: "" }],
//                     landline: { code: "", number: "" }
//                 },
//                 generalInfo: {
//                     gender: "",
//                     dateOfBirth: "",
//                     maritalStatus: ""
//                 },
//                 addresses: { street: "", city: "", state: "", country: "", pinCode: "" }
//             }],
//         },
//     });


//     const { countryListData } = useSelector((state) => state.country);
//     const { stateListData } = useSelector((state) => state.states);
//     const { cityListData } = useSelector((state) => state.city);
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "clientData"
//     });

//     useEffect(() => {
//         if (clientDataParent?.data?.ownerData && clientDataParent?.data?.ownerData?.length > 0) {

//             reset({
//                 clientData: [] 
//             });
//             clientDataParent?.data?.ownerData?.forEach((eduDetail, index) => {
//                 const formattedEduDetail = {
//                     _id: eduDetail?._id,
//                     fullName: eduDetail?.fullName,
//                     userType: "clientOwner",

//                     email: eduDetail?.email,
//                     mobile: {
//                         code: eduDetail?.mobile?.code,
//                         number: eduDetail?.mobile?.number,
//                     },
//                     landline: {
//                         code: eduDetail?.directorProfile?.landline?.code,  
//                     },
//                     directorProfile: {
//                         isShareLoginDetails: eduDetail?.directorProfile?.isShareLoginDetails,
//                         secondaryEmail: "",
//                         secondaryMobile: {
//                             code: "",
//                             number: "",
//                         },
//                         landline: {
//                             code: eduDetail?.directorProfile?.landline?.code,
//                             number: eduDetail?.directorProfile?.landline?.number,
//                         },
//                     },
//                     generalInfo: {
//                         gender: eduDetail?.generalInfo?.gender,
//                         dateOfBirth: moment(eduDetail?.generalInfo?.dateOfBirth).format("YYYY-MM-DD"),
//                         maritalStatus: eduDetail?.generalInfo?.maritalStatus,
//                     },
//                     addresses: {
//                         street: eduDetail?.addresses?.primary?.street,
//                         city: eduDetail?.addresses?.primary?.city,
//                         state: eduDetail?.addresses?.primary?.state,
//                         country: eduDetail?.addresses?.primary?.country,
//                         pinCode: eduDetail?.addresses?.primary?.pinCode,
//                         secondary: {
//                             street: "",
//                             city: "",
//                             state: "",
//                             country: "",
//                             pinCode: "",
//                         },
//                         location: {
//                             latitude: 0,
//                             longitude: 0,
//                             address: "",
//                         },
//                     },
//                 };
//                 append(formattedEduDetail); // Append the formatted data
//             });
//         }
//     }, [clientDataParent, reset, append]); // Added reset and append dependencies for completeness
    

//     const onSubmit = (data) => {
    
//         const payload = {
//             "companyId": clientDataParent?.data?.companyId,
//             "directorId": "",
//             "branchId": clientDataParent?.data?.branchId,
//             "clientId": clientDataParent?.data?._id,
//             "type": "owner",
//             "ownerArr": data?.clientData?.map((owner) => {
//                 return {
//                     "_id": owner?._id,
//                     "fullName": owner?.fullName,
//                     "userType": "clientOwner",
//                     "password": !owner?._id ? owner?.directorProfile?.isShareLoginDetails === "true" ? owner?.password : "" : null,
//                     "email": owner?.email,
//                     "mobile": {
//                         "code": owner?.mobile?.code,
//                         "number": owner?.mobile?.number
//                     },
          
//                     "directorProfile": {
//                         "isShareLoginDetails": !owner?._id ? owner?.directorProfile?.isShareLoginDetails: null,
//                         "secondaryEmail": "",
//                         "secondaryMobile": {
//                             "code": "",
//                             "number": ""
//                         },
//                         "landline": {
//                             "code": owner?.landline?.code,
//                             "number": owner?.directorProfile.landline?.number
//                         }
//                     },
//                     "generalInfo": {
//                         "gender": owner?.generalInfo?.gender,
//                         "dateOfBirth": owner?.generalInfo?.dateOfBirth,
//                         "maritalStatus": owner?.generalInfo?.maritalStatus,
//                     },
//                     "addresses": {
//                         "primary": {
//                             "street": owner?.addresses?.street,
//                             "city": owner?.addresses?.city,
//                             "state": owner?.addresses?.state,
//                             "country": owner?.addresses?.country,
//                             "pinCode": owner?.addresses?.pinCode
//                         },
//                         "secondary": {
//                             "street": "",
//                             "city": "",
//                             "state": "",
//                             "country": "",
//                             "pinCode": ""
//                         },
//                         "location": {
//                             "latitude": 0,
//                             "longitude": 0,
//                             "address": ""
//                         }
//                     }
//                 };
//             })
//         };
    
//         dispatch(updateService(payload)).then((res)=>{
//             if(!res?.error){
//                 fetchData()
//             }
//         })
//     };


//     const deleteData = (data , index)=>{
//        if(data?._id){
//        dispatch( deleteService({
//             _id:data?._id
//         })).then((res)=>{
//             if(!res?.error){
//                 fetchData()
//             }
//         })
//        }  else {
//         remove(index)
//        }
//     }
    
//     return (
//         <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
//             <>
//                 {fields.map((item, index) => (
//                     <div key={item.id} className="border border-gray-300 rounded-md my-2">
//                         <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">

                            
// <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
//                         <thead>
//                           <tr>
//                             <th className="text-header ">
//                               <div className="mt-2 ml-2">
//                                 Personal Information
//                               </div>
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody className="text-sm text-gray-700">
//                           {/* Company Name Row */}
//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3 text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaRegBuilding className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Full Name
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.fullName || "N/A"}
//                               </span>
//                             </td>

//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <AiOutlineTags className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Date of Birth
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {moment(
//                                   clientDetailsData?.data?.clientProfile
//                                     ?.dateOfBirth
//                                 )?.format("YYYY-MM-DD") || "N/A"}
//                               </span>
//                             </td>
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <AiOutlineTags className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Date of Joining
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {moment(clientDetailsData?.data?.clientProfile?.dateOfJoining)?.format("YYYY-MM-DD")}
//                               </span>
//                             </td>
//                           </tr>

//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaPeopleGroup className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Organization Type
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.organizationId
//                                   ? orgTypeList?.find(
//                                       (element) =>
//                                         element?._id ===
//                                         clientDetailsData?.data?.organizationId
//                                     )?.name || "N/A"
//                                   : "N/A"}
//                               </span>
//                             </td>

//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaIndustry className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Industry Type
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                               {clientDetailsData?.data?.industryId
//                                   ? industryListData?.find(
//                                       (element) =>
//                                         element?._id ===
//                                       clientDetailsData?.data?.industryId
//                                     )?.name || "N/A"
//                                   : "N/A"}
//                               </span>
//                             </td>
//                           </tr>
//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaRegAddressCard className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Email
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.email}
//                               </span>
//                             </td>

//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <AiOutlineMail className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Mobile
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.mobile?.code}
//                                 {clientDetailsData?.data?.mobile?.number}
//                               </span>
//                             </td>
//                           </tr>

//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaRegAddressCard className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Primary Address
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {
//                                   clientDetailsData?.data?.addresses?.primary
//                                     ?.street
//                                 }
//                                 {clientDetailsData?.data?.addresses?.primary
//                                   ?.city || "N/A"}
//                                 ,{" "}
//                                 {clientDetailsData?.data?.addresses?.primary
//                                   ?.state || "N/A"}
//                                 ,
//                                 {clientDetailsData?.data?.addresses?.primary
//                                   ?.country || "N/A"}
//                                 ,{" "}
//                                 {clientDetailsData?.data?.addresses?.primary
//                                   ?.pinCode || "N/A"}
//                               </span>
//                             </td>
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaRegAddressCard className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Secondary Address
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {
//                                   clientDetailsData?.data?.addresses?.secondary
//                                     ?.street
//                                 }
//                                 {clientDetailsData?.data?.addresses?.secondary
//                                   ?.city || "N/A"}
//                                 ,{" "}
//                                 {clientDetailsData?.data?.addresses?.secondary
//                                   ?.state || "N/A"}
//                                 ,
//                                 {clientDetailsData?.data?.addresses?.secondary
//                                   ?.country || "N/A"}
//                                 ,{" "}
//                                 {clientDetailsData?.data?.addresses?.secondary
//                                   ?.pinCode || "N/A"}
//                               </span>
//                             </td>
//                           </tr>

//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaPhoneAlt className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   {" "}
//                                   Gst Number
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.clientProfile
//                                   ?.GSTNumber || "N/A"}{" "}
//                               </span>
//                             </td>
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaPhoneAlt className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   {" "}
//                                   Landline Number
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.clientProfile
//                                   ?.landline?.code || "N/A"}{" "}
//                                 {clientDetailsData?.data?.clientProfile
//                                   ?.landline?.number || "N/A"}{" "}
//                               </span>
//                             </td>
//                           </tr>

//                           <tr className=" hover:bg-indigo-50">
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <FaPhoneAlt className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   {" "}
//                                   PAN Number
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.clientProfile
//                                   ?.penNumber || "N/A"}{" "}
//                               </span>
//                             </td>
//                             <td className="p-3  text-gray-600">
//                               <div className="flex items-center gap-2">
//                                 <AiOutlineMail className="size-4 text-header text-lg" />
//                                 <span className="text-[16px] font-medium">
//                                   Aadhar Number
//                                 </span>
//                               </div>
//                               <span className="block text-[15px] ml-4 font-light mt-1">
//                                 {clientDetailsData?.data?.clientProfile
//                                   ?.adharNumber || "N/A"}
//                               </span>
//                             </td>
//                           </tr>
//                         </tbody>
//                       </table>


//                             <div className="px-3 py-2 text-white font-semibold">Owner {index + 1}</div>
//                             {index !== 0 && <button
//                                 type="button"
//                                 onClick={() =>deleteData(item, index)}
//                                 className="text-red-600 hover:text-red-800"
//                             >
//                                 <AiFillDelete size={20} className="m-2" />
//                             </button>}

//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Full Name <span className="text-red-600">*</span>
//                                 </label>
//                                 <input
//                                     {...register(`clientData.${index}.fullName`, { required: "Full Name is required" })}
                              
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.fullName ? "border-[1px] " : "border-gray-300"}`}
//                                 />
//                                 {errors?.clientData?.[index]?.fullName && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].fullName.message}
//                                     </p>
//                                 )}
//                             </div>
//                           {!item?._id &&   <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Share Login Details
//                                 </label>
//                                 <select
//                                     {...register(`clientData.${index}.directorProfile.isShareLoginDetails`)}
                                
//                                     className={`${inputClassName}`}
//                                 >
//                                     <option value="true">Yes</option>
//                                     <option value="false">No</option>
//                                 </select>
//                             </div>}


//                             {watch(`clientData.${index}.directorProfile.isShareLoginDetails`) === "true" && !item?._id &&  <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Password <span className="text-red-600">*</span>
//                                 </label>
//                                 <input
//                                     type="password"
//                                     {...register(`clientData.${index}.password`, { required: "Password is required" })}
                                 
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.password ? "border-[1px] " : "border-gray-300"}`}
//                                 />
//                                 {errors?.clientData?.[index]?.password && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].password.message}
//                                     </p>
//                                 )}
//                             </div>}


//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Email <span className="text-red-600">*</span>
//                                 </label>
//                                 <input
//                                     {...register(`clientData.${index}.email`, {
//                                         required: "Email is required",
//                                         pattern: {
//                                             value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                                             message: "Invalid email address",
//                                         },
//                                     })}
                            
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.email ? "border-[1px] " : "border-gray-300"}`}
//                                 />
//                                 {errors?.clientData?.[index]?.email && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].email.message}
//                                     </p>
//                                 )}
//                             </div>


//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Mobile <span className="text-red-600">*</span>
//                                 </label>

//                                 <div className="flex gap-2">
//                                     <div className="w-[150px]">
//                                         <Controller
//                                             control={control}
//                                             name={`clientData.${index}.mobile.code`}
//                                             rules={{ required: "code is required" }}
//                                             render={({ field }) => (
//                                                 <AutoComplete
//                                                     {...field}
//                                                     onChange={(value) => field.onChange(value)}
//                                                     options={countryListData?.docs?.map((type) => ({
//                                                         value: type?.countryMobileNumberCode,
//                                                     }))}
//                                                 >
//                                                     <input
//                                                         placeholder="Code"
//                                                         onFocus={() => {
//                                                             dispatch(
//                                                                 countrySearch({
//                                                                     isPagination: false,
//                                                                     text: "",

//                                                                     sort: true,
//                                                                     status: true,
//                                                                 })
//                                                             );
//                                                         }}
//                                                         className={`${inputClassName} ${errors.PDState
//                                                             ? "border-[1px] "
//                                                             : "border-gray-300"
//                                                             }`}
//                                                     />
//                                                 </AutoComplete>
//                                             )}
//                                         />
//                                     </div>
//                                     <div className="w-full"><input
//                                         type="number"
//                                         {...register(`clientData.${index}.mobile.number`, {
//                                             required: "Mobile number is required",

//                                             minLength: {
//                                                 value: 10,
//                                                 message: "Must be exactly 10 digits",
//                                             },
//                                             maxLength: {
//                                                 value: 10,
//                                                 message: "Must be exactly 10 digits",
//                                             },
//                                         })}
//                                         maxLength={10}
//                                         onInput={(e) => {
//                                             if (e.target.value.length > 10) {
//                                                 e.target.value = e.target.value.slice(0, 10);
//                                             }
//                                         }}
//                                         placeholder="Number"
//                                         className={`${inputClassName} ${errors?.clientData?.[index]?.mobile?.number ? "border-[1px] " : "border-gray-300"}`}
//                                     />

//                                     </div>


//                                 </div>
//                                 <div className="flex gap-3">
//                                     {errors?.clientData?.[index]?.mobile?.code && (
//                                         <p className="text-red-500 text-sm">
//                                             {errors.clientData[index].mobile.code.message}
//                                         </p>
//                                     )}
//                                     {errors?.clientData?.[index]?.mobile?.number && (
//                                         <p className="text-red-500 text-sm">
//                                             {errors.clientData[index].mobile.number.message}
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Landline
//                                 </label>
//                                 <div className="flex gap-2">
//                                     <div className="w-[150px]">
//                                         <Controller
//                                             control={control}
//                                             name={`clientData.${index}.landline.code`}
                                        
//                                             render={({ field }) => (
//                                                 <AutoComplete
//                                                     {...field}
//                                                     onChange={(value) => field.onChange(value)}
//                                                     options={countryListData?.docs?.map((type) => ({
//                                                         value: type?.countryMobileNumberCode,
//                                                     }))}
//                                                 >
//                                                     <input
//                                                         placeholder="Code"
//                                                         onFocus={() => {
//                                                             dispatch(
//                                                                 countrySearch({
//                                                                     isPagination: false,
//                                                                     text: "",

//                                                                     sort: true,
//                                                                     status: true,
//                                                                 })
//                                                             );
//                                                         }}
//                                                         className={`${inputClassName} ${errors.PDState
//                                                             ? "border-[1px] "
//                                                             : "border-gray-300"
//                                                             }`}
//                                                     />
//                                                 </AutoComplete>
//                                             )}
//                                         /> </div>
//                                     <div className="w-full">
//                                         <input
//                                             type="number"
//                                             {...register(`clientData.${index}.directorProfile.landline.number`,{
//                                                 minLength: {
//                                                     value: 10,
//                                                     message: "Must be exactly 10 digits",
//                                                 },
//                                                 maxLength: {
//                                                     value: 10,
//                                                     message: "Must be exactly 10 digits",
//                                                 },
//                                             })}
//                                             maxLength={10}
//                                             onInput={(e) => {
//                                                 if (e.target.value.length > 10) {
//                                                     e.target.value = e.target.value.slice(0, 10);
//                                                 }
//                                             }}
                                           
//                                             placeholder="Number"
//                                             className={`${inputClassName} ${errors?.clientData?.[index]?.directorProfile?.landline?.number ? "border-[1px] " : "border-gray-300"}`}
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Gender <span className="text-red-600">*</span>
//                                 </label>
//                                 <select
//                                     {...register(`clientData.${index}.generalInfo.gender`, { required: "Gender is required" })}
                                 
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.generalInfo?.gender ? "border-[1px] " : "border-gray-300"}`}
//                                 >
//                                     <option value="">Select Gender</option>
//                                     <option value="Male">Male</option>
//                                     <option value="Female">Female</option>
//                                     <option value="Other">Other</option>
//                                 </select>
//                                 {errors?.clientData?.[index]?.generalInfo?.gender && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].generalInfo.gender.message}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Date of Birth <span className="text-red-600">*</span>
//                                 </label>
//                                 <input
//                                     type="date"
//                                     {...register(`clientData.${index}.generalInfo.dateOfBirth`, { required: "Date of Birth is required" })}
                              
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.generalInfo?.dateOfBirth ? "border-[1px] " : "border-gray-300"}`}
//                                 />
//                                 {errors?.clientData?.[index]?.generalInfo?.dateOfBirth && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].generalInfo.dateOfBirth.message}
//                                     </p>
//                                 )}
//                             </div>
//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Marital Status <span className="text-red-600">*</span>
//                                 </label>
//                                 <select
//                                     {...register(`clientData.${index}.generalInfo.maritalStatus`, { required: "Marital Status is required" })}
                               
//                                     className={`${inputClassName} ${errors?.clientData?.[index]?.generalInfo?.maritalStatus ? "border-[1px] " : "border-gray-300"}`}
//                                 >
//                                     <option value="">Select Marital Status</option>
//                                     <option value="Single">Single</option>
//                                     <option value="Married">Married</option>
//                                     <option value="Divorced">Divorced</option>
//                                 </select>
//                                 {errors?.clientData?.[index]?.generalInfo?.maritalStatus && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].generalInfo.maritalStatus.message}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
//                       <div className="col-span-2">
//                         <label className={`${inputLabelClassName}`}>
//                           Primary Address<span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           {...register(`clientData.${index}.addresses.street`, {
//                             required: "Primary Address is required",
//                           })}
//                           className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.street ? "border-[1px] " : "border-gray-300"}`}
//                           placeholder="Enter Primary Address"
//                         />
//                         {errors.clientData?.[index]?.addresses?.street && (
//                           <p className="text-red-500 text-sm">
//                             {errors.clientData?.[index]?.addresses?.street.message}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">

//                             <div>
//                                 <div className={`${inputLabelClassName}`}>
//                                     Country <span className="text-red-600">*</span>
//                                 </div>
//                                 <Controller
//                                     control={control}
//                                     name={`clientData.${index}.addresses.country`}
//                                     rules={{ required: "Country is required" }}
//                                     render={({ field }) => (
//                                         <AutoComplete
//                                             {...field}
//                                             onChange={(value) => field.onChange(value)} // Handle country change
//                                             className="w-full"
//                                             options={countryListData?.docs?.map((type) => ({
//                                                 value: type?.name,
//                                             }))}
//                                         >
//                                             <input
//                                                 placeholder="Enter Country"
//                                                 onFocus={() => {
//                                                     dispatch(
//                                                         countrySearch({
//                                                             isPagination: false,
//                                                             text: "",
//                                                             sort: true,
//                                                             status: true,
//                                                         })
//                                                     );
//                                                 }}
//                                                 className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.country
//                                                     ? "border-[1px] "
//                                                     : "border-gray-300"
//                                                     }`}
//                                             />
//                                         </AutoComplete>
//                                     )}
//                                 />
//                                 {errors.clientData?.[index]?.addresses?.country && (
//                                     <p className={`${inputerrorClassNameAutoComplete}`}>
//                                         {errors.clientData[index].addresses.country.message}
//                                     </p>
//                                 )}
//                             </div>
//                             <div>
//                                 <div className={`${inputLabelClassName}`}>
//                                     State <span className="text-red-600">*</span>
//                                 </div>
//                                 <Controller
//                                     control={control}
//                                     name={`clientData.${index}.addresses.state`}
//                                     rules={{ required: "State is required" }}
//                                     render={({ field }) => (
//                                         <AutoComplete
//                                             {...field}
//                                             onChange={(value) => field.onChange(value)} // Handle state change
//                                             className="w-full"
//                                             options={stateListData?.docs?.map((type) => ({
//                                                 value: type?.name,
//                                             }))}
//                                         >
//                                             <input
//                                                 placeholder="Enter State"
//                                                 onFocus={() => {
//                                                     dispatch(
//                                                         stateSearch({
//                                                             isPagination: false,
//                                                             text: "",
//                                                             countryName: watch(`clientData.${index}.addresses.country`),
//                                                             sort: true,
//                                                             status: true,
//                                                         })
//                                                     );
//                                                 }}
//                                                 className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.state
//                                                     ? "border-[1px] "
//                                                     : "border-gray-300"
//                                                     }`}
//                                             />
//                                         </AutoComplete>
//                                     )}
//                                 />
//                                 {errors.clientData?.[index]?.addresses?.state && (
//                                     <p className={`${inputerrorClassNameAutoComplete}`}>
//                                         {errors.clientData[index].addresses.state.message}
//                                     </p>
//                                 )}
//                             </div>

//                             <div>
//                                 <div className={`${inputLabelClassName}`}>
//                                     City <span className="text-red-600">*</span>
//                                 </div>
//                                 <Controller
//                                     control={control}
//                                     name={`clientData.${index}.addresses.city`}
//                                     rules={{ required: "City is required" }}
//                                     render={({ field }) => (
//                                         <AutoComplete
//                                             {...field}
//                                             onChange={(value) => field.onChange(value)} // Handle city change
//                                             className="w-full"
//                                             options={cityListData?.docs?.map((type) => ({
//                                                 value: type?.name,
//                                             }))}
//                                         >
//                                             <input
//                                                 placeholder="Enter City"
//                                                 onFocus={() => {
//                                                     dispatch(
//                                                         citySearch({
//                                                             isPagination: false,
//                                                             text: "",
//                                                             sort: true,
//                                                             status: true,
//                                                             stateName: watch(`clientData.${index}.addresses.state`),
//                                                         })
//                                                     );
//                                                 }}
//                                                 className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.city
//                                                     ? "border-[1px] "
//                                                     : "border-gray-300"
//                                                     }`}
//                                             />
//                                         </AutoComplete>
//                                     )}
//                                 />
//                                 {errors.clientData?.[index]?.addresses?.city && (
//                                     <p className={`${inputerrorClassNameAutoComplete}`}>
//                                         {errors.clientData[index].addresses.city.message}
//                                     </p>
//                                 )}
//                             </div>

//                             {/* Pin Code Field */}
//                             <div>
//                                 <label className={`${inputLabelClassName}`}>
//                                     Pin Code <span className="text-red-600">*</span>
//                                 </label>
//                                 <Controller
//                                     control={control}
//                                     name={`clientData.${index}.addresses.pinCode`}
//                                     rules={{ required: "Pin Code is required" }}
//                                     render={({ field }) => (
//                                         <input
//                                             {...field}
//                                             type="number"
//                                             placeholder="Enter Pin Code"
//                                             maxLength={6}
//                                             onInput={(e) => {
//                                                 if (e.target.value.length > 6) {
//                                                     e.target.value = e.target.value.slice(0, 6);
//                                                 }
//                                             }}
//                                             className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.pinCode
//                                                 ? "border-[1px] "
//                                                 : "border-gray-300"
//                                                 }`}
//                                         />
//                                     )}
//                                 />
//                                 {errors.clientData?.[index]?.addresses?.pinCode && (
//                                     <p className="text-red-500 text-sm">
//                                         {errors.clientData[index].addresses.pinCode.message}
//                                     </p>
//                                 )}
//                             </div>



//                         </div>
//                     </div>
//                 ))}


//                 <div className="flex gap-2 justify-between items-center my-2">
//                     <button
//                         type="button"
//                         onClick={() => append({
//                             fullName: "",
//                             userType: "clientBranch",
//                             password: "",
//                             email: "",
//                             mobile: { code: "", number: "" },
//                             directorProfile: {
//                                 isShareLoginDetails: false,
//                                 secondaryEmail: "",
//                                 secondaryMobile: [{ code: "", number: "" }],
//                                 landline: { code: "", number: "" }
//                             },
//                             generalInfo: {
//                                 gender: "",
//                                 dateOfBirth: "",
//                                 maritalStatus: ""
//                             },
//                             addresses: { street: "", city: "", state: "", country: "", pinCode: "" }
//                         })}
//                         className="bg-header px-2 py-2 text-sm rounded-md text-white"
//                     >
//                         Add New Client
//                     </button>

//                     <button type="submit" className="bg-header px-2 py-2 text-sm rounded-md text-white">
//                         Submit
//                     </button></div>
//             </>
//         </form>
//     )
// }

// export default OwnersViewDetail
