// import { useForm } from "react-hook-form";
// import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { decrypt } from "../../config/Encryption";
// import { useEffect } from "react";
// import { getCityById, updateCityData } from "../../redux/_reducers/_city_reducers";
// import { getCountryListFunc } from "../../redux/_reducers/_country_reducers";
// import { getStateList } from "../../redux/_reducers/_state_reducers";


// function UpdateCity() {
//   const { register, handleSubmit, setValue, formState: { errors } } = useForm();

//   const { countryListData } = useSelector((state) => state.country);
//   const { stateListData } = useSelector((state) => state.state);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { cityEnc } = useParams();
//   const cityId = decrypt(cityEnc);
//   const { cityByIdData } = useSelector((state) => state.city);



//   useEffect(() => {
//     let reqData = {
//       id: cityId,
//     };
//     dispatch(getCityById(reqData));
//     dispatch(getCountryListFunc(reqData));
//   }, []);

//   useEffect(() => {
//     if (cityByIdData) {
//       setValue("countryName", cityByIdData?.countryName);
//       setValue("countryId", cityByIdData?.countryId);
//       setValue("stateName", cityByIdData?.stateName);
//       setValue("stateId", cityByIdData?.stateId);
//       setValue("cityName", cityByIdData?.cityName);
//     }
//   }, [cityByIdData, setValue]);

//   const onSubmit = (data) => {
//     const finalPayload = {
//       "id": cityId,
//       "stateName": data?.stateName,
//       "stateCode": data?.stateCode,
//       "countryName": data?.countryName,
//       "countryId": data?.countryId,
//       "igstStatus": false,
//       "gstStatus": false,
//       "isActive": false
//     }

//     dispatch(updateCityData(finalPayload)).then((data) => {
//       if (!data.error) navigate("/admin/cityList");
//     });
//   };

//   const handleSelectCountry = (event) => {


//     if (!event.target.value || !event.target.value.includes("-")) {
//       console.error("Invalid value format:", event.target.value);
//       return;
//     }

//     const [countryId, countryName] = event.target.value.split("-");


//     setValue("countryId", countryId);
//     setValue("countryName", countryName);

//     setValue("stateId", "");
//     setValue("stateName", "");
//     dispatch(getStateList({ countryId }));
//   };

//   const handleSelectState = (event) => {


//     if (!event.target.value || !event.target.value.includes("-")) {
//       console.error("Invalid value format:", event.target.value);
//       return;
//     }

//     const [stateId, stateName] = event.target.value.split("-");


//     setValue("stateId", stateId);
//     setValue("stateName", stateName);
//   };

//   return (
//     <GlobalLayout>
//       <div className="gap-4">
//         <h2 className="text-2xl font-bold mb-4 col-span-2">
//           Update States: {cityByIdData?.cityName}
//         </h2>
//         <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
//           <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
//             <div>
//               <label className="block text-sm font-medium">Country ID</label>
//               <select
//                 {...register("countryName", { required: "CountryId is required" })}
//                 onChange={handleSelectCountry}
//                 className={`mt-1 block w-full border ${errors._id ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
//               >
//                 <option value="">{cityByIdData.countryName}</option>
//                 {countryListData && countryListData.length > 0 ? (
//                   countryListData.map((element, index) => (
//                     <option key={index} value={`${element._id}-${element.countryName}`}>{element.countryName}</option>
//                   ))
//                 ) : null}
//               </select>
//               {errors._id && (
//                 <p className="text-red-500 text-sm">
//                   {errors._id.message}
//                 </p>
//               )}
//             </div>
//             <div>

//               <label className="block text-sm font-medium">State ID</label>
//               <select
//                 {...register("stateName", { required: "StateId is required" })}
//                 onChange={handleSelectState}
//                 className={`mt-1 block w-full border ${errors.stateId ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
//               >
//                 <option value="" className="text-red-900">{cityByIdData?.stateName}</option>
//                 {stateListData && stateListData.length > 0 ? (
//                   stateListData.map((element, index) => (
//                     <option key={index} value={`${element?._id}-${element?.stateName}`}>{element?.stateName}</option>))
//                 ) : null}
//               </select>
//               {errors._id && (
//                 <p className="text-red-500 text-sm">
//                   {errors._id.message}
//                 </p>
//               )}
//             </div>
//             <div className="">
//               <label className="block text-sm font-medium">Name</label>
//               <input
//                 type="text"
//                 {...register("cityName", {
//                   required: "City Name is required",
//                 })}
//                 className={`mt-1 block w-full border ${errors.cityName ? "border-[1px] " : "border-gray-300"
//                   } p-2 rounded`}
//                 placeholder="Enter City Name"
//               />
//               {errors.cityName && (
//                 <p className="text-red-500 text-sm">
//                   {errors.cityName.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Status</label>
//               <select
//                 {...register("isActive", {
//                   required: "Status is required",
//                 })}
//                 className={`mt-1 block w-full border bg-white ${errors.isActive ? "border-[1px] " : "border-gray-300"
//                   } p-2 rounded`}
//               >
//                 <option value="Active">Active</option>
//                 <option value="Not Active">Not Active</option>
//                 <option value="Deleted">Deleted</option>
//               </select>
//               {errors.isActive && (
//                 <p className="text-red-500 text-sm">
//                   {errors.isActive.message}
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="flex justify-end ">
//             <button
//               type="submit"
//               className="bg-header text-white p-2 px-4 rounded mt-4"
//             >
//               Submit
//             </button>
//           </div>
//         </form>
//       </div>
//     </GlobalLayout>
//   );
// }

// export default UpdateCity;



import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { getCityById, updateCityData } from "./CityFeatures/_city_reducers";
import { countrySearch, getCountryListFunc } from "../country/CountryFeatures/_country_reducers";
import { getStateList, stateSearch } from "../state/featureStates/_state_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../../constents/global";
import { Input, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


function UpdateCity() {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const { loading: cityLoading } = useSelector(state => state.city)
  const { countryListData, companyListLoading } = useSelector((state) => state.country);
  const { stateListData, loading: stateListLoading } = useSelector((state) => state.states);
  const { cityByIdData } = useSelector((state) => state.city);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cityEnc } = useParams();
  const cityId = decrypt(cityEnc);

  useEffect(() => {
    const countryReqData = {
      text: "",
      sort: true,
      status: true,
      isPagination: false
    };
    dispatch(countrySearch(countryReqData)).then((data) => {
      if (!data.error) dispatch(getCityById({ _id: cityId }));
    });

  }, [cityId, dispatch]);

  useEffect(() => {
    if (cityByIdData) {
      setValue("countryName", cityByIdData?.countryName);
      setValue("countryId", cityByIdData?.countryId);
      // setValue("stateName", cityByIdData?.stateName);
      setValue("stateId", cityByIdData?.stateId);
      setValue("cityName", cityByIdData?.name);
      setValue("status", cityByIdData?.status);
    }

    const stateReqData = {
      "text": "",
      "sort": true,
      "status": true,
      countryId: cityByIdData?.countryId,
      isPagination: false
    };
    dispatch(stateSearch(stateReqData));
  }, [cityByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: cityId,
      name: data.cityName,
      stateId: data.stateId,
      countryId: data.countryId,
      status: data?.status
    };

    dispatch(updateCityData(finalPayload)).then((result) => {
      if (!result.error) navigate(-1);
    });
  };

  const handleSelectCountry = (event) => {
    setValue("countryId", event.target.value);
    setValue("countryName", countryListData?.docs.find(element => element._id === event.target.value)?.name);
    setValue("stateId", "");
    setValue("stateName", "");
    handleCountryChange(event)
  };

  const handleCountryChange = async (event) => {
    const selectedCountryId = event.target.value;
    const stateReqData = {
      "text": "",
      "sort": true,
      "status": true,
      limit: "",
      page: 1,
      countryId: selectedCountryId
    };

    const response = await dispatch(getStateList(stateReqData));
    if (response?.payload?.length > 0) {
      const firstState = response.payload[0];
      setValue("stateId", firstState.stateId);
      setValue("stateName", firstState.stateName);
    } else {
      setValue("stateId", "");
      setValue("stateName", "");
    }
  };

  const handleSelectState = (event) => {
    setValue("stateId", event.target.value);
    setValue("stateName", stateListData?.docs?.find(element => element._id === event.target.value)?.name);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2 capitalize">
            {/* <div>
              <label className="block text-sm font-medium">Country ID</label>
              <select
                {...register("countryId", { required: "Country Name is required" })}
                onChange={handleSelectCountry}
                className={`mt-1 block w-full border ${errors.countryName ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
              >
                {countryListData?.docs?.map((element) => (
                  <option key={element._id} value={element._id}>
                    {element.name}
                  </option>
                ))}
              </select>
              {errors.countryName && (
                <p className="text-red-500 text-sm">{errors.countryName.message}</p>
              )}
            </div> */}


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Country Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="countryId"
                control={control}
                rules={{ required: "Country Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors._id ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Country Name"
                  >
                    {countryListData?.docs?.length > 0 &&
                      companyListLoading ? <Select.Option disabled>
                      <ListLoader /> </Select.Option> :
                      (sortByPropertyAlphabetically(countryListData?.docs).map((element) => (
                        <Select.Option key={element._id} value={element._id}>{element?.name}</Select.Option>
                      )))}
                  </Select>
                )}
              />
              {errors._id && (
                <p className="text-red-500 text-sm">
                  {errors._id.message}
                </p>
              )}
            </div>




            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                State Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="stateId"
                control={control}
                rules={{ required: "Country Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors._id ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Country Name"
                  >
                    {stateListData?.docs?.length > 0 &&
                      stateListLoading ? <Select.Option disabled>
                      <ListLoader /> </Select.Option> : (sortByPropertyAlphabetically(stateListData?.docs).map((element) => (
                        <Select.Option key={element._id} value={element._id}>{element.name}</Select.Option>
                      )))}
                  </Select>
                )}
              />
              {errors._id && (
                <p className="text-red-500 text-sm">
                  {errors._id.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium">State ID</label>
              <select
                {...register("stateId", { required: "State Name is required" })}
                onChange={handleSelectState}
                className={`mt-1 block w-full border ${errors.stateName ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
              >

                {stateListData?.docs?.map((element) => (
                  <option key={element._id} value={element._id}>
                    {element.name}
                  </option>
                ))}
              </select>
              {errors.stateName && (
                <p className="text-red-500 text-sm">{errors.stateName.message}</p>
              )}
            </div> */}


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>City Name <span className="text-red-600">*</span></label>
              <Controller
                name="cityName"
                control={control}
                rules={{ required: "City Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`${errors.cityName ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                    placeholder="Enter City Name"
                  />
                )}
              />
              {errors.cityName && (
                <p className="text-red-500 text-sm">{errors.cityName.message}</p>
              )}
            </div>

            {/* <div>
              <label className="block text-sm font-medium">City Name</label>
              <input
                type="text"
                {...register("cityName", { required: "City Name is required" })}
                className={`mt-1 block w-full border ${errors.cityName ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
                placeholder="Enter City Name"
              />
              {errors.cityName && (
                <p className="text-red-500 text-sm">{errors.cityName.message}</p>
              )}
            </div> */}



            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Status"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>Not Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>




          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={cityLoading}
              className={`${cityLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {cityLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default UpdateCity;
