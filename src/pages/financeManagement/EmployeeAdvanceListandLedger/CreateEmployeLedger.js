import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { customDayjs, domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { Radio, Select } from "antd";
import { vendorSearch } from "../vendor/vendorFeatures/_vendor_reducers";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { createemployeLedger } from "./employeLedgerFeature/_employeLedger_reducers";


const CreateEmployeLedger = () => {
  const {

    loading: vendorAdvanceLoading,
  } = useSelector((state) => state.EmployeLedger);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      typeSelection: "Vendor",
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeList, loading: employeeListLoading } = useSelector((state) => state.employe);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading, branchDetailsData } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { vendorDataList, loading: vendorListLoading } = useSelector(state => state.vendor)
  const [isPreview, setIsPreview] = useState(false);
  const [attachment, setAttachments] = useState([]);
  const onSubmit = (data) => {

    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "employeId": data?.employee?.value,
      "vendorId": data?.vendorId,
      "advanceType": data?.typeSelection,
      "amount": + data?.amount,
      "date": customDayjs(data?.paymentDate),
      "naration": data?.naration,
      "attachment": attachment,
      "paidToEmployeId": data?.paymentMode === "cash" ? data?.employeeId?.value : null,
      "bankAccId": data?.paymentMode !== "cash" ? data?.bankId : null,
      "type": data?.paymentMode,
      "chequeNo": data?.paymentMode !== "cheque" ? data?.chequeNo : null,
      "transactionNo": data?.paymentMode === "bank" ? data?.transactionNo : null,

    };
    dispatch(createemployeLedger(finalPayload)).then((data) => {
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset the input value to allow selecting the same file again if needed
      e.target.value = null;
      const reqData = {
        filePath: file,
        isVideo: false,
        isMultiple: false, // Single file selection
      };
      dispatch(fileUploadFunc(reqData)).then((res) => {
        if (res?.payload?.data) {
          setAttachments(prev => [...prev, res.payload?.data]);
        }
      });
    }
  };
  const handleRemoveFile = (index) => {
    setAttachments(prev => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      return updatedAttachments
    });
  };


  const PDCompanyId = useWatch({
    name: 'PDCompanyId',
    control,
    defaultValue: ''
  })

  const PDBranchId = useWatch({
    name: 'PDBranchId',
    control,
    defaultValue: ''
  })

  useEffect(() => {
    setValue('typeSelection', "Employe")
  }, [])


  useEffect(() => {
    dispatch(employeSearch({
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: '',
      designationId: '',
      companyId: userInfoglobal?.userType === "admin" ? PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,

    }))
  }, [PDBranchId])

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          {/* <div className="col-span-2">

            <Controller
              name="typeSelection"
              control={control}
              rules={{ required: "Advance for is required" }}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                  }}
                  optionType="button"
                  buttonStyle="solid"
                  block
                  defaultValue={"Vendor"}
                  className={`  ${errors.clientSelection ? "border-[1px] " : "border-gray-300"}`}
                >
                  <Radio value="Vendor">Vendor</Radio>
                  <Radio value="Employe">Employe</Radio>
                </Radio.Group>
              )}
            />
            {errors.clientSelection && (
              <p className="text-red-500 text-sm">
                {errors.clientSelection.message}
              </p>
            )}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">

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
                    </Select.Option> : (companyList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    )))}
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
                control={control}
                name="PDBranchId"
                rules={{ required: "Branch is required" }}
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
     
            {useWatch({
              control,
              name: "typeSelection"
            }) === "Employe" &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee</label>
                <Controller
                  name="employee"
                  control={control}
                  rules={{ required: "Employee is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      onFocus={() => {
                        const reqPayload = {
                          text: "",
                          status: true,
                          sort: true,
                          isTL: "",
                          isHR: "",
                          isPagination: false,
                          departmentId: '',
                          designationId: '',
                          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                          branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
                        };
                        dispatch(employeSearch(reqPayload));
                      }}
                      options={employeList?.map((employee) => ({
                        value: employee?._id,
                        label: employee?.fullName,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
              </div>
            }

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Amount<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                 step="0.01"
                {...register("amount", {
                  required: "Amount is required",

                })}
                className={` ${inputClassName} ${errors.amount ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* <div>
              <label className={`${inputLabelClassName}`}>Bill Date</label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isAfter(dayjs().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
            </div> */}


            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-1 md:gap-2 md:my-1 px-3 md:mt-2">
                <div className="">
                  <div className="flex items-center gap-4">
                    <label className="your-input-label-class">
                      <Controller
                        name="paymentMode"
                        control={control}
                        defaultValue="cash"
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                          <Radio.Group defaultValue={"cash"} {...field}>
                            <Radio className={`${inputLabelClassName}`} value="cash">Cash</Radio>
                            {/* <Radio className={`${inputLabelClassName}`} value="cheque">Cheque</Radio> */}
                            <Radio className={`${inputLabelClassName}`} value="bank">Bank</Radio>
                          </Radio.Group>
                        )}
                      />
                    </label>
                    {errors.type && <span className="error-message">{errors.type.message}</span>}
                  </div>
                  {errors.type && (
                    <p className="text-red-500 text-sm">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                {watch("paymentMode") !== "cash" && <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank<span className="text-red-600">*</span>
                  </label>

                  <Controller
                    control={control}
                    name="bankId"
                    rules={{ required: "bankId is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                        onFocus={() => {
                          dispatch(getBranchDetails({
                            _id: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
                          }))
                        }}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {
                          branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                          branchDetailsData.data.bankData.map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                               {optionLabelForBankSlect(type)}
                              {/* {`${type.bankName} (${type.branchName})`} */}
                            </Select.Option>
                          ))
                        }         </Select>
                    )}
                  />

                  {errors.bankId && (
                    <p className="text-red-500 text-sm">
                      {errors.bankId.message}
                    </p>
                  )}
                </div>}
                {watch("paymentMode") === "cash" && <div className="w-full">
                  <label className={`${inputLabelClassName}`}>Employee</label>
                  <Controller
                    name="employeeId"
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
                        className={`${inputLabelClassNameReactSelect} ${errors.employeeId ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Select Employee"
                      />
                    )}
                  />
                  {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
                </div>}
                {watch("paymentMode") === "cheque" && <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Cheque No
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type=""
                    {...register("chequeNo", {
                      required: "chequeNo is required",

                    })}
                    className={` ${inputClassName} ${errors.chequeNo ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Cheque no"
                  />
                  {errors.chequeNo && (
                    <p className="text-red-500 text-sm">
                      {errors.chequeNo.message}
                    </p>
                  )}
                </div>}
                {watch("paymentMode") === "bank" && <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Transaction No
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("transactionNo", {
                      required: "transaction No is required",

                    })}
                    className={` ${inputClassName} ${errors.transactionNo ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter transaction no"
                  />
                  {errors.transactionNo && (
                    <p className="text-red-500 text-sm">
                      {errors.transactionNo.message}
                    </p>
                  )}
                </div>}
              </div>
              <div className="px-3">

                <div>
                  <label className={`${inputLabelClassName}`}>Payment Date</label>
                  <Controller
                    name="paymentDate"
                    control={control}
                    render={({ field }) => (
                      <CustomDatePicker field={field} disabledDate={(current) => current && current > dayjs().endOf("day")} errors={errors} />
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
                </div>




              </div>
            </div>



            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration<span className="text-red-600">*</span>
              </label>
              <textarea

                {...register("naration", {
                  required: "Naration is required",

                })}
                className={` ${inputClassName} ${errors.naration ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Naration"
              ></textarea>
              {errors.naration && (
                <p className="text-red-500 text-sm">
                  {errors.naration.message}
                </p>
              )}
            </div>
            <div className="border-t pt-4 mt-6">
              <div className="font-medium mb-2">Attachments:</div>
              {!isPreview ? (
                <div className="space-y-4">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                  >
                    <FaRegFile className="mr-2" /> Add Attachments
                  </label>

                  <div className="space-y-2">
                    {attachment?.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <a
                          href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                          className="flex items-center space-x-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaRegFile className="text-gray-500" />
                          <span className="text-sm text-gray-600">{file}</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Attachments preview logic */}
                </div>
              )}
            </div>

          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={vendorAdvanceLoading}
              className={`${vendorAdvanceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {vendorAdvanceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateEmployeLedger;
