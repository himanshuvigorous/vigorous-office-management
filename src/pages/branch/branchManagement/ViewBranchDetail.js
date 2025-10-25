import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {domainName,formButtonClassName,getLocationDataByPincode,inputClassName,inputDisabledClassName,inputerrorClassNameAutoComplete,inputLabelClassName} from "../../../constents/global.js";
import { FaCamera, FaIndustry, FaPhoneAlt, FaRegAddressCard, FaRegBuilding, FaRegFileImage, FaUserAlt } from "react-icons/fa";
import { AiFillDelete, AiFillInstagram, AiOutlineMail, AiOutlineTags, AiOutlineUnorderedList, AiOutlineUser, AiTwotoneEdit } from "react-icons/ai";
import { IoIosDocument, IoLogoFacebook } from "react-icons/io";
import { TbWorld } from "react-icons/tb";
import { FaPeopleGroup, FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager.js";
import { useNavigate, useParams } from "react-router-dom";
import { countrySearch, getCountryListFunc } from "../../global/address/country/CountryFeatures/_country_reducers";
import { getStateList, stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch, getCityList } from "../../global/address/city/CityFeatures/_city_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { decrypt } from "../../../config/Encryption.js";
import {getBranchDetails,updateBranch,} from "./branchFeatures/_branch_reducers.js";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers.js";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers.js";
import {
  deleteDocument,
  fileUploadFunc,
  updateDocument,
} from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import Loader from "../../../global_layouts/Loader/Loader.js";
import { AutoComplete, Input } from "antd";
import GoogleMapContainerEdit from "./GoogleMapEdit.js";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import getUserIds from "../../../constents/getUserIds.js";

const EditBranch = () => {
  const { branchIdEnc } = useParams();
  const branchId = decrypt(branchIdEnc);
  const [clickedLocationAddress, setClickLocationaddres] = useState(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [documents, setDocuments] = useState([
   
  ]);
  const [banks, setBanks] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { loadingUpdateFile } = useSelector(
    (state) => state.fileUpload
  );


  const [fileName, setFileName] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const [location, setLocation] = useState({});
  const { branchDetailsData } = useSelector((state) => state.branch);
  const [formErrors, setFormErrors] = useState([]);
  const userType = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;
  const {
    register,
    handleSubmit,
    setValue,
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
  const PrintPincode = useWatch({
    control,
    name: "PDPin",
    defaultValue: "",
  });

  useEffect(() => {
    if (PrintPincode && PrintPincode.length >=4 &&
      PrintPincode.length <= 6 ) {
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
        setPageLoading(true);
        // await dispatch(
        //   countrySearch({
        //     isPagination: false,
        //     text: "",
        //     sort: true,
        //     status: true,
        //   })
        // );
        // await dispatch(
        //   stateSearch({ isPagination: false, text: "", sort: true, status: true })
        // );
        // await dispatch(
        //   citySearch({ isPagination: false, text: "", sort: true, status: true })
        // );
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
      const documentData = branchDetailsData?.data?.documentData?.map(
        (document) => {
          return {
            _id: document?._id,
            documentType: document?.name,
            documentNo: document?.number,
            file: document?.filePath,
          };
        }
      );
      branchDetailsData?.data?.documentData.length > 0 && setDocuments([...documentData]);
      setProfileImage(
        `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${branchDetailsData?.data?.profileImage}`
      );
      setValue("PDcompanyName", branchDetailsData?.data?.fullName);
      setValue("PDFirstName", branchDetailsData?.data?.firstName);
      setValue("PDLastName", branchDetailsData?.data?.lastName);
      setValue("PDtagline", branchDetailsData?.data?.companyProfile?.tagline);



      setValue(
        "PDBranchCode",
        branchDetailsData?.data?.branchProfile?.branchCode
      );
      setValue(
        "PDAddress",
        branchDetailsData?.data?.addresses?.primary?.street
      );
      setValue(
        "PDcountry",
        branchDetailsData?.data?.addresses?.primary?.country
      );
      setValue("PDState", branchDetailsData?.data?.addresses?.primary?.state);
      setValue("PDCity", branchDetailsData?.data?.addresses?.primary?.city);
      setValue("PDPin", branchDetailsData?.data?.addresses?.primary?.pinCode);
      setValue("PDEmail", branchDetailsData?.data?.email);
      setValue("PDMobileCode", branchDetailsData?.data?.mobile?.code);
      setValue("PDMobileNo", branchDetailsData?.data?.mobile?.number);
      setValue("PDaadharNumber", branchDetailsData?.data?.aadharNumber);
      setValue("PDgstnumber", branchDetailsData?.data?.gstNumber);
      setValue("PDpannumber", branchDetailsData?.data?.panNumber);
      setValue("PDfrn", branchDetailsData?.data?.frn);
      setValue("PDtannumber", branchDetailsData?.data?.tanNumber);
      setValue("DCdocumenttype0", branchDetailsData?.data?.documentType0);
      setValue("DCdocumentno0", branchDetailsData?.data?.documentNo0);
      setValue("DCdocumentUpload0", branchDetailsData?.data?.documentUpload0);
      setValue("PDBranchHead", branchDetailsData?.data?.branchProfile?.head);
      setValue("PDRemark", branchDetailsData?.data?.branchProfile?.remarks);
      branchDetailsData?.data?.documentData?.forEach((doc, index) => {
        setValue(`DCdocumentId${index}`, doc?._id);
        setValue(`DCdocumenttype${index}`, doc?.name);
        setValue(`DCdocumentno${index}`, doc?.number);
        setValue(`DCdocumentUpload${index}`, doc?.filePath);
      });

      const bankData = branchDetailsData?.data?.bankData?.length
        ? branchDetailsData.data.bankData.map((bank) => ({
          _id: bank?._id || "",
          accountType: bank?.accountType || "",
          bankName: bank?.bankName || "",
          branchName: bank?.branchName || "",
          bankholderName: bank?.bankholderName || "",
          accountNumber: bank?.accountNumber || "",
          ifscCode: bank?.ifscCode || "",
          file: bank?.filePath || [],
        }))
        : ''

      setBanks([...bankData]);
    }
  }, [branchDetailsData]);
  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() }]);
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
  const handleBankAddMore = () => {
    setBanks([...banks, { id: Date.now() }]);
  };
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
  const onSubmit = (data) => {
    if (step === 1) {

      const finalPayload = {
        _id: branchId,
        companyId: branchDetailsData?.data?.companyId,
        directorId: branchDetailsData?.data?.directorId,
        branchId: branchId,
        fullName: data?.PDcompanyName,
        email: data?.PDEmail,
        userType: "companyBranch",
        profileImage: "",
        status: branchDetailsData?.data?.status,
        mobile: {
          code: data?.PDMobileCode,
          number: data?.PDMobileNo,
        },
        "branchProfile": {
          "head": data?.PDBranchHead,
          "remarks": data?.PDRemark,
        },
        addresses: {
          primary: {
            street: data?.PDAddress ?? "",
            city: data?.PDCity ?? "",
            state: data?.PDState ?? "",
            country: data?.PDcountry ?? "",
            pinCode: data?.PDPin,
          },
          location: {
            latitude: location?.lat,
            longitude: location?.lng,
            address: data?.PDAddress,
          },
        },

      };

      dispatch(updateBranch(finalPayload));
    }
    if (step === 2) {
      if (validateForm()) {
        const documentPayload = documents.map((doc, index) => {
          if (doc?._id) {
            return {
              userId: branchId,
              _id: doc?._id,

              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          } else {
            return {
              userId: branchId,
              name: doc?.documentType,
              number: doc?.documentNo,
              filePath: doc?.file,
            };
          }
        });
        const finalPayload = {
          documents: documentPayload,
          userType: "companyBranch",
          type: "documents",
        };
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(getBranchDetails({
              _id: branchId
            }))
          }
        })
      }
    }
    if (step === 3) {
      if (validateBankForm()) {
        const bankPayload = banks.map((bank, index) => {
          if (bank?._id) {
            return {
              userId: branchId,
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
              userId: branchId,
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
        dispatch(updateDocument(finalPayload)).then((data) => {
          if (!data.error) {
            dispatch(
              getBranchDetails({
                _id: branchId,
              })
            );
          }

        });
      }
    }
  };
  const navTabClick = (clickedStep) => {
    if (clickedStep < step) {
      setStep(clickedStep);
    } else {
      setStep(clickedStep);
    }
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



  useEffect(() => {
    if (clickedLocationAddress) {
      setValue("PDAddress", clickedLocationAddress?.address);
      setValue("PDCountry", clickedLocationAddress?.country);
      setValue("PDState", clickedLocationAddress?.state);
      setValue("PDCity", clickedLocationAddress?.city);
      setValue("PDPin", clickedLocationAddress?.postalCode);
    }
  }, [clickedLocationAddress]);
  // useEffect(() => {
  //   if (location && location?.lat && location?.lng) {
  //     setValue("PDlatitude", location?.lat);
  //     setValue("PDLongitude", location?.lng);
  //   }
  // }, [location]);
  useEffect(() => {
    if (PrintCountry !== branchDetailsData?.data?.addresses?.primary?.country) {
      setValue("PDState", "")
      setValue("PDCity", "")
    }
  }, [PrintCountry])
  useEffect(() => {
    if (PrintState !== branchDetailsData?.data?.addresses?.primary?.state) {

      setValue("PDCity", "")
    }
  }, [PrintState])
  return (
    <GlobalLayout>
      {pageLoading ? (
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
              <> <div className="grid  grid-cols-1 md:grid-cols-2">
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
                      <td className="p-3 text-gray-600 w-1/2">
                        <div className="flex items-center gap-2">
                          <FaRegBuilding className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Branch Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.fullName || "N/A"}
                        </span>
                      </td>

                      <td className="p-3  text-gray-600 w-1/2">
                        <div className="flex items-center gap-2">
                          <AiOutlineTags className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Company Name
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.companyData?.fullName ||
                            "N/A"}
                        </span>
                      </td>
                    </tr>

                    <tr className=" hover:bg-indigo-50">
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
                          {branchDetailsData?.data?.mobile?.code || "N/A"}{" "}
                          {branchDetailsData?.data?.mobile?.number || "N/A"}
                        </span>
                      </td>
                    </tr>
                      {/* <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <FaIndustry className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">
                            Remark
                          </span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.branchProfile?.remarks || "N/A"}
                        </span>
                      </td> */}
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
                          {branchDetailsData?.data?.addresses?.primary?.street ||
                            "N/A"}
                          ,{" "}
                          
                        </span>
                      </td>

                      <td className="p-3  text-gray-600">
                        <div className="flex items-center gap-2">
                          <AiOutlineMail className="size-4 text-header text-lg" />
                          <span className="text-[16px] font-medium">Email</span>
                        </div>
                        <span className="block text-[15px] ml-4 font-light mt-1">
                          {branchDetailsData?.data?.email || "N/A"}
                        </span>
                      </td>
                    </tr>

                    
                  </tbody>
                </table>
                
                <GoogleMapContainerEdit
                                    setLocation={setLocation}
                                    address={PrintAddress}
                                    setClickLocationaddres={setClickLocationaddres}
                                    innitialLocation={
                                      branchDetailsData?.data?.addresses?.location
                                    }
                                  />
              </div>
              
             
              </>
            )}
            {step === 2 && (
              documents?.length>0?
              <div>
                
                <div className=" rounded-md ">
                  {documents.map((document, index) => (
                    
                    <div className=" rounded-md my-2" key={index}>
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
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
              </div> :<div className="text-header w-full text-center "> No Data Found</div>
            )}
            {step === 3 && (
              banks?.length>0?
              <div>
                <div className="rounded-md">
                  {banks.map((bank, index) => (
                     <div className="rounded-md my-2" key={index}>
                     <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
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
                                {bank.bankholderName}
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
                                      <CommonImageViewer
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
                   
                    </div>
                  ))}
                  
                </div>
                
              </div> :<div className="text-header w-full text-center "> No Data Found</div>
            )}
          </form>
        </div>
      )}
    </GlobalLayout>
  );
};

export default EditBranch;
