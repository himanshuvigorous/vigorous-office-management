import React, { useEffect, useState } from 'react';
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout';
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect, sortByPropertyAlphabetically } from '../../../constents/global';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { Select, Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import ListLoader from '../../../global_layouts/ListLoader';
import ReactSelect from "react-select";
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { officeAddressSearch } from '../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers';
import { clientSearch } from '../../client/clientManagement/clientFeatures/_client_reducers';
import { RiDeleteBin5Line } from 'react-icons/ri';
import Loader from '../../../global_layouts/Loader';
import { createinvoice } from './invoiceFeature/_invoice_reducers';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gstTypeSearch } from '../../global/other/GstType/GstTypeFeatures/_gstType_reducers';
import { decrypt } from '../../../config/Encryption';
import Loader2 from '../../../global_layouts/Loader/Loader2';
const Createinvoice = () => {
  const [searchParams] = useSearchParams();
  const taskDataParam = searchParams.get('taskData');
  const [decryptedTaskData, setDecryptedTaskData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      totalAmount: 0,
      totalDiscount: 0,
      totalDiscountedPrice: 0,
      tasks: [
        { gstAmount: "", gstRate: "", amount: "", hsnCode: "", taskType: "" },
      ],
    },
  });
  const payloadTasks = useWatch({
    control,
    name: "tasks",
    defaultValue: "",
  });
  const [totals, setTotals] = useState({
    totalAmount: 0,
    totalDiscount: 0,
    totalDiscountedPrice: 0,
    totalGST: 0,
    totalFinalAmount: 0,
  });
  const { gstTypeList, loading: gstTypeLoading } = useSelector(state => state.gstType)
  const { fields, append, remove } = useFieldArray({ control, name: "tasks", });
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { loading: invoiceLoading } = useSelector((state) => state.invoice);
  const [gstType, setGstType] = useState("");
  const [isgstType, setIsGstType] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [finalTaskType, setFinalTaskType] = useState([]);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const { clientList, loading: clientLoading } = useSelector((state) => state.client);
  const selectedlayout = officeAddressListData?.find((address) => address._id === watch("invoiceLayout"));
  const selectedClient = clientList?.find((client) => client._id === watch("client"));
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
      )
    }
  }, [CompanyId]);

  useEffect(() => {
    if (decryptedTaskData && clientList && clientList?.length > 0) {
      setValue("client", decryptedTaskData?.clientId);
    }
    if (decryptedTaskData && branchList && branchList?.length > 0) {
      setValue("PDBranchId", decryptedTaskData?.branchId);
    }
  }, [decryptedTaskData, clientList, branchList]);

  useEffect(() => {
    if (
      (CompanyId || userInfoglobal?.userType !== "admin") &&
      (BranchId ||
        userInfoglobal?.userType === "companyBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchClientdata();
    }
  }, [CompanyId, BranchId]);
  useEffect(() => {
    setFinalTaskType([]);
    if (
      clientList?.find((client) => client._id === watch("client"))
        ?.clientCompletedTaskData
    ) {
      setFinalTaskType([
        ...clientList?.find((client) => client._id === watch("client"))
          ?.clientCompletedTaskData,
        {
          _id: "other",
          financialYear: "-",
          status: "Completed",
          taskName: "Other",
          description: "Other",
          HSNCode: "",
          GSTRate: 0,
          GSTName: "-",
          taskFee: 0,
        },
      ]);
    }
  }, [clientList, watch("client"), selectedlayout, selectedClient]);
  const fetchClientdata = () => {
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
        groupId: "",
        directorId: "",
        organizationId: "",
        industryId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  };
  useEffect(() => {
    if (selectedClient && selectedlayout) {

      if (selectedClient?.clientProfile?.GSTNumber && selectedlayout?.isGSTEnabled) {

        setIsGstType(true);
        const ClientGstNumber = selectedClient?.clientProfile?.GSTNumber;
        const layoutGstNumber = selectedlayout?.gstNumber;
        const clientGstPrefix = ClientGstNumber?.slice(0, 2);
        const layoutGstPrefix = layoutGstNumber?.slice(0, 2);
        if (clientGstPrefix === layoutGstPrefix) {
          setGstType("interstate");
        } else {
          setGstType("intrastate");
        }
      }else if (!selectedClient?.clientProfile?.GSTNumber && selectedlayout?.isGSTEnabled) {
        setIsGstType(true);
        setGstType("interstate");
      } else {
        setIsGstType(false);
        setGstType("");
      }
    } else {
      setIsGstType(false);
      setGstType("");
    }
  }, [selectedClient, selectedlayout]);
  useEffect(() => {
    setValue("tasks", [])
  }, [selectedlayout])

  // Decrypt task data from URL parameters
  useEffect(() => {
    if (taskDataParam) {
      try {
        const decryptedData = JSON.parse(decrypt(taskDataParam));
        setDecryptedTaskData(decryptedData);
      } catch (error) {
        setDecryptedTaskData(null);
      }
    }
  }, [taskDataParam]);

  useEffect(() => {
    if (!payloadTasks || payloadTasks.length === 0) {
      setTotals({
        totalAmount: 0,
        totalDiscount: 0,
        totalDiscountedPrice: 0,
        totalGST: 0,
        totalFinalAmount: 0,
      });
      return;
    }

    const newTotals = payloadTasks.reduce(
      (acc, task) => {
        acc.totalAmount += Number(task.amount) || 0;
        acc.totalDiscount += Number(task.discount) || 0;
        acc.totalDiscountedPrice += Number(task.discountedPrice) || 0;
        acc.totalGST += Number(task.gstPrice) || 0;
        acc.totalFinalAmount += Number(task.finalAmount) || 0;
        return acc;
      },
      {
        totalAmount: 0,
        totalDiscount: 0,
        totalDiscountedPrice: 0,
        totalGST: 0,
        totalFinalAmount: 0,
      }
    );

    setTotals(newTotals);

  }, [payloadTasks]);
  const onSubmit = (data) => {

    const taskTypeTask = data?.tasks
      ?.filter((task) => task.taskType !== "other")
      ?.map((task) => {
        const loppedTask = finalTaskType.find(
          (looppedtask) => looppedtask._id === task.taskType
        );
        return {
          taskType: "task",
          taskId: task.taskType,
          taskName: loppedTask?.taskName,
          HSNCode: task.hsnCode,
          GSTRate: + task.gstRate,
          taskAmount: + task.amount,
          calculatedAmount: + task.finalAmount,
          gstAmount: + task.gstPrice,
          discount: + task.discount,
          discountAmount: + task.discountedPrice,
          financialYear: task?.financialYear,
        };
      });
    const taskTypeOther = data?.tasks
      ?.filter((task) => task.taskType === "other")
      ?.map((task) => {
        const loppedTask = finalTaskType.find(
          (task) => task._id === task.taskType
        );
        return {
          taskType: "other",
          taskId: null,
          taskName: task?.description,
          HSNCode: task.hsnCode,
          GSTRate: + task.gstRate,
          taskAmount: + task.amount,
          calculatedAmount: + task.finalAmount,
          gstAmount: + task.gstPrice,
          discount: + task.discount,
          discountAmount: + task.discountedPrice,
          financialYear: null
        };
      });
    const finalPayload = {
      companyId:
        userInfoglobal?.userType === "admin"
          ? data?.PDCompanyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      directorId:"",
      branchId:
        userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector" ||
          userInfoglobal?.userType === "company"
          ? data?.PDBranchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      clientId: data?.client,
      invoiceLayoutId: data?.invoiceLayout,
      taskList: [...taskTypeTask, ...taskTypeOther],
      totalAmount: + totals?.totalAmount,
      discountAmount: + totals?.totalDiscount,
      grandTotal: + totals?.totalFinalAmount,
      isAllTask: data?.isAlltask || false,
      isIGST: gstType === "intrastate" ? true : false,
      isDiscount: true,
      SGST: isgstType ? + (totals?.totalGST / 2) : null,
      CGST: isgstType ? + (totals?.totalGST / 2) : null,
      IGST: isgstType ? + totals?.totalGST : null,
    };
    dispatch(createinvoice(finalPayload)).then((data) => {
      if (!data?.error) navigate(-1);
    });
  };
  // useEffect(() => {
  //   if (watch("isAlltask")) {
  //     remove();
  //     clientList
  //       ?.find((client) => client._id === watch("client")?.value)
  //       ?.clientCompletedTaskData?.forEach((task) => {
  //         const formattedtaskDetails = {
  //           ...task,
  //           taskName: task?.taskName,
  //           taskType: task?._id,
  //           tasktypeId: task?._id,
  //           hsnCode: task?.HSNCode,
  //           gstRate: task?.GSTRate,
  //           amount: Number(task?.taskFee),
  //           gstAmount: (Number(task?.taskFee) * Number(task?.GSTRate)) / 100,
  //           financialYear: task?.financialYear,
  //           igst: Number((task?.taskFee * task?.GSTRate) / 100),
  //           cgst: Number((task?.taskFee * task?.GSTRate) / 100) / 2,
  //           sgst: Number((task?.taskFee * task?.GSTRate) / 100) / 2,
  //         };

  //         append(formattedtaskDetails);
  //       });
  //   } else {
  //     setValue("tasks", []);
  //   }
  // }, [watch("isAlltask")]);
  return (

    <GlobalLayout>
   {clientLoading? <Loader2 /> :   <form
        autoComplete="off"
        className="mt-2 md:px-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1  md:mt-4">
          {userInfoglobal?.userType === "admin" && (
            <div className="">
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
                    </Select.Option> : sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
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
                      </Select.Option> : sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ">
          <div className="w-full">
            <label className={`${inputLabelClassName}`}>
              Client <span className="text-red-600">*</span>
            </label>
            <Controller
              name="client"
              control={control}
              rules={{ required: " Client is required" }}

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
                >
                  <Select.Option className="" value="">
                    Select client
                  </Select.Option>
                  {clientLoading ? <Select.Option disabled>
                    <ListLoader />
                  </Select.Option> : (sortByPropertyAlphabetically(clientList, 'fullName')?.map((element) => (
                    <Select.Option value={element?._id}>
                      {element?.fullName}
                    </Select.Option>
                  )))}
                </Select>
              )}
            />
            {errors.client && (
              <p className="text-red-500 text-sm mt-1">
                {errors.client.message}
              </p>
            )}
          </div>
          <div className="">
            <label className={`${inputLabelClassName}`}>
              Firm Layout Name <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="invoiceLayout"
              rules={{ required: "Layout is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={""}
                  className={` ${inputAntdSelectClassName} ${errors.invoiceLayout
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
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
              )}
            />

            {errors.invoiceLayout && (
              <p className="text-red-500 text-sm">
                {errors.invoiceLayout.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedClient && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800">Client Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <DetailItem label="Client" value={selectedClient?.fullName} />
                  <DetailItem
                    label="Mobile"
                    value={`${selectedClient?.mobile?.code} ${selectedClient?.mobile?.number}`}
                  />
                </div>
                <div className="space-y-3">
                  <DetailItem
                    label="GST Number"
                    value={selectedClient?.clientProfile?.GSTNumber || '-'}
                  />
                  <DetailItem
                    label="Address"
                    value={`${selectedClient?.addresses?.primary?.city ?? '-'}, ${selectedClient?.addresses?.primary?.state ?? '-'}`}
                    fullValue={`${selectedClient?.addresses?.primary?.country ?? '-'}, ${selectedClient?.addresses?.primary?.pinCode ?? '-'}`}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedlayout && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-800">Firm Details</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <DetailItem label="Firm Name" value={selectedlayout?.firmName} />
                  <DetailItem
                    label="Mobile"
                    value={`${selectedlayout?.mobile?.code} ${selectedlayout?.mobile?.number}`}
                  />
                </div>
                <div className="space-y-3">
                  <DetailItem
                    label="GST Number"
                    value={selectedlayout?.isGSTEnabled ? selectedlayout?.gstNumber : '-'}
                  />
                  <DetailItem
                    label="Address"
                    value={`${selectedlayout?.address?.city ?? "-"}, ${selectedlayout?.address?.state ?? "-"}`}
                    fullValue={`${selectedlayout?.address?.country ?? "-"}, ${selectedlayout?.address?.pinCode ?? "-"}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>


        <div className="space-y-2">
          {/* {finalTaskType?.length > 1 && <div className="">
            <Controller
              name="isAlltask"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <>
                  <Switch {...field} checked={field.value} />
                  <label className={`${inputLabelClassName}`}>
                    Is All Task
                  </label>
                </>
              )}
            />
          </div>} */}
          {selectedClient && selectedlayout && <div>
            {fields.map((field, index) => (
              <div className="border border-gray-300 rounded-md">
                <div className="flex flex-col items-end">
                  <div className="w-full bg-header flex justify-end items-center rounded-tl-md rounded-tr-md p-1">
                    <button type="button" onClick={() => remove(index)}>
                      <RiDeleteBin5Line
                        className="text-white w-12 hover:text-white"
                        size={20}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className={`grid sm:grid-cols-2 gap-2 md:grid-cols-4 p-2`}
                >
                  <div
                    className={
                      watch("isAlltask") ? "hidden w-full" : "block w-full"
                    }
                  >
                    <label className={`${inputLabelClassName}`}>Task</label>

                    <Controller
                      control={control}
                      name={`tasks[${index}].taskType`}
                      rules={{ required: "Task Type is required" }}
                      render={({ field }) => (
                        <Select
                          // {...field}
                          defaultValue={""}
                          className={`${inputAntdSelectClassName}`}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value) => {

                            if (value) {
                              const data = finalTaskType?.find(
                                (task) => task._id === value
                              );
                              if (data) {
                                const gstPriceNew = isgstType ? data?.GSTRate : 0
                                setValue(
                                  `tasks[${index}].tasktypeId`,
                                  data?._id
                                );
                                setValue(
                                  `tasks[${index}].amount`,
                                  data?.taskFee
                                );
                                setValue(
                                  `tasks[${index}].gstRate`,
                                  gstPriceNew
                                );
                                setValue(
                                  `tasks[${index}].hsnCode`,
                                  data?.HSNCode
                                );
                                setValue(
                                  `tasks[${index}].discount`,
                                  0
                                );
                                setValue(
                                  `tasks[${index}].financialYear`,
                                  data?.financialYear
                                );
                                setValue(`tasks[${index}].discountedPrice`, data?.taskFee)
                                setValue(`tasks[${index}].gstPrice`, (data?.taskFee * gstPriceNew) / 100)
                                setValue(`tasks[${index}].finalAmount`, ((data?.taskFee * gstPriceNew) / 100) + data?.taskFee)
                              }
                            } else {
                              setValue(`tasks[${index}].tasktypeId`, "");
                              setValue(`tasks[${index}].amount`, 0);
                              setValue(`tasks[${index}].gstRate`, 0);
                              setValue(`tasks[${index}].hsnCode`, '');
                              setValue(`tasks[${index}].discount`, 0);
                              setValue(`tasks[${index}].discountedPrice`, 0);
                              setValue(`tasks[${index}].gstPrice`, 0);
                              setValue(`tasks[${index}].finalAmount`, 0);
                              setValue(`tasks[${index}].financialYear`, null);

                            }

                            field.onChange(value);
                          }}

                        >
                          <Select.Option value="">
                            Select Task
                          </Select.Option>
                          {finalTaskType
                            ?.filter((task) => {

                              const selectedTasks = watch("tasks")?.map((t, i) => i !== index && t.taskType).filter(Boolean);
                              return !selectedTasks.includes(task._id);
                            })
                            .map((data) => (
                              <Select.Option key={data?._id} value={data?._id}>

                                {data?.taskName}{data?.type !== 'Yearly' && (data?.type == 'Monthly' ? data?.monthName : data?.type == 'Quarterly' ? data?.quarterName : '')}
                              </Select.Option>
                            ))}
                        </Select>
                      )}
                    />

                    {errors.tasks?.[index]?.taskType && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.taskType?.message}
                      </p>
                    )}
                  </div>
                  <div
                    className={
                      !watch("isAlltask") ? "hidden w-full" : "block w-full"
                    }
                  >
                    <label className={`${inputLabelClassName}`}>Task</label>
                    <input
                      type="text"
                      disabled
                      {...register(`tasks[${index}].taskName`)}
                      className={`${inputClassName}`}
                      placeholder="Task Name"
                    />
                    {errors.tasks?.[index]?.taskName && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.taskName?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      HSN code
                    </label>
                    <input
                      type="text"
                      disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                      {...register(`tasks[${index}].hsnCode`, {
                        required: watch(`tasks[${index}].tasktypeId`) === "other"
                          ? "HSN Code is required"
                          : false,
                        pattern: {
                          value: /^\d{4}(\d{2})?(\d{2})?$/,
                          message: "HSN Code must be 4, 6, or 8 digits",
                        },
                      })}
                      className={`${inputClassName}`}
                      placeholder="HSN CODE"
                    />
                    {errors.tasks?.[index]?.hsnCode && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.hsnCode?.message}
                      </p>
                    )}
                  </div>
                  {watch(`tasks[${index}].tasktypeId`) && watch(`tasks[${index}].tasktypeId`) !== "other" && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Financial Year
                      </label>
                      <input
                        type="text"
                        disabled
                        {...register(`tasks[${index}].financialYear`, {})}
                        className={`${inputDisabledClassName}`}
                        placeholder="Financial Year"
                      />
                      {errors.tasks?.[index]?.financialYear && (
                        <p className="text-red-500 text-sm">
                          {errors.tasks?.[index]?.financialYear?.message}
                        </p>
                      )}
                    </div>
                  )}
                  {watch(`tasks[${index}].tasktypeId`) === "other" && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Description
                      </label>
                      <input
                        type="text"
                        {...register(`tasks[${index}].description`, {})}
                        className={`${inputClassName}`}
                        placeholder="Description"
                      />
                      {errors.tasks?.[index]?.description && (
                        <p className="text-red-500 text-sm">
                          {errors.tasks?.[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`tasks[${index}].amount`, {
                        required: watch(`tasks[${index}].tasktypeId`) === "other" ? "Amount is required" : false,
                        min: {
                          value: 0,
                          message: "Amount cannot be negative",
                        },
                      })}
                      className={`${inputClassName}`}
                      placeholder="Amount"
                      disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                      onChange={(e) => {
                        if (watch(`tasks[${index}].tasktypeId`) === "other") {
                          const amount = Number(e.target.value);
                          const gstRate = Number(watch(`tasks[${index}].gstRate`));
                          const discount = Number(watch(`tasks[${index}].discount`)) ?? 0;
                          const discountPrice = amount - discount
                          const gstPrice = (discountPrice * gstRate) / 100;
                          const finalAmount = discountPrice + gstPrice;
                          setValue(`tasks[${index}].discountedPrice`, discountPrice);
                          setValue(`tasks[${index}].gstPrice`, gstPrice);
                          setValue(`tasks[${index}].finalAmount`, finalAmount);
                          setValue(`tasks[${index}].amount`, amount);
                        }
                      }}
                    />
                    {errors.tasks?.[index]?.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.amount?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Discount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`tasks[${index}].discount`, {
                        min: {
                          value: 0,
                          message: "Discount cannot be negative",
                        },
                        validate: (value) => {
                          const amount = Number(watch(`tasks[${index}].amount`));
                          if (Number(value) > amount) return "Discount cannot exceed amount";
                          return true;
                        },
                      })}
                      className={`${inputClassName}`}
                      placeholder="Discount"
                      onChange={(e) => {
                        const enteredValue = Math.max(0, Number(e.target.value)); // prevents setting negative discount
                        const amount = Number(watch(`tasks[${index}].amount`));
                        const validDiscount = Math.min(enteredValue, amount);

                        setValue(`tasks[${index}].discount`, validDiscount);
                        const discountedPrice = amount - validDiscount;
                        const gstRate = Number(watch(`tasks[${index}].gstRate`));
                        const gstPrice = (discountedPrice * gstRate) / 100;
                        const finalAmount = discountedPrice + gstPrice;

                        setValue(`tasks[${index}].discountedPrice`, discountedPrice);
                        setValue(`tasks[${index}].gstPrice`, gstPrice);
                        setValue(`tasks[${index}].finalAmount`, finalAmount);
                      }}
                    />
                    {errors.tasks?.[index]?.discount && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.discount?.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      disabled
                      {...register(`tasks[${index}].discountedPrice`, {})}
                      className={`${inputClassName}`}
                      placeholder="discountedPrice"
                    />
                    {errors.tasks?.[index]?.discountedPrice && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.discountedPrice?.message}
                      </p>
                    )}
                  </div>
                  {isgstType &&
                    (
                      <>
                        {watch(`tasks[${index}].tasktypeId`) === "other" ? <div className="">
                          <label className={`${inputLabelClassName}`}>
                            Gst Rate <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            name={`tasks[${index}].gstTypeId`}
                            control={control}
                            rules={{ required: "GST Rate is required" }}
                            render={({ field }) => (
                              <Select
                                {...field}
                                showSearch
                                placeholder="Select GST Rate"
                                className={`${inputAntdSelectClassName} ${errors.gstTypeId ? "border-[1px] " : "border-gray-300"}`}
                                onFocus={() => {
                                  const selectedCompanyId =
                                    userInfoglobal?.userType === "admin"
                                      ? watch("companyId")
                                      : userInfoglobal?.userType === "company"
                                        ? userInfoglobal?._id
                                        : userInfoglobal?.companyId;

                                  const selectedBranchId =
                                    ["company", "admin", "companyDirector"].includes(userInfoglobal?.userType)
                                      ? watch("PDBranchId")
                                      : userInfoglobal?.userType === "companyBranch"
                                        ? userInfoglobal?._id
                                        : userInfoglobal?.branchId;

                                  const reqPayload = {
                                    directorId: "",
                                    companyId: selectedCompanyId,
                                    branchId: selectedBranchId,
                                    text: "",
                                    sort: true,
                                    status: "",
                                    isPagination: false,
                                  };
                                  dispatch(gstTypeSearch(reqPayload));
                                }}
                                onChange={(e) => {
                                  setValue(`tasks[${index}].gstRate`, e)
                                  setValue(`tasks[${index}].gstTypeId`, e)
                                  const gstRate = Number(e);
                                  const amount = Number(watch(`tasks[${index}].discountedPrice`));
                                  const gstPrice = (amount * gstRate) / 100;
                                  const finalAmount = amount + gstPrice;
                                  setValue(`tasks[${index}].gstPrice`, gstPrice);
                                  setValue(`tasks[${index}].finalAmount`, finalAmount);
                                }}
                              >
                                <Select.Option value="">Select GST Type</Select.Option>
                                {gstTypeLoading ? <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option> : (gstTypeList?.map((element) => (
                                  <Select.Option key={element?._id} value={element?.percentage}>
                                    {element?.percentage} %
                                  </Select.Option>
                                )))}
                              </Select>
                            )}
                          />
                          {errors?.tasks?.[index]?.gstTypeId && (
                            <p className="text-red-500 text-sm">
                              {errors?.tasks?.[index]?.gstTypeId?.message}
                            </p>
                          )}
                        </div>
                          :
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              Gst Rate
                            </label>
                            <input
                              type="text"
                              disabled
                              {...register(`tasks[${index}].gstRate`, {
                                required: watch(`tasks[${index}].tasktypeId`) === "other"
                                  ? "GST Rate is required"
                                  : false,
                                pattern: {
                                  value: /^\d+(\.\d{1,2})?$/,
                                  message: "Enter a valid GST Rate (e.g., 5, 12.5)",
                                },
                                min: {
                                  value: 0,
                                  message: "GST Rate cannot be less than 0%",
                                },
                                max: {
                                  value: 100,
                                  message: "GST Rate cannot be more than 100%",
                                },
                              })}

                              className={`${inputClassName}`}
                              placeholder="GST Rate"
                            />

                            {errors?.tasks?.[index]?.gstRate && (
                              <p className="text-red-500 text-sm">
                                {errors.tasks[index].gstRate.message}
                              </p>
                            )}
                          </div>}

                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Gst Price
                          </label>
                          <input
                            type="text"
                            disabled
                            {...register(`tasks[${index}].gstPrice`, {})}
                            className={`${inputClassName}`}
                            placeholder="gst Price"
                          />
                          {errors?.tasks?.[index]?.gstPrice && (
                            <p className="text-red-500 text-sm">
                              {errors?.tasks?.[index]?.gstPrice?.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Final Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      disabled
                      {...register(`tasks[${index}].finalAmount`, {})}
                      className={`${inputClassName}`}
                      placeholder="Final Amount"
                    />
                    {errors.tasks?.[index]?.finalAmount && (
                      <p className="text-red-500 text-sm">
                        {errors.tasks?.[index]?.finalAmount?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {finalTaskType.length > fields?.length && (
              <button
                type="button"
                onClick={() =>
                  append({ taskType: '', amount: "" })
                }
                className={
                  watch("isAlltask")
                    ? "hidden"
                    : "bg-header text-white p-2 px-4 rounded mt-4"
                }
              >
                Add Task Details
              </button>
            )}
            <div className="w-full flex flex-row items-end justify-end">
              <div className="">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Total Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={totals?.totalAmount ?? 0}
                    className={`${inputClassName}`}
                    placeholder="totalAmount"
                    disabled
                  />

                </div>

                <div className="">
                  <label className={`${inputLabelClassName}`}>Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    value={totals?.totalDiscount ?? 0}
                    className={`${inputClassName}`}
                    placeholder="Discount"
                  />
                </div>
                <div className="">
                  <label className={`${inputLabelClassName}`}>Discounted Price</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled
                    value={totals?.totalDiscountedPrice ?? 0}
                    className={`${inputClassName}`}
                    placeholder="Discounted Price"
                  />
                </div>

                {gstType === "intrastate" && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>IGST</label>
                    <input
                      type="number"
                      step="0.01"
                      value={totals?.totalGST ?? 0}
                      disabled
                      className={`${inputClassName}`}
                      placeholder="IGST"
                    />
                  </div>
                )}
                {gstType === "interstate" && (
                  <>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Total SGST
                      </label>
                      <input
                        type='number'
                        step="0.01"
                        disabled
                        value={(totals?.totalGST / 2) ?? 0}
                        className={`${inputClassName}`}
                        placeholder="SGST"
                      />
                    </div>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Total CGST
                      </label>
                      <input
                        type='number'
                        disabled
                        value={(totals?.totalGST / 2) ?? 0}
                        className={`${inputClassName}`}
                        placeholder="CGST"
                      />
                    </div>
                  </>
                )}
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Grand Total
                  </label>
                  <input
                    type='number'
                    value={totals?.totalFinalAmount ?? 0}
                    className={`${inputClassName}`}
                    placeholder="grandTotal"
                    disabled
                  />
                </div>
              </div>

            </div>
          </div>}
          <div className="flex justify-end my-4">
            <button
              type="submit"
              disabled={invoiceLoading}
              className={`${invoiceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {invoiceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </div>
      </form>}
    </GlobalLayout>
  );
};

export default Createinvoice;


const DetailItem = ({ label, value, fullValue }) => (
  <div>
    <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">
      {value}
      {fullValue && (
        <span className="block text-xs text-gray-500 mt-0.5">{fullValue}</span>
      )}
    </p>
  </div>
);