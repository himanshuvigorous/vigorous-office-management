import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputerrorClassNameAutoComplete, inputLabelClassName, optionLabelForBankSlect } from "../../../../constents/global";
import { branchSearch, getBranchDetails } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { AutoComplete, Image, Input, Select } from "antd";
import { citySearch } from "../../address/city/CityFeatures/_city_reducers";
import { stateSearch } from "../../address/state/featureStates/_state_reducers";
import { countrySearch } from "../../address/country/CountryFeatures/_country_reducers";
import BranchDetails from "../../../client/clientManagement/BranchDetails";
import { fileUploadFunc } from "../fileManagement/FileManagementFeatures/_file_management_reducers";
import { createofficeAddress } from "./officeAddressFeature/_office_address_reducers";
import ReactQuill from "react-quill";
import CustomMobileCodePicker from "../../../../global_layouts/MobileCode/MobileCodePicker";
import Swal from "sweetalert2";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";


const CreateOfficeAddress = () => {
  const headerRef = useRef([])
  const footerRef = useRef([])
  const { loading: officeAddressLoading } = useSelector(
    (state) => state.officeAddress
  );
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [editorValue, setEditorValue] = useState(``);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const { branchDetailsData, loading: bankListLoading } = useSelector((state) => state.branch);


  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "bankAccountId": data?.PDBankId,
      "address": {
        "street": data?.PDAddress,
        "city": data?.PDCity,
        "state": data?.PDState,
        "country": data?.PDCountry,
        "pinCode": data?.PDPinCode
      },
      "type": "invoice",
      "firmName": data?.PDfirmName,
      "tagName": data?.PDTagName,
      "mobile": {
        "code": data?.PDMobileCode,
        "number": data?.PDMobileNo
      },
      prefix: data?.PDPrefix,
      startInvoiceCount: data?.startInvoiceCount,
      "email": data?.PDEmail,
      "gstNumber": data?.PDGstNumber,
      "panNumber": data?.PDPanNumber,
      "designation": data?.PDDesignation,
      "headerImage": data?.headerfileUplaodLink,
      "signatureImage": data?.footerfileUplaodLink,
      "signatureName": data?.PDSignatureAuthority,
      prefix: data?.PDPrefix,
      isGSTEnabled: data?.isGstEnabled === "true" ? true : false,
      upiId: data?.upiId,
      termsAndCond: editorValue,
      "invoiceName": data?.invoiceName,
    "receiptName": data?.receiptName,
    "advanceName": data?.advanceName

    };
    dispatch(createofficeAddress(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])
  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (BranchId || (userInfoglobal?.userType !== "company" && userInfoglobal?.userType !== "companyDirector" && userInfoglobal?.userType !== "admin")) {
      dispatch(getBranchDetails({
        _id: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "admin" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId
      }))
    }
  }, [BranchId])
  const handleHeaderFileChange = (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const filePreviewUrl = URL.createObjectURL(file); // Generate preview URL for non-PDF files

    // Show SweetAlert confirmation before uploading
    Swal.fire({
      title: 'Preview your file',
      html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                ${isPdf
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
            setValue('headerfileUplaodLink', data?.payload?.data);
          }
        }).then(() => {
          if (headerRef.current) headerRef.current.value = ''
        })
      } else {
          if (headerRef.current) headerRef.current.value = ''
      }
    });
  };

  const handleFooterFileChange = (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    const filePreviewUrl = URL.createObjectURL(file); // Generate preview URL for non-PDF files

    // Show SweetAlert confirmation before uploading
    Swal.fire({
      title: 'Preview your file',
      html: `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                <p style="margin-bottom: 20px;">Do you want to upload this file?</p>
                ${isPdf
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
            setValue('footerfileUplaodLink', data?.payload?.data);
          }
        }).then(() => {
          if (footerRef.current) footerRef.current.value = ''
        })
      } else {
          if (footerRef.current) footerRef.current.value = ''
      }
    });
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
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
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Branch"
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
                Bank<span className="text-red-600">*</span>
              </label>
              {/* <select

                {...register("PDBankId",)}
                className={`${inputClassName}  ${errors.PDBankId
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
              // onFocus={handleFocusCompany}
              >

                <option value=''>
                  select bank
                </option>
                {
                  branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                  branchDetailsData.data.bankData.map((type) => (
                    <option key={type._id} value={type._id}>
                      {`${type.bankName} (${type.branchName})`}

                    </option>
                  ))
                }
              </select> */}
              <Controller
                name="PDBankId"
                control={control}
                rules={{ required: "Bank is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDBankId ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select BANK"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Bank</Select.Option>
                    {
                      bankListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> :
                        (branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                          branchDetailsData.data.bankData.map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                              {/* {`${type.bankName} (${type.branchName})`} */}
 {optionLabelForBankSlect(type)}
                            </Select.Option>
                          )))
                    }
                  </Select>
                )}
              />
              {errors.PDBankId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBankId.message}
                </p>
              )}
            </div>
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Type<span className="text-red-600">*</span>
              </label>
            
             
              <Controller
                name="PDType"
                control={control}
                rules={{ required: "PDType is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDType ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select PDType"
                  >
                    <Select.Option value=''>
                      select Type
                    </Select.Option>
                    <Select.Option value='invoice'>
                      Invoice
                    </Select.Option>
                    <Select.Option value='receipt'>
                      Receipt
                    </Select.Option>
                  </Select>
                )}
              />
              {errors.PDType && (
                <p className="text-red-500 text-sm">
                  {errors.PDType.message}
                </p>
              )}
            </div> */}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Firm Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("PDfirmName", {
                  required: "Firm Name is required",

                })}
                className={` ${inputClassName} ${errors.PDfirmName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Firm Name"
              />
              {errors.PDfirmName && (
                <p className="text-red-500 text-sm">
                  {errors.PDfirmName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Tag Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("PDTagName", {
                  required: "Tag Name is required",

                })}
                className={` ${inputClassName} ${errors.PDTagName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Tag Name"
              />
              {errors.PDTagName && (
                <p className="text-red-500 text-sm">
                  {errors.PDTagName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                invoice Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("invoiceName", {
                  required: "invoice Name is required",

                })}
                className={` ${inputClassName} ${errors.invoiceName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter invoice Name"
              />
              {errors.invoiceName && (
                <p className="text-red-500 text-sm">
                  {errors.invoiceName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                receipt Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("receiptName", {
                  required: "receipt Name is required",

                })}
                className={` ${inputClassName} ${errors.receiptName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter receipt Name"
              />
              {errors.receiptName && (
                <p className="text-red-500 text-sm">
                  {errors.receiptName.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                advance Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("advanceName", {
                  required: "advance Name is required",

                })}
                className={` ${inputClassName} ${errors.advanceName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter advance Name"
              />
              {errors.advanceName && (
                <p className="text-red-500 text-sm">
                  {errors.advanceName.message}
                </p>
              )}
            </div>
            <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Invoice Prefix<span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("PDPrefix", {
                              required: "Invoice Prefix is required",
            
                            })}
                            className={` ${inputClassName} ${errors.PDPrefix ? "border-[1px] " : "border-gray-300"
                              }`}
                            placeholder="Enter Invoice Prefix"
                          />
                          {errors.PDPrefix && (
                            <p className="text-red-500 text-sm">
                              {errors.PDPrefix.message}
                            </p>
                          )}
                        </div>
            <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Start Invoice Count<span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            {...register("startInvoiceCount", {
                              required: "Start Invoice Count is required",
            
                            })}
                            className={` ${inputClassName} ${errors.startInvoiceCount ? "border-[1px] " : "border-gray-300"
                              }`}
                            placeholder="Enter Start Invoice Count"
                          />
                          {errors.startInvoiceCount && (
                            <p className="text-red-500 text-sm">
                              {errors.startInvoiceCount.message}
                            </p>
                          )}
                        </div>
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
                Pan Number<span className="text-red-600">*</span>
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
                className={` ${inputClassName} ${errors.PDPanNumber ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Pan Number"
              />
              {errors.PDPanNumber && (
                <p className="text-red-500 text-sm">
                  {errors.PDPanNumber.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Upi Id<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("upiId", {
                  required: "Upi Id is required",

                })}
                className={` ${inputClassName} ${errors.upiId ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Upi Id"
              />
              {errors.upiId && (
                <p className="text-red-500 text-sm">
                  {errors.upiId.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Designation<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("PDDesignation", {
                  required: "Designation is required",

                })}
                className={` ${inputClassName} ${errors.PDDesignation ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Designation"
              />
              {errors.PDDesignation && (
                <p className="text-red-500 text-sm">
                  {errors.PDDesignation.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                SignatureAuthority Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("PDSignatureAuthority", {
                  required: "Signature Authority is required",

                })}
                className={` ${inputClassName} ${errors.PDSignatureAuthority ? "border-[1px] " : "border-gray-300"
                  }`}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
                placeholder="Enter SignatureAuthority"
              />
              {errors.PDSignatureAuthority && (
                <p className="text-red-500 text-sm">
                  {errors.PDSignatureAuthority.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Gst Enabled</label>
              <select
                {...register("isGstEnabled", {
                })}
                className={`${inputClassName} bg-white ${errors.isGstEnabled ? "border-[1px] " : "border-gray-300"
                  } `}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
              {errors.isGstEnabled && (
                <p className="text-red-500 text-sm">
                  {errors.isGstEnabled.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
            
            <div>
              <label className={`${inputLabelClassName}`}>
                Header Upload 
              </label>

              <div className="flex flex-col">

                <Controller
                  name="headerfileUpload"
                  control={control}
                  accept="image/*"
                 
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        ref={headerRef}
                        id="file-upload"
                        className="hidden"
                        onChange={(e) => {
                          field.onChange(e);
                          handleHeaderFileChange(e.target.files[0]);
                        }}
                      />
                      <br />
                      <label
                        htmlFor="file-upload"
                        className="bg-header text-white  py-1.5 w-36 px-3 text-nowrap text-sm rounded cursor-pointer"
                      >
                        Header Upload
                      </label>
                      {errors.headerfileUpload && (
                        <p className="text-red-600 text-sm mt-1">{errors.headerfileUpload.message}</p>
                      )}
                    </>
                  )}
                />
                {watch('headerfileUplaodLink') &&
                  // <img
                  //   src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('headerfileUplaodLink')}`}
                  //   alt="Uploaded"
                  //   className="w-20 h-20 shadow rounded-sm"
                  // />
                  <Image
                    width={90}
                    height={90}
                    src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('headerfileUplaodLink')}`}
                    className="w-20 h-20 shadow rounded-sm"
                  />
                }

              </div>
            </div>


            <div>
              <label className={`${inputLabelClassName}`}>
                Signature Upload 
              </label>
              <div className="flex flex-col">
                <Controller
                  name="footerfileUpload"
                  control={control}
                  
                  render={({ field }) => (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="footer-file-upload"
                        ref={footerRef}
                        className="hidden"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFooterFileChange(e.target.files[0]);
                        }}
                      />
                      <br />
                      <label
                        htmlFor="footer-file-upload"
                        className="bg-header text-white  w-36  py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                      >
                        Footer Upload
                      </label>
                      {errors.footerfileUpload && (
                        <p className="text-red-600 text-sm mt-1">{errors.footerfileUpload.message}</p>
                      )}
                    </>
                  )}
                />
                {/* {watch('footerfileUplaodLink') && <img
                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('footerfileUplaodLink')}`}
                alt="Uploaded"
                className="w-20 h-20 shadow rounded-sm"
              />} */}

                {watch('footerfileUplaodLink') &&

                  <Image
                    width={90}
                    height={90}
                    src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('footerfileUplaodLink')}`}
                    className="w-20 h-20 shadow rounded-sm"
                  />
                }
              </div>
            </div>
          </div>
          <div className="mt-4 col-span-2">
            <ReactQuill
              value={editorValue}
              onChange={handleEditorChange}
              placeholder="Write the email body here"
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'align': [] }],
                  ['link', 'image', 'video'],
                  ['blockquote', 'code-block'],
                  ['clean']
                ],
              }}
              formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'clean']}
            />
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
                            countryName: watch('PDCountry'),
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
                            stateName: watch('PDState'),
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

          <div className="flex mt-4 justify-end">
            <button
              type="submit"
              disabled={officeAddressLoading}
              className={`${officeAddressLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {officeAddressLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateOfficeAddress;
