import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect } from "../../../constents/global";
import { getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getpaymentDetails, updatepayment } from "./paymentFeature/_payment_reducers";
import { Radio, Select } from "antd";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { FaRegFile, FaTimes } from "react-icons/fa";
import Loader from "../../../global_layouts/Loader";

const EditPayment = () => {
  const { loading: paymentLoading } = useSelector((state) => state.payment);
  const { paymentDetails } = useSelector((state) => state.payment);
  const { paymentIdEnc } = useParams();
  const paymentId = decrypt(paymentIdEnc);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const [attachment, setAttachments] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
    setValue,
    resetField,
    trigger
  } = useForm({
    defaultValues: {
      isDiscountApplicable: false,
      isTDS: false,
      isAdvance: false,
      discount: 0,
      tds: 0,
      advance: 0,
      grandTotal: 0
    }
  });

  // Watch all relevant fields
  const isAdvance = useWatch({ control, name: "isAdvance" });
  const advanceAmount = useWatch({ control, name: "advance" });
  const maxAdvance = useWatch({ control, name: "maxAdvance" });
  const isDiscountApplicable = useWatch({ control, name: "isDiscountApplicable" });
  const discount = useWatch({ control, name: "discount" });
  const isTDS = useWatch({ control, name: "isTDS" });
  const tds = useWatch({ control, name: "tds" });
  const totalBeforeGrand = useWatch({ control, name: "totalBeforeGrand" });
  const grandTotal = useWatch({ control, name: "grandTotal" });

  // Initialize form with payment details
  useEffect(() => {
    if (paymentId) {
      dispatch(getpaymentDetails({ _id: paymentId }));
    }
  }, [paymentId]);

  useEffect(() => {
    if (paymentDetails) {
      setValue("paymentMode", 'cash');
      setValue("totalBeforeGrand", paymentDetails?.amount || 0);
      setValue("maxAdvance", paymentDetails?.applicableAdvance?.availableBalance || 0);
      setValue("grandTotal", paymentDetails?.amount || 0);
    }
  }, [paymentDetails]);

  // Main calculation effect
  useEffect(() => {
    const calculatePayments = () => {
      const total = Number(totalBeforeGrand) || 0;
      let remainingAmount = total;
      let calculatedDiscount = 0;
      let calculatedTDS = 0;
      let calculatedAdvance = 0;

      // Apply discount first if applicable
      if (isDiscountApplicable) {
        calculatedDiscount = Math.min(Number(discount) || 0, remainingAmount);
        remainingAmount -= calculatedDiscount;
      }

      // Then apply TDS if applicable
      if (isTDS && remainingAmount > 0) {
        calculatedTDS = Math.min(Number(tds) || 0, remainingAmount);
        remainingAmount -= calculatedTDS;
      }

      // Finally apply advance if applicable
      if (isAdvance && remainingAmount > 0) {
        const availableAdvance = Number(maxAdvance) || 0;
        calculatedAdvance = Math.min(availableAdvance, remainingAmount);
        remainingAmount -= calculatedAdvance;
      }

      // Update form values
      if (isDiscountApplicable) {
        setValue("discount", calculatedDiscount, { shouldValidate: true });
      }
      if (isTDS) {
        setValue("tds", calculatedTDS, { shouldValidate: true });
      }
      if (isAdvance) {
        setValue("advance", calculatedAdvance, { shouldValidate: true });
      }

      setValue("grandTotal", remainingAmount, { shouldValidate: true });
    };

    calculatePayments();
  }, [totalBeforeGrand, isDiscountApplicable, discount, isTDS, tds, isAdvance, maxAdvance]);

  // Reset fields when checkboxes are unchecked
  useEffect(() => {
    if (!isDiscountApplicable) {
      resetField("discount");
      setValue("discount", 0);
    }
  }, [isDiscountApplicable]);

  useEffect(() => {
    if (!isTDS) {
      resetField("tds");
      setValue("tds", 0);
    }
  }, [isTDS]);

  useEffect(() => {
    if (!isAdvance) {
      resetField("advance");
      setValue("advance", 0);
    }
  }, [isAdvance]);

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) return;

    const payload = {
      "_id": paymentDetails?._id,
      "companyId": paymentDetails?.companyId,
      "directorId": paymentDetails?.directorId,
      "branchId": paymentDetails?.branchId,
      "purchaseId": paymentDetails?.type === "purchase" ? paymentDetails?.purchaseAssetData?._id : "",
      "cashBookId": paymentDetails?.type === "cashBook" ? paymentDetails?.cashbookData?._id : "",
      "advanceAId": paymentDetails?.type === "advance" ? paymentDetails?.advanceData?._id : "",
      "type": paymentDetails?.type,
      "paymentMode":grandTotal > 0 ? data?.paymentMode :'cash',
      "employeId": grandTotal > 0 ? (data?.paymentMode === 'cash' ? data?.employeeId?.value:null) : '',
      "bankAccId": grandTotal > 0 ? (data?.paymentMode !== 'cash' ? data?.bankId : null):'',
      "chequeNo": grandTotal > 0 ? (data?.paymentMode === 'cheque' ? data?.chequeNo : null):'',
      "transactionNo": grandTotal > 0 ? (data?.paymentMode === 'bank' ? data?.transactionNo : null):'',
      "amount": data?.totalBeforeGrand,
      "totalAdjuustAmount": paymentDetails?.applicableAdvance?.availableBalance,
      "isAdjust": data?.isAdvance || false,
      "adjustAmount": data?.isAdvance ? +data?.advance : 0,
      "totalAmount": data?.grandTotal,
      "date": data?.date,
      "remarks": grandTotal > 0 ? (data?.naration) :'',
      "attachment": attachment,
      "status": "Paid",
      "isTDS": data?.isTDS || false,
      "TDSAmount": data?.isTDS ? +data?.tds : 0,
      "isDiscount": data?.isDiscountApplicable || false,
      "discountAmount": data?.isDiscountApplicable ? +data?.discount : 0,
    };

    dispatch(updatepayment(payload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      e.target.value = null;
      const reqData = {
        filePath: file,
        isVideo: false,
        isMultiple: false,
      };
      dispatch(fileUploadFunc(reqData)).then((res) => {
        if (res?.payload?.data) {
          setAttachments(prev => [...prev, res.payload?.data]);
        }
      });
    }
  };

  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleNumberInput = (fieldName, maxValue = null) => (e) => {
    let value = parseFloat(e.target.value) || 0;
    if (value < 0) value = 0;
    if (maxValue !== null && value > maxValue) value = maxValue;
    setValue(fieldName, value, { shouldValidate: true });
  };

  // Calculate maximum allowed values
  const getMaxDiscount = () => Number(totalBeforeGrand) || 0;
  const getMaxTDS = () => {
    const total = Number(totalBeforeGrand) || 0;
    const discountAmount = isDiscountApplicable ? (Number(discount) || 0) : 0;
    return Math.max(0, total - discountAmount);
  };

 const handleAdvanceInput = (e) => {
  let value = parseFloat(e.target.value) || 0;
  if (value < 0) value = 0;

  // Calculate the maximum allowed advance
  const remainingAfterDiscountTDS = totalBeforeGrand - 
                                 (isDiscountApplicable ? discount : 0) - 
                                 (isTDS ? tds : 0);
  const maxAllowedAdvance = Math.min(maxAdvance, remainingAfterDiscountTDS);

  // Cap the value at the maximum allowed
  if (value > maxAllowedAdvance) {
    value = maxAllowedAdvance;
  }

  setValue("advance", value, { shouldValidate: true });
  
  // Update grand total
  const newGrandTotal = remainingAfterDiscountTDS - value;
  setValue("grandTotal", newGrandTotal > 0 ? newGrandTotal : 0);
};

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 border border-gray-200 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-header text-white text-xs px-3 py-2 rounded-t-xl">
            {paymentDetails?.type === "advance" && `${paymentDetails?.type ||''}  ${paymentDetails?.advanceData?.advanceType ? `/${paymentDetails?.advanceData?.advanceType}` : ''}  ${paymentDetails?.advanceData?.userName ?`/${paymentDetails?.advanceData?.userName}` : '' } ${paymentDetails?.advanceData?.date ? `/(${moment(paymentDetails?.advanceData?.date).format("DD/MM/YYYY")})` : ''}`}
            {paymentDetails?.type === "purchase" && `${paymentDetails?.type || ''}  ${paymentDetails?.purchaseAssetData?.purchaseType ? `/${paymentDetails?.purchaseAssetData?.purchaseType}` : ''}  ${paymentDetails?.purchaseAssetData?.purchaseType === "Vendor" ? `/${paymentDetails?.purchaseAssetData?.assetName}`  : `/${paymentDetails?.purchaseAssetData?.vendorOtherName}` } ${paymentDetails?.purchaseAssetData?.date ? `/(${moment(paymentDetails?.purchaseAssetData?.date).format("DD/MM/YYYY")})` : ''}`}
            {paymentDetails?.type === "cashBook" && `${paymentDetails?.type || ''} ${paymentDetails?.cashbookData?.userName ? `/${paymentDetails?.cashbookData?.userName}` : ''} ${paymentDetails?.cashbookData?.date ? `/(${moment(paymentDetails?.cashbookData?.date).format("DD/MM/YYYY")})` : ''}`}
          </div>

          <div className="px-3">
            {paymentDetails?.type !== 'payroll' && (
              <div className="space-y-2 mb-4">
                {/* <label className={`${inputLabelClassName} flex items-center`}>
                  <input type="checkbox" {...register("isAdvance")} />
                  <span className="mx-2 text-[15px]">Is Advance</span>
                </label> */}
                <label className={`${inputLabelClassName} flex items-center`}>
                  <input type="checkbox" {...register("isDiscountApplicable")} />
                  <span className="mx-2 text-[15px]">Is Discount</span>
                </label>
                <label className={`${inputLabelClassName} flex items-center`}>
                  <input type="checkbox" {...register("isTDS")} />
                  <span className="mx-2 text-[15px]">Is TDS</span>
                </label>
              </div>
            )}

            <div className="w-full flex flex-row items-end justify-end">
              <div className="space-y-2 w-full max-w-md">
                <div>
                  <label className={inputLabelClassName}>Total Amount</label>
                  <input
                    type="text"
                    {...register("totalBeforeGrand")}
                    className={inputDisabledClassName}
                    disabled
                  />
                </div>

                {isDiscountApplicable && (
                  <div>
                    <label className={inputLabelClassName}>Discount</label>
                    <Controller
                      name="discount"
                      control={control}
                      rules={{
                        validate: value => {
                          const numValue = Number(value) || 0;
                          if (numValue < 0) return "Discount cannot be negative";
                          if (numValue > getMaxDiscount()) return `Discount cannot exceed ${getMaxDiscount()}`;
                          return true;
                        }
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          max={getMaxDiscount()}
                          className={inputClassName}
                          onChange={handleNumberInput("discount", getMaxDiscount())}
                        />
                      )}
                    />
                    {errors.discount && (
                      <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
                    )}
                  </div>
                )}

                {isTDS && (
                  <div>
                    <label className={inputLabelClassName}>TDS</label>
                    <Controller
                      name="tds"
                      control={control}
                      rules={{
                        validate: value => {
                          const numValue = Number(value) || 0;
                          if (numValue < 0) return "TDS cannot be negative";
                          if (numValue > getMaxTDS()) return `TDS cannot exceed ${getMaxTDS()}`;
                          return true;
                        }
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          max={getMaxTDS()}
                          className={inputClassName}
                          onChange={handleNumberInput("tds", getMaxTDS())}
                        />
                      )}
                    />
                    {errors.tds && (
                      <p className="text-red-500 text-sm mt-1">{errors.tds.message}</p>
                    )}
                  </div>
                )}

                {isAdvance && (
                  <div>
                    <label className={inputLabelClassName}>Advance</label>
                    <Controller
  name="advance"
  control={control}
  rules={{
    validate: value => {
      const numValue = Number(value) || 0;
      if (numValue < 0) return "Advance cannot be negative";
      
      const remainingAfterDiscountTDS = totalBeforeGrand - 
                                     (isDiscountApplicable ? discount : 0) - 
                                     (isTDS ? tds : 0);
      const maxAllowedAdvance = Math.min(maxAdvance, remainingAfterDiscountTDS);
      
      if (numValue > maxAllowedAdvance) {
        return `Advance cannot exceed ${maxAllowedAdvance}`;
      }
      return true;
    }
  }}
  render={({ field }) => {
    const remainingAfterDiscountTDS = totalBeforeGrand - 
                                   (isDiscountApplicable ? discount : 0) - 
                                   (isTDS ? tds : 0);
    const maxAllowedAdvance = Math.min(maxAdvance, remainingAfterDiscountTDS);

    return (
      <input
        {...field}
        type="number"
        step="0.01"
        min="0"
        max={maxAllowedAdvance}
        className={inputClassName}
        onChange={handleAdvanceInput}
      />
    );
  }}
/>
                    <div className="text-sm text-gray-600">
                      Max available advance: {maxAdvance}
                    </div>
                    {errors.advance && (
                      <p className="text-red-500 text-sm mt-1">{errors.advance.message}</p>
                    )}
                  </div>
                )}


                <div>
                  <label className={inputLabelClassName}>Grand Total</label>
                  <input
                    type="text"
                    {...register("grandTotal")}
                    className={inputDisabledClassName}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          {Number(grandTotal) > 0 && (
            <div className="py-2">
              <div className="grid grid-cols-1 md:grid-cols-1 md:gap-2 md:my-1 px-3 md:mt-2">
                <div className="">
                  <div className="flex items-center gap-4">
                    <label className="your-input-label-class">
                      <Controller
                        name="paymentMode"
                        control={control}
                        rules={{ required: "Type is required" }}
                        render={({ field }) => (
                          <Radio.Group defaultValue={"cash"} {...field}
                          value={field?.value}
                          onChange={(e)=>{
                            field.onChange(e?.target?.value)
                            if(e?.target?.value=='cash'){
                              setValue('bankId','')
                              setValue('transactionNo','')                              
                            }
                            else{
                              setValue('employeeId','')                              
                            }
                          }}
                          >
                            <Radio className={`${inputLabelClassName}`} value="cash">Cash</Radio>
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

                {watch("paymentMode") !== "cash" && (
                  <div className="">
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
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          onFocus={() => {
                            dispatch(getBranchDetails({
                              _id: paymentDetails?.branchId
                            }))
                          }}
                        >
                          <Select.Option value="">Select Bank</Select.Option>
                          {branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                            branchDetailsData.data.bankData.map((type) => (
                              <Select.Option key={type._id} value={type._id}>
                                {optionLabelForBankSlect(type)}
                              </Select.Option>
                            ))
                          }
                        </Select>
                      )}
                    />
                    {errors.bankId && (
                      <p className="text-red-500 text-sm">
                        {errors.bankId.message}
                      </p>
                    )}
                  </div>
                )}

                {watch("paymentMode") === "cash" && (
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>Employee</label>
                    <Controller
                      name="employeeId"
                      control={control}
                      rules={{ required: "Employee is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          onFocus={() => dispatch(employeSearch({
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
                          }))}
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
                  </div>
                )}

                {watch("paymentMode") === "bank" && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Transaction No<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("transactionNo", {
                        required: "transaction No is required",
                      })}
                      className={` ${inputClassName} ${errors.transactionNo ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Enter transaction no"
                    />
                    {errors.transactionNo && (
                      <p className="text-red-500 text-sm">
                        {errors.transactionNo.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="px-3">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Naration<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    {...register("naration", {
                      required: "Naration is required",
                    })}
                    className={` ${inputClassName} ${errors.naration ? "border-[1px] " : "border-gray-300"}`}
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
                      <CustomDatePicker field={field} errors={errors} />
                    )}
                  />
                  {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
                </div>

                <div className="pt-4">
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
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end m-2">
            <button
              type="submit"
              disabled={paymentLoading}
              className={`${paymentLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {paymentLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditPayment;