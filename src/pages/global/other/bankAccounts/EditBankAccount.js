import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";

import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { fileUploadFunc } from "../fileManagement/FileManagementFeatures/_file_management_reducers";
import { getbankAccountDetails, updatebankAccount } from "./bankAccountFeature/_bank_account_reducers";
import Swal from "sweetalert2";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import { Select } from "antd";


const EditBankAccount = () => {
  const { loading: bankLoading } = useSelector(
    (state) => state.bankAccount
  );
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bankAccountIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const bankAccountId = decrypt(bankAccountIdEnc);
  const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { bankAccountDetails } = useSelector(
    (state) => state.bankAccount
  );

  useEffect(() => {
    let reqData = {
      _id: bankAccountId,
    };
    dispatch(getbankAccountDetails(reqData));
  }, []);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });

  const handleBankFileChange = (file) => {
    if (!file) return;
    const isPdf = file?.type === 'application/pdf';
    const filePreviewUrl = URL?.createObjectURL(file); // Generate preview URL for non-PDF files

    // Show SweetAlert confirmation before uploading
    Swal.fire({
      title: 'Preview your file',
      html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                ${isPdf
          ? `<p style="font-size: 16px; color: #074173;">${file?.name}</p>`
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
            setValue('fileUplaod', data?.payload?.data);

            // Show success message after upload
            Swal.fire({
              icon: 'success',
              title: 'Uploaded!',
              text: 'Your file has been successfully uploaded.',
              timer: 2000,
              showConfirmButton: false
            });
          }
        });
      } else {

      }
    });
  };

  useEffect(() => {
    if (bankAccountDetails) {
      setValue("holderName", bankAccountDetails?.bankholderName);
      setValue("accountNumber", bankAccountDetails?.accountNumber);
      setValue("ifscCode", bankAccountDetails?.ifscCode);
      setValue("bankName", bankAccountDetails?.bankName);
      setValue("branchName", bankAccountDetails?.branchName);
      setValue("accountType", bankAccountDetails?.accountType);
      setValue("fileUplaod", bankAccountDetails?.filePath[0]);
      setValue("fileUpload", bankAccountDetails?.filePath[0]);
      setValue("PDBranchId", bankAccountDetails?.branchId);
      setValue("status", bankAccountDetails?.status ? "true" : "false");
    }
  }, [bankAccountDetails])
  const onSubmit = (data) => {
    const finalPayload = {
      _id: bankAccountId,
      companyId: bankAccountDetails?.companyId,
      directorId: bankAccountDetails?.directorId,
      branchId: bankAccountDetails?.branchId,
      "bankholderName": data?.holderName,
      "bankName": data?.bankName,
      "accountNumber": data?.accountNumber,
      "ifscCode": data?.ifscCode,
      "accountType": data?.accountType,
      "branchName": data?.branchName,
      status: data?.status === 'true' ? true : false,
      "filePath": [
        data?.fileUplaod
      ]
    };

    dispatch(updatebankAccount(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  return (
    <GlobalLayout>
      <div className="mt-2">

        <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2">

            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select> */}
              <Controller
                control={control}
                name="PDCompanyId"
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Company</Select.Option>
                    {companyListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : companyList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.PDCompanyId && (
                <p className="text-red-500 text-sm">
                  {errors.PDCompanyId.message}
                </p>
              )}
            </div>}

            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("PDBranchId", {
                  required: "Branch is required",
                })}
                className={` ${inputClassName} ${errors.PDBranchId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Branch
                </option>
                {branchList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select> */}
              <Controller
                name="PDBranchId"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Branch"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (branchList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>}

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Bank Holder Name <span className="text-red-600">*</span>
              </label>
              <input
                className={`${inputClassName}`}
                placeholder="Enter Bank Holder Name"
                name="holderName"
                {...register("holderName", {
                  required: " Bank Holder Name is required",
                })}
              />
              {errors.holderName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.holderName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                className={`${inputClassName}`}
                placeholder="Enter Bank  Name"
                name="bankName"
                {...register("bankName", {
                  required: " Bank  Name is required",
                })}
              />
              {errors.bankName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch Name <span className="text-red-600">*</span>
              </label>
              <input
                className={`${inputClassName}`}
                placeholder="Enter Branch  Name"
                name="branchName"
                {...register("branchName", {
                  required: " Branch  Name is required",
                })}
              />
              {errors.branchName && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.branchName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                className={`${inputClassName}`}
                placeholder="Enter Account  Number"
                name="accountNumber"
                type="number"
                {...register("accountNumber", {
                  required: " Account Number is required",
                  minLength: {
                    value: 6,
                    message: "Account number must be at least 6 characters long"
                  },
                  maxLength: {
                    value: 18,
                    message: "Account number must not exceed 18 characters"
                  },
                })}
              />
              {errors.accountNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                IFSC Code <span className="text-red-600">*</span>
              </label>
              <input
                className={`${inputClassName}`}
                placeholder="Enter IFSC Code"
                name="ifscCode"
                {...register("ifscCode", {
                  required: "IFSC Code is required",
                  pattern: {
                    value: ifscPattern,
                    message: "Invalid IFSC code. Example: SBIN0001234",
                  }
                })}
              />
              {errors.ifscCode && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.ifscCode.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Account Type <span className="text-red-600">*</span>
              </label>
              <select

                className={`${inputClassName} `}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
                {...register("accountType", {
                  required: " Account Type is required",
                })}
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
              </select>
              {errors.accountType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.accountType.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Status"
                  >
                    <Select.Option value="true">Active</Select.Option>
                    <Select.Option value="false">In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>

            <div className="flex items-center gap-2 ">
              <div>
                <label className={`${inputLabelClassName}`}>
                  Upload <span className="text-red-600">*</span>
                </label>

                <Controller
                  name="fileUpload"
                  control={control}
                  rules={{ required: "File upload is required" }}
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                          field.onChange(e); // Pass the file to React Hook Form
                          handleBankFileChange(e?.target?.files[0]); // Custom file handling function
                        }}
                      />
                      <br />
                      <label
                        htmlFor="file-upload"
                        className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                      >
                        Upload
                      </label>
                      {errors.fileUpload && (
                        <p className="text-red-600 text-sm mt-1">{errors.fileUpload.message}</p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Check if file is valid and then render the image */}
              {watch('fileUplaod') ? (
                <img
                  src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('fileUplaod')}`}
                  alt="Uploaded"
                  className="w-20 h-20 shadow rounded-sm"
                />
              ) : null}
            </div>

          </div>

          <div className="flex justify-end items-center">
            <button
              type="submit"
              disabled={bankLoading}
              className={`${bankLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 mt-4 ml-4 px-4 rounded`}
            >
              {bankLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditBankAccount;
