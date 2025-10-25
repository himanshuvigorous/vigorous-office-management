import { useEffect, useState } from "react";
import { useForm, useWatch, Controller, useFieldArray } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  inputerrorClassNameAutoComplete,
  inputAntdSelectClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import {
  countrySearch,
  secCountrySearch,
} from "../../global/address/country/CountryFeatures/_country_reducers";
import { AutoComplete, Input, Select } from "antd";
import { decrypt } from "../../../config/Encryption.js";
import {
  getClientDetails,
  updateClientFunc,
} from "./clientFeatures/_client_reducers";
import { useParams } from "react-router-dom";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers.js";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers.js";
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
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker.js";
import dayjs from "dayjs";
import { clientGrpSearch } from "../clientGroup/clientGroupFeatures/_client_group_reducers.js";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker.js";

import Loader from "../../../global_layouts/Loader/Loader";
import ImageUploader from "../../../global_layouts/ImageUploader/ImageUploader.js";
import ListLoader from "../../../global_layouts/ListLoader.js";

const EditClient = () => {
  const { clientIdEnc } = useParams();
  const clientId = decrypt(clientIdEnc);
  const [step, setStep] = useState(1);
  const { loading: clientLoading } = useSelector((state) => state.client);
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();
  const [navStep, setNavStep] = useState(1);
  const dispatch = useDispatch();
  const [clientGroupOwner, setClientGroupOwner] = useState(true);
  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const { secCountryList } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);



  const { industryListData, indusSearchloading } = useSelector((state) => state.industry);
  const { orgTypeList, orgSearchloading } = useSelector((state) => state.orgType);
  const { clientGroupList, groupSearchLoading } = useSelector(state => state.clientGroup);

  const { clientDetailsData, loading } = useSelector((state) => state.client);
  const [datasetLoader, setdataSetLoader] = useState(false);

  useEffect(() => {
    if (clientDetailsData?.data) {
      setdataSetLoader(true);
      dispatch(
        clientGrpSearch({
          branchId: clientDetailsData?.data?.branchId,
          companyId: clientDetailsData?.data?.companyId,
          isPagination: false,
          text: "",
          sort: true,
          status: true,
          groupId: "",
        })
      ).then((res) => {
        if (!res.error) {
          if (clientDetailsData?.data?.groupId) {
            setValue("PDGroupName", clientDetailsData?.data?.groupId);
          } else{
             setValue("PDGroupName", '');
          }
        }
      });
      setValue("PDFullName", clientDetailsData?.data?.fullName);
      setValue("ProfileImage", clientDetailsData?.data?.profileImage);
      setValue("clientfistName", clientDetailsData?.data?.clientfirstName);
      setValue("clientlastName", clientDetailsData?.data?.clientlastName);
      setValue("PDStatus", clientDetailsData?.data?.status);
      setValue("PDPlan", clientDetailsData?.data?.planId);
      setValue("PDOrganizationType", clientDetailsData?.data?.organizationId);
      setValue("PDindustrytype", clientDetailsData?.data?.industryId);
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
      setValue("PDEmail", clientDetailsData?.data?.email);
      setValue("code", clientDetailsData?.data?.mobile?.code);
      setValue("number", clientDetailsData?.data?.mobile?.number);
      setValue("Lcode", clientDetailsData?.data?.clientProfile?.landline?.code);
      setValue(
        "Lnumber",
        clientDetailsData?.data?.clientProfile?.landline?.number
      );
      setValue("gender", clientDetailsData?.data?.generalInfo?.gender);
      clientDetailsData?.data?.generalInfo?.dateOfBirth &&
        setValue(
          "dateOfBirth",
          dayjs(clientDetailsData?.data?.generalInfo?.dateOfBirth)
        );
      setValue(
        "maritalStatus",
        clientDetailsData?.data?.generalInfo?.maritalStatus
      );
      setClientGroupOwner(clientDetailsData?.data?.clientProfile?.isGroupOwner);
      setValue(
        "adharNumber",
        clientDetailsData?.data?.clientProfile?.adharNumber
      );
      setValue("GSTNumber", clientDetailsData?.data?.clientProfile?.GSTNumber);
      setValue("penNumber", clientDetailsData?.data?.clientProfile?.penNumber);
      clientDetailsData?.data?.clientProfile?.dateOfJoining &&
        setValue(
          "PDDateOfJoin",
          dayjs(clientDetailsData?.data?.clientProfile?.dateOfJoining)
        );
      setValue("PDfrn", clientDetailsData?.data?.frn);
      setValue("PDTanNumber", clientDetailsData?.data?.tanNumber);
      if (clientDetailsData?.data?.socialLinks?.length > 0) {
        setValue("SMInstagram", clientDetailsData?.data?.socialLinks[0]?.link);
        setValue("SMTwitter", clientDetailsData?.data?.socialLinks[1]?.link);
        setValue("SMFacebook", clientDetailsData?.data?.socialLinks[2]?.link);
        setValue("SMWebsite", clientDetailsData?.data?.socialLinks[3]?.link);
      }
    }
    setdataSetLoader(false);
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

      await dispatch(getClientDetails(reqData)).then((data) => { });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: clientId,
        companyId: clientDetailsData?.data?.companyId,
        directorId: "",
        branchId: clientDetailsData?.data?.branchId,
        organizationId: data?.PDOrganizationType,
        industryId: data?.PDindustrytype,
        groupId: data?.PDGroupName,
        fullName: data?.PDFullName,
        mobile: {
          number: data?.number ?? "",
          code: data?.code ?? "",
        },
        profileImage: data.ProfileImage,
        userType: "client",
        email: data?.PDEmail,
        clientProfile: {
          penNumber: data?.penNumber,
          adharNumber: data?.adharNumber,
          GSTNumber: data?.GSTNumber,
          dateOfJoining: data?.PDDateOfJoin,
          secondaryEmail: "",
          isGroupOwner: clientGroupOwner,
          contactInfo: clientDetailsData?.data?.clientProfile?.contactInfo,
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
  const navTabClick = async (clickedStep) => {
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
                className={`flex relative flex-col items-center  pb-2 ${step === 1 ? "text-white ]" : "text-gray-500"
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
                className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-500"
                  } cursor-pointer`}
              >
                {step === 2 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Branch Details</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(3)}
                className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-500"
                  } cursor-pointer`}
              >
                {step === 3 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Owner</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(4)}
                className={`flex flex-col items-center relative pb-2 ${step === 4 ? "text-white ]" : "text-gray-500"
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
                className={`flex flex-col items-center relative pb-2 ${step === 5 ? "text-white ]" : "text-gray-500"
                  } cursor-pointer`}
              >
                {step === 5 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold"> Services</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(6)}
                className={`flex flex-col items-center relative pb-2 ${step === 6 ? "text-white ]" : "text-gray-600"
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
                className={`flex flex-col items-center relative pb-2 ${step === 7 ? "text-white ]" : "text-gray-600"
                  } cursor-pointer`}
              >
                {step === 7 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">
                  {" "}
                  Financial Document
                </span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(8)}
                className={`flex flex-col items-center relative pb-2 ${step === 8 ? "text-white ]" : "text-gray-600"
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
                className={`flex flex-col items-center relative pb-2 ${step === 9 ? "text-white ]" : "text-gray-600"
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
            {loading || datasetLoader ? (
              <Loader />
            ) : (
              <div>
                <form
                  autoComplete="off"
                  className=""
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {step === 1 && (
                    <div className="gap-4">
                      <div className="flex w-full justify-start items-center p-2">
                        <Controller
                          name="ProfileImage"
                          control={control}
                          render={({ field }) => (
                            <ImageUploader
                              setValue={setValue}
                              name="image"
                              field={field}
                            />
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:my-2 px-3">
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Group Name
                          </label>
                          {/* <select
                        {...register("PDGroupName", {
                          required: "Group is required",
                        })}
                        disabled = {clientDetailsData?.data?.groupId ? true : false}
                        className={` ${clientDetailsData?.data?.groupId ? inputDisabledClassName : inputClassName} ${errors.PDGroupName
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}

                      >
                        <option className="text-xs" value="">
                          Select Group Name
                        </option>
                        {clientGroupList?.map((type) => (
                          <option value={type?._id}>{type?.fullName}({type?.groupName})</option>
                        ))}


                          
                      </select> */}

                          <Controller
                            control={control}
                            name="PDGroupName"
                            render={({ field }) => (
                              <Select
                                {...field}
                                className={`${inputAntdSelectClassName}`}
                                showSearch
                                filterOption={(input, option) =>
                                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                                }
                              >
                                <Select.Option value="">
                                  Select Group Name
                                </Select.Option>
                                {groupSearchLoading ? <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option> : (clientGroupList?.map((type) => (
                                  <Select.Option
                                    key={type?._id}
                                    value={type?._id}
                                  >
                                    {type?.fullName}({type?.groupName})
                                  </Select.Option>
                                )))}
                              </Select>
                            )}
                          />
                          {errors.PDGroupName && (
                            <p className="text-red-500 text-sm">
                              {errors.PDGroupName.message}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Organization Type{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          {/* <select
                        {...register("PDOrganizationType", {
                          required: "Organization type is required",
                        })}
                        className={` ${inputClassName} ${errors.PDOrganizationType
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}

                      >
                        <option className="text-xs" value="">
                          Select Organization Type
                        </option>
                        {orgTypeList?.map((elment, index) => (
                          <option value={elment?._id}>{elment?.name}</option>
                        ))}
                      </select> */}

                          <Controller
                            control={control}
                            name="PDOrganizationType"
                            rules={{ required: "Organization is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                defaultValue={""}
                                className={`${inputAntdSelectClassName} `}
                                showSearch
                                filterOption={(input, option) =>
                                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                                }
                              >
                                <Select.Option value="">
                                  Select Organization Type
                                </Select.Option>
                                {orgSearchloading ? <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option> : (orgTypeList?.map((type) => (
                                  <Select.Option
                                    key={type?._id}
                                    value={type?._id}
                                  >
                                    {type?.name}
                                  </Select.Option>
                                )))}
                              </Select>
                            )}
                          />
                          {errors.PDOrganizationType && (
                            <p className="text-red-500 text-sm">
                              {errors.PDOrganizationType.message}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Industry Type{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          {/* <select
                        {...register("PDindustrytype", {
                          required: "Industry type is required",
                        })}
                        className={` ${inputClassName} ${errors.PDindustrytype
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      >
                        <option className="text-xs" value="">
                          Select Industry Type
                        </option>
                        {industryListData?.map((type) => (
                          <option value={type._id}>{type.name}</option>
                        ))}
                      </select> */}
                          <Controller
                            control={control}
                            name="PDindustrytype"
                            rules={{ required: "Industry type is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                defaultValue={""}
                                className={`${inputAntdSelectClassName} `}
                                showSearch
                                filterOption={(input, option) =>
                                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                                }
                              >
                                <Select.Option value="">
                                  {" "}
                                  Select Industry Type
                                </Select.Option>
                                {indusSearchloading ? <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option> : (industryListData?.map((type) => (
                                  <Select.Option
                                    key={type?._id}
                                    value={type?._id}
                                  >
                                    {type?.name}
                                  </Select.Option>
                                )))}
                              </Select>
                            )}
                          />
                          {errors.PDindustrytype && (
                            <p className="text-red-500 text-sm">
                              {errors.PDindustrytype.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3 md:mt-4">
                        <div className="col-span-2">
                          <label className={`${inputLabelClassName}`}>
                            Name
                          </label>
                          <input
                            type="text"
                            {...register("PDFullName", {
                              required: "Client Name is required",
                            })}
                            className={` ${inputClassName} ${errors.PDFullName
                              ? "border-[1px] "
                              : "border-gray-300"
                              } `}
                            placeholder="Enter Client Name"
                          />
                          {errors.PDFullName && (
                            <p className="text-red-500 text-sm">
                              {errors.PDFullName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-8 md:my-1 px-3 md:mt-4">
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Email<span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("PDEmail", {
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Please enter a valid email address",
                              },
                            })}
                            className={` ${inputClassName} ${errors.PDEmail
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Email"
                          />
                          {errors.PDEmail && (
                            <p className="text-red-500 text-sm">
                              {errors.PDEmail.message}
                            </p>
                          )}
                        </div>
                        {/* <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        {...register("PDPassword", {
                          required: "Password is required",
                        })}
                        className={` ${inputClassName} ${errors.PDPassword ? "border-[1px] " : "border-gray-300"
                          }`}
                        placeholder="Enter Password"
                      />
                      {errors.PDPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.PDPassword.message}
                        </p>
                      )}
                    </div> */}
                        <div className="flex gap-3">
                          <div className="w-[150px]">
                            <label className={`${inputLabelClassName}`}>
                              code<span className="text-red-600">*</span>
                            </label>
                            <Controller
                              control={control}
                              name="code"
                              rules={{ required: "code is required" }}
                              render={({ field }) => (
                                <CustomMobileCodePicker
                                  field={field}
                                  errors={errors}
                                />
                              )}
                            />
                            {/* <Controller
                          control={control}
                          name="code"
                          rules={{ required: "code is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              {...field}
                              onChange={(value) => field.onChange(value)}
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
                        /> */}

                            {errors[`code`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`code`].message}
                              </p>
                            )}
                          </div>
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Mobile No<span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              {...register(`number`, {
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
                              className={` ${inputClassName} ${errors[`number`]
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
                            {errors[`number`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`number`].message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Date of birth / incorporation{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="dateOfBirth"
                            control={control}
                            rules={{
                              required:
                                "Date of birth / incorporation  is required",
                            }}
                            render={({ field }) => (
                              <CustomDatePicker
                                field={field}
                                errors={errors}
                                disabledDate={(current) => {
                                  return (
                                    current &&
                                    current.isAfter(
                                      moment().endOf("day"),
                                      "day"
                                    )
                                  );
                                }}
                              />
                            )}
                          />
                          {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm">
                              {errors.dateOfBirth.message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Date of Joining{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name="PDDateOfJoin"
                            control={control}
                            render={({ field }) => (
                              <CustomDatePicker
                                field={field}
                                errors={errors}
                                disabledDate={(current) => {
                                  return current.isAfter(
                                    moment().endOf("day"),
                                    "day"
                                  );
                                }}
                              />
                            )}
                          />
                          {errors.PDDateOfJoin && (
                            <p className="text-red-500 text-sm">
                              {errors.PDDateOfJoin.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 md:my-1 px-3">
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            PAN Number
                          </label>
                          <input
                            type="text"
                            {...register("penNumber", {
                              pattern: {
                                value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                                message: "Invalid PAN card format (ABCDE1234E)",
                              },
                            })}
                            className={` ${inputClassName} ${errors.penNumber
                              ? "border-[1px] "
                              : "border-gray-300"
                              } `}
                            placeholder="Enter PAN number"
                            maxLength={15}
                          />
                          {errors.penNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.penNumber.message}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Aadhar Number
                          </label>
                          <input
                            type="text"
                            {...register("adharNumber", {})}
                            className={` ${inputClassName} ${errors.adharNumber
                              ? "border-[1px] "
                              : "border-gray-300"
                              } `}
                            placeholder="Enter Aadhar number"
                          />
                          {errors.adharNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.adharNumber.message}
                            </p>
                          )}
                        </div>
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            GST Number
                          </label>
                          <input
                            type="text"
                            {...register("GSTNumber", {})}
                            className={` ${inputClassName} ${errors.GSTNumber
                              ? "border-[1px] "
                              : "border-gray-300"
                              } `}
                            placeholder="Enter GST number"
                          />
                          {errors.GSTNumber && (
                            <p className="text-red-500 text-sm">
                              {errors.GSTNumber.message}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-3">
                          <div className="w-[150px]">
                            <label className={`${inputLabelClassName}`}>
                              STD
                            </label>
                            <Controller
                              control={control}
                              name="Lcode"
                              render={({ field }) => (
                                <CustomMobileCodePicker
                                  field={field}
                                  errors={errors}
                                />
                              )}
                            />

                            {errors[`code`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`code`].message}
                              </p>
                            )}
                          </div>
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Landline
                            </label>
                            <input
                              type="number"
                              {...register(`Lnumber`, {
                                minLength: {
                                  value: 10,
                                  message: "Must be exactly 10 digits",
                                },
                                maxLength: {
                                  value: 10,
                                  message: "Must be exactly 10 digits",
                                },
                              })}
                              className={` ${inputClassName} ${errors[`Lnumber`]
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
                            {errors[`Lnumber`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`Lnumber`].message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                          <div className="col-span-2">
                            <label className={`${inputLabelClassName}`}>
                              Primary Address
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("PDAddress", {
                                required: "Primary Address is required",
                              })}
                              className={`${inputClassName} ${errors.PDAddress
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Primary Address"
                            />
                            {errors.PDAddress && (
                              <p className="text-red-500 text-sm">
                                {errors.PDAddress.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-4 md:my-1 px-3">
                          <div>
                            <div className={`${inputLabelClassName}`}>
                              Country <span className="text-red-600">*</span>
                            </div>
                            {/* <Controller
                          control={control}
                          name="PDcountry"
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <CustomMobileCodePicker
                            field={field}
                              errors={errors} 
                            />
                          )}
                        /> */}
                            <Controller
                              control={control}
                              name="PDcountry"
                              render={({ field }) => (
                                <AutoComplete
                                  {...field}
                                  className="w-full"
                                  options={sortByPropertyAlphabetically(secCountryList?.docs)?.map(
                                    (type) => ({
                                      value: type?.name,
                                    })
                                  )}
                                  
                                >
                                  <input
                                    placeholder="Enter Country"
                                    onFocus={() =>
                                      dispatch(
                                        secCountrySearch({
                                          isPagination: false,
                                          text: "",
                                          sort: true,
                                          status: true,
                                        })
                                      )
                                    }
                                    className={`${inputClassName} ${errors.PDSecCountry
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      }`}
                                  />
                                </AutoComplete>
                              )}
                            />
                            {errors.PDcountry && (
                              <p
                                className={`${inputerrorClassNameAutoComplete}`}
                              >
                                {errors.PDcountry.message}
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
                                  {...field}
                                  className="w-full"
                                  onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                                  options={sortByPropertyAlphabetically(stateListData?.docs)?.map((type) => ({
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
                                          countryName: watch("PDcountry"),
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
                              <p
                                className={`${inputerrorClassNameAutoComplete}`}
                              >
                                {errors.PDState.message}
                              </p>
                            )}
                          </div>

                          {/* City Field */}
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
                                  {...field}
                                  className="w-full"
                                  onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                                  options={sortByPropertyAlphabetically(cityListData?.docs)?.map((type) => ({
                                    value: type?.name,
                                  }))}
                                  
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
                                          stateName: watch("PDState"),
                                        })
                                      );
                                    }}
                                    className={`${inputClassName} ${errors.PDCity
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      }`}
                                  />
                                </AutoComplete>
                              )}
                            />
                            {errors.PDCity && (
                              <p
                                className={`${inputerrorClassNameAutoComplete}`}
                              >
                                {errors.PDCity.message}
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
                              name="PDPin"
                              rules={{ required: "Pin Code is required" }}
                              render={({ field }) => (
                                <input
                                  {...field}
                                  type="number"
                                  placeholder="Enter Pin Code"
                                  maxLength={6}
                                  onInput={(e) => {
                                    if (e.target.value.length > 6) {
                                      e.target.value = e.target.value.slice(
                                        0,
                                        6
                                      );
                                    }
                                  }}
                                  className={`${inputClassName} ${errors.PDPin
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              )}
                            />
                            {errors.PDPin && (
                              <p className="text-red-500 text-sm">
                                {errors.PDPin.message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="mt-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 px-3">
                            <div className="col-span-2">
                              <label
                                className={`${inputLabelClassName} flex justify-between items-center`}
                              >
                                <span>Secondary Address</span>
                                <div className="flex items-center mt-2">
                                  <input
                                    type="checkbox"
                                    id="sameAsCurrentAddress"
                                    onChange={(e) =>
                                      handleAddressCheckbox(e.target.checked)
                                    }
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor="sameAsCurrentAddress"
                                    className={`${inputLabelClassName}`}
                                  >
                                    same as Current Address
                                  </label>
                                </div>
                              </label>
                              <input
                                type="text"
                                {...register("PDSecAddress")}
                                className={`${inputClassName} ${errors.PDSecAddress
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                                placeholder="Enter Secondary Address"
                              />
                              {errors.PDSecAddress && (
                                <p className="text-red-500 text-sm">
                                  {errors.PDSecAddress.message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-8 md:my-1 px-3">
                            {/* Secondary Address Fields (mirroring Primary Address) */}
                            <div>
                              <div className={`${inputLabelClassName}`}>
                                Country
                              </div>
                              <Controller
                                control={control}
                                name="PDSecCountry"
                                render={({ field }) => (
                                  <AutoComplete
                                    {...field}
                                    className="w-full"
                                    options={sortByPropertyAlphabetically(secCountryList?.docs)?.map(
                                      (type) => ({
                                        value: type?.name,
                                      })
                                    )}
                                  >
                                    <input
                                      placeholder="Enter Country"
                                      onFocus={() =>
                                        dispatch(
                                          secCountrySearch({
                                            isPagination: false,
                                            text: "",
                                            sort: true,
                                            status: true,
                                          })
                                        )
                                      }
                                      className={`${inputClassName} ${errors.PDSecCountry
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                    />
                                  </AutoComplete>
                                )}
                              />
                              {errors.PDSecCountry && (
                                <p className="text-red-500 text-sm">
                                  {errors.PDSecCountry.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <div className={`${inputLabelClassName}`}>
                                State
                              </div>
                              <Controller
                                control={control}
                                name="PDSecState"
                                render={({ field }) => (
                                  <AutoComplete
                                    {...field}
                                    className="w-full"
                                    onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                                    options={sortByPropertyAlphabetically(stateListData?.docs)?.map(
                                      (type) => ({
                                        value: type?.name,
                                      })
                                    )}
                                  >
                                    <input
                                      placeholder="Enter State"
                                      onFocus={() => {
                                        dispatch(
                                          stateSearch({
                                            isPagination: false,
                                            text: "",
                                            countryName: watch(`PDSecCountry`),
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
                              {errors.PDSecState && (
                                <p className="text-red-500 text-sm">
                                  {errors.PDSecState.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <div className={`${inputLabelClassName}`}>
                                City
                              </div>
                              <Controller
                                control={control}
                                name="PDSecCity"
                                render={({ field }) => (
                                  <AutoComplete
                                    {...field}
                                    className="w-full"
                                    onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                                    options={sortByPropertyAlphabetically(cityListData?.docs)?.map(
                                      (type) => ({
                                        value: type?.name,
                                      })
                                    )}
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
                                            stateName: watch(`PDSecState`),
                                          })
                                        );
                                      }}
                                      className={`${inputClassName} ${errors.PDCity
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                    />
                                  </AutoComplete>
                                )}
                              />
                              {errors.PDSecCity && (
                                <p className="text-red-500 text-sm">
                                  {errors.PDSecCity.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className={`${inputLabelClassName}`}>
                                Pin Code
                              </label>
                              <Controller
                                control={control}
                                name="PDSecPinCode"
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="number"
                                    placeholder="Enter Pin Code"
                                    maxLength={6}
                                    onInput={(e) => {
                                      if (e.target.value.length > 6) {
                                        e.target.value = e.target.value.slice(
                                          0,
                                          6
                                        );
                                      }
                                    }}
                                    className={`${inputClassName} ${errors.PDSecPinCode
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      }`}
                                  />
                                )}
                              />
                              {errors.PDSecPinCode && (
                                <p className="text-red-500 text-sm">
                                  {errors.PDSecPinCode.message}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center mt-2 p-3">
                        <input
                          type="checkbox"
                          id="clientGroupOwner"
                          className="mr-2"
                          checked={clientGroupOwner}
                          onChange={(e) =>
                            handleGroupOwnerCheckbox(e.target.checked)
                          }
                        />
                        <label
                          htmlFor="clientGroupOwner"
                          className={`${inputLabelClassName}`}
                        >
                          isGroupOwner
                        </label>
                      </div>

                      <div className="flex justify-end col-span-2 mt-4">
                        <button
                          type="submit"
                          disabled={clientLoading}
                          className={`${clientLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
                        >
                          {clientLoading ? <Loader /> : 'Submit'}
                        </button>

                      </div>
                    </div>
                  )}
                </form>
                {step === 3 && (
                  <OwnersDetails
                    clientDataParent={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 2 && (
                  <BranchDetails
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 4 && (
                  <ContactPerson
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 5 && (
                  <ServicesDetails
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 6 && (
                  <KycDocuments
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 7 && (
                  <FInancialDetails
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 8 && (
                  <BankDetails
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
                {step === 9 && (
                  <DigitalSignature
                    clientData={clientDetailsData}
                    fetchData={fetchData}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
};

export default EditClient;
