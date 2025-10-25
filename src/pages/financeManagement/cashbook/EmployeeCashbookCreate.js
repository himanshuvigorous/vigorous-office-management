import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputerrorClassNameAutoComplete, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { AutoComplete, Input, Select } from "antd";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../../global/address/city/CityFeatures/_city_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createcashbook } from "./cashbookFeature/_cashbook_reducers";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { FaRegFile, FaTimes } from "react-icons/fa";


const EmployeeCashbookCreate = () => {

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
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { expenseTypeList } = useSelector((state) => state.expenceHead);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { loading: cashbookLoading } = useSelector(
    (state) => state.cashbook
  );

  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachment: []
  });

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.companyId,
      directorId: userInfoglobal?.directorId,
      branchId: userInfoglobal?.branchId,
      "employeId": userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
      "expenseTypeId": data?.expencehead?.value,
      "expenseFor": 'Employe',
      "amount": + data?.amount,
      "naration": data?.naration,
      // "attachment": data?.fileUploadLink,
      "GSTamount": 0,
      "totalAmount": + data?.amount,
      date: data?.date,
      status: "Pending",
      attachment: formData?.attachment,
    };
    dispatch(createcashbook(finalPayload)).then((data) => {
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

  // const handleFileChange = (file) => {
  //   dispatch(
  //     fileUploadFunc({
  //       filePath: file,
  //       isVideo: false,
  //       isMultiple: false,
  //     })
  //   ).then((data) => {
  //     if (!data.error) {
  //       setValue('fileUploadLink', data?.payload?.data)
  //     }
  //   });
  // };

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
          attachment: [...prev.attachment, res.payload?.data]
        }));
      }
    });
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const updatedAttachments = prev.attachment.filter((_, i) => i !== index);
      return { ...prev, attachment: updatedAttachments };
    });
  };

  useEffect(() => {
    setValue('totalAmount', Number(watch('amount')) + Number(watch('gstAmount')))
  }, [watch('amount'), watch('gstAmount')])


  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2 md:my-1 px-3 md:mt-4">
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Expence Head</label>
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
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Amount <span className="text-red-600">*</span>
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
                Naration <span className="text-red-600">*</span>
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
              <label className={`${inputLabelClassName}`}>Bill Date</label>
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
                    {formData.attachment.map((file, index) => (
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

export default EmployeeCashbookCreate;
