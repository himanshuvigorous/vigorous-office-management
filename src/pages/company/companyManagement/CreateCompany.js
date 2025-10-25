import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { getLocationDataByPincode, inputAntdSelectClassName, inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName } from "../../../constents/global";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { companyCreate } from "./companyFeatures/_company_reducers";
import { useNavigate } from "react-router-dom";
import { planSearch } from "../../global/other/Plan/PlanFeatures/_plan_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { indusSearch } from "../../global/other/Industry/IndustryFeature/_industry_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers";
import { AutoComplete, Input, Select } from "antd";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";



const CreateCompany = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const { planListData, loading: planLoading } = useSelector((state) => state.plan);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { industryListData, indusSearchloading } = useSelector((state) => state.industry);
  const { orgTypeList, orgSearchloading } = useSelector((state) => state.orgType);
  const { loading: companyLoader } = useSelector((state) => state.company);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

  const dispatch = useDispatch();
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
  const PrintMail = useWatch({
    control,
    name: "PDEmail",
    defaultValue: "",
  });
  const PrintMobile = useWatch({
    control,
    name: "PDMobileNo",
    defaultValue: "",
  });
  const PrintMobileCode = useWatch({
    control,
    name: "PDmobileCode",
    defaultValue: "",
  });
  const PrintCompanyName = useWatch({
    control,
    name: "PDCompanyName",
    defaultValue: "",
  });
  const PrintTagLine = useWatch({
    control,
    name: "PDTagline",
    defaultValue: "",
  });
  const PrintWebsite = useWatch({
    control,
    name: "SMWebsite",
    defaultValue: "",
  });
  const PrintFacebook = useWatch({
    control,
    name: "SMFacebook",
    defaultValue: "",
  });
  const PrintTwitter = useWatch({
    control,
    name: "SMTwitter",
    defaultValue: "",
  });
  const PrintInstagram = useWatch({
    control,
    name: "SMInstagram",
    defaultValue: "",
  });
  const panNumber = useWatch({
    control,
    name: "PDPanNumber",
    defaultValue: "",
  });
  const planType = useWatch({
    control,
    name: "planType",
    defaultValue: "",
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((res) => {
      setProfileImagePayload(res?.payload?.data);
    });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (PrintPincode && PrintPincode.length >= 4 &&
      PrintPincode.length <= 6) {
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




  const onSubmit = (data) => {
    const finalPayload = {
      firstName: "",
      lastName: "",
      profileImage: profileImagePayload,
      fullName: data?.PDCompanyName,
      email: data?.PDEmail,
      userType: "company",

      planId: data?.PDPlan,
      planType :data?.planType ,
      startDate: data?.planStartDate ,
      endDate : data?.planEndDate,
      mobile: {
        number: data?.PDMobileNo ?? "",
        code: data?.PDmobileCode ?? "",
      },
      companyProfile: {
        tagline: data?.PDTagline ?? "",
        companyType: data?.PDOrganizationType ?? "",
        industryType: data?.PDindustrytype,
        penNumber: data?.PDPanNumber.toUpperCase(),
        GSTNumber: data?.PDGstNumber,
        secondaryEmail: "",
        secondaryMobile: {
          number: "",
          code: ""
        },
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
          country: data?.PDSecondarycountry ?? "",
          pinCode: data?.PDSecondaryPinCode ?? ""
        }
      }
    };



    dispatch(companyCreate(finalPayload)).then((output) => {
      !output.error && navigate(`/admin/company`);
    });
  };

  const navTabClick = (clickedStep) => {
    if (clickedStep !== 1) {
      showNotification({
        message: "First submit Primary Details",
        type: 'error',
      });
    }
  };



  const handleFocusIndustry = () => {
    if (!industryListData?.length) {
      dispatch(
        indusSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };

  const handleFocusOrgType = () => {
    if (!orgTypeList?.length) {
      dispatch(orgTypeSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
      })
      );
    }
  };

  const handleFocusPlan = () => {
    if (!planListData?.length) {
      dispatch(planSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
      );
    }
  };

  return (
    <GlobalLayout>
      <div className="grid grid-cols-12 gap-2">
        <div className=" md:col-span-3 col-span-12 w-full h-auto rounded-lg">
          <div className="shadow bg-white rounded-xl py-2">
            <div
              className="relative w-[50px] h-[50px] mx-auto rounded-full border-2 border-slate-600 mt-3 flex items-center justify-center"
            >
              <div
                className="w-full h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center"
                style={{
                  backgroundImage: `url(${profileImage || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!profileImage && (
                  <FaUserAlt className="text-slate-500 w-[30px] h-[25px] cursor-pointer" />
                )}
              </div>

              <div className="absolute bottom-0 right-0 bg-white p-[2px] rounded-full">
                <FaCamera className="text-header w-[16px] h-[16px] " />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>



            <div className="text-base font-medium overflow-auto mx-2 text-center mt-2 text-header capitalize">
              {PrintCompanyName ? PrintCompanyName : "Company Name"}
            </div>
            <div className="text-xs font-normal text-center text-gray-600 capitalize">
              {PrintTagLine ? PrintTagLine : "Tag Line"}
            </div>
            <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Address</label>
                <div className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`} >
                  {PrintAddress && (<>{PrintAddress}, {" "}</>)}
                  {PrintCity && (<>{PrintCity},{" "}</>)}
                  {PrintState && (<>{PrintState},{" "}</>)}
                  {PrintCountry && (<>{PrintCountry},{" "}</>)}
                  {PrintPincode && (<>{PrintPincode}</>)}
                </div>
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Mail</label>
                <div
                  className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                >
                  {PrintMail}
                </div>
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>Phone number</label>
                <div className="flex gap-2">
                  <div
                    className={`mt-1 block overflow-auto text-center  py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8 min-w-8`}
                  >
                    {PrintMobileCode ? PrintMobileCode : +91}
                  </div>
                  <div
                    className={`mt-1 block overflow-auto w-full px-2 py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                  >
                    {PrintMobile}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center text-[25px] text-header py-2 gap-1">
              <TbWorld
                onClick={() => {
                  if (PrintWebsite) {
                    window.open(PrintWebsite, "_blank");
                  }
                }}
              />
              <AiFillInstagram
                onClick={() => {
                  if (PrintInstagram) {
                    window.open(PrintInstagram, "_blank");
                  }
                }}
              />
              <IoLogoFacebook
                onClick={() => {
                  if (PrintFacebook) {
                    window.open(PrintFacebook, "_blank");
                  }
                }}
              />
              <FaSquareXTwitter
                onClick={() => {
                  if (PrintTwitter) {
                    window.open(PrintTwitter, "_blank");
                  }
                }}
              />
            </div>
          </div>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="space-y-2 md:col-span-9 col-span-12">
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
              className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 2 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Documents</span>
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
              <span className="text-sm font-semibold">Bank Details</span>
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
              <span className="text-sm font-semibold">Financial Details</span>
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
              <span className="text-sm font-semibold">Social Media</span>
            </button>
          </div>
          {step === 1 && (
            <div>
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Company Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDCompanyName", {
                        required: "Company Name is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.PDCompanyName
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Company Name"
                    />
                    {errors.PDCompanyName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDCompanyName.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Tag Line</label>
                    <input
                      type="text"
                      {...register("PDTagline")}
                      className={`placeholder: ${inputClassName} ${errors.PDTagline ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Tag Line"
                    />
                    {errors.PDTagline && (
                      <p className="text-red-500 text-sm">
                        {errors.PDTagline.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 md:my-1 px-3">
                <div className="">
                    <label className={`${inputLabelClassName}`}>Plan Type <span className="text-red-600">*</span></label>
                    <Controller
                      name="planType"
                      control={control}
                      rules={{
                        required: "Plan Type is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select Plan Type"
                        >
                          <Select.Option value="">Select Plan Type</Select.Option>
                          <Select.Option value="demo">Demo</Select.Option>
                          <Select.Option value="live">Live</Select.Option>
                        </Select>
                      )}
                    />
                    {errors.PDPlan && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPlan.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Plan <span className="text-red-600">*</span></label>
                    <Controller
                      name="PDPlan"
                      control={control}
                      rules={{
                        required: "Plan is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                          onFocus={() => handleFocusPlan()}
                          placeholder="Select Plan"
                          showSearch

                        >
                          <Select.Option value="">Select Plan</Select.Option>
                          {(planListData?.slice().sort((a, b) => a?.title.localeCompare(b?.title))?.map((element, index) => (
                            <Select.Option key={index} value={element?._id}>
                              {element?.title}
                            </Select.Option>
                          )))}
                        </Select>
                      )}
                    />
                    {errors.PDPlan && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPlan.message}
                      </p>
                    )}
                  </div>
                  


                  {planType == "demo" &&
                    <>
                      <div>
                        <label className={`${inputLabelClassName}`}>Plan Start Date  <span className="text-red-600"> *</span></label>
                        <Controller
                          name="planStartDate"
                          control={control}
                          rules={{
                            required: 'Plan Start date is required'
                          }}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                                                    return current && current.isBefore(moment().endOf('day'), 'day');
                                                  }}  />
                          )}
                        />
                        {errors.planStartDate && <p className="text-red-500 text-sm">Plan Start Date is required</p>}
                      </div>

                      <div>
                        <label className={`${inputLabelClassName}`}>Plan End Date  <span className="text-red-600"> *</span></label>
                        <Controller
                          name="planEndDate"
                          control={control}
                          rules={{
                            required: 'Plan End Date is required'
                          }}
                          render={({ field }) => (
                            <CustomDatePicker field={field} errors={errors} />
                          )}
                        />
                        {errors.planEndDate && <p className="text-red-500 text-sm">Plan End Date is required</p>}
                      </div>

                    </>
                  }



                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Organization Type <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      name="PDOrganizationType"
                      control={control}
                      rules={{
                        required: "Organization type is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDOrganizationType ? "border-[1px] " : "border-gray-300"}`}
                          onFocus={() => handleFocusOrgType()}
                          placeholder="Select Organization Type"
                          showSearch

                        >
                          <Select.Option value="">Select Organization Type</Select.Option>
                          {orgSearchloading ? <Select.Option disabled>
                            <ListLoader />
                          </Select.Option> : (orgTypeList?.slice().sort((a, b) => a.name.localeCompare(b.name))?.map((element, index) => (
                            <Select.Option key={index} value={element?.name}>
                              {element?.name}
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
                      Industry Type <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      name="PDindustrytype"
                      control={control}
                      rules={{
                        required: "Industry Type is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDindustrytype ? "border-[1px] " : "border-gray-300"}`}
                          onFocus={() => handleFocusIndustry()}
                          placeholder="Select Industry Type"
                          showSearch

                        >
                          <Select.Option value="">Select Industry Type</Select.Option>
                          {indusSearchloading ? <Select.Option disabled>
                            <ListLoader />
                          </Select.Option> : (industryListData?.slice().sort((a, b) => a.name.localeCompare(b.name))?.map((element, index) => (
                            <Select.Option key={index} value={element?.name}>
                              {element?.name}
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
                            field.onChange(value);
                          }}
                          options={countryListData?.docs?.map((type) => ({ value: type?.name }))}
                          showSearch
                          filterOption={(inputValue, option) =>
                            option?.value?.toLowerCase().includes(inputValue.toLowerCase())
                          }
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
                          onChange={(value) => field.onChange(value)}
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
                          onChange={(value) => field.onChange(value)}
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
                      Email <span className="text-red-600">*</span>
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
                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        Code <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="PDmobileCode"
                        rules={{ required: "code is required" }}
                        render={({ field }) => (
                          <CustomMobileCodePicker
                            field={field}
                            errors={errors}
                          />
                        )}
                      />
                      {errors.PDmobileCode && (
                        <p className={`${inputerrorClassNameAutoComplete}`}>
                          {errors.PDmobileCode.message}
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
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      GST Number
                    </label>
                    <input
                      type="text"
                      {...register("PDGstNumber", {

                        pattern: {
                          value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/,
                          message: "Invalid GST Number format (29AAACH7409R1ZX)",
                        },

                      })}
                      className={` ${inputClassName} ${errors.PDGstNumber ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter GST Number"
                      maxLength={15}
                    />
                    {errors.PDGstNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.PDGstNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Pan Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDPanNumber", {
                        required: "Pan Number is required",
                        pattern: {
                          value: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/,
                          message: "Invalid PAN card format (ABCDE1234E)",
                        }
                      })}
                      className={` ${panNumber ? "!uppercase" : ""} ${inputClassName} ${errors.PDPanNumber ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Pan Number"
                    />
                    {errors.PDPanNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPanNumber.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-3 pb-2">
                <button
                  type="submit"
                  disabled={companyLoader}
                  className={`${companyLoader ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
                >
                  {companyLoader ? <Loader /> : 'Submit'}
                </button>
              </div>

            </div>
          )}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateCompany;
