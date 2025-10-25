import { useEffect, useState } from "react";
import { Controller, useForm, useFieldArray, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  getLocationDataByPincode,
  inputClassName,
  inputLabelClassName,
  inputerrorClassNameAutoComplete,
} from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import { useNavigate } from "react-router-dom";
import { countrySearch } from "../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../global/address/city/CityFeatures/_city_reducers";
import { getEmployeeDocument } from "../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { createEmploye } from "./employeFeatures/_employe_reducers";
import { encrypt } from "../../config/Encryption";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { directorSearch } from "../Director/director/DirectorFeatures/_director_reducers";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import Switch from 'react-switch';
import { AutoComplete, Input } from "antd";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";


const CreateEmploye = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const [step, setStep] = useState(1);
  const [toggle, setToggle] = useState(false);
  // const [familyDetails, setFamilyDetails] = useState([{ id: Date.now() }]);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      familyDetails: [
        {
          name: "",
          email: "",
          mobile: {
            code: "",
            number: "",
          },
          relationship: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "familyDetails",
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
  const PrintPassword = useWatch({
    control,
    name: "PDpassword",
    defaultValue: "",
  });
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
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: userDepartmentId,
  });
  const directorId = useWatch({
    control,
    name: "PDDirectorId",
    defaultValue: userDirectorId,
  });
  const designationId = useWatch({
    control,
    name: "PDDesignationId",
    defaultValue: userDesignationId,
  });
  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
    defaultValue: "",
  });

  const isTl = useWatch({ name: 'isTl', control });
  const isHr = useWatch({ name: 'isHr', control });

  useEffect(() => {
    if (isHr && isTl) {
      setValue('isHr', false);
    }

  }, [isTl]);
  useEffect(() => {
    if (isTl && isHr) {
      setValue('isTl', false);
    }
  }, [isHr]);



  useEffect(() => {
    if (PrintPincode && PrintPincode.length >=4 &&
      PrintPincode.length <= 6 ) {
      getLocationDataByPincode(PrintPincode)
        .then((data) => {
          if (data) {
            setValue("PDCity", data?.city);
            setValue("PDState", data?.state);
            setValue("PDCountry", data?.country);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [PrintPincode]);

  useEffect(() => {
    setValue("PDMobileCode", "+91");
    setValue("PDSecondaryCode", "+91");
  }, []);



  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        companyId: companyId,
        directorId: "",
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        isTL: data?.isTl,
        isHR: data?.isHr,
        firstName: "",
        lastName: "",
        fullName: data?.PDFullName,
        profileImage: '',
        officeEmail: data?.PDemail,
        email: data?.PDemail,
        userType: "employee",
        // password: data?.PDpassword,
        mobile: {
          code: data?.PDMobileCode ?? "",
          number: data?.PDMobileNo ?? "",
        },
        employeProfile: {
          secondaryEmail: data?.PDSecondaryEmail ?? "",
          secondaryMobile: {
            code: data?.PDSecondaryCode ?? "",
            number: data?.PDSecondaryMobileNo ?? ""
          },
          familyDetails: data?.familyDetails
        },
        addresses: {
          primary: {
            street: data?.PDAddress ?? "",
            city: data?.PDCity ?? "",
            state: data?.PDState ?? "",
            country: data?.PDCountry ?? "",
            pinCode: data?.PDPinCode ?? ""
          },
          secondary: {
            street: data?.PDSecondaryAddress ?? "",
            city: data?.PDSecondaryCity ?? "",
            state: data?.PDSecondaryState ?? "",
            country: data?.PDSecondaryCountry ?? "",
            pinCode: data?.PDSecondaryPinCode ?? ""
          },
        },
        generalInfo: {
          gender: data?.PDGender,
          dateOfBirth: data?.PDDateOfBirth,
          maritalStatus: data?.PDMaritalStatus
        },
      };
      dispatch(createEmploye(finalPayload)).then((output) => {
        if (!output.error) {
          navigate(`/admin/employe/edit/${encrypt(output?.payload?.companyinfo?.data?._id)}`);
        }
      });
    }
  };

  const navTabClick = (clickedStep) => {
    if (clickedStep !== 1) {
      showNotification({
        message: "First submit Primary Details",
        type: 'error',
      });
    }
  };

  const handleFocusCompany = () => {
    if (!companyList?.length) {
      dispatch(companySearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
      );
    }
  };

  const handleCompanyChange = (event) => {
    setValue("PDCompanyId", event.target.value);
    setValue("PDBranchId", "");
    setValue("PDDirectorId", "");
    dispatch(directorSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: event.target.value
    })
    );
    dispatch(branchSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: event.target.value
    })
    );
  }

  const handleFocusDirector = () => {
    if (!directorLists) {
      dispatch(directorSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId
      })
      );
    }
  };

  const handleBranchChange = (event) => {
    setValue("PDBranchId", event.target.value);
    setValue("PDDepartmentId", "");
    dispatch(deptSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: companyId,
      branchId: event.target.value
    })
    );
  }

  const handleFocusBranch = () => {
    if (!branchList && userType === "company") {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
      })
      );
    }
  }

  const handleDepartmentChange = (event) => {
    setValue("PDDepartmentId", event.target.value);
    setValue("PDDesignationId", "");
    dispatch(designationSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      departmentId: event.target.value
    })
    );
  }

  const handleFocusDepartment = () => {
    if (!departmentListData ) {
      dispatch(deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
        branchId: branchId
      })
      );
    }
  }

  const handleCountryChange = (event) => {
    setValue("PDCountry", event.target.value);
    setValue("PDState", "");
    dispatch(
      stateSearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: event.target.value,
      })
    );
  };

  const handleFocusCountry = (event) => {
    setValue("PDState", "");
    dispatch(
      countrySearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
  };

  const handleStateChange = (event) => {
    setValue("PDState", event.target.value);
    setValue("PDCity", "");
    dispatch(
      citySearch({
        isPagination: false,
        text: event.target.value,
        sort: true,
        status: true,
        countryId: "",
        stateId: event.target.value,
      })
    );
  };

  useEffect(()=>{
    dispatch(
      countrySearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
  },[])
  return (
    <GlobalLayout>
      <div className="grid grid-cols-12 gap-2">
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 md:col-span-12 col-span-12">
          <div className="flex bg-header justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
            <button
              type="button"
              onClick={() => navTabClick(1)}
              className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
            >
              {step === 1 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold text-nowrap">
                Primary Details
              </span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(2)}
              className={`flex flex-col items-center relative pb-3 ${step === 2 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Family Details</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(3)}
              className={`flex flex-col items-center relative pb-3 ${step === 3 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
            >
              {step === 3 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Social Media</span>
            </button>
          </div>

          {step === 1 && (
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDFullName", {
                      required: "Branch Name is required",
                    })}
                    className={`placeholder: ${inputClassName} ${errors.PDFullName
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Full Name"
                  />
                  {errors.PDFirstName && (
                    <p className="text-red-500 text-sm">
                      {errors.PDFirstName.message}
                    </p>
                  )}
                </div>

                {userType === "admin" && (
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Company <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("PDCompanyId", {
                        required: "Company is required",
                      })}
                      className={`${inputClassName}  ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                        } `}
                      onChange={handleCompanyChange}
                      onFocus={handleFocusCompany}
                    >
                      <option value="">Select Company</option>
                      {companyList?.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company?.userName}({company?.fullName})
                        </option>
                      ))}
                    </select>
                    {errors.PDCompanyId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDCompanyId.message}
                      </p>
                    )}
                  </div>
                )}

                {/* {(userType === "admin" || userType === "company") && (
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Director <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("PDDirectorId", {
                        required: "Director is required",
                      })}
                      className={`${inputClassName}  ${errors.PDDirectorId ? "border-[1px] " : "border-gray-300"
                        } `}
                      onFocus={handleFocusDirector}
                    >
                      <option value="">Select Director</option>
                      {directorLists?.map((director) => (
                        <option key={director._id} value={director._id}>
                          {director.userName}({director?.fullName})
                        </option>
                      ))}
                    </select>
                    {errors.PDDirectorId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDDirectorId.message}
                      </p>
                    )}
                  </div>
                )} */}

                {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Branch <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("PDBranchId", { required: "Branch is required" })}
                      className={`${inputClassName}  ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                        } `}
                      onChange={handleBranchChange}
                      onFocus={handleFocusBranch}
                    >
                      <option value="">Select Branch</option>
                      {branchList?.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.userName}({branch.fullName})
                        </option>
                      ))}
                    </select>
                    {errors.PDBranchId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDBranchId.message}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Department<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDDepartmentId", {
                      required: "Department is required",
                    })}
                    className={` ${inputClassName} ${errors.PDDepartmentId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    onFocus={handleFocusDepartment}
                    onChange={handleDepartmentChange}
                  >
                    <option className="" value="">
                      Select Department
                    </option>
                    {departmentListData?.map((element) => (
                      <option value={element?._id}>
                        {element?.name}
                      </option>
                    ))}
                  </select>
                  {errors.PDDepartmentId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDepartmentId.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Designation <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDDesignationId", {
                      required: "Designation is required",
                    })}
                    className={` ${inputClassName} ${errors.PDDesignationId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Designation
                    </option>
                    {designationList?.map((type) => (
                      <option value={type?._id}>{type?.name}</option>
                    ))}
                  </select>
                  {errors.PDDesignationId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDesignationId.message}
                    </p>
                  )}
                </div>
              </div>
{/* 
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    {...register("PDpassword", {
                      required: "Password is required",
                    })}
                    className={` ${inputClassName} ${errors.PDpassword ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Password"
                  />
                  {errors.PDpassword && (
                    <p className="text-red-500 text-sm">
                      {errors.PDpassword.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Confirm Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    {...register("PDConfirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === PrintPassword || "Passwords do not match",
                    })}
                    className={` ${inputClassName} ${errors.PDConfirmPassword
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Re-enter Password"
                  />
                  {errors.PDConfirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.PDConfirmPassword.message}
                    </p>
                  )}
                </div>
              </div> */}

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
                    className={`${inputClassName} ${errors.PDAddress ? "border-[1px] " : "border-gray-300"
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
                <div>
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
                <div>
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


                <div>
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

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Email<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("PDemail", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={` ${inputClassName} ${errors.PDemail ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Email"
                  />
                  {errors.PDemail && (
                    <p className="text-red-500 text-sm">
                      {errors.PDemail.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="w-[150px]">
                    <label className={`${inputLabelClassName}`}>
                      Code<span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("PDMobileCode", {
                        required: "MobileCode is required",
                      })}
                      className={` ${inputClassName} ${errors.PDMobileCode
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
               
                    </select>
                    {errors[`PDMobileCode`] && (
                      <p className="text-red-500 text-sm">
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

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Alternate Email
                  </label>
                  <input
                    type="email"
                    {...register("PDSecondaryEmail", {

                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className={` ${inputClassName} ${errors.PDSecondaryEmail ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Alternate Email"
                  />
                  {errors.PDSecondaryEmail && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondaryEmail.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <div className="w-[150px]">
                    <label className={`${inputLabelClassName}`}>
                      Code
                    </label>
                    <select
                      {...register("PDSecondaryCode")}
                      className={` ${inputClassName} ${errors.PDSecondaryCode
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
                    </select>
                    {errors[`PDSecondaryCode`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`PDSecondaryCode`].message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Altername Mobile no
                    </label>
                    <input
                      type="number"
                      {...register(`PDSecondaryMobileNo`, {

                        minLength: {
                          value: 10,
                          message: "Must be exactly 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Must be exactly 10 digits",
                        },
                      })}
                      className={` ${inputClassName} ${errors[`PDSecondaryMobileNo`]
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Alternate Mobile No"
                      maxLength={10}
                      onInput={(e) => {
                        if (e.target.value.length > 10) {
                          e.target.value = e.target.value.slice(0, 10);
                        }
                      }}
                    />
                    {errors[`PDSecondaryMobileNo`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`PDSecondaryMobileNo`].message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Date of Birth<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="PDDateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker  field={field} errors={errors}  disabledDate={(current) => {
                        return current && current.isAfter(moment().endOf('day'), 'day');
                      }} /> 
                    )}
                  />
                  {errors.PDDateOfBirth && (
                    <p className="text-red-500 text-sm">
                      {errors.PDDateOfBirth.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Gender<span className="text-red-600">*</span>
                  </label>

                  <select
                    {...register("PDGender", {
                      required: "Gender is required",
                    })}
                    className={` ${inputClassName} ${errors.PDGender
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors[`PDGender`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`PDGender`].message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Maritial Status<span className="text-red-600">*</span>
                  </label>

                  <select
                    {...register("PDMaritalStatus", {
                      required: "Gender is required",
                    })}
                    className={` ${inputClassName} ${errors.PDMaritalStatus
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Status
                    </option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  {errors[`PDMaritalStatus`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`PDMaritalStatus`].message}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col justify-between mb-2">
                    <label className={`${inputLabelClassName}`}>
                      TL
                    </label>
                    <div className="flex items-center">
                      <Controller
                        name="isTl"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                            className="react-switch"
                          />
                        )}
                      />
                    </div>
                    {errors.isTl && (
                      <p className="text-red-500 text-sm">
                        {errors.isTl.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col justify-between">
                    <label className={`${inputLabelClassName}`}>
                      HR
                    </label>
                    <div className="flex items-center">
                      <Controller
                        name="isHr"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            {...field}
                            checked={field.value}
                            onChange={(checked) => field.onChange(checked)}
                            className="react-switch mb-2"
                          />
                        )}
                      />
                    </div>
                    {errors.isHr && (
                      <p className="text-red-500 text-sm">
                        {errors.isHr.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateEmploye;
