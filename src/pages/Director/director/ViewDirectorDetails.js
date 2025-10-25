import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  formButtonClassName,
  inputClassName,
  domainName,
  inputLabelClassName,
  inputerrorClassNameAutoComplete,
  inputDisabledClassName,
  getLocationDataByPincode,
} from "../../../constents/global.js";
import getUserIds from "../../../constents/getUserIds";
import {
  FaCamera,
  FaPhoneAlt,
  FaRegAddressCard,
  FaRegBuilding,
  FaRegFileImage,
  FaUserAlt,
} from "react-icons/fa";
import {
  AiFillDelete,
  AiFillInstagram,
  AiOutlineTags,
  AiTwotoneEdit,
} from "react-icons/ai";
import { IoIosDocument, IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager.js";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption.js";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import {
  empDoctSearch,
  getEmployeeDocument,
} from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import Loader from "../../../global_layouts/Loader/Loader.js";
import {
  getDirectorDetails,
  updateDirector,
} from "./DirectorFeatures/_director_reducers.js";
import {
  updateDocument,
  fileUploadFunc,
  deleteDocument,
} from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers.js";
import { AutoComplete, Input } from "antd";
import { IoPersonOutline } from "react-icons/io5";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";

const ViewDirectorDetails = () => {
  const { directorIdEnc } = useParams();
  const directorId = decrypt(directorIdEnc);
 

  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newStep, setnewStep] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);

  const [banks, setBanks] = useState([1]);
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
  const [fileName, setFileName] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [localCountryList, setLocalCountryList] = useState();

  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { companyList } = useSelector((state) => state.company);
  const { directorDetailsData } = useSelector((state) => state.director);
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType,
  } = getUserIds();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    setError,
    control,
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
  const PrintDirectorName = useWatch({
    control,
    name: "PDDirectorName",
    defaultValue: "",
  });
  const PrintTagLine = useWatch({
    control,
    name: "PDTagLine",
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
    name: "PDPassword",
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
  const designationId = useWatch({
    control,
    name: "PDDesignationId",
    defaultValue: userDesignationId,
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
    const fetchData = async () => {
      try {
        await dispatch(
          countrySearch({
            text: "",
            sort: true,
            status: true,
            isPagination: false,
          })
        );
        const reqData = {
          _id: directorId,
        };
        await dispatch(getDirectorDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (directorDetailsData?.data) {
      const documentData = directorDetailsData?.data?.documentData?.map(
        (document) => {
          return {
            _id: document?._id,
            documentType: document?.name,
            documentNo: document?.number,
            file: document?.filePath,
          };
        }
      );
      directorDetailsData?.data?.documentData?.length > 0 &&
        setDocuments([...documentData]);

      const financialInfo = directorDetailsData?.data?.financialInfo?.map(
        (element) => {
          return {
            _id: element?._id,
            name: element?.name,
            year: element?.year,
            file: element?.filePath,
          };
        }
      );
      directorDetailsData?.data?.financialInfo.length > 0 &&
        setFinancialInfo([...financialInfo]);
      setProfileImage(
        `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${directorDetailsData?.data?.profileImage}`
      );
      setProfileImagePayload(directorDetailsData?.data?.profileImage);
      // Main company details
      setValue("PDCompanyId", directorDetailsData?.data?.companyId);
      // setValue("PDDirectorName", directorDetailsData?.data?.fullName);
      setValue("PDDirectorName", directorDetailsData?.data?.fullName);
      setValue(
        "PDTagLine",
        directorDetailsData?.data?.directorProfile?.tagline
      );
      setValue("PDPassword", "******");
      setValue("PDConfirmPassword", "******");
      setValue("PDPlan", directorDetailsData?.data?.planId);
      setValue(
        "PDorganizationtype",
        directorDetailsData?.data?.directorProfile?.companyType
      );
      setValue(
        "PDindustrytype",
        directorDetailsData?.data?.directorProfile?.industryType
      );

      // Address details
      setValue(
        "PDAddress",
        directorDetailsData?.data?.addresses?.primary?.street
      );
      setValue(
        "PDCountry",
        directorDetailsData?.data?.addresses?.primary?.country
      );
      setValue("PDState", directorDetailsData?.data?.addresses?.primary?.state);
      setValue("PDCity", directorDetailsData?.data?.addresses?.primary?.city);
      setValue(
        "PDPinCode",
        directorDetailsData?.data?.addresses?.primary?.pinCode
      );

      // Secondary address
      setValue(
        "PDSecondaryAddress",
        directorDetailsData?.data?.addresses?.secondary?.street
      );
      setValue(
        "PDSecondaryCountry",
        directorDetailsData?.data?.addresses?.secondary?.country
      );
      setValue(
        "PDSecondaryState",
        directorDetailsData?.data?.addresses?.secondary?.state
      );
      setValue(
        "PDSecondaryCity",
        directorDetailsData?.data?.addresses?.secondary?.city
      );
      setValue(
        "PDSecondaryPinCode",
        directorDetailsData?.data?.addresses?.secondary?.pinCode
      );

      // setValue("PDStatus", directorDetailsData?.data?.status);
      // Contact details
      setValue("PDEmail", directorDetailsData?.data?.email);
      setValue("PDMobileCode", directorDetailsData?.data?.mobile?.code);
      setValue("PDMobileNo", directorDetailsData?.data?.mobile?.number);

      // Identification details
      setValue("PDaadharNumber", directorDetailsData?.data?.aadharNumber);
      setValue("PDgstnumber", directorDetailsData?.data?.gstNumber);
      setValue("PDpannumber", directorDetailsData?.data?.panNumber);
      setValue("PDfrn", directorDetailsData?.data?.frn);
      setValue("PDtannumber", directorDetailsData?.data?.tanNumber);

      // Social media links (if available)
      if (directorDetailsData?.data?.socialLinks?.length > 0) {
        setValue(
          "SMInstagram",
          directorDetailsData?.data?.socialLinks[0]?.link
        );
        setValue("SMTwitter", directorDetailsData?.data?.socialLinks[1]?.link);
        setValue("SMFacebook", directorDetailsData?.data?.socialLinks[2]?.link);
        setValue("SMWebsite", directorDetailsData?.data?.socialLinks[3]?.link);
      }
    }
  }, [directorDetailsData]);

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

  const handleDocsFileChange = (name, e, path) => {
    const file = e.target.files[0];
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((res) => {
      setValue(path, res?.payload?.data);
    });
    clearErrors(path);
    clearErrors(path);
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

  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: directorId,
        companyId: companyId,
        firstName: "",
        lastName: "",
        profileImage: profileImagePayload ?? "",
        fullName: data?.PDDirectorName ?? "",
        email: data?.PDEmail ?? "",
        userType: "companyDirector",
        // password: data?.PDPassword,
        planId: data?.PDPlan ?? null,
        status: directorDetailsData?.data?.status ?? true,
        mobile: {
          number: data?.PDMobileNo ?? "",
          code: data?.PDMobileCode ?? "",
        },
        directorProfile: {
          tagline: data?.PDTagline ?? "",
          companyType: data?.PDOrganizationType ?? "",
          industryType: data?.PDIndustryType ?? "",
          secondaryEmail: data?.PDEmail ?? "",
          secondaryMobile: {
            number: data?.PDMobileNo ?? "",
            code: data?.PDMobileCode ?? "",
          },
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
            pinCode: data?.PDSecondaryPinCode ?? "",
          },
        },
      };
      dispatch(updateDirector(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getDirectorDetails({
              _id: directorId,
            })
          );
          newStep && setStep(newStep);
          setnewStep(null);
        }
      });
    }

    if (step === 2) {
      if (validateForm()) {
        const documentPayload = documents.map((doc, index) => {
          if (doc?._id) {
            return {
              userId: directorId,
              _id: doc?._id,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          } else {
            return {
              userId: directorId,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          }
        });

        const finalPayload = {
          documents: documentPayload,
          type: "documents",
        };
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getDirectorDetails({
                _id: directorId,
              })
            );
            newStep && setStep(newStep);
            setnewStep(null);
          }
        });
      }
    }

    if (step === 3) {
      if (validateFDForm()) {
        const financialInfoPayload = financialInfo.map((element, index) => {
          if (element?._id) {
            return {
              userId: directorId,
              _id: element?._id,
              name: element?.name,
              year: element?.year,
              filePath: element?.file,
            };
          } else {
            return {
              userId: directorId,
              name: element?.name,
              year: element?.year,
              filePath: element?.file,
            };
          }
        });

        const finalPayload = {
          financialInfo: financialInfoPayload,
          type: "financial",
        };
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getDirectorDetails({
                _id: directorId,
              })
            );
            newStep && setStep(newStep);
            setnewStep(null);
          }
        });
      }
    }

    if (step === 4) {
      const finalPayload = {
        _id: directorId,
        firstName: "",
        lastName: "",
        profileImage: profileImagePayload ?? "",
        fullName: data?.PDDirectorName ?? "",
        email: data?.PDEmail ?? "",
        userType: "companyDirector",
        // password: data?.PDPassword,
        planId: data?.PDPlan ?? null,
        status: directorDetailsData?.data?.status,
        mobile: {
          number: data?.PDMobileNo ?? "",
          code: data?.PDMobileCode ?? "",
        },
        directorProfile: {
          tagline: data?.PDTagline ?? "",
          companyType: data?.PDOrganizationType ?? "",
          industryType: data?.PDIndustryType ?? "",
          secondaryEmail: data?.PDEmail ?? "",
          secondaryMobile: {
            number: data?.PDMobileNo ?? "",
            code: data?.PDMobileCode ?? "",
          },
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
            pinCode: data?.PDSecondaryPinCode ?? "",
          },
        },
        socialLinks: [
          {
            name: "Instagram",
            link: data?.SMInstagram ?? "",
          },
          {
            name: "Twitter",
            link: data?.SMTwitter ?? "",
          },
          {
            name: "Facebook",
            link: data?.SMFacebook ?? "",
          },
          {
            name: "Website",
            link: data?.SMWebsite ?? "",
          },
        ],
      };
      dispatch(updateDirector(finalPayload)).then((data) => {
        if (!data.error) {
          newStep && setStep(newStep);
          setnewStep(null);
        }
      });
    }
  };

  const navTabClick = async (clickedStep) => {
    setStep((step) => clickedStep);
  };

  useEffect(() => {
    if (
      (!employeeDocumentList || employeeDocumentList.length === 0) &&
      (step === 2 || step === 3)
    ) {
             dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
    }
  }, [dispatch, step]);

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
  const handleFdDelete = (document, index) => {
    if (document?._id) {
      dispatch(deleteDocument({ _id: document?._id })).then((data) => {
        if (!data.error) {
          setFinancialInfo((prevDocuments) =>
            prevDocuments.filter((_, index2) => index2 !== index)
          );
          dispatch(
            getDirectorDetails({
              _id: directorId,
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

  useEffect(() => {
    if (
      PrintCountry !== directorDetailsData?.data?.addresses?.primary?.country
    ) {
      setValue("PDState", "");
      setValue("PDCity", "");
    }
  }, [PrintCountry]);
  useEffect(() => {
    if (PrintState !== directorDetailsData?.data?.addresses?.primary?.state) {
      setValue("PDCity", "");
    }
  }, [PrintState]);
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

                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                /> */}
              </div>
              <div className="text-base font-medium overflow-auto mx-2 text-center mt-2 text-header capitalize">
                {PrintDirectorName ? PrintDirectorName : "Director Name"}
              </div>
              <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
                <div className="">
                  <label className={`${inputLabelClassName}`}>Address</label>
                  <div
                    className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                  >
                    {PrintAddress && <>{PrintAddress}, </>}
                    {PrintCity && <>{PrintCity} , </>}
                    {PrintState && <>{PrintState} , </>}
                    {PrintCountry && <>{PrintCountry} , </>}
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
                      className={`mt-1 block overflow-auto   py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8 min-w-6`}
                    >
                      {PrintMobileCode}
                    </div>
                    <div
                      className={`mt-1 block overflow-auto w-full px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
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
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 md:col-span-9 col-span-12"
          >
            <div className="flex bg-header justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
              <button
                type="button"
                onClick={() => navTabClick(1)}
                className={`flex relative flex-col items-center  pb-2 ${
                  step === 1 ? "text-white ]" : "text-gray-400"
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
                className={`flex flex-col items-center relative pb-2 ${
                  step === 2 ? "text-white ]" : "text-gray-400"
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
                className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-400"
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
                className={`flex flex-col items-center relative pb-2 ${step === 4 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 4 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Social Media</span>
              </button> */}
            </div>

            {step === 1 && (
              <div>
                <div className=" ">
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
                            <IoPersonOutline className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Director Name
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {directorDetailsData?.data?.fullName || "N/A"}
                          </span>
                        </td>

                        <td className="p-3  text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaRegBuilding className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Company Name
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {directorDetailsData?.data?.companyData?.fullName ||
                              "N/A"}
                          </span>
                        </td>
                      </tr>

                      {/* <tr className=" hover:bg-indigo-50">
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

                      <tr className=" hover:bg-indigo-50">
                        <td className="p-3  text-gray-600">
                          <div  className="flex items-center gap-2">
                            <FaRegAddressCard className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              Primary Address
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {directorDetailsData?.data?.addresses?.primary
                              ?.street || "N/A"}
                            ,{" "}
                            {
                              directorDetailsData?.data?.addresses?.primary
                                ?.city
                            }{" "}
                            ,
                            {
                              directorDetailsData?.data?.addresses?.primary
                                ?.state
                            }{" "}
                            ,
                            {
                              directorDetailsData?.data?.addresses?.primary
                                ?.country
                            }
                            ,{" "}
                            {
                              directorDetailsData?.data?.addresses?.primary
                                ?.pinCode
                            }
                          </span>
                        </td>
                        <td className="p-3  text-gray-600">
                          <div className="flex items-center gap-2">
                            <FaPhoneAlt className="size-4 text-header text-lg" />
                            <span className="text-[16px] font-medium">
                              {" "}
                              Mobile Number
                            </span>
                          </div>
                          <span className="block text-[15px] ml-4 font-light mt-1">
                            {directorDetailsData?.data?.mobile?.code || "N/A"}{" "}
                            {directorDetailsData?.data?.mobile?.number || "N/A"}
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

                      <tr className=" hover:bg-indigo-50"></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {step === 2 && (
              
              documents.length > 0 ?
              <div>
                
                <div className="rounded-md">
                  {documents.map((document, index) => (
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
                                  {document.documentType }
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
                                  {document.documentNo}
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
                                        <CommonImageViewer
                                          key={index}
                                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                          alt={`Uploaded ${index + 1}`}
                       
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
                    </div>
                  ))}
                </div>
              </div>:<div className="text-header w-full text-center "> No Data Found</div>
            )}

            {/* {step === 3 && (
              <div>
                <div className="rounded-md">
                  {financialInfo.map((element, index) => (
                    <div
                      key={index}
                      className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                    >
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Financial Type <span className="text-red-600">*</span>
                        </label>
                        <select
                          value={element.name}
                          onChange={(e) =>
                            handleInputFDChange(index, "name", e.target.value)
                          }
                          className={`${inputClassName} ${formErrors[index]?.name ? "border-[1px] " : ""
                            }`}
                        >
                          <option value="">Select Financial Name</option>
                          {employeeDocumentList
                            ?.filter((data) => data?.type === "Financial")
                            ?.map((type) => (
                              <option key={type.name} value={type.name}>
                                {type.name}
                              </option>
                            ))}
                        </select>
                        {formErrors[index]?.name && (
                          <p className="text-red-600 text-sm">
                            {formErrors[index].name}
                          </p>
                        )}
                      </div>

                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Year <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="number"
                          value={element.year}
                          onChange={(e) =>
                            handleInputFDChange(index, "year", e.target.value)
                          }
                          className={`${inputClassName} ${formErrors[index]?.year ? "border-[1px] " : ""
                            }`}
                          placeholder="Enter year"
                        />
                        {formErrors[index]?.year && (
                          <p className="text-red-600 text-sm">
                            {formErrors[index].year}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Upload <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="file"
                            id={`documentUpload${index}`}
                            className="hidden"
                            onChange={(e) =>
                              handleFileFDChange(index, e.target.files[0])
                            }
                          />
                          <br />
                          <label
                            htmlFor={`documentUpload${index}`}
                            className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                          >
                            Upload
                          </label>
                        </div>
                        {element?.file?.length > 0
                          ? element.file.map((file, index) => (
                            <img
                              key={index}
                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                              alt={`Uploaded ${index + 1}`}
                              className="w-20 h-20 shadow rounded-sm"
                            />
                          ))
                          : null}
                        {formErrors[index]?.file && (
                          <p className="text-red-600 text-sm">
                            {formErrors[index].file}
                          </p>
                        )}
                      </div>

                      <div className="px-3 gap-4 items-end mb-3">
                        <button
                          type="button"
                          onClick={() => handleFdDelete(element, index)}
                          className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 pb-2">
                    <button
                      type="button"
                      onClick={handleFDAddMore}
                      className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
                    >
                      Add More
                    </button>
                  </div>
                </div>
                <div className="flex justify-between px-3 pb-2">
                  <button
                    disabled={loadingUpdateFile}
                    type="Submit"
                    className={`${formButtonClassName}`}
                  >
                    {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
                  </button>
                </div>
              </div>
            )} */}

            {/* {step === 4 && (
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Instagram Link</label>
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

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Twitter Link</label>
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
             
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Facebook Link</label>
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

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Website Link</label>
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
            )} */}
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
};

export default ViewDirectorDetails;
