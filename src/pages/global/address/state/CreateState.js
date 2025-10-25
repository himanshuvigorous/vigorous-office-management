import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { countrySearch, getCountryListFunc } from "../country/CountryFeatures/_country_reducers";
import { createStateFunc } from "./featureStates/_state_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../../constents/global";
import { Input, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


function CreateState() {
  const { loading: stateLoading } = useSelector(state => state.states)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { countryListData, loading: countryListLoading } = useSelector((state) => state.country);

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
      "name": data?.stateName,
      "stateCode": data?.stateCode,
      "countryId": data?.countryId,
      "IGSTstatus": true,
      "SGSTstatus": true,
    }
    dispatch(createStateFunc(finalPayload)).then((data) => {
      !data.error && navigate(-1)
    });
  }

  const handleSelectChange = (event) => {
    const [countryId, countryName] = event.target.value.split("-");
    setValue("countryId", countryId);
    setValue("countryName", countryName);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
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
                  placeholder="Select Country Name"
                  className={`${inputAntdSelectClassName} ${errors.countryId ? "border-[1px] " : "border-gray-300"
                    }`}
                  optionFilterProp="children"
                  showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                >
                  {countryListLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (countryListData?.docs?.length > 0 &&
                    sortByPropertyAlphabetically(countryListData?.docs, 'name')?.map((element) => (
                      <Select.Option key={element?._id} value={element?._id}>{element?.name}</Select.Option>
                    )))}
                </Select>
              )}
            />
            {errors._id && (
              <p className="text-red-500 text-sm">{errors._id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2 my-2 capitalize">

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>State Name <span className="text-red-600">*</span></label>
              <Controller
                name="stateName"
                control={control}
                rules={{ required: "State Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`${errors.stateName ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                    placeholder="Enter State Name"
                  />
                )}
              />
              {errors.stateName && (
                <p className="text-red-500 text-sm">{errors.stateName.message}</p>
              )}
            </div>


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>State Code <span className="text-red-600">*</span></label>
              <Controller
                name="stateCode"
                control={control}
                rules={{ required: "State Code is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`${inputClassName} ${errors.stateCode ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Enter State Code"
                  />
                )}
              />
              {errors.stateCode && (
                <p className="text-red-500 text-sm">{errors.stateCode.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>IGST <span className="text-red-600">*</span></label>
              <Controller
                name="igstStatus"
                control={control}
                rules={{ required: "IGST Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.igstStatus ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select IGST Status"
                  >
                    <Select.Option value="Disabled">Disabled</Select.Option>
                    <Select.Option value="Enabled">Enabled</Select.Option>
                  </Select>
                )}
              />
              {errors.igstStatus && (
                <p className="text-red-500 text-sm">{errors.igstStatus.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>SGST & CGST <span className="text-red-600">*</span></label>
              <Controller
                name="gstStatus"
                control={control}
                rules={{ required: "GST is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.gstStatus ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select GST Status"
                  >
                    <Select.Option value="Disabled">Disabled</Select.Option>
                    <Select.Option value="Enabled">Enabled</Select.Option>
                  </Select>
                )}
              />
              {errors.gstStatus && (
                <p className="text-red-500 text-sm">{errors.gstStatus.message}</p>
              )}
            </div>


          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={stateLoading}
              className={`${stateLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {stateLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateState
