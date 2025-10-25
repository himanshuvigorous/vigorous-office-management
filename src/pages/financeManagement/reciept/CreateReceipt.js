import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { customDayjs, domainName, getDefaultFinacialYear, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect, optionLabelForBankSlect, sortByPropertyAlphabetically } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { createreceipt } from "./receiptFeature/_receipt_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { Select } from "antd";
import { invoiceSearch, } from "../invoice/invoiceFeature/_invoice_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { MdDelete } from "react-icons/md";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";


const CreateReceipt = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      heads: [{ headType: "invoice" ,financialYear:getDefaultFinacialYear()}],
    },
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const groupName = useWatch({
    control,
    name: "groupName",
    defaultValue: "",
  });

  const grandTotal = useWatch({
    control,
    name:'grandTotal',
    defaultValue:''
  })

  const { loading: receiptLoading } = useSelector(
    (state) => state.receipt
  );


  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });

  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
    const { clientList, loading: clientLoading } = useSelector((state) => state.client);
  const { clientGroupList, groupSearchLoading } = useSelector((state) => state.clientGroup);
  const { invoiceListData, loading: invoiceLoading } = useSelector((state) => state.invoice);
  const { departmentListData, loading: departmentLoading } = useSelector((state) => state.department);
    const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "heads",
  });
  const onSubmit = (data) => {
    const clientHeads = data?.heads
      ?.filter((item) => item?.headType === "invoice")
      ?.map((item) => ({
        headType: "invoice",
        invoiceId: item?.invoiceId,
        subHeadId: null,
        description: item?.description,
        amount: +item?.amount,
        financialYear: "-",
        type: "",
        monthName: "",
        monthQuaters: "",
      }));
    const invoiceHeads = data?.heads
      ?.filter((item) => item?.headType === "client")
      ?.map((item) => ({
        headType: item?.headType,
        invoiceId: null,
        subHeadId: item?.subHeadId,
        description: item?.description,
        amount: +item?.amount,
        financialYear: item?.financialYear,
        type: item?.type,
        monthName: item?.monthName,
        monthQuaters: item?.monthQuaters,
      }));

    const finalPayload = {
      companyId:
        userInfoglobal?.userType === "admin"
          ? data?.PDCompanyId
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
          ? data?.PDBranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      receiptLayoutId: data?.invoiceLayout,
      clientId: data?.client,
      groupId: data?.groupName,
      employeId: (grandTotal > 0) ? (data?.type === "cash" ? data?.employeeId?.value : ''):'',
      bankAccId:grandTotal > 0 ? ( data?.type !== "cash" ? data?.bankId : '') : '',
      naration: data?.naration,
      advancedAvailableId: "",
      heads: [...clientHeads, ...invoiceHeads],
      date: customDayjs(data?.date),
      subTotalAmount: data?.totalAmount,
      isTDS: data?.isTDS ? data?.isTDS : false,
      TDSAmount: data?.isTDS?  +data?.tds : 0,
      isDiscount: data?.isDiscountApplicable,
      discountAmount: data?.isDiscountApplicable ?  +data?.discount : 0,
      advancedAvailable: data?.maxAdvance,
      isAdvanced: data?.isAdvance ? data?.isAdvance : false,
      advancedAdjust: +data?.advance,
      totalAmount: data?.totalBeforeGrand,
      grandTotalAmount: data?.grandTotal,
      paymentmode: grandTotal > 0 ? (data?.type) :'',
      chequeNumber:grandTotal > 0 ? (data?.type === "cheque" ? data?.chequeNo : '') :'',
      transectionNumber: grandTotal > 0 ?(data?.type === "bank" ? data?.transactionNo :''):''
    };
    dispatch(createreceipt(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };
  const handleAdvanceChange = (e) => {
    if (!maxAdvance) {
      showNotification({
        message: 'No advance available',
        type: 'success',
      });
      setValue('isAdvance', false);
    } else {
      setValue('isAdvance', e.target.checked);
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
  const handleNumberInput = (fieldName, maxValue = null) => (e) => {
    let value = parseFloat(e.target.value) || 0;
    if (value < 0) {
      value = 0;
    }
    if (maxValue !== null && value > maxValue) {
      value = maxValue;
    }
    setValue(fieldName, value, { shouldValidate: true });
  };

  const handleFocusClientGrp = () => {
    dispatch(
      clientGrpSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? watch("PDCompanyId")
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? watch("PDBranchId")
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        groupId: "",
      })
    );
  };
  useEffect(() => {
    if (
      BranchId ||
      (userInfoglobal?.userType !== "company" &&
        userInfoglobal?.userType !== "companyDirector" &&
        userInfoglobal?.userType !== "admin")
    ) {
      dispatch(
        getBranchDetails({
          _id:
            userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector" ||
              userInfoglobal?.userType === "admin"
              ? BranchId
              : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId,
        })
      );
    }
  }, [BranchId]);
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
  };


  const getinvoicerequest = () => {
    const data = {
      directorId: "",
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
      clientId: watch("client"),
      text: "",
      sort: true,
      status: "PendingPayment",
      isPagination: true,
    };
    dispatch(invoiceSearch(data));
  };
  const generateFinancialYears = () => {
    const startYear = 2005;
    const endYear = 2034;
    const financialYears = [];
    for (let year = startYear; year <= endYear; year++) {
      financialYears.push(`${year}-${year + 1}`);
    }
    return financialYears;
  };
  const financialYears = generateFinancialYears();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sept", "Oct-Dec"];

  const totalAmount = watch("totalAmount") || 0;
  const discount = watch("discount") || 0;
  const tds = watch("tds") || 0;
  const advance = watch("advance") || 0;
  const isDiscountApplicable = watch("isDiscountApplicable");
  const isTDS = watch("isTDS");
  const isAdvance = watch("isAdvance");
  const maxAdvance = watch("maxAdvance") || 0;

  useEffect(() => {
    // Calculate the grand total when values change
    let calculatedTotal = totalAmount;

    // Apply discount if applicable
    if (isDiscountApplicable) {
      calculatedTotal -= discount;
    }

    // Apply TDS if applicable
    if (isTDS) {
      calculatedTotal -= tds;
    }

    setValue("totalBeforeGrand", calculatedTotal);
    // Apply advance if applicable, ensuring it's not higher than maxAdvance
    if (isAdvance) {
      calculatedTotal -= advance;
    }

    // Set the grand total
    setValue("grandTotal", calculatedTotal);
  }, [
    totalAmount,
    discount,
    tds,
    advance,
    isDiscountApplicable,
    isTDS,
    isAdvance,
    maxAdvance,
    setValue,
  ]);

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
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
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
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
                        </Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
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
                </div>
              )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Group Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="groupName"
                rules={{ required: "Group Name is required" }}
                render={({ field }) => (
                  <Select
                    // {...register("groupName", {
                    //   required: "Organization type is required",
                    // })}
                    {...field}
                    defaultValue={""}

                     showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    className={` ${inputAntdSelectClassName} ${errors.groupName
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    onFocus={() => handleFocusClientGrp()}
                    onChange={(value) => {
                      setValue(
                        "maxAdvance",
                        clientGroupList?.find((client) => client?._id === value)
                          ?.advancedBalance
                      );

                      dispatch(
                        clientSearch({
                          companyId:
                            userInfoglobal?.userType === "admin"
                              ? watch("PDCompanyId")
                              : userInfoglobal?.userType === "company"
                                ? userInfoglobal?._id
                                : userInfoglobal?.companyId,
                          branchId:
                            userInfoglobal?.userType === "company" ||
                              userInfoglobal?.userType === "admin" ||
                              userInfoglobal?.userType === "companyDirector"
                              ? watch("PDBranchId")
                              : userInfoglobal?.userType === "companyBranch"
                                ? userInfoglobal?._id
                                : userInfoglobal?.branchId,


                          directorId: "",
                          organizationId: "",
                          industryId: "",
                          groupId: value,
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        })
                      );
                      // .then((data) => {
                      //   if (!data?.error) {
                      //     setValue('client', data?.payload?.data?.docs?.map((client) => {
                      //       return ({
                      //         value: client._id,
                      //         label: client.fullName
                      //       })
                      //     }))
                      //   }
                      // })
                      field?.onChange(value);
                    }}
                  >
                    <Select.Option className="text-xs" value="">
                      Select Group Type
                    </Select.Option>
                    {groupSearchLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(clientGroupList, 'fullName')?.map((elment, index) => (
                      <Select.Option value={elment?._id}>
                        {elment?.fullName}({elment?.groupName})
                      </Select.Option>
                    )))}
                  </Select>
                  // <Select
                  //   {...field}
                  //   defaultValue={""}
                  //   className={`${inputAntdSelectClassName} `}
                  // >
                  //   <Select.Option value="">Select Branch</Select.Option>
                  //   {branchList?.map((type) => (
                  //     <Select.Option key={type?._id} value={type?._id}>
                  //       {type?.fullName}
                  //     </Select.Option>
                  //   ))}
                  // </Select>
                )}
              />
              {/* <select
                {...register("groupName", {
                  required: "Organization type is required",
                })}
                className={` ${inputClassName} ${errors.groupName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                onFocus={() => handleFocusClientGrp()}
                onChange={(e) => {
                  setValue("maxAdvance", clientGroupList?.find((client) => client?._id === e.target.value)?.advancedBalance)

                  dispatch(clientSearch({
                    companyId:
                      userInfoglobal?.userType === "admin"
                        ? watch("PDCompanyId")
                        :
                        userInfoglobal?.userType === "company"
                          ? userInfoglobal?._id
                          : userInfoglobal?.companyId,
                    branchId:
                      userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? watch("PDBranchId") : userInfoglobal?.userType === "companyBranch"
                        ? userInfoglobal?._id
                        : userInfoglobal?.branchId,

                    "directorId": "",
                    "organizationId": "",
                    "industryId": "",
                    groupId: e.target.value,
                    "text": "",
                    "sort": true,
                    "status": true,
                    "isPagination": false,
                  }))
                  // .then((data) => {
                  //   if (!data?.error) {
                  //     setValue('client', data?.payload?.data?.docs?.map((client) => {
                  //       return ({
                  //         value: client._id,
                  //         label: client.fullName
                  //       })
                  //     }))
                  //   }
                  // })
                }}
              >
                <option className="text-xs" value="">
                  Select Group Type
                </option>
                {clientGroupList?.map((elment, index) => (
                  <option value={elment?._id}>{elment?.fullName}({elment?.groupName})</option>
                ))}
              </select> */}
              {errors.groupName && (
                <p className="text-red-500 text-sm">
                  {errors.groupName.message}
                </p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Client <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="client"
                rules={{ required: "client is required" }}

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
                    <Select.Option value="">Select client</Select.Option>
                    {clientLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> :
                      (sortByPropertyAlphabetically(clientList, 'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                  </Select>
                )}
              />
              {/* <select
                {...register("client", {
                  required: "Client is required",
                })}
                className={` ${inputClassName} ${errors.client
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}

              >
                <option className="text-xs" value="">
                  Select Client
                </option>
                {clientList?.map((elment, index) => (
                  <option value={elment?._id}>{elment?.fullName}</option>
                ))}
              </select> */}
              {errors.client && (
                <p className="text-red-500 text-sm">{errors.client.message}</p>
              )}
            </div>
            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Firm Layout Name<span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="invoiceLayout"
                rules={{ required: "Layout Name is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                     showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    className={` ${inputAntdSelectClassName} ${errors.invoiceLayout
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                    onFocus={() => {
                      dispatch(
                        officeAddressSearch({
                          companyId:
                            userInfoglobal?.userType === "admin"
                              ? watch("PDCompanyId")
                              : userInfoglobal?.userType === "company"
                                ? userInfoglobal?._id
                                : userInfoglobal?.companyId,
                          branchId:
                            userInfoglobal?.userType === "company" ||
                              userInfoglobal?.userType === "admin" ||
                              userInfoglobal?.userType === "companyDirector"
                              ? watch("PDBranchId")
                              : userInfoglobal?.userType === "companyBranch"
                                ? userInfoglobal?._id
                                : userInfoglobal?.branchId,
                          directorId: "",
                          text: "",
                          sort: true,
                          status: true,
                          type: "invoice",
                          isPagination: false,
                          bankAccountId: "",
                          isGSTEnabled: "",
                        })
                      );
                    }}
                  >
                    <Select.Option className="" value="">
                      Select Layout
                    </Select.Option>

                    {officeAddressLoading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (sortByPropertyAlphabetically(officeAddressListData, 'firmName')?.map((element) => (
                      <Select.Option value={element?._id}>
                        {element?.firmName}
                      </Select.Option>
                    )))}
                  </Select>
                  // <Select
                  //   {...field}
                  //   defaultValue={""}
                  //   className={`${inputAntdSelectClassName} `}
                  // >
                  //   <Select.Option value="">Select Branch</Select.Option>
                  //   {branchList?.map((type) => (
                  //     <Select.Option key={type?._id} value={type?._id}>
                  //       {type?.fullName}
                  //     </Select.Option>
                  //   ))}
                  // </Select>
                )}
              />
              {/* <select
                {...register("invoiceLayout", {
                  required: "Task Name is required",
                })}
                className={` ${inputClassName} ${errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
                  }`}
                onFocus={() => {
                  dispatch(
                    officeAddressSearch({
                      companyId:
                        userInfoglobal?.userType === "admin"
                          ? watch("PDCompanyId")
                          : userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId,
                      branchId:
                        userInfoglobal?.userType === "company" ||
                          userInfoglobal?.userType === "admin" ||
                          userInfoglobal?.userType === "companyDirector"
                          ? watch("PDBranchId")
                          : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId,
                      directorId: "",
                      text: "",
                      sort: true,
                      status: true,
                      type: "receipt",
                      isPagination: false,
                      bankAccountId: "",
                      isGSTEnabled: "",
                    })
                  );
                }}
              >
                <option className="" value="">
                  Select Layout
                </option>

                {officeAddressListData?.map((element) => (
                  <option value={element?._id}>{element?.firmName}</option>
                ))}
              </select> */}
              {errors.invoiceLayout && (
                <p className="text-red-500 text-sm">
                  {errors.invoiceLayout.message}
                </p>
              )}
            </div>
          </div>
          <div>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-300 rounded-md my-2"
              >
                <div className="flex justify-end bg-header rounded-t-md p-4">
                  <button
                    className="text-white"
                    size={20}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <MdDelete />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Head Type
                    </label>
                    {/* <select
                      {...register(`heads[${index}].headType`, { required: "Head type is required" })}
                      defaultValue={item.headType}
                      className={` ${inputClassName} ${errors?.heads?.[index]?.headType ? "border-[1px] " : "border-gray-300"}`}
                      onChange={(e) => {

                        setValue(`heads[${index}].headType`, e.target.value)
                        setValue(`heads[${index}].amount`, 0)
                        setValue(`heads[${index}].subHeadId`, "")
                        setValue(`heads[${index}].invoiceId`, "")

                      }}
                    >
                      <option value="invoice">Invoice</option>
                      <option value="client">Client</option>
                    </select> */}

                    <Controller
                      control={control}
                      name={`heads[${index}].headType`}
                      rules={{ required: "Head type is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                           showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          className={` ${inputAntdSelectClassName} ${errors?.heads?.[index]?.headType
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          onChange={(value) => {
                            
                            setValue(`heads[${index}].headType`, value);
                            setValue(`heads[${index}].amount`, 0);
                            setValue(`heads[${index}].subHeadId`, "");
                            setValue(`heads[${index}].invoiceId`, "");
                          }}
                        >
                          <Select.Option value="invoice">Invoice</Select.Option>
                          <Select.Option value="client">Client Expense</Select.Option>
                        </Select>
                      )}
                    />

                    {errors?.heads?.[index]?.headType && (
                      <p className="text-red-500 text-sm">
                        {errors?.heads?.[index]?.headType?.message}
                      </p>
                    )}
                  </div>

                  {watch(`heads[${index}].headType`) === "client" && (
                    <>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Department
                        </label>
                        {/* <select
                          onFocus={() => {
                            dispatch(
                              deptSearch({
                                text: "",
                                sort: true,
                                status: true,
                                companyId:
                                  userInfoglobal?.userType === "admin"
                                    ? CompanyId
                                    : userInfoglobal?.userType === "company"
                                      ? userInfoglobal?._id
                                      : userInfoglobal?.companyId,
                                branchId:
                                  userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? watch("PDBranchId") : userInfoglobal?.userType === "companyBranch"
                                    ? userInfoglobal?._id
                                    : userInfoglobal?.branchId,

                              })
                            );
                          }}
                          {...register(`heads[${index}].subHeadId`, { required: "Sub Head ID is required" })}
                          defaultValue={item.subHeadId}
                          className={` ${inputClassName} ${errors?.heads?.[index]?.subHeadId ? "border-[1px] " : "border-gray-300"}`}
                        >
                          <option className="text-xs" value="">
                            Select Sub Head
                          </option>
                          {departmentListData?.map((elment, index) => (
                            <option value={elment?._id}>{elment?.name}</option>
                          ))}
                        </select> */}
                        <Controller
                          control={control}
                          name={`heads[${index}].subHeadId`}

                          rules={{ required: "Department is required" }}
                          render={({ field }) => (
                            <Select
                              {...field}
                              defaultValue={""}
                               showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                              className={` ${inputAntdSelectClassName} ${errors?.heads?.[index]?.subHeadId
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              onFocus={() => {
                                dispatch(
                                  deptSearch({
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
                                    branchId:
                                      userInfoglobal?.userType === "company" ||
                                        userInfoglobal?.userType === "admin" ||
                                        userInfoglobal?.userType ===
                                        "companyDirector"
                                        ? watch("PDBranchId")
                                        : userInfoglobal?.userType ===
                                          "companyBranch"
                                          ? userInfoglobal?._id
                                          : userInfoglobal?.branchId,
                                  })
                                );
                              }}
                            >
                              <Select.Option className="" value="">
                                Select Department
                              </Select.Option>
                              {departmentLoading ? <Select.Option disabled>
                                <ListLoader />
                              </Select.Option> : (sortByPropertyAlphabetically(departmentListData)?.map((elment, index) => (
                                <Select.Option value={elment?._id}>
                                  {elment?.name}
                                </Select.Option>
                              )))}{" "}
                            </Select>
                          )}
                        />
                        {errors?.heads?.[index]?.subHeadId && (
                          <p className="text-red-500 text-sm">
                            {errors?.heads?.[index]?.subHeadId?.message}
                          </p>
                        )}
                      </div>

                      <div className="col-span-2 my-2">
                        <div
                          className={`grid ${watch(`heads[${index}].type`) === "Yearly"
                            ? "grid-cols-1 md:grid-cols-2"
                            : watch(`heads[${index}].type`)
                              ? "grid-cols-1 md:grid-cols-3"
                              : "grid-cols-1 md:grid-cols-2"
                            } space-x-4`}
                        >
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Financial Year{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            {/* <select
                              {...register(`heads[${index}].financialYear`, {
                                required: "Financial year is required",
                              })}
                              className={`${inputClassName} ${errors?.heads?.[index]?.financialYear ? "border-[1px] " : "border-gray-300"}`}
                            >
                              <option value="">Select Financial Year</option>
                              {financialYears.map((year, index) => (
                                <option key={index} value={year}>
                                  {year}
                                </option>
                              ))}
                            </select> */}

                            <Controller
                              control={control}
                              name={`heads[${index}].financialYear`}
                              rules={{ required: "Financial year is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  // defaultValue={getDefaultFinacialYear()}
                                  
                                   showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                                  className={`${inputAntdSelectClassName} ${errors?.heads?.[index]?.financialYear
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                >
                                  <Select.Option value="">
                                    Select Financial Year
                                  </Select.Option>

                                  {financialYears.map((year, index) => (
                                    <Select.Option key={index} value={year}>
                                      {year}
                                    </Select.Option>
                                  ))}
                                </Select>
                              )}
                            />

                            {errors?.heads?.[index]?.financialYear && (
                              <p className="text-red-500 text-sm">
                                {errors?.heads?.[index]?.financialYear.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Type <span className="text-red-600">*</span>
                            </label>
                            {/* <select
                              {...register(`heads[${index}].type`, {
                                required: "Type is required",
                              })}
                              className={`${inputClassName} ${errors?.heads?.[index]?.type ? "border-[1px] " : "border-gray-300"}`}
                            >
                              <option value="">Select Type</option>
                              <option value="Quaterly">Quaterly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select> */}
                            <Controller
                              control={control}
                              name={`heads[${index}].type`}
                              rules={{ required: "Type is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  defaultValue={""}
                                   showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                                  className={`${inputAntdSelectClassName} ${errors?.heads?.[index]?.financialYear
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                >
                                  <Select.Option value="">
                                    Select Type
                                  </Select.Option>
                                  <Select.Option value="Quaterly">
                                    Quaterly
                                  </Select.Option>
                                  <Select.Option value="Monthly">
                                    Monthly
                                  </Select.Option>
                                  <Select.Option value="Yearly">
                                    Yearly
                                  </Select.Option>
                                </Select>
                              )}
                            />
                            {errors?.heads?.[index]?.type && (
                              <p className="text-red-500 text-sm">
                                {errors?.heads?.[index]?.type.message}
                              </p>
                            )}
                          </div>

                          {watch(`heads[${index}].type`) === "Quaterly" && (
                            <div>
                              <label className={`${inputLabelClassName}`}>
                                Quarter <span className="text-red-600">*</span>
                              </label>
                              {/* <select
                                {...register(`heads[${index}].monthQuaters`, {
                                  required: "Reset Month is required",
                                })}
                                className={`${inputClassName} ${errors?.heads?.[index]?.monthQuaters ? "border-[1px] " : "border-gray-300"}`}
                              >
                                <option value="">Select Quarter</option>
                                {quarter.map((qtr) => (
                                  <option key={qtr} value={qtr}>
                                    {qtr}
                                  </option>
                                ))}
                              </select> */}

                              <Controller
                                control={control}
                                name={`heads[${index}].monthQuaters`}
                                rules={{ required: "Quarter Month is required" }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    defaultValue={""}
                                     showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                                    className={`${inputAntdSelectClassName} ${errors?.heads?.[index]?.monthQuaters ? "border-[1px] " : "border-gray-300"}`}
                                  >
                                    <Select.Option value="">
                                      Select Quarter
                                    </Select.Option>
                                    {quarter.map((qtr) => (
                                      <Select.Option key={qtr} value={qtr}>
                                        {qtr}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                )}
                              />

                              {errors?.heads?.[index]?.monthQuaters && (
                                <p className="text-red-500 text-sm">
                                  {errors?.heads?.[index]?.monthQuaters.message}
                                </p>
                              )}
                            </div>
                          )}

                          {watch(`heads[${index}].type`) === "Monthly" && (
                            <div>
                              <label className={`${inputLabelClassName}`}>
                                Month <span className="text-red-600">*</span>
                              </label>
                              <Controller
                                control={control}
                                name={`heads[${index}].monthName`}
                                rules={{ required: " Month is required" }}
                                render={({ field }) => (
                                  <Select
                                    {...field}
                                    defaultValue={""}
                                     showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                                    className={`${inputAntdSelectClassName} ${errors?.heads?.[index]?.monthName
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      }`}
                                  >
                                    <Select.Option value="">Select Month</Select.Option>
                                    {months.map((month) => (
                                      <Select.Option key={month} value={month}>
                                        {month}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                )}
                              />
                              {/* <select
                                {...register(`heads[${index}].monthName`, {
                                  required: "Month is required",
                                })}
                                className={`${inputClassName} ${
                                  errors?.heads?.[index]?.monthName
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                }`}
                              >
                                <option value="">Select Month</option>
                                {months.map((month) => (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </select> */}
                              {errors?.heads?.[index]?.monthName && (
                                <p className="text-red-500 text-sm">
                                  {errors?.heads?.[index]?.monthName.message}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {watch(`heads[${index}].headType`) === "invoice" && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Invoice ID
                      </label>
                      {/* <select
                        {...register(`heads[${index}].invoiceId`, { required: "Invoice ID is required" })}
                        onFocus={() => {
                          getinvoicerequest()
                        }}
                        onChange={(e) => {  
                          if (watch(`heads[${index}].headType`) === "invoice") {
                            setValue(`heads[${index}].amount`, invoiceListData?.find(elment => elment?._id === e.target.value)?.grandTotal)
                            const total = fields.reduce((sum, field, i) => {
                              return sum + (parseFloat(watch(`heads[${i}].amount`)) || 0);
                            }, 0);
                            setValue('totalAmount', total)
                          }
                        }}
                        className={` ${inputClassName} ${errors?.heads?.[index]?.invoiceId ? "border-[1px] " : "border-gray-300"}`}
                      >
                        <option className="text-xs" value="">
                          Select Client
                        </option>
                        {invoiceListData?.map((elment, index) => (
                          <option value={elment?._id}>{elment?.clientName}({elment?.invoiceNumber})</option>
                        ))}
                      </select> */}

                      <Controller
                        control={control}
                        name={`heads[${index}].invoiceId`}
                        rules={{ required: " Invoice Id is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={""}
                             showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                            className={` ${inputAntdSelectClassName} ${errors?.heads?.[index]?.invoiceId
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            onChange={(value) => {
                              if (
                                watch(`heads[${index}].headType`) === "invoice"
                              ) {
                             

                                setValue(
                                  `heads[${index}].amount`,
                                  invoiceListData?.find(
                                    (elment) => elment?._id === value
                                  )?.grandTotal
                                );
                                const total = fields.reduce((sum, field, i) => {
                                  return (
                                    sum +
                                    (parseFloat(watch(`heads[${i}].amount`)) ||
                                      0)
                                  );
                                }, 0);
                                setValue("totalAmount", total);
                              }
                              field.onChange(value)
                            }

                            }
                            onFocus={() => {
                              getinvoicerequest();
                            }}
                          >
                            <Select.Option className="" value="">
                              Select Invoice
                            </Select.Option>

                            {invoiceLoading ? <Select.Option disabled>
                              <ListLoader />
                            </Select.Option> : (sortByPropertyAlphabetically(invoiceListData, 'invoiceNumber')?.map((elment, index) => (
                              <Select.Option value={elment?._id}>{elment?.clientName}({elment?.invoiceNumber})</Select.Option>
                            )))}
                          </Select>
                        )}
                      />
                      {errors?.heads?.[index]?.invoiceId && (
                        <p className="text-red-500 text-sm">
                          {errors?.heads?.[index]?.invoiceId?.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Description
                    </label>
                    <input
                      {...register(`heads[${index}].description`, {
                        required: "Description is required",
                      })}
                      defaultValue={item.description}
                      className={` ${inputClassName} ${errors?.heads?.[index]?.description
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    />
                    {errors?.heads?.[index]?.description && (
                      <p className="text-red-500 text-sm">
                        {errors?.heads?.[index]?.description?.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={`${inputLabelClassName}`}>Amount</label>
                    <input
                      type="number"
                       step="0.01"
                      disabled={watch(`heads[${index}].headType`) === "invoice"}
                      {...register(`heads[${index}].amount`, {
                        required: "Amount is required",
                      })}
                      onChange={(e) => {
                        const updatedAmount = parseFloat(e.target.value) || 0;
                        setValue(`heads[${index}].amount`, updatedAmount);

                        const total = fields.reduce((sum, field, i) => {
                          return (
                            sum + (parseFloat(watch(`heads[${i}].amount`)) || 0)
                          );
                        }, 0);
                        setValue("totalAmount", total);
                      }}
                      className={` ${watch(`heads[${index}].headType`) === "invoice"
                        ? inputDisabledClassName
                        : inputClassName
                        } ${errors?.heads?.[index]?.amount
                          ? "border-[1px] "
                          : "border-gray-300"
                        }`}
                    />
                    {errors?.heads?.[index]?.amount && (
                      <p className="text-red-500 text-sm">
                        {errors?.heads?.[index]?.amount?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ headType: "invoice",financialYear:getDefaultFinacialYear() })}
            className="bg-header text-white p-2 px-4 rounded mt-4"
          >
            Add more
          </button>
          <div className="mt-1">
            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("isDiscountApplicable")} />
              <span className={`mx-2 text-[15px]`}>Is Discount</span>
            </label>
            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("isTDS")} />
              <span className={`mx-2 text-[15px]`}>Is TDS</span>
            </label>
            <label className={`${inputLabelClassName} flex items-center`}>
              <input
                type="checkbox"
                onChange={handleAdvanceChange}
                checked={watch('isAdvance') || false}
              />
              <span className="mx-2 text-[15px]">Is Advance</span>
            </label>
          </div>
          <div className="w-full flex flex-row items-end justify-end">
            {/* <div className="">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Sub Total Amount
                </label>
                <input
                  type="text"
                  {...register("totalAmount", {})}
                  className={`${inputClassName}`}
                  placeholder="totalAmount"
                  disabled
                />
                {errors.designationName && (
                  <p className="text-red-500 text-sm">
                    {errors.amount.message}
                  </p>
                )}
              </div>
              {watch("isDiscountApplicable") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>Discount</label>
                  <input
                    type="number"
                    {...register("discount", {})}
                    className={`${inputClassName}`}
                    placeholder="Discount"
                  />
                </div>
              )}
              {watch("isTDS") && (
                <div className="">
                  <label className={`${inputLabelClassName}`}>TDS</label>
                  <input
                    type="number"
                    {...register("tds", {})}
                    className={`${inputClassName}`}
                    placeholder="TDS"
                  />
                </div>
              )}
              <div className="">
                <label className={`${inputLabelClassName}`}>Total Amount</label>
                <input
                  type="text"
                  {...register("totalBeforeGrand", {})}
                  className={`${inputClassName}`}
                  placeholder="total"
                  disabled
                  // value={totalAmount - discount}
                />
              </div>
              {watch("isAdvance") && (
                <>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Advance</label>
                    <input
                      type="number"
                      {...register("advance", {
                        maxLength: watch("maxAdvance")
                          ? watch("maxAdvance")
                          : null,
                      })}
                      max={watch("maxAdvance") ? watch("maxAdvance") : null}
                      className={`${inputClassName}`}
                      placeholder="Advance"
                    />
                  </div>
                  <div className="text-red-800 ">
                    {" "}
                    {watch("maxAdvance") &&
                      "max available : " + watch("maxAdvance")}
                  </div>
                </>
              )}

              <div className="">
                <label className={`${inputLabelClassName}`}>Grand Total</label>
                <input
                  type="text"
                  {...register("grandTotal", {})}
                  className={`${inputClassName}`}
                  placeholder="grandTotal"
                  disabled
                  // value={totalAmount - discount}
                />
              </div>
            </div> */}
            <div>
              <div className="mb-4">
                <label className={inputLabelClassName}>Sub Total Amount</label>
                <Controller
                  name="totalAmount"
                  control={control}
                  rules={{
                    required: "Sub Total Amount is required",
                   
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                     
                      className={inputClassName}
                      placeholder="Sub Total Amount"
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        field.onChange(value <= 0 ? 0.01 : value);
                      }}
                    />
                  )}
                />
                {errors.totalAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.totalAmount.message}</p>
                )}
              </div>

              {watch("isDiscountApplicable") && (
                <div className="mb-4">
                  <label className={inputLabelClassName}>Discount</label>
                  <Controller
                    name="discount"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const total = parseFloat(getValues("totalAmount")) || 0;
                        const numValue = parseFloat(value) || 0;
                        if (numValue < 0) return "Discount cannot be negative";
                        if (numValue > total) return `Discount cannot exceed ${total}`;
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max={getValues("totalAmount")}
                        className={inputClassName}
                        placeholder="Discount"
                        onChange={handleNumberInput("discount", getValues("totalAmount"))}
                      />
                    )}
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>
                  )}
                </div>
              )}

              {watch("isTDS") && (
                <div className="mb-4">
                  <label className={inputLabelClassName}>TDS</label>
                  <Controller
                    name="tds"
                    control={control}
                    rules={{
                      validate: (value) => {
                        const total = parseFloat(getValues("totalAmount")) || 0;
                        const discount = parseFloat(getValues("discount")) || 0;
                        const remaining = total - discount;
                        const numValue = parseFloat(value) || 0;

                        if (numValue < 0) return "TDS cannot be negative";
                        if (numValue > remaining) return `TDS cannot exceed ${remaining}`;
                        return true;
                      }
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        max={getValues("totalAmount") - (getValues("discount") || 0)}
                        className={inputClassName}
                        placeholder="TDS"
                        onChange={handleNumberInput("tds", getValues("totalAmount") - (getValues("discount") || 0))}
                      />
                    )}
                  />
                  {errors.tds && (
                    <p className="text-red-500 text-sm mt-1">{errors.tds.message}</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className={inputLabelClassName}>Total Amount</label>
                <input
                  type="number"
                   step="0.01"
                  {...register("totalBeforeGrand")}
                  className={inputClassName}
                  placeholder="Total before grand"
                  disabled
                />
              </div>

              {watch("isAdvance") && (
                <>
                  <div className="mb-4">
                    <label className={inputLabelClassName}>Advance</label>
                    <Controller
                      name="advance"
                      control={control}
                      rules={{
                        validate: (value) => {
                          const total = parseFloat(getValues("totalAmount")) || 0;
                          const discount = parseFloat(getValues("discount")) || 0;
                          const tds = parseFloat(getValues("tds")) || 0;
                          const remaining = total - discount - tds;
                          const numValue = parseFloat(value) || 0;

                          if (remaining <= 0) return "No amount available for advance";
                          if (numValue < 0) return "Advance cannot be negative";
                          if (numValue > remaining) return `Advance cannot exceed ${remaining}`;
                          if (watch("maxAdvance") && numValue > parseFloat(watch("maxAdvance"))) {
                            return `Advance cannot exceed available ${watch("maxAdvance")}`;
                          }
                          return true;
                        }
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          max={Math.min(
                            getValues("totalAmount") - (getValues("discount") || 0) - (getValues("tds") || 0),
                            watch("maxAdvance") || Infinity
                          )}
                          className={inputClassName}
                          placeholder="Advance"
                          onChange={handleNumberInput(
                            "advance",
                            Math.min(
                              getValues("totalAmount") - (getValues("discount") || 0) - (getValues("tds") || 0),
                              watch("maxAdvance") || Infinity
                            )
                          )}
                        />
                      )}
                    />
                    {errors.advance && (
                      <p className="text-red-500 text-sm mt-1">{errors.advance.message}</p>
                    )}
                  </div>
                  {watch("maxAdvance") && (
                    <div className="text-red-800 mb-4">
                      Max available: {watch("maxAdvance")}
                    </div>
                  )}
                </>
              )}

              <div className="mb-4">
                <label className={inputLabelClassName}>Grand Total</label>
                <input
                  type="number"
                   step="0.01"
                  {...register("grandTotal")}
                  className={inputClassName}
                  placeholder="Grand Total"
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">
            {watch("grandTotal") > 0 && (
              <div className="">
                <div className=" flex items-center gap-4">
                  <label className={`${inputLabelClassName}`}>
                    <input
                      type="radio"
                      value="cash"
                      {...register("type", {
                        required: "Type is required",
                      })}
                      
                      className="mr-2"
                    />
                    Cash
                  </label>
                  {/* <label className={`${inputLabelClassName}`}>
                    <input
                      type="radio"
                      value="cheque"
                      {...register("type", {
                        required: "Type is required",
                      })}
                      className="mr-2"
                    />
                    Cheque
                  </label> */}
                  <label className={`${inputLabelClassName}`}>
                    <input
                      type="radio"
                      value="bank"
                      {...register("type", {
                        required: "Type is required",
                      })}
                      className="mr-2"
                    />
                    Bank
                  </label>
                </div>

                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
              </div>
            )}

            {watch("grandTotal") > 0 && watch("type") !== "cash" && (
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
                                      // onFocus={() => {
                                      //   dispatch(getBranchDetails({
                                      //     _id: paymentDetails?.branchId
                                      //   }))
                                      // }}
                                    >
                                      <Select.Option value="">Select Bank</Select.Option>
                                      {
                                        branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                                        branchDetailsData.data.bankData.map((type) => (
                                          <Select.Option key={type._id} value={type._id}>
                                            {optionLabelForBankSlect(type)}
                                          </Select.Option>
                                        ))
                                      }         </Select>
                                  )}
                                />
                {/* <select
                  {...register("bankId")}
                  className={`${inputClassName}  ${errors.bankId
                    ? "border-[1px] "
                    : "border-gray-300"
                    } `}
                // onFocus={handleFocusCompany}
                >
                  <option value="">select bank</option>
                  {branchDetailsData?.data?.bankData &&
                    branchDetailsData?.data?.bankData.length > 0 &&
                    branchDetailsData.data.bankData.map((type) => (
                      <option key={type._id} value={type._id}>
                        {`${type.bankName} (${type.branchName})`}
                      </option>
                    ))}
                </select> */}
                {errors.bankId && (
                  <p className="text-red-500 text-sm">
                    {errors.bankId.message}
                  </p>
                )}
              </div>
            )}
            {watch("grandTotal") > 0 && watch("type") === "cash" && (
              <div className="w-full">
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
                      className={`${inputLabelClassNameReactSelect} ${errors.employeeId
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Select Employee"
                    />
                  )}
                />
                {errors.employeeId && (
                  <p className="text-red-500 text-sm">
                    {errors.employeeId.message}
                  </p>
                )}
              </div>
            )}
            {watch("grandTotal") > 0 && watch("type") === "cheque" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Cheque No
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("chequeNo", {
                    required: "chequeNo is required",
                  })}
                  className={` ${inputClassName} ${errors.chequeNo
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Cheque no"
                />
                {errors.chequeNo && (
                  <p className="text-red-500 text-sm">
                    {errors.chequeNo.message}
                  </p>
                )}
              </div>
            )}
            {watch("grandTotal") > 0 && watch("type") === "bank" && (
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Transaction No
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("transactionNo", {
                    required: "transaction No is required",
                  })}
                  className={` ${inputClassName} ${errors.transactionNo
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Transaction no"
                />
                {errors.transactionNo && (
                  <p className="text-red-500 text-sm">
                    {errors.transactionNo.message}
                  </p>
                )}
              </div>
            )}
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Naration<span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("naration", {
                  required: "Naration is required",
                })}
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
              {/* <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Date"
              /> */}
              <Controller
                name="date"
                control={control}
                rules={{
                  required: "Date  is required",
                }}
                render={({ field }) => (
                  <CustomDatePicker
                    field={field}
                    errors={errors}
                  // disabledDate={(current) => {
                  //   return (
                  //     current &&
                  //     current.isBefore(dayjs().endOf("day"), "day")
                  //   );
                  // }}
                  />
                )}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end my-4">
            <button
              type="submit"
              disabled={receiptLoading}
              className={`${receiptLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {receiptLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateReceipt;






