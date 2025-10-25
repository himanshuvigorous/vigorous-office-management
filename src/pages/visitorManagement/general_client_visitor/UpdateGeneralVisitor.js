import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { decrypt } from "../../../config/Encryption";
import {
  domainName,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputerrorClassNameAutoComplete,
  sortByPropertyAlphabetically,
} from "../../../constents/global";

import Loader from "../../../global_layouts/Loader/Loader";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { visitorCatSearch } from "../visitorCategories/visitorCategoryFeatures/_visitor_categories_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
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
import { getGeneralVisitorDetails, getVisitorDetails, updateGeneralVisitor, updateVisitor } from "../visitor/visitorFeatures/_visitor_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";

function UpdateGeneralVisitor() {
  const { loading: visitorLoading } = useSelector(state => state.visitor);
   const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
   const { companyList, companyListLoading } = useSelector((state) => state.company);
   const { branchList, branchListloading } = useSelector((state) => state.branch);
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visitorIdEnc } = useParams();
  const visitorId = decrypt(visitorIdEnc);
  const { generalVisitorDetails } = useSelector((state) => state.visitor);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);

  const { employeList, loading: employeeListLoading } = useSelector((state) => state.employe);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { clientList } = useSelector((state) => state.client);
  const { VisitReasonList, loading: visitorReasonListLoading } = useSelector((state) => state.visitReason);
  const PrintAddress = useWatch({
    control,
    name: "PDAddress",
    defaultValue: "",
  });
    const departmentIds = useWatch({
      control,
      name: "PDDepartmentId",
      defaultValue:[],
    });
  
  const PrintCity = useWatch({
    control,
    name: "PDCity",
    defaultValue: "",
  });
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
    const fetchData = async () => {
      
        const reqPayload = {
                            text: "",
                            sort: true,
                            status: "",
                            isPagination: false,
                            companyId: companyId,
                          };
                          dispatch(branchSearch(reqPayload));
                          
      try {
        const reqData = {
          _id: visitorId,
        };
        await dispatch(getGeneralVisitorDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      
    };

    fetchData();
  }, []);

  useEffect(() => {

    if (generalVisitorDetails) {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: generalVisitorDetails?.companyId,
          branchId: generalVisitorDetails?.branchId,
        })
      ).then((departmentdata) => {
        if (!departmentdata?.error) {
          setValue("PDDepartmentId", generalVisitorDetails?.departmentId)
          dispatch(employeSearch({
            directorId: "",
            companyId: generalVisitorDetails?.companyId,
            branchId: generalVisitorDetails?.branchId,
            departmentId: generalVisitorDetails?.departmentId,
            text: "",
            sort: true,
            status: "",
            isPagination: false,
          })).then((data) => {
            if (!data.error) {
              setValue("designationName", generalVisitorDetails?.name);
              setValue("companyId", generalVisitorDetails?.companyId);
              setValue("branchId", generalVisitorDetails?.branchId);
              setValue("contactPersonId", generalVisitorDetails?.contactPersonId);
              setValue("employeId", generalVisitorDetails?.employeId);
              dispatch(VisitReasonTypeSearch({
                "companyId": generalVisitorDetails?.companyId,
                "directorId": "",
                "branchId": generalVisitorDetails?.branchId,
                "text": "",
                "sort": true,
                "status": true,
                "isPagination": false
              })).then(vistorResponse => {
                if (!vistorResponse?.error) {

                  setValue("reason", generalVisitorDetails?.reason);
                }
              })
              setValue("visitorName", generalVisitorDetails?.name);
              // setValue("clientId", generalVisitorDetails?.clientId);
              setValue("numberOfPerson", generalVisitorDetails?.numberOfPerson);
              setValue("status", generalVisitorDetails?.status);
              setValue("PDPinCode", generalVisitorDetails?.address?.pinCode);
              setValue("PDMobileCode", generalVisitorDetails?.mobile?.code);
              setValue("PDMobileNo", generalVisitorDetails?.mobile?.number);
              setValue("PDAddress", generalVisitorDetails?.address?.street);
              setValue("category", generalVisitorDetails?.category);
              setValue("kilometer", generalVisitorDetails?.kilometer);
          
        

        // ✅ Set selected department IDs in form
        setValue("PDDepartmentId", generalVisitorDetails?.departmentIds || []);
               setValue("contactPersonId", generalVisitorDetails?.employeIds);
              setValue("date", dayjs(generalVisitorDetails?.date));
              setValue("startTime", dayjs(generalVisitorDetails?.timeDurationStart));
              setValue("endTime", dayjs(generalVisitorDetails?.timeDurationEnd));
              // setValue("date", moment(generalVisitorDetails?.date).format("YYYY-MM-DD"));
            }
          });
        }
      })


      dispatch(
        clientSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: generalVisitorDetails?.companyId,
          branchId: generalVisitorDetails?.branchId,
        })
      ).then((data) => {
        setValue("clientId", generalVisitorDetails?.clientId);
      });
    }
  }, [generalVisitorDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: visitorId,
      companyId: generalVisitorDetails?.companyId,
      directorId: "",
      branchId: generalVisitorDetails?.branchId,
    
      
      departmentIds: data?.PDDepartmentId,
      name: data?.visitorName,
      employeIds: data?.contactPersonId,
      reason: data?.reason,
     
      numberOfPerson: Number(data?.numberOfPerson),
      clientId: data?.clientId,
      employeId: data?.employeId,
      category: 'general',

      timeDurationStart: data?.startTime,
     "timeDurationEnd": data?.endTime,
     date:data?.date,
      address: {
        street: data?.PDAddress ?? "",
        // city: data?.PDCity ?? "",
        // state: data?.PDState ?? "",
        // country: data?.PDCountry ?? "",
        // pinCode: data?.PDPinCode ?? "",
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

   const companyId = useWatch({
      control,
      name: "companyId",
      defaultValue: userCompanyId,
    });
  
    const branchId = useWatch({
      control,
      name: "branchId",
      defaultValue: '',
    });
  


     const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
      );

     const [options, setOptions] = useState([]);
     const [employeeOptions, setEmployeeOptions] = useState([]);
  
      const [employeeSelectedOption, setEmployeeSelectedOption] = useState([]);
    
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
        dispatch(
         
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
          branchId: branchId,
        })
     
      ).then((dep) => {
        const list = dep?.payload?.data?.docs?.map((element) => (
  
          {
            label:element?.name,
              
             
  
          
  
            value: element?._id,
           searchText: element?.name?.toLowerCase(),
          }));
        setOptions(list);
      });


        const reqPayload = {
                          directorId: "",
                          companyId: companyId,
                          branchId: branchId,
                          departmentId: selectedDepartmentId,
                          text: "",
                          sort: true,
                          status: "",
                          isPagination: false,
                            "multipleDepartmentId": departmentIds,
                        };
                        dispatch(employeSearch(reqPayload))
     
      .then((empResponse) => {
        const list = empResponse?.payload?.data?.docs?.map((element) => (
  
          {
            label:            
                element?.fullName,
              
             
  
          
  
            value: element?._id,
           searchText: element?.fullName?.toLowerCase(),
          }));
        setEmployeeOptions(list);
      });
    
      },[])



        const handleFocus = () => {
      dispatch(
         
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
          branchId: branchId,
        })
     
      ).then((dep) => {
        const list = dep?.payload?.data?.docs?.map((element) => (
  
          {
            label:element?.name,
              
             
  
          
  
            value: element?._id,
           searchText: element?.name?.toLowerCase(),
          }));
        setOptions(list);
      });




    };
  
  
  
       const handleEmployeeFocus = () => {
  
         
       const reqPayload = {
                          directorId: "",
                          companyId: companyId,
                          branchId: branchId,
                          departmentId: selectedDepartmentId,
                          text: "",
                          sort: true,
                          status: "",
                          isPagination: false,
                            "multipleDepartmentId": departmentIds,
                        };
                        dispatch(employeSearch(reqPayload))
     
      .then((empResponse) => {
        const list = empResponse?.payload?.data?.docs?.map((element) => (
  
          {
            label:            
                element?.fullName,
              
             
  
          
  
            value: element?._id,
           searchText: element?.fullName?.toLowerCase(),
          }));
        setEmployeeOptions(list);
      });
    };
  



  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userType === "admin" && (
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                {/* <select
                  onFocus={() => {
                    const reqPayload = {
                      "text": "",
                      "sort": true,
                      "status": "",
                      "isPagination": false,
                    }
                    dispatch(companySearch(reqPayload))
                  }}
                  {...register("companyId", {
                    required: "Company is required",
                  })}
                  className={` ${inputClassName} ${errors.companyId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Company
                  </option>
                  {companyList?.map((element) => (
                    <option value={element?._id}>
                      {element?.fullName}
                    </option>
                  ))}
                </select> */}

                <Controller
                  control={control}
                  name="companyId"
                  rules={{ required: "Company is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={` ${inputAntdSelectClassName} ${errors.companyId
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      onFocus={() => {
                        const reqPayload = {
                          text: "",
                          sort: true,
                          status: "",
                          isPagination: false,
                        };
                        dispatch(companySearch(reqPayload));
                      }}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (companyList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.companyId && (
                  <p className="text-red-500 text-sm">
                    {errors.companyId.message}
                  </p>
                )}
              </div>
            )}
            {(userType === "admin" ||
              userType === "company" ||
              userType === "companyDirector") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Branch <span className="text-red-600">*</span>
                  </label>
                  {/* <select
                  onFocus={() => {
                    const reqPayload = {
                      companyId: companyId,
                      directorId: "",
                      "text": "",
                      "sort": true,
                      "status": "",
                      "isPagination": false,
                    }
                    dispatch(branchSearch(reqPayload))
                  }}
                  {...register("branchId", {
                    required: "Branch is required",
                  })}
                  className={` ${inputClassName} ${errors.branchId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Branch
                  </option>
                  {branchList?.map((element) => (
                    <option value={element?._id}>
                      {element?.fullName}
                    </option>
                  ))}
                </select> */}
                  <Controller
                    control={control}
                    name="branchId"
                    rules={{ required: "Branch is required" }}
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
                  {errors.branchId && (
                    <p className="text-red-500 text-sm">
                      {errors.branchId.message}
                    </p>
                  )}
                </div>
              )}

           
            
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
                                      const handleChange = (selected) => {
                                        if (selected.includes(selectAllValue)) {
                                          // If "Select All" was selected
                                          if (selectAllActive) {
                                            // Unselect all
                                            field.onChange([]);
                                            setSelectAllActive(false);
                                          } else {
                                            // Select all actual options
                                            field.onChange(allOptionValues);
                                            setSelectAllActive(true);
                                          }
                                        } else {
                                          field.onChange(selected);
                                          setSelectAllActive(selected.length === allOptionValues.length);
                                        }
                                      };
              
                                      return (
                                        <Select
                                          mode="multiple"
                                          placeholder="Assign To"
                                          value={field.value || []}
                                          onChange={handleChange}
                                          onFocus={handleFocus}
                                          size="large"
                                          style={{ width: "100%" }}
                                          options={mergedOptions}
                                          // className={inputAntdSelectClassName}
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
          
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Contact Person <span className="text-red-600">*</span>
              </label>
              {/* <select
                onFocus={() => {
                  const reqPayload = {
                    directorId: "",
                    companyId: companyId,
                    branchId: branchId,
                    "text": "",
                    "sort": true,
                    "status": "",
                    "isPagination": false,
                  }
                  dispatch(employeSearch(reqPayload))
                }}
                {...register("contactPersonId", {
                  required: "Person is required",
                })}
                className={` ${inputClassName} ${errors.contactPersonId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Person
                </option>
                {employeList?.map((element) => (
                  <option value={element?._id}>
                    {element?.fullName}
                  </option>
                ))}
              </select> */}
              {/* <Controller
                control={control}
                name="contactPersonId"
                rules={{ required: "Contact is required" }}
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
                      if (!selectedDepartmentId) return;
                      const reqPayload = {
                        directorId: "",
                        companyId: companyId,
                        branchId: branchId,
                        departmentId: selectedDepartmentId,
                        text: "",
                        sort: true,
                        status: "",
                        isPagination: false,
                      };
                      dispatch(employeSearch(reqPayload));
                    }}
                    placeholder="Select Person"
                  >
                    <Select.Option className="" value="">
                      Select Person
                    </Select.Option>
                    {employeeLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (employeList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {element?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              /> */}

               <Controller
                                    name="contactPersonId"
                                    control={control}
                                    rules={{ required: "At least one Contact Person is required" }}
                                    render={({ field }) => {
                                      const handleChange = (selected) => {
                                        if (selected.includes(selectAllEmployeeValue)) {
                                          // If "Select All" was selected
                                          if (selectAllEmployeeValue) {
                                            // Unselect all
                                            field.onChange([]);
                                            setSelectAllEmployeeActive(false);
                                          } else {
                                            // Select all actual options
                                            field.onChange(allEmployeeOptionValues);
                                            setSelectAllEmployeeActive(true);
                                          }
                                        } else {
                                          field.onChange(selected);
                                          setSelectAllEmployeeActive(selected.length === allEmployeeOptionValues.length);
                                        }
                                      };
              
                                      return (
                                        <Select
                                          mode="multiple"
                                          placeholder="Assign To"
                                          value={field.value || []}
                                          onChange={handleChange}
                                          onFocus={handleEmployeeFocus}
                                          size="large"
                                          style={{ width: "100%" }}
                                          options={mergedEmployeeOptions||[]}
                                          // className={inputAntdSelectClassName}
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

            {/* {category !== "employe" && (
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
            )} */}
            {/* <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Reason <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("reason", {
                  required: "Reason is required",
                })}
                className={`placeholder: ${inputClassName} ${
                  errors.reason
                    ? "border-[1px] "
                    : "border-gray-300"
                }`}
                placeholder="Enter Reason"
              />
              {errors.designationName && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
            </div> */}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Reason <span className="text-red-600">*</span>
              </label>

              <Controller
                control={control}
                name="reason"
                rules={{ required: "reason is required" }}
                // render={({ field }) => (
                //   <Select
                //     {...field}
                //     defaultValue={""}
                //     className={` ${inputAntdSelectClassName} `}
                //     showSearch
                //     filterOption={(input, option) =>
                //       String(option?.children).toLowerCase().includes(input.toLowerCase())
                //     }
                //   >
                //     <Select.Option className="" value="">
                //       Select reason
                //     </Select.Option>
                //     {VisitReasonList?.map((element, index) => {
                //       return (
                //         <Select.Option key={index} value={element?._id}>
                //           {element?.title}
                //         </Select.Option>
                //       );
                //     })}
                //   </Select>
                // )}

                 render={({ field }) => (
                              <AutoComplete
                                className="w-full"
                                {...field}
                                onChange={(value) => {
      
                                  field.onChange(value);
                                }}
                                options={sortByPropertyAlphabetically(VisitReasonList)?.map((type) => ({
                                  value: type?.title  ,
                                }))}
                                notFoundContent={<ListLoader/>}
                              >
                                <input
                                  placeholder="Enter Country"
    
                                  // onFocus={() => {
                                  //   dispatch(
                                  //     countrySearch({
                                  //       isPagination: false,
                                  //       text: "",
                                  //       sort: true,
                                  //       status: true,
                                  //     })
                                  //   );
                                  // }}
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
            {/* {category === "employe" && (
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
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>
            )} */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 md:mt-4">
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
       
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 ">
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
      </div >
    </GlobalLayout >
  );
}

export default UpdateGeneralVisitor;