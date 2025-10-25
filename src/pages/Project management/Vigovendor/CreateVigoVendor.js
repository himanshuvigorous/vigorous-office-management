import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getUserIds from '../../../constents/getUserIds';
import { AutoComplete, Input, Select } from "antd";
import { getLocationDataByPincode, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputerrorClassNameAutoComplete } from "../../../constents/global";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { createVendorFunc } from "./VigovendorFeatures/_vigo_vendor_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";


function CreateVigoVendor() {
  const { loading: vendorListLoading } = useSelector(state => state.vendor)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { countryListData } = useSelector((state) => state.country);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);


  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });

  const PrintCountry = useWatch({
    control,
    name: "PDCountry",
    defaultValue: "",
  });

  const PrintState = useWatch({
    control,
    name: "PDState",
    defaultValue: "",
  });

  const PrintPincode = useWatch({
    control,
    name: "PDPin",
    defaultValue: "",
  });

  useEffect(() => {
    if (PrintPincode && PrintPincode.length >= 4 &&
      PrintPincode.length <= 6) {
      getLocationDataByPincode(PrintPincode)
        .then((data) => {
          if (data) {
            setValue("PDCity", data.city);
            setValue("PDState", data.state);
            setValue("PDCountry", data.country);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [PrintPincode]);


  useEffect(() => {
    setValue("PDMobileCode", "+91");
  }, [countryListData]);

  useEffect(() => {
    if (userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (
      companyId || userType === "company" || userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          companyId: companyId,
          isPagination: false,
        })
      );
    }
  }, [companyId])



  const onSubmit = (data) => {
    const finalPayload = {
      companyId: companyId,
      directorId: "",
      branchId:branchId,
      "fullName": data?.name,
      "profileImage": "/images/placeholder.png",
      "email": data?.email,
      mobile: {
        code: data?.code,
        number: data?.number,
      },
      "status": true,
      "isDeleted": false,
      "addresses": {
        "primary": {
          street: data?.PDAddress ?? "",
          city: data?.PDCity ?? "",
          state: data?.PDState ?? "",
          country: data?.PDCountry ?? "",
          pinCode: data?.PDPin,
        }
      },
      "vendorProfile": {
        "penNumber": data?.penNumber,
        "adharNumber": data?.adharNumber,
        "GSTNumber": data?.GSTNumber,
        "secondaryEmail": data?.Secemail,
        "secondaryMobile": {
          "code": (+data?.Secnumber && data?.Seccode) ? data?.Seccode : null,
          "number": +data?.Secnumber ? +data?.Secnumber : null
        },
        "landline": {
          "code": (+data?.lannumber && data?.lancode) ? data?.lancode : null,
          "number": +data?.lannumber ? +data?.lannumber : null
        }
      }

    };
    dispatch(createVendorFunc(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">

           

            {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
              <div>
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="PDBranchId"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                     filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                      placeholder="Select Branch"
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
              </div>
            )}

          </div>

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
                GST Number 
              </label>
              <input
                type="text"
                {...register("GSTNumber", {
                  pattern: {
                    value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                    message: "Invalid GST Number format (29AAACH7409R1ZX)",
                  },
                })}
                className={` ${inputClassName} ${errors.GSTNumber ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter GST number"
                maxLength={15}
              />
              {errors.GSTNumber && (
                <p className="text-red-500 text-sm">
                  {errors.GSTNumber.message}
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
                  <p className="text-red-500 text-sm mt-3">
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

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-2">
            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Address 
              </label>
              <input
                type="text"
                {...register("PDAddress", )}
                className={`${inputClassName} ${errors.PDAddress
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Address "
              />
              {errors.PDAddress && (
                <p className="text-red-500 text-sm">
                  {errors.PDAddress.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-2">

            <div>
              <div className={`${inputLabelClassName}`}>
                Country 
              </div>
              <Controller
                control={control}
                name="PDCountry"
             
                render={({ field }) => (
                  <AutoComplete
                    className="w-full"
                    {...field}
                    onChange={(value) => {
                      field.onChange(value); // Update the value in the form control
                    }}
                    options={countryListData?.docs?.map((type) => ({
                      value: type?.name,
                    }))}
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
                      className={`${inputClassName} ${errors.PDCountry
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  </AutoComplete>
                )}
              />
              {errors.PDCountry && (
                <p className={`${inputerrorClassNameAutoComplete}`}>
                  {errors.PDCountry.message}
                </p>
              )}
            </div>

            <div>
              <div className={`${inputLabelClassName}`}>
                State 
              </div>
              <Controller
                control={control}
                name="PDState"
     
                render={({ field }) => (
                  <AutoComplete
                    className="w-full"
                    {...field}
                    onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                    options={stateListData?.docs?.map((type) => ({
                      value: type?.name,
                    }))}
                  >
                    <input
                      placeholder="Enter State"
                      onFocus={() => {
                        dispatch(
                          stateSearch({
                            isPagination: false,
                            text: "",
                            countryName: PrintCountry,
                            sort: true,
                            status: true,
                          })
                        );
                      }}
                      className={`${inputClassName} ${errors.PDState
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  </AutoComplete>
                )}
              />
              {errors.PDState && (
                <p className={`${inputerrorClassNameAutoComplete}`}>
                  {errors.PDState.message}
                </p>
              )}
            </div>

            <div>
              <div className={`${inputLabelClassName}`}>
                City 
              </div>
              <Controller
                control={control}
                name="PDCity"
                render={({ field }) => (
                  <AutoComplete
                    className="w-full"
                    {...field}
                    onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                    options={cityListData?.docs?.map((type) => ({
                      value: type?.name,
                    }))}
                  >
                    <input
                      onFocus={() => {
                        dispatch(
                          citySearch({
                            isPagination: false,
                            text: "",
                            sort: true,
                            status: true,
                            "stateName": PrintState

                          })
                        );
                      }}
                      placeholder="Enter City"
                      className={`${inputClassName} ${errors.PDCity
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  </AutoComplete>
                )}
              />
              {errors.PDCity && (
                <p className={`${inputerrorClassNameAutoComplete}`}>
                  {errors.PDCity.message}
                </p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>
                Pin Code 
              </label>
              <Controller
                control={control}
                name="PDPin"
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
                    className={`${inputClassName} ${errors.PDPin
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  />
                )}
              />
              {errors.PDPin && (
                <p className="text-red-500 text-sm">
                  {errors.PDPin.message}
                </p>
              )}
            </div>

          </div>

          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={vendorListLoading}
              className={`${vendorListLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {vendorListLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateVigoVendor
