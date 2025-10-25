import { AutoComplete, Checkbox, Input, Select } from "antd";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  inputAntdSelectClassName,
  inputClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteService,
  updateOwner,
  updateService,
} from "./clientFeatures/_client_reducers";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import ListLoader from "../../../global_layouts/ListLoader";

function OwnersDetails({ clientDataParent, fetchData }) {
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      clientData: [
        {
          fullName: "",
          userType: "clientBranch",
          password: "",
          email: "",
          mobile: { code: "", number: "" },
          directorProfile: {
            isShareLoginDetails: false,
            secondaryEmail: "",
            secondaryMobile: [{ code: "", number: "" }],
            landline: { code: "", number: "" },
          },
          generalInfo: {
            gender: "",
            dateOfBirth: "",
            maritalStatus: "",
          },
          addresses: {
            street: "",
            city: "",
            state: "",
            country: "",
            pinCode: "",
          },
        },
      ],
    },
  });

  const { countryListData ,loading:countryListLoading} = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientData",
  });




  useEffect(() => {
    if (
      clientDataParent?.data?.ownerData &&
      clientDataParent?.data?.ownerData?.length > 0
    ) {

      reset({
        clientData: [],
      });
      clientDataParent?.data?.ownerData?.forEach((eduDetail, index) => {
        const formattedEduDetail = {
          _id: eduDetail?._id,
          fullName: eduDetail?.fullName,
          userType: "clientOwner",

          email: eduDetail?.email,
          mobile: {
            code: eduDetail?.mobile?.code,
            number: eduDetail?.mobile?.number,
          },
          landline: {
            code: eduDetail?.directorProfile?.landline?.code,
          },
          directorProfile: {
            isShareLoginDetails:
              eduDetail?.directorProfile?.isShareLoginDetails,
            secondaryEmail: "",
            secondaryMobile: {
              code: "",
              number: "",
            },
            landline: {
              code: eduDetail?.directorProfile?.landline?.code,
              number: eduDetail?.directorProfile?.landline?.number,
            },
          },
          generalInfo: {
            gender: eduDetail?.generalInfo?.gender,
            dateOfBirth: dayjs(eduDetail?.generalInfo?.dateOfBirth),
            maritalStatus: eduDetail?.generalInfo?.maritalStatus,
          },
          addresses: {
            street: eduDetail?.addresses?.primary?.street,
            city: eduDetail?.addresses?.primary?.city,
            state: eduDetail?.addresses?.primary?.state,
            country: eduDetail?.addresses?.primary?.country,
            pinCode: eduDetail?.addresses?.primary?.pinCode,
            secondary: {
              street: "",
              city: "",
              state: "",
              country: "",
              pinCode: "",
            },
            location: {
              latitude: 0,
              longitude: 0,
              address: "",
            },
          },
        };
        append(formattedEduDetail); // Append the formatted data
      });
    }
  }, [clientDataParent, reset, append]); // Added reset and append dependencies for completeness




  const onSubmit = (data) => {
    const payload = {
      companyId: clientDataParent?.data?.companyId,
      directorId: "",
      branchId: clientDataParent?.data?.branchId,
      clientId: clientDataParent?.data?._id,
      type: "owner",
      ownerArr: data?.clientData?.map((owner) => {
        return {
          _id: owner?._id,
          fullName: owner?.fullName,
          userType: "clientOwner",
          password: !owner?._id
            ? owner?.directorProfile?.isShareLoginDetails === "true"
              ? owner?.password
              : ""
            : null,
          email: owner?.email,
          mobile: {
            code: owner?.mobile?.code,
            number: owner?.mobile?.number,
          },

          directorProfile: {
            isShareLoginDetails: !owner?._id
              ? owner?.directorProfile?.isShareLoginDetails
              : null,
            secondaryEmail: "",
            secondaryMobile: {
              code: "",
              number: "",
            },
            landline: {
              code: owner?.landline?.code,
              number: owner?.directorProfile.landline?.number,
            },
          },
          generalInfo: {
            gender: owner?.generalInfo?.gender,
            dateOfBirth: owner?.generalInfo?.dateOfBirth,
            maritalStatus: owner?.generalInfo?.maritalStatus,
          },
          addresses: {
            primary: {
              street: owner?.addresses?.street,
              city: owner?.addresses?.city,
              state: owner?.addresses?.state,
              country: owner?.addresses?.country,
              pinCode: owner?.addresses?.pinCode,
            },
            secondary: {
              street: "",
              city: "",
              state: "",
              country: "",
              pinCode: "",
            },
            location: {
              latitude: 0,
              longitude: 0,
              address: "",
            },
          },
        };
      }),
    };

    dispatch(updateService(payload)).then((res) => {
      if (!res?.error) {
        fetchData();
      }
    });
  };

  const deleteData = (data, index) => {
    if (data?._id) {
      dispatch(
        deleteService({
          _id: data?._id,
        })
      ).then((res) => {
        if (!res?.error) {
          fetchData();
        }
      });
    } else {
      remove(index);
    }
  };
  const [ownerCheckBox, setOwnerCheckBox] = useState(false)
  const handleOwnerDetails = () => {
    setOwnerCheckBox((prev) => !prev)

  }
  const [ownerCheckBoxes, setOwnerCheckBoxes] = useState({});

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <>
        {fields.map((item, index) => (
          <div key={item.id} className="border border-gray-300 rounded-md my-2">
            <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
              <div className="px-3 py-2 text-white flex gap-12 font-semibold">
                Owner {index + 1}
                {index === 0 && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!ownerCheckBoxes[index]}
                      onChange={() => {
                        setOwnerCheckBoxes((prev) => ({
                          ...prev,
                          [index]: !prev[index], // Toggle the checkbox for this index
                        }));

                        if (!ownerCheckBoxes[index]) {
                          setValue(`clientData.${index}.fullName`, clientDataParent?.data?.fullName || "");
                          setValue(`clientData.${index}.email`, clientDataParent?.data?.email || "");
                          setValue(`clientData.${index}.mobile.code`, clientDataParent?.data?.mobile?.code || "");
                          setValue(`clientData.${index}.mobile.number`, clientDataParent?.data?.mobile?.number || "");
                          setValue(`clientData.${index}.addresses.country`, clientDataParent?.data?.addresses?.primary?.country || "");
                          setValue(`clientData.${index}.addresses.state`, clientDataParent?.data?.addresses?.primary?.state || "");
                          setValue(`clientData.${index}.addresses.city`, clientDataParent?.data?.addresses?.primary?.city || "");
                          setValue(`clientData.${index}.addresses.pinCode`, clientDataParent?.data?.addresses?.primary?.pinCode || "");
                          setValue(`clientData[${index}].generalInfo.dateOfBirth`, dayjs(clientDataParent?.data?.generalInfo?.dateOfBirth) || null);
                          setValue(`clientData.${index}.addresses.street`, clientDataParent?.data?.addresses?.primary?.street || "");
                        } else {
                          // Clear all fields when unchecked
                          setValue(`clientData.${index}.fullName`, "");
                          setValue(`clientData.${index}.email`, "");
                          setValue(`clientData.${index}.mobile.code`, "");
                          setValue(`clientData.${index}.mobile.number`, "");
                          setValue(`clientData.${index}.addresses.country`, "");
                          setValue(`clientData.${index}.addresses.state`, "");
                          setValue(`clientData.${index}.addresses.city`, "");
                          setValue(`clientData.${index}.addresses.pinCode`, "");
                          setValue(`clientData[${index}].generalInfo.dateOfBirth`, "");
                          setValue(`clientData.${index}.addresses.street`, "");
                        }
                      }}
                    />
                    <span className="text-xs">Same as Primary Details</span>
                  </div>
                )}
              </div>

              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => deleteData(item, index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <AiFillDelete size={20} className="m-2" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
              <div>
                <label className={`${inputLabelClassName}`}>
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  {...register(`clientData.${index}.fullName`, {
                    required: "Full Name is required",
                  })}
                  placeholder="Full Name"
                  className={`${inputClassName} ${errors?.clientData?.[index]?.fullName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                />
                {errors?.clientData?.[index]?.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].fullName.message}
                  </p>
                )}
              </div>
              {!item?._id && (
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Share Login Details<span className="text-red-600">*</span>
                  </label>
                  {/* <select
                    {...register(
                      `clientData.${index}.directorProfile.isShareLoginDetails`
                    )}
                    className={`${inputClassName}`}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select> */}

                  <Controller
                    control={control}
                    name={`clientData.${index}.directorProfile.isShareLoginDetails`}
                    rules={{ required: " Share Login Details type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}

                        className={`${inputAntdSelectClassName} `}
                      >

                        <Select.Option value="true">Yes</Select.Option>
                        <Select.Option value="false">No</Select.Option>

                      </Select>
                    )}
                  />
                </div>
              )}

              {watch(
                `clientData.${index}.directorProfile.isShareLoginDetails`
              ) === "true" &&
                !item?._id && (
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      {...register(`clientData.${index}.password`, {
                        required: "Password is required",
                      })}
                      className={`${inputClassName} ${errors?.clientData?.[index]?.password
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                    {errors?.clientData?.[index]?.password && (
                      <p className="text-red-500 text-sm">
                        {errors.clientData[index].password.message}
                      </p>
                    )}
                  </div>
                )}

              <div>
                <label className={`${inputLabelClassName}`}>
                  Email <span className="text-red-600">*</span>
                </label>
                <input
                  placeholder="Enter Email"
                  {...register(`clientData.${index}.email`, {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address",
                    },
                  })}
                  className={`${inputClassName} ${errors?.clientData?.[index]?.email
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                />
                {errors?.clientData?.[index]?.email && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].email.message}
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
                      name={`clientData.${index}.mobile.code`}
                      rules={{ required: "code is required" }}
                      render={({ field }) => (
                        <CustomMobileCodePicker
                          field={field}
                          errors={errors}
                        />
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <input
                      type="number"
                      {...register(`clientData.${index}.mobile.number`, {
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
                      className={`${inputClassName} ${errors?.clientData?.[index]?.mobile?.number
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  {errors?.clientData?.[index]?.mobile?.code && (
                    <p className="text-red-500 text-sm">
                      {errors.clientData[index].mobile.code.message}
                    </p>
                  )}
                  {errors?.clientData?.[index]?.mobile?.number && (
                    <p className="text-red-500 text-sm">
                      {errors.clientData[index].mobile.number.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div>
                <label className={`${inputLabelClassName}`}>Landline</label>
                <div className="flex gap-2">
                  <div className="w-[150px]">
                    <Controller
                      control={control}
                      name={`clientData.${index}.landline.code`}
                      render={({ field }) => (
                        <CustomMobileCodePicker
                          field={field}
                            errors={errors} 
                          />
                      )}
                    />{" "}
                  </div>
                  <div className="w-full">
                    <input
                      type="number"
                      {...register(
                        `clientData.${index}.directorProfile.landline.number`,
                        {
                          minLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                        }
                      )}
                      maxLength={10}
                      onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                      placeholder="Number"
                      className={`${inputClassName} ${
                        errors?.clientData?.[index]?.directorProfile?.landline
                          ?.number
                          ? "border-[1px] "
                          : "border-gray-300"
                      }`}
                    />
                     {errors?.clientData?.[index]?.directorProfile?.landline?.number && (
                  <p className="text-red-500 text-sm">
                    {errors?.clientData[index]?.directorProfile?.landline?.number?.message}
                  </p>
                )}
                  </div>
                </div>
              </div> */}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Gender <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register(`clientData.${index}.generalInfo.gender`, {
                    required: "Gender is required",
                  })}
                  className={`${inputClassName} ${
                    errors?.clientData?.[index]?.generalInfo?.gender
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select> */}


                <Controller
                  control={control}
                  name={`clientData.${index}.generalInfo.gender`}
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}

                      className={`${inputAntdSelectClassName} `}
                    >

                      <Select.Option value="">Select Gender</Select.Option>
                      <Select.Option value="Male">Male</Select.Option>
                      <Select.Option value="Female">Female</Select.Option>
                      <Select.Option value="Other">Other</Select.Option>

                    </Select>
                  )}
                />
                {errors?.clientData?.[index]?.generalInfo?.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].generalInfo.gender.message}
                  </p>
                )}
              </div>

              <div>
                <label className={`${inputLabelClassName}`}>
                  Date of Birth <span className="text-red-600">*</span>
                </label>
                <Controller
                  name={`clientData[${index}].generalInfo.dateOfBirth`}
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      field={field}
                      errors={errors}
                      disabledDate={(current) => {
                        return (
                          current &&
                          current.isAfter(moment().endOf("day"), "day")
                        );
                      }}
                    />
                  )}
                />
                {errors?.clientData?.[index]?.generalInfo?.dateOfBirth && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].generalInfo.dateOfBirth.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Marital Status <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register(
                    `clientData.${index}.generalInfo.maritalStatus`,
                    { required: "Marital Status is required" }
                  )}
                  className={`${inputClassName} ${
                    errors?.clientData?.[index]?.generalInfo?.maritalStatus
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                </select> */}

                <Controller
                  control={control}
                  name={`clientData.${index}.generalInfo.maritalStatus`}
                  rules={{ required: "  Marital Status  is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}

                      className={`${inputAntdSelectClassName} `}
                    >

                      <Select.Option value="">Select Marital Status</Select.Option>
                      <Select.Option value="Single">Single</Select.Option>
                      <Select.Option value="Married">Married</Select.Option>
                      <Select.Option value="Divorced">Divorced</Select.Option>
                    </Select>
                  )}
                />
                {errors?.clientData?.[index]?.generalInfo?.maritalStatus && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].generalInfo.maritalStatus.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
              <div className="col-span-2">
                <label className={`${inputLabelClassName}`}>
                  Primary Address<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register(`clientData.${index}.addresses.street`, {
                    required: "Primary Address is required",
                  })}
                  className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.street
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Primary Address"
                />
                {errors.clientData?.[index]?.addresses?.street && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData?.[index]?.addresses?.street.message}
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
                  name={`clientData.${index}.addresses.country`}
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <AutoComplete
                      {...field}
                      onChange={(value) => field.onChange(value)} // Handle country change
                      className="w-full"
                      options={sortByPropertyAlphabetically(countryListData?.docs)?.map((type) => ({
                        value: type?.name,
                      }))}
                      notFoundContent={countryListLoading&&<ListLoader/>}
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
                        className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.country
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      />
                    </AutoComplete>
                  )}
                />
                {errors.clientData?.[index]?.addresses?.country && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors.clientData[index].addresses.country.message}
                  </p>
                )}
              </div>
              <div>
                <div className={`${inputLabelClassName}`}>
                  State <span className="text-red-600">*</span>
                </div>
                <Controller
                  control={control}
                  name={`clientData.${index}.addresses.state`}
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <AutoComplete
                      {...field}
                      onChange={(value) => field.onChange(value)} // Handle state change
                      className="w-full"
                      options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
                        value: type?.name,
                      }))}
                            notFoundContent={<ListLoader/>}z
                    >
                      <input
                        placeholder="Enter State"
                        onFocus={() => {
                          dispatch(
                            stateSearch({
                              isPagination: false,
                              text: "",
                              countryName: watch(
                                `clientData.${index}.addresses.country`
                              ),
                              sort: true,
                              status: true,
                            })
                          );
                        }}
                        className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.state
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      />
                    </AutoComplete>
                  )}
                />
                {errors.clientData?.[index]?.addresses?.state && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors.clientData[index].addresses.state.message}
                  </p>
                )}
              </div>

              <div>
                <div className={`${inputLabelClassName}`}>
                  City <span className="text-red-600">*</span>
                </div>
                <Controller
                  control={control}
                  name={`clientData.${index}.addresses.city`}
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
                              stateName: watch(
                                `clientData.${index}.addresses.state`
                              ),
                            })
                          );
                        }}
                        className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.city
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      />
                    </AutoComplete>
                  )}
                />
                {errors.clientData?.[index]?.addresses?.city && (
                  <p className={`${inputerrorClassNameAutoComplete}`}>
                    {errors.clientData[index].addresses.city.message}
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
                  name={`clientData.${index}.addresses.pinCode`}
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
                      className={`${inputClassName} ${errors.clientData?.[index]?.addresses?.pinCode
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  )}
                />
                {errors.clientData?.[index]?.addresses?.pinCode && (
                  <p className="text-red-500 text-sm">
                    {errors.clientData[index].addresses.pinCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex gap-2 justify-between items-center my-2">
          <button
            type="button"
            onClick={() =>
              append({
                fullName: "",
                userType: "clientBranch",
                password: "",
                email: "",
                mobile: { code: "", number: "" },
                directorProfile: {
                  isShareLoginDetails: false,
                  secondaryEmail: "",
                  secondaryMobile: [{ code: "", number: "" }],
                  landline: { code: "", number: "" },
                },
                generalInfo: {
                  gender: "",
                  dateOfBirth: "",
                  maritalStatus: "",
                },
                addresses: {
                  street: "",
                  city: "",
                  state: "",
                  country: "",
                  pinCode: "",
                },
              })
            }
            className="bg-header px-2 py-2 text-sm rounded-md text-white"
          >
            Add New Client
          </button>

          <button
            type="submit"
            className="bg-header px-2 py-2 text-sm rounded-md text-white"
          >
            Submit
          </button>
        </div>
      </>
    </form>
  );
}

export default OwnersDetails;
