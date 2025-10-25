import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  inputLabelClassNameReactSelect,
  inputDisabledClassName,
  inputAntdSelectClassName,
  sortByPropertyAlphabetically,
  getDefaultFinacialYear,
  customDayjs,
} from "../../../constents/global";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import { decrypt } from "../../../config/Encryption";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { deptSearch } from "../../../pages/department/departmentFeatures/_department_reducers";
import { employeSearch } from "../../../pages/employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import {
  gettaskDetails,
  updatetaskFunc,
} from "./addTaskFeatures/_addTask_reducers.js";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers.js";
import { taskTypeSearch } from "../taskType/taskFeatures/_task_reducers.js";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers.js";
import moment from "moment";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker.js";
import dayjs from "dayjs";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader.js";
import ListLoader from "../../../global_layouts/ListLoader.js";
import { elements } from "chart.js";

const EditTask = () => {
  const { taskIdEnc } = useParams();
  const taskId = decrypt(taskIdEnc);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const { departmentListData } = useSelector((state) => state.department);
  const { employeList } = useSelector((state) => state.employe);
  const { clientList, loading: clientListLoading } = useSelector(
    (state) => state.client
  );
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const [documents, setDocuments] = useState([]);
  const { taskTypeList } = useSelector((state) => state.taskType);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [options, setOptions] = useState([]);
  const [employeeSelectedOption, setEmployeeSelectedOption] = useState([]);
  const { loading: taskLoading } = useSelector((state) => state.addTask);
  const { taskDetailsData } = useSelector((state) => state.addTask);
  const selectAllValue = '__all__';

  const modifiedOptions = [
    { label: 'Select All', value: selectAllValue },
    ...options, // your existing employee options
  ];

  const selctedClientName = useWatch({
    control,
    name: "client",
    defaultValue: "",
  });

  const clientBranchOptions = selctedClientName ? (clientList?.find(data => data?._id == selctedClientName)?.branchData || []) : []


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
  const quarter = ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"];
  const dropdownType = useWatch({
    control,
    name: "isPeriod",
    defaultValue: "",
  });

  const department = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });

  useEffect(() => {
    dispatch(gettaskDetails({ _id: taskId }));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (taskDetailsData && taskDetailsData !== null) {
        try {
          // Dispatching deptSearch
          const deptResponse = await dispatch(
            deptSearch({
              text: "",
              sort: true,
              status: true,
              companyId: taskDetailsData?.companyId,
              isPagination: false,
            })
          );
          if (!deptResponse?.error) {
            setValue("PDDepartmentId", {
              value: taskDetailsData?.departmentId,
              label: deptResponse?.payload?.data?.docs?.find(
                (department) =>
                  department?._id === taskDetailsData?.departmentId
              )?.name,
            });
          }
          const empResponse = await dispatch(
            employeSearch({
              companyId: taskDetailsData.companyId,
              branchId: taskDetailsData?.branchId,
              departmentId: taskDetailsData?.departmentId,
              directorId: "",
              text: "",
              sort: true,
              status: true,
              isPagination: false,
              isBranch: true,
              isDirector: false,
            })
          );
          if (!empResponse?.error) {
            const list = empResponse?.payload?.data?.docs?.map((element) => ({
              label: (
                <div className="flex gap-2  items-center">
                  {element.fullName}
                  <div className="text-[10px]  text-gray-500">
                    {element.userType === 'companyDirector' ? 'Director' :
                      element.userType === 'companyBranch' ? 'Branch Head' : ''}
                  </div>
                </div>
              ),
              value: element?._id,
            }));
            setOptions(list);
          }

          if (!empResponse?.error) {
            const selectedEmployees = empResponse?.payload?.data?.docs
              ?.filter((employee) =>
                taskDetailsData?.employeIds?.includes(employee?._id)
              )
              ?.map((employee) => ({
                value: employee?._id,
                label: (
                  <div className="flex gap-2">
                    {employee?.fullName}
                    <br />
                    <div className="text-[9px] text-gray-500 ">
                      {employee?.userType == "companyDirector"
                        ? "Director"
                        : employee?.userType == "companyBranch"
                          ? "Branch Head"
                          : ""}
                    </div>
                  </div>
                ),
              }));

            if (selectedEmployees?.length > 0) {
              setValue("employee", selectedEmployees);
            }
          }


          const taskTypeResponse = await dispatch(
            taskTypeSearch({
              companyId: taskDetailsData?.companyId,
              branchId: taskDetailsData?.branchId,
              departmentId: taskDetailsData?.departmentId,
              directorId: "",
              text: "",
              sort: true,
              status: true,
              isPagination: false,
            })
          );

          if (!taskTypeResponse?.error) {
            setValue("PDtaskId", taskDetailsData?.taskTypeId);
          }
          dispatch(
            clientSearch({
              directorId: "",
              companyId: taskDetailsData?.companyId,
              branchId: taskDetailsData?.branchId,
              userType: "client",
              text: "",
              sort: true,
              status: "",
              isPagination: false,
            })
          ).then((data) => {
            if (!data?.error) {

              // setValue("client", data?.payload?.data?.clientData?._id)
            }
          });
          // Setting the form values directly
          setValue("fees", taskDetailsData?.fee);
          setValue("client", taskDetailsData?.clientId);
          taskDetailsData?.clientBranch?._id && setValue('clientBranch' , taskDetailsData?.clientBranch?._id )
          setValue("tenureDate", dayjs(taskDetailsData?.endDate));
          setValue("financialYear", taskDetailsData?.financialYear);
          setValue("isPeriod", taskDetailsData?.type);
          setValue("descriptions", taskDetailsData?.remarks);
          setValue("PDTaskPriority", taskDetailsData?.priority);

          // Setting additional fields based on the task type
          if (taskDetailsData?.type === "Quaterly") {
            setValue("quarterName", taskDetailsData?.monthQuaters);
          } else if (taskDetailsData?.type === "Monthly") {
            setValue("monthName", taskDetailsData?.monthName);
          }

          // Setting documents
          setDocuments(taskDetailsData?.documents);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [taskDetailsData]);

  const handleSelectChange = (selectedValues) => {
    // Check if "Select All" is selected
    if (selectedValues.includes(selectAllValue)) {
      const allValues = options.map(option => option.value);
      setEmployeeSelectedOption(allValues);
    } else {
      setEmployeeSelectedOption(selectedValues);
    }
  };


  useEffect(() => {
    if (options.length > 0 && taskDetailsData?.employeIds) {
      const selected = options.filter((element) =>
        taskDetailsData?.employeIds?.includes(element?.value)
      ).map((element) => { return element?.value })

      setEmployeeSelectedOption(selected);
    }
  }, [options, taskDetailsData?.employeIds]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setDocuments((prev) => [...prev, res.payload?.data]);
      }
    });
  };
  const handleRemoveFile = (index) => {
    setDocuments((prev) => {
      const updatedDocuments = prev.filter((_, i) => i !== index);
      return updatedDocuments;
    });
  };

  const onSubmit = (data) => {

    const finalPayload = {
      _id: taskId,
      companyId: taskDetailsData?.companyId,
      branchId: taskDetailsData?.branchId,
      directorId: "",
      departmentId: data?.PDDepartmentId ? data?.PDDepartmentId?.value : "",
      financialYear: data?.financialYear,
      groupId: taskDetailsData?.groupId,
      taskTypeId: data?.PDtaskId,
      clientId: data?.client,
      taskName: taskTypeList?.find((task) => task?._id === data?.PDtaskId)
        ?.name,
      fee: taskTypeList?.find((task) => task?._id === data?.PDtaskId)?.fees,
      priority: data?.PDTaskPriority,
      remarks: data?.descriptions,
      dueDate: customDayjs(data?.tenureDate),
      documents: documents,
      type: data?.isPeriod,
      monthName: data?.monthName,
      monthQuaters: data?.quarterName,
      // "employeIds": [ data?.employee?.value]
      employeIds: employeeSelectedOption,
    };

    dispatch(updatetaskFunc(finalPayload)).then((output) => {
      !output.error && navigate(-1);
    });
  };

  const handleFocus = () => {
    dispatch(
      employeSearch({
        companyId:
          userInfoglobal?.userType === "admin"
            ? watch("PDCompanyId")
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
            ? watch("PDBranchId")
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: watch("PDDepartmentId")?.value,
        directorId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isBranch: true,
        isDirector: false,
      })
    ).then((empResponse) => {
      const list = empResponse?.payload?.data?.docs?.map((element) => (

        {
          label: (
            <div className="flex gap-2 items-center">
              {element.fullName}
              <div className="text-[10px] text-gray-500">
                {element.userType === "companyDirector"
                  ? "Director"
                  : element.userType === "companyBranch"
                    ? "Branch Head"
                    : ""}
              </div>
            </div>

          ),

          value: element._id,
          searchText: element.fullName.toLowerCase(),
        }));
      setOptions(list);
    });
  };

  return (
    <GlobalLayout>
      <section>
        <div className="">
          <div>
            <form
              autoComplete="off"
              className=""
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:my-2 px-3 md:mt-4">
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      client <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="client"
                      rules={{ required: "client is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(e)=>{
                            field.onChange(e)
                            setValue("clientBranch" , "")
                      
                          }}
                          value={field.value}
                          defaultValue={""}
                          className={` ${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option className="" value="">
                            Select Client
                          </Select.Option>
                          {clientListLoading ? (
                            <Select.Option disabled>
                              <ListLoader />
                            </Select.Option>
                          ) : (
                            sortByPropertyAlphabetically(
                              clientList,
                              "fullName"
                            )?.map((element) => (
                              <Select.Option value={element?._id}>
                                {element?.fullName}
                              </Select.Option>
                            ))
                          )}
                        </Select>
                      )}
                    />
                    {/* <input
                      type="text"
                      disabled
                      {...register("client")}
                      className={`${inputDisabledClassName} ${
                        errors.descriptions
                          ? "border-[1px] "
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Client Name"
                    /> */}
                    {/* <Controller
                      name="client"
                      control={control}
                      rules={{ required: "At least one client is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          isMulti
                          onFocus={() => {
                            watch('clientSelection') !== 'group' && dispatch(clientSearch({
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

                              "text": "",
                              "sort": true,
                              "status": true,
                              "isPagination": true,
                            }));
                          }}
                          options={[
                            { value: "select_all", label: "Select All" },
                            ...(Array.isArray(clientList) ? clientList.map((client) => ({
                              value: client._id,
                              label: client.fullName,
                            })) : []),
                          ]}
                          classNamePrefix="react-select"
                          className={`${inputLabelClassNameReactSelect} ${errors.client ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select client..."
                          onChange={(selectedOptions) => {
                            const isSelectAllSelected = selectedOptions.find(
                              (option) => option.value === "select_all"
                            );

                            if (isSelectAllSelected) {
                              handleSelectAllClient(field);
                            } else {
                              // Check if all employees are selected
                              setIsSelectAllCheckedClient(
                                selectedOptions.length === clientList.length
                              );
                              field.onChange(selectedOptions);
                            }
                          }}
                          value={field.value || []}
                          formatOptionLabel={(data, { context }) => {
                            if (data.value === "select_all") {
                              return (
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelectAllCheckedClient}
                                    onChange={() => handleSelectAllClient(field)}
                                    style={{ marginRight: "10px" }}
                                  />
                                  <span>Select All</span>
                                </div>
                              );
                            }
                            return data.label;
                          }}
                        />
                      )}
                    />
                    {errors.client && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.client.message}
                      </p>
                    )} */}
                  </div>
                  {clientBranchOptions?.length > 0 && <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Client Branch 
                    </label>
                    <Controller
                      control={control}
                      name="clientBranch"
                    
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}

                          className={inputAntdSelectClassName}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">
                            {" "}
                            Select Client Branch
                          </Select.Option>
                          {clientBranchOptions?.map((type) => (
                            <Select.Option value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.clientBranch && (
                      <p className="text-red-500 text-sm">
                        {errors.clientBranch.message}
                      </p>
                    )}
                  </div>}

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Department <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="PDDepartmentId"
                      control={control}
                      rules={{
                        required: "At least one department is required",
                      }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          options={departmentListData?.map((department) => ({
                            value: department?._id,
                            label: department?.name,
                          }))}
                          classNamePrefix="react-select"
                          className={`${inputLabelClassNameReactSelect} ${errors.PDDepartmentId
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Select Departments"
                          onChange={(selectedOptions) =>
                            field.onChange(selectedOptions)
                          }
                          value={field.value}
                        />
                      )}
                    />
                    {errors.PDDepartmentId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.PDDepartmentId.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Task Name<span className="text-red-600">*</span>
                    </label>
                    {/* <select
                    onFocus={()=>{
                      dispatch(
                        taskTypeSearch({
                          companyId:taskDetailsData?.companyId,
                          branchId:taskDetailsData?.branchId,
                          departmentId:watch('PDDepartmentId')?.value,
                          "directorId": "",
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        }))
                    }}
                      {...register("PDtaskId", {
                        required: "Task Name is required",
                      })}
                      className={` ${inputClassName} ${errors.PDtaskId
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                    >
                      <option className="" value="">
                        Select Task Name
                      </option>

                      {taskTypeList?.map((element) => (
                        <option value={element?._id}>{element?.name}</option>
                      ))}
                    </select> */}

                    <Controller
                      control={control}
                      name="PDtaskId"
                      rules={{ required: "Task Name is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          defaultValue={""}
                          onFocus={() => {
                            dispatch(
                              taskTypeSearch({
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
                                    : userInfoglobal?.userType ===
                                      "companyBranch"
                                      ? userInfoglobal?._id
                                      : userInfoglobal?.branchId,
                                departmentId: watch("PDDepartmentId")?.value,
                                directorId: "",
                                text: "",
                                sort: true,
                                status: true,
                                isPagination: false,
                              })
                            );
                          }}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">
                            {" "}
                            Select Task Name
                          </Select.Option>
                          {taskTypeList?.map((type) => (
                            <Select.Option value={type?._id}>
                              {type?.name}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.PDtaskId && (
                      <p className="text-red-500 text-sm">
                        {errors.PDtaskId.message}
                      </p>
                    )}
                  </div>
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Fees <span className="text-red-600">*</span>
                    </label>
                    <input
                      disabled
                      type="text"
                      {...register("fees")}
                      value={
                        taskTypeList?.find(
                          (element) => element?._id === watch("PDtaskId")
                        )?.fees || ""
                      }
                      className={`${inputDisabledClassName} ${errors.fees ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Fees"
                    />
                    {errors.fees && (
                      <p className="text-red-500 text-sm">
                        {errors.fees.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Assign To <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="employee"
                      control={control}
                      rules={{ required: "At least one employee is required" }}
                      render={({ field }) => (
                        <Select
                          mode="multiple"
                          placeholder="Assign To"
                          onFocus={handleFocus}
                          value={field?.value}
                          onChange={(val) => {
                            field.onChange(val);
                            handleSelectChange?.(val);
                          }}
                          size="large"
                          style={{ width: "100%" }}
                          options={modifiedOptions}
                          className="!min-h-[45px]"
                          optionFilterProp="label"
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        />
                      )}
                    />
                    {errors.employee && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.employee.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Due date <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="tenureDate"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          field={field}
                          errors={errors}
                          disabledDate={(current) => {
                            return (
                              current &&
                              current.isBefore(dayjs().endOf("day"), "day")
                            );
                          }}
                        />
                      )}
                    />
                    {errors.tenureDate && (
                      <p className="text-red-500 text-sm">
                        {errors.tenureDate.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Task Priority <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="PDTaskPriority"
                      rules={{ required: "Task Priority is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          placeholder={"Select Task Priority"}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">
                            Select Task Priority
                          </Select.Option>
                          <Select.Option value="high">High</Select.Option>
                          <Select.Option value="medium">Medium</Select.Option>
                          <Select.Option value="low">Normal</Select.Option>
                        </Select>
                      )}
                    />
                    {errors.PDTaskPriority && (
                      <p className="text-red-500 text-sm">
                        {errors.PDTaskPriority.message}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`grid ${dropdownType === "Yearly"
                    ? "grid-cols-1 md:grid-cols-2"
                    : dropdownType
                      ? "grid-cols-1 md:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2"
                    } gap-5 md:my-1 px-3 md:mt-4`}
                >
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Financial Year <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("financialYear", {
                        required: "Financial year is required",
                      })}
                      defaultValue={getDefaultFinacialYear()}
                      className={`${inputClassName} ${errors.financialYear
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <option value="">Select Financial Year</option>
                      {financialYears.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.financialYear && (
                      <p className="text-red-500 text-sm">
                        {errors.financialYear.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Type <span className="text-red-600">*</span>
                    </label>
                    {/* <select
                      {...register("isPeriod", {
                        required: "Type is required",
                      })}
                      className={`${inputClassName} ${errors.isPeriod ? "border-[1px] " : "border-gray-300"}`}
                    >
                      <option value="">Select Type</option>
                      <option value="Quaterly">Quaterly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select> */}
                    <Controller
                      control={control}
                      name="isPeriod"
                      rules={{ required: "Type is required" }}
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
                          <Select.Option value="">Select Type</Select.Option>
                          <Select.Option value="Quaterly">
                            Quaterly
                          </Select.Option>
                          <Select.Option value="Monthly">Monthly</Select.Option>
                          <Select.Option value="Yearly">Yearly</Select.Option>
                        </Select>
                      )}
                    />
                    {errors.isPeriod && (
                      <p className="text-red-500 text-sm">
                        {errors.isPeriod.message}
                      </p>
                    )}
                  </div>

                  {dropdownType === "Quaterly" && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Quarter <span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="quarterName"
                        rules={{ required: "Reset Month is required" }}
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
                      {errors.quarterName && (
                        <p className="text-red-500 text-sm">
                          {errors.quarterName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {dropdownType === "Monthly" && (
                    <div>
                      <label className={`${inputLabelClassName}`}>
                        Month <span className="text-red-600">*</span>
                      </label>
                      {/* <select
                        {...register("monthName", {
                          required: "Month is required",
                        })}
                        className={`${inputClassName} ${errors.monthName ? "border-[1px] " : "border-gray-300"}`}
                      >
                        <option value="">Select Month</option>
                        {months.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select> */}

                      <Controller
                        control={control}
                        name="monthName"
                        rules={{ required: "Month is required" }}
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
                            <Select.Option value="">Select Month</Select.Option>
                            {months.map((month) => (
                              <Select.Option key={month} value={month}>
                                {month}
                              </Select.Option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.monthName && (
                        <p className="text-red-500 text-sm">
                          {errors.monthName.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:my-1 px-3 md:mt-4">
                  <div className="col-span-2">
                    <label className={`${inputLabelClassName}`}>
                      Description <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("descriptions", {
                        required: "Primary Address is required",
                      })}
                      className={`${inputClassName} ${errors.descriptions
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Primary Address"
                    />
                    {errors.descriptions && (
                      <p className="text-red-500 text-sm">
                        {errors.descriptions.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-3">
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

                <div className="flex justify-end col-span-2 ">
                  <button
                    type="submit"
                    className={`bg-header } text-white p-2 px-4 rounded mt-4`}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </GlobalLayout>
  );
};

export default EditTask;
