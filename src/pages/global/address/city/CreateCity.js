import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { countrySearch, getCountryListFunc } from "../country/CountryFeatures/_country_reducers";
import { createCityFunc } from "./CityFeatures/_city_reducers";
import { getStateList, stateSearch } from "../state/featureStates/_state_reducers";
import { Input, Select } from "antd";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../../constents/global";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


function CreateCity() {
  const { loading: cityLoading } = useSelector(state => state.city)
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { countryListData, loading: countryListLoading } = useSelector((state) => state.country);
  const { stateListData, loading: stateListLoading } = useSelector((state) => state.states);


  const { cityListData } = useSelector((state) => state.city)
  useEffect(() => {
    const countryReqData = {
      text: "",
      sort: true,
      status: true,
      isPagination: false
    };

    dispatch(countrySearch(countryReqData));
  }, []);

  const onSubmit = (data) => {
    const finalPayload = {
      "name": data?.cityName,
      "countryId": data?.countryId,
      "stateId": data?.stateId,
    }


    dispatch(createCityFunc(finalPayload)).then((data) => {
      !data.error && navigate(-1);
    });
  }

  const handleSelectCountry = (event) => {
    setValue("countryId", event.target.value);
    setValue("countryName", countryListData?.docs?.find(element => element._id === event.target.value)?.name);
    setValue("stateId", "");
    setValue("stateName", "");


    const stateReqData = {
      "text": "",
      "sort": true,
      "status": true,
      countryId: event.target.value,
      isPagination: false
    };
    dispatch(stateSearch(stateReqData));
   

  };


  const handleSelectState = (event) => {
    setValue("stateId", event.target.value);
    setValue("stateName", stateListData?.docs?.find(element => element._id === event.target.value)?.name);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2 capitalize">
            {/* <div className="w-full">
              <label className="block text-sm font-medium">Country Name</label>
              <select
                {...register("countryId", { required: "Country Name is required" })}
                onChange={handleSelectCountry}
                className={`mt-1 block w-full border ${errors.countryName ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
              >
                <option>Select Country Name</option>
                {countryListData?.docs?.map((element) => (
                  <option key={element._id} value={element._id}>
                    {element.name}
                  </option>
                ))}
              </select>
              {errors.countryName && (
                <p className="text-red-500 text-sm">{errors.countryName.message}</p>
              )}
              {errors.country && (
                <p className="text-red-500 text-sm">{errors.country.message}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium">State Name</label>
              <select
                {...register("stateId", { required: "State Name is required" })}
                onChange={handleSelectState}
                className={`mt-1 block w-full border ${errors.stateName ? "border-[1px] " : "border-gray-300"} p-2 rounded`}
              >
                <option>Select State Name</option>
                {stateListData?.docs?.map((element) => (
                  <option key={element._id} value={element._id}>
                    {element?.name}
                  </option>
                ))}
              </select>
              {errors.stateName && (
                <p className="text-red-500 text-sm">{errors.stateName.message}</p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium">City Name</label>
              <input
                type="text"
                {...register("cityName", {
                  required: "City Name is required",
                })}
                className={`mt-1 block w-full border ${errors.cityName ? "border-[1px] " : "border-gray-300"
                  } p-2 rounded`}
                placeholder="Enter City Name"
              />
              {errors.cityName && (
                <p className="text-red-500 text-sm">
                  {errors.cityName.message}
                </p>
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
                    className={`${inputAntdSelectClassName} ${errors.countryId ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Country Name"
                  >
                    {countryListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(countryListData?.docs, 'name',).map((element) => (
                      <Select.Option key={element._id} value={element._id}>
                        {element.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.countryId && <p className="text-red-500 text-sm">{errors.countryId.message}</p>}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                State Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="stateId"
                control={control}
                rules={{ required: "State Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.stateName ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select State Name"
                  >
                    {(stateListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(stateListData?.docs)?.map((element) => (
                      <Select.Option key={element._id} value={element._id}>
                        {element.name}
                      </Select.Option>
                    ))))
                    }
                  </Select>
                )}
              />
              {errors.stateName && <p className="text-red-500 text-sm">{errors.stateName.message}</p>}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                City Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="cityName"
                control={control}
                rules={{ required: "City Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`${inputClassName} ${errors.cityName ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Enter City Name"
                  />
                )}
              />
              {errors.cityName && <p className="text-red-500 text-sm">{errors.cityName.message}</p>}
            </div>

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={cityLoading}
              className={`${cityLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {cityLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateCity
