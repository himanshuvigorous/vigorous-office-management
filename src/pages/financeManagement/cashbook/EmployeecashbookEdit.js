import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getcashbookDetails, updatecashbook } from "./cashbookFeature/_cashbook_reducers";
import { decrypt } from "../../../config/Encryption";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import { FaRegFile, FaTimes } from "react-icons/fa";

const EmployeecashbookEdit = () => {
  const { loading: cashbookLoading } = useSelector(
    (state) => state.cashbook
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { employeList } = useSelector((state) => state.employe);

  const { expenseTypeList } = useSelector((state) => state.expenceHead);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { cashbookDetails } = useSelector(
    (state) => state.cashbook
  );

  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachments: []
  });

  const { cashbookIdEnc } = useParams();
  const cashbookId = decrypt(cashbookIdEnc);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: cashbookId,
      companyId: cashbookDetails?.companyId,
      directorId: cashbookDetails?.directorId,
      branchId: cashbookDetails?.branchId,
      "employeId": cashbookDetails?.employeId,
      "expenseTypeId": data?.expencehead?.value,
      "expenseFor": data?.expenseFor,
      "amount": + data?.amount,
      "naration": data?.naration,
      // "attachment": data?.fileUploadLink,
      "GSTamount": 0,
      "totalAmount": + data?.amount,
      date: data?.date,
      attachment: formData?.attachments,
    };
    dispatch(updatecashbook(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  // useEffect(() => {
  //   if (
  //     CompanyId ||
  //     userInfoglobal?.userType === "company" ||
  //     userInfoglobal?.userType === "companyDirector"
  //   ) {
  //     dispatch(
  //       branchSearch({
  //         text: "",
  //         sort: true,
  //         status: true,
  //         companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
  //       })
  //     );
  //   }
  // }, [CompanyId])
  // useEffect(() => {
  //   if (userInfoglobal?.userType === "admin") {
  //     dispatch(
  //       companySearch({
  //         text: "",
  //         sort: true,
  //         status: true,
  //         isPagination: false,
  //       })
  //     );
  //   }
  // }, []);
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
    dispatch(getcashbookDetails({
      _id: cashbookId
    }))
  }, [])

  useEffect(() => {
    if (cashbookDetails) {
      setValue("expenseFor", cashbookDetails?.expenseFor)
      setValue("amount", cashbookDetails?.amount)
      setValue("naration", cashbookDetails?.naration)
      // setValue("fileUploadLink", cashbookDetails?.attachment)
      setValue("gstAmount", cashbookDetails?.GSTamount)
      setValue("totalAmount", cashbookDetails?.totalAmount)
      setValue("date", dayjs(cashbookDetails?.date))
      setFormData({
        attachments: cashbookDetails?.attachment
      });

      const reqPayload = {
        text: "",
        status: true,
        sort: true,
        isTL: "",
        isHR: "",
        isPagination: false,
        departmentId: '',
        designationId: '',
        companyId: cashbookDetails?.companyId,
        branchId: cashbookDetails?.branchId,
      };

      dispatch(employeSearch(reqPayload)).then((response) => {
        if (!response.error) {
          const selectedEmployees = response?.payload?.data?.docs?.find((employee) => cashbookDetails?.employeId === employee._id)
          setValue("employee", { value: selectedEmployees._id, label: selectedEmployees.fullName })
        }
      })
      dispatch(expenseTypeSearch({
        directorId: "",
        companyId: cashbookDetails?.companyId,
        branchId: cashbookDetails?.branchId,
        text: "",
        sort: true,
        status: "",
        isPagination: false,
      }
      )).then((response) => {
        if (!response.error) {
          const selectedEmployees = response?.payload?.data?.docs
            ?.find((employee) => cashbookDetails?.expenseTypeId === employee._id)
          const employeepayload = {
            value: selectedEmployees?._id,
            label: selectedEmployees?.name,
          }
          setValue("expencehead", employeepayload)
        }
      })
    }
  }, [cashbookDetails])

  useEffect(() => {
    setValue('totalAmount', Number(watch('amount')) + Number(watch('gstAmount')))
  }, [watch('amount'), watch('gstAmount')])

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Expence Head</label>
              <Controller
                name="expencehead"
                control={control}
                rules={{ required: "Expence Head is required" }}
                render={({ field }) => (
                  <ReactSelect

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
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Gst Amount
              </label>
              <input
                type="number"
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
            </div> */}
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Total Amount
              </label>
              <input
                type="number"
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
            </div> */}
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
            <div>
              <label className={`${inputLabelClassName}`}>Date</label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                    disabledDate={(current) => {
                      if (!current) return true;

                      const today = dayjs().startOf('day');
                      const currentDate = current.startOf('day');
                      const dayOfMonth = today.date();

                      if (dayOfMonth <= 5) {
                        // --- Last 5 days of previous month ---
                        const prevMonth = today.subtract(1, 'month');
                        const endOfPrevMonth = prevMonth.endOf('month').startOf('day');
                        const startOfLast5PrevMonth = prevMonth
                          .date(endOfPrevMonth.date() - 4)
                          .startOf('day');

                        const isInLast5PrevMonth =
                          (currentDate.isAfter(startOfLast5PrevMonth) || currentDate.isSame(startOfLast5PrevMonth)) &&
                          (currentDate.isBefore(endOfPrevMonth) || currentDate.isSame(endOfPrevMonth));

                        // --- Current month: 1st to today ---
                        const startOfCurrentMonth = today.startOf('month');
                        const isFromStartToToday =
                          (currentDate.isAfter(startOfCurrentMonth) || currentDate.isSame(startOfCurrentMonth)) &&
                          (currentDate.isBefore(today) || currentDate.isSame(today));

                        return !(isInLast5PrevMonth || isFromStartToToday);
                      } else {
                        // After 5th of month: allow only past dates in current month
                        const startOfCurrentMonth = today.startOf('month');

                        const isInCurrentMonth =
                          (currentDate.isAfter(startOfCurrentMonth) || currentDate.isSame(startOfCurrentMonth)) &&
                          (currentDate.isBefore(today) || currentDate.isSame(today));

                        return !isInCurrentMonth;
                      }
                    }}
                  />
                )}
              />
              {errors.date && <p className="text-red-500 text-sm">Date is required</p>}
            </div>
            {/* <div>
              <label className={`${inputLabelClassName}`}>
                File  Upload
              </label>

              <Controller
                name="fileUpload"
                control={control}

                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFileChange(e.target.files[0]);
                      }}
                    />
                    <br />
                    <label
                      htmlFor="file-upload"
                      className="bg-header text-white mt-2 py-1.5 px-3 text-nowrap text-sm rounded cursor-pointer"
                    >
                      File Upload
                    </label>
                    {errors.fileUpload && (
                      <p className="text-red-600 text-sm mt-1">{errors.fileUpload.message}</p>
                    )}
                  </>
                )}
              />
              {watch('fileUploadLink') && <img
                src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${watch('fileUploadLink')}`}
                alt="Uploaded"
                className="w-20 h-20 shadow rounded-sm"
              />}
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
              disabled={cashbookLoading}
              className={`${cashbookLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {cashbookLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EmployeecashbookEdit;
