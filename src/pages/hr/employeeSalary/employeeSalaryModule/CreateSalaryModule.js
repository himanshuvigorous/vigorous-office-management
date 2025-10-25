import { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  domainName,
  formButtonClassName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
} from "../../../../constents/global";
import { useDispatch, useSelector } from "react-redux";
import { empDoctSearch, getEmployeeDocument } from "../../../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import {
  fileUploadFunc,
  updateDocument,
} from "../../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt, encrypt } from "../../../../config/Encryption";
import {
  employeSearch,
  getEmployeDetails,
} from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactSelect from "react-select";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { createEmployeeSalaryDetails } from "./employeeSalaryFeatures/_employee_salary_reducers";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { Select } from "antd";
import getUserIds from "../../../../constents/getUserIds";
function CreateSalaryModule() {
  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      documents: [{ documentType: "", documentNo: "", file: [] }],
      bank: [
        {
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
  const navigate = useNavigate();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState([]);
  const [imagePreviewBank, setImagePreviewBank] = useState([]);
  const { employeeDocumentList } = useSelector(
    (state) => state.employeeDocument
  );

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const IsPf = useWatch({
    control,
    name: "isPF",
    defaultValue: "",
  });
  const isESIC = useWatch({
    control,
    name: "isESIC",
    defaultValue: "",
  });
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const employeeId = useWatch({
    control,
    name: "PDEmployee",
    defaultValue: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(empDoctSearch({ isPagination:false, companyId:getUserIds()?.userCompanyId,}));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

 const navTabClick = (clickedStep) => {
   if(clickedStep !== 1){
    showNotification({
      message: "First submit General Details",
      type: 'error',
    });
   }   
  };
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "documents",
  });
  const {
    fields: bankFields,
    append: bankAppend,
    remove: bankRemove,
  } = useFieldArray({
    control,
    name: "bank",
  });

  const handleAddMore = () => {
    append({ documentType: "", documentNo: "", file: [] });
  };
  const handleAddMoreBank = () => {
    bankAppend({
      bankholderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      branchName: "",
      file: [],
    });
  };

  const handleDelete = (index) => {
    // Remove the document from the form state
    remove(index);

    // Remove the corresponding image preview from the state
    setImagePreview((prev) => {
      const newPreview = [...prev];
      newPreview.splice(index, 1); // Remove the image preview at the given index
      return newPreview;
    });
  };
  const handleDeleteBank = (index) => {
    // Remove the document from the form state
    bankRemove(index);

    // Remove the corresponding image preview from the state
    setImagePreviewBank((prev) => {
      const newPreview = [...prev];
      newPreview.splice(index, 1); // Remove the image preview at the given index
      return newPreview;
    });
  };

  const handleFileChange = (index, file) => {
    // File preview
    const fileUrl = URL.createObjectURL(file[0]);
    setImagePreview((prev) => {
      const newPreview = [...prev];
      newPreview[index] = fileUrl; // Store the preview URL
      return newPreview;
    });

    // Dispatch file upload
    dispatch(
      fileUploadFunc({
        filePath: file[0],
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        setValue(`documents.${index}.file`, data?.payload?.data);
      }
    });
  };

  const handleFileChangeBank = (index, file) => {
    // File preview
    const fileUrl = URL.createObjectURL(file[0]);
    setImagePreviewBank((prev) => {
      const newPreview = [...prev];
      newPreview[index] = fileUrl; // Store the preview URL
      return newPreview;
    });

    // Dispatch file upload
    dispatch(
      fileUploadFunc({
        filePath: file[0],
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        setValue(`bank.${index}.file`, data?.payload?.data);
      }
    });
  };
  const currentPackage = watch("currentPackage");

  // Logic to calculate currentSalary and perDaySalary based on currentPackage
  useEffect(() => {
    if (currentPackage) {
      // Calculate current salary and per day salary
      const calculatedSalary = currentPackage / 12; // assuming 12 months in a year
      const perDaySalary = calculatedSalary / 30; // assuming 30 days in a month

      setValue("currentSalary", calculatedSalary.toFixed(2));
      setValue("perDaySalary", perDaySalary.toFixed(2));
    }
  }, [currentPackage, setValue]);
  const onSubmit = (data) => {
    if (step === 1) {
      const finalPayload = {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId: data?.PDEmployee?.value,
        directorId: "",
        currentPackage: Number(data?.currentPackage),
        currentSalary: Number(data?.currentSalary),
        perDaySalary: Number(data?.perDaySalary),
        isESIC: data?.isESIC === 'true' ? true : false,
        esicNumber: (isESIC === 'true' || isESIC === true) ? data?.esicNumber : '',
        isPF:   data?.isPF === 'true' ? true : false ,
        uanNumber: data?.uanNumber,
        pfType: (IsPf === 'true' || IsPf === true) ? data?.pfType : '',
      };
      dispatch(createEmployeeSalaryDetails(finalPayload)).then((data) => {
        if (!data.error) {

          navigate(`/admin/employee-salary-list/edit/${encrypt(data?.payload?.data?._id)}`);
        }
      });
    }
    if (step === 3) {
      const documentPayload = data?.documents?.map((ele) => {
        return {
          userId: employeeId,
          ...ele,
        };
      });
      const finalPayload = {
        documents: documentPayload,
        userType: "employee",
        type: "documents",
      };

      dispatch(updateDocument(finalPayload));
    }

    if (step === 2) {
      const documentPayload = data?.bank?.map((ele) => {
        return {
          userId: employeeId,
          ...ele,
        };
      });
      const finalPayload = {
        documents: documentPayload,
        userType: "employee",
        type: "bank",
      };
 
      dispatch(updateDocument(finalPayload));
    }
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
          isPagination:false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
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
    if (
      (CompanyId || userInfoglobal?.userType !== "admin") &&
      (BranchId ||
        userInfoglobal?.userType !== "companBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchEmployeListData();
    }
  }, [CompanyId, BranchId]);

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
          ? CompanyId
          : userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" ||
        userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
    };

    dispatch(employeSearch(reqPayload));
    setValue("PDEmployee", "");
  };

  return (
    <GlobalLayout>
      <div className="flex bg-header justify-start items-center rounded-t-lg gap-5 px-3 pt-2 overflow-x-auto overflow-y-hidden text-nowrap">
        <button
          type="button"
          onClick={() => navTabClick(1)}
          className={`flex relative flex-col items-center pb-2 ${
            step === 1 ? "text-white" : "text-gray-500"
          } cursor-pointer`}
        >
          {step === 1 && (
            <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
          )}
          <span className="text-sm font-semibold text-nowrap">
            General Details
          </span>
        </button>
        <button
          type="button"
          onClick={() => navTabClick(2)}
          className={`flex relative flex-col items-center pb-2 ${
            step === 2 ? "text-white" : "text-gray-500"
          } cursor-pointer`}
        >
          {step === 2 && (
            <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
          )}
          <span className="text-sm font-semibold text-nowrap">
            Bank Details
          </span>
        </button>
        <button
          type="button"
          onClick={() => navTabClick(3)}
          className={`flex relative flex-col items-center pb-2 ${
            step === 3 ? "text-white" : "text-gray-500"
          } cursor-pointer`}
        >
          {step === 3 && (
            <div className="w-full h-3 bg-[#f4f6f9] absolute bottom-0 translate-y-1/2 rounded-2xl"></div>
          )}
          <span className="text-sm font-semibold text-nowrap">
            documents Details
          </span>
        </button>
      </div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
              {userInfoglobal?.userType === "admin" && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Company <span className="text-red-600">*</span>
                  </label>
                  {/* <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassName} ${
                      errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
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
                          // onFocus={() => {
                          //   dispatch(
                          //     companySearch({
                          //       text: "",
                          //       sort: true,
                          //       status: true,
                          //       isPagination: false,
                          //     })
                          //   );
                          // }}
                          className={`${inputAntdSelectClassNameFilter} `}
                        >
                          <Select.Option value="">Select Company</Select.Option>
                          {companyList?.map((type) => (
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
                </div>
              )}
              {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Branch <span className="text-red-600">*</span>
                  </label>
                  {/* <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassName} ${
                      errors.PDBranchId ? "border-[1px] " : "border-gray-300"
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
                                          control={control}
                                          name="PDBranchId"
                                          rules={{ required: "Branch is required" }}
                                          render={({ field }) => (
                                            <Select
                                              {...field}
                                              defaultValue={""}
                                              // onFocus={() => {
                                              //   dispatch(
                                              //     companySearch({
                                              //       text: "",
                                              //       sort: true,
                                              //       status: true,
                                              //       isPagination: false,
                                              //     })
                                              //   );
                                              // }}
                                              className={`${inputAntdSelectClassNameFilter} `}
                                            >
                                              <Select.Option value="">Select Branch</Select.Option>
                                              {branchList?.map((type) => (
                                                <Select.Option key={type?._id} value={type?._id}>
                                                  {type?.fullName}
                                                </Select.Option>
                                              ))}
                                            </Select>
                                          )}
                                        />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )}

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee</label>
                <Controller
                  name="PDEmployee"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={employeList?.map((employee) => ({
                        value: employee?._id,
                        label: employee?.fullName,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${
                        errors.employee ? "border-[1px] " : "border-gray-300"
                      }`}
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employee && (
                  <p className="text-red-500 text-sm">
                    {errors.employee.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Current Package (yearly) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("currentPackage", {
                    required: "Current Package is required",
                  })}
                  className={`${inputClassName} ${
                    errors.currentPackage ? "border-[1px] " : ""
                  }`}
                  placeholder="Enter Current Package"
                />
                {errors.currentPackage && (
                  <p className="text-red-600 text-sm">
                    {errors.currentPackage?.message}
                  </p>
                )}
              </div>

              {/* Current Salary */}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Current Salary (Monthly) <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("currentSalary")}
                  className={`${inputClassName} ${
                    errors.currentSalary ? "border-[1px] " : ""
                  }`}
                  placeholder="Current Salary"
                  disabled
                />
                {errors.currentSalary && (
                  <p className="text-red-600 text-sm">
                    {errors.currentSalary?.message}
                  </p>
                )}
              </div>

              {/* Per Day Salary */}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Per Day Salary <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("perDaySalary" ,)}
                  className={`${inputClassName} ${
                    errors.perDaySalary ? "border-[1px] " : ""
                  }`}
                  placeholder="Per Day Salary"
                  disabled
                />
                {errors.perDaySalary && (
                  <p className="text-red-600 text-sm">
                    {errors.perDaySalary?.message}
                  </p>
                )}
              </div>

              {/* ESIC Number */}
           

              {/* Is PF */}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Is ESIC <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("isESIC", { required: "PF status is required" })}
                  className={`${inputClassName} ${
                    errors.isESIC ? "border-[1px] " : ""
                  }`}
                >
                  <option value={''}>Select isESIC</option>
                  <option value={true}>True</option>
                  <option value={false}>False</option>
                </select> */}

<Controller
                                    name="isESIC"
                                    control={control}
                                    rules={{
                                      required: "isESIC  is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Select isESIC "
                                        showSearch
              
                                      >
                                        <Select.Option value="">Select IsESIC </Select.Option>
                                        <Select.Option value="true">True</Select.Option>
                                        <Select.Option value="false">False</Select.Option>                          
                                      </Select>
                                    )}
                                  />
                {errors.isESIC && (
                  <p className="text-red-600 text-sm">{errors.isESIC?.message}</p>
                )}
              </div>
              {(isESIC === 'true' || isESIC === true) && <div>
                <label className={`${inputLabelClassName}`}>
                  ESIC Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text" // Change to text to allow regex-based validation
                  {...register("esicNumber", {
                    required: "ESIC Number is required",  // Field is required
                    // pattern: {
                    //   value: /^\d{17}$/, // Regex for exactly 17 digits
                    //   message: "ESIC Number must be a 17-digit number", // Error message if pattern doesn't match
                    // },
                    // minLength: {
                    //   value: 17,  // Ensures that it has at least 17 characters
                    //   message: "ESIC Number must be exactly 17 digits long",  // Error message for min length
                    // },
                    // maxLength: {
                    //   value: 17,  // Ensures that it doesn't exceed 17 characters
                    //   message: "ESIC Number must be exactly 17 digits long",  // Error message for max length
                    // },
                  })}
                  className={`${inputClassName} ${
                    errors.esicNumber ? "border-[1px] " : ""
                  }`}
                  // maxLength={17}
                  // onInput={(e) => {
                  //   if (e.target.value.length > 17) {
                  //     e.target.value = e.target.value.slice(0, 17);
                  //   }
                  // }}
                  placeholder="Enter ESIC Number"
                />
                {errors.esicNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.esicNumber?.message}
                  </p>
                )}
              </div>}
              <div>
                <label className={`${inputLabelClassName}`}>
                  Is PF <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("isPF", { required: "PF status is required" })}
                  className={`${inputClassName} ${
                    errors.isPF ? "border-[1px] " : ""
                  }`}
                >
                  <option value={''}>Select isPF</option>
                  <option value='true'>True</option>
                  <option value='false'>False</option>
                </select> */}
                     <Controller
                                    name="isPF"
                                    control={control}
                                    rules={{
                                      required: "isPF is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Select isPF"
                                        showSearch
              
                                      >
                                        <Select.Option value="">Select Is PF</Select.Option>
                                        <Select.Option value="true">Active</Select.Option>
                                        <Select.Option value="false">Inactive</Select.Option>                          
                                      </Select>
                                    )}
                                  />
                {errors.isPF && (
                  <p className="text-red-600 text-sm">{errors.isPF?.message}</p>
                )}
              </div>

             {(IsPf === 'true' || IsPf === true) && <div>
                <label className={`${inputLabelClassName}`}>
                  PF Type <span className="text-red-600">*</span>
                </label>
                {/* <select
                  {...register("pfType", { required: "PF Type is required" })}
                  className={`${inputClassName} ${
                    errors.pfType ? "border-[1px] " : ""
                  }`}
                >
                  <option value="">Select PF Type</option>
                  <option value="fixed">Fixed (12%)</option>
                  <option value="basic">Variable</option>
                </select> */}

<Controller
                                    name="pfType"
                                    control={control}
                                    rules={{
                                      required: "pfType is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        placeholder="Select PF Type"
                                        showSearch
              
                                      >
                                        <Select.Option value="">Select PF Type</Select.Option>
                                        <Select.Option value="fixed">Fixed (12%)</Select.Option>
                                        <Select.Option value="basic">Variable</Select.Option>                          
                                      </Select>
                                    )}
                                  />
                {errors.pfType && (
                  <p className="text-red-600 text-sm">
                    {errors.pfType?.message}
                  </p>
                )}
              </div>}
              {(IsPf === 'true' || IsPf === true) &&
              <div>
                <label className={`${inputLabelClassName}`}>
                  UAN Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text" // Change to text to prevent issues with leading zeros in the number
                  {...register("uanNumber", {
                    required: "UAN Number is required", // Ensures UAN is provided
                    pattern: {
                      value: /^\d{12}$/, // Regex for exactly 12 digits
                      message: "UAN Number must be a 12-digit number", // Error message for invalid UAN number
                    },
                  })}
                  className={`${inputClassName} ${
                    errors.uanNumber ? "border-[1px] " : ""
                  }`}
                  placeholder="Enter UAN Number"
                   maxLength={12}
                  onInput={(e) => {
                    if (e.target.value.length > 12) {
                      e.target.value = e.target.value.slice(0, 12);
                    }
                  }}
                />
                {errors.uanNumber && (
                  <p className="text-red-600 text-sm">
                    {errors.uanNumber?.message} {/* Display error message */}
                  </p>
                )}
              </div>}

    

            </div>
            <div className="flex justify-between px-3 pb-2">
              <button type="submit" className={`${formButtonClassName}`}>
                Submit
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {bankFields?.map((bank, index) => (
              <div
                key={bank.id}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3"
              >
                <div>
                  <label className={inputLabelClassName}>
                    Bank Holder Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.bankholderName`, {
                      required: "Bankholder Name is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.bankholderName
                        ? "border-[1px] "
                        : ""
                    }`}
                    placeholder="Enter Bank Holder Name"
                  />
                  {errors.bank?.[index]?.bankholderName && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].bankholderName?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    Bank Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.bankName`, {
                      required: "Bank Name is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.bankName ? "border-[1px] " : ""
                    }`}
                    placeholder="Enter Bank Name"
                  />
                  {errors.bank?.[index]?.bankName && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].bankName?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    Account Number <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.accountNumber`, {
                      required: "Account Number is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.accountNumber
                        ? "border-[1px] "
                        : ""
                    }`}
                    placeholder="Enter Account Number"
                  />
                  {errors.bank?.[index]?.accountNumber && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].accountNumber?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    IFSC Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.ifscCode`, {
                      required: "IFSC Code is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.ifscCode ? "border-[1px] " : ""
                    }`}
                    placeholder="Enter IFSC Code"
                  />
                  {errors.bank?.[index]?.ifscCode && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].ifscCode?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    Account Type <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.accountType`, {
                      required: "Account Type is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.accountType ? "border-[1px] " : ""
                    }`}
                    placeholder="Enter Account Type"
                  />
                  {errors.bank?.[index]?.accountType && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].accountType?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    Branch Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`bank.${index}.branchName`, {
                      required: "Branch Name is required",
                    })}
                    className={`${inputClassName} ${
                      errors.bank?.[index]?.branchName ? "border-[1px] " : ""
                    }`}
                    placeholder="Enter Branch Name"
                  />
                  {errors.bank?.[index]?.branchName && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].branchName?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={inputLabelClassName}>
                    Upload <span className="text-red-600">*</span>
                  </label>
                  <div>
                    <input
                      type="file"
                      id={`fileUpload${index}`}
                      className="hidden"
                      onChange={(e) =>
                        handleFileChangeBank(index, e.target.files)
                      }
                    />
                    <label
                      htmlFor={`fileUpload${index}`}
                      className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                    >
                      Upload
                    </label>
                  </div>
                  {errors.bank?.[index]?.file && (
                    <p className="text-red-600 text-sm">
                      {errors.bank[index].file?.message}
                    </p>
                  )}
                </div>
                {imagePreviewBank[index] && (
                  <img
                    src={imagePreviewBank[index]}
                    alt={`Uploaded Preview ${index}`}
                    className="w-20 h-20 shadow rounded-sm"
                  />
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteBank(index)}
                    className="text-gray-600 hover:text-gray-800 flex items-center justify-center border-2 border-gray-500 p-1 rounded-lg"
                  >
                    <i className="fas fa-trash-alt"></i> Delete
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between px-3 pb-2">
              <button
                type="button"
                onClick={handleAddMoreBank}
                className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
              >
                Add More Bank
              </button>
            </div>

            <div className="flex justify-between px-3 pb-2">
              <button type="submit" className={`${formButtonClassName}`}>
                Submit
              </button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            {fields.map((document, index) => (
              <div
                key={document.id}
                className="px-3 grid sm:grid-cols-2 grid-cols-1 gap-4 items-end mb-3"
              >
                <div>
                  <label className={`${inputLabelClassName}`}>
                    Document Type <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register(`documents.${index}.name`, {
                      required: "Document Type is required",
                    })}
                    className={`${inputClassName} ${
                      errors.documents?.[index]?.name ? "border-[1px] " : ""
                    }`}
                  >
                    <option value="">Select Document Type</option>
                    {employeeDocumentList?.map((type) => (
                      <option key={type.name} value={type.name}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.documents?.[index]?.name && (
                    <p className="text-red-600 text-sm">
                      {errors.documents[index].name?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`${inputLabelClassName}`}>
                    Document No <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register(`documents.${index}.documentNo`, {
                      required: "Document No is required",
                    })}
                    className={`${inputClassName} ${
                      errors.documents?.[index]?.documentNo
                        ? "border-[1px] "
                        : ""
                    }`}
                    placeholder="Enter Document No"
                  />
                  {errors.documents?.[index]?.documentNo && (
                    <p className="text-red-600 text-sm">
                      {errors.documents[index].documentNo?.message}
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
                      onChange={(e) => handleFileChange(index, e.target.files)}
                    />
                    <br />
                    <label
                      htmlFor={`documentUpload${index}`}
                      className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                    >
                      Upload
                    </label>
                  </div>
                  {imagePreview[index] && (
                    <img
                      src={imagePreview[index]}
                      alt={`Uploaded Preview ${index}`}
                      className="w-20 h-20 shadow rounded-sm"
                    />
                  )}

                  {errors.documents?.[index]?.file && (
                    <p className="text-red-600 text-sm">
                      {errors.documents[index].file?.message}
                    </p>
                  )}
                </div>

                <div className="px-3 gap-4 items-end mb-3">
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
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
                onClick={handleAddMore}
                className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded"
              >
                Add More
              </button>
            </div>

            <div className="flex justify-between px-3 pb-2">
              <button type="submit" className={`${formButtonClassName}`}>
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </GlobalLayout>
  );
}

export default CreateSalaryModule;
