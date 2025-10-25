import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
//import { createDesignation } from "./designationFeatures/_designation_reducers";

import {
  domainName,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import getUserIds from "../../../constents/getUserIds";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { createVisitor } from "./visitorFeatures/_visitor_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { AutoComplete, Input, Select } from "antd";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { employeSearch } from "../../../pages/employeManagement/employeFeatures/_employe_reducers";
import { visitorCatSearch } from "../visitorCategories/visitorCategoryFeatures/_visitor_categories_reducers";
import {
  getClientList,
  clientSearch,
  getClientDetails,
} from "../../client/clientManagement/clientFeatures/_client_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import moment from "moment";
import Loader from "../../../global_layouts/Loader";
import { VisitReasonTypeSearch } from "../visitreason/visitReasonFeatures/_visitReason_type_reducers";
import ListLoader from "../../../global_layouts/ListLoader";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { decrypt } from "../../../config/Encryption";

function CreateVisitor() {
  const { loading: visitorLoading } = useSelector((state) => state.visitor);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [options, setOptions] = useState([]);
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();

  const { clientIdEnc } = useParams();
  const clientId = decrypt(clientIdEnc);

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeList, loading: employeeLoading } = useSelector((state) => state.employe);
  const { clientList,loading:clientLoading } = useSelector((state) => state.client);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { VisitReasonList, loading: visitReasonLoading } = useSelector((state) => state.visitReason);

  const [clientDepartments, setClientDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });

  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
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

  const category = useWatch({
    control,
    name: "category",
    defaultValue: "",
  });

  const client = useWatch({
    control,
    name: "clientId",
    defaultValue: "",
  });

  const [clientData, setClientData] = useState();



  useEffect(() => {

    dispatch(
      VisitReasonTypeSearch({
        companyId: companyId,
        directorId: "",
        branchId: branchId,
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  }, [branchId, companyId]);

  useEffect(() => {
    const filteredClient = clientList?.find((data) => data._id === client);
    // setClientData(filteredClient);


    // setValue("visitorName", filteredClient?.fullName);
    setValue("PDAddress", filteredClient?.addresses?.primary?.street);
    setValue("PDState", filteredClient?.addresses?.primary?.state);
    setValue("PDCountry", filteredClient?.addresses?.primary?.country);
    setValue("PDCity", filteredClient?.addresses?.primary?.city);
    setValue("PDPinCode", filteredClient?.addresses?.primary?.pinCode);
    setValue("PDMobileCode", filteredClient?.mobile?.code);
    setValue("PDMobileNo", filteredClient?.mobile?.number);
  }, [client]);




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
    if (companyId || userType === "company" || userType === "companyDirector") {
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
  }, [companyId]);

  const handleFocusDepartment = () => {
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: branchId,
      })
    );
  };


  useEffect(() => {
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: branchId,
      })
    );
  }, [])

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: companyId,
      directorId: "",
      branchId: branchId,
      departmentId: departmentId,
      name: data?.visitorName,
      contactPersonId: data?.contactPersonId,
      reason: data?.reason,
      visitReasonId: data?.reason,
      numberOfPerson: Number(data?.numberOfPerson),
      clientId: data?.clientId,
      employeId: data?.employeId,
      category: data?.category,
      kilometer: Number(data?.kilometer),
      date: moment(),
      checkInTime: moment(),
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

    dispatch(createVisitor(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

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
            setValue("PDMobileCode", "+91");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [PrintPincode]);

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 md:my-2">
            {userType === "admin" && (
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>


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
                          const reqPayload = {
                            text: "",
                            sort: true,
                            status: "",
                            companyId: companyId,
                            isPagination: false,
                          };
                          dispatch(branchSearch(reqPayload));
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
                      setSelectedCategory(value);
                    }}
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

                  </Select>
                )}
              />
              {errors[`category`] && (
                <p className="text-red-500 text-sm">
                  {errors[`category`].message}
                </p>
              )}
            </div>

            {watch('category') == "existing" && <div className="w-full">
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
                      const reqPayload = {
                        directorId: "",
                        companyId: companyId,
                        branchId: branchId,
                        userType: "client",
                        text: "",
                        sort: true,
                        status: "",
                        isPagination: false,
                      };
                      dispatch(clientSearch(reqPayload));
                    }}
                    onChange={async (value) => {
                      setValue('clientId', value)
                      const res = await dispatch(getClientDetails({ _id: value }));

                      if (res?.payload?.data?.departmentData) {
                        setClientDepartments(res.payload.data.departmentData);
                        setValue('visitorName', res.payload.data.fullName)
                      } else {
                        setClientDepartments([]);
                      }
                    }}
                  >
                    <Select.Option className="" value="">
                      Select Client
                    </Select.Option>
                    {clientLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (clientList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {element?.fullName}
                      </Select.Option>
                    )))}
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
                rules={{ required: "Department is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDDepartmentId ? '' : 'border-gray-300'}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    // onChange={(value) => {
                    //   field.onChange(value);
                    // }}
                    // onFocus={handleFocusDepartment}
                    onChange={async (value) => {
                      field.onChange(value);
                      setSelectedDepartmentId(value);

                      const reqPayload = {
                        directorId: "",
                        companyId: companyId,
                        branchId: branchId,
                        departmentId: value,
                        text: "",
                        sort: true,
                        status: "",
                        isPagination: false,
                      };
                      const res = await dispatch(employeSearch(reqPayload));

                    }}
                    placeholder="Select Department"
                  >
                    <Select.Option value="">Select Department</Select.Option>
                    {/* {depLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (departmentListData?.map((element) => (
                      <Select.Option key={element?._id} value={element?._id}>
                        {element?.name}
                      </Select.Option>
                    )))} */}
                    {selectedCategory === "existing"
                      ? (
                        clientDepartments?.length === 0
                          ? <Select.Option disabled>No departments available</Select.Option>
                          : clientDepartments?.map((element) => (
                            <Select.Option key={element._id} value={element._id}>
                              {element.name}
                            </Select.Option>
                          ))
                      ) : (
                        depLoading
                          ? <Select.Option disabled><ListLoader /></Select.Option>
                          : departmentListData?.map((element) => {
                            return (
                              <Select.Option key={element._id} value={element._id}>
                                {element.name}
                              </Select.Option>
                            );
                          })
                      )
                    }
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
                        isBranch: true,
                        isDirector: true,
                      };
                      dispatch(employeSearch(reqPayload)).then((empResponse) => {
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
                      });
                    }}
                    placeholder="Select Person"
                    options={options}
                  >
                    {/* <Select.Option className="" value="">
                      Select Person
                    </Select.Option>
                    {employeeLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (employeList?.map((element) => (
                      <Select.Option value={element?._id}>
                        {element?.fullName}
                      </Select.Option>
                    )))} */}
                  </Select>
                )}
              />
              {errors.contactPersonId && (
                <p className="text-red-500 text-sm">
                  {errors.contactPersonId.message}
                </p>
              )}
            </div>

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
                    notFoundContent={<ListLoader />}
                  >
                    <input
                      placeholder="Enter Reason"


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
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:my-2 my-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-4 my-3">
            <div>
              <div className={`${inputLabelClassName}`}>
                Country{" "}
                {category !== "general" && (
                  <span className="text-red-600">*</span>
                )}
              </div>
              <Controller
                control={control}
                name="PDCountry"
                rules={{
                  required:
                    category !== "general" ? "Country is required" : false,
                }}
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
                State{" "}
                {category !== "general" && (
                  <span className="text-red-600">*</span>
                )}
              </div>
              <Controller
                control={control}
                name="PDState"
                rules={{
                  required:
                    category !== "general" ? "State is required" : false,
                }}
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
                City{" "}
                {category !== "general" && (
                  <span className="text-red-600">*</span>
                )}
              </div>
              <Controller
                control={control}
                name="PDCity"
                rules={{
                  required: category !== "general" ? "City is required" : false,
                }}
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
                Pin Code{" "}
                {category !== "general" && (
                  <span className="text-red-600">*</span>
                )}
              </label>
              <Controller
                control={control}
                name="PDPinCode"
                rules={{
                  required:
                    category !== "general" ? "Pincode is required" : false,
                }}
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

                {/* <select
                            {...register("PDMobileCode", {
                              required: "MobileCode is required",
                            })}
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
                            className={` ${inputClassName} ${
                              errors.PDMobileCode
                                ? "border-[1px] "
                                : "border-gray-300"
                            }`}
                          >
                            <option className="" value="">
                              Select Mobile Code
                            </option>
                            {countryListData?.docs?.map((type) => (
                              <option value={type?.countryMobileNumberCode}>
                                {type?.countryMobileNumberCode}
                              </option>
                            ))}
                          </select> */}
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
export default CreateVisitor;