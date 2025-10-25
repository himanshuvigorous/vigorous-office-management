
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import { LiaEditSolid } from "react-icons/lia";
import {
  domainName,
  formButtonClassName,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputDisabledClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
} from "../../../constents/global.js";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillDelete, AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbEditOff, TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager.js";
import { useNavigate, useParams } from "react-router-dom";
import { countrySearch, getCountryListFunc } from "../../global/address/country/CountryFeatures/_country_reducers";
import { getStateList, stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch, getCityList } from "../../global/address/city/CityFeatures/_city_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { decrypt } from "../../../config/Encryption.js";
import {
  getBranchDetails,
  updateBranch,
} from "./branchFeatures/_branch_reducers.js";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers.js";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers.js";
import {
  deleteDocument,
  fileUploadFunc,
  updateDocument,
} from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import Loader from "../../../global_layouts/Loader/Loader.js";
import { AutoComplete, Input, Select } from "antd";
import GoogleMapContainerEdit from "./GoogleMapEdit.js";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker.js";
import Swal from "sweetalert2";
import { banknameSearch } from "../../global/other/bankname/bankNameFeatures/_bankName_reducers.js";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import getUserIds from "../../../constents/getUserIds.js";

const MyBranchDetails = () => {
 const branchId = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?._id;
  const [clickedLocationAddress, setClickLocationaddres] = useState(null);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [] ,isEditable:false},
  ]);
  const [banks, setBanks] = useState([1]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState();
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );
  const { bankNameListData } = useSelector((state) => state.bankname);
  const { loadingUpdateFile } = useSelector((state) => state.fileUpload);

  const [fileName, setFileName] = useState({});
  const [fileUrl, setFileUrl] = useState({});
  const [location, setLocation] = useState({});
  const { branchDetailsData } = useSelector((state) => state.branch);
  const [formErrors, setFormErrors] = useState([]);
  const [doctformErrors, setDoctFormErrors] = useState([]);
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

  useEffect(() => {
    if (branchDetailsData?.data) {
      const documentData = branchDetailsData?.data?.documentData?.length ? branchDetailsData?.data?.documentData?.map(
        (document) => {
          return {
            _id: document?._id,
            documentType: document?.name,
            documentNo: document?.number,
            file: document?.filePath,
             isEditable: false,
          };
        }
      ) : [
            {
              _id: '',
              documentType: "",
              documentNo: "",
              file: [],
              isEditable: true,
            },
          ];
     
        setDocuments([...documentData]) 
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
      // setValue("PDRemark", branchDetailsData?.data?.branchProfile?.remarks);
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
          openingBalance:bank?.openingBalance||'',
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
             openingBalance:'',
            ifscCode: "",
            file: [],
          },
        ];

      setBanks([...bankData]);
    }
  }, [branchDetailsData]);

  const handleAddMore = () => {
    setDocuments([...documents, { id: Date.now() ,isEditable:true}]);
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

    if (!file) return;

    // Variable to track the newly selected file
    let selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
            <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
            <img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">
            <br>
            <button id="changeImageBtn" style="  margin-top: 15px;
  padding: 10px 18px;
  cursor: pointer;
  background-color: #074173;
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);">Change Image</button>
            <input type="file" id="fileInput" style="display: none;" accept="image/*">
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
        didOpen: () => {
          // Attach the change image functionality to the button
          const changeImageBtn = document.getElementById('changeImageBtn');
          const fileInput = document.getElementById('fileInput');
          const filePreview = document.getElementById('filePreview');

          changeImageBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger file input click
          });

          // When a new file is selected
          fileInput.addEventListener('change', (event) => {
            const newFile = event.target.files[0];
            if (newFile) {
              selectedFile = newFile; // Update the selected file
              const newFileReader = new FileReader();
              newFileReader.onload = (e) => {
                filePreview.src = e.target.result; // Update preview
              };
              newFileReader.readAsDataURL(newFile);
            }
          });
        }
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
              setDocuments(updatedBanks);
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

     
      // if (!bank.file || bank.file.length === 0) {
      //   error.file = "Bank file is required.";
      // }
      if (Object.keys(error).length > 0) {
        errors[index] = error;
      }
    });

    setFormErrors(errors);
    return errors.every((error) => Object.keys(error).length === 0);
  };

  const handleEditButton = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, i) =>
      i === index ? { ...doc, isEditable: !doc.isEditable } : doc
      )
    );
    
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
        branchProfile: {
          head: data?.PDBranchHead,
          // remarks: data?.PDRemark,
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
            dispatch(
              getBranchDetails({
                _id: branchId,
              })
            );
          }
        });
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
               openingBalance:bank?.openingBalance,
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
               openingBalance:bank?.openingBalance,
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
    const newFormErrors = [...doctformErrors];
    if (newFormErrors[index]?.[field]) {
      delete newFormErrors[index][field];
    }
    setDoctFormErrors(newFormErrors);
  };

  const handleFileChange = (index, file) => {
    if (!file) return;

    // Variable to track the newly selected file
    let selectedFile = file;

    // Create a preview of the file
    const fileReader = new FileReader();
    let filePreviewUrl = '';

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      // Show SweetAlert to confirm upload
      Swal.fire({
        title: 'Preview your file',
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
              <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
              <img id="filePreview" src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">
              <br>
              <button id="changeImageBtn" style="  margin-top: 15px;
    padding: 10px 18px;
    cursor: pointer;
    background-color:#074173;
    color: white;
    font-size: 16px;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    transition: background-color 0.3s, transform 0.2s;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);">Change Image</button>
              <input type="file" id="fileInput" style="display: none;" accept="image/*">
            </div>
          `,
        showCancelButton: true,
        confirmButtonText: 'Confirm!',
        cancelButtonText: 'Cancel',
        didOpen: () => {
          // Attach the change image functionality to the button
          const changeImageBtn = document.getElementById('changeImageBtn');
          const fileInput = document.getElementById('fileInput');
          const filePreview = document.getElementById('filePreview');

          changeImageBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger file input click
          });

          // When a new file is selected
          fileInput.addEventListener('change', (event) => {
            const newFile = event.target.files[0];
            if (newFile) {
              selectedFile = newFile; // Update the selected file
              const newFileReader = new FileReader();
              newFileReader.onload = (e) => {
                filePreview.src = e.target.result; // Update preview
              };
              newFileReader.readAsDataURL(newFile);
            }
          });
        }
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
              const newFormErrors = [...doctformErrors];
              if (newFormErrors[index]?.file) {
                delete newFormErrors[index].file;
              }
              setDoctFormErrors(newFormErrors);
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

  const handleDeleteDoctImage = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = [];
    setDocuments(updatedDocuments);
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

    setDoctFormErrors(errors);
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
      setValue("PDState", "");
      setValue("PDCity", "");
    }
  }, [PrintCountry]);

  useEffect(() => {
    if (PrintState !== branchDetailsData?.data?.addresses?.primary?.state) {
      setValue("PDCity", "");
    }
  }, [PrintState]);

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
                  } cursor-pointer`}
              >
                {step === 3 && (
                  <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
                )}
                <span className="text-sm font-semibold">Bank</span>
              </button>
            </div>
            {step === 1 && (
              <>
                {" "}
                <div className="grid  grid-cols-1 md:grid-cols-2">
                  <div>
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

                        {/* <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Status<span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDBranchStatus")}
                        className={` ${inputClassName} ${errors.PDBranchStatus
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                      >
                        <option className="" value="">
                          Select Status
                        </option>
                        <option className="" value={true}>
                          Active
                        </option>
                        <option className="" value={false}>
                          InActive
                        </option>
                      </select>

                      {errors.PDBranchStatus && (
                        <p className="text-red-500 text-sm">
                          {errors.PDBranchStatus.message}
                        </p>
                      )}
                    </div> */}

                        {userType === "admin" && <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Company <span className="text-red-600">*</span>
                          </label>
                          <select
                            disabled
                            {...register("PDCompanyId")}
                            className={`${inputDisabledClassName}  ${errors.PDCompanyId
                              ? "border-[1px] "
                              : "border-gray-300"
                              } `}
                          // onFocus={handleFocusCompany}
                          >
                            <option
                              value={branchDetailsData?.data?.companyData?._id}
                            >
                              {branchDetailsData?.data?.companyData?.fullName}
                            </option>
                          </select>
                          {errors.PDCompanyId && (
                            <p className="text-red-500 text-sm">
                              {errors.PDCompanyId.message}
                            </p>
                          )}
                        </div>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                        <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Branch Head <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("PDBranchHead", {
                              required: "Branch Head is required",
                            })}
                            className={` ${inputClassName} ${errors.PDBranchHead
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Branch Head"
                          />
                          {errors.PDBranchHead && (
                            <p className="text-red-500 text-sm">
                              {errors.PDBranchHead.message}
                            </p>
                          )}
                        </div>
                        {/* <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Remark <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("PDRemark", {
                              required: "Remark is required",
                            })}
                            className={` ${inputClassName} ${errors.PDRemark
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
                        <div className="flex gap-3">
                          <div className="w-[150px]">
                            <label className={`${inputLabelClassName}`}>
                              Code <span className="text-red-600">*</span>
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
                              <p
                                className={`${inputerrorClassNameAutoComplete}`}
                              >
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

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
                        <div>
                          <div className={`${inputLabelClassName}`}>
                            Country <span className="text-red-600">*</span>
                          </div>
                          <Controller
                            control={control}
                            name="PDcountry"
                            rules={{ required: "Country is required" }}
                            render={({ field }) => (
                              <AutoComplete
                                {...field}
                                onChange={(value) => {
                                  // Directly handle country change by using setValue from React Hook Form
                                  field.onChange(value); // Update the value in the form control
                                }}
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
                                  className={`${inputClassName} ${errors.PDcountry
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              </AutoComplete>
                            )}
                          />
                          {errors.PDcountry && (
                            <p className={`${inputerrorClassNameAutoComplete}`}>
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
                                {...field}
                                className="w-full"
                                onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
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
                                        stateName: PrintState,
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
                            <p className={`${inputerrorClassNameAutoComplete}`}>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3"></div>
                    </div>
                    <div className="flex justify-between px-3 pb-2">
                      <button
                        type="Submit"
                        className={`${formButtonClassName}`}
                      >
                        Submit Details
                      </button>
                    </div>
                  </div>
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
              <div>
                <div className=" rounded-md ">
                  {documents.map((document, index) => (
                    <div
                      className="border border-gray-300 rounded-md my-2"
                      key={index}
                    >
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold">
                          {" "}
                          Document {index + 1}
                        </div>
                        <div className="flex justify-end items-end">
                        
                          <button
                            type="button"
                            onClick={() => handleDelete(document, index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <AiFillDelete size={20} className="m-2" />
                          </button>
                       
                        <button
                                                  type="button"
                                                  onClick={() => handleEditButton(index)}
                                                  
                                                  className='text-white'
                                                >
                                                  {document?.isEditable ? <TbEditOff size={20} className="m-2"/> : <LiaEditSolid  size={20} className="m-2" /> }
                                                </button>
                        </div>
                      </div>

                      <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3">
                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Document Type{" "}
                            <span className="text-red-600">*</span>
                          </label>


                          <Select
                          disabled={!document.isEditable}
                            value={document.documentType}
                            className={` ${inputAntdSelectClassName} ${errors.documentType ? "border-[1px] " : "border-gray-300"}`}
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

                          {doctformErrors[index]?.documentType && (
                            <p className="text-red-600 text-sm">
                              {doctformErrors[index].documentType}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Document No <span className="text-red-600">*</span>
                          </label>
                          <input
                          disabled={!document.isEditable}
                            type="text"
                            value={document.documentNo}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "documentNo",
                                e.target.value
                              )
                            }
                            className={`${!document?.isEditable ? inputDisabledClassName : inputClassName} ${doctformErrors[index]?.documentNo
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Document No"
                          />
                          {doctformErrors[index]?.documentNo && (
                            <p className="text-red-600 text-sm">
                              {doctformErrors[index].documentNo}
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
                              disabled={!document.isEditable}
                              id={`documentUpload${index}`}
                              className="hidden"
                              onChange={(e) =>
                                handleFileChange(index, e.target.files[0])
                              }
                            />
                            <br />
                            <label
                              htmlFor={`documentUpload${index}`}
                              className={`${document?.isEditable ? 'bg-header' :'bg-gray-400'} text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer`}
                            >
                              Upload
                            </label>
                          </div>
                          {document?.file?.length > 0
                            ? document.file.map((file, fileIndex) => (
                              <div key={fileIndex} className="relative">
                                <CommonImageViewer
                                  // key={index}
                                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                                  alt={`Uploaded ${fileIndex + 1}`}
                                  className="w-20 h-20 shadow rounded-sm"
                                />
                                <button
                                disabled={!document.isEditable}
                                className={`absolute -top-1 -right-2 ${document?.isEditable ?'bg-red-600' :'bg-gray-400'} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}
                                  onClick={() => handleDeleteDoctImage(index, file)}
                                >
                                  ✕
                                </button>
                              </div>

                            ))
                            : null}
                          {doctformErrors[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {doctformErrors[index].file}
                            </p>
                          )}
                        </div>

                        {/* <div className="px-3 gap-4 items-end mb-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(document, index)}
                          className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                        </button>
                      </div> */}
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
            {step === 3 && (
              <div>
                <div className="rounded-md">
                  {banks.map((bank, index) => (
                    <div
                      className="border border-gray-300 rounded-md my-2"
                      key={index}
                    >
                      <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                        <div className="px-3 py-2 text-white font-semibold">
                          {" "}
                          Bank Document {index + 1}
                        </div>
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleBankDelete(bank, index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <AiFillDelete size={20} className="m-2" />
                          </button>
                        )}
                      </div>
                      <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3">
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Account Holder Name{" "}
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
                            className={`${inputClassName} ${formErrors[index]?.bankholderName
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Account Holder name"
                          />
                          {formErrors[index]?.bankholderName && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].bankholderName}
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
                            className={`${inputAntdSelectClassName} ${formErrors[index]?.bankName
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
                          {formErrors[index]?.bankName && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].bankName}
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
                            className={`${inputClassName} ${formErrors[index]?.branchName
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Branch name"
                          />
                          {formErrors[index]?.branchName && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].branchName}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Account Number
                            <span className="text-red-600">*</span>
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
                            className={`${inputClassName} ${formErrors[index]?.accountNumber
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter Account Number"
                          />
                          {formErrors[index]?.accountNumber && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].accountNumber}
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
                            className={`${inputClassName} ${formErrors[index]?.ifscCode
                              ? "border-[1px] "
                              : ""
                              }`}
                            placeholder="Enter IFSC Code"
                          />
                          {formErrors[index]?.ifscCode && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].ifscCode}
                            </p>
                          )}
                        </div>


                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Opening Balance                            
                          </label>
                          <input
                            type="number"
                            step="any"
                            value={bank?.openingBalance}
                           disabled={branchDetailsData?.data?.bankData?.find(el=>el?._id === bank?._id)?.openingBalance}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "openingBalance",
                                e.target.value
                              )
                            }
                             className={`${branchDetailsData?.data?.bankData?.find(el=>el?._id === bank?._id)?.openingBalance ? inputDisabledClassName : inputClassName} ${formErrors[index]?.openingBalance
                              ? "border-[1px] "
                              : ""
                              } `}
                            placeholder="Enter openingBalance "
                          />
                          {formErrors[index]?.openingBalance && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].openingBalance}
                            </p>
                          )}
                        </div>

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Account Type <span className="text-red-600">*</span>
                          </label>
                          {/* <select
                            value={bank.accountType}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "accountType",
                                e.target.value
                              )
                            }
                            className={`${inputClassName} ${formErrors[index]?.accountType
                              ? "border-[1px] "
                              : ""
                              }`}
                          >
                            <option value="">Select Account Type</option>
                            <option className="" value="saving">
                              Saving
                            </option>
                            <option className="" value="current">
                              Current
                            </option>
                            <option className="" value="Salary">
                              Salary
                            </option>
                            <option className="" value="Joint">
                              Joint
                            </option>
                          </select> */}
                          <Select
                            value={bank.accountType}
                            onChange={(e) =>
                              handleInputChangeBank(
                                index,
                                "accountType",
                                e
                              )
                            }
                            className={`${inputAntdSelectClassName} ${formErrors[index]?.accountType
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
                          {formErrors[index]?.accountType && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].accountType}
                            </p>
                          )}
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="file"
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
                              Upload
                            </label>
                          </div>
                          {bank?.file?.length > 0
                            ? bank.file.map((file, index) => (
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
                        </div> */}
                        <div className="flex items-center gap-2">
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Upload Image
                            </label>
                            <input
                              type="file"
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
                                  className="w-20 h-20 shadow rounded-sm"
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
                          {formErrors[index]?.file && (
                            <p className="text-red-600 text-sm">
                              {formErrors[index].file}
                            </p>
                          )}
                        </div>
                        {/* <div className="px-3 gap-4 items-end mb-3">
                        <button
                          type="button"
                          onClick={() => handleBankDelete(bank, index)}
                          className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                        >
                          <i className="fas fa-trash-alt flex items-center justify-center w-[25px] h-[25px]"></i>
                        </button>
                      </div> */}
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
          </form>
        </div>
      )}
    </GlobalLayout>
  );
};

export default MyBranchDetails;
