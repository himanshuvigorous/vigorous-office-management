import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
  organizationTypes,
  usertypelist,
  domainName,
  inputerrorClassNameAutoComplete,
  getLocationDataByPincode,
} from "../../../constents/global.js";
import {
  FaCamera,
  FaIndustry,
  FaLinkedin,
  FaPhoneAlt,
  FaRegAddressCard,
  FaRegBuilding,
  FaRegCalendarAlt,
  FaRegFileImage,
  FaServicestack,
  FaUserAlt,
} from "react-icons/fa";
import {
  AiFillDelete,
  AiFillInstagram,
  AiOutlineMail,
  AiOutlineTags,
  AiOutlineUnorderedList,
  AiOutlineUser,
  AiTwotoneEdit,
} from "react-icons/ai";
import {
  IoIosDocument,
  IoIosWatch,
  IoLogoFacebook,
  IoMdCheckmarkCircle,
} from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaPeopleGroup, FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import {
  getCompanyDetails,
  updateCompany,
} from "./companyFeatures/_company_reducers";
import { useNavigate, useParams } from "react-router-dom";

import {
  getPlanListFunc,
  planSearch,
} from "../../global/other/Plan/PlanFeatures/_plan_reducers";
import {
  countrySearch,
  getCountryListFunc,
} from "../../global/address/country/CountryFeatures/_country_reducers";
import {
  getStateList,
  stateSearch,
} from "../../global/address/state/featureStates/_state_reducers";
import {
  citySearch,
  getCityList,
} from "../../global/address/city/CityFeatures/_city_reducers";
import { decrypt } from "../../../config/Encryption.js";
import { indusSearch } from "../../global/other/Industry/IndustryFeature/_industry_reducers.js";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers.js";
import Loader from "../../../global_layouts/Loader/Loader.js";
import {
  getBankDocumentList,
  getDocumentList,
  updateDocument,
  updateBankDocument,
  createDocument,
  fileUploadFunc,
  deleteDocument,
} from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers.js";
import { AutoComplete, Input } from "antd";
import moment from "moment";
import { elements } from "chart.js";
import { BiMessageRoundedDots } from "react-icons/bi";
import getUserIds from "../../../constents/getUserIds.js";

const ViewCompanyDetail = () => {
  const { companyIdEnc } = useParams();
  const companyId = decrypt(companyIdEnc);

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newStep, setnewStep] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
  // const [documents, setDocuments] = useState([{ id: Date.now() }]);
  const [banks, setBanks] = useState([]);
  const [documents, setDocuments] = useState([

  ]);
  const [financialInfo, setFinancialInfo] = useState([
    {
      id: 1,
      name: "",
      year: "",
      file: [],
    },
  ]);
  const [formErrors, setFormErrors] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  const [isHovering, setIsHovering] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [localCountryList, setLocalCountryList] = useState();

  const { planListData } = useSelector((state) => state.plan);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { industryListData } = useSelector((state) => state.industry);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { orgTypeList } = useSelector((state) => state.orgType);
  const [fileName, setFileName] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const { companyDetailsData } = useSelector((state) => state.company);
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
   const userInfoglobal = JSON.parse(
      localStorage.getItem(`user_info_${domainName}`)
    );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    control,
    setError,
    clearErrors,
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
    name: "PDCountry",
    defaultValue: "",
  });
  const PrintSecondaryState = useWatch({
    control,
    name: "PDSecondaryState",
    defaultValue: "",
  });
  const PrintSecondaryCountry = useWatch({
    control,
    name: "PDSecondaryCountry",
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
    name: "PDMobileCode",
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
  const printLinkedin = useWatch({
    control,
    name: "SMLinkedIn",
    defaultValue: "",
  });

  useEffect(() => {
    if (
      PrintPincode &&
      PrintPincode.length >=4 &&
      PrintPincode.length <= 6 &&
      /^\d{6}$/.test(PrintPincode)
    ) {
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reqData = {
        _id: companyId,
      };
      await dispatch(
        countrySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
      await dispatch(getCompanyDetails(reqData)).then((data) => {
        setPageLoading(false);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (companyDetailsData?.data) {
      const documentData = companyDetailsData?.data?.documentData?.length
        ? companyDetailsData.data.documentData.map((document) => ({
          _id: document?._id || "",
          documentType: document?.name || "",
          documentNo: document?.number || "",
          file: document?.filePath || [],
        }))
        : ""

      setDocuments([...documentData]);

      const bankData = companyDetailsData?.data?.bankData?.length
        ? companyDetailsData.data.bankData.map((bank) => ({
          _id: bank?._id || "",
          accountType: bank?.accountType || "",
          bankName: bank?.bankName || "",
          branchName: bank?.branchName || "",
          bankholderName: bank?.bankholderName || "",
          accountNumber: bank?.accountNumber || "",
          ifscCode: bank?.ifscCode || "",
          file: bank?.filePath || [],
        }))
        : ""

      setBanks([...bankData]);

      const financialInfo = companyDetailsData?.data?.financialInfo?.length
        ? companyDetailsData.data.financialInfo.map((element) => ({
          _id: element?._id || "",
          name: element?.name || "",
          year: element?.year || "",
          file: element?.filePath || [],
        }))
        : ""

      setFinancialInfo([...financialInfo]);

      setProfileImage(
        `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${companyDetailsData?.data?.profileImage }`
      );

      
      // Main company details
      setValue("PDCompanyName", companyDetailsData?.data?.fullName);
      setValue("PDTagline", companyDetailsData?.data?.companyProfile?.tagline);
      setValue("PDStatus", companyDetailsData?.data?.status);

      setValue("PDPlan", companyDetailsData?.data?.planId);
      setValue(
        "PDOrganizationType",
        companyDetailsData?.data?.companyProfile?.companyType
      );
      setValue(
        "PDIndustryType",
        companyDetailsData?.data?.companyProfile?.industryType
      );

      // Address details
      setValue("PDCity", companyDetailsData?.data?.addresses?.primary?.city);
      setValue(
        "PDAddress",
        companyDetailsData?.data?.addresses?.primary?.street
      );
      setValue(
        "PDCountry",
        companyDetailsData?.data?.addresses?.primary?.country
      );
      setValue("PDState", companyDetailsData?.data?.addresses?.primary?.state);
      setValue(
        "PDPinCode",
        companyDetailsData?.data?.addresses?.primary?.pinCode
      );

      // Secondary address
      setValue(
        "PDSecondaryAddress",
        companyDetailsData?.data?.addresses?.secondary?.street
      );
      setValue(
        "PDSecondaryCountry",
        companyDetailsData?.data?.addresses?.secondary?.country
      );
      setValue(
        "PDSecondaryState",
        companyDetailsData?.data?.addresses?.secondary?.state
      );
      setValue(
        "PDSecondaryCity",
        companyDetailsData?.data?.addresses?.secondary?.city
      );
      setValue(
        "PDSecondaryPinCode",
        companyDetailsData?.data?.addresses?.secondary?.pinCode
      );

      setValue("PDEmail", companyDetailsData?.data?.email);
      setValue("PDMobileCode", companyDetailsData?.data?.mobile?.code);
      setValue("PDMobileNo", companyDetailsData?.data?.mobile?.number);

      setValue("PDAadharNumber", companyDetailsData?.data?.aadharNumber);
      setValue("PDGstNuumber", companyDetailsData?.data?.gstNumber);
      setValue("PDPanNumber", companyDetailsData?.data?.panNumber);
      setValue("PDfrn", companyDetailsData?.data?.frn);
      setValue("PDTanNumber", companyDetailsData?.data?.tanNumber);

      if (companyDetailsData?.data?.socialLinks?.length > 0) {
        setValue(
          "SMInstagram",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Instagram"
          )?.link
        );
        setValue(
          "SMTwitter",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Twitter"
          )?.link
        );
        setValue(
          "SMFacebook",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Facebook"
          )?.link
        );
        setValue(
          "SMWebsite",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Website"
          )?.link
        );
        setValue(
          "SMLinkedIn",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "linkedin"
          )?.link
        );
      }
    }
  }, [companyDetailsData]);

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };
  const handleBankAddMore = () => {
    setBanks([...banks, { id: Date.now() }]);
  };

  const handleProfileFileChange = (event) => {
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

  const handleToggle = (e) => {
    setIsSameAsPermanent((prev) => !prev);
    if (!isSameAsPermanent) {
      setValue("PDSecondaryAddress", getValues("PDAddress"));
      setValue("PDSecondaryCity", getValues("PDCity"));
      setValue("PDSecondaryState", getValues("PDState"));
      setValue("PDSecondaryCountry", getValues("PDCountry"));
      setValue("PDSecondaryPinCode", getValues("PDPinCode"));
    } else {
      setValue("PDSecondaryAddress", "");
      setValue("PDSecondaryCity", "");
      setValue("PDSecondaryState", "");
      setValue("PDSecondaryCountry", "");
      setValue("PDSecondaryPinCode", "");
    }
  };

  const navTabClick = async (clickedStep) => {
    setStep((step) => clickedStep);
  };

  useEffect(() => {
    if (
      (!employeeDocumentList || employeeDocumentList.length === 0) &&
      (step === 2 || step === 4)
    ) {
      dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
    }
  }, [dispatch, step]);

  const handleInputChangeBank = (index, field, value) => {
    const updatedBanks = [...banks];
    const newFormErrors = [...formErrors];

    if (field === "ifscCode") {
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;

      if (!ifscPattern.test(value)) {
        if (!newFormErrors[index]) newFormErrors[index] = {};
        newFormErrors[index][field] = "Invalid IFSC code. Example: SBIN0001234";
      } else {
        if (newFormErrors[index]?.[field]) {
          delete newFormErrors[index][field];
        }
      }
    }

    if (field === "accountNumber") {
      const accountPattern = /^\d{6,18}$/;

      if (!accountPattern.test(value)) {
        if (!newFormErrors[index]) newFormErrors[index] = {};
        newFormErrors[index][field] =
          "Invalid account number. Must be 6 to 18 digits.";
      } else {
        if (newFormErrors[index]?.[field]) {
          delete newFormErrors[index][field];
        }
      }
    }

    updatedBanks[index][field] = value;
    setBanks(updatedBanks);
    setFormErrors(newFormErrors);
  };

  const handleBankFileChange = (index, file) => {
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        const updatedBanks = [...banks];
        updatedBanks[index].file = [data?.payload?.data];
        setDocuments(updatedBanks);
        const newFormErrors = [...formErrors];
        if (newFormErrors[index]?.file) {
          delete newFormErrors[index].file;
        }
        setFormErrors(newFormErrors);
      }
    });
  };

  const handleBankDelete = (bank, index) => {
    if (bank?._id) {
      dispatch(deleteDocument({ _id: bank?._id })).then((data) => {
        if (!data.error) {
          setBanks((prevBanks) =>
            prevBanks.filter((_, index2) => index2 !== index)
          );
        }
      });
    } else {
      setBanks((prevBanks) =>
        prevBanks.filter((_, index2) => index2 !== index)
      );
    }
  };

  const validateBankForm = () => {
    let errors = [];
    banks.forEach((bank, index) => {
      let error = {};
      if (!bank.accountType) {
        error.accountType = "Account Type is required.";
      }
      if (!bank.bankholderName) {
        error.bankholderName = "Account Holder name is required.";
      }
      if (!bank.accountNumber) {
        error.accountNumber = "Account No is required.";
      }
      if (!bank.bankName) {
        error.bankName = "Bank Name is required.";
      }
      if (!bank.branchName) {
        error.branchName = "Branch Name is required.";
      }
      if (!bank.ifscCode) {
        error.ifscCode = "Ifsc code is required.";
      }
      if (!bank.file || bank.file.length === 0) {
        error.file = "Bank file is required.";
      }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const handleInputChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
    const newFormErrors = [...formErrors];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setFormErrors(newFormErrors);
  };

  const handleFileChange = (index, file) => {
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        const updatedDocuments = [...documents];
        updatedDocuments[index].file = [data?.payload?.data];
        setDocuments(updatedDocuments);
        const newFormErrors = [...formErrors];
        if (newFormErrors[index]?.file) {
          delete newFormErrors[index].file;
        }
        setFormErrors(newFormErrors);
      }
    });
  };

  const handleDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteDocument({ _id: document?._id })).then((data) => {
        if (!data.error) {
          setDocuments((prevDocuments) =>
            prevDocuments.filter((_, index2) => index2 !== index)
          );
        }
      });
    } else {
      setDocuments((prevDocuments) =>
        prevDocuments.filter((_, index2) => index2 !== index)
      );
    }
  };

  const validateForm = () => {
    let errors = [];
    documents.forEach((document, index) => {
      let error = {};
      if (!document.documentType) {
        error.documentType = "Document Type is required.";
      }
      if (!document.documentNo) {
        error.documentNo = "Document No is required.";
      }
      if (!document.file || document.file.length === 0) {
        error.file = "Document file is required.";
      }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0); // returns true if no errors
  };

  const handleInputFDChange = (index, field, value) => {
    const updatedFinancialInfo = [...financialInfo];
    updatedFinancialInfo[index][field] = value;
    setFinancialInfo(updatedFinancialInfo);
    const newFormErrors = [...formErrors];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setFormErrors(newFormErrors);
  };

  const handleFileFDChange = (index, file) => {
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        const updatedFinancialInfo = [...financialInfo];
        updatedFinancialInfo[index].file = [data?.payload?.data];
        setFinancialInfo(updatedFinancialInfo);
        const newFormErrors = [...formErrors];
        if (newFormErrors[index]?.file) {
          delete newFormErrors[index].file;
        }
        setFormErrors(newFormErrors);
      }
    });
  };

  const handleFDDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteDocument({ _id: document?._id })).then((data) => {
        if (!data.error) {
          setFinancialInfo((prevDocuments) =>
            prevDocuments.filter((_, index2) => index2 !== index)
          );
          dispatch(
            getCompanyDetails({
              _id: companyId,
            })
          );
        }
      });
    } else {
      setFinancialInfo((prevDocuments) =>
        prevDocuments.filter((_, index2) => index2 !== index)
      );
    }
  };

  const validateFDForm = () => {
    let errors = [];
    financialInfo.forEach((element, index) => {
      let error = {};
      if (!element.name) {
        error.name = "Name is required.";
      }
      if (!element.year) {
        error.year = "Year is required.";
      }
      if (!element.file || element.file.length === 0) {
        error.file = "Document file is required.";
      }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });
  

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0); // returns true if no errors
  };

  const handleFDAddMore = () => {
    setFinancialInfo([...financialInfo, { id: Date.now() }]);
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
      dispatch(
        stateSearch({
          isPagination: false,
          text: companyDetailsData.data?.addresses?.primary?.country,
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
      dispatch(
        citySearch({
          isPagination: false,
          text: companyDetailsData.data?.addresses?.primary?.state,
          sort: true,
          status: true,
        })
      );
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
      dispatch(
        orgTypeSearch({
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
      dispatch(
        planSearch({
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
      {!pageLoading ? (
        <div className="grid grid-cols-12 gap-2">
          <div className=" md:col-span-3 col-span-12 w-full h-auto rounded-lg  ">
            <div className="shadow bg-white rounded-xl py-2">
              <div
                className="relative w-[50px] h-[50px] mx-auto rounded-full border-2 border-slate-600 mt-3 flex items-center justify-center"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <div
                  className="w-full h-full rounded-full overflow-hidden  flex items-center justify-center"
                  style={{
                    backgroundImage: companyDetailsData?.data?.profileImage
                      ? `url(${profileImage})` 
                      : `url(/images/images/userplaceholder.jpg)`,
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

                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                /> */}
              </div>
              <div className="text-base font-medium overflow-auto mx-2 text-center mt-2 text-header ">
                {PrintCompanyName ? PrintCompanyName : "Organization Name"}
              </div>
              <div className="text-xs font-normal text-center text-gray-600 ">
                {PrintTagLine ? PrintTagLine : "Tag Line"}
              </div>
              <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>Address</label>
                  <div
                    className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                  >
                    {PrintAddress && <>{PrintAddress}, </>}
                    {PrintCity && <>{PrintCity}, </>}
                    {PrintState && <>{PrintState}, </>}
                    {PrintCountry && <>{PrintCountry}, </>}
                    {PrintPincode && <>{PrintPincode}</>}
                  </div>
                </div>

                <div className="">
                  <label className={`${inputLabelClassName}`}>Mail</label>
                  <div
                    className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
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
                      className={`mt-1 block overflow-auto text-center   py-[9px] shadow-sm rounded-lg text-xs capitalize bg-[#f4f6f9] focus:outline-none cursor-default min-h-8 min-w-8`}
                    >
                      {PrintMobileCode}
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
                <FaLinkedin
                  onClick={() => {
                    if (printLinkedin) {
                      window.open(printLinkedin, "_blank");
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <form
            //onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 md:col-span-9 col-span-12"
          >
            <div
              className={`flex justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap`}
              style={{
                backgroundColor: companyDetailsData?.data?.planData?.colorCode || '#074173',
              }}
            >              <button
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

             {userInfoglobal?.userType !=='admin' && <button
                type="button"
                onClick={() => navTabClick(2)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 2 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 2 &&  (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Owner Details</span>
              </button>}

             { userInfoglobal?.userType !=='admin' && <button
                type="button"
                onClick={() => navTabClick(3)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 3? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 3 &&  (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Documents</span>
              </button>}
              {userInfoglobal?.userType !=='admin' &&<button
                type="button"
                onClick={() => navTabClick(4)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 4 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 4 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Bank Details</span>
              </button>}
             {userInfoglobal?.userType !=='admin' && <button
                type="button"
                onClick={() => navTabClick(5)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 5 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 5 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Financial Details</span>
              </button>}

            {userInfoglobal?.userType !=='admin' &&  <button
                type="button"
                onClick={() => navTabClick(6)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 6 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 6 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Experience</span>
              </button>}
              {/* <button
                type="button"
                onClick={() => navTabClick(7)}
                className={`flex flex-col items-center relative pb-2 ${
                  step === 7 ? "text-white ]" : "text-gray-400"
                } cursor-pointer`}
              >
                {step === 7  && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Social Media</span>
              </button> */}
            </div>


            {step === 1 && (
              <div className="w-full  ">
                <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                  <thead>
                    <tr>
                      <th className="text-header ">
                        <div className="mt-2 ml-2">Personal Information</div>
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
                            Company Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {companyDetailsData?.data?.fullName || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Tag Line
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {companyDetailsData?.data?.companyProfile?.tagline ||
                            "N/A"}
                        </span>
                      </td>
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
                          {companyDetailsData?.data?.companyProfile
                            ?.companyType || "N/A"}
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
                          {companyDetailsData?.data?.companyProfile
                            ?.industryType || "N/A"}
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
                          {companyDetailsData?.data?.addresses?.primary?.city ||
                            "N/A"}
                          ,{" "}
                          {companyDetailsData?.data?.addresses?.primary
                            ?.state || "N/A"}
                          ,
                          {companyDetailsData?.data?.addresses?.primary
                            ?.country || "N/A"}
                          ,{" "}
                          {companyDetailsData?.data?.addresses?.primary
                            ?.pinCode || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {companyDetailsData?.data?.email || "N/A"}
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
                          {companyDetailsData?.data?.mobile?.code || "N/A"}{" "}
                          {companyDetailsData?.data?.mobile?.number || "N/A"}
                        </span>
                      </td>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaServicestack className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Plan
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {companyDetailsData?.data?.planData?.title || "N/A"}{" "}

                        </span>
                      </td>
                    </tr>
                    <tr className=" hover:bg-indigo-50">
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosWatch className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Plan Start Date
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {companyDetailsData?.data?.planData?.startDate ? moment(companyDetailsData?.data?.planData?.startDate).format("YYYY-MM-DD") : "N/A"}{" "}
                        </span>
                      </td>
                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <IoIosWatch className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            {" "}
                            Plan End Date
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">

                          {companyDetailsData?.data?.planData?.endDate ? moment(companyDetailsData?.data?.planData?.endDate).format("YYYY-MM-DD") : "N/A"}{" "}

                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

{step === 2 && (
              companyDetailsData?.data?.comapnyOwnerData?.length > 0 ?
                <div>
                  <div className="rounded-md">
                    {companyDetailsData?.data?.comapnyOwnerData?.map((element, index) => (
                      <div
                        className="border border-gray-300 rounded-md my-2"
                        key={index}
                      >
                        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                          <thead>
                            <tr>
                              <th className="text-header ">
                                <div className="mt-2 mb-1 ml-2">
                                 Owner Details {index + 1}
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
                                  Full Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.fullName}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegCalendarAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  email
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.email}
                                </span>
                              </td>
                            </tr>


                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <IoIosDocument className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  Mobile
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.mobile?.code || 0} {" "}{element?.mobile?.number || 0}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegCalendarAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  Address 
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.addresses?.primary?.street || "N/A" } , {element?.addresses?.primary?.city || "N/A"} , {element?.addresses?.primary?.state || 'N/A' } , {element?.addresses?.primary?.country || 'N/A'} , {element?.addresses?.primary?.pinCode || 'N/A'}
                                </span>
                              </td>
                            </tr>


                            {/* <tr className=" hover:bg-indigo-50">
                              <td className="p-3 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegFileImage className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Uploaded Document
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.attachment?.length > 0
                                    ? element?.attachment?.map((file, index) => (
                                      <img
                                        key={index}
                                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-14 h-14 shadow rounded-sm"
                                      />
                                    ))
                                    : null}
                                </span>
                              </td>
                            </tr> */}

                            {/* Upload document */}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div> : <div className="text-header w-full text-center "> No Data Found</div>
            )}


            {step === 3 && (
              documents.length > 0 ?
                <div>
                  <div className="rounded-md">
                    {documents?.map((document, index) => (
                      <div
                        className="border border-gray-300 rounded-md my-2"
                        key={index}
                      >
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
                                  {document.documentType}
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
                                  {document.documentNo || "N/A"}
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
                                  {document?.file?.length > 0
                                    ? document.file.map((file, index) => (
                                      <img
                                        key={index}
                                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-14 h-14 shadow rounded-sm"
                                      />
                                    ))
                                    : null}
                                </span>
                              </td>
                            </tr>

                            {/* Upload document */}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div>
                : <div className="text-header w-full text-center "> No Data Found</div>
            )}

            {step === 4 && (

              banks.length > 0 ?
                <div>
                  <div className="rounded-md">
                    {banks.map((bank, index) => (
                      <div
                        className="border border-gray-300 rounded-md my-2"
                        key={index}
                      >
                        <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                          <thead>
                            <tr>
                              <th className="text-header ">
                                <div className="mt-2 mb-1 ml-2">
                                  Bank Document {index + 1}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-sm text-gray-700">
                            {/* Company Name Row */}
                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <AiOutlineUser className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Bank Holder Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.bankholderName || "NA"}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegBuilding className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Bank Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.bankName}
                                </span>
                              </td>
                            </tr>

                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaPeopleGroup className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Branch Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.branchName}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <AiTwotoneEdit className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Account Number
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.accountNumber}
                                </span>
                              </td>
                            </tr>

                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegAddressCard className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    IFSC Code
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.ifscCode}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <AiOutlineUnorderedList className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Account Type
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {bank.accountType}
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
                                  {bank?.file?.length > 0
                                    ? bank.file.map((file, index) => (
                                      <img
                                        key={index}
                                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-14 h-14 shadow rounded-sm"
                                      />
                                    ))
                                    : null}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div> : <div className="text-header w-full text-center "> No Data Found</div>
            )}

            {step === 5 && (
              financialInfo?.length > 0 ?
                <div>
                  <div className="rounded-md">
                    {financialInfo?.map((element, index) => (
                      <div
                        className="border border-gray-300 rounded-md my-2"
                        key={index}
                      >
                        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                          <thead>
                            <tr>
                              <th className="text-header ">
                                <div className="mt-2 mb-1 ml-2">
                                  Financial Document {index + 1}
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
                                  {element.name}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegCalendarAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                    Year
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element.year}
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
                                  {element?.file?.length > 0
                                    ? element.file.map((file, index) => (
                                      <img
                                        key={index}
                                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-14 h-14 shadow rounded-sm"
                                      />
                                    ))
                                    : null}
                                </span>
                              </td>
                            </tr>

                            {/* Upload document */}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div> : <div className="text-header w-full text-center "> No Data Found</div>
            )}


{step === 6 && (
              companyDetailsData?.data?.companyExperiencesData?.length > 0 ?
                <div>
                  <div className="rounded-md">
                    {companyDetailsData?.data?.companyExperiencesData?.map((element, index) => (
                      <div
                        className="border border-gray-300 rounded-md my-2"
                        key={index}
                      >
                        <table className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white">
                          <thead>
                            <tr>
                              <th className="text-header ">
                                <div className="mt-2 mb-1 ml-2">
                                  Experiance Data  {index + 1}
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
                                  IndustryType Type
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.industryType}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegCalendarAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  Organization Name
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.organizationName}
                                </span>
                              </td>
                            </tr>


                            <tr className=" hover:bg-indigo-50">
                              <td className="p-3 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <IoIosDocument className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  Start Year
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.startYear}
                                </span>
                              </td>

                              <td className="p-3  text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FaRegCalendarAlt className="size-4 text-header text-lg" />
                                  <span className="text-[16px] font-medium">
                                  End Year 
                                  </span>
                                </div>
                                <span className="block text-[15px] ml-4 font-light mt-1">
                                  {element?.endYear}
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
                                  {element?.attachment?.length > 0
                                    ? element?.attachment?.map((file, index) => (
                                      <img
                                        key={index}
                                        src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                        alt={`Uploaded ${index + 1}`}
                                        className="w-14 h-14 shadow rounded-sm"
                                      />
                                    ))
                                    : null}
                                </span>
                              </td>
                            </tr>

                            {/* Upload document */}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                </div> : <div className="text-header w-full text-center "> No Data Found</div>
            )}


{step === 7 && (
              <div  className="w-full  ">
              <table className="w-full  rounded-lg shadow-md overflow-hidden bg-white">
                <thead>
                  <tr>
                    <th className="text-header ">
                      <div className="mt-2 ml-2">Social Media</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {/* Company Name Row */}
                  {
                    companyDetailsData?.data?.socialLinks?.map((elements,index)=>{
                      return (
                        <tr className=" hover:bg-indigo-50">
            
                    <td className="p-3 text-gray-600">
                    <div className="grid grid-cols-2">
                      <div className="flex items-center gap-2">
                        <BiMessageRoundedDots  className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          {elements.name}
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {elements.link || "N/A"}
                      </span>
                      </div>
                    </td>
           

                   
                  </tr>
                      )
                    })
                    
                  }
{/* 
                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaPeopleGroup className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          Organization Type
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {companyDetailsData?.data?.companyProfile
                          ?.companyType || "N/A"}
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
                        {companyDetailsData?.data?.companyProfile
                          ?.industryType || "N/A"}
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
                        {companyDetailsData?.data?.addresses?.primary?.city ||
                          "N/A"}
                        ,{" "}
                        {companyDetailsData?.data?.addresses?.primary
                          ?.state || "N/A"}
                        ,
                        {companyDetailsData?.data?.addresses?.primary
                          ?.country || "N/A"}
                        ,{" "}
                        {companyDetailsData?.data?.addresses?.primary
                          ?.pinCode || "N/A"}
                      </span>
                    </td>

                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <AiOutlineMail className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">Email</span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {companyDetailsData?.data?.email || "N/A"}
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
                        {companyDetailsData?.data?.mobile?.code || "N/A"}{" "}
                        {companyDetailsData?.data?.mobile?.number || "N/A"}
                      </span>
                    </td>
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaServicestack className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          {" "}
                          Plan
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {companyDetailsData?.data?.planData?.title || "N/A"}{" "}

                      </span>
                    </td>
                  </tr>
                  <tr className=" hover:bg-indigo-50">
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoIosWatch className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          {" "}
                          Plan Start Date
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">
                        {companyDetailsData?.data?.planData?.startDate ? moment(companyDetailsData?.data?.planData?.startDate).format("YYYY-MM-DD") : "N/A"}{" "}
                      </span>
                    </td>
                    <td className="p-3  text-gray-600">
                      <div className="flex items-center gap-2">
                        <IoIosWatch className="size-4 text-header text-lg" />
                        <span className="text-[16px] font-medium">
                          {" "}
                          Plan End Date
                        </span>
                      </div>
                      <span className="block text-[15px] ml-4 font-light mt-1">

                        {companyDetailsData?.data?.planData?.endDate ? moment(companyDetailsData?.data?.planData?.endDate).format("YYYY-MM-DD") : "N/A"}{" "}

                      </span>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
            )}


          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
};

export default ViewCompanyDetail;
