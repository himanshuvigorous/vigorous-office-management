import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
  domainName,
  inputerrorClassNameAutoComplete,
  getLocationDataByPincode,
  inputDisabledClassName,
  inputAntdSelectClassName,
  generateFinancialYearPairs,
  inputCalanderClassName,
  getDefaultFinacialYear,
} from "../../../constents/global.js";
import { FaCamera, FaLinkedin, FaUserAlt } from "react-icons/fa";
import { AiFillDelete, AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import {
  deleteCompanyOwner,
  getCompanyDetails,
  updateCompany,
  updateCompanyOwner,
} from "./companyFeatures/_company_reducers.js";
import { useNavigate } from "react-router-dom";

import {
  planSearch,
} from "../../global/other/Plan/PlanFeatures/_plan_reducers.js";
import {
  countrySearch,
  getCountryListFunc,
} from "../../global/address/country/CountryFeatures/_country_reducers.js";
import {
  stateSearch,
} from "../../global/address/state/featureStates/_state_reducers.js";
import {
  citySearch,
} from "../../global/address/city/CityFeatures/_city_reducers.js";
import { indusSearch } from "../../global/other/Industry/IndustryFeature/_industry_reducers.js";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers.js";
import Loader from "../../../global_layouts/Loader/Loader.js";
import {
  updateDocument,
  fileUploadFunc,
  deleteDocument,
  updateExperianceFunc,
  deleteExperianceFunc,
} from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers.js";
import { AutoComplete, DatePicker, Input, Select } from "antd";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker.js";
import Swal from "sweetalert2";
import { banknameSearch } from "../../global/other/bankname/bankNameFeatures/_bankName_reducers.js";
import { ProfileImageUpdate } from "../../../redux/_reducers/_auth_reducers.js";
import dayjs from "dayjs";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import getUserIds from "../../../constents/getUserIds.js";

const MyCompanyDetailsOwner = () => {

  const companyId = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?._id;
  const [step, setStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
  // const [documents, setDocuments] = useState([{ id: Date.now() }]);
  const [banks, setBanks] = useState([1]);
  const [experiance, setExperiance] = useState([
    { id: 1 }
  ]);
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [] },
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
  const [formErrorsBank, setFormErrorsBank] = useState([]);
  const [formErrorsFinancial, setFormErrorsFinancial] = useState([]);
  const [formErrorsExperiance, setFormErrorsExperiance] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  const [isHovering, setIsHovering] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [localCountryList, setLocalCountryList] = useState();
  const { bankNameListData } = useSelector((state) => state.bankname);
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

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    control,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ownerData",
  });
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
    if (PrintPincode && PrintPincode.length >=4 &&
      PrintPincode.length <= 6  && PrintPincode !== companyDetailsData?.data?.addresses?.primary?.pinCode) {

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);
        await dispatch(banknameSearch({ isPagination: false, text: "", sort: true, status: true }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
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
        : [
          {
            _id: "",
            documentType: "",
            documentNo: "",
            file: [],
          },
        ];

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
        : [
          {
            _id: "",
            accountType: "",
            bankName: "",
            branchName: "",
            bankholderName: "",
            accountNumber: "",
            ifscCode: "",
            file: [],
          },
        ];

      setBanks([...bankData]);

      const ExperianceData = companyDetailsData?.data?.companyExperiencesData?.length
        ? companyDetailsData.data.companyExperiencesData.map((experianceData) => ({
          _id: experianceData?._id || "",
          organizationName: experianceData?.organizationName || "",
          industryType: experianceData?.industryType || "",
          taskType: experianceData?.taskName ?? null,
          startYear: dayjs(experianceData?.startYear) || "",
          endYear: dayjs(experianceData?.endYear) || "",
          file: experianceData?.attachment || [],
        }))
        : [
          {
            id: "",
            organizationName: "",
            industryType: "",
            taskType: null,
            startYear: "",
            endYear: "",
            file: [],
          },
        ];

      setExperiance([...ExperianceData]);
      setFormErrorsExperiance([]);

      const financialInfo = companyDetailsData?.data?.financialInfo?.length
        ? companyDetailsData.data.financialInfo.map((element) => ({
          _id: element?._id || "",
          name: element?.name || "",
          year: element?.yearRange || "",
          file: element?.filePath || [],
        }))
        : [{ _id: "", name: "", year: "", file: [] }];

      setFinancialInfo([...financialInfo]);

      setProfileImage(
        `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${companyDetailsData?.data?.profileImage}`
      );


      reset({
        ownerData: [],
      });
      companyDetailsData?.data?.comapnyOwnerData?.forEach((ownerData, index) => {
        const formattedownerData = {
          _id: ownerData?._id,
          fullName: ownerData?.fullName,
          email: ownerData?.email,
          mobile: {
            code: ownerData?.mobile?.code,
            number: ownerData?.mobile?.number,
          },
          landline: {
            code: ownerData?.directorProfile?.landline?.code,
          },
          addresses: {
            street: ownerData?.addresses?.primary?.street,
            city: ownerData?.addresses?.primary?.city,
            state: ownerData?.addresses?.primary?.state,
            country: ownerData?.addresses?.primary?.country,
            pinCode: ownerData?.addresses?.primary?.pinCode,

          },
        };
        append(formattedownerData); // Append the formatted data
      });




      // Main company details
      setValue("PDCompanyName", companyDetailsData?.data?.fullName);
      setValue("PDTagline", companyDetailsData?.data?.companyProfile?.tagline);
      setValue("PDStatus", companyDetailsData?.data?.status);

      // setValue("PDPlan", companyDetailsData?.data?.planId);
      setValue(
        "PDOrganizationType",
        companyDetailsData?.data?.companyProfile?.companyType
      );
      setValue(
        "PDIndustryType",
        companyDetailsData?.data?.companyProfile?.industryType
      );
      setValue(
        "PDPanNumber",
        companyDetailsData?.data?.companyProfile?.penNumber
      );
      setValue(
        "PDGstNumber",
        companyDetailsData?.data?.companyProfile?.GSTNumber
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
      setValue("PDPinCode", companyDetailsData?.data?.addresses?.primary?.pinCode);

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

      setValue("PDfrn", companyDetailsData?.data?.frn);
      setValue("PDTanNumber", companyDetailsData?.data?.tanNumber);
      // ?.replace(/^https?:\/\//, '')
      if (companyDetailsData?.data?.socialLinks?.length > 0) {
        setValue(
          "SMInstagram",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Instagram"
          )?.link?.replace(/^https?:\/\//, '') || ''
        );
        setValue(
          "SMTwitter",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Twitter"
          )?.link?.replace(/^https?:\/\//, '') || ''
        );
        setValue(
          "SMFacebook",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Facebook"
          )?.link?.replace(/^https?:\/\//, '') || ''
        );
        setValue(
          "SMWebsite",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "Website"
          )?.link?.replace(/^https?:\/\//, '') || ''
        );
        setValue(
          "SMLinkedIn",
          companyDetailsData?.data?.socialLinks?.find(
            (element) => element?.name === "linkedin"
          )?.link?.replace(/^https?:\/\//, '') || ''
        );
      }
    }
  }, [companyDetailsData]);
  useEffect(() => {
    if (step === 7) {
      dispatch(
        indusSearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  }, [step])

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
  };
  const handleBankAddMore = () => {
    setBanks([...banks, { id: Date.now() }]);
  };


  // const handleProfileFileChange = (event) => {
  //   const file = event.target.files[0];
  //   dispatch(
  //     fileUploadFunc({
  //       filePath: file,
  //       isVideo: false,
  //       isMultiple: false,
  //     })
  //   ).then((res) => {
  //     setProfileImagePayload(res?.payload?.data);
  //   });
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setProfileImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };
  const handleProfileFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return; // Early return if no file is selected

    try {
      // Dispatch the file upload function and wait for the response
      const res = await dispatch(
        fileUploadFunc({
          filePath: file,
          isVideo: false,
          isMultiple: false,
        })
      );

      // If the file upload was successful and there is no error
      if (!res.error) {
        // Dispatch ProfileImageUpdate with the uploaded image path
        const data = await dispatch(
          ProfileImageUpdate({
            "_id": companyId,
            "imagePath": res?.payload?.data,
          })
        );

        // If ProfileImageUpdate is successful and there's no error
        if (!data?.error) {
          setProfileImagePayload(res?.payload?.data); // Update the state with the new image path
        }
      }
    } catch (error) {
      console.error("Error during file upload or profile image update:", error);
    }

    // Read the file to update the UI with the preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result); // Update the preview image
    };
    reader.readAsDataURL(file); // Read the file as a Data URL
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

  const onSubmit = async (data) => {
    if (step === 1) {
      const finalPayload = {
        _id: companyId,
        firstName: "",
        lastName: "",
        profileImage: profileImagePayload ?? "",
        fullName: data?.PDCompanyName ?? "",
        email: data?.PDEmail ?? "",
        userType: "company",
        planId: data?.PDPlan ?? null,
        status: companyDetailsData?.data?.status,

        mobile: {
          number: data?.PDMobileNo ?? "",
          code: data?.PDMobileCode ?? "",
        },
        companyProfile: {
          tagline: data?.PDTagline ?? "",
          companyType: data?.PDOrganizationType ?? "",
          industryType: data?.PDIndustryType ?? "",
          penNumber: data?.PDPanNumber,
          GSTNumber: data?.PDGstNumber,
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
      await dispatch(updateCompany(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getCompanyDetails({
              _id: companyId,
            })
          );
          // setStep(step => step + 1);

        }
      });
    }
    if (step === 2) {

      const reqPayload = {
        "companyId": companyId,
        "ownerArr": data?.ownerData?.map((owner) => {
          return {
            _id: owner?._id,
            fullName: owner?.fullName,
            email: owner?.email,
            mobile: {
              code: owner?.mobile?.code,
              number: owner?.mobile?.number,
            },


            addresses: {
              primary: {
                street: owner?.addresses?.street,
                city: owner?.addresses?.city,
                state: owner?.addresses?.state,
                country: owner?.addresses?.country,
                pinCode: owner?.addresses?.pinCode,
              },
            },
          };
        })
      }
      dispatch(updateCompanyOwner(reqPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getCompanyDetails({
              _id: companyId,
            })
          );
        }
      })
    }
    if (step === 3) {

      if (validateForm()) {
        const documentPayload = documents.map((doc, index) => {
          if (doc?._id) {
            return {
              userId: companyId,
              _id: doc?._id,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          } else {
            return {
              userId: companyId,
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
        await dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getCompanyDetails({
                _id: companyId,
              })
            );
          }
          // newStep && setStep(newStep);
          // setnewStep(null);
          // setStep(step => step + 1);
        });
      }
    }

    if (step === 4) {
      if (validateBankForm()) {
        const bankPayload = banks.map((bank, index) => {
          if (bank?._id) {
            return {
              userId: companyId,
              _id: bank?._id,
              bankholderName: bank?.bankholderName,
              bankName: bank?.bankName,
              accountNumber: bank?.accountNumber,
              branchName: bank?.branchName,
              ifscCode: bank?.ifscCode,
              accountType: bank?.accountType,
              filePath: bank?.file,
            };
          } else {
            return {
              userId: companyId,
              bankholderName: bank?.bankholderName,
              bankName: bank?.bankName,
              accountNumber: bank?.accountNumber,
              branchName: bank?.branchName,
              ifscCode: bank?.ifscCode,
              accountType: bank?.accountType,
              filePath: bank?.file,
            };
          }
        });

        const finalPayload = {
          bank: bankPayload,
          type: "bank",
        };
        await dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getCompanyDetails({
                _id: companyId,
              })
            );
          }
       
        });
      }
    }

    if (step === 5) {
      if (validateFDForm()) {
        const financialInfoPayload = financialInfo.map((element, index) => {
          if (element?._id) {
            return {
              userId: companyId,
              _id: element?._id,
              name: element?.name,
              yearRange: element?.year,
              filePath: element?.file,
            };
          } else {
            return {
              userId: companyId,
              name: element?.name,
              yearRange: element?.year,
              filePath: element?.file,
            };
          }
        });

        const finalPayload = {
          financialInfo: financialInfoPayload,
          type: "financial",
        };

        await dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getCompanyDetails({
                _id: companyId,
              })
            );
          }
          // newStep && setStep(newStep);
          // setnewStep(null);
          // setStep(step => step + 1);
        });
      }
    }

    if (step === 6) {
      const finalPayload = {
      

        ...companyDetailsData?.data,
        socialLinks: [
          {
            name: "Instagram",
            link: data?.SMInstagram ? data?.SMInstagram?.startsWith("http") ? data?.SMInstagram : `https://${data?.SMInstagram}` : null,
          },
          {
            name: "Twitter",
            link: data?.SMTwitter ? data?.SMTwitter?.startsWith("http") ? data?.SMTwitter : `https://${data?.SMTwitter}` : null,
          },
          {
            name: "Facebook",
            link: data?.SMFacebook ? data?.SMFacebook?.startsWith("http") ? data?.SMFacebook : `https://${data?.SMFacebook}` : null,
          },
          {
            name: "Website",
            link: data?.SMWebsite ? data?.SMWebsite?.startsWith("http") ? data?.SMWebsite : `https://${data?.SMWebsite}` : null,
          },
          {
            name: "linkedin",
            link: data?.SMLinkedIn ? data?.SMLinkedIn?.startsWith("http") ? data?.SMLinkedIn : `https://${data?.SMLinkedIn}` : null,
          },
        ],
      };

      await dispatch(updateCompany(finalPayload)).then((data) => {
        if (!data.error) {
          dispatch(
            getCompanyDetails({
              _id: companyId,
            })
          );
        }
      
      });
    }
    if (step === 7) {
      if (validateExperianceForm()) {

        const experiancePayload = experiance.map((experianceData, index) => {
          if (experianceData?._id) {
            return {
              _id: experianceData?._id,
              "organizationName": experianceData?.organizationName,
              "industryType": experianceData?.industryType,
              "taskName": experianceData?.taskType,
              "startYear": dayjs(experianceData?.startYear).format("YYYY"),
              "endYear": dayjs(experianceData?.endYear).format("YYYY"),
              "attachment": experianceData?.file
            };
          } else {
            return {
              "organizationName": experianceData?.organizationName,
              "industryType": experianceData?.industryType,
              "taskName": experianceData?.taskType,
              "startYear": dayjs(experianceData?.startYear).format("YYYY"),
              "endYear": dayjs(experianceData?.endYear).format("YYYY"),
              "attachment": experianceData?.file
            };
          }
        });

        const finalPayload = {
          "companyId": companyId,
          "experienceArr": experiancePayload
        }


        await dispatch(updateExperianceFunc(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getCompanyDetails({
                _id: companyId,
              })
            );
          }

        
        });


      }

    }

  };
  const navTabClick = async (clickedStep) => {

    setStep(clickedStep);
  };
  useEffect(() => {
 
    dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));

  }, []);
  const handleInputChangeBank = (index, field, value) => {
    const updatedBanks = [...banks];
    const newFormErrors = [...formErrorsBank];

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
    setFormErrorsBank(newFormErrors);
  };
  const handleBankFileChange = (index, file) => {

    if (!file) return;


    let selectedFile = file;


    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      const isPdf = file.type === 'application/pdf';

      Swal.fire({
        title: 'Preview your file',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
            ${
              isPdf
                ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
                : `<img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">` // Display image preview for non-PDF files
            }
            <br>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((data) => {
            if (!data.error) {
              const updatedBanks = [...banks];
              updatedBanks[index].file = [data?.payload?.data];
              setBanks(updatedBanks);
              const newFormErrors = [...formErrorsBank];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setFormErrorsBank(newFormErrors);
            }
          });
        } else {
        

        }
      });
    };


    fileReader.readAsDataURL(file);
  }
  const handleDeleteBankImage = (index, file) => {
    const updatedBanks = [...banks];
    updatedBanks[index].file = [];
    setBanks(updatedBanks);
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

      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });
    
    setFormErrorsBank(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };



  const handleExperianceAddMore = () => {
    setExperiance([...experiance, { id: Date.now() }]);
  };
  const handleInputChangeExperiance = (index, field, value) => {
    const updatedExperiance = [...experiance];
    const newFormErrors = [...formErrorsExperiance];
    updatedExperiance[index][field] = value;
    setExperiance(updatedExperiance);
    setFormErrorsExperiance(newFormErrors);
  };
  const handleExperianceFileChange = (index, file) => {

    if (!file) return;


    let selectedFile = file;


    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      const isPdf = file.type === 'application/pdf';
  

      Swal.fire({
        title: 'Preview your file',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
            ${
              isPdf
                ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
                : `<img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">` // Display image preview for non-PDF files
            }
            <br>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((data) => {
            if (!data.error) {
              const updatedExperiance = [...experiance];
              updatedExperiance[index].file = [data?.payload?.data];
              setExperiance(updatedExperiance);
              const newFormErrors = [...formErrorsExperiance];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setFormErrorsExperiance(newFormErrors);
            }
          });
        } else {

        }
      });
    };

    fileReader.readAsDataURL(file);
  }
  const handleDeleteExperianceImage = (index, file) => {
    const updatedExperiance = [...experiance];
    updatedExperiance[index].file = [];
    setExperiance(updatedExperiance);
  };
  const handleExperianceDelete = (experiance, index) => {
    if (experiance?._id) {
      dispatch(deleteExperianceFunc({ _id: experiance?._id })).then((data) => {
        if (!data.error) {
          setExperiance((prevExperiance) =>
            prevExperiance.filter((_, index2) => index2 !== index)
          );
        }
      });
    } else {
      setExperiance((prevExperiance) =>
        prevExperiance.filter((_, index2) => index2 !== index)
      );
    }
  };
  const validateExperianceForm = () => {
    let errors = [];
    experiance.forEach((experiance, index) => {
      let error = {};
      if (!experiance.organizationName) {
        error.organizationName = "Organization Name is required.";
      }
      if (!experiance.industryType) {
        error.industryType = "Industry Type name is required.";
      }
      if (!experiance.startYear) {
        error.startYear = "Start Year is required.";
      }
      if (!experiance.endYear) {
        error.endYear = "End Year is required.";
      }
      if (!experiance.taskType) {
        error.taskType = "Task Type is required.";
      }
      if (!experiance.file || experiance.file.length === 0) {
        error.file = "Document file is required.";
      }

      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });


    
    setFormErrorsExperiance(errors);
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
    if (!file) return;
  

    let selectedFile = file;
  
    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';
  
    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;
      const isPdf = file.type === 'application/pdf';
  
      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
            ${
              isPdf
                ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
                : `<img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">` // Display image preview for non-PDF files
            }
            <br>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the updated selectedFile (which could be the original or changed file)
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
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
        } else {
          // Handle the cancel case
     
        }
      });
    };
  
    // Read the file to generate the preview
    fileReader.readAsDataURL(file);
  };
  
  const handleDeleteDoctImage = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = [];
    setDocuments(updatedDocuments);
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
    const newFormErrors = [...formErrorsFinancial];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setFormErrorsFinancial(newFormErrors);
  };
  const handleFileFDChange = (index, file) => {
    if (!file) return;

    // Variable to track the newly selected file
    let selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;
      const isPdf = file.type === 'application/pdf';
      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
            ${
              isPdf
                ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
                : `<img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">` // Display image preview for non-PDF files
            }
            <br>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the updated selectedFile (which could be the original or changed file)
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,  // Ensure the updated file is used here
              isVideo: false,
              isMultiple: false,
            })
          ).then((data) => {
            if (!data.error) {
              const updatedFinancialInfo = [...financialInfo];
              updatedFinancialInfo[index].file = [data?.payload?.data];
              setFinancialInfo(updatedFinancialInfo);
              const newFormErrors = [...formErrorsFinancial];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setFormErrorsFinancial(newFormErrors);
            }
          });
        } else {
          // Handle the cancel case

        }
      });
    };

    // Read the file to generate the preview
    fileReader.readAsDataURL(file);
  };

  const handleDeleteFDImage = (index, file) => {
    const updatedFinancialInfo = [...financialInfo];
    updatedFinancialInfo[index].file = [];
    setFinancialInfo(updatedFinancialInfo);
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


    setFormErrorsFinancial(errors);
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


  const financialYearPairs = generateFinancialYearPairs();
  const deleteData = (data, index) => {
    if (data?._id) {
      dispatch(
        deleteCompanyOwner({
          _id: data?._id,
        })
      ).then((res) => {
        if (!res?.error) {
          fetchData();
        }
      });
    } else {
      remove(index);
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
                  onChange={handleProfileFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
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
                {/* Website */}
                <TbWorld
                  onClick={() => {
                    if (PrintWebsite) {
                      const url = PrintWebsite.startsWith("http") ? PrintWebsite : `https://${PrintWebsite}`;
                      window.open(url, "_blank");
                    }
                  }}
                />

                {/* Instagram */}
                <AiFillInstagram
                  onClick={() => {
                    if (PrintInstagram) {
                      const url = PrintInstagram.startsWith("http") ? PrintInstagram : `https://${PrintInstagram}`;
                      window.open(url, "_blank");
                    }
                  }}
                />

                {/* Facebook */}
                <IoLogoFacebook
                  onClick={() => {
                    if (PrintFacebook) {
                      const url = PrintFacebook.startsWith("http") ? PrintFacebook : `https://${PrintFacebook}`;
                      window.open(url, "_blank");
                    }
                  }}
                />

                {/* Twitter */}
                <FaSquareXTwitter
                  onClick={() => {
                    if (PrintTwitter) {
                      const url = PrintTwitter.startsWith("http") ? PrintTwitter : `https://${PrintTwitter}`;
                      window.open(url, "_blank");
                    }
                  }}
                />

                {/* LinkedIn */}
                <FaLinkedin
                  onClick={() => {
                    if (printLinkedin) {
                      const url = printLinkedin.startsWith("http") ? printLinkedin : `https://${printLinkedin}`;
                      window.open(url, "_blank");
                    }
                  }}
                />
              </div>

            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 md:col-span-9 col-span-12" >
            <div className="flex bg-header justify-start items-center rounded-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
              <button
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
              <button
                type="button"
                onClick={() => navTabClick(2)}
                className={`flex flex-col items-center relative pb-2 ${step === 2 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 2 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Owner Details</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(3)}
                className={`flex flex-col items-center relative pb-2 ${step === 3 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 3 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">KYC Documents</span>
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
                <span className="text-sm font-semibold">Bank Details</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(5)}
                className={`flex flex-col items-center relative pb-2 ${step === 5 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 5 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Financial Documents</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(6)}
                className={`flex flex-col items-center relative pb-2 ${step === 6 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 6 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Social Media</span>
              </button>
              <button
                type="button"
                onClick={() => navTabClick(7)}
                className={`flex flex-col items-center relative pb-2 ${step === 7 ? "text-white ]" : "text-gray-400"
                  } cursor-pointer`}
              >
                {step === 7 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Experience</span>
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
                        disabled
                        className={`placeholder: ${inputDisabledClassName} ${errors.PDCompanyName
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
                      <label className={`${inputLabelClassName}`}>
                        Tag Line
                      </label>
                      <input
                        type="text"
                        {...register("PDTagline")}
                        className={`placeholder: ${inputClassName} ${errors.PDTagline
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Tag Line"
                      />
                      {errors.PDTagline && (
                        <p className="text-red-500 text-sm">
                          {errors.PDTagline.message}
                        </p>
                      )}
                    </div>

                 
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Organization Type <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        disabled
                        {...register("PDOrganizationType")}
                        className={`placeholder: ${inputDisabledClassName} ${errors.PDOrganizationType
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Organization Type"
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
                      <input
                        type="text"
                        disabled
                        {...register("PDIndustryType")}
                        className={`placeholder: ${inputDisabledClassName} ${errors.PDIndustryType
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Industry Type"
                      />
                     
                      {errors.PDIndustryType && (
                        <p className="text-red-500 text-sm">
                          {errors.PDIndustryType.message}
                        </p>
                      )}
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
                            options={countryListData?.docs?.map((type) => ({
                              value: type?.name,
                            }))}
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
                                    stateName: PrintState,
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
                          code <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="PDMobileCode"
                          rules={{ required: "code is required" }}
                          render={({ field }) => (
                            <CustomMobileCodePicker
                              field={field}
                              errors={errors}
                            />
                          )}
                        />

                        {errors[`PDMobileCode`] && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors[`PDMobileCode`].message}
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
                            value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                            message: "Invalid PAN card format (ABCDE1234E)",
                          }
                        })}
                        className={`  ${inputClassName} ${errors.PDPanNumber ? "border-[1px] " : "border-gray-300"
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
                <div className="flex justify-between px-3 pb-2">
                  <button type="Submit" className={`${formButtonClassName}`}>
                    Submit Details
                  </button>
                </div>
              </div>
            )}
            {step === 2 && (
              <>
                {fields.map((item, index) => (
                  <div key={item.id} className="border border-gray-300 rounded-md my-2">
                    <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                      <div className="px-3 py-2 text-white font-semibold">
                        Owner {index + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteData(item, index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <AiFillDelete size={20} className="m-2" />
                      </button>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-1 px-3">
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Full Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(`ownerData.${index}.fullName`, {
                            required: "Full Name is required",
                          })}
                          className={`${inputClassName} ${errors?.ownerData?.[index]?.fullName
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors?.ownerData?.[index]?.fullName && (
                          <p className="text-red-500 text-sm">
                            {errors.ownerData[index].fullName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Email <span className="text-red-600">*</span>
                        </label>
                        <input
                          {...register(`ownerData.${index}.email`, {
                            required: "Email is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Invalid email address",
                            },
                          })}
                          className={`${inputClassName} ${errors?.ownerData?.[index]?.email
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        />
                        {errors?.ownerData?.[index]?.email && (
                          <p className="text-red-500 text-sm">
                            {errors.ownerData[index].email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Mobile <span className="text-red-600">*</span>
                        </label>

                        <div className="flex gap-2">
                          <div className="w-[150px]">
                            <Controller
                              control={control}
                              name={`ownerData.${index}.mobile.code`}
                              rules={{ required: "code is required" }}
                              render={({ field }) => (
                                <CustomMobileCodePicker
                                  field={field}
                                  errors={errors}
                                />
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <input
                              type="number"
                              {...register(`ownerData.${index}.mobile.number`, {
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
                              placeholder="Number"
                              className={`${inputClassName} ${errors?.ownerData?.[index]?.mobile?.number
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {errors?.ownerData?.[index]?.mobile?.code && (
                            <p className="text-red-500 text-sm">
                              {errors.ownerData[index].mobile.code.message}
                            </p>
                          )}
                          {errors?.ownerData?.[index]?.mobile?.number && (
                            <p className="text-red-500 text-sm">
                              {errors.ownerData[index].mobile.number.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-1 px-3">
                      <div className="col-span-2">
                        <label className={`${inputLabelClassName}`}>
                          Primary Address<span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register(`ownerData.${index}.addresses.street`, {
                            required: "Primary Address is required",
                          })}
                          className={`${inputClassName} ${errors.ownerData?.[index]?.addresses?.street
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Primary Address"
                        />
                        {errors.ownerData?.[index]?.addresses?.street && (
                          <p className="text-red-500 text-sm">
                            {errors.ownerData?.[index]?.addresses?.street.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-2 px-3">
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          Country <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name={`ownerData.${index}.addresses.country`}
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              {...field}
                              onChange={(value) => field.onChange(value)} 
                              className="w-full"
                              options={countryListData?.docs?.map((type) => ({
                                value: type?.name,
                              }))}
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
                                className={`${inputClassName} ${errors.ownerData?.[index]?.addresses?.country
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.ownerData?.[index]?.addresses?.country && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.ownerData[index].addresses.country.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          State <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name={`ownerData.${index}.addresses.state`}
                          rules={{ required: "State is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              {...field}
                              onChange={(value) => field.onChange(value)} // Handle state change
                              className="w-full"
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
                                      countryName: watch(
                                        `ownerData.${index}.addresses.country`
                                      ),
                                      sort: true,
                                      status: true,
                                    })
                                  );
                                }}
                                className={`${inputClassName} ${errors.ownerData?.[index]?.addresses?.state
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.ownerData?.[index]?.addresses?.state && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.ownerData[index].addresses.state.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          City <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name={`ownerData.${index}.addresses.city`}
                          rules={{ required: "City is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              {...field}
                              onChange={(value) => field.onChange(value)} // Handle city change
                              className="w-full"
                              options={cityListData?.docs?.map((type) => ({
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
                                      stateName: watch(
                                        `ownerData.${index}.addresses.state`
                                      ),
                                    })
                                  );
                                }}
                                className={`${inputClassName} ${errors.ownerData?.[index]?.addresses?.city
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.ownerData?.[index]?.addresses?.city && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.ownerData[index].addresses.city.message}
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
                          name={`ownerData.${index}.addresses.pinCode`}
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
                              className={`${inputClassName} ${errors.ownerData?.[index]?.addresses?.pinCode
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          )}
                        />
                        {errors.ownerData?.[index]?.addresses?.pinCode && (
                          <p className="text-red-500 text-sm">
                            {errors.ownerData[index].addresses.pinCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 justify-between items-center my-2">
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        fullName: "",

                        email: "",
                        mobile: { code: "", number: "" },
                        addresses: {
                          street: "",
                          city: "",
                          state: "",
                          country: "",
                          pinCode: "",
                        },
                      })
                    }
                    className="bg-header px-2 py-2 text-sm rounded-md text-white"
                  >
                    Add New Owner
                  </button>

                  <button
                    type="submit"
                    className="bg-header px-2 py-2 text-sm rounded-md text-white"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
            {step === 3 && (
              <div>

                <div className="rounded-md">
                  {documents?.map((document, index) => (
                    <div className="border border-gray-300 rounded-md my-2" key={index}>
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold">  Document {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => handleDelete(document, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={20} className="m-2" />
                        </button>
                      </div>
                      <div
                        key={index}
                        className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                      >
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Document Type <span className="text-red-600">*</span>
                          </label>

                          <Select
                            value={document.documentType}
                            className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "documentType",
                                e
                              )
                            }
                            placeholder="Select Document Type"
                            showSearch

                          >
                            <Select.Option value="">Select Document</Select.Option>
                            {employeeDocumentList
                              ?.filter((data) => data?.type === "General")
                              
                              .map((type) => (
                                <Select.Option key={type.name} value={type.name}>
                                  {type.name}
                                </Select.Option>
                              ))}

                          </Select>

                          {formErrors[index]?.documentType && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].documentType}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Document No <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={document.documentNo}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "documentNo",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrors[index]?.documentNo
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Document No"
                          />
                          {formErrors[index]?.documentNo && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].documentNo}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                             accept=".pdf,image/*"
                              id={`documentUpload${index}`}
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(index, e.target.files[0])
                              }
                            />
                            <br />
                            <label
                              htmlFor={`documentUpload${index}`}
                              className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                            >
                              Upload Image
                            </label>
                          </div>
                          {document?.file?.length > 0
                            ? document.file.map((file, fileIndex) => (
                              <div key={fileIndex} className="relative">
                                <CommonImageViewer
                                  // key={index}
                                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${file}`}
                                  alt={`Uploaded ${fileIndex + 1}`}
                              
                                />
                                <button
                                  className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  onClick={() => handleDeleteDoctImage(index, file)}
                                >
                                  ✕
                                </button>
                              </div>

                            ))
                            : null}
                          {formErrors[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].file}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
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
                    disabled={loadingUpdateFile}
                    type="Submit"
                    className={`${formButtonClassName}`}
                  >
                    {loadingUpdateFile ? "Submitting ..." : "Submit Details"}
                  </button>
                </div>
              </div>
            )}
            {step === 4 && (
              <div>
                <div className="rounded-md">
                  {banks.map((bank, index) => (
                    <div className="border border-gray-300 rounded-md my-2" key={index}>
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold"> Bank Document {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => handleBankDelete(bank, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={20} className="m-2" />
                        </button>
                      </div>
                      <div

                        className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                      >
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Bank Holder Name{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={bank.bankholderName}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "bankholderName",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrorsBank[index]?.bankholderName
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Bank Holder name"
                          />
                          {formErrorsBank[index]?.bankholderName && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].bankholderName}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Bank Name <span className="text-red-600">*</span>
                          </label>
                          <Select
                            value={bank.bankName}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "bankName",
                                e
                              )
                            }
                            showSearch
                            className={`${inputAntdSelectClassName} ${formErrorsBank[index]?.bankName
                              ? "border-[1px] "
                              : ""
                              }`}
                          >
                            <Select.Option value="">Select Bank Name</Select.Option>
                            {bankNameListData?.map((data) => (
                              <Select.Option key={data.name} value={data.name}>
                                {data.name}
                              </Select.Option>
                            ))}
                          </Select>

                          {formErrorsBank[index]?.bankName && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].bankName}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Branch Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={bank.branchName}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "branchName",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrorsBank[index]?.branchName
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Branch name"
                          />
                          {formErrorsBank[index]?.branchName && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].branchName}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Account Number<span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            value={bank.accountNumber}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "accountNumber",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrorsBank[index]?.accountNumber
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Account Number"
                          />
                          {formErrorsBank[index]?.accountNumber && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].accountNumber}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            IFSC Code<span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={bank.ifscCode}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "ifscCode",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrorsBank[index]?.ifscCode ? "border-[1px] " : ""
                              }`}
                            placeholder="Enter IFSC Code"
                          />
                          {formErrorsBank[index]?.ifscCode && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].ifscCode}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Account Type <span className="text-red-600">*</span>
                          </label>
                         
                          <Select
                            value={bank.accountType}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "accountType",
                                e
                              )
                            }
                            className={`${inputAntdSelectClassName} ${formErrorsBank[index]?.accountType
                              ? "border-[1px] "
                              : ""
                              }`}
                          >
                            <Select.Option value="">Select Account Type</Select.Option>
                            <Select.Option className="" value="saving">
                              Saving
                            </Select.Option>
                            <Select.Option className="" value="current">
                              Current
                            </Select.Option>
                            <Select.Option className="" value="Salary">
                              Salary
                            </Select.Option>
                            <Select.Option className="" value="Joint">
                              Joint
                            </Select.Option>
                          </Select>
                          {formErrorsBank[index]?.accountType && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].accountType}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image
                            </label>
                            <input
                              type="file"
                              accept=".pdf,image/*"
                              id={`bankUpload${index}`}
                              className="hidden"
                              onChange={(e) =>
                                handleBankFileChange(index, e.target.files[0])
                              }
                            />
                            <br />
                            <label
                              htmlFor={`bankUpload${index}`}
                              className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                            >
                              Upload Image
                            </label>
                          </div>
                          {bank?.file?.length > 0
                            ? bank.file.map((file, fileIndex) => (
                              <div key={fileIndex} className="relative">
                               <CommonImageViewer
                                  // key={index}
                                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                  alt={`Uploaded ${fileIndex + 1}`}
                                
                                />
                                <button
                                  className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  onClick={() => handleDeleteBankImage(index, file)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                            : null}
                          {formErrorsBank[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {formErrorsBank[index].file}
                            </p>
                          )}
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
            )}
            {step === 5 && (
              <div>
                <div className="rounded-md">

                  {financialInfo?.map((element, index) => (
                    <div className="border border-gray-300 rounded-md my-2" key={index}>
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold"> Financial  Document {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => handleFDDelete(element, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={20} className="m-2" />
                        </button>
                      </div>
                      <div
                        key={index}
                        className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                      >
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Document Type <span className="text-red-600">*</span>
                          </label>

                          <Select
                            value={element.name}
                            showSearch
                            onChange={(e) =>
                              handleInputFDChange(index, "name", e)
                            }
                            className={`${inputAntdSelectClassName} ${formErrorsFinancial[index]?.name ? "border-[1px] " : ""
                              }`}
                          >
                            <Select.Option value="">Select Document</Select.Option>
                            {employeeDocumentList
                              ?.filter((data) => data?.type === "Financial")
                             
                              .map((type) => (
                                <Select.Option key={type.name} value={type.name}>
                                  {type.name}
                                </Select.Option>
                              ))}
                          </Select>
                          {formErrorsFinancial[index]?.name && (
                            <p className="text-red-600 text-sm">
                              {formErrorsFinancial[index].name}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Year <span className="text-red-600">*</span>
                          </label>
                          <Select
                            value={element.year}
                            defaultValue={getDefaultFinacialYear()}
                            onChange={(e) =>
                              handleInputFDChange(index, "year", e)
                            }
                            className={`${inputAntdSelectClassName} ${formErrorsFinancial[index]?.name ? "border-[1px] " : ""}`}
                          >
                            <Select.Option value="">Select Financial Year</Select.Option>
                            {financialYearPairs.map((yearPair) => (
                              <Select.Option key={yearPair} value={yearPair}>
                                {yearPair}
                              </Select.Option>
                            ))}
                          </Select>
                          
                          {formErrorsFinancial[index]?.year && (
                            <p className="text-red-600 text-sm">
                              {formErrorsFinancial[index].year}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image  <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                              accept=".pdf,image/*"
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
                              Upload Image
                            </label>
                          </div>
                          {element?.file?.length > 0
                            ? element.file.map((file, fileIndex) => (
                              <div key={fileIndex} className="relative">
                                 <CommonImageViewer
                                  // key={index}
                                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                  alt={`Uploaded ${fileIndex + 1}`}
                           
                                />
                                <button
                                  className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  onClick={() => handleDeleteFDImage(index, file)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                            : null}
                          {formErrorsFinancial[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {formErrorsFinancial[index].file}
                            </p>
                          )}
                        </div>

                       
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
            )}
            {step === 6 && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">

                  {/* Instagram Link */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      <i className="fab fa-instagram mr-2"></i> Instagram
                    </label>
                    <div className="flex">
                      <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                      <input
                        type="text"
                        {...register("SMInstagram")}
                        className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMInstagram ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter Instagram Link"
                      />
                    </div>
                    {errors.SMInstagram && <p className="text-red-500 text-sm">{errors.SMInstagram.message}</p>}
                  </div>

                  {/* Twitter Link */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      <i className="fab fa-twitter mr-2"></i> Twitter
                    </label>
                    <div className="flex">
                      <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                      <input
                        type="text"
                        {...register("SMTwitter")}
                        className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMTwitter ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter Twitter Link"
                      />
                    </div>
                    {errors.SMTwitter && <p className="text-red-500 text-sm">{errors.SMTwitter.message}</p>}
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">

                  {/* LinkedIn Link */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      <i className="fab fa-linkedin mr-2"></i> LinkedIn
                    </label>
                    <div className="flex">
                      <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                      <input
                        type="text"
                        {...register("SMLinkedIn")}
                        className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMLinkedIn ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter LinkedIn Link"
                      />
                    </div>
                    {errors.SMLinkedIn && <p className="text-red-500 text-sm">{errors.SMLinkedIn.message}</p>}
                  </div>

                  {/* Facebook Link */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      <i className="fab fa-facebook mr-2"></i> Facebook
                    </label>
                    <div className="flex">
                      <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                      <input
                        type="text"
                        {...register("SMFacebook")}
                        className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMFacebook ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter Facebook Link"
                      />
                    </div>
                    {errors.SMFacebook && <p className="text-red-500 text-sm">{errors.SMFacebook.message}</p>}
                  </div>

                  {/* Website Link */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      <i className="fas fa-globe mr-2"></i> Website
                    </label>
                    <div className="flex">
                      <input className="mt-1 block w-[70px] px-2 py-[12px] shadow-sm rounded-l-xl text-sm bg-gray-200 focus:outline-none" disabled value={"https://"} />
                      <input
                        type="text"
                        {...register("SMWebsite")}
                        className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-r-xl text-sm bg-white focus:outline-none ${errors.SMWebsite ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter Website Link"
                      />
                    </div>
                    {errors.SMWebsite && <p className="text-red-500 text-sm">{errors.SMWebsite.message}</p>}
                  </div>

                </div>
                <div className="flex justify-between px-3 pb-2">
                  <button type="submit" className={`${formButtonClassName}`}>
                    Submit
                  </button>
                </div>
              </div>
            )}

            {step === 7 && (
              <div>
                <div className="rounded-md">
                  {experiance.map((experiancedata, index) => (
                    <div className="border border-gray-300 rounded-md my-2" key={index}>
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold"> Experience Document {index + 1}</div>
                        <button
                          type="button"
                          onClick={() => handleExperianceDelete(experiancedata, index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AiFillDelete size={20} className="m-2" />
                        </button>
                      </div>
                      <div

                        className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                      >
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Organization Name{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            value={experiancedata.organizationName}
                            onChange={(e) =>
                              handleInputChangeExperiance(
                                index,
                                "organizationName",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrorsExperiance[index]?.organizationName
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Organization Name"
                          />
                          {formErrorsExperiance[index]?.organizationName && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].organizationName}
                            </p>
                          )}
                        </div>


                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Industry Type <span className="text-red-600">*</span>
                          </label>
                          <Select
                            value={experiancedata.industryType}
                            onChange={(e) =>
                              handleInputChangeExperiance(
                                index,
                                "industryType",
                                e
                              )
                            }
                            showSearch
                            className={`${inputAntdSelectClassName} ${formErrorsExperiance[index]?.industryType
                              ? "border-[1px] "
                              : ""
                              }`}
                          >
                            <Select.Option value="">Select Industry Type</Select.Option>
                            {industryListData?.map((type) => (
                              <Select.Option key={type?._id} value={type?.name}>
                                {type?.name}
                              </Select.Option>
                            ))}
                          </Select>
                          {formErrorsExperiance[index]?.industryType && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].industryType}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Task Type <span className="text-red-600">*</span>
                          </label>
                          <Select
                            mode="tags"
                            placeholder="Please select"
                            value={experiancedata.taskType}
                            onChange={(e) =>
                              handleInputChangeExperiance(
                                index,
                                "taskType",
                                e
                              )
                            }
                            className={`${inputClassName} ${formErrorsExperiance[index]?.taskType
                              ? "border-[1px] "
                              : ""
                              }`}
                            style={{
                              width: '100%',
                            }}
                          />
                          {formErrorsExperiance[index]?.taskType && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].taskType}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Start Year <span className="text-red-600">*</span>
                          </label>
                          <DatePicker
                            className={`${inputCalanderClassName} py-2.5 ${errors.recurrence?.date ? "border-[1px] " : "border-gray-300"} `}
                            popupClassName={'!z-[1580]'}
                            value={experiancedata.startYear} onChange={(e) =>
                              handleInputChangeExperiance(
                                index,
                                "startYear",
                                e
                              )} picker="year" />

                          {formErrorsExperiance[index]?.startYear && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].startYear}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            End Year <span className="text-red-600">*</span>
                          </label>
                          <DatePicker
                            className={`${inputCalanderClassName} py-2.5 ${errors.recurrence?.date ? "border-[1px] " : "border-gray-300"} `}
                            popupClassName={'!z-[1580]'}
                            value={experiancedata.endYear} onChange={(e) =>
                              handleInputChangeExperiance(
                                index,
                                "endYear",
                                e
                              )} picker="year" />
                          {formErrorsExperiance[index]?.endYear && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].endYear}
                            </p>
                          )}
                        </div>




                        <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
                              id={`bankUpload${index}`}
                              accept=".pdf,image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleExperianceFileChange(index, e.target.files[0])
                              }
                            />
                            <br />
                            <label
                              htmlFor={`bankUpload${index}`}
                              className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                            >
                              Upload Image
                            </label>
                          </div>
                          {experiancedata?.file?.length > 0
                            ? experiancedata?.file?.map((file, fileIndex) => (
                              <div key={fileIndex} className="relative">
                               <CommonImageViewer
                                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                  alt={`Uploaded ${fileIndex + 1}`}
                               
                                />
                                <button
                                  className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                  onClick={() => handleDeleteExperianceImage(index, file)}
                                >
                                  ✕
                                </button>
                              </div>
                            ))
                            : null}
                          {formErrorsExperiance[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {formErrorsExperiance[index].file}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between px-3 pb-2">
                    <button
                      type="button"
                      onClick={handleExperianceAddMore}
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
            )}

          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
};

export default MyCompanyDetailsOwner;
