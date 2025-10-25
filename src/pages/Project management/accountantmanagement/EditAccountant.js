import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useEffect, useRef, useState } from "react";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { Select, Spin } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";
import {  getAccountantDetails, updateAccountantFunc } from "./accountManagentFeatures/_accountManagement_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { AiFillDelete } from "react-icons/ai";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import Swal from "sweetalert2";
import CommonImageViewer from "../../../global_layouts/ImageViewrModal/CommonImageViewer";
import { decrypt } from "../../../config/Encryption";
import { banknameSearch } from "../../global/other/bankname/bankNameFeatures/_bankName_reducers";

function EditAccountant() {

  const { accountantDetailsData, loading } = useSelector((state) => state.accountManagement);
  const {accountantIdEnc} = useParams();
  const { bankNameListData ,bankNameLoading} = useSelector((state) => state.bankname);
  const decryptedId = decrypt(accountantIdEnc);
  const {
   
    handleSubmit,
    setValue, 
 
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      bank: [
        {
          type: "",
          bankholderName: "",
          bankName: "",
          accountNumber: "",
          ifscCode: "",
          accountType: "",
          branchName: "",
          file: [],
        },
      ],
    },
  });
  const bankFileRefs = useRef([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "bank",
    defaultValue: [
      {
        type: "",
        bankholderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountType: "",
        branchName: "",
        file: [],
      },
    ],
  });
  const fileInputRefs = useRef([]);
  const bankfileRefs = useRef([]);
  const [banks, setBanks] = useState([1]);
  const handleDeleteBankImage = (index, file) => {
    const updatedBanks = [...banks];
    updatedBanks[index] = '';
    bankfileRefs.current[index].value = "";
    setBanks(updatedBanks);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );


  const { employeList, loading: employeListLoading } = useSelector(
    (state) => state.employe
  );
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });


  useEffect(()=>{
    dispatch(getAccountantDetails({_id: decryptedId}))
  },[])

    useEffect(() => {
      const fetchData = async () => {
        try {       
          await dispatch(
            banknameSearch({
              isPagination: false,
              text: "",
              sort: true,
              status: true,
            })
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }, []);


  useEffect(()=>{
    if(accountantDetailsData){
      setValue("employee",accountantDetailsData?.userId)
      setValue("PDCompanyId",accountantDetailsData?.companyId)
      setValue("PDBranchId",accountantDetailsData?.branchId)
      setValue("bank",accountantDetailsData?.bankAccountData)
      setBanks(accountantDetailsData?.bankAccountData?.map((bank)=>bank?.filePath[0]))
    }
  },[accountantDetailsData])

  const handleBankFileChange = (index, file) => {
    if (!file) return;

    let selectedFile = file;

    const fileReader = new FileReader();
    let filePreviewUrl = "";

    fileReader.onload = (e) => {
      filePreviewUrl = e.target.result;

      const isPdf = file.type === "application/pdf";

      Swal.fire({
        title: "Preview your file",
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
        confirmButtonText: "Confirm!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(
            fileUploadFunc({
              filePath: selectedFile,
              isVideo: false,
              isMultiple: false,
            })
          ).then((res) => {
            if (!res.error) {
              const uploadedFilePath = res?.payload?.data; 
              const updatedBanks = [...banks];
              updatedBanks[index] = uploadedFilePath;
              setBanks(updatedBanks);
              bankfileRefs.current[index].value = "";
             
              
              setValue(`bank.${index}.filePath`, [uploadedFilePath]);
          
            
       
            }
          })
        } else {
        }
      });
    };

    fileReader.readAsDataURL(file);
  };

  console.log(banks)

  useEffect(() => {
    fetchEmployeListData();
  }, [userInfoglobal?.companyId, branchId]);

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: "",
      designationId: "",
      companyId:
        userInfoglobal?.userType === "admin"
          ? userInfoglobal?.companyId
          : userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company"
          ? branchId
          : userInfoglobal?.branchId,
          isBranch: true,
          isDirector: true,
    };

    dispatch(employeSearch(reqPayload));
  };


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

  const onSubmit = (data) => {
    console.log(data);
    const finalPayload = {
      _id: accountantDetailsData?._id,
      companyId:
        userInfoglobal?.userType === "admin"
          ? data?.PDCompanyId
          : userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      directorId:
        userInfoglobal?.userType === "companyDirector"
          ? userInfoglobal?._id
          : userInfoglobal?.directorId,
      branchId: accountantDetailsData?.branchId,        
      userId: data.employee,
      bank: data.bank?.map((bank,index) => ({
        ...bank,
        filePath: [banks[index]],
      })),
    };

    dispatch(updateAccountantFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-5 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            
            <div className="">
              <label className={`${inputLabelClassName}`}>
                User Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="employee"
                control={control}
                rules={{
                  required: "Employee Name is required",
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` ${inputAntdSelectClassName}`}
                    placeholder="Select Employee "
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Employee </Select.Option>
                    {employeListLoading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      sortByPropertyAlphabetically(
                        employeList,
                        "fullName"
                      )?.map((element, index) => (
                        <Select.Option key={index} value={element?._id}>
                          {element?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>
          </div>

          {fields?.map((bank, index) => (
            <div
              className="border border-gray-300 rounded-md my-2"
              key={bank?.id}
            >
              <div className="flex justify-between items-center mb-4 bg-header rounded-t-md">
                <div className="px-3 py-2 text-white font-semibold">
                  {" "}
                  Bank Document {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    remove(index);
                    handleDeleteBankImage(index);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <AiFillDelete size={20} className="m-2" />
                </button>
              </div>
              <div className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 mb-3">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Holder Name <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={`bank.${index}.bankholderName`}
                    control={control}
                    rules={{
                      required: "Account Holder Name is required",
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        value={field.value}
                        className={`${inputClassName} ${
                          bank?.bankholderName ? "border-[1px]" : ""
                        }`}
                        placeholder="Enter Account Holder name"
                      />
                    )}
                  />
                  {errors.bank?.[index]?.bankholderName && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.bankholderName.message}
                    </p>
                  )}
                </div>

                
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                     Type <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name={`bank.${index}.type`}
                    control={control}
                    rules={{
                      required: "Type is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        className={`${inputAntdSelectClassName} ${
                          errors.bank?.[index]?.type
                            ? "border-[1px] "
                            : ""
                        }`}
                      >
                        <Select.Option value="">
                          Select Account Type
                        </Select.Option>
                        <Select.Option className="" value="company">
                        Company
                        </Select.Option>
                        <Select.Option className="" value="individual">
                        Individual
                        </Select.Option>                      
                      </Select>
                    )}
                  />
                  {errors.bank?.[index]?.type && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.type.message}
                    </p>
                  )}
                </div>

                 <div className="w-full">
                                 <label className={`${inputLabelClassName}`}>
                                   Bank Name <span className="text-red-600">*</span>
                                 </label>
                                 <Controller
                                   name={`bank.${index}.bankName`}
                                   control={control}
                                   rules={{
                                     required: "Bank Name is required",
                                   }}
                                   render={({ field }) => (
                                     <Select
                                       {...field}
                                       value={field.value}
                                       className={`${inputAntdSelectClassName} ${
                                         errors.bank?.[index]?.bankName
                                           ? "border-[1px] "
                                           : ""
                                       }`}
                                     >
                                       <Select.Option value="">
                                         Select Bank Name
                                       </Select.Option>
                                       {bankNameLoading ? <Select.Option disabled>
                                         <ListLoader />
                                       </Select.Option> : (sortByPropertyAlphabetically(bankNameListData, 'name')?.map((data) => (
                                         <Select.Option key={data.name} value={data.name}>
                                           {data.name}
                                         </Select.Option>
                                       )))}
                                     </Select>
                                   )}
                                 />
                                 {errors.bank?.[index]?.bankName && (
                                   <p className="text-red-600 text-sm">
                                     {errors.bank[index]?.bankName.message}
                                   </p>
                                 )}
                                      
                               
                               
                              
                               </div>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Branch Name <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={`bank.${index}.branchName`}
                    control={control}
                    rules={{
                      required: "Branch Name is required",
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        value={field.value}
                        className={`${inputClassName} ${
                          bank?.branchName ? "border-[1px]" : ""
                        }`}
                        placeholder="Enter Branch name"
                      />
                    )}
                  />
                  {errors.bank?.[index]?.bankholderName && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.bankholderName.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Number
                    <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={`bank.${index}.accountNumber`}
                    control={control}
                    rules={{
                      required: "Account Number is required",
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        value={field.value}
                        className={`${inputClassName} ${
                          bank?.accountNumber ? "border-[1px]" : ""
                        }`}
                        placeholder="Enter Account Number"
                      />
                    )}
                  />
                  {errors.bank?.[index]?.accountNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.accountNumber.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    IFSC Code<span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name={`bank.${index}.ifscCode`}
                    control={control}
                    rules={{
                      required: "IFSC Code is required",
                      validate: (value) => {
                        const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
                        return ifscPattern.test(value) || "Invalid IFSC code. Example: SBIN0001234";
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        {...field}
                        value={field.value}
                        className={`${inputClassName} ${
                          bank?.ifscCode ? "border-[1px]" : ""
                        }`}
                        placeholder="Enter IFSC Code"
                      />
                    )}
                  />
                  {errors.bank?.[index]?.ifscCode && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.ifscCode.message}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Account Type <span className="text-red-600">*</span>
                  </label>

                  <Controller
                    name={`bank.${index}.accountType`}
                    control={control}
                    rules={{
                      required: "Account Type is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value}
                        className={`${inputAntdSelectClassName} ${
                          errors.bank?.[index]?.accountType
                            ? "border-[1px] "
                            : ""
                        }`}
                      >
                        <Select.Option value="">
                          Select Account Type
                        </Select.Option>
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
                    )}
                  />
                  {errors.bank?.[index]?.accountType && (
                    <p className="text-red-500 text-sm">
                      {errors.bank[index]?.accountType.message}
                    </p>
                  )}
                </div>

              <div className="flex items-center gap-2">
                                        <div>
                                          <label className={`${inputLabelClassName}`}>
                                            Upload Document
                                          </label>
                                          <input
                                            type="file"
                                            ref={(el) => (bankfileRefs.current[index] = el)}
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
                                            Upload
                                          </label>
                                        </div>
                                        {banks[index] && banks.length > 0 && banks.length-1 >=index && (
                
                                                  <div className="relative">
                                                  <CommonImageViewer
                                                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${banks[index]}`}
                                                  
                                                  />
                                                  <button
                                                      type="button"
                                                      className="absolute -top-1 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                                      onClick={() => handleDeleteBankImage(index)}
                                                  >
                                                      ✕
                                                  </button>
                                                  </div>
                                              )}
              
                                        {banks[index]?.file && (
                                          <p className="text-red-600 text-sm">
                                            {banks[index].file}
                                          </p>
                                        )}
                                      </div>
      
              </div>
            </div>
          ))}
          <div className="flex justify-between px-3 pb-2">
            <button
              type="button"
              onClick={() => append({})}
              className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
            >
              Add More
            </button>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              className={`bg-header text-white p-2 px-4 rounded mt-3`}
              disabled={loading}
            >
              {loading ? <Spin />  : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default EditAccountant;
