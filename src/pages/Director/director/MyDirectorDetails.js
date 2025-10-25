import { useEffect, useRef, useState } from "react";
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
  inputAntdSelectClassName,
} from "../../../constents/global.js";
import getUserIds from '../../../constents/getUserIds';
import { FaCamera, FaUserAlt } from "react-icons/fa";
import { AiFillDelete, AiFillInstagram } from "react-icons/ai";
import { IoLogoFacebook } from "react-icons/io";
import { TbEditOff, TbWorld } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager.js";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption.js";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import { empDoctSearch, getEmployeeDocument } from "../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import Loader from "../../../global_layouts/Loader/Loader.js";
import { LiaEditSolid } from "react-icons/lia";
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
import { AutoComplete, Input, Select } from "antd";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker.js";
import Swal from "sweetalert2";
import { ProfileImageUpdate } from "../../../redux/_reducers/_auth_reducers.js";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import ListLoader from "../../../global_layouts/ListLoader.js";

const MyDirectorDetails = () => {
  const directorId = JSON.parse(localStorage.getItem(`user_info_${domainName}`))?._id;
  const fileInputRefs = useRef([]);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [newStep, setnewStep] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);

  const [banks, setBanks] = useState([1]);
  const [documents, setDocuments] = useState([
    { id: 1, documentType: "", documentNo: "", file: [],isEditable:false },
  ]);
  
  const handleEditButton = (index) => {
    setDocuments((prevDocuments) =>
      prevDocuments.map((doc, i) =>
      i === index ? { ...doc, isEditable: !doc.isEditable } : doc
      )
    );
    
  };

  const handleDeleteDoctImage = (index, file) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index].file = [];
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
    setDocuments(updatedDocuments);
  };
 
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

  const { countryListData,loading:countryListLoading } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { employeeDocumentList ,loading:employeListLoading } = useSelector(
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
    userType
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
      const documentData = directorDetailsData?.data?.documentData?.length ? directorDetailsData?.data?.documentData?.map(
        (document) => {
          return {
            _id: document?._id,
            documentType: document?.name,
            documentNo: document?.number,
            file: document?.filePath,
            isEditable: false,
          };
        }
      ): [
            {
              _id: '',
              documentType: "",
              documentNo: "",
              file: [],
              isEditable: true,
            },
          ];
    
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
      setValue("PDCity",  directorDetailsData?.data?.addresses?.primary?.city);
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
    setDocuments([...documents, { id: Date.now() , isEditable:true}]);

  };

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
            "_id": directorId,
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
            pinCode: data?.PDSecondaryPinCode ?? ""
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
            setnewStep(null)
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
            pinCode: data?.PDSecondaryPinCode ?? ""
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
        // if (!data.error) {
        //   newStep && setStep(newStep);
        //   setnewStep(null)
        // }
      });
    }
  };

  const navTabClick = async (clickedStep) => {
    setStep(step => clickedStep);

  };

  useEffect(() => {
    if ( (step === 2 || step === 3)) {
               dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
    }
  }, [dispatch,  step]);

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
              <div className="text-base font-medium overflow-auto mx-2 text-center mt-2 text-header capitalize">
                {PrintDirectorName ? PrintDirectorName : "Director Name"}
              </div>
              <div className="border mx-2 px-2 my-2 py-3 rounded-lg ">
                <div className="">
                  <label className={`${inputLabelClassName}`}>Address</label>
                  <div
                    className={`mt-1 block w-full overflow-auto px-2 py-[9px] shadow-sm rounded-lg text-xs  bg-[#f4f6f9] focus:outline-none cursor-default min-h-8`}
                  >
                    {PrintAddress && (
                      <>
                        {PrintAddress}, {" "}
                      </>
                    )}
                    {PrintCity && (
                      <>
                        {PrintCity} ,{" "}
                      </>
                    )}
                    {PrintState && (
                      <>
                        {PrintState} ,{" "}
                      </>
                    )}
                    {PrintCountry && (
                      <>
                        {PrintCountry} ,{" "}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3">
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Director Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("PDDirectorName", {
                          required: "Director Name is required",
                        })}
                        className={`placeholder: ${inputClassName} ${errors.PDDirectorName
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Director Name"
                      />
                      {errors.PDDirectorName && (
                        <p className="text-red-500 text-sm">
                          {errors.PDDirectorName.message}
                        </p>
                      )}
                    </div>


                    {/* {userType === "admin" && <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Company<span className="text-red-600">*</span>
                      </label>
                      <select
                        disabled
                        {...register("PDCompanyId", {
                          required: "Company is required",
                        })}
                        className={`${inputDisabledClassName}  ${errors.PDCompanyId
                          ? "border-[1px] "
                          : "border-gray-300"
                          } `}
                      // onFocus={handleFocusCompany}
                      >
                        {!companyList?.length ? (
                          <option value={directorDetailsData?.data?.companyData?._id}>
                            {directorDetailsData?.data?.companyData?.fullName || "Loading..."}
                          </option>
                        ) : (
                          <>
                            <option value="">Select Company</option>
                            {companyList.map((type) => (
                              <option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                      {errors.PDCompanyId && (
                        <p className="text-red-500 text-sm">
                          {errors.PDCompanyId.message}
                        </p>
                      )}
                    </div>} */}


                    {/* <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Status<span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("PDStatus")}
                        className={` ${inputClassName} ${errors.PDStatus ? "border-[1px] " : "border-gray-300"
                          }`}
                      >
                        <option value="">Select Status</option>
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                      {errors.PDStatus && (
                        <p className="text-red-500 text-sm">
                          {errors.PDStatus.message}
                        </p>
                      )}
                    </div> */}
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
                            notFoundContent={countryListLoading && <ListLoader/>}
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

                    {/* Pin Code Field */}
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
                          name="PDMobileCode"
                          rules={{ required: "code is required" }}
                          render={({ field }) => (
                            <CustomMobileCodePicker
                            field={field}
                              errors={errors} 
                            />
                          )}
                        />

                        {/* <select
                            {...register("PDMobileCode", {
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
                              errors.PDMobileCode
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
                        {errors[`PDMobileCode`] && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors[`PDMobileCode`].message}
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
                    Submit Details
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="rounded-md">
                  {documents.map((document, index) => (
                     <div className="border border-gray-300 rounded-md my-2" key={index}>
                     <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                       <div className="px-3 py-2 text-white font-semibold">  Document {index + 1}</div>
                       <div className="flex  justify-end items-end">
                      
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
                                                {document?.isEditable ? <TbEditOff  size={20} className="m-2"/> : <LiaEditSolid  size={20} className="m-2" /> }
                                              </button>
                       </div>
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
                          disabled={!document?.isEditable}  
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
                            {employeListLoading ? <Select.Option disabled>
                                                      <ListLoader />
                                                    </Select.Option> :(employeeDocumentList
                              ?.filter((data) => data?.type === "General")
                              
                              .map((type) => (
                                <Select.Option key={type.name} value={type.name}>
                                  {type.name}
                                </Select.Option>
                              )))}

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
                        disabled={!document?.isEditable}  
                          type="text"
                          value={document.documentNo}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "documentNo",
                              e.target.value
                            )
                          }
                          className={`${!document?.isEditable ? inputDisabledClassName :inputClassName} ${formErrors[index]?.documentNo
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
                            Upload <span className="text-red-600">*</span>
                          </label>
                          <input
                          disabled={!document?.isEditable}  
                            type="file"
                            id={`documentUpload${index}`}
                            className="hidden"
                            ref={(el) => (fileInputRefs.current[index] = el)}
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
                        {/* {document?.file?.length > 0
                          ? document.file.map((file, index) => (
                            <CommonImageViewer
                              key={index}
                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                              alt={`Uploaded ${index + 1}`}
                   
                            />
                          ))
                          : null} */}
                          {document?.file?.length > 0
                                                      ? document.file.map((file, fileIndex) => (
                                                          <div key={fileIndex} className="relative">
                                                            <CommonImageViewer
                                                              // key={index}
                                                              src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${file}`}
                                                              alt={`Uploaded ${fileIndex + 1}`}
                                                            />
                                                            <button
                                                            disabled={!document.isEditable}
                                                              className={`absolute -top-1 -right-2 ${document?.isEditable ?'bg-red-600' :'bg-gray-400'} text-white rounded-full w-5 h-5 flex items-center justify-center text-xs`}
                                                              onClick={() =>
                                                                handleDeleteDoctImage(index, file)
                                                              }
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

export default MyDirectorDetails;
