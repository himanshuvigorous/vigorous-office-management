import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { customDayjs, domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputerrorClassNameAutoComplete, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
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


const CreateCashbook = () => {

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

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { employeList } = useSelector((state) => state.employe);
  const { countryListData } = useSelector((state) => state.country);
  const { stateListData } = useSelector((state) => state.states);
  const { cityListData } = useSelector((state) => state.city);
  const { expenseTypeList } = useSelector((state) => state.expenceHead);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });

  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({
    attachment: []
  });

  const { loading: cashbookLoading } = useSelector(
    (state) => state.cashbook
  );

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      "employeId": userInfoglobal?.userType !== "employe" ? data?.employee?.value : userInfoglobal?.userType === "employe" ? userInfoglobal?._id : null,
      "expenseTypeId": data?.expencehead?.value,
      "expenseFor": 'Employe',
      "amount": + data?.amount,
      "naration": data?.naration,
      // "attachment": data?.fileUploadLink,
      "GSTamount": 0,
      "totalAmount": + data?.amount,
       date: customDayjs(data?.date),
      
      status: "Approved",
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
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-2 md:my-1 md:mt-4">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>
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

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>
                Expence For<span className="text-red-600">*</span>
              </label>
              <select
                {...register("expenseFor",)}
                className={`${inputClassName}  ${errors.expenseFor
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
              >
                <option value=''>
                  select Type
                </option>
                <option value='head'>
                  Expence Head
                </option>
                <option value='employe'>
                  Employee
                </option>
              </select>
              {errors.expenseFor && (
                <p className="text-red-500 text-sm">
                  {errors.expenseFor.message}
                </p>
              )}
            </div> */}
            <div className="w-full">
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
            </div>
            {userInfoglobal?.userType !== "employe" && <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee  <span className="text-red-600">*</span></label>
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
            </div>}
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
                render={({ field }) => {
                  return (
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
                  );
                }}
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
              className={`${cashbookLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {cashbookLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateCashbook;