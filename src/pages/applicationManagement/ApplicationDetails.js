import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  inputClassName,
  inputLabelClassName,
} from "../../../constents/global.js";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager.js";
import { useNavigate, useParams } from "react-router-dom";
import { getCountryListFunc } from "../../global/address/country/CountryFeatures/_country_reducers";
import { getStateList } from "../../global/address/state/featureStates/_state_reducers";
import { getCityList } from "../../global/address/city/CityFeatures/_city_reducers";
import { getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { decrypt } from "../../../config/Encryption.js";
import { getBranchDetails, updateBranch } from "./branchFeatures/_branch_reducers.js";
import Loader from "../../../global_layouts/Loader/Loader.js";
import { empDoctSearch } from "../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers.js";
import getUserIds from "../../constents/getUserIds.js";

const ApplicationDetails = () => {

  const branchId = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?._id
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
  const [documents, setDocuments] = useState([{ id: Date.now() }]);
  const [bank, setBank] = useState([{ id: Date.now() }]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  const [isHovering, setIsHovering] = useState(false);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { branchDetailsData } = useSelector((state) => state.branch);
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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
    name: "PDcountry",
    defaultValue: "",
  });
  const PrintSecondaryState = useWatch({
    control,
    name: "PDSecondaryState",
    defaultValue: "",
  });
  const PrintSecondaryCountry = useWatch({
    control,
    name: "PDSecondarycountry",
    defaultValue: "",
  });
  const PrintPincode = useWatch({
    control,
    name: "PDPin",
    defaultValue: "",
  });
  const PrintMail = useWatch({
    control,
    name: "PDemail",
    defaultValue: "",
  });
  const PrintMobile = useWatch({
    control,
    name: "PDmobileno",
    defaultValue: "",
  });
  const PrintCompanyName = useWatch({
    control,
    name: "PDcompanyName",
    defaultValue: "",
  });
  const PrintTagLine = useWatch({
    control,
    name: "PDtagline",
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
  const PrintPassword = useWatch({
    control,
    name: "PDpassword",
    defaultValue: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {

        await dispatch(getCountryListFunc());
        await dispatch(getStateList());
        await dispatch(getCityList());

        await dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
        const reqData = {
          _id: branchId,
        };
        await dispatch(getBranchDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (branchDetailsData?.data) {
      setDocuments([...branchDetailsData?.data?.documentData]);
      setProfileImage(`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${branchDetailsData?.data?.profileImage}`)
      // Main company details
      setValue("PDcompanyName", branchDetailsData?.data?.fullName);
      setValue("PDFirstName", branchDetailsData?.data?.firstName);
      setValue("PDLastName", branchDetailsData?.data?.lastName);
      setValue("PDtagline", branchDetailsData?.data?.companyProfile?.tagline);
      setValue("PDpassword", "******");
      setValue("PDConfirmPassword", "******");
      setValue("PDPlan", branchDetailsData?.data?.planId);
      setValue(
        "PDBranchCode",
        branchDetailsData?.data?.branchProfile?.branchCode
      );

      // Address details
      setValue(
        "PDAddress",
        branchDetailsData?.data?.companyProfile?.addresses?.primary?.street
      );
      setValue(
        "PDcountry",
        branchDetailsData?.data?.companyProfile?.addresses?.primary?.country
      );
      setValue(
        "PDState",
        branchDetailsData?.data?.companyProfile?.addresses?.primary?.state
      );
      setValue(
        "PDCity",
        branchDetailsData?.data?.companyProfile?.addresses?.primary?.city
      );
      setValue(
        "PDPin",
        branchDetailsData?.data?.companyProfile?.addresses?.primary?.pinCode
      );
      // Contact details
      setValue("PDemail", branchDetailsData?.data?.email);
      setValue("PDmobileCode", branchDetailsData?.data?.mobile?.code);
      setValue("PDmobileno", branchDetailsData?.data?.mobile?.number);

      // Identification details
      setValue("PDaadharNumber", branchDetailsData?.data?.aadharNumber);
      setValue("PDgstnumber", branchDetailsData?.data?.gstNumber);
      setValue("PDpannumber", branchDetailsData?.data?.panNumber);
      setValue("PDfrn", branchDetailsData?.data?.frn);
      setValue("PDtannumber", branchDetailsData?.data?.tanNumber);

      // Document details
      setValue("DCdocumenttype0", branchDetailsData?.data?.documentType0);
      setValue("DCdocumentno0", branchDetailsData?.data?.documentNo0);
      setValue("DCdocumentUpload0", branchDetailsData?.data?.documentUpload0);

      branchDetailsData?.data?.documentData?.forEach((doc, index) => {
        setValue(`DCdocumenttype${index}`, doc?.name);
        setValue(`DCdocumentno${index}`, doc?.number);
      });
    }
  }, [branchDetailsData]);

  // useEffect(() => {
  //      setValue("PDState", '');
  //     setValue("PDCity", '');
  // }, [PrintCountry]);
  // useEffect(() => {
  // setValue("PDCity", '');
  // }, [PrintState]);

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };
  const handleBankAddMore = () => {
    setBank([...bank, { id: Date.now() }]);
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

  const handleView = (path) => {
    if (path) {
      window.open(path, "_blank");
    } else {
      console.error("No image path provided!");
    }
  };
  const handleEdit = (id) => { };
  const handleDelete = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.filter((_, index2) => index2 !== index)
    );
    unregister(`DCdocumenttype${index}`);
    unregister(`DCdocumentno${index}`);
    unregister(`DCdocumentUpload${index}`);
  };
  const handleBankView = (id) => { };
  const handleBankEdit = (id) => { };
  const handleBankDelete = (index) => {
    setBank((prevDocuments) =>
      prevDocuments.filter((_, index2) => index2 !== index)
    );
    unregister(`DCdocumenttype${index}`);
    unregister(`DCdocumentno${index}`);
    unregister(`DCdocumentUpload${index}`);
  };

  const handleToggle = (e) => {
    setIsSameAsPermanent((prev) => !prev);
    if (!isSameAsPermanent) {
      setValue("PDSecondaryAddress", getValues("PDAddress"));
      setValue("PDSecondaryCity", getValues("PDCity"));
      setValue("PDSecondaryState", getValues("PDState"));
      setValue("PDSecondarycountry", getValues("PDcountry"));
      setValue("PDSecondaryPin", getValues("PDPin"));
    } else {
      setValue("PDSecondaryAddress", "");
      setValue("PDSecondaryCity", "");
      setValue("PDSecondaryState", "");
      setValue("PDSecondarycountry", "");
      setValue("PDSecondaryPin", "");
    }
  };

  const onSubmit = (data) => {
    if (step === 2) {
      const documentPayload = documents
        .map((doc, index) => {
          return {
            [`documents[${index}][name]`]: data[`DCdocumenttype${index}`],
            [`documents[${index}][number]`]: data[`DCdocumentno${index}`],
            [`documents[${index}][file]`]: data[`DCdocumentUpload${index}`][0],
          };
        })
        .reduce((acc, obj) => {
          Object.entries(obj).forEach(([key, value]) => {
            acc[key] = value;
          });
          return acc;
        }, {});


      const finalPayload = {
        _id: branchId,
        "firstName": data?.PDFirstName,
        "lastName": data?.PDLastName,
        profileImage: profileImagePayload,
        "fullName": data?.PDcompanyName,
        "email": data?.PDemail,
        "userType": "companyBranch",
        "password": data?.PDpassword,
        "planId": data?.PDPlan,
        "mobile.code": data?.PDmobileCode,
        "mobile.number": data?.PDmobileno,
        "branchProfile.secondaryEmail": data?.PDemail ?? "",
        "branchProfile.addresses.primary.street": data?.PDAddress ?? "",
        "branchProfile.addresses.primary.city": data?.PDCity ?? "",
        "branchProfile.addresses.primary.state": data?.PDState ?? "",
        "branchProfile.addresses.primary.country": data?.PDcountry ?? "",
        "branchProfile.addresses.primary.pinCode": data?.PDPin,
        "branchProfile.branchCode": data?.PDBranchCode,
        ...documentPayload

      };

      dispatch(updateBranch(finalPayload))
        .then((output) => {
          !output.error && navigate("/admin/branch");
        });
    } else {

      setStep((prev) => prev + 1);
    }
  };
  const navTabClick = (clickedStep) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    } else {
      setStep(clickedStep);
    }
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="w-full px-2 py-2"></div>
      <div className="grid grid-cols-12 gap-2">
        <div className=" md:col-span-3 col-span-12 w-full h-auto rounded-lg px-2 ">
          <div className="shadow bg-white rounded-xl py-2">
            <div
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
            </div>
            <div className="text-base font-medium overflow-auto mx-2 text-center mt-2 text-header capitalize">
              {PrintCompanyName ? PrintCompanyName : "Organization Name"}
            </div>
            <div className="text-xs font-normal text-center text-gray-600 capitalize">
              {PrintTagLine ? PrintTagLine : "Tag Line"}
            </div>
            <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
              <div className="">
                <label className={`${inputLabelClassName}`}>Address</label>
                <div
                  className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                >
                  {PrintAddress}
                  {PrintCity && (
                    <>
                      <br />
                      <span className="text-header font-semibold pr-1">
                        City :
                      </span>
                      {PrintCity}
                    </>
                  )}
                  {PrintState && (
                    <>
                      <br />
                      <span className="text-header font-semibold pr-1">
                        State :{" "}
                      </span>{" "}
                      {PrintState}
                    </>
                  )}
                  {PrintCountry && (
                    <>
                      <br />
                      <span className="text-header font-semibold pr-1">
                        Country :{" "}
                      </span>
                      {PrintCountry}
                    </>
                  )}
                  {PrintPincode && (
                    <>
                      <br />
                      <span className="text-header font-semibold pr-1">
                        Pin :{" "}
                      </span>
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
                <label className={`${inputLabelClassName}`}>Phone number</label>
                <div className="flex gap-2">
                  <div
                    className={`mt-1 block overflow-auto   py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8 min-w-6`}
                  >
                    +91
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
                  } else {
                    showNotification({
                      message: "Please add website link ",
                      type: "info",
                    });
                  }
                }}
              />
              <AiFillInstagram
                onClick={() => {
                  if (PrintInstagram) {
                    window.open(PrintInstagram, "_blank");
                  } else {
                    showNotification({
                      message: "Please add Instagram link ",
                      type: "info",
                    });
                  }
                }}
              />
              <IoLogoFacebook
                onClick={() => {
                  if (PrintFacebook) {
                    window.open(PrintFacebook, "_blank");
                  } else {
                    showNotification({
                      message: "Please add Facebook link ",
                      type: "info",
                    });
                  }
                }}
              />
              <FaSquareXTwitter
                onClick={() => {
                  if (PrintTwitter) {
                    window.open(PrintTwitter, "_blank");
                  } else {
                    showNotification({
                      message: "Please add Twitter link ",
                      type: "info",
                    });
                  }
                }}
              />
            </div>
          </div>
        </div>
        <form
          className="space-y-2 md:col-span-9 col-span-12"

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
            {/* <button
            type="button"
            onClick={() => navTabClick(3)}
            className={`flex flex-col items-center relative pb-2 ${
              step === 3 ? "text-white ]" : "text-gray-500"
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
            className={`flex flex-col items-center relative pb-2 ${
              step === 4 ? "text-white ]" : "text-gray-500"
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
            className={`flex flex-col items-center relative pb-2 ${
              step === 5 ? "text-white ]" : "text-gray-500"
            } cursor-pointer`}
          >
            {step === 5 && (
              <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
            )}
            <span className="text-sm font-semibold">Social Media</span>
          </button> */}
          </div>
          {step === 1 && (
            <>
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Branch Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDcompanyName", {
                        required: "Branch Name is required",
                      })}
                      readOnly
                      disabled
                      className={`placeholder:  !bg-gray-300 ${inputClassName} ${errors.PDcompanyName
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
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Branch Code <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDBranchCode", {
                        required: "Branch Code is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDBranchCode ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Branch Code"
                    />
                    {errors.PDBranchCode && (
                      <p className="text-red-500 text-sm">
                        {errors.PDBranchCode.message}
                      </p>
                    )}
                  </div>
                  {/* <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Tag Line <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDtagline")}
                    readOnly
                    disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDtagline ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter Tag Line"
                  />
                  {errors.PDtagline && (
                    <p className="text-red-500 text-sm">
                      {errors.PDtagline.message}
                    </p>
                  )}
                </div> */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDFirstName", {
                        required: "First Name is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDFirstName ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter First Name"
                    />
                    {errors.PDFirstName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDFirstName.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Last Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("PDLastName", {
                        required: "Last Name is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDLastName ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Last Name"
                    />
                    {errors.PDLastName && (
                      <p className="text-red-500 text-sm">
                        {errors.PDLastName.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      {...register("PDpassword", {
                        required: "Password is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDpassword ? "border-[1px] " : "border-gray-300"
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
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="password"
                      {...register("PDConfirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) =>
                          value === PrintPassword || "Passwords do not match",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDConfirmPassword
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
                  {/* <div className="">
                  <label className={`${inputLabelClassName}`}>Plan</label>
                  <select
                    {...register("PDPlan", {
                      required: "Plan is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDPlan ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="text-xs" value="">
                      Select Plan
                    </option>
                    {planListData?.map((type) => (
                      <option value={type?._id}>{type?.title}</option>
                    ))}
                  </select>
                  {errors.PDPlan && (
                    <p className="text-red-500 text-sm">
                      {errors.PDPlan.message}
                    </p>
                  )}
                </div> */}
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Organization Type
                  </label>
                  <select
                    {...register("PDorganizationtype", {
                      required: "Organization type is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDorganizationtype
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="text-xs" value="">
                      Select Organization Type
                    </option>
                    {organizationTypes?.map((type) => (
                      <option value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.PDorganizationtype && (
                    <p className="text-red-500 text-sm">
                      {errors.PDorganizationtype.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Industry Type
                  </label>
                  <select
                    {...register("PDindustrytype", {
                      required: "Industry type is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDindustrytype
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="text-xs" value="">
                      Select Industry Type
                    </option>
                    {industryListData?.map((type) => (
                      <option value={type.name}>{type.name}</option>
                    ))}
                  </select>
                  {errors.PDindustrytype && (
                    <p className="text-red-500 text-sm">
                      {errors.PDindustrytype.message}
                    </p>
                  )}
                </div>
              </div> */}

                {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Department Incharge{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDdepartmentinchange", {
                      required: "Department incharge is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDdepartmentinchange
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Department Incharge"
                  />
                  {errors.PDdepartmentinchange && (
                    <p className="text-red-500 text-sm">
                      {errors.PDdepartmentinchange.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>Branch</label>
                  <select
                    {...register("PDbranch")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDbranch ? "border-[1px] " : "border-gray-300"
                    }`}
                  >
                    <option className="text-xs" value="">
                      Select Branch
                    </option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.PDbranch && (
                    <p className="text-red-500 text-sm">
                      {errors.PDbranch.message}
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
                      readOnly
                      disabled
                      className={` !bg-gray-300 ${inputClassName} ${errors.PDAddress1 ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Address 1"
                    />
                    {errors.PDAddress1 && (
                      <p className="text-red-500 text-sm">
                        {errors.PDAddress1.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Country</label>
                    <select
                      {...register("PDcountry", {
                        required: "Country is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDcountry ? "border-[1px] " : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Country
                      </option>
                      {countryListData?.docs?.map((type) => (
                        <option value={type?.name}>{type?.name}</option>
                      ))}
                    </select>
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
                    <select
                      {...register("PDState", {
                        required: "State is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDState ? "border-[1px] " : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select State
                      </option>
                      {stateListData?.docs?.map((type) => (
                        <option value={type?.name}>{type?.name}</option>
                      ))}
                    </select>

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
                    <select
                      {...register("PDCity", {
                        required: "City is required",
                      })}
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDCity ? "border-[1px] " : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select City
                      </option>
                      {cityListData?.docs?.map((type) => (
                        <option value={type?.name}>{type?.name}</option>
                      ))}
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
                      {...register("PDPin", {
                        required: "Pin Code is required",
                      })}
                      readOnly
                      disabled
                      className={` !bg-gray-300 ${inputClassName} ${errors.PDPin ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter pin Code"
                    />
                    {errors.PDPin && (
                      <p className="text-red-500 text-sm">
                        {errors.PDPin.message}
                      </p>
                    )}
                  </div>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                <div className="col-span-2">
                  <label
                    className={`${inputLabelClassName} flex items-center justify-between`}
                  >
                    <div>
                      Secondary Address<span className="text-red-600">*</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameAsPrimary"
                        onChange={handleToggle}
                        className="h-4 w-4 rounded-full border-gray-300"
                      />
                      <label
                        htmlFor="sameAsPrimary"
                        className={`${inputLabelClassName} `}
                      >
                        Same as Primary Address
                      </label>
                    </div>
                  </label>

                  <input
                    type="text"
                    {...register("PDSecondaryAddress", {
                      required: " Secondary Address is required",
                    })}
                      readOnly
                      disabled
                    className={` !bg-gray-300 ${inputClassName} ${
                      errors.PDSecondaryAddress
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter SecondaryAddress "
                  />
                  {errors.PDSecondaryAddress && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondaryAddress.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Country<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDSecondarycountry", {
                      required: "Country is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDSecondarycountry
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select Country
                    </option>
                    {countryListData?.docs?.map((type) => (
                      <option value={type?.name}>{type?.name}</option>
                    ))}
                  </select>
                  {errors.PDSecondarycountry && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondarycountry.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    State<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDSecondaryState", {
                      required: "State is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDSecondaryState
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select State
                    </option>
                    {stateListData?.docs?.map((type) => (
                      <option value={type?.name}>{type?.name}</option>
                    ))}
                  </select>
                  {errors.PDSecondaryState && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondaryState.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    City<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDSecondaryCity", {
                      required: "City is required",
                    })}
                      readOnly
                      disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.PDSecondaryCity
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="" value="">
                      Select City
                    </option>
                    {cityListData?.docs?.map((type) => (
                      <option value={type?.name}>{type?.name}</option>
                    ))}
                  </select>
                  {errors.PDSecondaryCity && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondaryCity.message}
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
                    {...register("PDSecondaryPin", {
                      required: "Pin Code is required",
                    })}
                      readOnly
                      disabled
                    className={` !bg-gray-300 ${inputClassName} ${
                      errors.PDSecondaryPin
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter pin Code"
                  />
                  {errors.PDSecondaryPin && (
                    <p className="text-red-500 text-sm">
                      {errors.PDSecondaryPin.message}
                    </p>
                  )}
                </div>
              </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Email<span className="text-red-600">*</span>
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
                      readOnly
                      disabled
                      className={`  !bg-gray-300 ${inputClassName} ${errors.PDemail ? "border-[1px] " : "border-gray-300"
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
                    <div className="w-20">
                      <label className={`${inputLabelClassName}`}>
                        code<span className="text-red-600">*</span>
                      </label>

                      <select
                        {...register("PDmobileCode", {
                          required: "MobileCode is required",
                        })}
                        readOnly
                        disabled
                        className={`  !bg-gray-300 ${inputClassName} ${errors.PDmobileCode
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
                      {errors[`PDmobileCode`] && (
                        <p className="text-red-500 text-sm">
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
                        readOnly
                        disabled
                        className={`  !bg-gray-300 ${inputClassName} ${errors[`PDmobileno`]
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Mobile No"
                      />
                      {errors[`PDmobileno`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`PDmobileno`].message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Aadhar Number
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDaadharNumber", {
                      required: " Aadhar Number is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDaadharNumber
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Aadhar Number"
                  />
                  {errors.PDaadharNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.PDaadharNumber.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    GST Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDgstnumber", {
                      required: "Gst is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDgstnumber
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Gst Number"
                  />
                  {errors.PDgstnumber && (
                    <p className="text-red-500 text-sm">
                      {errors.PDgstnumber.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    PAN Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDpannumber", {
                      required: "Pan number is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDpannumber
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Pan Number"
                  />
                  {errors.PDpannumber && (
                    <p className="text-red-500 text-sm">
                      {errors.PDpannumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    FRN <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDfrn")}
                    readOnly
                    disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDfrn ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter Frn"
                  />
                  {errors.PDfrn && (
                    <p className="text-red-500 text-sm">
                      {errors.PDfrn.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    TAN Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("PDtannumber")}
                    readOnly
                    disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.PDtannumber
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Tan Number"
                  />
                  {errors.PDtannumber && (
                    <p className="text-red-500 text-sm">
                      {errors.PDtannumber.message}
                    </p>
                  )}
                </div>
              </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                  {/* <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Others <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("others")}
                    readOnly
                    disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors.others ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter Others"
                  />
                  {errors.others && (
                    <p className="text-red-500 text-sm">
                      {errors.others.message}
                    </p>
                  )}
                </div> */}
                </div>
              </div>

            </>
          )}

          {step === 2 && (
            <div>
              <div className=" rounded-md ">
                {documents.map((document, index) => (
                  <div
                    key={document.id}
                    className="px-3 grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3"
                  >
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Document Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register(`DCdocumenttype${index}`, {
                          required: "Document type is required",
                        })}
                        readOnly
                        disabled
                        className={` mt-0  !bg-gray-300 ${inputClassName} ${errors[`DCdocumenttype${index}`]
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      >
                        <option className="text-xs" value="">
                          Select Document Type
                        </option>
                        {employeeDocumentList?.map((type) => (
                          <option value={type.name}>{type.name}</option>
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
                        readOnly
                        disabled
                        className={`placeholder:text-xs h-[37px] rounded-lg mt-0  focus:outline-none  !bg-gray-300 ${inputClassName} ${errors[`DCdocumentno${index}`]
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


                    <div className="flex space-x-2">
                      <div

                        onClick={() => handleView(
                          `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${document?.filePath}`
                        )}
                        className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                      >
                        <i className="fas fa-eye  flex items-center justify-center w-[25px] h-[25px]"></i>
                      </div>


                    </div>
                  </div>
                ))}



              </div>

            </div>
          )}

          {/* {step === 3 && (
          <div>
             {bank.map((document, index) => (
            <div className="">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
              <div className="col-span-2">
                  <label className={`${inputLabelClassName}`}>
                    Bank Holder Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`BADbankHoldername${index}`, {
                      required: "Bank Holder Name is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADbankHoldername${index}`]  ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Bank Holder Name"
                  />
                  {errors[`BADbankHoldername${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADbankHoldername${index}`].message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Bank Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`BADbankname${index}`, {
                      required: "Bank name is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADbankname${index}`]  ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Bank Name"
                  />
                  {errors[`BADbankname${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADbankname${index}`].message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Branch Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`BADbranchname${index}`, {
                      required: "Branch name is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADbranchname${index}`]
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Branch Name"
                  />
                  {errors[`BADbranchname${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADbranchname${index}`].message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Account Number<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register(`BADaccountnumber${index}`, {
                      required: "Account name is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADaccountnumber${index}`]
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Account Number"
                  />
                  {errors[`BADaccountnumber${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADaccountnumber${index}`].message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Ifsc Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`BADifsccode${index}`, {
                      required: "Ifsc code is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADifsccode${index}`]
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Ifsc code"
                  />
                  {errors[`BADifsccode${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADifsccode${index}`].message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Type of Account<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`BADtypeofaccount${index}`, {
                      required: "Type of Account is required",
                    })}
                      readOnly
                      disabled
                    className={`placeholder:  !bg-gray-300 ${inputClassName} ${
                      errors[`BADtypeofaccount${index}`]
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                    placeholder="Enter Type of Account"
                  />
                  {errors[`BADtypeofaccount${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADtypeofaccount${index}`].message}
                    </p>
                  )}
                </div>
               <div className="flex items-end gap-2">
               <div>
                  <label className={`${inputLabelClassName}`}>
                    Upload <span className="text-red-600">*</span>
                  </label>

                  <input
                    type="file"
                    className="hidden"
                    id={`BADdocumentUpload${index}`}
                    {...register(`BADdocumentUpload${index}`, {
                      required: "Document upload required",
                    })}
                  />
                  <br />
                  <label
                    htmlFor={`BADdocumentUpload${index}`}
                    className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded "
                  >
                    Upload
                  </label>
                  {errors[`BADdocumentUpload${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`BADdocumentUpload${index}`].message}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      onClick={() => handleBankView(index)}
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                    >
                      <i className="fas fa-eye  flex items-center justify-center w-[25px] h-[25px]"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBankEdit(index)}
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                    >
                      <i className="fas fa-edit flex items-center justify-center w-[25px] h-[25px]"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBankDelete(index)}
                      className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                    >
                      <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                    </button>
                  </div>
               </div>
              </div>
            </div>
            ))}
             <div className="flex justify-between px-3 pb-2">
                <button
                  type="button"
                  onClick={handleBankAddMore}
                  className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
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
        )} */}

          {/* {step === 4 && (
          <div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Financial Details Name{" "}
                    <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("FDfinancialdetail")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.FDfinancialdetail
                        ? "border-[1px] "
                        : "border-gray-300"
                    }`}
                  >
                    <option className="text-xs" value="">
                      Select Financial Details
                    </option>
                    <option value="mother">Mother</option>
                    <option value="father">Father</option>
                    <option value="brother">Brother</option>
                    <option value="sister">Sister</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.FDfinancialdetail && (
                    <p className="text-red-500 text-sm">
                      {errors.FDfinancialdetail.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Year <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("FDyear")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.FDyear ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter Year"
                  />
                  {errors.FDyear && (
                    <p className="text-red-500 text-sm">
                      {errors.FDyear.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Upload <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="file"
                    {...register("FDFile")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.FDFile ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter File"
                  />
                  {errors.FDFile && (
                    <p className="text-red-500 text-sm">
                      {errors.FDFile.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between px-3 pb-2">
              <button type="Submit" className={`${formButtonClassName}`}>
                Submit
              </button>
            </div>
          </div>
        )} */}
          {/* {step === 5 && (
          <div>
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
               
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Instagram Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMInstagram")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.SMInstagram
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

  
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Twitter Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMTwitter")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.SMTwitter ? "border-[1px] " : "border-gray-300"
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
        
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Facebook Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMFacebook")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.SMFacebook ? "border-[1px] " : "border-gray-300"
                    }`}
                    placeholder="Enter Facebook Link"
                  />
                  {errors.SMFacebook && (
                    <p className="text-red-500 text-sm">
                      {errors.SMFacebook.message}
                    </p>
                  )}
                </div>

              
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Website Link <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="url"
                    {...register("SMWebsite")}
                    readOnly
                    disabled
                    className={`  !bg-gray-300 ${inputClassName} ${
                      errors.SMWebsite ? "border-[1px] " : "border-gray-300"
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
          </div>
        )} */}
        </form>
      </div>
    </GlobalLayout>
  );
};

export default ApplicationDetails;
