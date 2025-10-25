import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  inputClassName,
  inputDisabledClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
} from "../../../constents/global.js";
import getUserIds from "../../../constents/getUserIds";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption.js";
import {
  getOnBoardingDetails,
  updateOnBoarding,
} from "./onBoardingFeatures/_onBoarding_reducers.js";
import { designationSearch } from "../../designation/designationFeatures/_designation_reducers.js";
import {
  countrySearch,
  secCountrySearch,
} from "../../global/address/country/CountryFeatures/_country_reducers.js";
import {
  secStateSearch,
  stateSearch,
} from "../../global/address/state/featureStates/_state_reducers.js";
import {
  citySearch,
  secCitySearch,
} from "../../global/address/city/CityFeatures/_city_reducers.js";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers.js";
import moment from "moment";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers.js";
import ReactSelect from "react-select";
import { leaveTypeSearch } from "../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers.js";
import { AutoComplete, Input } from "antd";
import {
  AiFillBank,
  AiFillDelete,
  AiOutlinePercentage,
  AiOutlineSkype,
  AiOutlineTeam,
  AiOutlineTrademarkCircle,
  AiOutlineUser,
  AiTwotoneCheckSquare,
  AiTwotoneContacts,
  AiTwotoneContainer,
  AiTwotonePhone,
} from "react-icons/ai";
import { IoPartlySunnyOutline, IoPersonOutline } from "react-icons/io5";
import { FaPhoneAlt, FaRegAddressCard, FaRegBuilding } from "react-icons/fa";
import { IoIosCodeWorking, IoIosMail, IoLogoMarkdown } from "react-icons/io";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import { FaRegFileImage } from "react-icons/fa6";
import ListLoader from "../../../global_layouts/ListLoader.js";

const ViewOnBoardingDetail = () => {
  const navigate = useNavigate();
  const { onBoardingIdEnc } = useParams();
  const onBoardingId = decrypt(onBoardingIdEnc);
  const [step, setStep] = useState(1);
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const { countryListData, secCountryList } = useSelector(
    (state) => state.country
  );
  const { stateListData, secStateList } = useSelector((state) => state.states);
  const { cityListData, secCityList } = useSelector((state) => state.city);
  const { onBoardingDetailsData , loading:onBoardingLoading } = useSelector((state) => state.onBoarding);
  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { leaveListData } = useSelector((state) => state.leaveType);
  const [isFirstEffectComplete, setIsFirstEffectComplete] = useState(false);
  const [localCountryList, setLocalCountryList] = useState();
  const [localSecCountryList, setLocalSecCountryList] = useState();
  const [secondaryAddress, setSecoundarAddress] = useState();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    resetField,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      // family: [
      //   { relation: "",
      //     name: "",
      //     age: "",
      //     contactNumber: "",
      //   }
      // ],
      // emergencyContact: [{
      //   name: "",
      //   relationship: "",
      //   email: "",
      //   mobile: {
      //     code: "",
      //     number: "",
      //   },
      // }],
      // educationDetails: [
      //   {
      //     degree: "",
      //     university: "",
      //     from: "",
      //     to: "",
      //     isPercentage: false,
      //     number: "",
      //     specification: "",
      //   }
      // ],
      // employmentDetails: [
      //   {
      //     organizationName: "",
      //     designationName: "",
      //     from: "",
      //     to: "",
      //     annualCTC: "",
      //   }
      // ]
    },
  });
  const isProbationPeriodActive = useWatch({
    control,
    name: "isProbationPeriod",
    defaultValue: "",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "family",
  });
  const {
    fields: emergencyContactFields,
    append: appendEmergencyContact,
    remove: removeEmergencyContact,
  } = useFieldArray({
    control,
    name: "emergencyContact",
  });
  const {
    fields: educationDetails,
    append: appendEducational,
    remove: removeEducational,
  } = useFieldArray({
    control,
    name: "educationDetails",
  });
  const {
    fields: employmentDetails,
    append: appendEmployment,
    remove: removeEmployment,
  } = useFieldArray({
    control,
    name: "employmentDetails",
  });
  // const {
  //   fields: documentData,
  //   append: appendEmployment,
  //   remove: removeEmployment,
  // } = useFieldArray({
  //   control,
  //   name: "documentData",
  // });
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
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });
  const isTl = useWatch({ name: "isTl", control });
  const isHr = useWatch({ name: "isHr", control });

  useEffect(() => {
    if (isHr && isTl) {
      setValue("isTl", false);
      setValue("isHr", true);
    }
    if (isTl && isHr) {
      setValue("isHr", false);
      setValue("isTl", true);
    }
  }, [isTl, isHr, setValue]);
  useEffect(() => {
    dispatch(
      countrySearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
    );
    setIsFirstEffectComplete(true);
  }, []);

  useEffect(() => {
    if (onBoardingDetailsData) {
      dispatch(
        leaveTypeSearch({
          directorId: "",
          companyId: onBoardingDetailsData?.companyId,
          branchId: onBoardingDetailsData?.branchId,
          employeId: "",
          text: "",
          sort: true,
          status: "",
          isPagination: false,
        })
      );
    }
  }, [onBoardingDetailsData]);

  useEffect(() => {
    if (isFirstEffectComplete) {
      const reqData = {
        _id: onBoardingId,
      };
      dispatch(getOnBoardingDetails(reqData));
      setIsFirstEffectComplete(false);
    }
  }, [isFirstEffectComplete]);

  useEffect(() => {
    if (onBoardingDetailsData) {
      reset({
        familyDetails: [], // Reset the family details
        employementDetails: [], // Reset the employment details
        educationDetails: [], // Reset the education details
        emergencyContact: [], // Reset the emergency contact
      });
      // Set address fields before reset
      setValue("PDAddress", onBoardingDetailsData?.addresses?.primary?.street);
      setValue("PDCity", onBoardingDetailsData?.addresses?.primary?.city);
      setValue("PDcountry", onBoardingDetailsData?.addresses?.primary?.country);
      setValue("PDState", onBoardingDetailsData?.addresses?.primary?.state);
      setValue("PDPin", onBoardingDetailsData?.addresses?.primary?.pinCode);

      // Secondary address
      setValue(
        "PDSecAddress",
        onBoardingDetailsData?.addresses?.secondary?.street
      );
      setValue(
        "PDSecCountry",
        onBoardingDetailsData?.addresses?.secondary?.country
      );
      setValue(
        "PDSecState",
        onBoardingDetailsData?.addresses?.secondary?.state
      );
      setValue("PDSecCity", onBoardingDetailsData?.addresses?.secondary?.city);
      setValue(
        "PDSecPinCode",
        onBoardingDetailsData?.addresses?.secondary?.pinCode
      );

      // reset({
      //   familyDetails: [], // Reset the family details
      //   employementDetails: [], // Reset the employment details
      //   educationDetails: [], // Reset the education details
      //   emergencyContact: [], // Reset the emergency contact
      // });
      setValue("PDFullName", onBoardingDetailsData?.fullName);
      setValue("PDEmail", onBoardingDetailsData?.email);
      setValue("PDmobileCode", onBoardingDetailsData?.mobile?.code);
      setValue("PDOfficeemail", onBoardingDetailsData?.officeEmail);
      setValue(
        "role",
        onBoardingDetailsData?.isHR
          ? "Hr"
          : onBoardingDetailsData?.isTL
            ? "Tl"
            : onBoardingDetailsData?.isManager
              ? "isManager"
              : onBoardingDetailsData?.isReceptionist
                ? "isReceptionist"
                : ""
      );
      setValue("PDCompanyId", onBoardingDetailsData?.companyId);
      setValue("PDDepartmentId", onBoardingDetailsData?.departmentId);
      setValue("PDDesignationId", onBoardingDetailsData?.designationId);
      setValue("shift", onBoardingDetailsData?.shift);
      setValue("workType", onBoardingDetailsData?.workType);
      setValue("PDMobileNo", onBoardingDetailsData?.mobile?.number);

      setValue("gender", onBoardingDetailsData?.generalInfo?.gender);
      setValue("BloodGroup", onBoardingDetailsData?.generalInfo?.bloodGroup);
      setValue(
        "dateOfBirth",
        moment(onBoardingDetailsData?.generalInfo?.dateOfBirth).format(
          "YYYY-MM-DD"
        )
      );
      setValue(
        "maritalStatus",
        onBoardingDetailsData?.generalInfo?.maritalStatus
      );
      setValue(
        "salaryOffered",
        onBoardingDetailsData?.generalInfo?.salaryOffered
      );
      setValue("lastSalary", onBoardingDetailsData?.generalInfo?.lastsalary);
      setValue(
        "dateOfJoining",
        moment(onBoardingDetailsData?.generalInfo?.dateOfJoining).format(
          "YYYY-MM-DD"
        )
      );
      setValue(
        "isProbationPeriod",
        onBoardingDetailsData?.generalInfo?.isProbationPeriod == true
          ? "true"
          : onBoardingDetailsData?.generalInfo?.isProbationPeriod == false
            ? "false"
            : ""
      );
      setValue(
        "probationPeriod",
        onBoardingDetailsData?.generalInfo?.probationPeriod
      );

      onBoardingDetailsData?.familyDetails?.forEach((famDetail) => {
        const formattedEmpDetail = {
          ...famDetail,
        };
        append(formattedEmpDetail);
      });

      onBoardingDetailsData?.employementDetails?.forEach((empDetail) => {
        const formattedEmpDetail = {
          ...empDetail,
          from: moment(empDetail.from).format("YYYY-MM-DD"),
          to: moment(empDetail.to).format("YYYY-MM-DD"),
        };
        appendEmployment(formattedEmpDetail);
      });

      onBoardingDetailsData?.educationDetails?.forEach((eduDetail) => {
        const formattedEduDetail = {
          ...eduDetail,
          from: moment(eduDetail.from).format("YYYY-MM-DD"),
          to: moment(eduDetail.to).format("YYYY-MM-DD"),
        };
        appendEducational(formattedEduDetail);
      });

      onBoardingDetailsData?.emergencyContact?.forEach((emrConDetail) => {
        const formattedEduDetail = {
          ...emrConDetail,
        };
        appendEmergencyContact(formattedEduDetail);
      });

      setValue(
        "SMLinkedIn",
        onBoardingDetailsData?.socialLinks?.find(
          (link) => link.name === "LinkedIn"
        )?.link
      );
      setValue(
        "SMGithub",
        onBoardingDetailsData?.socialLinks?.find(
          (link) => link.name === "GitHub"
        )?.link
      );
    }
  }, [onBoardingDetailsData]);

  useEffect(() => {
    if (onBoardingDetailsData && leaveListData) {
      const selectedleave = leaveListData?.filter((type) =>
        onBoardingDetailsData?.assignLeaves?.includes(type._id)
      );

      if (selectedleave) {
        setValue("leaveTypeId", selectedleave);
      }
    }
  }, [onBoardingDetailsData, leaveListData]);

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: onBoardingId,
        companyId: onBoardingDetailsData?.companyId,
        directorId: onBoardingDetailsData?.directorId,
        branchId: onBoardingDetailsData?.branchId,
        employeId: onBoardingDetailsData?.employeId,
        applicationId: onBoardingDetailsData?.applicationId,
        departmentId: data?.PDDepartmentId,
        designationId: data?.PDDesignationId,
        officeEmail: data?.PDOfficeemail,
        assignLeaves: Array.isArray(data?.leaveTypeId)
          ? data?.leaveTypeId?.map((item) => item._id)
          : data?.leaveTypeId
            ? [data?.leaveTypeId.value]
            : [],
        isTL: data?.role === "Tl" ? true : false,
        isHR: data?.role === "Hr" ? true : false,
        isManager: data?.role === "isManager" ? true : false,
        isReceptionist: data?.role === "isReceptionist" ? true : false,
        firstName: "",
        lastName: "",
        fullName: data?.PDFullName,
        shift: data?.shift,
        workType: data?.workType,
        profileImage: "",
        email: data?.PDEmail,
        mobile: {
          code: data?.PDmobileCode,
          number: data?.PDMobileNo,
        },
        status: data?.status,
        isDeleted: false,
        addresses: {
          primary: {
            street: data?.PDAddress,
            city: data?.PDCity,
            state: data?.PDState,
            country: data?.PDcountry,
            pinCode: data?.PDPin,
          },
          secondary: {
            street: data?.PDSecAddress,
            city: data?.PDSecCity,
            state: data?.PDSecState,
            country: data?.PDSecCountry,
            pinCode: data?.PDSecPinCode,
          },
        },
      };

      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 2) {
      const finalPayload = {
        _id: onBoardingId,
        generalInfo: {
          gender: data?.gender,
          bloodGroup: data?.BloodGroup,
          dateOfBirth: data?.dateOfBirth,
          maritalStatus: data?.maritalStatus,
          salaryOffered: data?.salaryOffered,
          lastsalary: data?.lastSalary,
          dateOfJoining: data?.dateOfJoining,
          designationName: data?.designation,
          isProbationPeriod: data?.isProbationPeriod == "true" ? true : false,
          probationPeriod: data?.isProbationPeriod ? data?.probationPeriod : "",
        },
      };

      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 3) {
      const finalPayload = {
        _id: onBoardingId,
        familyDetails: data?.family,
      };

      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 4) {
      const finalPayload = {
        _id: onBoardingId,
        emergencyContact: data?.emergencyContact,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 5) {
      const finalPayload = {
        _id: onBoardingId,

        educationDetails: data?.educationDetails,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 6) {
      const finalPayload = {
        _id: onBoardingId,

        employementDetails: data?.employmentDetails,
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    } else if (step === 7) {
      const finalPayload = {
        _id: onBoardingId,
        socialLinks: [
          {
            name: "LinkedIn",
            link: data?.SMLinkedIn,
          },
          {
            name: "GitHub",
            link: data?.SMGithub,
          },
        ],
      };
      dispatch(updateOnBoarding(finalPayload)).then((output) => {
        if (!output.error) {
          
          // navigate(
          //   `/admin/onBoarding`
          // );
          const reqData = {
            _id: onBoardingId,
          };
          dispatch(getOnBoardingDetails(reqData));
        }
      });
    }
  };
  const navTabClick = (clickedStep) => {
    setStep(clickedStep);
  };

  const handleDepartmentChange = (event) => {
    setValue("PDDepartmentId", event.target.value);
    setValue("PDDesignationId", "");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        departmentId: event.target.value,
      })
    );
  };
  useEffect(() => {
    if (sameAsCurrentAddress) {
      const currentAddress = {
        address: getValues("PDAddress"),
        country: getValues("PDcountry"),
        state: getValues("PDState"),
        city: getValues("PDCity"),
        pinCode: getValues("PDPin"),
      };
      setValue("PDSecAddress", currentAddress.address);
      setValue("PDSecPinCode", currentAddress.pinCode);
      setValue("PDSecCountry", currentAddress.country);
      setValue("PDSecState", currentAddress.state);
      setValue("PDSecCity", currentAddress.city);
    } else {
      setValue("PDSecAddress", "");
      setValue("PDSecCountry", "");
      setValue("PDSecState", "");
      setValue("PDSecCity", "");
      setValue("PDSecPinCode", "");
    }
  }, [sameAsCurrentAddress]);

  const handleAddressCheckbox = (checked) => {
    setSameAsCurrentAddress(checked);
  };

  return (
    <GlobalLayout>
        <div className="grid grid-cols-12 gap-2">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2  col-span-12 shadow-2xl rounded-xl"
        >
          <div className="flex bg-header justify-start items-center rounded-t-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
            <button
              type="button"
              onClick={() => navTabClick(1)}
              className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-200"
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
              onClick={() => navTabClick(10)}
              className={`flex flex-col items-center relative pb-2 ${step === 10 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 10 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Assign Leave</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(12)}
              className={`flex flex-col items-center relative pb-2 ${step === 12 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 12 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Salary</span>
            </button>
            {/* <button
              type="button"
              onClick={() => navTabClick(2)}
              className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">General Details</span>
            </button> */}
            <button
              type="button"
              onClick={() => navTabClick(3)}
              className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 3 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Family Details </span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(4)}
              className={`flex flex-col items-center relative pb-2 ${step === 4 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 4 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Emergency Contacts</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(5)}
              className={`flex flex-col items-center relative pb-2 ${step === 5 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 5 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Educational Details</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(6)}
              className={`flex flex-col items-center relative pb-2 ${step === 6 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 6 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Past Employment</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(9)}
              className={`flex flex-col items-center relative pb-2 ${step === 9 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 9 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Social Media</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(7)}
              className={`flex flex-col items-center relative pb-2 ${step === 7 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 7 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Document</span>
            </button>
            <button
              type="button"
              onClick={() => navTabClick(8)}
              className={`flex flex-col items-center relative pb-2 ${step === 8 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
            >
              {step === 8 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Bank</span>
            </button>


            {/* <button
              type="button"
              onClick={() => navTabClick(11)}
              className={`flex flex-col items-center relative pb-2 ${step === 11 ? "text-white ]" : "text-gray-600"
                } cursor-pointer`}
            >
              {step === 11 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Emergency Contact</span>
            </button> */}

          </div>
          {  onBoardingLoading ? <div className="w-screen h-screen"><ListLoader /></div> :
<div className="w-full ">

          
          {step === 1 && (
            <div className="overflow-x-auto">
              <div className="grid sm:grid-cols-1 grid-cols-1 gap-4 items-end">
                {/* {userType === "admin" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Company <span className="text-red-600">*</span>
                      </label>
                      <select
                        disabled
                        {...register("PDCompanyId", {})}
                        className={`${inputDisabledClassName}  ${
                          errors.PDCompanyId
                            ? "border-[1px] "
                            : "border-gray-300"
                        } `}
                        // onChange={handleCompanyChange}
                        // onFocus={handleFocusCompany}
                      >
                        {!companyList?.length ? (
                          <option value={onBoardingDetailsData?.companyData?._id}>
                            {onBoardingDetailsData?.companyData?.fullName ||
                              "Loading..."}
                          </option>
                        ) : (
                          <>
                            <option value="">Select Company</option>
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
                  )} */}

                {/* {(userType === "admin" ||
                    userType === "company" ||
                    userType === "companyDirector") && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Branch <span className="text-red-600">*</span>
                      </label>
                      <select
                        disabled
                        {...register("PDBranchId", {})}
                        className={`${inputDisabledClassName}  ${
                          errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                        } `}
                        // onChange={handleBranchChange}
                        // onFocus={handleFocusBranch}
                      >
                        {!branchList?.length ? (
                          <option value={onBoardingDetailsData?.branchData?._id}>
                            {onBoardingDetailsData?.branchData?.fullName ||
                              "Loading..."}
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
                  )} */}

                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                  <thead>
                    <tr>
                      <th className="text-header ">
                        <div className="mt-2 ml-2">Personal Information</div>
                      </th>
                    </tr>
                    <tr></tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {/* Company Name Row */}
                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      
                      <td className="p-3 lg:w-1/2 w-full text-gray-600 ">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline  className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Department
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.departmentData?.name || "N/A"}
                        </span>
                      </td>

                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegBuilding className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Designation*
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.designationData?.name || "N/A"}
                        </span>
                      </td>
                    </tr>

                    {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                        <td className="p-3  text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaPeopleGroup className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Branch Head
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                          </span>
                        </td>

                        <td className="p-3  text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaIndustry className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Remark
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                          </span>
                        </td>
                      </tr> */}

                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">

                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Full Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.fullName || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px]  ml-4   font-light mt-1">
                          {onBoardingDetailsData?.email}
                        </span>
                      </td>
                      {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Desigantion
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.designationData?.name}
                        </span>
                      </td> */}

                      {/* <td className="p-3  text-gray-600">
                          <div className="flex items-center gap-2">
                            <AiOutlineMail className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">Email</span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {branchDetailsData?.data?.email || "N/A"}
                          </span>
                        </td>*/}
                    </tr>

                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.email}
                        </span>
                      </td> */}
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Office Email
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.officeEmail || "N/A"}
                        </span>
                      </td>

                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Reporting Person</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.reportingPersonName}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3 lg:w-1/2 w-full  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Mobile
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.mobile?.code} {" "}
                          {onBoardingDetailsData?.mobile?.number}
                        </span>
                      </td>
                      {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium"> Role</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.isHR
                            ? "Hr"
                            : onBoardingDetailsData?.isTL
                            ? "Tl"
                            : onBoardingDetailsData?.isManager
                            ? "isManager"
                            : onBoardingDetailsData?.isReceptionist
                            ? "isReceptionist"
                            : "Employee"}
                        </span>
                      </td> */}
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Date of Birth
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.generalInfo?.dateOfBirth ? moment( onBoardingDetailsData?.generalInfo?.dateOfBirth).format("DD-MM-YYYY") : "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoLogoMarkdown className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Marital Status
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.generalInfo?.maritalStatus}
                        </span>
                      </td>
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Date Of Joining
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {moment(
                            onBoardingDetailsData?.generalInfo?.dateOfJoining
                          ).format("YYYY-MM-DD")}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoPersonOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Gender
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.generalInfo?.gender ||
                            "N/A"}
                        </span>
                      </td>
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegBuilding className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Blood Group
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.generalInfo?.bloodGroup ||
                            "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">

                    </tr>


                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Select probation
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.generalInfo
                            ?.probationPeriod || "NA"}
                        </span>
                      </td>
                      <td className="p-3 lg:w-1/2 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosCodeWorking className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Selected Work Type
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.workType || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50 col-span-2">
                      <td className="p-3 w-full text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Primary Address
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.primary?.street ||
                            "N/A"}
                          , {onBoardingDetailsData?.addresses?.primary?.city || "N/A"} ,
                          {onBoardingDetailsData?.addresses?.primary?.state || "N/A"} ,
                          {onBoardingDetailsData?.addresses?.primary?.country || "N/A"},{" "}
                          {onBoardingDetailsData?.addresses?.primary?.pinCode || "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3 text-gray-600 lg:w-1/2 w-full">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Country *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.primary?.country}
                        </span>
                      </td>
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            State *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.primary?.state}
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            City *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.primary?.city}
                        </span>
                      </td>
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Pin Code *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.primary?.pinCode}
                        </span>
                      </td>
                    </tr>
                    {/* <tr className=" hover:bg-indigo-50 col-span-2">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaRegAddressCard className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Secondary Address
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.secondary?.street ||
                            "N/A"}
                          , {onBoardingDetailsData?.addresses?.secondary?.city || "N/A"} ,
                          {onBoardingDetailsData?.addresses?.secondary?.state || "N/A"} ,
                          {onBoardingDetailsData?.addresses?.secondary?.country || "N/A"},{" "}
                          {onBoardingDetailsData?.addresses?.secondary?.pinCode || "N/A"}
                        </span>
                      </td>
                    </tr>
                    <tr className="w-full">
                      <td className="p-3 text-gray-600 lg:w-1/2 w-full">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Country *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.secondary?.country}
                        </span>
                      </td>
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            State *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.secondary?.state}
                        </span>
                      </td>
                    </tr>
                    <tr className="w-full">
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            City *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.secondary?.city}
                        </span>
                      </td>
                      <td className="lg:w-1/2 w-full p-3">
                        <div className="flex items-center gap-2">
                          <IoPartlySunnyOutline className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Pin Code *
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {onBoardingDetailsData?.addresses?.secondary?.pinCode}
                        </span>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {step === 2 && (

            <>
              <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                <div>
                  <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                    <thead>
                      <tr>
                        <th className="text-header ">
                          <div className="mt-2 ml-2">General Details</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      {/* Company Name Row */}
                      <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                        {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <IoPersonOutline className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Gender
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo?.gender ||
                              "N/A"}
                          </span>
                        </td> */}

                        {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaRegBuilding className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Blood Group
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo?.bloodGroup ||
                              "N/A"}
                          </span>
                        </td> */}
                      </tr>

                      {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Head
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td>
                    </tr> */}

                      <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                        <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaRegAddressCard className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Select probation
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo
                              ?.probationPeriod || "NA"}
                          </span>
                        </td>
                        <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <IoPersonOutline className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              {" "}
                              Date of Birth
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo?.dateOfBirth ? moment(
                              onBoardingDetailsData?.generalInfo?.dateOfBirth
                            ).format("DD-MM-YYYY") : "N/A"}
                          </span>
                        </td>

                        {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>*/}
                      </tr>

                      <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                        <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <IoLogoMarkdown className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Marital Status
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo?.maritalStatus}
                          </span>
                        </td>
                        <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <IoPersonOutline className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              {" "}
                              Date Of Joining
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {moment(
                              onBoardingDetailsData?.generalInfo?.dateOfJoining
                            ).format("YYYY-MM-DD")}
                          </span>
                        </td>
                        {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <AiFillBank className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              {" "}
                              Salary Offered
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo
                              ?.salaryOffered || "N/A"}
                          </span>
                        </td> */}
                      </tr>

                      <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                        {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                          <div className="flex items-center gap-2">
                            <AiOutlineTeam className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Last Salary
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {onBoardingDetailsData?.generalInfo?.lastsalary}
                          </span>
                        </td> */}

                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {step === 3 && (

            <div>
              {onBoardingDetailsData?.familyDetails?.length > 0 ?
                onBoardingDetailsData?.familyDetails?.map((item, index) => (
                  <div key={index} className=" rounded-md mt-2">
                    <div className="flex justify-between items-center rounded-t-md px-3">
                      <div className="py-2 text-header font-semibold">
                        Family Details {index + 1}
                      </div>
                    </div>
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-1 md:gap-8  "
                    >
                      <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                        <thead>
                          <tr>
                            <th className="text-header "></th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                          {/* Company Name Row */}
                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTrademarkCircle className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Relationship Type
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.relation}
                              </span>
                            </td>

                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineUser className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Name
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.name}
                              </span>
                            </td>
                          </tr>

                          {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Head
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td>
                    </tr> */}

                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegAddressCard className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Age
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.age}

                              </span>
                            </td>
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiTwotonePhone className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {" "}
                                  Mobile
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {`${item?.contactNumber?.code} ${item?.contactNumber?.number}`}
                              </span>
                            </td>

                            {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>*/}
                          </tr>
                        </tbody>
                      </table>

                      {/* <div className="flex gap-3">
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Mobile No <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`family[${index}].contactNumber`, {
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
                        className={`${inputClassName} ${errors.family?.[index]?.contactNumber
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
                      {errors.family?.[index]?.contactNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.family?.[index].contactNumber.message}
                        </p>
                      )}
                    </div>
                  </div> */}
                    </div>
                  </div>
                ))

                :
                <div className="text-center p-3">No Data Found</div>
              }
            </div>
          )}
          {step === 4 && (
            <div className="overflow-x-auto">
              {onBoardingDetailsData?.emergencyContact?.length > 0 ?
                onBoardingDetailsData?.emergencyContact?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Emergency Contact {index + 1}
                        </div>
                      </div>

                      <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                        <thead>
                          <tr>
                            <th className="text-header "></th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                          {/* Company Name Row */}
                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonOutline className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Name
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.name}
                              </span>
                            </td>

                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTrademarkCircle className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Relationship
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.relationship}
                              </span>
                            </td>
                          </tr>

                          {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Head
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td>
                    </tr> */}

                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegAddressCard className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Email
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {item?.email}
                              </span>
                            </td>
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiTwotonePhone className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {" "}
                                  Mobile
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {`${item?.mobile?.code} ${item?.mobile?.number}`}
                              </span>
                            </td>

                            {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>*/}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                ))
                : <div className="text-header text-center p-2"> No Data Found</div>
              }

            </div>
          )}
          {step === 5 && (
            onBoardingDetailsData?.educationDetails?.length > 0 ?
              <div>
                {onBoardingDetailsData?.educationDetails?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Education Details {index + 1}
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-1 grid-cols-1 gap-4 items-end overflow-auto">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className=" hover:bg-indigo-50 flex flex-col lg:table-row ">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center  gap-2">
                                    <AiTwotoneContainer className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Degree
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.degree}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      University
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.university}
                                  </span>
                                </td>
                              </tr>

                              {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Head
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td>
                    </tr> */}

                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiTwotoneContacts className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      From
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {moment(item?.from).format("YYYY-MM-DD")}
                                  </span>
                                </td>
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiTwotoneContacts className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {" "}
                                      To
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {moment(item?.to).format("YYYY-MM-DD")}
                                  </span>
                                </td>

                                {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>*/}
                              </tr>

                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiTwotoneCheckSquare className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Marking Type
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.isPercentage
                                      ? "Percentage"
                                      : "Grade"}
                                  </span>
                                </td>
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiOutlinePercentage className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {" "}
                                      Percentage / Grade
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {onBoardingDetailsData?.educationDetails?.[
                                      index
                                    ]?.number || "N/A"}
                                  </span>
                                </td>
                              </tr>

                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiOutlineSkype className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Specification
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {
                                      item?.specification
                                    }
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Education Button */}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 6 && (
            onBoardingDetailsData?.employementDetails?.length > 0 ?

              <div>
                {onBoardingDetailsData?.employementDetails?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Employment Details {index + 1}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Organization Name
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.organizationName || "NA"}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Designation Name
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.designationName || "NA"}
                                  </span>
                                </td>
                              </tr>

                              {/* <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPeopleGroup className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Head
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.head || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td>
                    </tr> */}

                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full  text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiTwotoneContacts className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      From
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {moment(
                                      item?.from
                                    ).format("YYYY-MM-DD")}
                                  </span>
                                </td>
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiTwotoneContacts className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {" "}
                                      To
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {moment(
                                      item?.to
                                    ).format("YYYY-MM-DD")}
                                  </span>
                                </td>

                                {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>*/}
                              </tr>

                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <AiFillBank className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Annual CTC
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.annualCTC || "NA"}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 7 && (
            onBoardingDetailsData?.documentData?.length > 0 ?
              <div>
                {onBoardingDetailsData?.documentData?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          KYC Document {index + 1}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Document Type *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.name}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Document Number *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.number}
                                    {/* {onBoardingDetailsData?.documentData?.map((doc, index) => (
                                      <div key={index}>{doc.number}</div>
                                    ))} */}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegFileImage className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Uploaded Document *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    <CommonImageViewer
                                      key={index}
                                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.filePath}`}
                                      alt={`Uploaded ${index + 1}`}

                                    />
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 8 && (
            onBoardingDetailsData?.bankData?.length > 0 ?

              <div>
                {onBoardingDetailsData?.bankData?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Bank Details {index + 1}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Bank Holder Name *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.bankholderName}</div>
                                    ))} */}
                                    {item?.bankholderName}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Bank Name *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.documentData?.number} */}
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.bankName}</div>
                                    ))} */}
                                    {item?.bankName}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Branch Name *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.branchName}</div>
                                    ))} */}
                                    {item?.branchName}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Account Number *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.documentData?.number} */}
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.accountNumber}</div>
                                    ))} */}
                                    {item?.accountNumber}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      IFSC Code *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.ifscCode}</div>
                                    ))} */}
                                    {item?.ifscCode}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Account Type *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {item?.accountType}
                                    {/* {onBoardingDetailsData?.bankData?.map((doc, index) => (
                                      <div key={index}>{doc.accountType}</div>
                                    ))} */}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegFileImage className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Uploaded Document *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.bankData?.length > 0
                                      ? onBoardingDetailsData?.bankData?.map((filePath, index) => (
                                        <CommonImageViewer
                                          key={index}
                                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                                          alt={`Uploaded ${index + 1}`}

                                        />
                                      ))
                                      : null} */}
                                    <CommonImageViewer
                                      key={index}
                                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${item?.filePath}`}
                                      alt={`Uploaded ${index + 1}`}

                                    />
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 9 && (
            onBoardingDetailsData?.socialLinks?.length > 0 ?

              <div>
                {onBoardingDetailsData?.socialLinks?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Social Links {index + 1}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {item?.name} *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.socialLinks?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {item?.link}
                                  </span>
                                </td>

                                {/* <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {item?.name} *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    
                                    {item?.link}
                                  </span>
                                </td> */}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 10 && (
            onBoardingDetailsData?.assignLeaves?.length > 0 ?

              <div>
                {onBoardingDetailsData?.assignLeaves?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          Leave Details {index + 1}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Financial Start Date *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.socialLinks?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {/* {onBoardingDetailsData?.assignLeaves?.[0]?.financStartDate} */}
                                    {moment(item?.financStartDate).format('DD-MM-YYYY')}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Financial End Date*
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.documentData?.number} */}
                                    {/* {onBoardingDetailsData?.assignLeaves?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {/* {onBoardingDetailsData?.assignLeaves?.[0]?.financEndDate} */}
                                    {moment(item?.financEndDate).format('DD-MM-YYYY')}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Select Leave Policy *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.assignLeaves?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {item?.leavePolicy}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 11 && (
            onBoardingDetailsData?.emergencyContact?.length > 0 ?

              <div>
                {onBoardingDetailsData?.emergencyContact?.map((item, index) => (
                  <div key={index} className=" rounded-md  ">
                    <div key={index} className=" rounded-md ">
                      <div className="flex justify-between items-center rounded-t-md px-3">
                        <div className="py-2 text-header font-semibold">
                          {/* Employment Details {index + 1} */}
                        </div>
                      </div>
                      <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                        <div className="w-full">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr></tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Name *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.socialLinks?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {onBoardingDetailsData?.emergencyContact?.[0]?.name}
                                  </span>
                                </td>

                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Relationship*
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.documentData?.number} */}
                                    {/* {onBoardingDetailsData?.emergencyContact?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {onBoardingDetailsData?.emergencyContact?.[0]?.relationship}
                                    {/* {moment(onBoardingDetailsData?.emergencyContact?.[0]?.financEndDate).format('DD-MM-YYYY')} */}
                                  </span>
                                </td>
                              </tr>
                              <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Email *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.emergencyContact?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {onBoardingDetailsData?.emergencyContact?.[0]?.email}
                                  </span>
                                </td>
                                <td className="p-3 lg:w-1/2 w-full text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <IoPersonOutline className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Mobile *
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {/* {onBoardingDetailsData?.assignLeaves?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                    {onBoardingDetailsData?.emergencyContact?.[0]?.mobile?.number}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div> : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          {step === 12 && (
            // onBoardingDetailsData?.salaryData?.length > 0 ?
            <div>
              {/* {onBoardingDetailsData?.salaryData?.map((item, index) => ( */}
              <div className=" rounded-md  ">
                <div className=" rounded-md ">
                  <div className="flex justify-between items-center rounded-t-md px-3">
                    <div className="py-2 text-header font-semibold">
                      {/* Salary Details {index + 1} */}
                    </div>
                  </div>
                  <div className=" grid sm:grid-cols-1 grid-cols-1 gap-4 items-end ">
                    <div className="w-full">
                      <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                        <thead>
                          <tr></tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                          {/* Company Name Row */}
                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonOutline className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Current Package (yearly)  *
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {/* {onBoardingDetailsData?.socialLinks?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                {onBoardingDetailsData?.salaryData?.currentPackage}
                              </span>
                            </td>

                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegBuilding className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Last Increment Date*
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {/* {onBoardingDetailsData?.documentData?.number} */}
                                {/* {onBoardingDetailsData?.emergencyContact?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                {/* {onBoardingDetailsData?.salaryData?.[0]?.relationship} */}
                                {moment(onBoardingDetailsData?.salaryData?.lastIncrementDate).format('DD-MM-YYYY')}
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonOutline className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Next Increment Date  *
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {/* {onBoardingDetailsData?.emergencyContact?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                {/* {onBoardingDetailsData?.salaryData?.[0]?.email} */}
                                {moment(onBoardingDetailsData?.salaryData?.nextIncrementDate).format('DD-MM-YYYY')}
                              </span>
                            </td>
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonOutline className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Is ESIC *
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {/* {onBoardingDetailsData?.assignLeaves?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                {onBoardingDetailsData?.salaryData?.isESIC === true ? 'true' : 'false'}
                                {/* {item?.isESIC === true ? 'true' : 'false'} */}
                              </span>
                            </td>
                          </tr>
                          <tr className="hover:bg-indigo-50 flex flex-col lg:table-row">
                            <td className="p-3 lg:w-1/2 w-full text-gray-600">
                              <div className="flex items-center gap-2">
                                <IoPersonOutline className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Is PF *
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {/* {onBoardingDetailsData?.emergencyContact?.map((doc, index) => (
                                    <div key={index}>{doc.link}</div>
                                  ))}  */}
                                {onBoardingDetailsData?.salaryData?.isPF === true ? 'true' : 'false'}
                                {/* {item?.isPF === true ? 'true' : 'false'} */}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* ))} */}
            </div>
            // : <div className="text-header text-center p-2"> No Data Found</div>
          )}
          </div>}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default ViewOnBoardingDetail;
