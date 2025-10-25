import { useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCountryFunc } from "./CountryFeatures/_country_reducers";
import { inputClassName, inputLabelClassName } from "../../../../constents/global";
import Loader from "../../../../global_layouts/Loader";
import { useEffect } from "react";

function CreateCountry() {
  const { loading: countryLoading } = useSelector((state) => state.country);
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const countryMobileNumberValue = watch("countryMobileNumber");

  // Effect to handle the '+' prefix for mobile code
  useEffect(() => {
    if (countryMobileNumberValue) {
      // If value doesn't start with '+', add it
      if (!countryMobileNumberValue.startsWith('+')) {
        setValue("countryMobileNumber", `+${countryMobileNumberValue.replace(/\+/g, '')}`);
      }
    }
  }, [countryMobileNumberValue, setValue]);

  const onSubmit = (data) => {
    const finalPayload = {
      "name": data.countryName,
      "countryCode": data.countryCode,
      // Ensure the mobile code has '+' when submitting
      "countryMobileNumberCode": data.countryMobileNumber.startsWith('+') 
        ? data.countryMobileNumber 
        : `+${data.countryMobileNumber}`,
    }

    dispatch(createCountryFunc(finalPayload)).then((data) => {
      !data?.error && navigate(-1)
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2 capitalize">
            <div className="w-full">
              <label className={`${inputLabelClassName}`}> Country Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("countryName", {
                  required: "Country Name is required",
                })}
                className={`${errors.countryName ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
                placeholder="Select Country Name"
              />
              {errors.countryName && (
                <p className="text-red-500 text-sm">
                  {errors.countryName.message}
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
                className={`${errors.countryCode ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
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
                {...register("countryMobileNumber", {
                  required: "Country Mobile Code is required",
                  validate: (value) => {
                    // Ensure the value is a valid mobile code (starts with + and has numbers)
                    if (!/^\+[0-9]+$/.test(value)) {
                      return "Mobile code must start with + followed by numbers";
                    }
                    return true;
                  }
                })}
                className={`${errors.countryMobileNumber ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
                placeholder="+123"
              />
              {errors.countryMobileNumber && (
                <p className="text-red-500 text-sm">{errors.countryMobileNumber.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={countryLoading}
              className={`${countryLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {countryLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateCountry