import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
//import { createDesignation } from "./designationFeatures/_designation_reducers";

import { domainName, getLocationDataByPincode, inputClassName, inputClassNameSearch, inputerrorClassNameAutoComplete, inputLabelClassNameReactSelect, inputLabelClassName } from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { createNotification } from "./notificationFeatures/_notification_reducers";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { AutoComplete, Input } from "antd";
import ReactSelect from "react-select";
import { countrySearch } from "../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../global/address/city/CityFeatures/_city_reducers";
import { employeSearch } from "../../pages/employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { clientSearch } from "../client/clientManagement/clientFeatures/_client_reducers";
import { clientGrpSearch } from "../client/clientGroup/clientGroupFeatures/_client_group_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";

function CreateNotification() {
  const { register, handleSubmit,
    setValue,
    getValues,
    unregister,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const { companyList } = useSelector((state) => state.company);
  const { departmentListData } = useSelector((state) => state.department);
  const { clientList } = useSelector((state) => state.client);
  const { clientGroupList } = useSelector(state => state.clientGroup);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllCheckedClient, setIsSelectAllCheckedClient] = useState(false);
  const [editorValue, setEditorValue] = useState(``);

  const handleSelectAll = (field) => {
    if (isSelectAllChecked) {
      field.onChange([]);
    } else {
      const allGroup = clientGroupList.map((element) => ({
        value: element._id,
        label: element.fullName,
      }));
      field.onChange(allGroup);
    }
    setIsSelectAllChecked(!isSelectAllChecked);
  };
  const handleSelectAllClient = (field) => {
    if (isSelectAllCheckedClient) {
      field.onChange([]);
    } else {
      const allClients = clientList?.map((element) => ({
        value: element._id,
        label: element.fullName,
      }));
      field.onChange(allClients);
    }
    setIsSelectAllCheckedClient(!isSelectAllCheckedClient);
  };

  const { branchList } = useSelector(
    (state) => state.branch
  );
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });

  const notificationType = useWatch({
    control,
    name: "notificationType",
    defaultValue: ""
  });

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: companyId,
      directorId: '',
      branchId: branchId,
      departmentId: data?.departmentId,
      subject: data?.subject,
      notificationType: data?.notificationType,
      attachment: data?.fileUploadLink,
      message: editorValue,
      clientIds: notificationType === "client" ? data?.client?.map((client) => client.value) : [],
      clientGroupIds: notificationType === "group" ? data?.group?.map((group) => group.value) : [],
      clients: notificationType === "group" ? tags : [],
    };

    dispatch(createNotification(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/notification");
    });
  };

  const handleFileChange = (file) => {
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((data) => {
      if (!data.error) {
        setValue('fileUploadLink', data?.payload?.data)
      }
    });
  };

  const handleTagChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-2 md:my-2">
            {userType === "admin" &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Company<span className="text-red-600">*</span>
                </label>
                <select
                  onFocus={() => {
                    const reqPayload = {
                      "text": "",
                      "sort": true,
                      "status": "",
                      "isPagination": false,
                    }
                    dispatch(companySearch(reqPayload))
                  }}
                  {...register("companyId", {
                    required: "Company is required",
                  })}
                  className={` ${inputClassName} ${errors.companyId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Company
                  </option>
                  {companyList?.map((element) => (
                    <option value={element?._id}>
                      {element?.fullName}
                    </option>
                  ))}
                </select>
                {errors.companyId && (
                  <p className="text-red-500 text-sm">
                    {errors.companyId.message}
                  </p>
                )}
              </div>}
            {(userType === "admin" || userType === "company" || userType === "companyDirector") &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Branch<span className="text-red-600">*</span>
                </label>
                <select
                  onFocus={() => {
                    const reqPayload = {
                      companyId: companyId,
                      directorId: "",
                      "text": "",
                      "sort": true,
                      "status": "",
                      "isPagination": false,
                    }
                    dispatch(branchSearch(reqPayload))
                  }}
                  {...register("branchId", {
                    required: "Branch is required",
                  })}
                  className={` ${inputClassName} ${errors.branchId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Branch
                  </option>
                  {branchList?.map((element) => (
                    <option value={element?._id}>
                      {element?.fullName}
                    </option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="text-red-500 text-sm">
                    {errors.branchId.message}
                  </p>
                )}
              </div>}

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Type<span className="text-red-600">*</span>
              </label>
              <select
                {...register("notificationType", {
                  required: "Category is required",
                })}
                className={` ${inputClassName} ${errors.notificationType
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">Select Type</option>
                <option value="group">Client Group</option>
                <option value="client">Client Wise</option>
                <option value="department">Department Wise</option>
                <option value="other">other</option>
              </select>
              {errors[`notificationType`] && (
                <p className="text-red-500 text-sm">
                  {errors[`notificationType`].message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Subject <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("subject", {
                  required: "Subject is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.subject
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter subject"
              />
              {errors.subject && (
                <p className="text-red-500 text-sm">
                  {errors.subject.message}
                </p>
              )}
            </div>
            {(notificationType === "client") &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  client <span className="text-red-600">*</span>
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
                        dispatch(clientSearch({
                          companyId: companyId,
                          branchId: branchId,
                          groupId: watch('groupName'),
                          "directorId": "",
                          "organizationId": "",
                          "industryId": "",

                          "text": "",
                          "sort": true,
                          "status": true,
                          "isPagination": false,
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
                )}
              </div>
            }
            {(notificationType === "group") &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Group <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="group"
                  control={control}
                  rules={{ required: "At least one group is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      isMulti
                      onFocus={() => {
                        dispatch(clientGrpSearch({
                          companyId: companyId,
                          branchId: branchId,
                          text: "",
                          sort: true,
                          status: true,
                          isPagination: false,
                        }));
                      }}
                      options={[
                        { value: "select_all", label: "Select All" },
                        ...(Array.isArray(clientGroupList) ? clientGroupList.map((element) => ({
                          value: element._id,
                          label: element.fullName,
                        })) : []),
                      ]}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.group ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Employees..."
                      onChange={(selectedOptions) => {
                        const isSelectAllSelected = selectedOptions.find(
                          (option) => option.value === "select_all"
                        );

                        if (isSelectAllSelected) {
                          handleSelectAll(field);
                        } else {
                          // Check if all employees are selected
                          setIsSelectAllChecked(
                            selectedOptions.length === clientGroupList.length
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
                                checked={isSelectAllChecked}
                                onChange={() => handleSelectAll(field)}
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
                {errors.group && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.group.message}
                  </p>
                )}
              </div>}
            {(notificationType === "department") &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Department<span className="text-red-600">*</span>
                </label>
                <select
                  onFocus={() => {
                    const reqPayload = {
                      companyId: companyId,
                      branchId: branchId,
                      directorId: "",
                      "text": "",
                      "sort": true,
                      "status": true,
                      "isPagination": false,
                    }
                    dispatch(deptSearch(reqPayload))
                  }}
                  {...register("departmentId", {
                    required: "Department is required",
                  })}
                  className={` ${inputClassName} ${errors.departmentId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Department
                  </option>
                  {departmentListData?.map((element) => (
                    <option value={element?._id}>
                      {element?.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-sm">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>}
            {/* {(notificationType === "department") &&
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Department <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="departmentId"
                  control={control}
                  rules={{ required: "At least one department is required" }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={departmentListData?.map((department) => ({
                        value: department?._id,
                        label: department?.name,
                      }))}
                      classNamePrefix="react-select"
                      className={`${inputLabelClassNameReactSelect} ${errors.departmentId ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Select Departments"
                      onChange={(selectedOptions) => field.onChange(selectedOptions)}
                      value={field.value}
                    />
                  )}
                />
                {errors.departmentId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>} */}
            {(notificationType === "other") &&
              <div className="w-full">
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>Clients <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    {...register("clients",)}
                    className={`${inputClassName} ${errors.clients ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Write Clients & Press Enter"
                    value={tagInput}
                    onChange={handleTagChange}
                    onKeyDown={handleAddTag}
                  />
                  {errors.clients && (
                    <p className="text-red-500 text-sm">
                      {errors.clients.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded-full flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>}
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Message <span className="text-red-600">*</span>
              </label>
              <ReactQuill
                value={editorValue}
                onChange={handleEditorChange}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['blockquote', 'code-block'],
                    ['clean']
                  ],
                }}
                formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'clean']}
              />
            </div>
            <div className="w-full">
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
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default CreateNotification;
