import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  customDayjs,
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { useEffect, useState } from "react";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { Button, message, Select, Upload, Checkbox } from "antd";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { ServerManagementSearch } from "../../ServerManagement/serverManagementFeatures/_server-management_reducers";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { projectCategorySearch } from "../ProjectCategory/projectCategoryFeatures/_projectCategory_reducers";
import { UploadOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import { projectserviceSearch } from "../ProjectServices/projectserviceFeatures/_projectservice_reducers";
import { createprojectmanagementFunc } from "./ProjectManagementFeatures/_ProjectManagement_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";

// Enums
const PROJECT_TYPE_ARR = ["service", "product"];
const PROJECT_PRIORITY_ARR = ["Low", "Medium", "High"];
const PROJECT_BILLING_TYPE_ARR = ["isBillable", "Fixed"];
const PROJECT_BILLING_DURATION_ARR = ["Weekly", "Monthly", "Yearly"];
const WEEKDAY_ARR = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTH_ARR = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SERVICE_TYPE_ARR = ["service", "server"];

function CreateProjectManagement() {
  const { loading: projectManagementLoader } = useSelector((state) => state.projectManagement);
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      billing: {
        duration: "Weekly",
        schedule: {
          weekly: { day: "Monday" },
          monthly: { date: 1 },
          quartAndYearly: { month: "January", date: 1 }
        }
      },
      projectType: "product",
      priority: "Medium",
      billingType: "isBillable",
      employeIds: [],
      items: [], // Changed from services to items to include both services and servers
      tags: [],
      filePath: [],
      subTotal: 0,
      finalAmount: 0
    }
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));

  // Selectors
  const { loading: employeeLoading, employeList } = useSelector((state) => state.employe);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { clientList, loading: clientLoading } = useSelector((state) => state.client);
  const { ServerManagementList, loading: serverLoading } = useSelector(state => state.serverManagement);
  const { projectCategoryList, loading: projectCategoryLoading } = useSelector((state) => state.projectCategory);
  const { projectserviceList, loading: projectservicesLoading } = useSelector((state) => state.projectservice);

  // Local state
  const [documents, setDocuments] = useState([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  // Watched values
  const CompanyId = useWatch({ control, name: "PDCompanyId", defaultValue: "" });
  const branchId = useWatch({ control, name: "PDBranchId", defaultValue: '' });
  const items = useWatch({ control, name: "items", defaultValue: [] });

  // Calculate totals whenever relevant fields change
  useEffect(() => {
    const subTotal = (items || []).reduce((sum, item) => sum + (Number(item?.amount) || 0), 0);
    const finalAmount = subTotal;
    setValue("subTotal", subTotal);
    setValue("finalAmount", finalAmount);
  }, [items, setValue]);

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId :
        userInfoglobal?.userType === "company" ? userInfoglobal?._id :
          userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id :
        userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ||
        userInfoglobal?.userType === "company") ? data?.PDBranchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      managerId: "",
      teamLeadId: data?.employee || "",
      clientId: data?.client || "",
      categoryId: data?.projectCategory || "",
      employeIds: data?.employeIds || [],
      customerName: data.customerName,
      title: data.title,
      startUpFee: +data?.startUpFee,
      projectType: data.projectType,
      priority: data.priority,
      billingType: data.billingType,
      billing: data.billing,
      services: data.items?.map((item) => ({
        type: item.type,
        amount: item.amount ? +item.amount : 0,
        name:
          item.type === "service"
            ? projectserviceList.find(service => service._id === item.expenseId)?.name
            : item.type === "server"
              ? ServerManagementList.find(server => server._id === item.expenseId)?.serverName
              : item?.name,

        expenseId: item.type === "service" ? (item.expenseId || "") : null,
        serverId: item.type === "server" ? (item.expenseId || "") : null,
        GSTRate: + item?.GSTRate,
        GSTAmount: + item?.GSTAmount,
        amountAfterGST: +item?.amountAfterGST,
        remark: item.remark || ""
      })) || [],
      subTotal: data.items?.length>0 ? + data.subTotal : 0,
      GSTTotal: data.items?.length>0 ? +data?.GSTTotal : 0,
      finalWithGSTAmount: data.items?.length>0 ? + data?.finalWithGSTAmount: 0,
      startDate: customDayjs(data.startDate),
      deadlineDate: customDayjs(data.deadlineDate),
      description: data.description,
      filePath: documents
    };


    dispatch(createprojectmanagementFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  // Data fetching functions (same as before)
  const reportingOption = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isManager: '',
      isPagination: false,
      departmentId: '',
      designationId: "",
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      isBranch: true,
      isDirector: true
    };
    dispatch(employeSearch(reqPayload));
  };

  const fetchClientdata = () => {
    dispatch(clientSearch({
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      groupId: "",
      directorId: "",
      organizationId: "",
      industryId: "",
      text: "",
      sort: true,
      status: true,
      isPagination: false,
    }));
  };

  const fetchServerData = () => {
    dispatch(ServerManagementSearch({
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      text: '',
      sort: true,
      status: '',
      isPagination: false,
    }));
  };

  const fetchProjectCategoryData = () => {
    dispatch(projectCategorySearch({
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      text: '',
      sort: true,
      status: '',
      isPagination: false,
    }));
  };

  const fetchProjectServices = () => {
    dispatch(projectserviceSearch({
      companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" ||
        userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      text: '',
      sort: true,
      status: '',
      isPagination: false,
    }));
  };

  useEffect(() => {
    if (CompanyId || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "admin" ? CompanyId :
          userInfoglobal?.userType === "company" ? userInfoglobal?._id :
            userInfoglobal?.companyId,
      }));
    }
  }, [CompanyId]);

  useEffect(() => {
    reportingOption();
    fetchClientdata();
    fetchServerData();
    fetchProjectCategoryData();
    fetchProjectServices();
  }, [branchId]);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setDocuments((prev) => [...prev, res.payload.data]);
      }
    });
  };

  const handleRemoveFile = (index) => {
    setDocuments((prev) => {
      const updatedDocuments = prev.filter((_, i) => i !== index);
      return updatedDocuments;
    });
  };
  const calculateGST = (index, amount, gstRate) => {
    const gstAmount = (amount * gstRate) / 100;
    const amountAfterGST = amount + gstAmount;

    setValue(`items.${index}.GSTAmount`, gstAmount);
    setValue(`items.${index}.amountAfterGST`, amountAfterGST);

    // Update financial summary
    updateFinancialSummary();
  };

  const calculateSubtotal = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const calculateTotalGST = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.GSTAmount || 0), 0);
  };

  const calculateTotalWithGST = () => {
    const items = watch('items') || [];
    return items.reduce((sum, item) => sum + (item.amountAfterGST || 0), 0);
  };

  const updateFinancialSummary = () => {
    const subtotal = calculateSubtotal();
    const totalGST = calculateTotalGST();
    const totalWithGST = calculateTotalWithGST();

    setValue('subTotal', subtotal);
    setValue('GSTTotal', totalGST);
    setValue('finalWithGSTAmount', totalWithGST);
  };
  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Project</h1>

          {/* Basic Information Section */}
          <div className=" p-2 ">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Branch Selection (for admin/company/director) */}
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Branch <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="PDBranchId"
                      control={control}
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select Branch"
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                            (branchList?.map((type) => (
                              <Select.Option key={type?._id} value={type?._id}>
                                {type?.fullName}
                              </Select.Option>
                            )))}
                        </Select>
                      )}
                    />
                    {errors.PDBranchId && (
                      <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>
                    )}
                  </div>
                )}
              {/* Project Title */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"}`}
                  placeholder="Project Title"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              {/* Customer Name */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Customer Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("customerName", { required: "Customer name is required" })}
                  className={`${inputClassName} ${errors.customerName ? "border-[1px] " : "border-gray-300"}`}
                  placeholder="Customer Name"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm">{errors.customerName.message}</p>
                )}
              </div>




              {/* Client */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Client <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="client"
                  control={control}
                  rules={{ required: "Client is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      className={`${inputAntdSelectClassName} ${errors.client ? "border-[1px] " : "border-gray-300"}`}
                    >
                      <Select.Option value="">Select client</Select.Option>
                      {clientLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (sortByPropertyAlphabetically(clientList, 'fullName')?.map((element) => (
                          <Select.Option value={element?._id}>
                            {element?.fullName}
                          </Select.Option>
                        )))}
                    </Select>
                  )}
                />
                {errors.client && (
                  <p className="text-red-500 text-sm mt-1">{errors.client.message}</p>
                )}
              </div>

              {/* Project Category */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Project Category <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="projectCategory"
                  control={control}
                  rules={{ required: "Project Category is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      className={`${inputAntdSelectClassName}`}
                    >
                      <Select.Option value="">Select Project Category</Select.Option>
                      {projectCategoryLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (sortByPropertyAlphabetically(projectCategoryList, 'name')?.map((element) => (
                          <Select.Option value={element?._id}>
                            {element?.name}
                          </Select.Option>
                        )))}
                    </Select>
                  )}
                />
                {errors.projectCategory && (
                  <p className="text-red-500 text-sm mt-1">{errors.projectCategory.message}</p>
                )}
              </div>

              {/* Project Type */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Project Type <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="projectType"
                  rules={{ required: "Project type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName}`}
                    >
                      {PROJECT_TYPE_ARR.map(type => (
                        <Select.Option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.projectType && (
                  <p className="text-red-500 text-sm">{errors.projectType.message}</p>
                )}
              </div>
              {/* Project Handling Employee */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Project Handling Employee <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="employee"
                  rules={{ required: "employee is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                      className={`${inputAntdSelectClassName} mt-2`}
                    >
                      <Select.Option value="" selected>Select Project Handling Employee</Select.Option>
                      {employeeLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        sortByPropertyAlphabetically(employeList, 'fullName')?.map((element, index) => (
                          <Select.Option key={index} value={element?._id}>
                            {element?.fullName}
                          </Select.Option>
                        ))
                      }
                    </Select>
                  )}
                />
                {errors.employee && (
                  <p className="text-red-500 text-sm">{errors.employee.message}</p>
                )}
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>Start Up Fee</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.01"

                    {...register(`startUpFee`, {})}
                    className={`${inputClassName}`}
                    placeholder="Start Up Fee"
                  />
                  {errors.startUpFee && (
                    <p className="text-red-500 text-sm">
                      {errors.startUpFee?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Priority <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="priority"
                  rules={{ required: "Priority is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName}`}
                    >
                      {PROJECT_PRIORITY_ARR.map(priority => (
                        <Select.Option key={priority} value={priority}>
                          {priority}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.priority && (
                  <p className="text-red-500 text-sm">{errors.priority.message}</p>
                )}
              </div>



              {/* Dates */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Start Date <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <CustomDatePicker
                      field={field}
                      errors={errors}
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                )}
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>Deadline Date</label>
                <Controller
                  name="deadlineDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker
                      field={field}
                      disabledDate={(current) => {
                        const startDate = watch("startDate");
                        return startDate && current && current.isBefore(dayjs(startDate), "day");
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Billing Information Section */}
          <div className=" p-2 ">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Billing Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Billing Type */}
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Billing Type <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="billingType"
                  rules={{ required: "Billing type is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName}`}
                    >
                      {PROJECT_BILLING_TYPE_ARR.map(type => (
                        <Select.Option key={type} value={type}>
                          {type === "isBillable" ? "Billable" : "Fixed"}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.billingType && (
                  <p className="text-red-500 text-sm">{errors.billingType.message}</p>
                )}
              </div>

              {/* Billing Section */}
              {watch("billingType") === "isBillable" && (
                <>
                  {/* Billing Duration */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Billing Duration</label>
                    <Controller
                      control={control}
                      name="billing.duration"
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                        >
                          {PROJECT_BILLING_DURATION_ARR.map(duration => (
                            <Select.Option key={duration} value={duration}>
                              {duration}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                  </div>

                  {/* Billing Schedule */}
                  {watch("billing.duration") === "Weekly" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>Billing Day</label>
                      <Controller
                        control={control}
                        name="billing.schedule.weekly.day"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName}`}
                          >
                            {WEEKDAY_ARR.map(day => (
                              <Select.Option key={day} value={day}>{day}</Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  {watch("billing.duration") === "Monthly" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>Billing Date</label>
                      <Controller
                        control={control}
                        name="billing.schedule.monthly.date"
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={`${inputAntdSelectClassName}`}
                          >
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                              <Select.Option key={date} value={date}>{date}</Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                    </div>
                  )}

                  {(watch("billing.duration") === "Quarterly" || watch("billing.duration") === "Yearly") && (
                    <>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>Billing Month</label>
                        <Controller
                          control={control}
                          name="billing.schedule.quartAndYearly.month"
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`${inputAntdSelectClassName}`}
                            >
                              {MONTH_ARR.map(month => (
                                <Select.Option key={month} value={month}>{month}</Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                      <div className="">
                        <label className={`${inputLabelClassName}`}>Billing Date</label>
                        <Controller
                          control={control}
                          name="billing.schedule.quartAndYearly.date"
                          render={({ field }) => (
                            <Select
                              {...field}
                              className={`${inputAntdSelectClassName}`}
                            >
                              {Array.from({ length: 31 }, (_, i) => i + 1).map(date => (
                                <Select.Option key={date} value={date}>{date}</Select.Option>
                              ))}
                            </Select>
                          )}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Services/Servers Section */}
          <div className="p-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
              Services & Servers
            </h2>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 border rounded p-2">
                  {/* Type - col-span-2 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Type</label>
                    <Controller
                      control={control}
                      name={`items.${index}.type`}
                      rules={{ required: 'Type is required' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                          placeholder="Select Type"
                          onChange={(value) => {
                            field.onChange(value);
                            // Reset expenseId when type changes
                            setValue(`items.${index}.expenseId`, "");
                            setValue(`items.${index}.name`, "");
                          }}
                        >
                          <Select.Option value="">Select Type</Select.Option>
                          {['service', 'server', 'other'].map((type) => (
                            <Select.Option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.items?.[index]?.type && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.type?.message}
                      </p>
                    )}
                  </div>

                  {/* Service/Server/Other Name - col-span-3 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      {watch(`items.${index}.type`) === 'service' ? 'Service' :
                        watch(`items.${index}.type`) === 'server' ? 'Server' : 'Name'}
                    </label>
                    {watch(`items.${index}.type`) === 'other' ? (
                      <Controller
                        name={`items.${index}.name`}
                        control={control}
                        rules={{ required: 'Name is required' }}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`${inputClassName}`}
                            placeholder="Enter name"
                          />
                        )}
                      />
                    ) : (
                      <Controller
                        control={control}
                        name={`items.${index}.expenseId`}
                        rules={{
                          required: `${watch(`items.${index}.type`) === 'service' ? 'Service' : 'Server'} is required`,
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            loading={watch(`items.${index}.type`) === 'service' ? projectservicesLoading : serverLoading}
                            className={`${inputAntdSelectClassName}`}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                            onChange={(value, option) => {
                              field.onChange(value);
                              // Set the name when item is selected
                              const name = option?.children || "";
                              setValue(`items.${index}.name`, name);
                            }}
                          >
                            <Select.Option value="">
                              Select {watch(`items.${index}.type`) === 'service' ? 'Service' : 'Server'}
                            </Select.Option>
                            {watch(`items.${index}.type`) === 'service' ? (
                              projectservicesLoading ? (
                                <Select.Option disabled>
                                  <ListLoader />
                                </Select.Option>
                              ) : (
                                sortByPropertyAlphabetically(projectserviceList, 'name')?.map((type) => (
                                  <Select.Option key={type?._id} value={type?._id}>
                                    {type?.name}
                                  </Select.Option>
                                ))
                              )
                            ) : serverLoading ? (
                              <Select.Option disabled>
                                <ListLoader />
                              </Select.Option>
                            ) : (
                              sortByPropertyAlphabetically(ServerManagementList, 'serverName')?.map(
                                (server) => (
                                  <Select.Option key={server?._id} value={server?._id}>
                                    {server?.serverName}
                                  </Select.Option>
                                )
                              )
                            )}
                          </Select>
                        )}
                      />
                    )}
                    {errors.items?.[index]?.expenseId && watch(`items.${index}.type`) !== 'other' && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.expenseId?.message}
                      </p>
                    )}
                    {errors.items?.[index]?.name && watch(`items.${index}.type`) === 'other' && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Amount - col-span-2 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Amount</label>
                    <Controller
                      name={`items.${index}.amount`}
                      control={control}
                      rules={{ required: 'Amount is required', min: 0 }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          className={`${inputClassName}`}
                          placeholder="Amount"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                            // Recalculate GST when amount changes
                            const gstRate = watch(`items.${index}.GSTRate`) || 0;
                            calculateGST(index, value, gstRate);
                          }}
                        />
                      )}
                    />
                    {errors.items?.[index]?.amount && (
                      <p className="text-red-500 text-sm">
                        {errors.items?.[index]?.amount?.message}
                      </p>
                    )}
                  </div>

                  {/* GST Rate - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>GST %</label>
                    <Controller
                      name={`items.${index}.GSTRate`}
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputAntdSelectClassName}`}
                          placeholder="GST %"
                          onChange={(value) => {
                            field.onChange(value);
                            // Recalculate GST when rate changes
                            const amount = watch(`items.${index}.amount`) || 0;
                            calculateGST(index, amount, value);
                          }}
                        >
                          <Select.Option value={0}>0%</Select.Option>
                          <Select.Option value={5}>5%</Select.Option>
                          <Select.Option value={12}>12%</Select.Option>
                          <Select.Option value={18}>18%</Select.Option>
                          <Select.Option value={28}>28%</Select.Option>
                        </Select>
                      )}
                    />
                  </div>

                  {/* GST Amount (display only) - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>GST Amt</label>
                    <div className={`${inputClassName} bg-gray-100 flex items-center justify-center`}>
                      ₹{(watch(`items.${index}.GSTAmount`) || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Total with GST (display only) - col-span-1 on md, full on mobile */}
                  <div className="">
                    <label className={`${inputLabelClassName}`}>Total</label>
                    <div className={`${inputClassName} bg-gray-100 flex items-center justify-center`}>
                      ₹{(watch(`items.${index}.amountAfterGST`) || 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Remark and Remove - col-span-1 on md, full on mobile */}
                  <div className="flex items-end md:col-span-2 w-full">
                    <div className="w-full" >
                      <label className={`${inputLabelClassName}`}>Remark</label>
                      <Controller
                        name={`items.${index}.remark`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            className={`${inputClassName} flex-grow`}
                            placeholder="Remark"
                          />
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 text-red-500 h-10 px-2 flex items-center justify-center bg-red-50 rounded"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Button */}
              <button
                type="button"
                onClick={() => append({
                  type: "",
                  expenseId: "",
                  name: "",
                  amount: 0,
                  GSTRate: 0,
                  GSTAmount: 0,
                  amountAfterGST: 0,
                  remark: ""
                })}
                className="mt-2 text-blue-500 flex items-center"
              >
                <PlusOutlined className="mr-1" /> Add Item
              </button>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Financial Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600">Subtotal:</p>
                <p className="text-xl font-bold text-blue-600">₹{calculateSubtotal().toFixed(2)}</p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-gray-600">Total GST:</p>
                <p className="text-xl font-bold text-green-600">₹{calculateTotalGST().toFixed(2)}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded">
                <p className="text-gray-600">Total with GST:</p>
                <p className="text-xl font-bold text-purple-600">₹{calculateTotalWithGST().toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className=" p-2 ">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Additional Information</h2>

            {/* Description */}
            <div className="mb-4">
              <label className={`${inputLabelClassName}`}>Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className={`${inputClassName}`}
                placeholder="Project description"
              />
            </div>

            {/* Files */}
            <div>
              <label className={`${inputLabelClassName}`}>
                Add Documents
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex justify-start items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                >
                  <FaRegFile className="mr-2" />
                  Add Documents
                </label>

                <div className="space-y-2">
                  {documents.map((file, index) => (
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={projectManagementLoader}
              className={`${projectManagementLoader ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {projectManagementLoader ? <Loader /> : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default CreateProjectManagement;