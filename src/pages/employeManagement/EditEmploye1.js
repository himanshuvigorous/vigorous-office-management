import { useEffect, useState } from "react";
import { useFieldArray, Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  domainName,
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
} from "../../constents/global.js";
import getUserIds from '../../constents/getUserIds';
import { useNavigate, useParams } from "react-router-dom";
import { countrySearch } from "../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../global/address/city/CityFeatures/_city_reducers";
import { getEmployeeDocument } from "../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { decrypt } from "../../config/Encryption.js";
import {
  getEmployeDetails,
  updateEmploye,
} from "./employeFeatures/_employe_reducers.js";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers.js";
import { directorSearch } from "../Director/director/DirectorFeatures/_director_reducers.js";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers.js";
import { deptSearch } from "../department/departmentFeatures/_department_reducers.js";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers.js";
import Switch from 'react-switch';
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager.js";
import Select from "react-select";
import dayjs from "dayjs";



const EditEmploye = () => {
  const { empIdEnc } = useParams();
  const employeId = decrypt(empIdEnc);
  const navigate = useNavigate();

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

  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { employeDetailsData } = useSelector((state) => state.employe);
  const [selectedCountry, setSelectedCountry] = useState();
  const [selectedState, setSelectedState] = useState();
  const [selectedCity, setSelectedCity] = useState();
  const [selectedMobileCode, setSelectedMobileCode] = useState();
  const [selectedSecondaryMobileCode, setSelectedSecondaryMobileCode] = useState();
  const [selectedFDMobileCode, setSelectedFDMobileCode] = useState();
  const [localCountryList, setLocalCountryList] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "family",
  });
  const dispatch = useDispatch();

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
    defaultValue: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Dispatch your actions
        await dispatch(
          countrySearch({
            isPagination: false,
            text: "",
            sort: true,
            status: true,
          })
        );

        const reqData = { _id: employeId };
        await dispatch(getEmployeDetails(reqData));
      } catch (error) {
        console.error("Error during data fetch:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (employeDetailsData?.data) {


      setValue("PDCompanyId", employeDetailsData?.data?.companyData?._id);
      setValue("PDDirectorId", employeDetailsData?.data?.directorData?._id);
      setValue("PDBranchId", employeDetailsData?.data?.branchData?._id);
      setValue("PDDepartmentId", employeDetailsData?.data?.departmentData?._id);
      setValue("PDDesignationId", employeDetailsData?.data?.designationData?._id);
      setValue("isHr", employeDetailsData?.data?.isHR)
      setValue("isTl", employeDetailsData?.data?.isTL)
      setValue("PDStatus", employeDetailsData?.data?.status);

      setValue("PDFullName", employeDetailsData?.data?.fullName);
      setValue("PDFirstName", employeDetailsData?.data?.firstName);
      setValue("PDLastName", employeDetailsData?.data?.lastName);
      setValue("PDTagLine", employeDetailsData?.data?.employeProfile?.tagline);

      setValue("PDAddress", employeDetailsData?.data?.addresses?.primary?.street);
      setValue("PDCountry", employeDetailsData?.data?.addresses?.primary?.country);
      setValue("PDState", employeDetailsData?.data?.addresses?.primary?.state);
      setValue("PDCity", employeDetailsData?.data?.addresses?.primary?.city);
      setValue("PDPinCode", employeDetailsData?.data?.addresses?.primary?.pinCode);

      setSelectedCountry(
        employeDetailsData?.data?.addresses?.primary?.country ? {
          value: employeDetailsData.data.addresses.primary.country,
          label: employeDetailsData.data.addresses.primary.country,
        } : null)

      setSelectedState(
        employeDetailsData?.data?.addresses?.primary?.state ? {
          value: employeDetailsData.data.addresses.primary.state,
          label: employeDetailsData.data.addresses.primary.state,
        } : null)

      setSelectedCity(
        employeDetailsData?.data?.addresses?.primary?.city ? {
          value: employeDetailsData.data.addresses.primary.city,
          label: employeDetailsData.data.addresses.primary.city,
        } : null)

      // Contact details
      setValue("PDEmail", employeDetailsData?.data?.email);
      setValue("PDOfficeEmail", employeDetailsData?.data?.officeEmail);
      setValue("PDMobileCode", employeDetailsData?.data?.mobile?.code);
      setSelectedMobileCode(employeDetailsData?.data?.mobile?.code ? {
        value: employeDetailsData?.data?.mobile?.code,
        label: employeDetailsData?.data?.mobile?.code,
      } : null);
      setSelectedSecondaryMobileCode(employeDetailsData?.data?.employeProfile?.secondaryMobile?.code ? {
        value: employeDetailsData?.data?.employeProfile?.secondaryMobile?.code,
        label: employeDetailsData?.data?.employeProfile?.secondaryMobile?.code,
      } : null);
      setValue("PDMobileNo", employeDetailsData?.data?.mobile?.number);

      // Secondry Contact details
      setValue("PDSecondaryEmail", employeDetailsData?.data?.employeProfile?.secondaryEmail);
      setValue("PDSecondaryCode", employeDetailsData?.data?.employeProfile?.secondaryMobile?.code);
      setValue("PDSecondaryMobileNo", employeDetailsData?.data?.employeProfile?.secondaryMobile?.number);

      // generalInfo
      setValue("PDDateOfBirth", dayjs(employeDetailsData?.data?.generalInfo?.dateOfBirth).format("YYYY-MM-DD"));
      setValue("PDGender", employeDetailsData?.data?.generalInfo?.gender);
      setValue("PDMaritalStatus", employeDetailsData?.data?.generalInfo?.maritalStatus);

      // Social media links (if available)
      if (employeDetailsData?.data?.socialLinks?.length > 0) {
        setValue("SMInstagram", employeDetailsData?.data?.socialLinks[0]?.link);
        setValue("SMTwitter", employeDetailsData?.data?.socialLinks[1]?.link);
        setValue("SMFacebook", employeDetailsData?.data?.socialLinks[2]?.link);
        setValue("SMWebsite", employeDetailsData?.data?.socialLinks[3]?.link);
      }
      // setDesignationList([employeDetailsData?.data?.designationData])

      const existingFamilyDetails = employeDetailsData?.data?.employeProfile?.familyDetails || [];
      if (existingFamilyDetails.length > 0) {
        existingFamilyDetails.forEach((famDetail) => {
          const formattedEmpDetail = { ...famDetail };
          append(formattedEmpDetail);
        });
      } else {
        const emptyFamilyDetail = {
          name: "",
          relation: "",
          age: null,
          contactNumber: {
            code: "",
            number: ""
          },
        };
        append(emptyFamilyDetail);
      }
    }
  }, [employeDetailsData]);

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: employeId,
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        isHR: data?.isHr,
        isTL: data?.isTl,
        firstName: data?.PDFirstName,
        lastName: data?.PDLastName,
        fullName: data?.PDFullName,
        userType: "employee",
        profileImage: "",
        email: data?.PDEmail,
        officeEmail: data?.PDEmail,
        // password: data?.PDPassword,
        status: data?.PDStatus,
        mobile: {
          code: data?.PDMobileCode ?? "",
          number: data?.PDMobileNo ?? "",
        },
        employeProfile: {
          secondaryEmail: data?.PDSecondaryEmail ?? "",
          secondaryMobile: {
            code: data?.PDSecondaryCode ?? "",
            number: data?.PDSecondaryMobileNo ?? "",
          },
          addresses: {
            primary: {
              street: data?.PDAddress ?? "",
              city: data?.PDCity ?? "",
              state: data?.PDState ?? "",
              country: data?.PDCountry ?? "",
              pinCode: data?.PDPinCode ?? "",
            },
            secondary: {
              street: data?.PDSecondaryAddress ?? "",
              city: data?.PDSecondaryCity ?? "",
              state: data?.PDSecondaryState ?? "",
              country: data?.PDSecondaryCountry ?? "",
              pinCode: data?.PDSecondaryPinCode ?? ""
            },
          },
          familyDetails: data?.family,
        },
        generalInfo: {
          gender: data?.PDGender,
          dateOfBirth: data?.PDDateOfBirth,
          maritalStatus: data?.PDMaritalStatus,
        },
      };

      dispatch(updateEmploye(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getEmployeDetails({
              _id: employeId,
            })
          );
          setStep(step + 1);
        }
      });
    }
    if (step === 2) {
      const finalPayload = {
        _id: employeId,
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        isHR: data?.isHr,
        isTL: data?.isTl,
        firstName: data?.PDFirstName,
        lastName: data?.PDLastName,
        fullName: data?.PDFullName,
        userType: "employee",
        profileImage: "",
        email: data?.PDEmail,
        officeEmail: data?.PDOfficeEmail,
        // password: data?.PDPassword,
        status: data?.PDStatus,
        mobile: {
          code: data?.PDMobileCode ?? "",
          number: data?.PDMobileNo ?? "",
        },
        employeProfile: {
          secondaryEmail: data?.PDSecondaryEmail ?? "",
          secondaryMobile: {
            code: data?.PDSecondaryCode ?? "",
            number: data?.PDSecondaryMobileNo ?? "",
          },
          addresses: {
            primary: {
              street: data?.PDAddress ?? "",
              city: data?.PDCity ?? "",
              state: data?.PDState ?? "",
              country: data?.PDCountry ?? "",
              pinCode: data?.PDPinCode ?? "",
            },
            secondary: {
              street: data?.PDAddress ?? "",
              city: data?.PDCity ?? "",
              state: data?.PDState ?? "",
              country: data?.PDCountry ?? "",
              pinCode: data?.PDPinCode ?? "",
            },
          },
          familyDetails: data?.family,
        },
        generalInfo: {
          gender: data?.PDGender,
          dateOfBirth: data?.PDDateOfBirth,
          maritalStatus: data?.PDMaritalStatus,
        },
        socialLinks: [
          {
            "name": "Instagram",
            "link": data?.SMInstagram,
          },
          {
            "name": "Twitter",
            "link": data?.SMTwitter
          },
          {
            "name": "Facebook",
            "link": data?.SMFacebook
          },
          {
            "name": "Website",
            "link": data?.SMWebsite
          }
        ],
      };

      dispatch(updateEmploye(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(getEmployeDetails({
            _id: employeId
          }))
          setStep(step + 1);
        }
      })

    }
    if (step === 3) {
      const finalPayload = {
        _id: employeId,
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        isHR: data?.isHr,
        isTL: data?.isTl,
        firstName: data?.PDFirstName,
        lastName: data?.PDLastName,
        fullName: data?.PDFullName,
        userType: "employee",
        profileImage: "",
        email: data?.PDEmail,
        officeEmail: data?.PDOfficeEmail,
        // password: data?.PDPassword,
        status: data?.PDStatus,
        mobile: {
          code: data?.PDMobileCode ?? "",
          number: data?.PDMobileNo ?? "",
        },
        employeProfile: {
          secondaryEmail: data?.PDSecondaryEmail ?? "",
          secondaryMobile: {
            code: data?.PDSecondaryCode ?? "",
            number: data?.PDSecondaryMobileNo ?? "",
          },
          addresses: {
            primary: {
              street: data?.PDAddress ?? "",
              city: data?.PDCity ?? "",
              state: data?.PDState ?? "",
              country: data?.PDCountry ?? "",
              pinCode: data?.PDPinCode ?? "",
            },
            secondary: {
              street: data?.PDAddress ?? "",
              city: data?.PDCity ?? "",
              state: data?.PDState ?? "",
              country: data?.PDCountry ?? "",
              pinCode: data?.PDPinCode ?? "",
            },
          },
          familyDetails: data?.family,
        },
        generalInfo: {
          gender: data?.PDGender,
          dateOfBirth: data?.PDDateOfBirth,
          maritalStatus: data?.PDMaritalStatus,
        },
        socialLinks: [
          {
            "name": "Instagram",
            "link": data?.SMInstagram,
          },
          {
            "name": "Twitter",
            "link": data?.SMTwitter
          },
          {
            "name": "Facebook",
            "link": data?.SMFacebook
          },
          {
            "name": "Website",
            "link": data?.SMWebsite
          }
        ],
      };

      dispatch(updateEmploye(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(getEmployeDetails({
            _id: employeId
          }))
          // setStep(step + 1);
          navigate(`/admin/employe`);
        }
      })
    }
  };

  const handleAddMore = () => {
    const familyData = watch("family");

    const hasBlankFields = familyData.some(
      (field) =>
        !field.relation?.trim() ||
        !field.name?.trim() ||
        !field.age || isNaN(Number(field.age)) ||
        !field.contactNumber?.code?.trim() ||
        !field.contactNumber?.number?.trim()
    );

    if (hasBlankFields) {
      showNotification({
        message: "First fill family details",
        type: "error",
      });
      return;
    }

    append({
      relation: "",
      name: "",
      age: "",
      contactNumber: {
        code: "+91",
        number: "",
      },
    });
  };


  const navTabClick = (clickedStep) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    } else {
      setStep(clickedStep);
    }
  };

  const handleFocusCompany = () => {
    if (!branchList?.length) {
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
    if (!directorLists?.length) {
      dispatch(directorSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: employeDetailsData?.data?.companyData?._id,
      })
      );
    }
  };

  const handleFocusBranch = () => {
    if (!branchList?.length) {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: employeDetailsData?.data?.companyData?._id,
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
      companyId: employeDetailsData?.data?.companyData?._id,
      branchId: event.target.value
    })
    );
  }

  const handleFocusDepartment = () => {
    if (!departmentListData?.length) {
      dispatch(deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: employeDetailsData?.data?.companyData?._id,
        branchId: employeDetailsData?.data?.branchData?._id
      })
      );
    }
  };

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

  const handleFocusDesignation = () => {
    if (!designationList?.length) {
      dispatch(designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: employeDetailsData?.data?.departmentData?._id
      })
      );
    }
  };

  const handleFocusMobileCode = () => {
    if (!countryListData?.docs?.length) {
      dispatch(countrySearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
      );
    }
  };

  const handleFocusCountry = () => {
    if (!localCountryList?.docs?.length) {
      setLocalCountryList(countryListData);
    }
  };

  const handleCountryChange = (e) => {
    const value = e.target.value || "";
    setValue("PDCountry", value);
    setValue("PDState", "");
    dispatch(
      stateSearch({
        isPagination: false,
        text: value,
        sort: true,
        status: true,
        countryId: "",
      })
    );
  };

  const handleFocusState = () => {
    if (!stateListData?.docs?.length) {
      dispatch(stateSearch({
        isPagination: false,
        text: employeDetailsData.data?.addresses?.primary?.country,
        sort: true,
        status: true,
      })
      );
    }
  };

  const handleStateChange = (e) => {
    const value = e.target.value || "";
    setValue("PDState", value);
    setValue("PDCity", "");
    dispatch(
      citySearch({
        isPagination: false,
        text: value,
        sort: true,
        status: true,
        countryId: "",
        stateId: value,
      })
    );
  };

  const handleFocusCity = () => {
    if (!stateListData?.docs?.length) {
      dispatch(citySearch({
        isPagination: false,
        text: employeDetailsData.data?.addresses?.primary?.state,
        sort: true,
        status: true,
      })
      );
    }
  };

  const handleCityChange = (selectedOption) => {
    const value = selectedOption?.value || "";
    setValue("PDCity", value);
    // setSelectedCity(selectedOption);
  };

  return (
    <GlobalLayout>
      <div className="grid grid-cols-12 gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 md:col-span-12 col-span-12"
        >
          <div className="flex bg-header justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
            <button
              type="button"
              onClick={() => navTabClick(1)}
              className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-500"
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
              className={`flex flex-col items-center relative pb-3 ${step === 2 ? "text-white ]" : "text-gray-500"
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
              className={`flex flex-col items-center relative pb-3 ${step === 3 ? "text-white ]" : "text-gray-500"
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
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  {userType === "admin" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Company <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDCompanyId", {
                          required: "Company is required",
                        })}
                        className={`${inputClassName}  ${errors.PDCompanyId
                          ? "border-[1px] "
                          : "border-gray-300"
                          } `}
                        onChange={handleCompanyChange}
                        onFocus={handleFocusCompany}
                      >
                        <option value="">Select Company</option>
                        {/* {companyList?.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company?.userName}({company?.fullName})
                          </option>
                        ))} */}
                        {!companyList?.length ? (
                          <option value={employeDetailsData?.data?.companyData?._id}>
                            {employeDetailsData?.data?.companyData?.fullName || "Loading..."}
                          </option>
                        ) : (
                          <>
                            <option value="">Select Director</option>
                            {companyList.map((type) => (
                              <option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {errors.PDCompanyId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDCompanyId.message}
                        </p>
                      )}
                    </div>
                  )}

                  {(userType === "admin" || userType === "company") && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Director <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDDirectorId", {
                          required: "Director is required",
                        })}
                        className={`${inputClassName}  ${errors.PDDirectorId
                          ? "border-[1px] "
                          : "border-gray-300"
                          } `}
                        onFocus={handleFocusDirector}
                      >
                        {/* <option value="">Select Director</option>
                        {directorLists?.map((director) => (
                          <option key={director._id} value={director._id}>
                            {director.userName}({director?.fullName})
                          </option>
                        ))} */}


                        {!directorLists?.length ? (
                          <option value={employeDetailsData?.data?.directorData?._id}>
                            {employeDetailsData?.data?.directorData?.fullName || "Loading..."}
                          </option>
                        ) : (
                          <>
                            <option value="">Select Director</option>
                            {directorLists.map((type) => (
                              <option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {errors.PDDirectorId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDDirectorId.message}
                        </p>
                      )}
                    </div>
                  )}
                  {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Branch <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDBranchId", {
                          required: "Branch is required",
                        })}
                        className={`${inputClassName}  ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                          } `}
                        onChange={handleBranchChange}
                        onFocus={handleFocusBranch}
                      >
                        {/* <option value="">Select Branch</option>
                        {branchList?.map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.userName}({branch.fullName})
                          </option>
                        ))} */}

                        {!branchList?.length ? (
                          <option value={employeDetailsData?.data?.branchData?._id}>
                            {employeDetailsData?.data?.branchData?.fullName || "Loading..."}
                          </option>
                        ) : (
                          <>
                            <option value="">Select Branch</option>
                            {branchList.map((type) => (
                              <option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {errors.PDBranchId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDBranchId.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDFullName", {
                        required: "Branch Name is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.PDFullName ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Full Name"
                    />
                    {errors.PDFirstName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDFirstName.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
                    <select
                      {...register("PDStatus", {
                        required: "Status is required",
                      })}
                      className={` ${inputClassName} ${errors.PDStatus ? "border-[1px] " : "border-gray-300"
                        }`}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                    {errors.PDStatus && (
                      <p className="text-red-500 text-sm">
                        {errors.PDStatus.message}
                      </p>
                    )}
                  </div>
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
                      onChange={handleDepartmentChange}
                      onFocus={handleFocusDepartment}
                    >
                      {!departmentListData?.length ? (
                        <option value={employeDetailsData?.data?.departmentData?._id}>
                          {employeDetailsData?.data?.departmentData?.name || "Loading..."}
                        </option>
                      ) : (
                        <>
                          <option value="">Select Department</option>
                          {departmentListData.map((type) => (
                            <option key={type?._id} value={type?._id}>
                              {type?.name}
                            </option>
                          ))}
                        </>
                      )}
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
                      onFocus={handleFocusDesignation}
                    >
                      {!designationList?.length ? (
                        <option value={employeDetailsData?.data?.designationData?._id}>
                          {employeDetailsData?.data?.designationData?.name || "Loading..."}
                        </option>
                      ) : (
                        <>
                          <option value="">Select Designation</option>
                          {designationList.map((type) => (
                            <option key={type?._id} value={type?._id}>
                              {type?.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {errors.PDDesignationId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDDesignationId.message}
                      </p>
                    )}
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Country</label>
                    <select
                      {...register("PDCountry", {
                        required: "Country is required",
                      })}
                      className={` ${inputClassName} ${errors.PDCountry ? "border-[1px] " : "border-gray-300"
                        }`}
                      onChange={handleCountryChange}
                      onFocus={handleFocusCountry}
                    >
                      {!localCountryList?.docs?.length ? (
                        <option value={employeDetailsData?.data?.addresses?.primary?.country}>
                          {employeDetailsData?.data?.addresses?.primary?.country || "Loading..."}
                        </option>
                      ) : (
                        <>
                          <option value="">Select Country</option>
                          {localCountryList?.docs.map((type) => (
                            <option key={type?._id} value={type?.name}>
                              {type?.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>

                    {/* <Select
                      options={
                        countryListData?.docs?.map((type) => ({
                          value: type?.name,
                          label: type?.name,
                        })) || []
                      }
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      onFocus={handleFocusCountry}
                      // onInputChange={handleInputChange}
                      isClearable
                      placeholder="Select or type a country"
                      className={` ${errors.PDCountry ? "border-[1px] " : "border-gray-300"}`}
                    /> */}

                    {errors.PDCountry && (
                      <p className="text-red-500 text-sm">
                        {errors.PDCountry.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      State<span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("PDState", {
                        required: "State is required",
                      })}
                      className={` ${inputClassName} ${errors.PDState ? "border-[1px] " : "border-gray-300"
                        }`}
                      onChange={handleStateChange}
                      onFocus={handleFocusState}
                    >
                      {!stateListData?.docs?.length ? (
                        <option value={employeDetailsData?.data?.addresses?.primary?.state}>
                          {employeDetailsData?.data?.addresses?.primary?.state || "Loading..."}
                        </option>
                      ) : (
                        <>
                          <option value="">Select State</option>
                          {stateListData?.docs.map((type) => (
                            <option key={type?._id} value={type?.name}>
                              {type?.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>

                    {/* <Select
                      options={
                        stateListData?.docs?.map((type) => ({
                          value: type?.name,
                          label: type?.name,
                        })) || []
                      }
                      value={selectedState}
                      onChange={handleStateChange}
                      onFocus={handleFocusState}
                      // isClearable
                      placeholder="Select or type a state"
                      className={` ${errors.PDState ? "border-[1px] " : "border-gray-300"}`}
                    /> */}

                    {errors.PDState && (
                      <p className="text-red-500 text-sm">
                        {errors.PDState.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      City<span className="text-red-600">*</span>
                    </label>
                    {/* <Select
                      options={
                        cityListData?.docs?.map((type) => ({
                          value: type?.name,
                          label: type?.name,
                        })) || []
                      }
                      value={selectedCity}
                      onChange={handleCityChange}
                      onFocus={handleFocusCity}
                      // onInputChange={handleInputChange}
                      isClearable
                      placeholder="Select or type a city"
                      className={` ${errors.PDCity ? "border-[1px] " : "border-gray-300"}`}
                    /> */}

                    <select
                      {...register("PDCity", {
                        required: "City is required",
                      })}
                      className={` ${inputClassName} ${errors.PDCity ? "border-[1px] " : "border-gray-300"
                        }`}
                      // onChange={handleCityChange}
                      onFocus={handleFocusCity}
                    >
                      {!cityListData?.docs?.length ? (
                        <option value={employeDetailsData?.data?.addresses?.primary?.city}>
                          {employeDetailsData?.data?.addresses?.primary?.city || "Loading..."}
                        </option>
                      ) : (
                        <>
                          <option value="">Select City</option>
                          {cityListData?.docs.map((type) => (
                            <option key={type?._id} value={type?.name}>
                              {type?.name}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {errors.PDCity && (
                      <p className="text-red-500 text-sm">
                        {errors.PDCity.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Pin Code
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("PDPinCode", {
                        required: "Pin Code is required",
                      })}
                      className={`${inputClassName} ${errors.PDPinCode ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter pin Code"
                      maxLength={6}
                      onInput={(e) => {
                        if (e.target.value.length > 6) {
                          e.target.value = e.target.value.slice(0, 6);
                        }
                      }}
                    />
                    {errors.PDPinCode && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPinCode.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Email<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("PDEmail", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={` ${inputClassName} ${errors.PDEmail ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Email"
                    />
                    {errors.PDEmail && (
                      <p className="text-red-500 text-sm">
                        {errors.PDEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Office Email<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("PDOfficeEmail", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={` ${inputClassName} ${errors.PDOfficeEmail ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Office Email"
                    />
                    {errors.PDOfficeEmail && (
                      <p className="text-red-500 text-sm">
                        {errors.PDOfficeEmail.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full flex gap-3">
                    <div className="w-40">
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

                      {/* <Select
                        options={
                          countryListData?.docs?.map((type) => ({
                            value: type?.countryMobileNumberCode,
                            label: type?.countryMobileNumberCode,
                          })) || []
                        }
                        value={selectedMobileCode}
                        onChange={handleMobileCodeChange}
                        onFocus={handleFocusMobileCode}
                        isClearable
                        placeholder="Select Country Code"
                        className={` ${inputClassName} ${errors.PDMobileCode ? "border-[1px] " : "border-gray-300"}`}
                      /> */}
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
                  <div className="w-full">
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
                      className={` ${inputClassName} ${errors.PDSecondaryEmail
                        ? "border-[1px] "
                        : "border-gray-300"
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
                    <div className="w-40">
                      <label className={`${inputLabelClassName}`}>Code</label>
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

                      {/* <Select
                        options={
                          countryListData?.docs?.map((type) => ({
                            value: type?.countryMobileNumberCode,
                            label: type?.countryMobileNumberCode,
                          })) || []
                        }
                        value={selectedSecondaryMobileCode}
                        onChange={handleSecondaryMobileCodeChange}
                        onFocus={handleFocusSecondaryMobileCode}
                        isClearable
                        placeholder="Select Country Code"
                        className={` ${inputClassName} ${errors.PDSecondaryCode ? "border-[1px] " : "border-gray-300"}`}
                      /> */}

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
                    <input
                      type="date"
                      {...register("PDDateOfBirth", {
                        required: "Date of Birth is required",
                      })}
                      className={` ${inputClassName} ${errors.PDDateOfBirth
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Date of Birth"
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
                      className={` ${inputClassName} ${errors.PDGender ? "border-[1px] " : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Gender
                      </option>
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
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4"
                >
                  <div className="flex gap-3">
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Relation Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register(`family[${index}].relation`, {
                          required: "Relation type is required",
                        })}
                        className={`mt-0 ${inputClassName} ${errors.family?.[index]?.relation
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      >
                        <option value="">Select Relation Type</option>

                        {["Father", "Mother", "Spouse", "Child", "Sibling", "Other"].map((relation) => (
                          <option key={relation} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                      {errors.family?.[index]?.relation && (
                        <p className="text-red-500 text-sm">
                          {errors.family[index].relation.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register(`family[${index}].name`, {
                          required: "Name is required",
                        })}
                        className={`${inputClassName} ${errors.family?.[index]?.name
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Name"
                      />
                      {errors.family?.[index]?.name && (
                        <p className="text-red-500 text-sm">
                          {errors.family[index].name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Age <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`family[${index}].age`, {
                          required: "Age is required",
                        })}
                        className={`${inputClassName} ${errors.family?.[index]?.age
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Age"
                      />
                      {errors.family?.[index]?.age && (
                        <p className="text-red-500 text-sm">
                          {errors.family[index].age.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        Code<span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register(
                          `family[${index}].contactNumber.code`,
                          {
                            required: "Mobile Code is required",
                          }
                        )}
                        className={` ${inputClassName} ${errors.family?.[index]?.contactNumber?.code
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
                      {/* <Select
                        options={
                          countryListData?.docs?.map((type) => ({
                            value: type?.countryMobileNumberCode,
                            label: type?.countryMobileNumberCode,
                          })) || []
                        }
                        value={selectedFDMobileCode}
                        onChange={handleFDMobileCodeChange}
                        onFocus={handleFocusFDMobileCode}
                        isClearable
                        placeholder="Select Country Code"
                        className={` ${inputClassName} ${errors.family?.[index]?.contactNumber?.code ? "border-[1px] " : "border-gray-300"}`}
                      /> */}
                      {errors.family?.[index]?.contactNumber?.code && (
                        <p className="text-red-500 text-sm">
                          {
                            errors.family[index]?.contactNumber?.code
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Mobile Number{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(
                          `family[${index}].contactNumber.number`,
                          {
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
                        defaultValue={item.contactNumber.number}
                        className={` ${inputClassName} ${errors.family?.[index]?.contactNumber?.number
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter mobile number"
                      />
                      {errors.family?.[index]?.contactNumber?.number && (
                        <p className="text-red-500 text-sm">
                          {
                            errors.family[index].contactNumber?.number
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-between px-3 pb-2">
                <button
                  type="button"
                  onClick={handleAddMore}
                  // onClick={() =>
                  //   append({
                  //     relation: "",
                  //     name: "",
                  //     age: "",
                  //     contactNumber: {
                  //       code: "",
                  //       number: ""
                  //     },
                  //   })
                  // }
                  className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
                >
                  Add More
                </button>
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                {/* Instagram Link */}
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Instagram Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMInstagram")}
                    className={` ${inputClassName} ${errors.SMInstagram
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    placeholder="Enter Instagram Link"
                  />
                  {errors.SMInstagram && (
                    <p className="text-red-500 text-sm">
                      {errors.SMInstagram.message}
                    </p>
                  )}
                </div>

                {/* Twitter Link */}
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Twitter Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMTwitter")}
                    className={` ${inputClassName} ${errors.SMTwitter ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Twitter Link"
                  />
                  {errors.SMTwitter && (
                    <p className="text-red-500 text-sm">
                      {errors.SMTwitter.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                {/* Facebook Link */}
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Facebook Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMFacebook")}
                    className={` ${inputClassName} ${errors.SMFacebook ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Facebook Link"
                  />
                  {errors.SMFacebook && (
                    <p className="text-red-500 text-sm">
                      {errors.SMFacebook.message}
                    </p>
                  )}
                </div>

                {/* Website Link */}
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Website Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMWebsite")}
                    className={` ${inputClassName} ${errors.SMWebsite ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Website Link"
                  />
                  {errors.SMWebsite && (
                    <p className="text-red-500 text-sm">
                      {errors.SMWebsite.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="submit" className={`${formButtonClassName}`}>
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditEmploye;
