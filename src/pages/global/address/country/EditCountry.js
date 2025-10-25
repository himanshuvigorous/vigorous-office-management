import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import { getCountryByIdFunc, updateCountryFunc, getCountryListFunc } from "./CountryFeatures/_country_reducers";
import { inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";

function EditCountry() {
  const { loading: countryLoading } = useSelector((state) => state.country);
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { countryIdEnc } = useParams();
  const countryId = decrypt(countryIdEnc);
  const { countryByIdData } = useSelector((state) => state.country);

  // Watch the mobile number code field
  const countryMobileNumberValue = watch("countryMobileNumberCode");

  // Effect to handle the '+' prefix for mobile code
  useEffect(() => {
    if (countryMobileNumberValue) {
      // If value doesn't start with '+', add it
      if (!countryMobileNumberValue.startsWith('+')) {
        setValue("countryMobileNumberCode", `+${countryMobileNumberValue.replace(/\+/g, '')}`);
      }
    }
  }, [countryMobileNumberValue, setValue]);

  useEffect(() => {
    let reqData = {
      _id: countryId,
    };
    dispatch(getCountryByIdFunc(reqData));
  }, []);

  useEffect(() => {
    if (countryByIdData && countryByIdData?.data) {
      setValue("name", countryByIdData?.data?.name);
      setValue("countryCode", countryByIdData?.data?.countryCode);
      // Ensure the mobile code has '+' when setting initial value
      const mobileCode = countryByIdData?.data?.countryMobileNumberCode;
      setValue("countryMobileNumberCode", mobileCode?.startsWith('+') ? mobileCode : `+${mobileCode}`);
      setValue("status", countryByIdData?.data?.status);
    }
  }, [countryByIdData]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: countryId,
      "name": data.name,
      "countryCode": data?.countryCode,
      // Ensure the mobile code has '+' when submitting
      "countryMobileNumberCode": data?.countryMobileNumberCode?.startsWith('+') 
        ? data?.countryMobileNumberCode 
        : `+${data?.countryMobileNumberCode}`,
      "status": data?.status
    };
    dispatch(updateCountryFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2 capitalize">
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Country Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("name", {
                  required: "Country Name is required",
                })}
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Select Country Name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Country Code <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("countryCode", {
                  required: "Country Code is required",
                })}
                className={`${inputClassName} ${errors.countryCode ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Select Country Code"
              />
              {errors.countryCode && (
                <p className="text-red-500 text-sm">
                  {errors.countryCode.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Country Mobile Code <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("countryMobileNumberCode", {
                  required: "Country Mobile Code is required",
                  validate: (value) => {
                    // Ensure the value is a valid mobile code (starts with + and has numbers)
                    if (!/^\+[0-9]+$/.test(value)) {
                      return "Mobile code must start with + followed by numbers";
                    }
                    return true;
                  }
                })}
                className={`${inputClassName} ${errors.countryMobileNumberCode ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="+123"
              />
              {errors.countryMobileNumberCode && (
                <p className="text-red-500 text-sm">{errors.countryMobileNumberCode.message}</p>
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
              disabled={countryLoading}
              className={`${countryLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded mt-3`}
            >
              {countryLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditCountry;