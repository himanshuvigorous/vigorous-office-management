import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decrypt } from "../../../config/Encryption";
import {
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputerrorClassNameAutoComplete,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import {
  getVisitorDetails,
  resetState,
  updateVisitor,
} from "./visitorFeatures/_visitor_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { employeSearch } from "../../../pages/employeManagement/employeFeatures/_employe_reducers";
import { AutoComplete, Input, Select } from "antd";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import moment from "moment";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import dayjs from "dayjs";
import { VisitReasonTypeSearch } from "../visitreason/visitReasonFeatures/_visitReason_type_reducers";
import getUserIds from "../../../constents/getUserIds";
import ListLoader from "../../../global_layouts/ListLoader";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import Loader2 from "../../../global_layouts/Loader/Loader2";

function UpdateVisitor() {
  const { loading: visitorLoading } = useSelector(state => state.visitor);
  const [options, setOptions] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageLoading2, setPageLoading2] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitorIdEnc } = useParams();
  const visitorId = decrypt(visitorIdEnc);
  const { visitorDetails } = useSelector((state) => state.visitor);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { clientList } = useSelector((state) => state.client);
  const { VisitReasonList } = useSelector((state) => state.visitReason);

  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
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
    defaultValue: "",
  });

  useEffect(() => {
    if (
      PrintPincode &&
      PrintPincode.length >= 4 &&
      PrintPincode.length <= 6 &&
      /^\d{6}$/.test(PrintPincode)
    ) {
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
       setPageLoading(true);
    const fetchData = async () => {
      try {
        const reqData = {
          _id: visitorId,
        };
        await dispatch(getVisitorDetails(reqData))
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally{
           setPageLoading(false);
      }
    };

    fetchData();
    return()=>{
      dispatch(resetState())
    }
  }, []);

useEffect(() => {
  const fetchData = async () => {
    if (!visitorDetails) return;

  
    
    try {
        setPageLoading2(true);
      // Dispatch parallel requests that don't depend on each other
      const [departmentResult, clientResult] = await Promise.all([
        dispatch(
          deptSearch({
            text: "",
            sort: true,
            status: true,
            isPagination: false,
            companyId: visitorDetails?.companyId,
            branchId: visitorDetails?.branchId,
          })
        ),
        dispatch(
          clientSearch({
            text: "",
            sort: true,
            status: true,
            isPagination: false,
            companyId: visitorDetails?.companyId,
            branchId: visitorDetails?.branchId,
          })
        )
      ]);

      if (departmentResult?.error || clientResult?.error) {
        throw new Error('Failed to fetch department or client data');
      }



      // Fetch employee data
      const employeeResult = await dispatch(
        employeSearch({
          directorId: "",
          companyId: visitorDetails?.companyId,
          branchId: visitorDetails?.branchId,
          departmentId: visitorDetails?.departmentId,
          text: "",
          sort: true,
          status: "",
          isPagination: false,
          isBranch: true,
          isDirector: true,
        })
      );

      if (employeeResult?.error) {
        throw new Error('Failed to fetch employee data');
      }

      // Process employee data
      const list = employeeResult?.payload?.data?.docs?.map((element) => ({
        label: (
          <div className="flex gap-2 items-center">
            {element.fullName}
            <div className="text-[10px] text-gray-500">
              {element.userType === "companyDirector"
                ? "Director"
                : element.userType === "companyBranch"
                  ? "Branch Head"
                  : ""}
            </div>
          </div>
        ),
        value: element._id,
        searchText: element.fullName.toLowerCase(),
      }));

      setOptions(list);

      // Fetch visit reason (can be parallel with employee if no dependency)
      const visitReasonResult = await dispatch(
        VisitReasonTypeSearch({
          companyId: visitorDetails?.companyId,
          directorId: "",
          branchId: visitorDetails?.branchId,
          text: "",
          sort: true,
          status: true,
          isPagination: false
        })
      );

      if (!visitReasonResult?.error) {
        setValue("reason", visitorDetails?.visitReasonId);
      }

      // Set all form values
      // Set values that don't depend on employee data
      setValue("clientId", visitorDetails?.clientId);
      setValue("PDDepartmentId", visitorDetails?.departmentId);
      setValue("designationName", visitorDetails?.name);
      setValue("companyId", visitorDetails?.companyId);
      setValue("branchId", visitorDetails?.branchId);
      setValue("contactPersonId", visitorDetails?.contactPersonId);
      setValue("employeId", visitorDetails?.employeId);
      setValue("visitorName", visitorDetails?.name);
      setValue("numberOfPerson", visitorDetails?.numberOfPerson);
      setValue("PDDepartmentId", visitorDetails?.departmentId);
      setValue("status", visitorDetails?.status);
      setValue("PDPinCode", visitorDetails?.address?.pinCode);
      setValue("PDMobileCode", visitorDetails?.mobile?.code);
      setValue("PDMobileNo", visitorDetails?.mobile?.number);
      setValue("PDAddress", visitorDetails?.address?.street);
      setValue("category", visitorDetails?.category);
      setValue("kilometer", visitorDetails?.kilometer);
      setValue("date", moment(visitorDetails?.date).format("YYYY-MM-DD"));
  setPageLoading2(false);
    } catch (error) {
      console.error("Error fetching visitor details:", error);
      // Handle error (show toast, etc.)
    } 
  };

  fetchData();
}, [visitorDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: visitorId,
      companyId: visitorDetails?.companyId,
      directorId: "",
      branchId: visitorDetails?.branchId,
      departmentId: departmentId,
      contactPersonId: data?.contactPersonId,
      name: data?.visitorName,
      reason: data?.reason,
      visitReasonId: data?.reason,
      status: data?.status,
      clientId: data?.clientId,
      employeId: data?.employeId,
      numberOfPerson: Number(data?.numberOfPerson),
      category: data?.category,
      kilometer: Number(data?.kilometer),
      date: data?.date ? data?.date : null,
      checkOutTime: null,
      address: {
        street: data?.PDAddress ?? "",
        city: data?.PDCity ?? "",
        state: data?.PDState ?? "",
        country: data?.PDCountry ?? "",
        pinCode: data?.PDPinCode ?? "",
      },
      mobile: {
        number: data?.PDMobileNo ?? "",
        code: data?.PDMobileCode ?? "",
      },
    };

    dispatch(updateVisitor(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      {(!pageLoading && !pageLoading2)? (
        <div className="gap-4">
          <form
            autoComplete="off"
            className="mt-0"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 md:my-2">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Category <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}

                  name="category"
                  rules={{ required: "category is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      disabled={true}
                      className={` ${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option className="" value="">
                        Select Category
                      </Select.Option>
                      <Select.Option value="general">
                        General Visitor
                      </Select.Option>
                      <Select.Option value="existing">
                        Existing Client
                      </Select.Option>
                      <Select.Option value="new">New Client</Select.Option>
                      {/* <Select.Option value="employe">
                        Employe To Client
                      </Select.Option> */}
                    </Select>
                  )}
                />
                {errors[`category`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`category`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("visitorName", {
                    required: "Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.visitorName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Name"
                />
                {errors.visitorName && (
                  <p className="text-red-500 text-sm">
                    {errors.visitorName.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Department <span className="text-red-600">*</span>
                </label>

                <Controller
                  name="PDDepartmentId"
                  control={control}
                  rules={{ required: "Department is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.PDDepartmentId ? '' : 'border-gray-300'}`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={(value) => {
                        field.onChange(value);
                      }}

                      placeholder="Select Department"
                    >
                      <Select.Option value="">Select Department</Select.Option>
                      {depLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (departmentListData?.map((element) => (
                        <Select.Option key={element?._id} value={element?._id}>
                          {element?.name}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />

                {errors.PDDepartmentId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDDepartmentId.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Contact Person <span className="text-red-600">*</span>
                </label>
               

                <Controller
                  control={control}
                  name="contactPersonId"
                  rules={{ required: "contact Person is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      onFocus={() => {
                        const reqPayload = {
                          directorId: "",
                          companyId: visitorDetails?.companyId,
                          branchId: visitorDetails?.branchId,
                          departmentId: departmentId,
                          text: "",
                          sort: true,
                          status: "",
                          isPagination: false,
                           isBranch: true,
                        isDirector: true,
                        };
                        dispatch(employeSearch(reqPayload))?.then((empResponse) => {
                          const list = empResponse?.payload?.data?.docs?.map((element) => (

                            {
                              label: (
                                <div className="flex gap-2 items-center">
                                  {element.fullName}
                                  <div className="text-[10px] text-gray-500">
                                    {element.userType === "companyDirector"
                                      ? "Director"
                                      : element.userType === "companyBranch"
                                        ? "Branch Head"
                                        : ""}
                                  </div>
                                </div>

                              ),

                              value: element._id,
                              searchText: element.fullName.toLowerCase(),
                            }));
                          setOptions(list);
                        })
                      }}
                      className={` ${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      options={options}
                    >
                    </Select>
                  )}
                />

                {errors.contactPersonId && (
                  <p className="text-red-500 text-sm">
                    {errors.contactPersonId.message}
                  </p>
                )}
              </div>
              {(category === "existing" || category === "employe") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Client <span className="text-red-600">*</span>
                  </label>
                 
                  <Controller
                    control={control}
                    name="clientId"
                    rules={{ required: "client is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                     
                        className={` ${inputAntdSelectClassName} `}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        onFocus={() => {
                          const reqPayload = {
                            directorId: "",
                            companyId: visitorDetails?.companyId,
                            branchId: visitorDetails?.branchId,
                            userType: "client",
                            text: "",
                            sort: true,
                            status: "",
                            isPagination: false,
                          };
                          dispatch(clientSearch(reqPayload));
                        }}
                      >
                        <Select.Option className="" value="">
                          Select Client
                        </Select.Option>
                        {clientList?.map((element) => (
                          <Select.Option value={element?._id}>
                            {element?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.clientId && (
                    <p className="text-red-500 text-sm">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>
              )}
              {category !== "employe" && (
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
                </div>
              )}
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Reason <span className="text-red-600">*</span>
                </label>
               
                <Controller
                  control={control}
                  name="reason"
                  rules={{ required: "reason is required" }}
                 
                  render={({ field }) => (
                    <AutoComplete
                      className="w-full"
                      {...field}
                      onChange={(value) => {

                        field.onChange(value);
                      }}
                      options={sortByPropertyAlphabetically(VisitReasonList)?.map((type) => ({
                        value: type?.title,
                      }))}
                      
                    >
                      <input
                        placeholder="Enter Reason"

                        className={`${inputClassName}`
                        }
                      />
                    </AutoComplete>
                  )}
                />
                {errors.reason && (
                  <p className="text-red-500 text-sm">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              {category === "employe" && (
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
                </div>
              )}
              {category === "employe" && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("date", {
                      required: "Date is required",
                    })}
                    className={` ${inputClassName} ${errors.date
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Date of Birth"
                  />
                  {errors.date && (
                    <p className="text-red-500 text-sm">
                      {errors.date.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:my-2 my-4">
              <div className="col-span-2">
                <label className={`${inputLabelClassName}`}>
                  Address {category !== 'general' && <span className="text-red-600">*</span>}
                </label>
                <input
                  type="text"
                  {...register("PDAddress", {
                    required: category !== 'general' ? "Address is required" : false
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-4 my-3 ">
              <div>
                <div className={`${inputLabelClassName}`}>
                  Country {category !== 'general' && <span className="text-red-600">*</span>}
                </div>
                <Controller
                  control={control}
                  name="PDCountry"
                  rules={{ required: category !== 'general' ? "Country is required" : false }}
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
              <div>
                <div className={`${inputLabelClassName}`}>
                  State {category !== 'general' && <span className="text-red-600">*</span>}
                </div>
                <Controller
                  control={control}
                  name="PDState"
                  rules={{ required: category !== 'general' ? "State is required" : false }}
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

              {/* City Field */}
              <div>
                <div className={`${inputLabelClassName}`}>
                  City {category !== "general" && <span className="text-red-600">*</span>}
                </div>
                <Controller
                  control={control}
                  name="PDCity"
                  rules={{ required: category !== 'general' ? "City is required" : false }}
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
              <div>
                <label className={`${inputLabelClassName}`}>
                  Pin Code {category !== 'general' && <span className="text-red-600">*</span>}
                </label>
                <Controller
                  control={control}
                  name="PDPinCode"
                  rules={{ required: category !== 'general' ? "Pincode is required" : false }}
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
                    Code <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="PDMobileCode"
                    rules={{ required: "code is required" }}
                    render={({ field }) => (
                      <CustomMobileCodePicker field={field} errors={errors} />
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
                    Mobile No <span className="text-red-600">*</span>
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
            <div className="flex justify-end my-2">
              <button
                type="submit"
                disabled={visitorLoading}
                className={`${visitorLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
              >
                {visitorLoading ? <Loader /> : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loader2 />
      )}
    </GlobalLayout>
  );
}

export default UpdateVisitor;