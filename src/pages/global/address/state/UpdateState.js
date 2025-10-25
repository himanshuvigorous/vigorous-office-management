import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { countrySearch, getCountryListFunc } from "../country/CountryFeatures/_country_reducers";
import { getStateById, updateStateData } from "./featureStates/_state_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { Input, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";



function UpdateState() {
  const { loading: stateLoading } = useSelector(state => state.states)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stateEnc } = useParams();
  const stateId = decrypt(stateEnc);
  const { countryListData } = useSelector((state) => state.country);
  const { stateByIdData } = useSelector((state) => state.states);


  useEffect(() => {
    let reqData = {
      _id: stateId,
    };

    const countryReqData = {
      text: "",
      sort: true,
      status: true,
      isPagination: false
    };
    dispatch(countrySearch(countryReqData)).then(data =>
      !data.error && dispatch(getStateById(reqData))
    )

  }, []);

  useEffect(() => {
    if (stateByIdData) {

      // setValue("countryName", stateByIdData?.countryName);
      setValue("name", stateByIdData?.name);
      setValue("stateCode", stateByIdData?.stateCode);
      setValue("countryId", stateByIdData?.countryId);
      setValue("IGSTstatus", stateByIdData?.IGSTstatus);
      setValue("SGSTstatus", stateByIdData?.SGSTstatus);
      setValue("status", stateByIdData?.status);
    }
  }, [stateByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      "_id": stateId,
      "name": data?.name,
      "stateCode": data?.stateCode,
      "countryId": data?.countryId,
      "IGSTstatus": data?.IGSTstatus,
      "SGSTstatus": data?.SGSTstatus,
      "status": data?.status
    }
    dispatch(updateStateData(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  const handleSelectChange = (event) => {
    setValue("countryId", event.target.value);
    setValue("countryName", countryListData?.docs?.find(element => element._id == event.target.value).name);
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
                  className={`${inputAntdSelectClassName} ${errors._id ? "border-[1px] " : "border-gray-300"}`}
                  showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                  placeholder="Select Country Name"
                >
                  {countryListData?.docs?.length > 0 &&
                    countryListData.docs.map((element) => (
                      <Select.Option key={element._id} value={element._id}>{element.name}</Select.Option>
                    ))}
                </Select>
              )}
            />
            {errors._id && (
              <p className="text-red-500 text-sm">
                {errors._id.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2 my-2 capitalize">

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>State Name <span className="text-red-600">*</span></label>
              <Controller
                name="name"
                control={control}
                rules={{ required: "State Name is required" }}
                render={({ field }) => (
                  <input
                    {...field}
                    className={`${errors.name ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                    placeholder="Enter State Name"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
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
                name="IGSTstatus"
                control={control}
                rules={{ required: "IGST Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.IGSTstatus ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select IGST Status"
                  >
                    <Select.Option value={true}>Disabled</Select.Option>
                    <Select.Option value={false}>Enabled</Select.Option>
                  </Select>
                )}
              />
              {errors.IGSTstatus && (
                <p className="text-red-500 text-sm">{errors.IGSTstatus.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>SGST & CGST <span className="text-red-600">*</span></label>
              <Controller
                name="SGSTstatus"
                control={control}
                rules={{ required: "GST is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.SGSTstatus ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select GST Status"
                  >
                    <Select.Option value={true}>Disabled</Select.Option>
                    <Select.Option value={false}>Enabled</Select.Option>
                  </Select>
                )}
              />
              {errors.SGSTstatus && (
                <p className="text-red-500 text-sm">{errors.SGSTstatus.message}</p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Status"
                  >
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={stateLoading}
              className={`${stateLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-4 rounded`}
            >
              {stateLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default UpdateState;
