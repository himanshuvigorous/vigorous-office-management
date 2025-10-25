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
import Loader from "../../../global_layouts/Loader/Loader";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { AutoComplete, Input, Select } from "antd";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import dayjs from "dayjs";
import { VisitReasonTypeSearch } from "../visitreason/visitReasonFeatures/_visitReason_type_reducers";
import getUserIds from "../../../constents/getUserIds";
import ListLoader from "../../../global_layouts/ListLoader";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { getGeneralVisitorDetails, resetState, updateGeneralVisitor } from "../visitor/visitorFeatures/_visitor_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { getClientDetails } from "../../userManagement/userFeatures/_user_reducers";
import Loader2 from "../../../global_layouts/Loader/Loader2";

function UpdateClientVisitor() {
  const { loading: visitorLoading } = useSelector(state => state.visitor);
  const [clientDepartments, setClientDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [pageLoading, setPageLoading] = useState(false);
  const [pageLoading2, setPageLoading2] = useState(false);
  const [pageLoading3, setPageLoading3] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitorIdEnc } = useParams();
  const visitorId = decrypt(visitorIdEnc);
    const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { generalVisitorDetails } = useSelector((state) => state.visitor);
  const { employeList } = useSelector((state) => state.employe);
  const {  clientList ,loading: clientLoading} = useSelector((state) => state.client);
  const { VisitReasonList } = useSelector((state) => state.visitReason);
  const departmentIds = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: [],
  });
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
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
  const fetchClientData = async () => {
    // Early return if conditions aren't met
    if (!generalVisitorDetails || !(generalVisitorDetails?.category === 'client' || category === 'client')) {
      return;
    }

    setPageLoading3(true);
    
    try {
      const result = await dispatch(
        clientSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: generalVisitorDetails?.companyId,
          branchId: generalVisitorDetails?.branchId,
        })
      );

      if (!result?.error) {
        setValue("clientId", generalVisitorDetails?.clientId);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      // Optionally handle the error (show toast, etc.)
    } finally {
      setPageLoading3(false);
    }
  };

  fetchClientData();
}, [generalVisitorDetails, category]);


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
    const fetchData = async () => {
      try {
        setPageLoading(true)
        const reqData = {
          _id: visitorId,
        };
        await dispatch(getGeneralVisitorDetails(reqData))
         setPageLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

    };

    fetchData();
    return ()=>{
      dispatch(resetState())
    }
  }, []);

useEffect(() => {
  const fetchVisitorData = async () => {
    if (!generalVisitorDetails) return;
     setPageLoading2(true)
    try {
      // Fetch department data
      const departmentResult = await dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: generalVisitorDetails?.companyId,
          branchId: generalVisitorDetails?.branchId,
        })
      );

      if (departmentResult?.error) {
        throw new Error('Failed to fetch department data');
      }

      // Set department value
      if (Array.isArray(generalVisitorDetails?.departmentIds) && generalVisitorDetails.departmentIds.length > 0) {
        setValue("PDDepartmentId", generalVisitorDetails.departmentIds[0]);
      }

      // Fetch employee data
      const employeeResult = await dispatch(
        employeSearch({
          directorId: "",
          companyId: generalVisitorDetails?.companyId,
          branchId: generalVisitorDetails?.branchId,
          departmentId: generalVisitorDetails?.departmentId,
          text: "",
          sort: true,
          status: "",
          isPagination: false,
        })
      );

      if (employeeResult?.error) {
        throw new Error('Failed to fetch employee data');
      }

      // Set basic form values
      setValue("designationName", generalVisitorDetails?.name);
      setValue("companyId", generalVisitorDetails?.companyId);
      setValue("branchId", generalVisitorDetails?.branchId);

      // Set contact person if available
      if (Array.isArray(generalVisitorDetails?.employeIds) && generalVisitorDetails.employeIds.length > 0) {
        setValue("contactPersonId", generalVisitorDetails.employeIds[0]);
      }

      setValue("employeId", generalVisitorDetails?.employeId);

      // Fetch visit reason in parallel with other operations
      const visitReasonPromise = dispatch(
        VisitReasonTypeSearch({
          companyId: generalVisitorDetails?.companyId,
          directorId: "",
          branchId: generalVisitorDetails?.branchId,
          text: "",
          sort: true,
          status: true,
          isPagination: false
        })
      );

      // Set remaining form values
      setValue("visitorName", generalVisitorDetails?.name);
      setValue("numberOfPerson", generalVisitorDetails?.numberOfPerson);
      setValue("status", generalVisitorDetails?.status);
      setValue("PDPinCode", generalVisitorDetails?.address?.pinCode);
      setValue("PDMobileCode", generalVisitorDetails?.mobile?.code);
      setValue("PDMobileNo", generalVisitorDetails?.mobile?.number);
      setValue("PDAddress", generalVisitorDetails?.address?.street);
      setValue("category", generalVisitorDetails?.category);
      setValue("kilometer", generalVisitorDetails?.kilometer);
      setValue("date", dayjs(generalVisitorDetails?.date));
      setValue("startTime", dayjs(generalVisitorDetails?.timeDurationStart));
      setValue("endTime", dayjs(generalVisitorDetails?.timeDurationEnd));

      // Wait for visit reason promise to resolve
      const visitReasonResult = await visitReasonPromise;
      if (!visitReasonResult?.error) {
        setValue("reason", generalVisitorDetails?.reason);
      }
setPageLoading2(false)
    } catch (error) {
      console.error("Error loading visitor data:", error);
      // Handle error appropriately (show toast, etc.)
    }
  };

  fetchVisitorData();

}, [generalVisitorDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: visitorId,
      companyId: generalVisitorDetails?.companyId,
      directorId: "",
      branchId: generalVisitorDetails?.branchId,
      departmentIds: data?.PDDepartmentId ? [data?.PDDepartmentId] : [],
      employeIds: data?.contactPersonId ? [data?.contactPersonId] : [],
      name: data?.visitorName,
      reason: data?.reason,
      kilometer: data?.kilometer,
      numberOfPerson: Number(data?.numberOfPerson),
      clientId: category == "client" ? data?.clientId : null,
      employeId: data?.employeId,
      category: category,
      timeDurationStart: data?.startTime,
      "timeDurationEnd": data?.endTime,
      date: data?.date,
      address: {
        street: data?.PDAddress ?? "",
      },
      mobile: {
        number: data?.PDMobileNo ?? "",
        code: data?.PDMobileCode ?? "",
      },
    };
    dispatch(updateGeneralVisitor(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  const [options, setOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectAllActive, setSelectAllActive] = useState(false);
  const [selectAllEmployeeActive, setSelectAllEmployeeActive] = useState(false);
  const allOptionValues = options?.map((option) => option.value);
  const allEmployeeOptionValues = (employeeOptions?.map((option) => option.value));

  const selectAllValue = "__all__"; // Custom value for the "Select All" option
  const selectAllEmployeeValue = "__all__"
  const mergedOptions = [
    {
      label: "Select All",
      value: selectAllValue,
    },
    ...options,
  ];

  const mergedEmployeeOptions = [
    {
      label: "Select All",
      value: selectAllEmployeeValue,
    },
    ...(Array.isArray(employeeOptions) ? employeeOptions : []),
  ];
useEffect(()=>{
  const list = departmentListData?.map((element) => (
        {
          label: element?.name,
          value: element?._id,
          searchText: element?.name?.toLowerCase(),
        }));
      setOptions(list ?? []);
},[departmentListData])

useEffect(()=>{
    const list = employeList?.map((element) => ( {
            label:element?.fullName,
            value: element?._id,
            searchText: element?.fullName?.toLowerCase(),
          }));
        setEmployeeOptions(list ?? []);
},[employeList])

 



  const handleEmployeeFocus = () => {
    const reqPayload = {
         companyId: generalVisitorDetails?.companyId,
      directorId: "",
      branchId: generalVisitorDetails?.branchId,
      departmentId: departmentIds,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
      "multipleDepartmentId":[] ,
    };
    dispatch(employeSearch(reqPayload))
  };

console.log('loading' , pageLoading , pageLoading2 , pageLoading3);

  return (
    <GlobalLayout>
    {(pageLoading || pageLoading2 || pageLoading3) ?  <Loader2 />   :  <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-5"
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
                    className={` ${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    onChange={(value) => {
                      field.onChange(value);

                    }}
                  >
                    <Select.Option className="" value="">
                      Select Category
                    </Select.Option>
                    <Select.Option value="general">
                      Employee Visitor
                    </Select.Option>
                    <Select.Option value="client">
                      client Visitor
                    </Select.Option>
                  </Select>
                )}
              />
              {errors[`category`] && (
                <p className="text-red-500 text-sm">
                  {errors[`category`].message}
                </p>
              )}
            </div>
            {category == 'client' && <div className="w-full">
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
                    defaultValue={""}
                    className={` ${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    onFocus={() => {

                    }}
                    onChange={async (value) => {
                      field.onChange(value);
                      const res = await dispatch(getClientDetails({ _id: value }));

                      if (res?.payload?.data?.departmentData) {
                        setClientDepartments(res.payload.data.departmentData);
                      } else {
                        setClientDepartments([]);
                      }
                    }}
                  >
                    <Select.Option className="" value="">
                      Select Client
                    </Select.Option>
                    {clientLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : clientList?.map((element) => (
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
            </div>}
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
                rules={{ required: "At least one Department is required" }}
                render={({ field }) => {
                  return (
                    <Select
                    {...field}
                      placeholder="Assign To"
                      size="large"
                      style={{ width: "100%" }}
                      options={mergedOptions}
                      className='inputAntdMultipleSelectClassName'
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  );
                }}
              />


              {errors.PDDepartmentId && (
                <p className="text-red-500 text-sm">
                  {errors.PDDepartmentId.message}
                </p>
              )}
            </div>
            {category === "employe" && (
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Employe <span className="text-red-600">*</span>
                </label>
                <select
                  onFocus={() => {
                    const reqPayload = {
                      directorId: "",
                      companyId: generalVisitorDetails?.companyId,
                      branchId: generalVisitorDetails?.branchId,
                      departmentId: departmentId,
                      text: "",
                      sort: true,
                      status: "",
                      isPagination: false,
                    };
                    dispatch(employeSearch(reqPayload));
                  }}
                  {...register("employeId", {
                    required: "Employe is required",
                  })}
                  className={` ${inputClassName} ${errors.employeId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <option className="" value="">
                    Select Employe
                  </option>
                  {employeList?.map((element) => (
                    <option value={element?._id}>{element?.fullName}</option>
                  ))}
                </select>
                {errors.employeId && (
                  <p className="text-red-500 text-sm">
                    {errors.employeId.message}
                  </p>
                )}
              </div>
            )}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Contact Person <span className="text-red-600">*</span>
              </label>
              <Controller
                name="contactPersonId"
                control={control}
                rules={{ required: "At least one Contact Person is required" }}
                render={({ field }) => {
              
                  return (
                    <Select
                    {...field}
                      // mode="multiple"
                      placeholder="Assign To"
                      onFocus={handleEmployeeFocus}
                      size="large"
                      style={{ width: "100%" }}
                      options={mergedEmployeeOptions || []}
                      className='inputAntdMultipleSelectClassName'
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  );
                }}
              />
              {errors.contactPersonId && (
                <p className="text-red-500 text-sm">
                  {errors.contactPersonId.message}
                </p>
              )}
            </div>
            <div className="">
              {/* Start Time Input Field */}
              <label className={`${inputLabelClassName}`}>
                Start Time <span className="text-red-600">*</span>
              </label>

              <Controller
                name="startTime"
                control={control}
                showTime={true}
                rules={{
                  required: "Start Time  is required",
                }}
                format="DD/MM/YYYY HH:mm"
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    showTime={true}
                    format="DD/MM/YYYY HH:mm"
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current && current.isBefore(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />

              {errors.startTime && (
                <p className="text-red-500 text-sm">
                  {errors.startTime.message}
                </p>
              )}
            </div>
            <div className="">
              {/* Start Time Input Field */}
              <label className={`${inputLabelClassName}`}>
                End Time <span className="text-red-600">*</span>
              </label>

              <Controller
                name="endTime"
                control={control}
                showTime={true}
                rules={{
                  required: "ENd Time  is required",
                }}
                format="DD/MM/YYYY HH:mm"
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    showTime={true}
                    format="DD/MM/YYYY HH:mm"
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current && current.isBefore(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />

              {errors.endTime && (
                <p className="text-red-500 text-sm">
                  {errors.endTime.message}
                </p>
              )}
            </div>
            <div className="">
              {/* Start Time Input Field */}
              <label className={`${inputLabelClassName}`}>
                Date <span className="text-red-600">*</span>
              </label>

              <Controller
                name="date"
                control={control}

                rules={{
                  required: "date  is required",
                }}

                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current.isBefore(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />

              {errors.date && (
                <p className="text-red-500 text-sm">
                  {errors.date.message}
                </p>
              )}
            </div>
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
                      placeholder="Enter Country"


                      className={`${inputClassName}`
                      }
                    />
                  </AutoComplete>
                )}
              />
              {errors[`reason`] && (
                <p className="text-red-500 text-sm">
                  {errors[`reason`].message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-2 my-4">
            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Address{" "}
                {category !== "general" && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <input
                type="text"
                {...register("PDAddress", {
                  required:
                    category !== "general" ? "Address is required" : false,
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
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={visitorLoading}
              className={`${visitorLoading ? "bg-gray-400" : "bg-header"
                } text-white p-2 px-4 rounded mt-3`}
            >
              {visitorLoading ? <Loader /> : "Submit"}
            </button>
          </div>
        </form>
      </div >}
    </GlobalLayout >
  );
}

export default UpdateClientVisitor;