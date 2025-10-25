import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  optionLabelForBankSlect,
} from "../../../constents/global";
import ReactSelect from "react-select";
import { branchSearch, } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { Select, Radio } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import dayjs from "dayjs";
import { accountantSearch } from "../accountantmanagement/accountManagentFeatures/_accountManagement_reducers";
import { createfundTransfer, getfundTransferDetails } from "./fundTransferFeatures/_fundTransfer_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { decrypt } from "../../../config/Encryption";

const EditFundTransfer = () => {
  const { loading: FundtransferLoading } = useSelector(
    (state) => state.fundTransfer
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
      transferType: "internal" // default value
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { fundTransferDetails } = useSelector(
    (state) => state.fundTransfer
  );

  const { expenseTypeList } = useSelector((state) => state.expenceHead);

  const { fundTransferIdEnc } = useParams();
  const fundTransferId = decrypt(fundTransferIdEnc);


  useEffect(() => {
    if (fundTransferId) {
      dispatch(getfundTransferDetails({ _id: fundTransferId }));
    }
  }, [fundTransferId]);


  const [attachment, setAttachment] = useState([]);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setAttachment((prev) => [...prev, res?.payload?.data]);
      }
    });
  };
  const handleRemoveFile = (index) => {
    setAttachment((prev) => {
      const updatedAttachments = prev?.filter((_, i) => i !== index);

      return updatedAttachments;
    });
  };

  const { accountantList: accountants, loading: loadingAccountants } = useSelector((state) => state.accountManagement);

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const isExpense = useWatch({
    control,
    name: "isExpense",
    defaultValue: "",
  });
  const senderAccountentId = useWatch({
    control,
    name: "senderAccountentId",
    defaultValue: "",
  });
  const receiverAccountentId = useWatch({
    control,
    name: "receiverAccountentId",
    defaultValue: "",
  });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const TransferType = useWatch({ control, name: "transferType", defaultValue: "internal" });
  useEffect(() => {
    if (fundTransferDetails) {
      setValue("transferType", fundTransferDetails?.transferCatagoryType);
      setValue("amount", fundTransferDetails?.amount);
      setValue("date", dayjs(fundTransferDetails?.date));
      setValue("naration", fundTransferDetails?.naration);
      setValue("UTRNumber", fundTransferDetails?.UTRNumber);
      setValue("senderAccountentId", fundTransferDetails?.senderAccountentId);
      setValue("receiverAccountentId", fundTransferDetails?.receiverAccountentId);
      setValue("senderBankAccId", fundTransferDetails?.senderBankAccId);
      setValue("receiverBankAccId", fundTransferDetails?.receiverBankAccId);
      setValue("senderUserId", fundTransferDetails?.senderUserId);
      setValue("receiverUserId", fundTransferDetails?.receiverUserId);
      setValue("receiverBankAccId", fundTransferDetails?.receiverBankAccId);
      setValue("senderBankAccId", fundTransferDetails?.senderBankAccId);
      setValue("senderAccountentId", fundTransferDetails?.senderAccountentId);
      setValue("isExpense", fundTransferDetails?.isExpense===true?"Yes":"No");
      setValue("expenseId", fundTransferDetails?.expenseId);
      setAttachment(fundTransferDetails?.attechment);
    }
  }, [fundTransferDetails]);
  const onSubmit = (data) => {
    let reqpayload = {
      _id: fundTransferId,
      companyId: fundTransferDetails?.companyId,
      directorId: fundTransferDetails?.directorId,
      branchId: fundTransferDetails?.branchId,
      transferCatagoryType: data?.transferType,
      amount: +data?.amount,
      date: customDayjs(data?.date),
      naration: data?.naration,
      attechment: attachment,
      UTRNumber: data?.UTRNumber,
    };

    // Add fields based on transfer type
    if (data?.transferType === "internal") {
      reqpayload = {
        ...reqpayload,
        senderAccountentId: data?.senderAccountentId,
        receiverAccountentId: data?.receiverAccountentId,
        senderBankAccId: data?.senderBankAccId,
        receiverBankAccId: data?.receiverBankAccId,
        senderUserId: accountants?.find((acc) => acc?._id === data?.senderAccountentId)?.accountentData?._id,
        receiverUserId: accountants?.find((acc) => acc?._id === data?.receiverAccountentId)?.accountentData?._id,
      };
    } else if (data?.transferType === "credit") {
      reqpayload = {
        ...reqpayload,
        receiverAccountentId: data?.receiverAccountentId,
        receiverBankAccId: data?.receiverBankAccId,
        receiverUserId: accountants?.find((acc) => acc?._id === data?.receiverAccountentId)?.accountentData?._id,
      };
    } else if (data?.transferType === "debit") {
      reqpayload = {
        ...reqpayload,
        senderAccountentId: data?.senderAccountentId,
        senderBankAccId: data?.senderBankAccId,
        senderUserId: accountants?.find((acc) => acc?._id === data?.senderAccountentId)?.accountentData?._id,
        isExpense: data?.isExpense === "Yes" ? true : false,
        expenseId: data?.expencehead?.value || ""
      };
    }

    dispatch(createfundTransfer(reqpayload)).then((data) => {
      if (!data?.error) {
        navigate(-1)
      }
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


  // Fetch accountants list
  useEffect(() => {
    dispatch(accountantSearch({
      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      directorId:
        userInfoglobal?.userType === "companyDirector"
          ? userInfoglobal?._id
          : userInfoglobal?.directorId,
      branchId:
        userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector" ||
          userInfoglobal?.userType === "company"
          ? BranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      text: "",
      sort: true,
      status: true,
      isPagination: false,
    }))
  }, []);

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Transfer Type Radio Button */}
          <div className="px-3 md:mt-4 mb-4">
            <label className={`${inputLabelClassName} block mb-2`}>
              Transfer Type <span className="text-red-600">*</span>
            </label>
            <Controller
              name="transferType"
              control={control}
              rules={{ required: "Transfer type is required" }}
              render={({ field }) => (
                <Radio.Group {...field} block optionType="button" buttonStyle="solid" className="!w-full">

                  <Radio value="internal" className="radio-custom">
                    Internal Transfer
                  </Radio>
                  <Radio value="credit" className="radio-custom">
                    Credit
                  </Radio>
                  <Radio value="debit" className="radio-custom">
                    Debit
                  </Radio>

                </Radio.Group>
              )}
            />
            {errors.transferType && (
              <p className="text-red-500 text-sm mt-1">
                {errors.transferType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:my-1 px-3 md:mt-4">


            {/* Sender Accountent - Only show for internal and debit */}
            {(TransferType === "internal" || TransferType === "debit") && (
              <>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Sender Accountent <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="senderAccountentId"
                    control={control}
                    rules={{
                      required: TransferType === "internal" || TransferType === "debit"
                        ? "Sender Accountent is required"
                        : false
                    }}
                    render={({ field }) => (
                      <Select
                        placeholder="Select Sender Accountent"
                        loading={loadingAccountants}
                        {...field}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp="children"
                        className={`${inputAntdSelectClassName} `}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {accountants?.map(acc => (
                          <Select.Option key={acc?._id} value={acc?._id}>
                            {acc?.accountentData?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.senderAccountentId && (
                    <p className="text-red-500 text-sm">{errors.senderAccountentId.message}</p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Sender Bank
                  </label>
                  <Controller
                    control={control}
                    name="senderBankAccId"

                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {accountants?.find((item) => item?._id === senderAccountentId)?.bankAccountData &&
                          accountants?.find((item) => item?._id === senderAccountentId)?.bankAccountData.length > 0 &&
                          accountants?.find((item) => item?._id === senderAccountentId).bankAccountData.map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                              {optionLabelForBankSlect(type)}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.senderBankAccId && (
                    <p className="text-red-500 text-sm">
                      {errors.senderBankAccId.message}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Receiver Accountent - Only show for internal and credit */}
            {(TransferType === "internal" || TransferType === "credit") && (
              <>
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Receiver Accountent <span className="text-red-600">*</span>
                  </label>
                  <Controller
                    name="receiverAccountentId"
                    control={control}
                    rules={{
                      required: TransferType === "internal" || TransferType === "credit"
                        ? "Receiver Accountent is required"
                        : false
                    }}
                    render={({ field }) => (
                      <Select
                        placeholder="Select Receiver Accountent"
                        loading={loadingAccountants}
                        {...field}
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        optionFilterProp="children"
                        className={`${inputAntdSelectClassName} `}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {accountants?.map(acc => (
                          <Select.Option key={acc?._id} value={acc?._id}>
                            {acc?.accountentData?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.receiverAccountentId && (
                    <p className="text-red-500 text-sm">{errors.receiverAccountentId.message}</p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Reciever Bank
                  </label>
                  <Controller
                    control={control}
                    name="receiverBankAccId"

                    render={({ field }) => (
                      <Select
                        {...field}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Bank</Select.Option>
                        {accountants?.find((item) => item?._id === receiverAccountentId)?.bankAccountData &&
                          accountants?.find((item) => item?._id === receiverAccountentId)?.bankAccountData.length > 0 &&
                          accountants?.find((item) => item?._id === receiverAccountentId).bankAccountData.map((type) => (
                            <Select.Option key={type._id} value={type._id}>
                              {optionLabelForBankSlect(type)}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  />
                  {errors.receiverBankAccId && (
                    <p className="text-red-500 text-sm">
                      {errors.receiverBankAccId.message}
                    </p>
                  )}
                </div>
              </>
            )}

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
                className={` ${inputClassName} ${errors.amount
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>
            {TransferType === "debit" && <div className="">

              <label className={`${inputLabelClassName}`}>
                Select Is Expense <span className="text-red-600">*</span>
              </label>

              <Controller
                name="isExpense"
                control={control}
                rules={{ required: "Is Expense  required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.isExpense ? '' : 'border-gray-300'}`}
                    placeholder="Select Is Expense"
                  >
                    <Select.Option value="">Select Is Expense</Select.Option>
                    <Select.Option value={'Yes'}>Yes</Select.Option>
                    <Select.Option value={'No'}>No</Select.Option>
                  </Select>
                )}
              />

              {errors.isExpense && (
                <p className="text-red-500 text-sm">
                  {errors.isExpense.message}
                </p>
              )}
            </div>}
            {isExpense == "Yes" && TransferType === "debit" && <div className="w-full">
              <label className={`${inputLabelClassName}`}>Expence Head  <span className="text-red-600">*</span></label>
              <Controller
                name="expencehead"
                control={control}
                rules={{ required: "Expence Head is required" }}
                render={({ field }) => (
                  <ReactSelect
                    onFocus={() => {
                      const reqPayload = {
                        directorId: "",
                        companyId: userInfoglobal?.userType === "admin"
                          ? CompanyId
                          : userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId,
                        branchId: userInfoglobal?.userType === "company" ||
                          userInfoglobal?.userType === "admin" ||
                          userInfoglobal?.userType === "companyDirector"
                          ? BranchId
                          : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId,
                        text: "",
                        sort: true,
                        status: "",
                        isPagination: false,
                      }

                      dispatch(expenseTypeSearch(reqPayload));
                    }} // API call triggers only when focused
                    {...field}
                    options={expenseTypeList?.map((expence) => ({
                      value: expence?._id,
                      label: expence?.name,
                    }))}
                    classNamePrefix="react-select"
                    className={`${inputLabelClassNameReactSelect} ${errors.expencehead ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Expence Head"
                  />
                )}
              />
              {errors.expencehead && <p className="text-red-500 text-sm">{errors.expencehead.message}</p>}
            </div>}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                UTR Number
              </label>
              <input
                {...register("UTRNumber")}
                className={` ${inputClassName} ${errors.UTRNumber
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter UTR Number"
              ></input>
              {errors.UTRNumber && (
                <p className="text-red-500 text-sm">
                  {errors.UTRNumber.message}
                </p>
              )}
            </div>


            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration
              </label>
              <textarea
                {...register("naration")}
                className={` ${inputClassName} ${errors.naration
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Naration"
              ></textarea>
              {errors.naration && (
                <p className="text-red-500 text-sm">
                  {errors.naration.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Date<span className="text-red-600">*</span>
              </label>
              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date is required",
                }}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return (
                        current &&
                        current.isAfter(dayjs().endOf("day"), "day")
                      );
                    }}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
          </div>
          <div className="  pt-2 mt-1">

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
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <a
                      href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                      className="flex items-center space-x-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaRegFile className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {file}
                      </span>
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


          <div className="flex justify-end">
            <button
              type="submit"
              disabled={FundtransferLoading}
              className={`${FundtransferLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {FundtransferLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditFundTransfer;