import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decrypt } from "../../config/Encryption";
import { getLocationDataByPincode, inputClassName, inputLabelClassName, inputerrorClassNameAutoComplete } from "../../constents/global";
import { getVisitorDetails, updateVisitor } from "./notificationFeatures/_notification_reducers";
import Loader from "../../global_layouts/Loader/Loader";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { visitorCatSearch } from "../visitorCategories/visitorCategoryFeatures/_visitor_categories_reducers";
import { employeSearch } from "../../pages/employeManagement/employeFeatures/_employe_reducers";
import { AutoComplete, Input } from "antd";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import moment from "moment";

function UpdateNotification() {

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitorIdEnc } = useParams();
  const visitorId = decrypt(visitorIdEnc);
  const { visitorDetails } = useSelector((state) => state.visitor);
  const { visitorCatList } = useSelector((state) => state.visitorCategory);

  const { employeList } = useSelector(state => state.employe)
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);

  const PrintAddress = useWatch({
    control,
    name: "PDAddress",
    defaultValue: "",
  });
  const PrintCity = useWatch({
    control,
    name: "PDCity",
    defaultValue: "",
  });
  const PrintState = useWatch({
    control,
    name: "PDState",
    defaultValue: "",
  });
  const PrintCountry = useWatch({
    control,
    name: "PDCountry",
    defaultValue: "",
  });

  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
    defaultValue: "",
  });

  const category = useWatch({
    control,
    name: "category",
    defaultValue: ""
  });

  useEffect(() => {
    if (PrintPincode && PrintPincode.length >=4 &&
      PrintPincode.length <= 6 ) {
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
    const fetchData = async () => {
      try {
        const reqData = {
          _id: visitorId,
        };
        await dispatch(getVisitorDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (visitorDetails) {
      const reqPayload = {
        directorId: "",
        companyId: visitorDetails?.companyId,
        branchId: visitorDetails?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": false,
      }
      dispatch(employeSearch(reqPayload)).then((data) => {
        if (!data.error) {
          setValue("designationName", visitorDetails?.name);
          setValue("companyId", visitorDetails?.companyId);
          setValue("branchId", visitorDetails?.branchId);
          setValue("contactPersonId", visitorDetails?.contactPersonId);
          setValue("reason", visitorDetails?.reason);
          setValue("visitorName", visitorDetails?.name);
          setValue("clientId", visitorDetails?.clientId);
          setValue("numberOfPerson", visitorDetails?.numberOfPerson);
          setValue("status", visitorDetails?.status);
          setValue("PDPinCode", visitorDetails?.address?.pinCode);
          setValue("PDMobileCode", visitorDetails?.mobile?.code);
          setValue("PDMobileNo", visitorDetails?.mobile?.number);
          setValue("PDAddress", visitorDetails?.address?.street);
          setValue("category", visitorDetails?.category);
          setValue("kilometer", visitorDetails?.kilometer);
          // setValue("date", visitorDetails?.date);
          setValue("date", moment(visitorDetails?.date).format("YYYY-MM-DD"));
        }
      })
    }

  }, [visitorDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: visitorId,
      companyId: visitorDetails?.companyId,
      directorId: '',
      branchId: visitorDetails?.branchId,
      contactPersonId: data?.contactPersonId,
      name: data?.visitorName,
      reason: data?.reason,
      status: data?.status,
      clientId: data?.clientId,
      numberOfPerson: data?.numberOfPerson,
      // clientId: data?.clientId,
      category: data?.category,
      kilometer: Number(data?.kilometer),
      date: data?.date,
      address: {
        street: data?.PDAddress ?? "",
        city: data?.PDCity ?? "",
        state: data?.PDState ?? "",
        country: data?.PDCountry ?? "",
        pinCode: data?.PDPinCode ?? ""
      },
      mobile: {
        number: data?.PDMobileNo ?? "",
        code: data?.PDMobileCode ?? ""
      },
    };

    dispatch(updateVisitor(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/visitor");
    });
  };

  return (
    <GlobalLayout>
      {!pageLoading ? (
        <div className="gap-4">
          <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Category<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className={` ${inputClassName} ${errors.category
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">Select Category</option>
                  <option value="general">General Visitor</option>
                  <option value="existing">Existing Client</option>
                  <option value="new">New Client</option>
                  <option value="employe">Employe To Client</option>
                </select>
                {errors[`category`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`category`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Visitor Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("visitorName", {
                    required: "Task Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.visitorName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Visitor Name"
                />
                {errors.designationName && (
                  <p className="text-red-500 text-sm">
                    {errors.visitorName.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Contact Person<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("contactPersonId", {
                    required: "Contact Person is required",
                  })}
                  className={` ${inputClassName} ${errors.contactPersonId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Contact Person
                  </option>
                  {employeList?.map((element) => (
                    <option value={element?._id}>
                      {element?.fullName}
                    </option>
                  ))}
                </select>
                {errors.contactPersonId && (
                  <p className="text-red-500 text-sm">
                    {errors.contactPersonId.message}
                  </p>
                )}
              </div>
              {(category === "existing" || category === "employe") &&
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Client<span className="text-red-600">*</span>
                  </label>
                  <select
                    onFocus={() => {
                      const reqPayload = {
                        directorId: "",
                        companyId: visitorDetails?.companyId,
                        branchId: visitorDetails?.branchId,
                        "text": "",
                        "sort": true,
                        "status": "",
                        "isPagination": true,
                      }
                      dispatch(visitorCatSearch(reqPayload))
                    }}
                    {...register("clientId", {
                      required: "Client is required",
                    })}
                    className={` ${inputClassName} ${errors.clientId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Client
                    </option>
                    {employeList?.map((element) => (
                      <option value={element?._id}>
                        {element?.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.clientId && (
                    <p className="text-red-500 text-sm">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>}
              {(category !== "employe") &&
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Number Of Person <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("numberOfPerson", {
                      required: "Number Of Person is required",
                    })}
                    className={`placeholder: ${inputClassName} ${errors.numberOfPerson
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Number Of Person"
                  />
                  {errors.numberOfPerson && (
                    <p className="text-red-500 text-sm">
                      {errors.numberOfPerson.message}
                    </p>
                  )}
                </div>}
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Reason <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("reason", {
                    required: "Reason is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.reason
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Reason"
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm">
                    {errors.reason.message}
                  </p>
                )}
              </div>
              {(category === "employe") &&
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    KM <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("kilometer", {
                      required: "Number kilometer is required",
                    })}
                    className={`placeholder: ${inputClassName} ${errors.kilometer
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Number kilometer"
                  />
                  {errors.designationName && (
                    <p className="text-red-500 text-sm">
                      {errors.kilometer.message}
                    </p>
                  )}
                </div>}
              {(category === "employe") &&
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Date<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("date", {
                      required: "Date is required",
                    })}
                    className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Date of Birth"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
              <div className="col-span-2">
                <label className={`${inputLabelClassName}`}>
                  Primary Address<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("PDAddress", {
                    required: "Address  is required",
                  })}
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
              <div className="w-full">
                <div className={`${inputLabelClassName}`}>
                  Country <span className="text-red-600">*</span>
                </div>
                <Controller
                  control={control}
                  name="PDCountry"
                  rules={{ required: "Country is required" }}
                  render={({ field }) => (
                    <AutoComplete
                      className="w-full"
                      {...field}
                      onChange={(value) => {
                        // Directly handle country change by using setValue from React Hook Form
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
              <div className="w-full">
                <div className={`${inputLabelClassName}`}>
                  State <span className="text-red-600">*</span>
                </div>
                <Controller
                  control={control}
                  name="PDState"
                  rules={{ required: "State is required" }}
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
              <div className="w-full">
                <div className={`${inputLabelClassName}`}>
                  City <span className="text-red-600">*</span>
                </div>
                <Controller
                  control={control}
                  name="PDCity"
                  rules={{ required: "City is required" }}
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
                              stateName: PrintState,
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
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Pin Code <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="PDPinCode"
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
                      className={`${inputClassName} ${errors.PDPinCode
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                  )}
                />
                {errors.PDPinCode && (
                  <p className="text-red-500 text-sm">
                    {errors.PDPinCode.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="flex gap-3">
                <div className="w-[150px]">
                  <label className={`${inputLabelClassName}`}>
                    code<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="PDMobileCode"
                    rules={{ required: "code is required" }}
                    render={({ field }) => (
                      <AutoComplete
                        {...field}
                        onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                        options={countryListData?.docs?.map((type) => ({
                          value: type?.countryMobileNumberCode,
                        }))}
                      >
                        <input
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
                          className={`${inputClassName} ${errors.PDState
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                      </AutoComplete>
                    )}
                  />

                  {errors[`PDMobileCode`] && (
                    <p className={`${inputerrorClassNameAutoComplete}`}>
                      {errors[`PDMobileCode`].message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Mobile No<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register(`PDMobileNo`, {
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
                    className={` ${inputClassName} ${errors[`PDMobileNo`]
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
                  {errors[`PDMobileNo`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`PDMobileNo`].message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                type="submit"
                className="bg-header text-white p-2 px-4 rounded mt-4"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
}

export default UpdateNotification;
