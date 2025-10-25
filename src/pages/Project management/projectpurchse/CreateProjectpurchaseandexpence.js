import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { customDayjs, domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect } from "../../../constents/global";
import { Select } from "antd";
import ReactSelect from "react-select";
import { FaRegFile, FaTimes } from "react-icons/fa";
import moment from "moment";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { createprojetpurchaseExpence } from "./projectpurchseFeature/_projectpurchseFeature_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { vendorSearch } from "../../financeManagement/vendor/vendorFeatures/_vendor_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import ListLoader from "../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import { accountantSearch } from "../accountantmanagement/accountManagentFeatures/_accountManagement_reducers";
import Swal from "sweetalert2";



const CreateProjectpurchaseandexpence = () => {
  const { loading: purchaseLoading } = useSelector((state) => state.projectpurchaseExpence);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      typeSelection: "Vendor",
    }
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { expenseTypeList } = useSelector((state) => state.expenceHead);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const vendorId = useWatch({ control, name: "vendorId", defaultValue: "" });
  const { vendorDataList, loading: vendorListLoading } = useSelector(state => state.vendor)
  const { accountantList: accountants, loading: loadingAccountants } = useSelector((state) => state.accountManagement);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachment: []
  });
  const paymentMethod = useWatch({
    control,
    name: "paymentMethod",
    defaultValue: "",
  });
  const accountant = useWatch({
    control,
    name: "accountant",
    defaultValue: "",
  });




  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin"
        ? data?.PDCompanyId
        : userInfoglobal?.userType === "company"
        ? userInfoglobal?._id
        : userInfoglobal?.companyId,
  
      directorId: userInfoglobal?.userType === "companyDirector"
        ? userInfoglobal?._id
        : userInfoglobal?.directorId,
  
      branchId:
        userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ||
        userInfoglobal?.userType === "company"
          ? data?.PDBranchId
          : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
  
      vendorId: data?.vendorId,
      expenseHeadId: data?.expencehead?.value,
      accountentId: data?.accountant,
      userId: accountants?.find((acc) => acc._id === accountant)?.accountentData?._id,
      bankAccountId: data?.bankAccountId,
      paymentMethod: data?.paymentMethod,
      paymentReference: data?.paymentReference,
      vendorName: data?.Name,
      totalAmount: +data?.totalAmount,
      totalGSTAmount: 0,
      grandTotal: +data?.totalAmount,
      date: customDayjs(data?.paymentDate),
      remark: data?.remark,
      attachment: formData?.attachments,
    };

    Swal.fire({
      title: 'Are you sure?',
      text: 'Once submitted, this entry cannot be edited. Do you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, submit it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(createprojetpurchaseExpence(finalPayload)).then((data) => {
          if (!data.error) navigate(-1);
        });
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
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])

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

  const handleFocusVendor = () => {
    dispatch(
      vendorSearch({
        companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );
  };
  useEffect(() => {
    if (vendorId) {
      const vendorData = vendorDataList?.find((item) => item?._id === vendorId)
      setValue('Name', vendorData ? vendorData?.fullName : '')
    } else {
      setValue('Name', '')
    }
  }, [vendorId])



  useEffect(() => {

    setValue("paymentMethod", "Cash")
    dispatch(accountantSearch({
      directorId: "",
      companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      text: "",
      sort: true,
      status: true,
      isPagination: false,
    }))

  }, []);
  const Option = Select.Option;
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">


            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
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


            <div className="">
              <label className={`${inputLabelClassName}`}>
                Vendor
              </label>

              <Controller
                control={control}
                name="vendorId"

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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Name<span className="text-red-600">*</span>
              </label>
              <input

                {...register("Name", {
                  required: "Name is required",

                })}
                className={` ${inputClassName} ${errors.Name ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Name"
              />
              {errors.Name && (
                <p className="text-red-500 text-sm">
                  {errors.Name.message}
                </p>
              )}
            </div>

            <div className="w-full">
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
            </div>


            <div className="">
              <label className={`${inputLabelClassName}`}>
                Total Amount
              </label>
              <input
                type="number"
                step="0.01"

                {...register("totalAmount")}
                className={` ${inputClassName} ${errors.totalAmount ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Total Amount"
              />
              {errors.totalAmount && (
                <p className="text-red-500 text-sm">
                  {errors.totalAmount.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Accountant <span className="text-red-600">*</span>
              </label>
              <Controller
                name="accountant"
                control={control}
                rules={{ required: "Accountant is required" }}
                render={({ field }) => (
                  <Select
                    placeholder="Select accountant"
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
                      <Option key={acc?._id} value={acc?._id}>
                        {acc?.accountentData?.fullName}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              {errors.accountant && (
                <p className="text-red-500 text-sm">{errors.accountant.message}</p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>
                Payment Method <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="paymentMethod"
                rules={{ required: "Payment method is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} `}
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    {['Cash', 'Cheque', 'Card', 'Bank', 'Online', 'Other']?.map((bank) => (
                      <Select.Option key={bank} value={bank}>
                        {bank}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm">{errors.paymentMethod.message}</p>
              )}
            </div>

            {paymentMethod !== "Cash" && (
              <div>
                <label className={`${inputLabelClassName}`}>
                  Bank Account
                </label>
                <Controller
                  control={control}
                  name="bankAccountId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} `}
                      getPopupContainer={(trigger) => trigger.parentNode}
                    >
                      <Select.Option value="">Select Bank Account</Select.Option>
                      {accountants?.find((acc) => acc._id === accountant)?.bankAccountData?.map((bank) => (
                        <Select.Option key={bank._id} value={bank._id}>
                          {optionLabelForBankSlect(bank)}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.bankAccountId && (
                  <p className="text-red-500 text-sm">{errors.bankAccountId.message}</p>
                )}
              </div>
            )}

            <div>
              <label className={`${inputLabelClassName}`}>
                Payment Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="paymentDate"
                control={control}
                rules={{ required: "Payment date is required" }}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      return current && current.isAfter(moment(), 'day');
                    }}
                  />
                )}
              />
              {errors.paymentDate && (
                <p className="text-red-500 text-sm">Payment date is required</p>
              )}
            </div>



            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Payment Reference
              </label>
              <input
                type="text"
                {...register("paymentReference")}
                className={inputClassName}
                placeholder="e.g. TRANS123456789"
              />
              {errors.paymentReference && (
                <p className="text-red-500 text-sm">{errors.paymentReference.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Remarks
              </label>
              <textarea
                {...register("remark")}
                rows={3}
                className={inputClassName}
                placeholder="Additional notes (optional)"
              />
            </div>
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

export default CreateProjectpurchaseandexpence;
