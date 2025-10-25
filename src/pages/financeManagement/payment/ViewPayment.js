import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputAntdSelectClassNameDisabled, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createpayment, getpaymentDetails, updatepayment } from "./paymentFeature/_payment_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { Radio, Select } from "antd";
import { getinvoiceList, invoiceSearch } from "../invoice/invoiceFeature/_invoice_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { MdDelete } from "react-icons/md";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { FaRegFile, FaTimes } from "react-icons/fa";
import Loader from "../../../global_layouts/Loader";
import dayjs from "dayjs";


const ViewPayment = () => {
  const { loading: paymentLoading } = useSelector(
    (state) => state.payment
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {

    }
  });
  const { paymentDetails } = useSelector((state) => state.payment);
  const { paymentIdEnc } = useParams()
  const paymentId = decrypt(paymentIdEnc)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const grandTotal = useWatch({ control, name: "grandTotal", defaultValue: "" });
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const [attachment, setAttachments] = useState([]);
  const totalBeforeGrand = useWatch({ control, name: "totalBeforeGrand", defaultValue: "" });
  const advanceAmount = useWatch({ control, name: "advance", defaultValue: "" });
  const isAdvance = useWatch({ control, name: "isAdvance", defaultValue: false });
  const paymentMode = useWatch({ control, name: "paymentMode", defaultValue: "" });



  useEffect(() => {
    if (paymentId) {
      dispatch(getpaymentDetails({ _id: paymentId }))
    }
  }, [paymentId])

  // "purchaseId": paymentDetails?.type === "purchase" ? paymentDetails?.purchaseAssetData?._id : "",
  // "cashBookId": paymentDetails?.type === "cashBook" ? paymentDetails?.cashbookData?._id : "",
  // "advanceAId": paymentDetails?.type === "advance" ? paymentDetails?.advanceData?._id : "",
  // "type": paymentDetails?.type,
  // "paymentMode": data?.paymentMode,
  // "employeId": data?.paymentMode === 'cash' ? data?.employeeId?.value : null,
  // "bankAccId": data?.paymentMode !== 'cash' ? data?.bankId : null,
  // "chequeNo": data?.paymentMode === 'cheque' ? data?.chequeNo : null,
  // "transactionNo": data?.paymentMode === 'bank' ? data?.transactionNo : null,
  // "amount": data?.totalBeforeGrand,
  // "totalAdjuustAmount": paymentDetails?.applicableAdvance?.availableBalance,
  // "isAdjust": data?.isAdvance ? data?.isAdvance : false,
  // "adjustAmount": data?.isAdvance ? +data?.advance : 0,
  // "totalAmount": data?.grandTotal,
  // "date": data?.date,
  // "remarks": data?.naration,
  // "attachment": attachment,
  useEffect(() => {
    if (paymentDetails) {
      dispatch(getBranchDetails({
        _id: paymentDetails?.branchId
      }))
      dispatch(employeSearch({
        text: "",
        status: true,
        sort: true,
        isTL: "",
        isHR: "",
        isPagination: false,
        departmentId: '',
        designationId: '',
        companyId: paymentDetails?.companyId,
        branchId: paymentDetails?.branchId,
      })).then((data)=>{
        if(!data?.error){
          const employeeFind = data?.payload?.data?.docs?.find((el)=>el?._id === paymentDetails?.employeId)
          setValue("employeeId", employeeFind?.fullName)
        }
      })
      setValue("type", paymentDetails?.type)
      setValue("isAdvance", paymentDetails?.isAdjust)
      setValue("isTds", paymentDetails?.isTDS)
      setValue("isDiscount", paymentDetails?.isDiscount)
      setValue("paymentMode", paymentDetails?.paymentMode)
      setValue("maxAdvance", paymentDetails?.applicableAdvance?.availableBalance)
      setValue("totalBeforeGrand", paymentDetails?.amount)
      setValue("advance", paymentDetails?.adjustAmount)
      setValue("grandTotal", paymentDetails?.totalAmount)
      setValue("bankId", paymentDetails?.bankAccId)
      setValue("chequeNo", paymentDetails?.chequeNo)
      setValue("transactionNo", paymentDetails?.transactionNo)
      setValue("naration", paymentDetails?.remarks)
      setValue("date", dayjs(paymentDetails?.date) )

    }
  }, [paymentDetails])

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 border border-gray-200 rounded-xl " >
          <div className="bg-header text-white text-xs px-3 py-2 rounded-t-xl">
            {paymentDetails?.type === "advance" && `${paymentDetails?.type} / ${paymentDetails?.advanceData?.advanceType} / ${paymentDetails?.advanceData?.userName} /  (${moment(paymentDetails?.advanceData?.date).format("DD/MM/YYYY")})`}
            {paymentDetails?.type === "purchase" && `${paymentDetails?.type} / ${paymentDetails?.purchaseAssetData?.purchaseType} /${paymentDetails?.purchaseAssetData?.purchaseType === "Vendor" ? `${paymentDetails?.purchaseAssetData?.assetName}` : `${paymentDetails?.purchaseAssetData?.userName}`} / (${moment(paymentDetails?.purchaseAssetData?.date).format("DD/MM/YYYY")})`}
            {paymentDetails?.type === "cashBook" && `${paymentDetails?.type} / ${paymentDetails?.cashbookData?.userName} / (${moment(paymentDetails?.cashbookData?.date).format("DD/MM/YYYY")})`}
          </div>
          <div className="px-3">
            {/* {paymentDetails?.type !== 'payroll' && isAdvance && <div>
              <label className={`${inputLabelClassName} flex items-center`}>
                <input disabled type="checkbox" {...register("isAdvance")} />
                <span className={`mx-2 text-[15px]`}>Is Advance</span>
              </label>
            </div>} */}
            <div>
              <label className={`${inputLabelClassName} flex items-center`}>
                <input disabled value={paymentDetails?.isAdjust} type="checkbox" {...register("isAdvance")} />
                <span className={`mx-2 text-[15px]`}>Is Advance</span>
              </label>
            </div>
       <div>
    
              <label className={`${inputLabelClassName} flex items-center`}>
           <input
            type="checkbox"
            disabled
            defaultChecked={paymentDetails?.isDiscount}
            {...register("isDiscount")}
          />
                <span className={`mx-2 text-[15px]`}>Is Discount</span>
              </label>
            </div>
           <div>
              <label className={`${inputLabelClassName} flex items-center`}>
                <input   defaultChecked={paymentDetails?.isTDS} disabled type="checkbox" {...register("isTds")} />
                <span className={`mx-2 text-[15px]`}>Is TDS</span>
              </label>
            </div>
            
            
            
          </div>
          
          <div className="w-full flex flex-row items-end justify-end">
              <div className="">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Total Amount
                  </label>
                  <input
                    type="text"
                    {...register("totalBeforeGrand", {})}
                    className={`${inputDisabledClassName}`}
                    placeholder="total"
                    disabled
                  // value={totalAmount - discount}
                  />
                </div>
                {isAdvance && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Advance</label>
                    <input
                      type="number"
                      disabled
                      value={paymentDetails?.adjustAmount}
                      className={`${inputDisabledClassName}`}
                      placeholder="Advance"
                    />
                  </div>
                )}
                {paymentDetails?.isDiscount && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}> Discount Amount </label>
                    <input
                      type="number"                      
                      disabled
                      value={paymentDetails?.discountAmount}
                      className={`${inputDisabledClassName}`}
                      placeholder="Discount"
                    />
                  </div>
                )}
                { paymentDetails?.isTDS && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}> TDS Amount </label>
                    <input
                      type="number"                      
                      disabled
                      value={paymentDetails?.TDSAmount}
                      className={`${inputDisabledClassName}`}
                      placeholder="TDS"
                    />
                  </div>
                )}
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Grand Total
                  </label>
                  <input
                    type="text"
                    {...register("grandTotal")}
                    className={`${inputDisabledClassName}`}
                    placeholder="grandTotal"
                    disabled
                  />
                </div>
              </div>
            </div>
          {Number(grandTotal) > 0 && <div className="py-2">

            <div className="grid grid-cols-1 md:grid-cols-1 md:gap-2 md:my-1 px-3 md:mt-2">
              <div className="">
                <div className="flex items-center gap-4">
                  <label className="your-input-label-class">
                    <Controller
                      name="paymentMode"
                      control={control}
                      rules={{ required: "Type is required" }}
                      render={({ field }) => (
                        <Radio.Group disabled defaultValue={"cash"} {...field}>
                          <Radio className={`${inputLabelClassName}`} value="cash">Cash</Radio>
                          <Radio className={`${inputLabelClassName}`} value="cheque">Cheque</Radio>
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
              {paymentMode !== "cash" && <div className="">
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
                      disabled
                      className={`${inputAntdSelectClassNameDisabled} `}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Bank</Select.Option>
                      {
                        branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                        branchDetailsData.data.bankData.map((type) => (
                          <Select.Option key={type._id} value={type._id}>
                            {`${type.bankName} (${type.branchName})`}
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
              {paymentMode === "cash" && <div className="w-full">
                <label className={`${inputLabelClassName}`}>Employee</label>
                <input
                  type=""
                  disabled
                  {...register("employeeId")}
                  className={` ${inputDisabledClassName} ${errors.chequeNo ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Cheque no"
                />
                {/* <Controller
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
                      disabled={true}
                      className={`${inputLabelClassNameReactSelect} ${errors.employeeId ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Employee"
                      showSearch
                      filterOption={(option, inputValue) =>
                        option.label.toLowerCase().includes(inputValue.toLowerCase())
                      }
                    />
                  )}
                /> */}
                {errors.employeeId && <p className="text-red-500 text-sm">{errors.employeeId.message}</p>}
              </div>}
              {paymentMode === "cheque" && <div className="">
                <label className={`${inputLabelClassName}`}>
                  Cheque No
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type=""
                  disabled
                  {...register("chequeNo", {
                    required: "chequeNo is required",

                  })}
                  className={` ${inputDisabledClassName} ${errors.chequeNo ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Cheque no"
                />
                {errors.chequeNo && (
                  <p className="text-red-500 text-sm">
                    {errors.chequeNo.message}
                  </p>
                )}
              </div>}
              {paymentMode === "bank" && <div className="">
                <label className={`${inputLabelClassName}`}>
                  Transaction No
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  {...register("transactionNo", {
                    required: "transaction No is required",
                  })}
                  className={` ${inputDisabledClassName} ${errors.transactionNo ? "border-[1px] " : "border-gray-300"
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
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Naration<span className="text-red-600">*</span>
                </label>
                <textarea
disabled
                  {...register("naration", {
                    required: "Naration is required",

                  })}
                  className={` ${inputDisabledClassName} ${errors.naration ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Naration"
                ></textarea>
                {errors.naration && (
                  <p className="text-red-500 text-sm">
                    {errors.naration.message}
                  </p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>Payment Date</label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker disabled={true} field={field} errors={errors} />
                  )}
                />
                {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
              </div>
              <div className="pt-4">

                <div className="space-y-4">
                  <input
                    type="file"

                    className="hidden"
                    id="file-upload"
                  />
                  {/* <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                  >
                    <FaRegFile className="mr-2" /> Add Attachments
                  </label> */}

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
                        {/* <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes />
                        </button> */}
                      </div>
                    ))}
                  </div> </div>
              </div>
            </div>
          </div>}
         
        </form>
      </div >
    </GlobalLayout >
  );
};

export default ViewPayment;
