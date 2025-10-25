import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { decrypt } from "../../../config/Encryption";
import { getpurchaseExpenceDetails, updatepurchaseExpence } from "./purchaseandexpenceFeature/_purchaseandexpence_reducers";
import { vendorSearch } from "../vendor/vendorFeatures/_vendor_reducers";
import { Radio, Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { FaRegFile, FaTimes } from "react-icons/fa";
import moment from "moment";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { AssetTypeSearch } from "../../global/other/AssetTypeManagement/AssetTypeFeatures/_AssetType_reducers";

const Editpurchaseandexpence = () => {
  const { purchaseexpenceIdEnc } = useParams();
  const purchaseExpenceId = decrypt(purchaseexpenceIdEnc);
  const { loading: purchaseLoading } = useSelector(
    (state) => state.purchaseExpence
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
      typeSelection: "Vendor",
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const typeSelection = useWatch({
    control,
    name: "typeSelection",
  })
  const vendorId = useWatch({ control, name: "vendorId", defaultValue: "" });
  const { AssetTypeListData } = useSelector(
    (state) => state.AssetType
  );
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { expenseTypeList } = useSelector((state) => state.expenceHead);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { vendorDataList, totalVendorCount, loading: vendorListLoading } = useSelector(state => state.vendor)
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachments: []
  });
  const { purchaseExpenceDetails } = useSelector(
    (state) => state.purchaseExpence
  );
  useEffect(() => {
    dispatch(getpurchaseExpenceDetails({
      _id: purchaseExpenceId
    }))
  }, [purchaseExpenceId])

  const onSubmit = (data) => {
    const finalPayload = {
      _id: purchaseExpenceId,
      companyId: purchaseExpenceDetails?.companyId,
      branchId: purchaseExpenceDetails?.branchId,
      directorId: purchaseExpenceDetails?.directorId,
      "vendorId": data?.vendorId,
      "expenseHeadId": data?.expencehead?.value,
      quantity: typeSelection === "Vendor" ? + data?.quantity : '',
      assetNameId: typeSelection === "Vendor" ? purchaseExpenceDetails?.assetNameId : '',
      "assetName": purchaseExpenceDetails?.assetName || '',
      // "assetName": typeSelection === "Vendor" ?  AssetTypeListData?.find((item) => item?._id === data?.assetNameId)?.name : '',
      "totalAmount": + data?.amount,
      "totalGSTAmount": + data?.gstAmount,
      "grandTotal": +  data?.totalAmount,
      "purchaseDate": dayjs(data?.date).format("YYYY-MM-DD"),
      "status": "Pending",
      "purchaseType": data?.typeSelection,
      attachment: formData?.attachments,
      vendorOtherName: data?.Name
    };
    dispatch(updatepurchaseExpence(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev?.attachments || [], res?.payload?.data]
        }));
      }
    });
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const updatedAttachments = prev?.attachments.filter((_, i) => i !== index);
      return { ...prev, attachments: updatedAttachments };
    });
  };


  useEffect(() => {
    setValue('typeSelection', "Vendor")
  }, [])
  useEffect(() => {
    setValue('totalAmount', Number(watch('amount')) + Number(watch('gstAmount')))
  }, [watch('amount'), watch('gstAmount')])
  const handleFocusVendor = () => {
    dispatch(
      vendorSearch({
        companyId: purchaseExpenceDetails?.companyId,
        branchId: purchaseExpenceDetails?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );
  };


  // "vendorId": data?.vendorId,
  // "expenseHeadId": data?.expencehead?.value,
  // "assetName": data?.assetName,
  // "totalAmount": + data?.amount,
  // "totalGSTAmount": + data?.gstAmount,
  // "grandTotal": +  data?.totalAmount,
  // "purchaseDate": data?.date,
  // "status": "Pending",
  // "purchaseType": data?.typeSelection,
  // "attachment": attachment


  useEffect(() => {
    if (purchaseExpenceDetails) {
      setValue("typeSelection", purchaseExpenceDetails?.purchaseType)
      setValue("quantity", purchaseExpenceDetails?.quantity)
      setValue("Name", purchaseExpenceDetails?.vendorOtherName)
      setValue("amount", purchaseExpenceDetails?.totalAmount)
      setValue("naration", purchaseExpenceDetails?.naration)
      setValue("fileUploadLink", purchaseExpenceDetails?.attachment)
      setValue("gstAmount", purchaseExpenceDetails?.totalGSTAmount)
      setValue("totalAmount", purchaseExpenceDetails?.grandTotal)
      // setAttachments(purchaseExpenceDetails?.attachment)
      setValue("date", dayjs(purchaseExpenceDetails?.purchaseDate))
      setFormData({
        attachments: purchaseExpenceDetails?.attachment
      });
      setValue("assetNameId", purchaseExpenceDetails?.assetName)


      purchaseExpenceDetails?.expenseHeadId && dispatch(expenseTypeSearch({
        directorId: "",
        companyId: purchaseExpenceDetails?.companyId,
        branchId: purchaseExpenceDetails?.branchId,
        text: "",
        sort: true,
        status: "",
        isPagination: false,
      }
      )).then((response) => {
        if (!response.error) {
          const selectedEmployees = response?.payload?.data?.docs
            ?.find((employee) => purchaseExpenceDetails?.expenseHeadId === employee._id)
          const employeepayload = {
            value: selectedEmployees?._id,
            label: selectedEmployees?.name,
          }
          setValue("expencehead", employeepayload)
        }

      })
      purchaseExpenceDetails?.vendorId && dispatch(vendorSearch({
        companyId: purchaseExpenceDetails?.companyId,
        branchId: purchaseExpenceDetails?.branchId,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      }
      )).then((response) => {
        if (!response.error) {
          const selectedEmployees = response?.payload?.data?.docs
            ?.find((employee) => purchaseExpenceDetails?.vendorId === employee._id)

          setValue("vendorId", selectedEmployees?._id)
        }

      })



    }
  }, [purchaseExpenceDetails])

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-span-2">

            <Controller
              name="typeSelection"
              control={control}
              rules={{ required: "Client Selection Type is required" }}
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
                  <Radio value="Vendor">Asset</Radio>
                  <Radio value="Other">Other</Radio>
                </Radio.Group>
              )}
            />
            {errors.clientSelection && (
              <p className="text-red-500 text-sm">
                {errors.clientSelection.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Vendor {typeSelection === "Vendor" && <span className="text-red-600">*</span>}
              </label>

              <Controller
                control={control}
                name="vendorId"
                rules={{ required: typeSelection === "Vendor" ? " vendor is required" : false }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    onFocus={handleFocusVendor}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Vendor</Select.Option>
                    {vendorListLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (vendorDataList?.map((elment, index) => (
                      <option value={elment?._id}>{elment?.fullName}</option>
                    )))}
                  </Select>
                )}
              />

              {errors.vendorId && (
                <p className="text-red-500 text-sm">
                  {errors.vendorId.message}
                </p>
              )}
            </div>
            {typeSelection === "Other" &&
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Name<span className="text-red-600">*</span>
                </label>
                <textarea

                  {...register("Name", {
                    required: "Name is required",

                  })}
                  className={` ${inputClassName} ${errors.Name ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Name"
                ></textarea>
                {errors.Name && (
                  <p className="text-red-500 text-sm">
                    {errors.Name.message}
                  </p>
                )}
              </div>
            }
            {typeSelection === "Vendor" &&
              <>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Asset Name  <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("assetNameId", {
                      required: "Asset Name is required",


                    })}
                    disabled
                    className={` ${inputDisabledClassName} ${errors.quantity ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter AssetName"
                  />

                  {errors.assetNameId && (
                    <p className="text-red-500 text-sm">
                      {errors.assetNameId.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Quantity<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    {...register("quantity", {
                      required: "Quantity is required",

                    })}
                    disabled
                    className={` ${inputDisabledClassName} ${errors.quantity ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Enter Quantity"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm">
                      {errors.quantity.message}
                    </p>
                  )}
                </div>
              </>
            }
            {useWatch({
              control,
              name: "typeSelection"
            }) === "Other" && <div className="w-full">
                <label className={`${inputLabelClassName}`}>Expense Head</label>
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
                      }}
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Gst Amount
              </label>
              <input
                type="number"
                step="0.01"
                {...register("gstAmount")}
                className={` ${inputClassName} ${errors.gstAmount ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Gst Amount"
              />
              {errors.gstAmount && (
                <p className="text-red-500 text-sm">
                  {errors.gstAmount.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"
                disabled
                {...register("totalAmount")}
                className={` ${inputDisabledClassName} ${errors.totalAmount ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Total Amount"
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>Bill Date</label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isAfter(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.date && <p className="text-red-500 text-sm"> Bill Date is required</p>}
            </div>
            {/* <div className="">
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
            </div> */}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Documents
              </label>
              {!isPreview ? (
                <div className="space-y-4">
                  <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 bg-white cursor-pointer">
                    <FaRegFile className="mr-2" /> Add Documents
                  </label>

                  <div className="space-y-2">
                    {formData?.attachments?.map((file, index) => (
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
              disabled={purchaseLoading}
              className={`${purchaseLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {purchaseLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default Editpurchaseandexpence;
