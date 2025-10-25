import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { domainName, getDefaultFinacialYear, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../constents/global";
import { branchSearch, getBranchDetails } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createreceipt, getreceiptDetails, updatereceipt } from "./receiptFeature/_receipt_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { officeAddressSearch } from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { Select } from "antd";
import { getinvoiceList, invoiceSearch } from "../invoice/invoiceFeature/_invoice_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { MdDelete } from "react-icons/md";
import { decrypt } from "../../../config/Encryption";
import moment from "moment";


const EditReceipt = () => {
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
  const { receiptDetails } = useSelector((state) => state.receipt);
  const { receiptIdEnc } = useParams()
  const receiptId = decrypt(receiptIdEnc)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { clientList } = useSelector((state) => state.client);
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { officeAddressListData } = useSelector((state) => state.officeAddress);
  const { branchDetailsData } = useSelector((state) => state.branch);
  const { employeList } = useSelector(
    (state) => state.employe
  );
  const { clientGroupList } = useSelector(state => state.clientGroup);
  const { invoiceListData } = useSelector(
    (state) => state.invoice
  );
  const { departmentListData } = useSelector((state) => state.department);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "heads",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (receiptId) {
        setValue("heads", []);

        try {
          // Fetch receipt details
          const mainData = await dispatch(getreceiptDetails({ _id: receiptId }));

          if (!mainData.error && mainData?.payload?.data) {
            const data = mainData?.payload?.data;

            setValue("naration", data.naration);
            setValue("date", moment(data.date).format("YYYY-MM-DD"));
            setValue("isTDS", data.isTDS);
            setValue("tds", +data.TDSAmount);
            setValue("isDiscountApplicable", data.isDiscount);
            setValue("discount", +data.discountAmount);
            setValue("isAdvance", data.isAdvanced);
            setValue("maxAdvance", +data.advancedAvailable);
            setValue("advance", +data.advancedAdjust);
            setValue("totalAmount", data.subTotalAmount);
            setValue("type", data.paymentmode);
            setValue("chequeNo", data.chequeNumber);
            setValue("transactionNo", data.transectionNumber);

            // Fetch group name
            const groupData = await dispatch(
              clientGrpSearch({
                companyId: data.companyId,
                branchId: data.branchId,
                isPagination: false,
                text: "",
                sort: true,
                status: true,
                groupId: "",
              })
            );
            if (!groupData?.error) {
              setValue("groupName", data.groupId);
            }

            // Fetch client ID
            const clientData = await dispatch(
              clientSearch({
                companyId: data.companyId,
                branchId: data.branchId,
                groupId: data.groupId,
                isPagination: false,
                sort: true,
                status: true,
              })
            );
            if (!clientData?.error) {
              setValue("client", data.clientId?._id);
            }

            // Fetch office address
            const officeData = await dispatch(
              officeAddressSearch({
                directorId: "",
                companyId: data.companyId,
                branchId: data.branchId,
                text: "",
                sort: true,
                status: true,
                type: "invoice",
                isPagination: false,
              })
            );
            if (!officeData?.error) {
              setValue("invoiceLayout", data.receiptLayoutId);
            }

            // Fetch bank details if payment is not cash
            if (data.paymentmode !== "cash") {
              const branchData = await dispatch(getBranchDetails({ _id: data.branchId }));
              if (!branchData?.error) {
                setValue("bankId", data.bankAccId);
              }
            }

            // Fetch employee if payment mode is cash
            if (data.paymentmode === "cash") {
              const employeeData = await dispatch(
                employeSearch({
                  text: "",
                  status: true,
                  sort: true,
                  isPagination: false,
                  companyId: data.companyId,
                  branchId: data.branchId,
                })
              );
              const selectedEmployee = employeeData?.payload?.data?.docs?.find(
                (employee) => employee?._id === data.employeId
              );
              if (!employeeData?.error) {
                setValue("employeeId", { value: selectedEmployee?._id, label: selectedEmployee?.fullName });
              }
            }

            // Fetch invoice details
            const invoiceData = await dispatch(
              invoiceSearch({
                directorId: "",
                companyId: data.companyId,
                branchId: data.branchId,
                clientId: data.clientId?._id,
                text: "",
                sort: true,
                status: "Paid",
                isPagination: true,
              })
            );
            if (!invoiceData?.error) {
              const invoiceHeads = data?.heads
                ?.filter((item) => item?.headType === "invoice")
                ?.map((item) => ({
                  headType: "invoice",
                  invoiceId: item?.invoiceId,
                  subHeadId: null,
                  amount: +item?.amount,
                  financialYear: "-",
                  type: "",
                  monthName: "",
                  monthQuaters: "",
                }));
              if (invoiceHeads) {
                append(invoiceHeads);
              }
            }

            // Fetch department data
            const deptData = await dispatch(
              deptSearch({
                text: "",
                sort: true,
                status: true,
                isPagination: false,
                companyId: data.companyId,
                branchId: data.branchId,
              })
            );
            if (!deptData?.error) {
              const clientHeads = data?.heads
                ?.filter((item) => item?.headType === "client")
                ?.map((item) => ({
                  headType: "client",
                  invoiceId: null,
                  subHeadId: item?.subHeadId,
                  amount: +item?.amount,
                  financialYear: item?.financialYear,
                  type: item?.type,
                  monthName: item?.monthName,
                  monthQuaters: item?.monthQuaters,
                }));
              if (clientHeads) {
                append(clientHeads);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching data", error);
        }
      }
    };

    fetchData();
  }, [receiptId]);





  const onSubmit = (data) => {

    const invoiceHeads = data?.heads?.filter((item) => item?.headType === "invoice")?.map((item) => ({
      "headType": "invoice",
      "invoiceId": item?.invoiceId,
      "subHeadId": null,
      // "description": item?.description,
      "amount": + item?.amount,
      "financialYear": "-",
      "type": "",
      "monthName": "",
      "monthQuaters": ""
    }))
    const clientHeads = data?.heads?.filter((item) => item?.headType === "client")?.map((item) => ({
      "headType": "client",
      "invoiceId": null,
      "subHeadId": item?.subHeadId,
      // "description": item?.description,
      "amount": + item?.amount,
      "financialYear": item?.financialYear,
      "type": item?.type,
      "monthName": item?.monthName,
      "monthQuaters": item?.monthQuaters
    }))

    const finalPayload = {
      _id: receiptId,
      companyId: receiptDetails?.companyId,
      directorId: receiptDetails?.directorId,
      branchId: receiptDetails?.branchId,
      "receiptLayoutId": data?.invoiceLayout,
      "clientId": data?.client,
      "groupId": data?.groupName,
      "employeId": data?.type === 'cash' ? data?.employeeId?.value : '',
      "bankAccId": data?.type !== 'cash' ? data?.bankId : '',
      "advancedAvailableId": "",
      "heads": [...clientHeads, ...invoiceHeads],
      "naration": data?.naration,
      "date": data?.date,
      "subTotalAmount": data?.totalAmount,
      "isTDS": data?.isTDS,
      "TDSAmount": + data?.tds,
      "isDiscount": data?.isDiscountApplicable,
      "discountAmount": + data?.discount,
      "advancedAvailable": data?.maxAdvance,
      "isAdvanced": data?.isAdvance,
      "advancedAdjust": + data?.advance,
      "totalAmount": data?.totalBeforeGrand,
      "grandTotalAmount": data?.grandTotal,
      "paymentmode": data?.type,
      "chequeNumber": data?.type === 'cheque' ? data?.chequeNo : '',
      "transectionNumber": data?.type === 'bank' ? data?.transactionNo : '',
    }
    dispatch(updatereceipt(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });

  };



  const getinvoicerequest = () => {
    const data = {
      directorId: "",
      companyId:
        userInfoglobal?.userType === "admin"
          ? CompanyId :
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      clientId: watch("client"),
      "text": "",
      "sort": true,
      "status": "Paid",
      "isPagination": true,
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
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
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
  }, [totalAmount, discount, tds, advance, isDiscountApplicable, isTDS, isAdvance, maxAdvance, setValue]);




  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Group Type <span className="text-red-600">*</span>
              </label>
              <select
                {...register("groupName", {
                  required: "Organization type is required",
                })}
                className={` ${inputClassName} ${errors.groupName
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                onFocus={() => {
                  dispatch(
                    clientGrpSearch({
                      companyId: receiptDetails?.companyId,
                      branchId: receiptDetails?.branchId,
                      isPagination: false,
                      text: "",
                      sort: true,
                      status: true,
                      groupId: "",
                    })
                  )
                }}
                onChange={(e) => {
                  setValue("maxAdvance", clientGroupList?.find((client) => client?._id === e.target.value)?.advancedBalance)
                }}
              >
                <option className="text-xs" value="">
                  Select Group Type
                </option>
                {clientGroupList?.map((elment, index) => (
                  <option value={elment?._id}>{elment?.fullName}({elment?.groupName})</option>
                ))}
              </select>
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
              <select
                {...register("client", {
                  required: "Client is required",
                })}
                onFocus={() => {
                  dispatch(clientSearch({
                    companyId: receiptDetails?.companyId,
                    branchId: receiptDetails?.branchId,
                    "directorId": "",
                    "organizationId": "",
                    "industryId": "",
                    groupId: watch("groupName"),
                    "text": "",
                    "sort": true,
                    "status": true,
                    "isPagination": false,
                  }))
                }}
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
              </select>
              {errors.client && (
                <p className="text-red-500 text-sm">
                  {errors.client.message}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <label className={`${inputLabelClassName}`}>
                Firm Layout Name<span className="text-red-600">*</span>
              </label>
              <select
                {...register("invoiceLayout", {
                  required: "Invoice layout  is required",
                })}
                className={` ${inputClassName} ${errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
                  }`}
                onFocus={() => {
                  dispatch(
                    officeAddressSearch({
                      companyId: receiptDetails?.companyId,
                      branchId: receiptDetails?.branchId,
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
                <option className="" value="">
                  Select Layout
                </option>

                {officeAddressListData?.map((element) => (
                  <option value={element?._id}>{element?.firmName}</option>
                ))}
              </select>
              {errors.invoiceLayout && (
                <p className="text-red-500 text-sm">
                  {errors.invoiceLayout.message}
                </p>
              )}
            </div>
          </div>

          <div >
            {fields.map((item, index) => (
              <div key={item.id} className="border border-gray-300 rounded-md my-2" >
                <div className="flex justify-end bg-header rounded-t-md p-2">
                  <button className="text-white" size={20} type="button" onClick={() => remove(index)}>
                    <MdDelete />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  <div>
                    <label className={`${inputLabelClassName}`}>Head Type</label>
                    <select
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
                      <option value="client">Client Expense</option>
                    </select>
                    {errors?.heads?.[index]?.headType && (
                      <p className="text-red-500 text-sm">{errors?.heads?.[index]?.headType?.message}</p>
                    )}
                  </div>

                  {watch(`heads[${index}].headType`) === "client" && (
                    < >

                      <div>
                        <label className={`${inputLabelClassName}`}>Sub Head ID</label>
                        <select
                          onFocus={() => {
                            dispatch(
                              deptSearch({
                                text: "",
                                sort: true,
                                status: true,
                                isPagination: false,
                                companyId: receiptDetails?.companyId,
                                branchId: receiptDetails?.branchId,

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
                        </select>
                        {errors?.heads?.[index]?.subHeadId && (
                          <p className="text-red-500 text-sm">{errors?.heads?.[index]?.subHeadId?.message}</p>
                        )}


                      </div>

                      <div className="col-span-2 my-2">
                        <div className={`grid ${watch(`heads[${index}].type`) === "Yearly" ? "grid-cols-1 md:grid-cols-2" : watch(`heads[${index}].type`) ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"} space-x-4`}>
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Financial Year <span className="text-red-600">*</span>
                            </label>
                            <select
                            defaultValue={getDefaultFinacialYear()}
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
                            </select>
                            {errors?.heads?.[index]?.financialYear && (
                              <p className="text-red-500 text-sm">{errors?.heads?.[index]?.financialYear.message}</p>
                            )}
                          </div>

                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Type <span className="text-red-600">*</span>
                            </label>
                            <select
                              {...register(`heads[${index}].type`, {
                                required: "Type is required",
                              })}
                              className={`${inputClassName} ${errors?.heads?.[index]?.type ? "border-[1px] " : "border-gray-300"}`}
                            >
                              <option value="">Select Type</option>
                              <option value="Quaterly">Quaterly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Yearly">Yearly</option>
                            </select>
                            {errors?.heads?.[index]?.type && (
                              <p className="text-red-500 text-sm">{errors?.heads?.[index]?.type.message}</p>
                            )}
                          </div>

                          {watch(`heads[${index}].type`) === "Quaterly" && (
                            <div>
                              <label className={`${inputLabelClassName}`}>
                                Quarter <span className="text-red-600">*</span>
                              </label>
                              <select
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
                              </select>
                              {errors?.heads?.[index]?.monthQuaters && (
                                <p className="text-red-500 text-sm">{errors?.heads?.[index]?.monthQuaters.message}</p>
                              )}
                            </div>
                          )}

                          {watch(`heads[${index}].type`) === "Monthly" && (
                            <div>
                              <label className={`${inputLabelClassName}`}>
                                Month <span className="text-red-600">*</span>
                              </label>
                              <select
                                {...register(`heads[${index}].monthName`, {
                                  required: "Month is required",
                                })}
                                className={`${inputClassName} ${errors?.heads?.[index]?.monthName ? "border-[1px] " : "border-gray-300"}`}
                              >
                                <option value="">Select Month</option>
                                {months.map((month) => (
                                  <option key={month} value={month}>
                                    {month}
                                  </option>
                                ))}
                              </select>
                              {errors?.heads?.[index]?.monthName && (
                                <p className="text-red-500 text-sm">{errors?.heads?.[index]?.monthName.message}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {watch(`heads[${index}].headType`) === "invoice" && (

                    <div>
                      <label className={`${inputLabelClassName}`}>Invoice ID</label>
                      <select
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
                      </select>
                      {errors?.heads?.[index]?.invoiceId && (
                        <p className="text-red-500 text-sm">{errors?.heads?.[index]?.invoiceId?.message}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                  {/* <div>
                    <label className={`${inputLabelClassName}`}>Description</label>
                    <input
                      {...register(`heads[${index}].description`, { required: "Description is required" })}
                      defaultValue={item.description}
                      className={` ${inputClassName} ${errors?.heads?.[index]?.description ? "border-[1px] " : "border-gray-300"}`}
                    />
                    {errors?.heads?.[index]?.description && (
                      <p className="text-red-500 text-sm">{errors?.heads?.[index]?.description?.message}</p>
                    )}
                  </div> */}
                  <div>
                    <label className={`${inputLabelClassName}`}>Amount</label>
                    <input
                      type="number"
                       step="0.01"
                      disabled={watch(`heads[${index}].headType`) === "invoice"}
                      {...register(`heads[${index}].amount`, { required: "Amount is required" })}
                      onChange={(e) => {
                        const updatedAmount = parseFloat(e.target.value) || 0;
                        setValue(`heads[${index}].amount`, updatedAmount);


                        const total = fields.reduce((sum, field, i) => {
                          return sum + (parseFloat(watch(`heads[${i}].amount`)) || 0);
                        }, 0);
                        setValue('totalAmount', total)

                      }}

                      className={` ${watch(`heads[${index}].headType`) === "invoice" ? inputDisabledClassName : inputClassName} ${errors?.heads?.[index]?.amount ? "border-[1px] " : "border-gray-300"}`}
                    />
                    {errors?.heads?.[index]?.amount && (
                      <p className="text-red-500 text-sm">{errors?.heads?.[index]?.amount?.message}</p>
                    )}
                  </div>
                </div>


              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ headType: "invoice" })}
            className="bg-header text-white p-2 px-4 rounded mt-4"
          >
            Add more
          </button>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">
            {watch("grandTotal") > 0 && <div className="">
              <div className=" flex items-center gap-4">
                <label className={`${inputLabelClassName}`}>
                  <input
                    type="radio"
                    value="cash"
                    {...register("type", {
                      required: "Type is required"
                    })}
                    className="mr-2"
                  />
                  Cash
                </label>
                <label className={`${inputLabelClassName}`}>
                  <input
                    type="radio"
                    value="cheque"
                    {...register("type", {
                      required: "Type is required"
                    })}
                    className="mr-2"
                  />
                  Cheque
                </label>
                <label className={`${inputLabelClassName}`}>
                  <input
                    type="radio"
                    value="bank"
                    {...register("type", {
                      required: "Type is required"
                    })}
                    className="mr-2"
                  />
                  Bank
                </label>
              </div>

              {errors.type && (
                <p className="text-red-500 text-sm">
                  {errors.type.message}
                </p>
              )}
            </div>}


            {watch("grandTotal") > 0 && watch("type") !== "cash" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Sender Bank<span className="text-red-600">*</span>
              </label>
              <select

                {...register("bankId",)}
                className={`${inputClassName}  ${errors.bankId
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
                onFocus={() => {
                  dispatch(getBranchDetails({
                    _id: receiptDetails?.branchId
                  }))
                }}
              >

                <option value=''>
                  select bank
                </option>
                {
                  branchDetailsData?.data?.bankData && branchDetailsData?.data?.bankData.length > 0 &&
                  branchDetailsData.data.bankData.map((type) => (
                    <option key={type._id} value={type._id}>
                      {`${type.bankName} (${type.branchName})`}
                    </option>
                  ))
                }
              </select>
              {errors.bankId && (
                <p className="text-red-500 text-sm">
                  {errors.bankId.message}
                </p>
              )}
            </div>}
            {watch("grandTotal") > 0 && watch("type") === "cash" && <div className="w-full">
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
                      companyId: receiptDetails?.companyId,
                      branchId: receiptDetails?.branchId,
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
            </div>}
            {watch("grandTotal") > 0 && watch("type") === "cheque" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Cheque No
                <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
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
            {watch("grandTotal") > 0 && watch("type") === "bank" && <div className="">
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
                placeholder="Enter Cheque no"
              />
              {errors.transactionNo && (
                <p className="text-red-500 text-sm">
                  {errors.transactionNo.message}
                </p>
              )}
            </div>}
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Date<span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register("date", {
                  required: "Date is required",
                })}
                className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Date"
              />
              {errors.date && (
                <p className="text-red-500 text-sm">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("isDiscountApplicable")} />
              <span className={`mx-2 text-[15px]`}>Is Discount</span>
            </label>
            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("isTDS")} />
              <span className={`mx-2 text-[15px]`}>Is TDS</span>
            </label>
            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("isAdvance")} />
              <span className={`mx-2 text-[15px]`}>Is Advance</span>
            </label>
          </div>
          <div className="w-full flex flex-row items-end justify-end">
            <div className="">
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
                     step="0.01"
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
                    type="number" step="0.01"
                    {...register("tds", {})}
                    className={`${inputClassName}`}
                    placeholder="TDS"
                  />
                </div>
              )}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Total Amount
                </label>
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
                       step="0.01"
                      {...register("advance", {
                        maxLength: watch("maxAdvance") ? watch("maxAdvance") : null,
                      })}
                      max={watch("maxAdvance") ? watch("maxAdvance") : null}
                      className={`${inputClassName}`}
                      placeholder="Advance"
                    />
                  </div>
                  <div className="text-red-800 "> {watch("maxAdvance") && ("max available : " + watch("maxAdvance"))}</div>
                </>
              )}

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Grand Total
                </label>
                <input
                  type="text"
                  {...register("grandTotal", {})}
                  className={`${inputClassName}`}
                  placeholder="grandTotal"
                  disabled
                // value={totalAmount - discount}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div >
    </GlobalLayout >
  );
};

export default EditReceipt;
