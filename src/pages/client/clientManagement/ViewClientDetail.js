import { useEffect, useState } from "react";
import { useForm, useWatch, Controller, useFieldArray } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  inputerrorClassNameAutoComplete,
} from "../../../constents/global";
import {
  countrySearch,
  secCountrySearch,
} from "../../global/address/country/CountryFeatures/_country_reducers";
import { AutoComplete, Input } from "antd";
import getUserIds from "../../../constents/getUserIds";
import { decrypt } from "../../../config/Encryption.js";
import {
  getClientDetails,
  updateClientFunc,
} from "./clientFeatures/_client_reducers";
import { useParams } from "react-router-dom";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers.js";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers.js";
import {
  AiFillDelete,
  AiOutlineMail,
  AiOutlineTags,
  AiTwotoneEdit,
} from "react-icons/ai";
import OwnersDetails from "./OwnersDetails.js";
import BranchDetails from "./BranchDetails.js";
import ContactPerson from "./ContactPerson.js";
import ServicesDetails from "./ServicesDetails.js";
import KycDocuments from "./KycDocuments.js";
import FInancialDetails from "./FInancialDetails.js";
import BankDetails from "./BankDetails.js";
import DigitalSignature from "./DigitalSignature.js";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers.js";
import { indusSearch } from "../../global/other/Industry/IndustryFeature/_industry_reducers.js";
import moment from "moment";
import {
  FaIndustry,
  FaPhoneAlt,
  FaRegAddressCard,
  FaRegBuilding,
  FaRegFileImage,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import OwnersViewDetail from "./OwnersViewDetail.js";
import { IoIosDocument } from "react-icons/io";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers.js";

const ViewClientDetail = () => {
  const { clientIdEnc } = useParams();
  const clientId = decrypt(clientIdEnc);
  const [step, setStep] = useState(1);

  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const { departmentListData } = useSelector((state) => state.department);
  

  const handleSelectEmployee = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter((id) => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "clientData",
  });

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const dispatch = useDispatch();
  const [clientGroupOwner, setClientGroupOwner] = useState(true);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [secondaryAddress, setSecoundarAddress] = useState();
  const { countryListData, secCountryList } = useSelector(
    (state) => state.country
  );
  const { stateListData, secStateList } = useSelector((state) => state.states);
  const { cityListData, secCityList } = useSelector((state) => state.city);
  const { industryListData } = useSelector((state) => state.industry);
  const { orgTypeList } = useSelector((state) => state.orgType);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const { clientDetailsData } = useSelector((state) => state.client);

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

  const designationId = useWatch({
    control,
    name: "PDDesignationId",
    defaultValue: "",
  });

  useEffect(() => {
    if (clientDetailsData?.data) {
      setValue("PDFullName", clientDetailsData?.data?.fullName);
      setValue("clientfistName", clientDetailsData?.data?.clientfirstName);
      setValue("clientlastName", clientDetailsData?.data?.clientlastName);
      setValue("PDStatus", clientDetailsData?.data?.status);

      setValue("PDPlan", clientDetailsData?.data?.planId);
      setValue("PDGroupName", clientDetailsData?.data?.PDGroupName);
      setValue("PDOrganizationType", clientDetailsData?.data?.organizationId);
      setValue("PDindustrytype", clientDetailsData?.data?.industryId);
     
      // Primary address
      setValue(
        "PDAddress",
        clientDetailsData?.data?.addresses?.primary?.street
      );
      setValue("PDCity", clientDetailsData?.data?.addresses?.primary?.city);
      setValue(
        "PDcountry",
        clientDetailsData?.data?.addresses?.primary?.country
      );
      setValue("PDState", clientDetailsData?.data?.addresses?.primary?.state);
      setValue("PDPin", clientDetailsData?.data?.addresses?.primary?.pinCode);

      // Secondary address
      setValue(
        "PDSecAddress",
        clientDetailsData?.data?.addresses?.secondary?.street
      );
      setValue(
        "PDSecCountry",
        clientDetailsData?.data?.addresses?.secondary?.country
      );
      setValue(
        "PDSecState",
        clientDetailsData?.data?.addresses?.secondary?.state
      );
      setValue(
        "PDSecCity",
        clientDetailsData?.data?.addresses?.secondary?.city
      );
      setValue(
        "PDSecPinCode",
        clientDetailsData?.data?.addresses?.secondary?.pinCode
      );

      // Contact details
      setValue("PDEmail", clientDetailsData?.data?.email);
      setValue("code", clientDetailsData?.data?.mobile?.code);
      setValue("number", clientDetailsData?.data?.mobile?.number);

      setValue("Lcode", clientDetailsData?.data?.clientProfile?.landline?.code);
      setValue(
        "Lnumber",
        clientDetailsData?.data?.clientProfile?.landline?.number
      );

      setValue("gender", clientDetailsData?.data?.generalInfo?.gender);
      setValue(
        "dateOfBirth",
        moment(clientDetailsData?.data?.generalInfo?.dateOfBirth).format(
          "YYYY-MM-DD"
        )
      );
      setValue(
        "maritalStatus",
        clientDetailsData?.data?.generalInfo?.maritalStatus
      );
      setClientGroupOwner(clientDetailsData?.data?.clientProfile?.isGroupOwner);

      // Identification details
      setValue(
        "adharNumber",
        clientDetailsData?.data?.clientProfile?.adharNumber
      );
      setValue("GSTNumber", clientDetailsData?.data?.clientProfile?.GSTNumber);
      setValue("penNumber", clientDetailsData?.data?.clientProfile?.penNumber);

      setValue(
        "PDDateOfJoin",
        moment(clientDetailsData?.data?.clientProfile?.dateOfJoining)?.format(
          "YYYY-MM-DD"
        )
      );

      setValue("PDfrn", clientDetailsData?.data?.frn);
      setValue("PDTanNumber", clientDetailsData?.data?.tanNumber);

      // Social media links (if available)
      if (clientDetailsData?.data?.socialLinks?.length > 0) {
        setValue("SMInstagram", clientDetailsData?.data?.socialLinks[0]?.link);
        setValue("SMTwitter", clientDetailsData?.data?.socialLinks[1]?.link);
        setValue("SMFacebook", clientDetailsData?.data?.socialLinks[2]?.link);
        setValue("SMWebsite", clientDetailsData?.data?.socialLinks[3]?.link);
      }
    }
  }, [clientDetailsData]);

  useEffect(() => {
    const fetchDataAndDispatch = async () => {
      await dispatch(
        countrySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
      await dispatch(
        orgTypeSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
      await dispatch(
        indusSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
      fetchData();
    };

    fetchDataAndDispatch();
  }, []);

  const fetchData = async () => {
    try {
      const reqData = {
        _id: clientId,
      };

      await dispatch(getClientDetails(reqData)).then((data) => {});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const selectedData = clientDetailsData?.data?.departmentIds || [];
    setSelectedEmployees([...selectedData]);
  }, [clientDetailsData]);
  useEffect(() => {
    dispatch(
      deptSearch({
        companyId: clientDetailsData?.companyId,
        branchId: clientDetailsData?.branchId,
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  }, [dispatch, clientDetailsData]);

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: clientId,
        companyId: clientDetailsData?.data?.companyId,
        directorId: "",
        branchId: clientDetailsData?.data?.branchId,
        organizationId: data?.PDOrganizationType,
        industryId: data?.PDindustrytype,
        groupId: clientDetailsData?.data?.groupId,
        fullName: data?.PDFullName,
        mobile: {
          number: data?.number ?? "",
          code: data?.code ?? "",
        },
        userType: "client",
        email: data?.PDEmail,
        clientProfile: {
          penNumber: data?.penNumber,
          adharNumber: data?.adharNumber,
          GSTNumber: data?.GSTNumber,
          dateOfJoining: data?.PDDateOfJoin,
          secondaryEmail: "",
          isGroupOwner: clientGroupOwner,
          secondaryMobile: {
            code: +5,
            number: 1236548529,
          },
          landline: {
            code: data?.Lcode,
            number: data?.Lnumber,
          },
        },
        generalInfo: {
          gender: "Male",
          dateOfBirth: data?.dateOfBirth,
          maritalStatus: "Single",
        },
        addresses: {
          primary: {
            street: data?.PDAddress ?? "",
            city: data?.PDCity ?? "",
            state: data?.PDState ?? "",
            country: data?.PDcountry ?? "",
            pinCode: data?.PDPin ?? "",
          },
          secondary: {
            street: data?.PDSecAddress ?? "",
            city: data?.PDSecCity ?? "",
            state: data?.PDSecState ?? "",
            country: data?.PDSecCountry ?? "",
            pinCode: data?.PDSecPinCode ?? "",
          },
        },
      };
      dispatch(updateClientFunc(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getClientDetails({
              _id: clientId,
            })
          );
        }
      });
    }
  };

  const navTabClick = (clickedStep) => {
    setStep(clickedStep);
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

  const handleGroupOwnerCheckbox = (checked) => {
    setClientGroupOwner(checked);
  };

  return (
    <GlobalLayout>
      <section>
        <div className="">
          <div>
            <div className="flex bg-header justify-start items-center rounded-t-lg gap-5 px-3 pt-2 mt-2 overflow-x-auto overflow-y-hidden text-nowrap">
              <button
                type="button"
                onClick={() => navTabClick(1)}
                className={`flex relative flex-col items-center  pb-2 ${
                  step === 1 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 1 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold text-nowrap">
                  Profile Information
                </span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(2)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 2 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 2 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Owner</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(3)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 3 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 3 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Branch Details</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(4)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 4 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 4 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Contact Person</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(5)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 5 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 5 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Files</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(6)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 6 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 6 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Registration</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(7)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 7 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 7 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Finance</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(8)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 8 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 8 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Bank Account</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(9)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 9 ? "text-white ]" : "text-gray-200"
                } cursor-pointer`}
              >
                {step === 9 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">
                  {" "}
                  Digital Signature
                </span>
              </button>
              {/* <button
                type="button"
                onClick={() => navTabClick(10)}
                className={`flex flex-col items-center relative pb-2 ${step === 10 ? "text-white ]" : "text-gray-600"
                  } cursor-pointer`}
              >
                {step === 10 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Status</span>
              </button> */}
            </div>
            <form autoComplete="off" className="" onSubmit={handleSubmit(onSubmit)}>
              {step === 1 && (
                <div className="gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-2 ">
                    {/* <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Group Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDGroupName", {
                          required: "Organization type is required",
                        })}
                        className={` ${inputClassName} ${errors.PDGroupName
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}

                      >
                        <option className="text-xs" value="">
                          Select Group Type
                        </option>
                        {clientGroupList?.map((type) => (
                          <option value={type?._id}>{type?.groupName}</option>
                        ))}
                      </select>
                      {errors.PDGroupName && (
                        <p className="text-red-500 text-sm">
                          {errors.PDGroupName.message}
                        </p>
                      )}
                    </div> */}

                    <div className="w-full overflow-auto">
                      <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                        <thead>
                          <tr>
                            <th className="text-header ">
                              <div className="mt-2 ml-2">
                                Personal Information
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                          {/* Company Name Row */}
                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3 text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegBuilding className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Name
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.fullName || "N/A"}
                              </span>
                            </td>

                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTags className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Date of Birth
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {moment(
                                  clientDetailsData?.data?.clientProfile
                                    ?.dateOfBirth
                                )?.format("YYYY-MM-DD") || "N/A"}
                              </span>
                            </td>
                            {/* <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTags className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Date of Joining
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {moment(
                                  clientDetailsData?.data?.clientProfile
                                    ?.dateOfJoining
                                )?.format("YYYY-MM-DD")}
                              </span>
                            </td> */}
                          </tr>

                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaPeopleGroup className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Organization Type
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.organizationId
                                  ? orgTypeList?.find(
                                      (element) =>
                                        element?._id ===
                                        clientDetailsData?.data?.organizationId
                                    )?.name || "N/A"
                                  : "N/A"}
                              </span>
                            </td>

                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaIndustry className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Industry Type
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.industryId
                                  ? industryListData?.find(
                                      (element) =>
                                        element?._id ===
                                        clientDetailsData?.data?.industryId
                                    )?.name || "N/A"
                                  : "N/A"}
                              </span>
                            </td>
                          </tr>
                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegAddressCard className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Email
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.email}
                              </span>
                            </td>

                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineMail className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Mobile
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.mobile?.code}
                                {clientDetailsData?.data?.mobile?.number}
                              </span>
                            </td>
                          </tr>

                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegAddressCard className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Primary Address
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {
                                  clientDetailsData?.data?.addresses?.primary
                                    ?.street
                                }
                                {clientDetailsData?.data?.addresses?.primary
                                  ?.city || "N/A"}
                                ,{" "}
                                {clientDetailsData?.data?.addresses?.primary
                                  ?.state || "N/A"}
                                ,
                                {clientDetailsData?.data?.addresses?.primary
                                  ?.country || "N/A"}
                                ,{" "}
                                {clientDetailsData?.data?.addresses?.primary
                                  ?.pinCode || "N/A"}
                              </span>
                            </td>
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaRegAddressCard className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Secondary Address
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {
                                  clientDetailsData?.data?.addresses?.secondary
                                    ?.street
                                }
                                {clientDetailsData?.data?.addresses?.secondary
                                  ?.city || "N/A"}
                                ,{" "}
                                {clientDetailsData?.data?.addresses?.secondary
                                  ?.state || "N/A"}
                                ,
                                {clientDetailsData?.data?.addresses?.secondary
                                  ?.country || "N/A"}
                                ,{" "}
                                {clientDetailsData?.data?.addresses?.secondary
                                  ?.pinCode || "N/A"}
                              </span>
                            </td>
                          </tr>

                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaPhoneAlt className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {" "}
                                  Gst Number
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.clientProfile
                                  ?.GSTNumber || "N/A"}{" "}
                              </span>
                            </td>
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaPhoneAlt className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {" "}
                                  Landline Number
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.clientProfile
                                  ?.landline?.code || "N/A"}{" "}
                                {clientDetailsData?.data?.clientProfile
                                  ?.landline?.number || "N/A"}{" "}
                              </span>
                            </td>
                          </tr>

                          <tr className=" hover:bg-indigo-50">
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <FaPhoneAlt className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  {" "}
                                  PAN Number
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.clientProfile
                                  ?.penNumber || "N/A"}{" "}
                              </span>
                            </td>
                            <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineMail className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Aadhar Number
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {clientDetailsData?.data?.clientProfile
                                  ?.adharNumber || "N/A"}
                              </span>
                            </td>
                          </tr>
                          <tr>
                          <td className="p-3  text-gray-600">
                              <div className="flex items-center gap-2">
                                <AiOutlineTags className="size-4 text-header text-lg" />
                                <span className="text-[16px] font-medium">
                                  Date of Joining
                                </span>
                              </div>
                              <span className="block text-[15px] ml-4 font-light mt-1">
                                {moment(
                                  clientDetailsData?.data?.clientProfile
                                    ?.dateOfJoining
                                )?.format("YYYY-MM-DD")}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </form>
            {step === 2 &&
              (clientDetailsData?.data?.ownerData.length > 0 ? (
                clientDetailsData?.data?.ownerData?.map((ownerData, index) => {
                  return (
                    <>
                      {" "}
                      <div className="grid  grid-cols-1 md:grid-cols-1">
                        <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                          <thead>
                            <tr>
                              <th className="text-header ">
                                <div className="mt-2 ml-2">
                                  Owner Information
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-gray-700">
                            {/* Company Name Row */}
                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3 text-gray-600 w-1/2">
                                <div className="flex items-center gap-2">
                                  <FaRegBuilding className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.fullName || "N/A"}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600 w-1/2">
                                <div className="flex items-center gap-2">
                                  <AiOutlineTags className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Email
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.email || "N/A"}
                                </span>
                              </td>
                            </tr>

                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaPeopleGroup className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Date of Birth
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.generalInfo?.dateOfBirth || "N/A"}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaIndustry className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Gender
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.generalInfo?.gender || "N/A"}
                                </span>
                              </td>
                            </tr>

                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegAddressCard className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Primary Address
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.addresses?.primary?.street ||
                                    "N/A"}
                                  ,{" "}
                                  {ownerData?.addresses?.primary?.city || "N/A"}
                                  ,{" "}
                                  {ownerData?.addresses?.primary?.state ||
                                    "N/A"}
                                  ,{" "}
                                  {ownerData?.addresses?.primary?.country ||
                                    "N/A"}
                                  ,{" "}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <AiOutlineMail className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Marital Status
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.generalInfo?.maritalStatus ||
                                    "N/A"}
                                </span>
                              </td>
                            </tr>

                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaPhoneAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    {" "}
                                    Mobile Number
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {ownerData?.mobile?.code || "N/A"}{" "}
                                  {ownerData?.mobile?.number || "N/A"}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  );
                })
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
            {step === 3 &&
              (clientDetailsData?.data?.branchData.length > 0 ? (
                clientDetailsData?.data?.branchData?.map(
                  (branchData, index) => {
                    return (
                      <>
                        {" "}
                        <div className="grid  grid-cols-1 md:grid-cols-1">
                          <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                            <thead>
                              <tr>
                                <th className="text-header ">
                                  <div className="mt-2 ml-2">
                                    Branch Information
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                              {/* Company Name Row */}
                              <tr className=" hover:bg-indigo-50">
                                <td className="p-3 text-gray-600 w-1/2">
                                  <div className="flex items-center gap-2">
                                    <FaRegBuilding className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Branch Name
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {branchData?.fullName || "N/A"}
                                  </span>
                                </td>

                                <td className="p-3  text-gray-600 w-1/2">
                                  <div className="flex items-center gap-2">
                                    <AiOutlineTags className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Email
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {branchData?.email || "N/A"}
                                  </span>
                                </td>
                              </tr>

                              <tr>
                                <td className="p-3  text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaPhoneAlt className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {" "}
                                      Mobile Number
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {branchData?.mobile?.code || "N/A"}{" "}
                                    {branchData?.mobile?.number || "N/A"}
                                  </span>
                                </td>
                                <td className="p-3  text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaPhoneAlt className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      {" "}
                                      Land Line Number
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {branchData?.branchProfile?.landline
                                      ?.code || "N/A"}{" "}
                                    {branchData?.branchProfile?.landline
                                      ?.number || "N/A"}
                                  </span>
                                </td>
                              </tr>

                              <tr className=" hover:bg-indigo-50">
                                <td className="p-3  text-gray-600">
                                  <div className="flex items-center gap-2">
                                    <FaRegAddressCard className="size-4 text-header text-lg" />
                                    <span className="text-[16px] font-medium">
                                      Primary Address
                                    </span>
                                  </div>
                                  <span className="block text-[15px] ml-4 font-light mt-1">
                                    {branchData?.addresses?.primary?.street ||
                                      "N/A"}
                                    ,{" "}
                                    {branchData?.addresses?.primary?.city ||
                                      "N/A"}
                                    ,{" "}
                                    {branchData?.addresses?.primary?.state ||
                                      "N/A"}
                                    ,{" "}
                                    {branchData?.addresses?.primary?.country ||
                                      "N/A"}
                                    ,{" "}
                                  </span>
                                </td>
                              </tr>

                              <tr className=" hover:bg-indigo-50"></tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  }
                )
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
            {step === 4 && (
              <div className="grid  grid-cols-1 md:grid-cols-1">
                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                  <thead>
                    <tr>
                      <th className="text-header ">
                        <div className="mt-2 ml-2">Contact Information</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-700">
                    {/* Company Name Row */}
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3 text-gray-600 w-1/2">
                        <div className="flex items-center gap-2">
                          <FaRegBuilding className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Name</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {clientDetailsData?.data?.clientProfile?.contactInfo
                            ?.name || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600 w-1/2">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {clientDetailsData?.data?.clientProfile?.contactInfo
                            ?.email || "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Mobile Number
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {clientDetailsData?.data?.clientProfile?.contactInfo
                            ?.mobile?.code || "N/A"}{" "}
                          {clientDetailsData?.data?.clientProfile?.contactInfo
                            ?.mobile?.number || "N/A"}
                        </span>
                      </td>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaPhoneAlt className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Designation
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {clientDetailsData?.data?.clientProfile?.contactInfo
                            ?.designation || "N/A"}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {step === 5 && (
              <div className="flex gap-2 justify-between items-center my-2">
                <div className="bg-white shadow-sm w-full overflow-x-auto mt-1 rounded-xl">
                  <table className="w-full max-w-full rounded-xl overflow-auto">
                    <thead>
                      <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                        <th className="border-none p-2 whitespace-nowrap max-w-[5%]"></th>
                        <th className="border-none p-2 whitespace-nowrap">
                          Department Name
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentListData && departmentListData.length > 0 ? (
                        departmentListData.map((element, index) => (
                          <tr
                            key={element._id}
                            className={`border-b-[1px] ${
                              index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                            } border-[#DDDDDD] text-[#374151] text-[14px]`}
                          >
                            <td className="whitespace-nowrap border-none p-2">
                              <input
                                disabled
                                type="checkbox"
                                checked={selectedEmployees.includes(
                                  element._id
                                )}
                                onChange={() =>
                                  handleSelectEmployee(element._id)
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap border-none p-2">
                              {element?.name}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white bg-opacity-5">
                          <td
                            colSpan={9}
                            className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                          >
                            Record Not Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {step === 6 &&
              (clientDetailsData?.data?.documentData.length > 0 ? (
                <div>
                  <div className="rounded-md">
                    {clientDetailsData?.data?.documentData.map(
                      (document, index) => (
                        <div className=" rounded-md my-2" key={index}>
                          <div className="flex justify-between items-center mb-4 rounded-t-md">
                            <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                              <thead>
                                <tr>
                                  <th className="text-header ">
                                    <div className="mt-2 mb-1 ml-2">
                                      {" "}
                                      Document {index + 1}
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-sm text-gray-700">
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Document Type
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.name}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Document No
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.number}
                                    </span>
                                  </td>
                                </tr>
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <FaRegFileImage className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Uploaded Document
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document?.filePath?.length > 0
                                        ? document?.filePath?.map(
                                            (file, index) => (
                                              <img
                                                key={index}
                                                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-14 h-14 shadow rounded-sm"
                                              />
                                            )
                                          )
                                        : null}
                                    </span>
                                  </td>
                                </tr>

                                {/* Upload document */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
            {step === 7 &&
              (clientDetailsData?.data?.financeData.length > 0 ? (
                <div>
                  <div className="rounded-md">
                    {clientDetailsData?.data?.financeData.map(
                      (document, index) => (
                        <div className=" rounded-md my-2" key={index}>
                          <div className="flex justify-between items-center mb-4 rounded-t-md">
                            <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                              <thead>
                                <tr>
                                  <th className="text-header ">
                                    <div className="mt-2 mb-1 ml-2">
                                      {" "}
                                      Document {index + 1}
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-sm text-gray-700">
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Document Type
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.name}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Year
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.year}
                                    </span>
                                  </td>
                                </tr>
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <FaRegFileImage className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Uploaded Document
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document?.filePath?.length > 0
                                        ? document?.filePath?.map(
                                            (file, index) => (
                                              <img
                                                key={index}
                                                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-14 h-14 shadow rounded-sm"
                                              />
                                            )
                                          )
                                        : null}
                                    </span>
                                  </td>
                                </tr>

                                {/* Upload document */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
            {step === 8 &&
              (clientDetailsData?.data?.bankData.length > 0 ? (
                <div>
                  <div className="rounded-md">
                    {clientDetailsData?.data?.bankData.map(
                      (document, index) => (
                        <div className=" rounded-md my-2" key={index}>
                          <div className="flex justify-between items-center mb-4 rounded-t-md">
                            <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                              <thead>
                                <tr>
                                  <th className="text-header ">
                                    <div className="mt-2 mb-1 ml-2">
                                      {" "}
                                      Bank Document {index + 1}
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-sm text-gray-700">
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Bank Holder Name
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.bankholderName}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Bank Name
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.bankName}
                                    </span>
                                  </td>
                                </tr>

                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Branch Name
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.branchName}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Account NUmber
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.accountNumber}{" "}
                                    </span>
                                  </td>
                                </tr>
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        IFSC Code
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.ifscCode}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Account Type
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.accountType}{" "}
                                    </span>
                                  </td>
                                </tr>
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <FaRegFileImage className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Uploaded Document
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document?.filePath?.length > 0
                                        ? document?.filePath?.map(
                                            (file, index) => (
                                              <img
                                                key={index}
                                                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-14 h-14 shadow rounded-sm"
                                              />
                                            )
                                          )
                                        : null}
                                    </span>
                                  </td>
                                </tr>

                                {/* Upload document */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
            {step === 9 &&
              (clientDetailsData?.data?.signatureData.length > 0 ? (
                <div>
                  <div className="rounded-md">
                    {clientDetailsData?.data?.signatureData.map(
                      (document, index) => (
                        <div className=" rounded-md my-2" key={index}>
                          <div className="flex justify-between items-center mb-4 rounded-t-md">
                            <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                              <thead>
                                <tr>
                                  <th className="text-header ">
                                    <div className="mt-2 mb-1 ml-2">
                                      {" "}
                                      Digital Signature{index + 1}
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="text-sm text-gray-700">
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <IoIosDocument className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Name
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.name}
                                    </span>
                                  </td>

                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Start Date
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.startDate}
                                    </span>
                                  </td>
                                </tr>
                                <tr className=" hover:bg-indigo-50">
                                  <td className="p-3  text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <AiTwotoneEdit className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        End Date
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document.expiryDate}
                                    </span>
                                  </td>

                                  <td className="p-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                      <FaRegFileImage className="size-4 text-header text-lg" />
                                      <span className="text-[16px] font-medium">
                                        Uploaded Document
                                      </span>
                                    </div>
                                    <span className="block text-[15px] ml-4 font-light mt-1">
                                      {document?.attechment?.length > 0
                                        ? document?.attechment?.map(
                                            (file, index) => (
                                              <img
                                                key={index}
                                                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                                alt={`Uploaded ${index + 1}`}
                                                className="w-14 h-14 shadow rounded-sm"
                                              />
                                            )
                                          )
                                        : null}
                                    </span>
                                  </td>
                                </tr>

                                {/* Upload document */}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-header bg-white p-3 text-center ">
                  Data Not Found
                </div>
              ))}
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
};

export default ViewClientDetail;
