import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import {
  branchSearch,
  getBranchDetails,
} from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";

import ReactSelect from "react-select";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { expenseTypeSearch } from "../../global/other/ExpenseHead/expenseTypeFeature/_expenseType_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import {
  createinvoice,
  getinvoiceDetails,
  updateinvoice,
} from "./invoiceFeature/_invoice_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import {
  getofficeAddressList,
  officeAddressSearch,
} from "../../global/other/officeAddressManagement/officeAddressFeature/_office_address_reducers";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  getTaskList,
  taskSearch,
} from "../../taskManagement/addTask/addTaskFeatures/_addTask_reducers";
import { decrypt } from "../../../config/Encryption";
import { AiOutlineUser, AiTwotoneEdit } from "react-icons/ai";
import { FaRegBuilding } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { Select } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";
import Loader from "../../../global_layouts/Loader/Loader";

const EditInvoice = () => {
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
      // tasks: [{ gstAmount: "", gstRate: "", amount: "", hsnCode: "", taskType: '' }],
    },
  });
  const { invoiceDetails ,loading:invoiceDetailsLoading} = useSelector((state) => state.invoice);
  const [selectedClient, setSelectedClient] = useState({});
  const { invoiceIdEnc } = useParams();
  const invoiceId = decrypt(invoiceIdEnc);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { clientList } = useSelector((state) => state.client);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const BranchId = useWatch({ control, name: "PDBranchId", defaultValue: "" });
  const { officeAddressListData, loading: officeAddressLoading } = useSelector((state) => state.officeAddress);
  const [finalTaskType, setFinalTaskType] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });
  const selectedTasks = useWatch({ control, name: "tasks" });
  const discount = useWatch({ control, name: "discount" });
  const [dataSet, setDataSet] = useState(false);

  const selectedlayout = officeAddressListData?.find(
    (address) => address._id === watch("invoiceLayout")
  );
  const [gstType, setGstType] = useState("");
  const [isgstType, setIsGstType] = useState(false);
  useEffect(() => {
    dispatch(
      getinvoiceDetails({
        _id: invoiceId,
      })
    );
  }, []);

  useEffect(() => {
    setFinalTaskType([]);
    reset();
    if (invoiceDetails) {
      setFinalTaskType([
        ...invoiceDetails?.clientCompletedTaskData,
        {
          _id: "other",
          financialYear: "-",
          status: "Completed",
          taskName: "Other",
          description: "Other",
          HSNCode: "-",
          GSTRate: 0,
          GSTName: "-",
          taskFee: 0,
        },
      ]);
      setValue("client", invoiceDetails?.clientId);
      setSelectedClient(invoiceDetails?.clientData);
      dispatch(
        officeAddressSearch({
          companyId: invoiceDetails?.companyId,
          branchId: invoiceDetails?.branchId,
          directorId: "",
          text: "",
          sort: true,
          status: true,
          type: "invoice",
          isPagination: false,
          bankAccountId: "",
          isGSTEnabled: "",
        })
      ).then((data) => {
        if (!data?.error) {
          setValue("invoiceLayout", invoiceDetails?.invoiceLayoutId);
        }
      });
      setValue("discount", invoiceDetails?.discountAmount);
      setValue("enableInput", invoiceDetails?.isDiscount);
      // setValue("TotalIGST", invoiceDetails?.IGST)
      // setValue("TotalCGST", invoiceDetails?.CGST)
      // setValue("TotalSGST", invoiceDetails?.SGST)
      setValue("totalAmount", invoiceDetails?.totalAmount);
      setValue("grandTotal", invoiceDetails?.grandTotal);

      setValue("tasks", []);
      setDataSet(true);
    } else {
      setFinalTaskType([]);
      setValue("tasks", []);
    }
  }, [invoiceDetails]);

  useEffect(() => {
    if (dataSet) {
      remove();
      invoiceDetails?.taskList?.forEach((task) => {
        if (task.taskType !== "other") {
          const formattedtaskDetails = {
            ...task,
            taskName: task?.taskName,
            taskType: task?.taskId,
            tasktypeId: task?.taskId,
            hsnCode: task?.HSNCode,
            gstRate: task?.GSTRate,
            amount: task?.taskAmount,
            gstAmount: task?.gstAmount,
            financialYear: task?.financialYear,
            igst: task?.gstAmount,
            cgst: task?.gstAmount / 2,
            sgst: task?.gstAmount / 2,
          };

          append(formattedtaskDetails);
        } else {
          const formattedtaskDetails = {
            ...task,
            taskName: task?.taskName,
            taskType: "other",
            tasktypeId: "other",
            hsnCode: task?.HSNCode,
            gstRate: task?.GSTRate,
            amount: task?.taskAmount,
            description: task?.taskName,
            gstAmount: task?.gstAmount,
            financialYear: task?.financialYear,
            igst: task?.gstAmount,
            cgst: task?.gstAmount / 2,
            sgst: task?.gstAmount / 2,
          };

          append(formattedtaskDetails);
        }
        setDataSet(false);
      });
    }
  }, [dataSet, invoiceDetails]);

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
          financialYear: loppedTask?.financialYear,
          GSTRate: task.gstRate,
          taskAmount: +task.amount,
          calculatedAmount: Number(task.amount) + task.gstAmount,
          gstAmount: task.gstAmount,
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
          financialYear: loppedTask?.financialYear,
          GSTRate: task.gstRate,
          taskAmount: +task.amount,
          calculatedAmount: Number(task.amount) + task.gstAmount,
          gstAmount: task.gstAmount,
        };
      });

    const finalPayload = {
      _id: invoiceDetails?._id,
      companyId: invoiceDetails?.companyId,
      directorId: invoiceDetails?.directorId,
      branchId: invoiceDetails?.branchId,
      clientId: invoiceDetails?.clientId,
      invoiceLayoutId: data?.invoiceLayout,
      taskList: [...taskTypeTask, ...taskTypeOther],
      totalAmount: +data?.totalAmount,
      discountAmount: +data?.discount,
      grandTotal: +data?.grandTotal,
      isAllTask: false,
      isDiscount: data?.enableInput,
      SGST: +data?.TotalSGST,
      CGST: +data?.TotalCGST,
      IGST: +data?.TotalIGST,
    };
    dispatch(updateinvoice(finalPayload)).then((data) => {
      if (!data?.error) navigate(-1);
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

  const getAvailableTasks = (index) => {
    const selectedIds = selectedTasks
      .map((task) => task?.taskType)
      .filter((taskType, i) => i !== index);
    return finalTaskType?.filter((task) => !selectedIds.includes(task._id));
  };
  useEffect(() => {
    const totalAmount = selectedTasks?.reduce((total, task) => {
      return total + Number(task.amount);
    }, 0);
    const totalIGST = selectedTasks?.reduce((total, task) => {
      return total + Number(task.igst);
    }, 0);
    const totalCGST = selectedTasks?.reduce((total, task) => {
      return total + Number(task.cgst);
    }, 0);
    const totalSGST = selectedTasks?.reduce((total, task) => {
      return total + Number(task.sgst);
    }, 0);
    setValue("totalAmount", Number(totalAmount)?.toFixed(2));
    setValue("TotalIGST", Number(totalIGST)?.toFixed(2));
    setValue("TotalCGST", Number(totalCGST)?.toFixed(2));
    setValue("TotalSGST", Number(totalSGST)?.toFixed(2));

    if (discount && watch("enableInput")) {
      const grandTotal =
        Number(totalAmount) + Number(totalIGST) - Number(discount);
      setValue("grandTotal", grandTotal);
    } else {
      setValue("grandTotal", Number(totalAmount) + Number(totalIGST));
    }
  }, [selectedTasks, discount, watch("enableInput")]);

  useEffect(() => {
    if (selectedClient && selectedlayout) {
      if (selectedlayout?.isGSTEnabled) {
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
      } else {
        setIsGstType(false);
        setGstType("");
      }
    } else {
      setIsGstType(false);
      setGstType("");
    }
  }, [selectedClient, selectedlayout]);

  return (
    <GlobalLayout>
      {invoiceDetailsLoading ? <Loader /> :<div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label className={`${inputLabelClassName}`}>
              Firm Layout Name<span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="invoiceLayout"
              rules={{ required: "Task Name is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  defaultValue={""}

                  className={` ${inputAntdSelectClassName} ${errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
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
                    <Select.Option value={element?._id}>{element?.firmName}</Select.Option>
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
              className={` ${inputClassName} ${
                errors.invoiceLayout ? "border-[1px] " : "border-gray-300"
              }`}
              onFocus={() => {
                dispatch(
                  officeAddressSearch({
                    companyId: invoiceDetails?.companyId,
                    branchId: invoiceDetails?.branchId,
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
            </select> */}
            {errors.invoiceLayout && (
              <p className="text-red-500 text-sm">
                {errors.invoiceLayout.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 md:gap-8 md:my-1 px-3 md:mt-4">
            <div className=" grid grid-cols-1 sm:grid-cols-2 ">
              {selectedClient && (
                <div className="m-2 border-2 border-header p-1 rounded-lg shadow-md">
                  <strong className="text-header">Client</strong>
                  <div className="grid grid-cols-2 gap-4 m-2">
                    <div>

                      <strong className={`${inputLabelClassName}`}>Client</strong><br />
                      <span className="text-sm">{selectedClient?.fullName}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Gst Number</strong><br />
                      <span className="text-sm">{selectedClient?.clientProfile?.GSTNumber}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Address Line 1</strong><br />
                      <span className="text-sm">{selectedClient?.addresses?.primary?.city} ,{" "}
                        {selectedClient?.addresses?.primary?.state} ,{" "}
                        {selectedClient?.addresses?.primary?.country} ,{" "}
                        {selectedClient?.addresses?.primary?.pinCode}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Mobile</strong><br />
                      <span className="text-sm">{selectedClient?.mobile?.code}{" "}
                        {selectedClient?.mobile?.number}</span>
                    </div>
                  </div>

                </div>
              )}

              {selectedlayout && (
                <div className="m-2 border-2 border-header p-1 rounded-lg shadow-md">
                  <strong className="text-header">Firm Layout</strong>
                  <div className="grid grid-cols-2 gap-4 m-2">
                    <div>
                      <strong className={`${inputLabelClassName}`}>Firm Layout</strong><br />
                      <span className="text-sm">{selectedlayout?.firmName}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Gst Number</strong><br />
                      <span className="text-sm">{selectedlayout?.isGSTEnabled
                        ? selectedlayout?.gstNumber
                        : "-"}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Address Line 1</strong><br />
                      <span className="text-sm">{selectedlayout?.address?.city} ,{" "}
                        {selectedlayout?.address?.state} ,{" "}
                        {selectedlayout?.address?.country} ,{" "}
                        {selectedlayout?.address?.pinCode}</span>
                    </div>
                    <div>
                      <strong className={`${inputLabelClassName}`}>Mobile</strong><br />
                      <span className="text-sm">{selectedlayout?.mobile?.code}{" "}
                        {selectedlayout?.mobile?.number}</span>
                    </div>
                  </div>

                </div>
              )}
            </div>
            <div className="w-ful mt-3">
              <div className="space-y-2">
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
                      className={`grid sm:grid-cols-2 gap-2 ${gstType === "intrastate"
                          ? "md:grid-cols-4"
                          : gstType === "intrastate"
                            ? "md:grid-cols-4"
                            : "md:grid-cols-4"
                        } p-2`}
                    >
                      {/* Task Dropdown */}
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>Task</label>
                        {/* <Controller
                    control={control}
                    name={`tasks[${index}].taskType`}
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                          // {...register(`tasks[${index}].taskType`, {})}
                          {...field}
                         defaultValue={""}
                          className={`${inputAntdSelectClassName}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              const data = finalTaskType?.find(
                                (task) => task._id === e.target.value
                              );
                              if (data) {
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
                                  data?.GSTRate
                                );
                                setValue(
                                  `tasks[${index}].gstAmount`,
                                  data?.taskFee * (data?.GSTRate / 100)
                                );
                                setValue(
                                  `tasks[${index}].hsnCode`,
                                  data?.HSNCode
                                );
                                setValue(
                                  `tasks[${index}].totalAmount`,
                                  data?.taskFee * (data?.GSTRate / 100) +
                                  Number(data?.taskFee)
                                );
                                setValue(
                                  `tasks[${index}].igst`,
                                  data?.taskFee * (data?.GSTRate / 100)
                                );
                                setValue(
                                  `tasks[${index}].cgst`,
                                  (data?.taskFee * (data?.GSTRate / 100)) / 2
                                );
                                setValue(
                                  `tasks[${index}].sgst`,
                                  (data?.taskFee * (data?.GSTRate / 100)) / 2
                                );
                              }
                            } else {
                              setValue(`tasks[${index}].tasktypeId`, "");
                              setValue(`tasks[${index}].amount`, 0);
                              setValue(`tasks[${index}].gstRate`, 0);
                              setValue(`tasks[${index}].gstAmount`, 0);
                              setValue(`tasks[${index}].hsnCode`, "-");
                              setValue(`tasks[${index}].totalAmount`, 0);
                              setValue(`tasks[${index}].igst`, 0);
                              setValue(`tasks[${index}].cgst`, 0);
                              setValue(`tasks[${index}].sgst`, 0);
                            }
                          }}
                        >
                          <Select.Option value="">Select Task</Select.Option>
                          {getAvailableTasks(index)?.map((data) => (
                            <Select.Option key={data?._id} value={data?._id}>
                              {data?.taskName}
                            </Select.Option>
                          ))}
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
                  /> */}
                        {/* <select
                          {...register(`tasks[${index}].taskType`, {})}
                          className={`${inputClassName}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              const data = finalTaskType?.find(
                                (task) => task._id === e.target.value
                              );
                              if (data) {
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
                                  data?.GSTRate
                                );
                                setValue(
                                  `tasks[${index}].gstAmount`,
                                  data?.taskFee * (data?.GSTRate / 100)
                                );
                                setValue(
                                  `tasks[${index}].hsnCode`,
                                  data?.HSNCode
                                );
                                setValue(
                                  `tasks[${index}].totalAmount`,
                                  data?.taskFee * (data?.GSTRate / 100) +
                                    Number(data?.taskFee)
                                );
                                setValue(
                                  `tasks[${index}].igst`,
                                  data?.taskFee * (data?.GSTRate / 100)
                                );
                                setValue(
                                  `tasks[${index}].cgst`,
                                  (data?.taskFee * (data?.GSTRate / 100)) / 2
                                );
                                setValue(
                                  `tasks[${index}].sgst`,
                                  (data?.taskFee * (data?.GSTRate / 100)) / 2
                                );
                              }
                            } else {
                              setValue(`tasks[${index}].tasktypeId`, "");
                              setValue(`tasks[${index}].amount`, 0);
                              setValue(`tasks[${index}].gstRate`, 0);
                              setValue(`tasks[${index}].gstAmount`, 0);
                              setValue(`tasks[${index}].hsnCode`, "-");
                              setValue(`tasks[${index}].totalAmount`, 0);
                              setValue(`tasks[${index}].igst`, 0);
                              setValue(`tasks[${index}].cgst`, 0);
                              setValue(`tasks[${index}].sgst`, 0);
                            }
                          }}
                        >
                          <option value="">Select Task</option>
                          {getAvailableTasks(index)?.map((data) => (
                            <option key={data?._id} value={data?._id}>
                              {data?.taskName}
                            </option>
                          ))}
                        </select> */}
                        <Controller
                          control={control}
                          name={`tasks[${index}].taskType`}
                          rules={{ required: "Task Type is required" }}
                          render={({ field }) => (
                            <Select
                              // {...register(`tasks[${index}].taskType`, {})}
                              {...field}
                              defaultValue={""}
                              className={`${inputAntdSelectClassName}`}
                              onChange={(value) => {
                              
                                if (value) {
                                  const data = finalTaskType?.find(
                                    (task) => task._id === value

                                  );
                                
                                  if (data) {
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
                                      data?.GSTRate
                                    );
                                    setValue(
                                      `tasks[${index}].gstAmount`,
                                      data?.taskFee * (data?.GSTRate / 100)
                                    );
                                    setValue(
                                      `tasks[${index}].hsnCode`,
                                      data?.HSNCode
                                    );
                                    setValue(
                                      `tasks[${index}].totalAmount`,
                                      data?.taskFee * (data?.GSTRate / 100) +
                                      Number(data?.taskFee)
                                    );
                                    setValue(
                                      `tasks[${index}].igst`,
                                      Number(data?.taskFee * (data?.GSTRate / 100)).toFixed(2)
                                    );
                                    setValue(
                                      `tasks[${index}].cgst`,
                                      Number((data?.taskFee * (data?.GSTRate / 100)) / 2).toFixed(2)
                                    );
                                    setValue(
                                      `tasks[${index}].sgst`,
                                      Number((data?.taskFee * (data?.GSTRate / 100)) / 2).toFixed(2)
                                    );
                                  }
                                } else {
                                  setValue(`tasks[${index}].tasktypeId`, "");
                                  setValue(`tasks[${index}].amount`, 0);
                                  setValue(`tasks[${index}].gstRate`, 0);
                                  setValue(`tasks[${index}].gstAmount`, 0);
                                  setValue(`tasks[${index}].hsnCode`, "-");
                                  setValue(`tasks[${index}].totalAmount`, 0);
                                  setValue(`tasks[${index}].igst`, 0);
                                  setValue(`tasks[${index}].cgst`, 0);
                                  setValue(`tasks[${index}].sgst`, 0);
                                }

                                field.onChange(value)

                              }

                              }
                            >
                              <Select.Option value="">Select Task</Select.Option>
                              {getAvailableTasks(index)?.map((data) => (
                                <Select.Option key={data?._id} value={data?._id}>
                                  {data?.taskName}
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

                      {/* {watch(`tasks[${index}].tasktypeId`) !== "other" && ( */}
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          HSN Code
                        </label>
                        <input
                          type="text"
                          disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                          {...register(`tasks[${index}].hsnCode`, {})}
                          className={`${inputClassName}`}
                          placeholder="HSN CODE"
                        />
                        {errors.tasks?.[index]?.hsnCode && (
                          <p className="text-red-500 text-sm">
                            {errors.tasks?.[index]?.hsnCode?.message}
                          </p>
                        )}
                      </div>
                      {/* // )} */}
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
                      {isgstType &&
                        // watch(`tasks[${index}].tasktypeId`) !== "other" && 
                        (
                          <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                              GST Rate
                            </label>
                            <input
                              type="text"
                              disabled={watch(`tasks[${index}].tasktypeId`) !== "other"}
                              {...register(`tasks[${index}].gstRate`, {})}
                              className={`${inputClassName}`}
                              onChange={(e) => {
                                setValue(`tasks[${index}].gstRate`, e.target.value)
                                if (watch(`tasks[${index}].amount` && watch(`tasks[${index}].tasktypeId`) === "other")) {
                                  const newtaskfeeforOther = + watch(`tasks[${index}].amount`)
                                  setValue(
                                    `tasks[${index}].gstAmount`,
                                    newtaskfeeforOther * (Number(e.target.value) / 100)
                                  );
                                  setValue(
                                    `tasks[${index}].totalAmount`,
                                    newtaskfeeforOther * (Number(e.target.value) / 100) +
                                    Number(newtaskfeeforOther)
                                  );
                                  setValue(
                                    `tasks[${index}].igst`,
                                    newtaskfeeforOther * (Number(e.target.value) / 100)
                                  );
                                  setValue(
                                    `tasks[${index}].cgst`,
                                    (newtaskfeeforOther * (Number(e.target.value) / 100)) /
                                    2
                                  );
                                  setValue(
                                    `tasks[${index}].sgst`,
                                    (newtaskfeeforOther * (Number(e.target.value) / 100)) /
                                    2
                                  );
                                }
                              }}
                              placeholder="GST Rate"
                            />
                            {errors?.tasks?.[index]?.gstRate && (
                              <p className="text-red-500 text-sm">
                                {errors?.tasks?.[index]?.gstRate?.message}
                              </p>
                            )}
                          </div>
                        )}
                      <div className="w-full">
                        <label className={`${inputLabelClassName}`}>
                          Amount
                        </label>
                        <input
                          type="text"
                          {...register(`tasks[${index}].amount`, {})}
                          className={`${inputClassName}`}
                          placeholder="Amount"
                          disabled={
                            watch(`tasks[${index}].tasktypeId`) !== "other"
                          }
                          onChange={(e) => {
                            setValue(`tasks[${index}].amount`, e.target.value)
                            if (watch(`tasks[${index}].gstRate` && watch(`tasks[${index}].tasktypeId`) === "other")) {
                              const newGstRateforOther = watch(`tasks[${index}].gstRate`)
                              setValue(
                                `tasks[${index}].gstAmount`,
                                Number(e.target.value) * (Number(newGstRateforOther) / 100)
                              );
                              setValue(
                                `tasks[${index}].totalAmount`,
                                Number(e.target.value) * (Number(newGstRateforOther) / 100) +
                                Number(e.target.value)
                              );
                              setValue(
                                `tasks[${index}].igst`,
                                Number(e.target.value) * (Number(newGstRateforOther) / 100)
                              );
                              setValue(
                                `tasks[${index}].cgst`,
                                (Number(e.target.value) * (Number(newGstRateforOther) / 100)) /
                                2
                              );
                              setValue(
                                `tasks[${index}].sgst`,
                                (Number(e.target.value) * (Number(newGstRateforOther) / 100)) /
                                2
                              );
                            }

                          }}
                        />
                        {errors?.tasks?.[index]?.amount && (
                          <p className="text-red-500 text-sm">
                            {errors?.tasks?.[index]?.amount?.message}
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
                      append({ taskType1: "", taskType2: "", amount: "" })
                    }
                    className="bg-header text-white p-2 px-4 rounded mt-4"
                  >
                    Add more invoice details
                  </button>
                )}
              </div>
            </div>

            <label className={`${inputLabelClassName} flex items-center`}>
              <input type="checkbox" {...register("enableInput")} />
              <span className={`m-3 text-[15px]`}>Discount</span>
            </label>

            <div className="w-full flex flex-row items-end justify-end">
              <div className="">
                <div className="">
                  <label className={`${inputLabelClassName}`}>
                    Total Amount
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
                {watch("enableInput") && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Discount</label>
                    <input
                      type="text"
                      {...register("discount", {})}
                      className={`${inputClassName}`}
                      placeholder="Discount"
                    />
                  </div>
                )}
                {gstType === "intrastate" && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>IGST</label>
                    <input
                      type="text"
                      {...register("TotalIGST", {})}
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
                        type="text"
                        {...register("TotalSGST", {})}
                        className={`${inputClassName}`}
                        placeholder="SGST"
                      />
                    </div>
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Total CGST
                      </label>
                      <input
                        type="text"
                        {...register("TotalCGST", {})}
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
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`${
                invoiceDetailsLoading ? "bg-gray-400" : "bg-header"
              } text-white p-2 px-4 rounded`}
            >
             {invoiceDetailsLoading ? <ListLoader />: 'Submit'}
            </button>
          </div>
        </form>
      </div>}
    </GlobalLayout>
  );
};

export default EditInvoice;
