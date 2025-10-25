import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  getLocationDataByPincode,
  inputClassName,
  inputDisabledClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { useNavigate } from "react-router-dom";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { branchCreate } from "./branchFeatures/_branch_reducers";
import { encrypt } from "../../../config/Encryption";
import { companySearch, getCompanyDetails } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import GoogleMapContainer from "./GoogleMap";
import { AutoComplete, Input } from "antd";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import ImageUploader from "../../../global_layouts/ImageUploader/ImageUploader";
import ListLoader from "../../../global_layouts/ListLoader";
import getUserIds from "../../../constents/getUserIds";
import LocationPicker from "./LocationPicker";

const CreateBranch = () => {

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState([{ id: Date.now() }]);
  const [profileImage, setProfileImage] = useState(null);
  const [clickedLocationAddress, setClickLocationaddres] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  // const [location, setLocation] = useState({});
  const { countryListData, loading: countryListLoading } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { loading } = useSelector((state) => state.branch);
  const { companyList } = useSelector((state) => state.company);
  const { directorLists } = useSelector((state) => state.director);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { loading: branchLoading } = useSelector((state) => state.branch);
  const [fileName, setFileName] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const { companyDetailsData } = useSelector((state) => state.company);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  

  const {
    register,
    handleSubmit,
    setValue,
    unregister,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const PrintAddress = useWatch({
    control,
    name: "PDAddress",
    defaultValue: "",
  });
  const PrintCity = useWatch({ control, name: "PDCity", defaultValue: "" });
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
  const PrintPincode = useWatch({
    control,
    name: "PDPin",
    defaultValue: "",
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const userTypeglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;


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
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          userType: "company",
          text: "",
          status: true,
        })
      );
    }

    dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
  }, []);

  useEffect(() => {
    setValue("PDmobileCode", "+91");
  }, [countryListData]);

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };

  const handleFileChange = (event) => {
    setProfileImagePayload(event.target.files[0]);
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocsFileChange = (name, e, path) => {
    const file = e.target.files[0];
    setValue(path, file);
    setValue(path, file);
    if (file) {
      setFileName((prevState) => ({
        ...prevState,
        [name]: file.name,
      }));
      const url = URL.createObjectURL(file);
      setFileUrl((prevState) => ({
        ...prevState,
        [name]: url,
      }));
    }
  };
  const handleDelete = (index, deletefileName) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((_, index2) => index2 !== index)
    );
    setFileName((prevState) => {
      const newState = { ...prevState };
      delete newState[deletefileName];
      return newState;
    });
    setFileUrl((prevState) => {
      const newState = { ...prevState };
      delete newState[deletefileName];
      return newState;
    });
    unregister(`DCdocumenttype${index}`);
    unregister(`DCdocumentno${index}`);
    unregister(`DCdocumentUpload${index}`);
  };
  useEffect(() => {
    if (clickedLocationAddress) {
      setValue("PDAddress", clickedLocationAddress?.address);
      setValue("PDCountry", clickedLocationAddress?.country);
      setValue("PDState", clickedLocationAddress?.state);
      setValue("PDCity", clickedLocationAddress?.city);
      setValue("PDPin", clickedLocationAddress?.postalCode);
    }
  }, [clickedLocationAddress]);
  const handleLocationChange = async (locationData) => {
    try {
      setIsLoadingLocation(true);
      setError(null);
      if (!locationData || !locationData.lat || !locationData.lng) {
        throw new Error('Invalid location data received');
      }
      setLocation(locationData);
      setValue("PDPin",locationData?.pincode)
      setValue("PDCountry",locationData?.country)
      setValue("PDState",locationData?.state)
      setValue("PDCity",locationData?.city)
      setValue("PDAddress",locationData?.street)
    } catch (err) {
      console.error('Error handling location change:', err);
      setError(err.message || 'Failed to process location');
    } finally {
      setIsLoadingLocation(false);
    }
  };
  const onSubmit = (data) => {
    if (step === 1) {
      const ISDIRECTORTOBRANCH = companyDetailsData?.data?.comapnyOwnerDirectorBranch?.some(res=> res?.email == data?.PDemail)

      const finalPayload = {
        companyId:
          userTypeglobal === "admin"
            ? data?.PDCompanyId
            : userTypeglobal === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        directorId: "",
        profileImage: data?.ProfileImage ?? "",
        firstName: data?.PDFirstName,
        lastName: data?.PDLastName,
        "branchProfile": {
          "head": data?.PDBranchHead,
          "remarks": data?.PDRemark,
        },
        fullName: data?.PDcompanyName,
        email: data?.PDemail,
        userType: "companyBranch",
        // password: data?.PDpassword,
        // planId: data?.PDPlan,
        mobile: {
          code: data?.PDmobileCode,
          number: data?.PDmobileno,
        },
        isDirectorToBranch: ISDIRECTORTOBRANCH,

        addresses: {
          primary: {
            street: data?.PDAddress ?? "",
            city: data?.PDCity ?? "",
            state: data?.PDState ?? "",
            country: data?.PDCountry ?? "",
            pinCode: data?.PDPin,
          },
          location: {
            latitude: location?.lat,
            longitude: location?.lng,
            address: data?.PDAddress,
          },
          // branchCode: data?.PDBranchCode,
        },
      };

      dispatch(branchCreate(finalPayload)).then((output) => {
        if (!output.error) {

          navigate(
            `/admin/branch`
          );
        }
      });
    }
    // if (step === 2) {
    //   const documentPayload = documents
    //     .map((doc, index) => {
    //       return {
    //         [`documents[${index}][name]`]: data[`DCdocumenttype${index}`],
    //         [`documents[${index}][number]`]: data[`DCdocumentno${index}`],
    //         [`documents[${index}][file]`]: data[`DCdocumentUpload${index}`],
    //       };
    //     })
    //     .reduce((acc, obj) => {
    //       Object.entries(obj).forEach(([key, value]) => {
    //         acc[key] = value;
    //       });
    //       return acc;
    //     }, {});

    //   const finalPayload = {
    //     firstName: data?.PDFirstName,
    //     lastName: data?.PDLastName,
    //     profileImage: profileImagePayload,
    //     fullName: data?.PDcompanyName,
    //     email: data?.PDemail,
    //     userType: "companyBranch",
    //     password: data?.PDpassword,
    //     planId: data?.PDPlan,
    //     "mobile.code": data?.PDmobileCode,
    //     "mobile.number": data?.PDmobileno,
    //     "branchProfile.secondaryEmail": data?.PDemail ?? "",
    //     "branchProfile.addresses.primary.street": data?.PDAddress ?? "",
    //     "branchProfile.addresses.primary.city": data?.PDCity ?? "",
    //     "branchProfile.addresses.primary.state": data?.PDState ?? "",
    //     "branchProfile.addresses.primary.country": data?.PDcountry ?? "",
    //     "branchProfile.addresses.primary.pinCode": data?.PDPin,
    //     "branchProfile.branchCode": data?.PDBranchCode,
    //     ...documentPayload,
    //   };

    //   dispatch(branchCreate(finalPayload)).then((output) => {
    //     !output.error && navigate("/admin/branch");
    //   });
    // }
  };
  const navTabClick = (clickedStep) => {
    if (clickedStep !== 1) {
      showNotification({
        message: "First submit Primary Details",
        type: "error",
      });
    }
  };

  // useEffect(() => {
  //   if (location && location?.lat && location?.lng) {
  //     setValue("PDlatitude", location?.lat);
  //     setValue("PDLongitude", location?.lng);
  //   }
  // }, [location]);



  return (
    <GlobalLayout>
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-12 gap-2">
          <form
            className="space-y-2 md:col-span-12 col-span-12"
            onSubmit={handleSubmit(onSubmit)}
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
                  } cursor-pointer`} >
                {step === 3 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Bank</span>
              </button>
            </div>
            {step === 1 && (
              <>
                <div className="grid  grid-cols-1 md:grid-cols-2">
                  <div className="md:space-y-0 space-y-2">
                    <Controller
                      name="ProfileImage"
                      control={control}
                      render={({ field }) => (
                        <ImageUploader
                          setValue={setValue} // Pass setValue to the ImageUploader
                          name="image" // The field name in React Hook Form
                          field={field}

                        />
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 my-1 px-3">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Branch Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("PDcompanyName", {
                            required: "Branch Name is required",
                          })}
                          className={`placeholder: ${inputClassName} ${errors.PDcompanyName
                              ? "border-[1px] "
                              : "border-gray-300"
                            }`}
                          placeholder="Enter Branch Name"
                        />
                        {errors.PDcompanyName && (
                          <p className="text-red-500 text-sm">
                            {errors.PDcompanyName.message}
                          </p>
                        )}
                      </div>
                      <div className="pt-1">
                        <label className={`${inputLabelClassName}`}>
                          Branch Head <span className="text-red-600">*</span>
                        </label>
                        {/* <input
                        type="text"
                        {...register("PDBranchHead", {
                          required: "Branch Head is required",
                        })}
                        className={` ${inputClassName} ${
                          errors.PDBranchHead
                            ? "border-[1px] "
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Branch Head"
                      /> */}
                        <Controller
                          control={control}
                          name="PDBranchHead"
                          rules={{ required: "Head  Name is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              className="w-full"
                              {...field}
                              onFocus={() => {
                                dispatch(getCompanyDetails({
                                  _id: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                                }))
                              }}
                              // onChange={(value) => {
                              //   field.onChange(value); // This will update the value when the user types
                              // }}

                              onSelect={(value) => {
                                const selectedType = companyDetailsData?.data?.comapnyOwnerDirectorBranch?.find((type) => type?._id === value);
                                setValue("PDBranchHead", selectedType?.fullName)
                                setValue("PDemail", selectedType?.email)
                                setValue("PDAddress", selectedType?.addresses?.primary?.street)
                                setValue("PDCountry", selectedType?.addresses?.primary?.country)
                                setValue("PDState", selectedType?.addresses?.primary?.state)
                                setValue("PDCity", selectedType?.addresses?.primary?.city)
                                setValue("PDPin", selectedType?.addresses?.primary?.pinCode)
                                setValue("PDmobileCode", selectedType?.mobile?.code)
                                setValue("PDmobileno", selectedType?.mobile?.number)

                              }}
                              options={sortByPropertyAlphabetically(companyDetailsData?.data?.comapnyOwnerDirectorBranch, 'fullName')?.map((type) => ({
                                value: type?._id,
                                label: type?.fullName
                              }))}
                            >
                              <input
                                placeholder="Enter Head Name"
                                value={field.label}
                                className={`${inputClassName} ${errors.PDCountry
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDBranchHead && (
                          <p className="text-red-500 text-sm pt-2">
                            {errors.PDBranchHead.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                      {userTypeglobal === "admin" && (
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Company <span className="text-red-600">*</span>
                          </label>
                          <select
                            {...register("PDCompanyId", {
                              required: "Company is required",
                            })}
                            className={` ${inputClassName} ${errors.PDCompanyId
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                          >
                            <option className="" value="">
                              Select Company
                            </option>
                            {companyList?.map((type) => (
                              <option value={type?._id}>
                                {type?.fullName}({type?.userName})
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
                      {/* <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Remark <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("PDRemark", {
                          required: "Remark is required",
                        })}
                        className={` ${inputClassName} ${
                          errors.PDRemark
                            ? "border-[1px] "
                            : "border-gray-300"
                        }`}
                        placeholder="Enter Remark"
                      />
                      {errors.PDRemark && (
                        <p className="text-red-500 text-sm">
                          {errors.PDRemark.message}
                        </p>
                      )}
                    </div> */}
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Password <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="password"
                          {...register("PDpassword", {
                            required: "Password is required",
                          })}
                          className={` ${inputClassName} ${
                            errors.PDpassword
                              ? "border-[1px] "
                              : "border-gray-300"
                          }`}
                          placeholder="Enter Password"
                        />
                        {errors.PDpassword && (
                          <p className="text-red-500 text-sm">
                            {errors.PDpassword.message}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Confirm Password{" "}
                          <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="password"
                          {...register("PDConfirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                              value === PrintPassword ||
                              "Passwords do not match",
                          })}
                          className={` ${inputClassName} ${
                            errors.PDConfirmPassword
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
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("PDemail", {
                            required: "Email is required",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Please enter a valid email address",
                            },
                          })}
                          className={` ${inputClassName} ${errors.PDemail
                              ? "border-[1px] "
                              : "border-gray-300"
                            }`}
                          placeholder="Enter Email"
                        />
                        {errors.PDemail && (
                          <p className="text-red-500 text-sm">
                            {errors.PDemail.message}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3 mt-1">
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
                            Mobile No <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            {...register(`PDmobileno`, {
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
                            className={` ${inputClassName} ${errors[`PDmobileno`]
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
                          {errors[`PDmobileno`] && (
                            <p className="text-red-500 text-sm">
                              {errors[`PDmobileno`].message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                      <div className="col-span-2">
                        <label className={`${inputLabelClassName}`}>
                          Primary Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("PDAddress", {
                            required: "Address  is required",
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
                              options={sortByPropertyAlphabetically(countryListData?.docs, 'name')?.map((type) => ({
                                value: type?.name,
                              }))}
                              notFoundContent={countryListLoading && <ListLoader />}
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

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Country <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          disabled
                          {...register("PDcountry", {
                            required: "Country is required",
                          })}
                          className={` ${inputDisabledClassName} ${
                            errors.PDcountry
                              ? "border-[1px] "
                              : "border-gray-300"
                          }`}
                          placeholder="Enter Country"
                        />
                        {errors.PDcountry && (
                          <p className="text-red-500 text-sm">
                            {errors.PDcountry.message}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          State<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          disabled
                          {...register("PDState", {
                            required: "State is required",
                          })}
                          className={` ${inputDisabledClassName} ${
                            errors.PDState
                              ? "border-[1px] "
                              : "border-gray-300"
                          }`}
                          placeholder="Enter State"
                        />
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
                        <input
                          type="text"
                          disabled
                          {...register("PDCity", {
                            required: "City is required",
                          })}
                          className={` ${inputDisabledClassName} ${
                            errors.PDCity ? "border-[1px] " : "border-gray-300"
                          }`}
                          placeholder="Enter City"
                        />
                        {errors.PDCity && (
                          <p className="text-red-500 text-sm">
                            {errors.PDCity.message}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Pin Code <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          disabled
                          {...register("PDPin", {
                            required: "Pin Code is required",
                          })}
                          className={`${inputDisabledClassName} ${
                            errors.PDPin ? "border-[1px] " : "border-gray-300"
                          }`}
                          placeholder="Enter Pin Code"
                          maxLength={6}
                          onInput={(e) => {
                            if (e.target.value.length > 6) {
                              e.target.value = e.target.value.slice(0, 6);
                            }
                          }}
                        />
                        {errors.PDPin && (
                          <p className="text-red-500 text-sm">
                            {errors.PDPin.message}
                          </p>
                        )}
                      </div>
                    </div> */}

                    {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          latitude <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          disabled
                          {...register("PDlatitude", {
                            required: "latitude is required",
                          })}
                          className={` ${inputDisabledClassName} ${
                            errors.PDlatitude
                              ? "border-[1px] "
                              : "border-gray-300"
                          }`}
                          placeholder="Enter latitude"
                        />
                        {errors.PDlatitude && (
                          <p className="text-red-500 text-sm">
                            {errors.PDlatitude.message}
                          </p>
                        )}
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          longitude <span className="text-red-600">*</span>
                        </label>
                        <input
                          disabled
                          type="number"
                          {...register("PDLongitude", {
                            required: "longitude is required",
                          })}
                          className={` ${inputDisabledClassName} ${
                            errors.PDLongitude
                              ? "border-[1px] "
                              : "border-gray-300"
                          }`}
                          placeholder="Re-enter Password"
                        />
                        {errors.PDLongitude && (
                          <p className="text-red-500 text-sm">
                            {errors.PDLongitude.message}
                          </p>
                        )}
                      </div>
                    </div> */}
                  </div>
                  {/* <LocationPicker 
          onLocationChange={handleLocationChange}
          editable={true}
        /> */}
                  <GoogleMapContainer
                    location={location}
                    setLocation={setLocation}
                    address={PrintAddress}
                    setClickLocationaddres={setClickLocationaddres}
                  />
                </div>
                <div className="flex justify-between px-3 pb-2">
                  <button type="Submit" className={`${formButtonClassName}`}>
                    Submit Details
                  </button>
                </div>
              </>
            )}
            {step === 2 && (
              <div>
                <div className=" rounded-md ">
                  {documents.map((document, index) => (
                    <>
                      <div
                        key={document.id}
                        className="px-3 grid  sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3"
                      >
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Document Type{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <select
                            {...register(`DCdocumenttype${index}`, {
                              required: "Document type is required",
                            })}
                            className={`mt-0 ${inputClassName} ${errors[`DCdocumenttype${index}`]
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                          >
                            <option className="text-xs" value="">
                              Select Document Type
                            </option>
                            {employeeDocumentList?.map((type) => (
                              <option key={type.name} value={type.name}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                          {errors[`DCdocumenttype${index}`] && (
                            <p className="text-red-500 text-sm">
                              {errors[`DCdocumenttype${index}`].message}
                            </p>
                          )}
                        </div>

                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Document No <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register(`DCdocumentno${index}`, {
                              required: "Document no is required",
                            })}
                            className={` ${inputClassName} ${errors[`DCdocumentno${index}`]
                                ? "border-[1px] "
                                : "border-gray-300"
                              }`}
                            placeholder="Enter Document No"
                          />
                          {errors[`DCdocumentno${index}`] && (
                            <p className="text-red-500 text-sm">
                              {errors[`DCdocumentno${index}`].message}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                              className="hidden"
                              id={`DCdocumentUpload${index}`}
                              {...register(`DCdocumentUpload${index}`)}
                              onChange={(e) =>
                                handleDocsFileChange(
                                  `DCdocumentUpload${index}File`,
                                  e,
                                  `DCdocumentUpload${index}`
                                )
                              }
                            />
                            <br />
                            <label
                              htmlFor={`DCdocumentUpload${index}`}
                              className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded "
                            >
                              Upload
                            </label>
                            {fileName[`DCdocumentUpload${index}File`] && (
                              <p className="text-sm text-gray-600 max-w-[120px] truncate">
                                {fileName[`DCdocumentUpload${index}File`]}
                              </p>
                            )}
                            {errors[`DCdocumentUpload${index}`] && (
                              <p className="text-red-500 text-sm">
                                {errors[`DCdocumentUpload${index}`].message}
                              </p>
                            )}
                          </div>
                          {fileUrl[`DCdocumentUpload${index}File`] && (
                            <img
                              alt=""
                              src={fileUrl[`DCdocumentUpload${index}File`]}
                              className="w-20 h-20 shadow rounded-sm"
                            />
                          )}
                        </div>
                      </div>
                      <div className="px-3  gap-4 items-end mb-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(index, `DCdocumentUpload${index}File`)
                          }
                          className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                        </button>
                      </div>
                    </>
                  ))}

                  <div className="flex justify-between px-3 pb-2">
                    <button
                      type="button"
                      onClick={handleAddMore}
                      className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
                    >
                      Add More
                    </button>
                  </div>
                </div>
                <div className="flex justify-between px-3 pb-2">
                  <button
                    type="submit"
                    disabled={branchLoading}
                    className={`${branchLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
                  >
                    {branchLoading ? <Loader /> : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </form>
          
        </div>
      )}
      
    </GlobalLayout>
  );
};

export default CreateBranch;
