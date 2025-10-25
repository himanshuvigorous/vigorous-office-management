import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { inputClassName, inputLabelClassName, domainName, inputLabelClassNameReactSelect, inputDisabledClassName, inputAntdSelectClassName, getDefaultFinacialYear } from "../../../constents/global";
import { useNavigate } from "react-router-dom";

import ReactSelect from "react-select";
import { FaRegFile, FaTimes } from "react-icons/fa";



import { Radio, Select } from "antd";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
import { clientSearch } from "../../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { orgTypeSearch } from "../../organizationType/organizationTypeFeatures/_org_type_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { createTaskFunc } from "../addTask/addTaskFeatures/_addTask_reducers";
import { taskTypeSearch } from "../taskType/taskFeatures/_task_reducers";

const CreateEmployeeTask = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm({
    defaultValues: {
      employee: [],

    },
  });
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { departmentListData } = useSelector((state) => state.department);
  const { employeList } = useSelector((state) => state.employe);
  const { clientList } = useSelector((state) => state.client);
  const { clientGroupList } = useSelector((state) => state.clientGroup);
  const [documents, setDocuments] = useState([]);
  const { taskTypeList } = useSelector((state) => state.taskType);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { orgTypeList } = useSelector((state) => state.orgType);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllCheckedClient, setIsSelectAllCheckedClient] =
    useState(false);
  const [options, setOptions] = useState([]);
  const [employeeSelectedOption, setEmployeeSelectedOption] = useState([]);



  const handleSelectChange = (value) => {
    setEmployeeSelectedOption(value);
  };

  const handleSelectAll = (field) => {
    if (isSelectAllChecked) {
      field.onChange([]);
    } else {
      const allEmployees = employeList?.map((employee) => ({
        value: employee._id,
        label: employee.fullName,
      }));
      field.onChange(allEmployees);
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };
  const handleSelectAllClient = (field) => {
    if (isSelectAllCheckedClient) {
      field.onChange([]);
    } else {
      const allEmployees = clientList?.map((employee) => ({
        value: employee._id,
        label: employee.fullName,
      }));
      field.onChange(allEmployees);
    }
    setIsSelectAllCheckedClient(!isSelectAllCheckedClient);
  };

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });
  const selctedClientName = useWatch({
    control,
    name: "client",
    defaultValue: "",
  });

  const clientBranchOptions = selctedClientName?.length == 1 ? (clientList?.find(data => data?._id == selctedClientName?.[0]?.value)?.branchData || []) : []
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

  const daysInMonth = ["Last Day"].concat(
    Array.from({ length: 31 }, (_, i) => `${i + 1} Day`)
  );

  const dropdownType = useWatch({
    control,
    name: "isPeriod",
    defaultValue: "",
  });
  const [selectAllActive, setSelectAllActive] = useState(false);
  const allOptionValues = options.map((option) => option.value);

  const selectAllValue = "__all__"; // Custom value for the "Select All" option

  const mergedOptions = [
    {
      label: "Select All",
      value: selectAllValue,
    },
    ...options,
  ];
  useEffect(() => {
    if (
      companyId ||
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
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId]);

  useEffect(() => {
          setValue("financialYear", getDefaultFinacialYear());
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
      companyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector" ||
      userInfoglobal?.userType === "companyBranch" ||
      userInfoglobal?.userType === "employee"
    ) {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
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
        })
      );
    }
  }, [companyId, branchId]);

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

  useEffect(() => {
    if (watch("clientSelection") === "group" && watch("groupName"))
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
          groupId: watch("groupName"),
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
  }, []);



  const onSubmit = (data) => {


    const finalPayload = {
      companyId: userInfoglobal?.companyId,

      branchId: userInfoglobal?.branchId,
      departmentId: userInfoglobal?.departmentId,
      // fileNumber: data?.fileNo,
      financialYear: data?.financialYear,
      groupId: data?.groupName,
      taskTypeId: data?.PDtaskId,
      priority: data?.PDTaskPriority,
      clientId:
        watch("clientSelection") === "group"
          ? clientList?.map((client) => client._id)
          : data?.client && data?.client?.length > 0
            ? data?.client?.map((client) => client.value)
            : [],
      employeIds: [userInfoglobal?._id],
      isSelfAssigned:true,

      taskName: taskTypeList?.find((task) => task?._id === data?.PDtaskId)
        ?.name,
      fee: taskTypeList?.find((task) => task?._id === data?.PDtaskId)?.fees,
      remarks: data?.descriptions,
      dueDate: data?.tenureDate,
      documents: documents,
      type: data?.isPeriod,
      monthName: data?.monthName,
      monthQuaters: data?.quarterName,
      organisationId: data.organizationName,
            clientBranch: clientBranchOptions?.find(el => el._id == data?.clientBranch)
    };

    dispatch(createTaskFunc(finalPayload)).then((output) => {
      !output.error && navigate(-1);
    });
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
              <div className="gap-4 border-2 border-header  p-2 rounded-md my-2 shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:my-2 px-3 md:mt-4">
                  <div className="md:col-span-2 col-span-1 pb-2 overflow-x-auto">
                    <Controller
                      name="clientSelection"
                      control={control} // control from react-hook-form
                      // rules={{ required: "Client Selection Type is required" }}
                      render={({ field }) => (
                        <Radio.Group
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setValue("client", []);
                          }}
                          optionType="button"
                          buttonStyle="solid"
                          block
                          defaultValue={"client"}
                          className={`whitespace-nowrap  ${errors.clientSelection
                            ? "border-[1px] text-[10px] border-red-500"
                            : "border-gray-300"
                            }`}
                        >
                          <Radio value="client">Client Wise</Radio>
                          <Radio disabled value="group">Group Wise</Radio>
                          <Radio disabled value="department">Department Wise</Radio>
                          <Radio disabled value="organization">Organization Wise</Radio>
                        </Radio.Group>
                      )}
                    />
                    {errors.clientSelection && (
                      <p className="text-red-500 text-sm">
                        {errors.clientSelection.message}
                      </p>
                    )}
                  </div>

                  {userInfoglobal?.userType === "admin" && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Company<span className="text-red-600">*</span>
                      </label>
                      <Controller
                        control={control}
                        name="PDCompanyId"
                        rules={{ required: "Company is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            defaultValue={""}
                            className={`${inputAntdSelectClassName}`}
                            showSearch
                            filterOption={(input, option) =>
                              String(option?.children).toLowerCase().includes(input.toLowerCase())
                            }
                          >
                            <Select.Option value="">
                              Select Company
                            </Select.Option>
                            {companyList?.map((type) => (
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
                              className={`${inputAntdSelectClassName}`}
                              showSearch
                              filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                            >
                              <Select.Option value="">
                                Select Branch
                              </Select.Option>
                              {branchList?.map((type) => (
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
                  {watch("clientSelection") === "group" && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Group Type <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("groupName", {
                          required: "Organization type is required",
                        })}
                        className={` ${inputClassName} ${errors.groupName
                          ? "border-[1px] border-red-500"
                          : "border-gray-300"
                          }`}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        onFocus={() => handleFocusClientGrp()}
                        onChange={(e) => {
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
                              groupId: e.target.value,
                              text: "",
                              sort: true,
                              status: true,
                              isPagination: false,
                            })
                          ).then((data) => {
                            if (!data?.error) {
                              setValue(
                                "client",
                                data?.payload?.data?.docs?.map((client) => {
                                  return {
                                    value: client._id,
                                    label: client.fullName,
                                  };
                                })
                              );
                            } else {
                              setValue("client", []);
                            }
                          });
                        }}
                      >
                        <option className="text-xs" value="">
                          Select Group Type
                        </option>
                        {clientGroupList?.map((elment, index) => (
                          <option value={elment?._id}>
                            {elment?.fullName}({elment?.groupName})
                          </option>
                        ))}
                      </select>

                      {/* <Controller
                      control={control}
                      name="groupName"
                      rules={{ required: "Group is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          value={field.value || ""}
                          onFocus={() => handleFocusClientGrp()}
                        onChange={(value) => {
                          setValue("groupName", value)
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
                            groupId: value,
                            "text": "",
                            "sort": true,
                            "status": true,
                            "isPagination": false,
                          })).then((data) => {
                            if (!data?.error) {
                              setValue('client', data?.payload?.data?.docs?.map((client) => {
                                return ({
                                  value: client._id,
                                  label: client.fullName
                                })
                              }))
                            } else {
                              setValue('client', [])
                            }
                          })
                        }}                        
                          className={`${inputAntdSelectClassName} `}
                        >
                          <Select.Option value="">Select Group Type</Select.Option>
                          {clientGroupList?.map((elment, index) => (
                          <Select.Option value={elment?._id}>{elment?.fullName}({elment?.groupName})</Select.Option>
                        ))}
                        </Select>
                      )}
                    /> */}
                      {errors.groupName && (
                        <p className="text-red-500 text-sm">
                          {errors.groupName.message}
                        </p>
                      )}
                    </div>
                  )}
                  {watch("clientSelection") === "organization" && (
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Organization Type{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("organizationName", {
                          required: "Organization type is required",
                        })}
                        className={` ${inputClassName} ${errors.organizationName
                          ? "border-[1px] border-red-500"
                          : "border-gray-300"
                          }`}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        onFocus={() =>
                          dispatch(
                            orgTypeSearch({
                              isPagination: false,
                              text: "",
                              sort: true,
                              status: true,
                            })
                          )
                        }
                        onChange={(e) => {
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
                              organizationId: e.target.value,
                              industryId: "",
                              groupId: "",
                              text: "",
                              sort: true,
                              status: true,
                              isPagination: false,
                            })
                          ).then((data) => {
                            if (!data?.error) {
                              setValue(
                                "client",
                                data?.payload?.data?.docs?.map((client) => {
                                  return {
                                    value: client._id,
                                    label: client.fullName,
                                  };
                                })
                              );
                            } else {
                              setValue("client", []);
                            }
                          });
                        }}
                      >
                        <option className="text-xs" value="">
                          Select Organization Type
                        </option>
                        {orgTypeList?.map((elment, index) => (
                          <option value={elment?._id}>{elment?.name}</option>
                        ))}
                      </select>
                      {errors.organizationName && (
                        <p className="text-red-500 text-sm">
                          {errors.organizationName.message}
                        </p>
                      )}
                    </div>
                  )}
                  {/* <div className="w-full">
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
                            ? "border-[1px] border-red-500"
                            : "border-gray-300"
                            }`}
                          placeholder="Select Departments"
                          onChange={(selectedOptions) => {
                            field.onChange(selectedOptions);
                            watch("clientSelection") === "department" &&
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
                                      userInfoglobal?.userType ===
                                      "companyDirector"
                                      ? watch("PDBranchId")
                                      : userInfoglobal?.userType ===
                                        "companyBranch"
                                        ? userInfoglobal?._id
                                        : userInfoglobal?.branchId,
                                  directorId: "",
                                  organizationId: "",
                                  industryId: "",
                                  groupId: "",
                                  departmentId: selectedOptions.value,
                                  text: "",
                                  sort: true,
                                  status: true,
                                  isPagination: false,
                                })
                              ).then((data) => {
                                if (!data?.error) {
                                  setValue(
                                    "client",
                                    data?.payload?.data?.docs?.map((client) => {
                                      return {
                                        value: client._id,
                                        label: client.fullName,
                                      };
                                    })
                                  );
                                } else {
                                  setValue("client", []);
                                }
                              });
                          }}
                          value={field.value}
                        />
                      )}
                    />
                    {errors.PDDepartmentId && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.PDDepartmentId.message}
                      </p>
                    )}
                  </div> */}
                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Client <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="client"
                      control={control}
                      rules={{ required: "At least one client is required" }}
                      render={({ field }) => (
                        <ReactSelect
                          {...field}
                          isMulti
                          onFocus={() => {
                            dispatch(
                              clientSearch({
                                companyId: userInfoglobal?.companyId,
                                branchId: userInfoglobal?.branchId,
                                departmentId: userInfoglobal?.departmentId,
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
                          }}
                          options={[
                            { value: "select_all", label: "Select All" },
                            ...(Array.isArray(clientList)
                              ? clientList.map((client) => ({
                                value: client._id,
                                label: client.fullName,
                              }))
                              : []),
                          ]}
                          classNamePrefix="react-select"
                          className={`${inputLabelClassNameReactSelect} ${errors.client
                            ? "border-[1px] border-red-500"
                            : "border-gray-300"
                            }`}
                          placeholder="Select client..."
                          onChange={(selectedOptions) => {
                            setValue("clientBranch" , "")
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
                                    onChange={() =>
                                      handleSelectAllClient(field)
                                    }
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
                    )}
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
                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Task Name<span className="text-red-600">*</span>
                    </label>
                    {/* <select
                      onFocus={() => {
                        dispatch(
                          taskTypeSearch({
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
                            departmentId: watch('PDDepartmentId')?.value,
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
                        ? "border-[1px] border-red-500"
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
                                companyId: userInfoglobal?.companyId,
                                branchId: userInfoglobal?.branchId,
                                departmentId: userInfoglobal?.departmentId,
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
                  {/* <div className="">
                    <label className={`${inputLabelClassName}`}>Fees</label>
                    <input
                      disabled
                      type="text"
                      {...register("fees")}
                      value={
                        taskTypeList?.find(
                          (element) => element?._id === watch("PDtaskId")
                        )?.fees || ""
                      }
                      className={`${inputDisabledClassName} ${errors.fees
                        ? "border-[1px] border-red-500"
                        : "border-gray-300"
                        }`}
                      placeholder="Fees"
                    />
                    {errors.fees && (
                      <p className="text-red-500 text-sm">
                        {errors.fees.message}
                      </p>
                    )}
                  </div> */}

                  {/* <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Assign To <span className="text-red-600">*</span>
                    </label>

                    <Controller
                      name="employee"
                      control={control}
                      rules={{ required: "At least one employee is required" }}
                      render={({ field }) => {
                        const handleChange = (selected) => {
                          if (selected.includes(selectAllValue)) {
                            // If "Select All" was selected
                            if (selectAllActive) {
                              // Unselect all
                              field.onChange([]);
                              setSelectAllActive(false);
                            } else {
                              // Select all actual options
                              field.onChange(allOptionValues);
                              setSelectAllActive(true);
                            }
                          } else {
                            field.onChange(selected);
                            setSelectAllActive(selected.length === allOptionValues.length);
                          }
                        };

                        return (
                          <Select
                            mode="multiple"
                            placeholder="Assign To"
                            value={field.value || []}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            size="large"
                            style={{ width: "100%" }}
                            options={mergedOptions}
                            className="!min-h-[45px]"
                            showSearch
                            filterOption={(input, option) =>
                              option?.label?.toLowerCase()?.includes(input.toLowerCase())
                            }
                          />
                        );
                      }}
                    />
                    {errors.employee && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.employee.message}
                      </p>
                    )}
                  </div> */}

                  <div className="w-full">
                    <label className={`${inputLabelClassName}`}>
                      Due Date <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="tenureDate"
                      control={control}
                      rules={{
                        required: " Due date  is required",
                      }}
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
                          placeholder={'Select Task Priority'}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Task Priority</Select.Option>
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
                    } md:gap-4 md:my-1 px-3 md:mt-4`}
                >
                  <div>
                    <label className={`${inputLabelClassName}`}>
                      Financial Year <span className="text-red-600">*</span>
                    </label>
                    {/* <select
                      {...register("financialYear", {
                        required: "Financial year is required",
                      })}
                      className={`${inputClassName} ${errors.financialYear
                        ? "border-[1px] border-red-500"
                        : "border-gray-300"
                        }`}
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
                      name="financialYear"
                      rules={{ required: "Financial year is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          // defaultValue={getDefaultFinacialYear()}
                          placeholder={'Select Financial year'}
                          className={`${inputAntdSelectClassName} `}
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                        >
                          <Select.Option value="">Select Financial year</Select.Option>
                          {financialYears.map((year, index) => (
                            <Select.Option key={index} value={year}>
                              {year}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
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
                          <Select.Option value="Quaterly"> Quaterly</Select.Option>
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
                        className={`${inputClassName} ${errors.monthName ? "border-[1px] border-red-500" : "border-gray-300"}`}
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

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 md:my-1 px-3 md:mt-4">
                  <div className="col-span-2">
                    <label className={`${inputLabelClassName}`}>
                      Description <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("descriptions", {
                        required: "descriptions is required",
                      })}
                      className={`${inputClassName} ${errors.descriptions
                        ? "border-red-500"
                        : "border-gray-300"
                        }`}
                      placeholder="Enter descriptions "
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

                <div className="flex justify-end col-span-2 mt-4">
                  <button
                    type="submit"
                    className="bg-header text-white p-2 px-4 rounded"
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

export default CreateEmployeeTask;