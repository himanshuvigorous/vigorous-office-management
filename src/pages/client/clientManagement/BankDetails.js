import { useEffect, useState } from "react";
import { formButtonClassName, inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global"
import { useDispatch, useSelector } from "react-redux";
import { deleteDocument, fileUploadFunc, updateDocument } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { AiFillDelete } from "react-icons/ai";
import { Select } from "antd";
import { banknameSearch } from "../../global/other/bankname/bankNameFeatures/_bankName_reducers.js";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer.js";
import Swal from "sweetalert2";
import Loader from "../../../global_layouts/Loader.js";



function BankDetails({ clientData, fetchData }) {
    const [banks, setBanks] = useState([1]);
    const handleBankAddMore = () => {
        setBanks([...banks, { id: Date.now() }]);
    };
    const { bankNameListData,bankNameLoading } = useSelector((state) => state.bankname);
    const { loadingUpdateFile } = useSelector((state) => state.fileUpload);
    const [formErrors, setFormErrors] = useState([]);
    const dispatch = useDispatch();
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

        const isPdf = file.type === 'application/pdf';
        const filePreviewUrl = URL.createObjectURL(file); // Create preview URL for non-PDF files
    
        // Show SweetAlert confirmation before uploading
        Swal.fire({
            title: 'Preview your file',
            html: `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                    <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                    ${
                        isPdf
                            ? `<p style="font-size: 16px; color: #074173;">${file.name}</p>`
                            : `<img src="${filePreviewUrl}" alt="File Preview" style="max-width: 100%; max-height: 300px; width: auto; height: auto;">`
                    }
                    <br>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Confirm!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with file upload only if the user confirms
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
                        setBanks(updatedBanks);
    
                        // Remove error if it exists
                        const newFormErrors = [...formErrors];
                        if (newFormErrors[index]?.file) {
                            delete newFormErrors[index].file;
                        }
                        setFormErrors(newFormErrors);
                    }
                });
            } else {
            }
        });
    };
    
    useEffect(() => {
        dispatch(banknameSearch({ isPagination: false, text: "", sort: true, status: true }));
    }, [])
    const handleBankDelete = (bank, index) => {
        if (bank?._id) {
            dispatch(deleteDocument({ _id: bank?._id })).then((data) => {
                if (!data.error) {
                    fetchData()

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
            //     error.file = "Bank file is required.";
            // }
            if (Object.keys(error).length > 0) {
                errors[index] = error;
            }
        });

        setFormErrors(errors);
        return errors.every((error) => Object.keys(error).length === 0);
    };


    useEffect(() => {
        if (clientData) {
            const bankData = clientData?.data?.bankData?.length
                ? clientData?.data?.bankData.map((bank) => ({
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
        }
    }, [clientData])

    const onSubmit = async (e) => {
        e.preventDefault();
        if (validateBankForm()) {
            const bankPayload = banks.map((bank, index) => {
                if (bank?._id) {
                    return {
                        userId: clientData?.data?._id,
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
                        userId: clientData?.data?._id,
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
                    fetchData()
                }

            });
        }
    }
    const handleDeleteBankImage = (index, file) => {
        const updatedBanks = [...banks];
        updatedBanks[index].file = [];
        setBanks(updatedBanks);
    };

    return (
        <form autoComplete="off" onSubmit={onSubmit}>
            <div className="rounded-md">
                {banks.map((bank, index) => (
                    <div key={index} className="border border-gray-300 rounded-md my-2">
                        <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                            <div className="px-3 py-2 text-white font-semibold">Bank Document {index + 1}</div>
                            <button
                                type="button"
                                onClick={() => handleBankDelete(bank, index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <AiFillDelete size={20} className="m-2" />
                            </button>
                        </div>
                        <div
                            key={index}
                            className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3"
                        >
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
                                    {bankNameLoading? <Select.Option disabled>
                  <Loader/>
                 </Select.Option>:(sortByPropertyAlphabetically(bankNameListData)?.map((data) => (
                                        <Select.Option key={data.name} value={data.name}>
                                            {data.name}
                                        </Select.Option>
                                    )))}
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
                                    className={`${inputClassName} ${formErrors[index]?.ifscCode ? "border-[1px] " : ""
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

                                    defaultValue={""}
                                    // onFocus={() => {
                                    //   dispatch(
                                    //     branchSearch({
                                    //       text: "",
                                    //       sort: true,
                                    //       status: true,
                                    //       companyId:
                                    //         userInfoglobal?.userType === "admin"
                                    //           ? CompanyId
                                    //           : userInfoglobal?.userType === "company"
                                    //             ? userInfoglobal?._id
                                    //             : userInfoglobal?.companyId,
                                    //     })
                                    //   );
                                    // }}
                                    className={`${inputAntdSelectClassName} `}

                                    value={bank.accountType}
                                    onChange={(value) =>
                                        handleInputChangeBank(
                                            index,
                                            "accountType",
                                            value
                                        )
                                    }
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
        </form>
    )
}

export default BankDetails
