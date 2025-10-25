import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../component/Label/Label.js";
import InputBox from "../../component/InputBox/InputBox.js";
import CustomSelect from "../../component/CustomSelect/CustomSelect.js";
import { FaTimes } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout.js";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager.js";
import {
    getUserDetails, updateUser, setFieldsError, set, setFieldsUpdate, setKycDocs,
    setBankDetails,
    setPenalties,
    setSalaryAndLeaves,
    setCurrentAddress,
    setPermanentAddress,
    setFamilyInfo,
    setPlan,
    uploadDocFile
} from "./Features/_user_reducers.js";
import { decrypt } from "../../config/Encryption.js";
import { apiCallForm } from "../../config/Http.js";

const EditUser = () => {

    const [activeTab, setActiveTab] = useState('basic');

    const [sportId, setSportId] = useState(4);
    const [size, setSize] = useState(10);
    const [pageNo, setPageNo] = useState(1);
    const [keyWord, setKeyword] = useState("");
    const [decisionType, setDecisionType] = useState("");
    const [isTeamData, setIsTeamData] = useState(false);
    const [bankDetailsError, setBankDetailsError] = useState({});
    const [offset, setOffset] = useState(0);
    const [selectedIds, setSelectedIds] = useState([]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const { userId, marketId } = useParams();
    const { userIdEnc } = useParams();
    const userId = decrypt(userIdEnc);
    const { fieldsUpdate, fieldsError, loading, permanentAddress, currentAddress, bankDetails, kycDocs, salaryAndLeaves, penalties, familyInfo, plan } = useSelector((state) => state.user);
    
    const [errorMessages, setErrorMessages] = useState([]);

    // useEffect(() => {
    //     // Initialize error messages based on penalties length
    //     setErrorMessages(penalties.map(() => ({ penaltyType: "", amount: "" })));
    // }, [penalties.length]);

    useEffect(() => {
        let reqData = {
            "id": userId
        }
        dispatch(getUserDetails(reqData));
    }, [dispatch]);

    const inputChangeUser = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setFieldsUpdate({ ...fieldsUpdate, [name]: value }));
    };
    const inputChangeBankDetails = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setBankDetails({ ...bankDetails, [name]: value }));
    };

    const inputChangePermanentAddress = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setPermanentAddress({ ...permanentAddress, [name]: value }));
    };

    const inputChangeCurrentAddress = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setCurrentAddress({ ...currentAddress, [name]: value }));
    };

    const inputChangeSalaryAndLeaves = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setSalaryAndLeaves({ ...salaryAndLeaves, [name]: value }));
    };

    const inputChangeFamilyInfo = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setFamilyInfo({ ...familyInfo, [name]: value }));
    };
    const inputChangePlan = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        dispatch(setPlan({ ...plan, [name]: value }));
    };

    const userUpdateSubmit = () => {
        if (handleValidationUserUpdate()) {
            let reqData = {
                "id": userId,

                "date": fieldsUpdate.date,
                "dateOfBirth": fieldsUpdate.dateOfBirth,
                "dateOfJoining": fieldsUpdate.dateOfJoining,
                "dateOfLeaving": fieldsUpdate.dateOfLeaving,
                "department": fieldsUpdate.department,
                "departmentId": fieldsUpdate.departmentId,
                "employCode": fieldsUpdate.employCode,
                "landLineNumber": fieldsUpdate.landLineNumber,
                "lastLogin": fieldsUpdate.lastLogin,
                "alternateEmailAddress": fieldsUpdate.alternateEmailAddress,

                "username": fieldsUpdate.username,
                "name": fieldsUpdate.name,
                "password": fieldsUpdate.password,
                "userType": fieldsUpdate.userType,
                "mobile": fieldsUpdate.mobile,
                "email": fieldsUpdate.email,
                "status": fieldsUpdate.status,
                "alternateMobileNumber": fieldsUpdate.alternateMobileNumber,

                "permanentAddress": permanentAddress,
                "currentAddress": currentAddress,
                "bankDetails": bankDetails,
                "kycDocs": kycDocs,
                "salaryAndLeaves": salaryAndLeaves,
                "penalties": penalties,
                "familyInfo": familyInfo
            }
            dispatch(updateUser(reqData));
        }
    }

    const handleValidationUserUpdate = () => {
        let fieldsError = {};
        let formIsValid = true;

        // name
        if (!fieldsUpdate["name"] || fieldsUpdate["name"] === "") {
            formIsValid = false;
            fieldsError["name"] = "Cannot be empty";
        }

        dispatch(setFieldsError({ ...fieldsError, fieldsError }));
        return formIsValid;
    }

    const handleInputChangeDoc = (event, index) => {
        const { name, value } = event.target;
        const updatedDocs = kycDocs.map((doc, idx) =>
            idx === index ? { ...doc, [name]: value } : doc
        );
        dispatch(setKycDocs(updatedDocs));
    };


    const handleAddDocument = () => {
        dispatch(setKycDocs([...kycDocs, { documentName: '', documentNumber: '', documentFile: null }]));
    };

    const handleClearDocuments = () => {
        dispatch(setKycDocs([{ documentName: '', documentNumber: '', documentFile: null }]));
    };

    const handleRemoveDocument = (index) => {
        const updatedDocs = [...kycDocs];
        updatedDocs.splice(index, 1);
        dispatch(setKycDocs(updatedDocs));
    };

  const handleInputPenalty = (event, index) => {
        const { name, value } = event.target;

        // Update penalties array with the new value
        const updatedPenalties = penalties.map((item, idx) =>
            idx === index ? { ...item, [name]: value } : item
        );
        dispatch(setPenalties(updatedPenalties));

        // Clear the specific field's error message when typing
        setErrorMessages((prevErrors) => {
            const updatedErrors = [...prevErrors];
            updatedErrors[index] = { ...updatedErrors[index], [name]: "" };
            return updatedErrors;
        });
    };
    


    const handleAddPenalty = () => {
        // Generate error messages for existing penalties
        const newErrorMessages = penalties.map((element) => {
            const errors = {};
            if (!element.penaltyType) errors.penaltyType = "Penalty Type is required.";
            if (!element.amount) errors.amount = "Amount is required.";
            return errors;
        });
    
        setErrorMessages(newErrorMessages);
    
        // Check if there are any errors
        const hasErrors = newErrorMessages.some((error) => Object.keys(error).length > 0);
        if (!hasErrors) {
            // If no errors, add a new penalty input
            const newPenalty = { penaltyType: "", amount: "" };
            dispatch(setPenalties([...penalties, newPenalty]));
        }
    };

    
    // Ensure penalties is always an array
    const safePenalties = Array.isArray(penalties) ? penalties : [];

    // Check if every penalty has both `penaltyType` and `amount` filled
    const isAddPenaltyDisabled = safePenalties.some(penalty => !penalty.penaltyType || !penalty.amount);


    const handleClearPenalty = () => {
        // Logic to clear all penalties
        dispatch(setPenalties([{ penaltyType: '', amount: '' }]));
        setErrorMessages([]);
    };

    const handleRemovePenalty = (index) => {
        // Logic to remove a penalty
        const updatedPenalties = penalties.filter((_, idx) => idx !== index);
        dispatch(setPenalties(updatedPenalties));

        // Update error messages to match the new length of penalties
        const updatedErrorMessages = errorMessages.filter((_, idx) => idx !== index);
        setErrorMessages(updatedErrorMessages);
    };

    const handleFileChange = async (event, index) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const fileData = await apiCallForm("POST", "/uploadImage", formData);
                showNotification({ message: fileData?.message, type: 'success' });
                const updatedDocs = [...kycDocs];
                updatedDocs[index].documentFile = `${fileData.data.imageName}`;
                dispatch(setKycDocs(updatedDocs));
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        } else {
            showNotification({ message: "Please select a valid file.", type: 'error' });
        }
    };

    return (
        <GlobalLayout>
            <div className="">
                <div className="bg-[#F3F3F4] border-[1px]  border-gray-300">
                    <div className="md:h-screen bg-gray-100 h-[100%] w-full lg:px-4 px-2 pb-20">
                        <div className="bg-white mt-4 py-2 px-1 lg:space-y-4">

                            <div className="overflow-x-auto md:flex grid grid-cols-1 space-x-4 border-b pb-2">
                                <button
                                    onClick={() => setActiveTab('basic')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'basic' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Basic Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('personalInfo')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'personalInfo' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Personal Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('familyInfo')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'familyInfo' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Family Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('contactInfo')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'contactInfo' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Contact Info
                                </button>
                                <button
                                    onClick={() => setActiveTab('bankDetails')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'bankDetails' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Bank Details
                                </button>
                                <button
                                    onClick={() => setActiveTab('kycDocs')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'kycDocs' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Kyc Docs
                                </button>
                                <button
                                    onClick={() => setActiveTab('salaryAndLeaves')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'salaryAndLeaves' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Salary And Leaves
                                </button>
                                <button
                                    onClick={() => setActiveTab('penalties')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'penalties' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Penalties
                                </button>
                                <button
                                    onClick={() => setActiveTab('plan')}
                                    className={`px-4 py-2 whitespace-nowrap ${activeTab === 'plan' ? 'border-b-2 border-blue-500' : ''}`}>
                                    Plan
                                </button>
                            </div>

                            <div className="w-full px-2 py-4">
                                {activeTab === 'basic' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                        {/* Basic Info */}
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Name"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.name} errorData={fieldsError?.name} type={"text"} title={"name"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Password"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.password} errorData={fieldsError?.password} type={"text"} title={"password"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"UserType"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.userType} errorData={fieldsError?.userType} type={"text"} title={"userType"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Mobile"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.mobile} errorData={fieldsError?.mobile} type={"number"} title={"mobile"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Email"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.email} errorData={fieldsError?.email} type={"email"} title={"email"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Status"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.status} errorData={fieldsError?.status} type={"number"} title={"status"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Group Type"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.groupType} errorData={fieldsError?.groupType} type={"text"} title={"groupType"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Organization"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.organization} errorData={fieldsError?.organization} type={"text"} title={"organization"} />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Industry"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.industry} errorData={fieldsError?.industry} type={"text"} title={"industry"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"PAN Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.panNumber} errorData={fieldsError?.panNumber} type={"text"} title={"panNumber"} />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Aadhar Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.aadharNumber} errorData={fieldsError?.aadharNumber} type={"text"} title={"aadharNumber"} />
                                        </div>

                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"GST Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.gstNumber} errorData={fieldsError?.gstNumber} type={"text"} title={"gstNumber"} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'personalInfo' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Mobile Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.mobile} errorData={fieldsError?.mobile} type={"number"} title={"mobile"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Landline Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.landLineNumber} errorData={fieldsError?.landLineNumber} type={"number"} title={"landLineNumber"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Email Address"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.email} errorData={fieldsError?.email} type={"text"} title={"email"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Email Address2"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.alternateEmailAddress} errorData={fieldsError?.alternateEmailAddress} type={"text"} title={"alternateEmailAddress"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Date of Birth"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.dateOfBirth} errorData={fieldsError?.dateOfBirth} type={"date"} title={"dateOfBirth"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Date of Joining"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.dateOfJoining} errorData={fieldsError?.dateOfJoining} type={"date"} title={"dateOfJoining"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Date of Leaving"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.dateOfLeaving} errorData={fieldsError?.dateOfLeaving} type={"date"} title={"dateOfLeaving"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Alternate Mobile Number"} />
                                            <InputBox inputChange={inputChangeUser} fieldData={fieldsUpdate?.alternateMobileNumber} errorData={fieldsError?.alternateMobileNumber} type={"number"} title={"alternateMobileNumber"} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'familyInfo' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                   
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Father Name"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.fatherName} errorData={fieldsError?.fatherName} type={"text"} title={"fatherName"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Father Mobile Number"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.fatherMobileNumber} errorData={fieldsError?.fatherMobileNumber} type={"number"} title={"fatherMobileNumber"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Mother Name"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.motherName} errorData={fieldsError?.motherName} type={"text"} title={"motherName"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Mother Mobile Number"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.motherMobileNumber} errorData={fieldsError?.motherMobileNumber} type={"number"} title={"motherMobileNumber"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Guardian Name"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.guardianName} errorData={fieldsError?.guardianName} type={"text"} title={"guardianName"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Relation"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.relation} errorData={fieldsError?.relation} type={"text"} title={"relation"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Guardian Mobile Number"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.guardianMobileNumber} errorData={fieldsError?.guardianMobileNumber} type={"number"} title={"guardianMobileNumber"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Guardian2 Name"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.guardianName2} errorData={fieldsError?.guardianName2} type={"text"} title={"guardianName2"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Relation"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.relation2} errorData={fieldsError?.relation2} type={"text"} title={"relation2"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Guardian2 Mobile Number"} />
                                            <InputBox inputChange={inputChangeFamilyInfo} fieldData={familyInfo?.guardianMobileNumber2} errorData={fieldsError?.guardianMobileNumber2} type={"number"} title={"guardianMobileNumber2"} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'contactInfo' && (
                                    <div className="w-full">
                                        <div className="w-full">
                                            <div className="flex flex-col w-full">
                                                <Label isImp={true} title={"Address1"} />
                                                <InputBox inputChange={inputChangePermanentAddress} fieldData={permanentAddress?.address1} errorData={fieldsError?.address1} type={"text"} title={"branchName"} />
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <Label isImp={true} title={"Address2"} />
                                                <InputBox inputChange={inputChangePermanentAddress} fieldData={permanentAddress?.address2} errorData={fieldsError?.address2} type={"number"} title={"branchContact"} />
                                            </div>
                                            <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"State"} />
                                                    <InputBox inputChange={inputChangePermanentAddress} fieldData={permanentAddress?.state} errorData={fieldsError?.state} type={"number"} title={"branchContact"} />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"City"} />
                                                    <InputBox inputChange={inputChangePermanentAddress} fieldData={permanentAddress?.city} errorData={fieldsError?.city} type={"number"} title={"branchContact"} />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"Pin Number"} />
                                                    <InputBox inputChange={inputChangePermanentAddress} fieldData={permanentAddress?.pinNumber} errorData={fieldsError?.pinNumber} type={"number"} title={"branchContact"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <div className="flex flex-col w-full">
                                                <Label isImp={true} title={"Address1"} />
                                                <InputBox inputChange={inputChangeCurrentAddress} fieldData={currentAddress?.address1} errorData={fieldsError?.address1} type={"text"} title={"branchName"} />
                                            </div>
                                            <div className="flex flex-col w-full">
                                                <Label isImp={true} title={"Address2"} />
                                                <InputBox inputChange={inputChangeCurrentAddress} fieldData={currentAddress?.address2} errorData={fieldsError?.address2} type={"number"} title={"branchContact"} />
                                            </div>
                                            <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"State"} />
                                                    <InputBox inputChange={inputChangeCurrentAddress} fieldData={currentAddress?.state} errorData={fieldsError?.state} type={"number"} title={"branchContact"} />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"City"} />
                                                    <InputBox inputChange={inputChangeCurrentAddress} fieldData={currentAddress?.city} errorData={fieldsError?.city} type={"number"} title={"branchContact"} />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"Pin Number"} />
                                                    <InputBox inputChange={inputChangeCurrentAddress} fieldData={currentAddress?.pinNumber} errorData={fieldsError?.pinNumber} type={"number"} title={"branchContact"} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'bankDetails' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Account Number "} />
                                            <InputBox inputChange={inputChangeBankDetails} fieldData={bankDetails?.accountNumber} errorData={bankDetailsError?.accountNumber} type={"number"} title={"accountNumber"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Account Holder "} />
                                            <InputBox inputChange={inputChangeBankDetails} fieldData={bankDetails?.accountHolder} errorData={bankDetailsError?.accountHolder} type={"text"} title={"accountHolder"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Bank Name"} />
                                            <InputBox inputChange={inputChangeBankDetails} fieldData={bankDetails?.bankName} errorData={bankDetailsError?.bankName} type={"text"} title={"bankName"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Branch Name "} />
                                            <InputBox inputChange={inputChangeBankDetails} fieldData={bankDetails?.branchName} errorData={bankDetailsError?.branchName} type={"text"} title={"branchName"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"IFSC Code "} />
                                            <InputBox inputChange={inputChangeBankDetails} fieldData={bankDetails?.ifscCode} errorData={bankDetailsError?.ifscCode} type={"text"} title={"ifscCode"} />
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'kycDocs' && (
                                    <div className='space-y-2'>
                                        {kycDocs.map((element, index) => (
                                            <div key={index} className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"Document Name"} />
                                                    <input className="border p-2 focus:outline-none text-sm text-black w-full"
                                                        type="text"
                                                        name="documentName"
                                                        value={element?.documentName}
                                                        onChange={(event) => handleInputChangeDoc(event, index)}
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"Document Number"} />
                                                    <input className="border p-2 focus:outline-none text-sm text-black w-full"
                                                        type="text"
                                                        name="documentNumber"
                                                        value={element?.documentNumber}
                                                        onChange={(event) => handleInputChangeDoc(event, index)}
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full">
                                                    <Label isImp={true} title={"Document File"} />
                                                    <div className='flex space-x-2 items-start'>
                                                        <input className="border p-1 focus:outline-none text-sm text-black w-full"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(event) => handleFileChange(event, index)}
                                                        />
                                                        {index !== 0 && (
                                                            <button className="px-2 py-1 cursor-pointer bg-red-500 text-white" type="button" onClick={() => handleRemoveDocument(index)}>
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                    {element?.documentFile && <span className='h-16 w-32 rounded'>{element?.documentFile}</span>}
                                                </div>
                                            </div>
                                        ))}
                                        {kycDocs && kycDocs[0]?.documentFile ? (
                                            <div className='flex space-x-2'>
                                                <button className="rounded-none cursor-pointer btn btn-type" type="button" onClick={handleAddDocument}>
                                                    Add Document
                                                </button>
                                                <button className="rounded-none cursor-pointer btn btn-type" type="button" onClick={handleClearDocuments}>
                                                    Clear All Documents
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="rounded-none cursor-pointer btn btn-type" type="button" onClick={handleAddDocument}>
                                                Add Document
                                            </button>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'salaryAndLeaves' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                        {/* familyInfo */}
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Monthly Salary"} />
                                            <InputBox inputChange={inputChangeSalaryAndLeaves} fieldData={salaryAndLeaves?.monthlySalary} errorData={fieldsError?.monthlySalary} type={"number"} title={"monthlySalary"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Late Deduction"} />
                                            <InputBox inputChange={inputChangeSalaryAndLeaves} fieldData={salaryAndLeaves?.lateDeduction} errorData={fieldsError?.lateDeduction} type={"number"} title={"lateDeduction"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Time In"} />
                                            <InputBox inputChange={inputChangeSalaryAndLeaves} fieldData={salaryAndLeaves?.timeIn} errorData={fieldsError?.timeIn} type={"text"} title={"timeIn"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Time Out"} />
                                            <InputBox inputChange={inputChangeSalaryAndLeaves} fieldData={salaryAndLeaves?.timeOut} errorData={fieldsError?.timeOut} type={"text"} title={"timeOut"} />
                                        </div>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Leaves"} />
                                            <InputBox inputChange={inputChangeSalaryAndLeaves} fieldData={salaryAndLeaves?.leaves} errorData={fieldsError?.leaves} type={"number"} title={"leaves"} />
                                        </div>
                                    </div>
                                )}

                                {
                                    activeTab === 'penalties' && (
                                        <div className='space-y-2'>
                                            {penalties.map((element, index) => (
                                                <div key={index} className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-5 gap-8'>
                                                    <div className="flex flex-col w-full col-span-2">
                                                        <Label isImp={true} title={"Penalty Type Id"} />
                                                        <input
                                                            className="border p-2 focus:outline-none text-sm text-black w-full"
                                                            type="text"
                                                            name="penaltyType"
                                                            value={element?.penaltyType || ""}
                                                            onChange={(event) => handleInputPenalty(event, index)}
                                                        />
                                                        {errorMessages[index]?.penaltyType && (
                                                            <p className="text-red-500 text-sm mt-1">{errorMessages[index].penaltyType}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col w-full col-span-2">
                                                        <Label isImp={true} title={"Amount"} />
                                                        <input
                                                            className="border p-2 focus:outline-none text-sm text-black w-full"
                                                            type="number"
                                                            name="amount"
                                                            value={element?.amount || ""}
                                                            onChange={(event) => handleInputPenalty(event, index)}
                                                        />
                                                        {errorMessages[index]?.amount && (
                                                            <p className="text-red-500 text-sm mt-1">{errorMessages[index].amount}</p>
                                                        )}
                                                    </div>
                                                    {index !== 0 && (
                                                        <div className="flex flex-col col-span-1 justify-center mt-4 w-full">
                                                            <button
                                                                className="px-2 py-1 cursor-pointer bg-red-500 w-fit rounded-[6px] h-[38px] text-white"
                                                                type="button"
                                                                onClick={() => handleRemovePenalty(index)}
                                                            >
                                                                <MdDeleteForever className="w-[24px] h-[24px]" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            <div className='flex space-x-2 mt-4'>
                                                <button
                                                    className="bg-header rounded-[6px] btn btn-type py-[4px] px-[14px] text-white text-[14px] font-[500]"
                                                    type="button"
                                                    onClick={handleAddPenalty}
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    className="rounded-[6px] bg-red-600 btn btn-type py-[4px] px-[14px] text-white text-[14px] font-[500]"
                                                    type="button"
                                                    onClick={handleClearPenalty}
                                                >
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    )
                                }

                                {activeTab === 'plan' && (
                                    <div className='w-full grid-cols-1 grid md:grid-cols-2 lg:grid-cols-2 gap-8'>
                                        <div className="flex flex-col w-full">
                                            <Label isImp={true} title={"Plan Name"} />
                                            <InputBox inputChange={inputChangePlan} fieldData={plan?.palnName} errorData={fieldsError?.palnName} type={"text"} title={"palnName"} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-2 flex justify-start items-center mt-0">
                                <button
                                    onClick={userUpdateSubmit}
                                    className="bg-[#23c6c8] text-sm font-[500] py-[4px] px-[20px] rounded-[6px] text-white cursor-pointer whitespace-nowrap border-[1px] border-[#23c6c8] hover:bg-[#21b9bb]">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GlobalLayout>
    )
}

export default EditUser