

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
  domainName,
  usertypelist,
  inputerrorClassNameAutoComplete,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import getUserIds from '../../../constents/getUserIds';
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { directorCreate, getDirectorDetails } from "./DirectorFeatures/_director_reducers";
import { useNavigate } from "react-router-dom";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { companySearch, getCompanyDetails } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { encrypt } from "../../../config/Encryption";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { AutoComplete, Input, Select } from "antd";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";

const CreateDirector = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const { companyDetailsData,loading:countryLoading } = useSelector((state) => state.company);
  const { loading: directorLoading } = useSelector((state) => state.director);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const {
    userCompanyId,
  } = getUserIds();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const userTypeglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
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
    name: "PDPin",
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
    name: "PDMobileCode",
    defaultValue: "",
  });
  const PrintDirectorName = useWatch({
    control,
    name: "PDDirectorName",
    defaultValue: "",
  });



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

  useEffect(() => {
    setValue("PDMobileCode", "+91");
  }, [countryListData]);



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

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        companyId: companyId,
        firstName: "",
        lastName: "",
        profileImage: profileImagePayload,
        fullName: data?.PDDirectorName,
        // password: data?.PDConfirmPassword,
        email: data?.PDEmail,
        status: data?.PDStatus,
        userType: "companyDirector",
        mobile: {
          code: data?.PDMobileCode,
          number: data?.PDMobileNo,
        },
        directorProfile: {
          tagline: data?.PDTagline ?? "",
          secondaryEmail: "test@gmail.com",
          // secondaryMobile: {
          //   number: "",
          //   code: "",
          // },
        },
        addresses: {
          primary: {
            street: data?.PDAddress ?? "",
            city: data?.PDCity ?? "",
            state: data?.PDState ?? "",
            country: data?.PDCountry ?? "",
            pinCode: data?.PDPin ?? "",
          },
          secondary: {
            street: "",
            city: "",
            state: "",
            country: "",
            pinCode: "",
          },
        },
      };
      dispatch(directorCreate(finalPayload)).then((output) => {
        !output.error && navigate(`/admin/director/edit/${encrypt(output?.payload?.data?._id)}`);
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



  return (
    <GlobalLayout>
      <div className="grid grid-cols-12 gap-2">
        <div className=" md:col-span-3 col-span-12 w-full h-auto rounded-lg  ">
          <div className="shadow bg-white rounded-xl py-2">
            {/* <div
              className="relative w-[50px] h-[50px] mx-auto rounded-full border-2 border-slate-600 mt-3 flex items-center justify-center"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
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

              {isHovering && !profileImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <FaCamera className="text-white w-[20px] h-[20px] cursor-pointer" />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div> */}
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
              {PrintDirectorName ? PrintDirectorName : "Owner Name"}
            </div>
            <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
              <div className="">
                <label className={`${inputLabelClassName}`}>Address</label>
                <div
                  className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                >
                  {PrintAddress && (
                    <>
                      {PrintAddress}, {" "}
                    </>
                  )}
                  {PrintCity && (
                    <>
                      {PrintCity} , {" "}
                    </>
                  )}
                  {PrintState && (
                    <>
                      {PrintState} , {" "}
                    </>
                  )}
                  {PrintCountry && (
                    <>
                      {PrintCountry} , {" "}
                    </>
                  )}
                  {PrintPincode && (
                    <>
                      {PrintPincode}
                    </>
                  )}
                </div>
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>Mail</label>
                <div
                  className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                >
                  {PrintMail}
                </div>
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Phone number
                </label>
                <div className="flex gap-2">
                  <div
                    className={`mt-1 block overflow-auto   py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8 min-w-6`}
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
            {/* <div className="flex justify-center items-center text-[25px] text-header py-2 gap-1">
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
            </div> */}
          </div>
        </div>

        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 md:col-span-9 col-span-12">
          <div className="flex bg-header justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto text-nowrap overflow-y-hidden">
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
            {/* <button
              type="button"
              onClick={() => navTabClick(3)}
              className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-500"
                } cursor-pointer`}
            >
              {step === 3 && (
                <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
              )}
              <span className="text-sm font-semibold">Financial Details</span>
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
              <span className="text-sm font-semibold">Social Media</span>
            </button> */}
          </div>
          {step === 1 && (
            <div className="w-full">
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Owner Name <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="PDDirectorName"
                      rules={{ required: "Owner Name is required" }}
                      render={({ field }) => (
                        <AutoComplete
                          className="w-full"
                          {...field}
                          onFocus={() => {
                            dispatch(getCompanyDetails({
                              _id: userInfoglobal?._id
                            }))
                          }}
                          onChange={(val) => field.onChange(val)}
                          // onChange={(value) => {
                          //   field.onChange(value); // This will update the value when the user types
                          // }}

                          onSelect={(value) => {
                            const selectedType = companyDetailsData?.data?.comapnyOwnerData?.find((type) => type?._id === value);
                            setValue("PDDirectorName", selectedType?.fullName)
                            setValue("PDEmail", selectedType?.email)
                            setValue("PDAddress", selectedType?.addresses?.primary?.street)
                            setValue("PDCountry", selectedType?.addresses?.primary?.country)
                            setValue("PDState", selectedType?.addresses?.primary?.state)
                            setValue("PDCity", selectedType?.addresses?.primary?.city)
                            setValue("PDPin", selectedType?.addresses?.primary?.pinCode)
                            setValue("PDmobileCode", selectedType?.mobile?.code)
                            setValue("PDMobileNo", selectedType?.mobile?.number)

                          }}
                          options={sortByPropertyAlphabetically(companyDetailsData?.data?.comapnyOwnerData,'fullName')?.filter(data => data?.onwerToDirector !== true)?.map((type) => ({
                            value: type?._id,
                            label: type?.fullName
                          }))}
                        >
                          <input

                        
                            placeholder="Enter Owner Name"
                            value={field.label}
                            className={`${inputClassName} ${errors.PDCountry
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                          />
                        </AutoComplete>
                      )}
                    />
                    {/* <input
                      type="text"
                      {...register("PDDirectorName", {
                        required: "Director Name is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.PDDirectorName
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Director Name"
                    /> */}
                    {errors.PDDirectorName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDDirectorName.message}
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
                  
                          options={
                            countryListData?.docs?.map((type) => ({
                            value: type?.name,
                          }))
                        
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
                              e.target.value = e.target.value.slice(0, 6);
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
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div className="">
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
                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        code<span className="text-red-600">*</span>
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

                      {/* <select
                            {...register("PDmobileCode", {
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
                              errors.PDmobileCode
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
                      {errors[`PDmobileCode`] && (
                        <p className={`${inputerrorClassNameAutoComplete}`}>
                          {errors[`PDmobileCode`].message}
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
              </div>
              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  {directorLoading ? <Loader /> : 'Submit'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateDirector;
