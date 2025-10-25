import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Modal, AutoComplete, Input, Select, Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import getUserIds from '../../../constents/getUserIds';
import { domainName, getLocationDataByPincode, inputAntdSelectClassName, inputClassName, inputLabelClassName, inputerrorClassNameAutoComplete, sortByPropertyAlphabetically } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { createProjectTaskFunc } from "./ProjecttaskFeatures/_project_task_reducers";
import { projectmanagementSearch } from "../ProjectManagement/ProjectManagementFeatures/_ProjectManagement_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import moment from "moment";
import dayjs from "dayjs";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";

function CreateProjectTask({ isOpen, data, fetchListAfterSuccess, closeModalFunc, handlingPerson = "manager",isDirector=false}) {
  const { loading: projectTaskListLoading } = useSelector(state => state.projectTask);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();

  const dispatch = useDispatch();
  const [attachment, setAttachment] = useState([]);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { employeList, loading: employeeLoading } = useSelector((state) => state.employe);
  const { projectmanagementList } = useSelector((state) => state.projectManagement);

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const relatedTo = useWatch({
    control,
    name: "relatedTo",
    defaultValue: "",
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });





  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };

    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setAttachment((prev) => [...prev, res?.payload?.data]);
      }
    });
  };

  const handleRemoveFile = (index) => {
    setAttachment((prev) => {
      const updatedAttachments = prev?.filter((_, i) => i !== index);
      return updatedAttachments;
    });
  };

  // Fetch data only when modal is open
  useEffect(() => {
    if (!isOpen) return;

    if ( userType === "company" || userType === "companyDirector") {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          companyId: companyId,
          isPagination: false,
        })
      );
    }
  }, [isOpen, companyId]);

  useEffect(() => {
    if (!isOpen) return;

    if ((companyId || userInfoglobal?.userType !== "admin") &&
      (branchId || userInfoglobal?.userType !== "companBranch" || userInfoglobal?.userType === "employee")) {
      if (handlingPerson === "manager") {
        fetchEmployeListData();
      }
      dispatch(projectmanagementSearch({
        directorId: "",
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
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        text: '',
        sort: true,
        status: '',
        isPagination: false,
      }));
    }
  }, [isOpen, companyId, branchId]);

  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: isDirector ? '' : userInfoglobal?.userType === "employee" ? userInfoglobal?.departmentId : '',
      designationId: "",
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
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
    };
    dispatch(employeSearch(reqPayload));
  };

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: companyId,
      directorId: "",
      branchId: branchId,
      "title": data?.name,
      "projectId": data?.relatedTo === "project" ? data?.projectId : null,
      "description": data?.descriptions,
      "followerIds": [],
      "assignedTo": handlingPerson === "manager" ?  data?.employee : handlingPerson === "employee" ? userInfoglobal?._id : '',
      "startDateTime": data?.checkInTime,
      "endDateTime": data?.checkOutTime,
      "relatedTo": data?.relatedTo,
      "priority": data?.taskPriority,
      "attachment": attachment,
      "estimatedHours": null,
      "tags": [],
    };

    dispatch(createProjectTaskFunc(finalPayload)).then((result) => {
      if (!result.error) {
        // Reset form and close modal on success
        reset();
        setAttachment([]);
        closeModalFunc();
        fetchListAfterSuccess(); // Refresh the parent list
      }
    });
  };

  const handleCancel = () => {
    reset();
    setAttachment([]);
    closeModalFunc();
  };

  return (
    <Modal
      title="Create Project Task"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      className="antmodalclassName"
    >
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
            <div>
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
                    className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-red-500" : "border-gray-300"}`}
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={(trigger) => trigger.parentNode}
                    placeholder="Select Branch"
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
              {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
            </div>
          )}

          <div className="">
            <label className={`${inputLabelClassName}`}>
              Task Title <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Task Title is required",
              })}
              className={`${inputClassName} ${errors.name ? "border-red-500" : "border-gray-300"}`}
              placeholder="Enter Task Title"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">
                {errors.name.message}
              </p>
            )}
          </div>

      {handlingPerson === "manager" &&    <div className="">
            <label className={`${inputLabelClassName}`}>
              Assign To <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="employee"
              rules={{ required: "employee is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                  getPopupContainer={(trigger) => trigger.parentNode}

                  className={`${inputAntdSelectClassName} ${errors.employee ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Select Assign To"
                >
                  <Select.Option value="">Select Assign To</Select.Option>
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
          </div>}

          <div className="w-full">
            <label className={`${inputLabelClassName}`}>
              Task Priority <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="taskPriority"
              rules={{ required: "Task Priority is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Task Priority"
                  className={`${inputAntdSelectClassName} ${errors.taskPriority ? "border-red-500" : "border-gray-300"}`}
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Task Priority</Select.Option>
                  {['low', 'medium', 'high', 'urgent']?.map(data =>
                    <Select.Option key={data} value={data}>{data}</Select.Option>
                  )}
                </Select>
              )}
            />
            {errors.taskPriority && (
              <p className="text-red-500 text-sm">
                {errors.taskPriority.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <label className={`${inputLabelClassName}`}>
              Related To <span className="text-red-600">*</span>
            </label>
            <Controller
              control={control}
              name="relatedTo"
              rules={{ required: "Related To is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Select Related To"
                  className={`${inputAntdSelectClassName} ${errors.relatedTo ? "border-red-500" : "border-gray-300"}`}
                  showSearch
                  getPopupContainer={(trigger) => trigger.parentNode}
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Related To</Select.Option>
                  {['project', 'other']?.map(data =>
                    <Select.Option key={data} value={data}>{data}</Select.Option>
                  )}
                </Select>
              )}
            />
            {errors.relatedTo && (
              <p className="text-red-500 text-sm">
                {errors.relatedTo.message}
              </p>
            )}
          </div>

          {relatedTo === "project" && (
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Project <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="projectId"
                rules={{ required: "Project is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select Project"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    className={`${inputAntdSelectClassName} ${errors.projectId ? "border-red-500" : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Project</Select.Option>
                    {projectmanagementList?.map((data, index) =>
                      <Select.Option key={index} value={data?._id}>{data?.title}</Select.Option>
                    )}
                  </Select>
                )}
              />
              {errors.projectId && (
                <p className="text-red-500 text-sm">
                  {errors.projectId.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className={`${inputLabelClassName}`}>
              Start Time <span className="text-red-600">*</span>
            </label>
            <Controller
              name="checkInTime"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomDatePicker
                  field={field}
                  showTime={true}
                  format="DD/MM/YYYY HH:mm"
                  errors={errors}
                  disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }}
                />
              )}
            />
            {errors.checkInTime && (
              <p className="text-red-500 text-sm">Start Time is required</p>
            )}
          </div>

          <div>
            <label className={`${inputLabelClassName}`}>
              End Time <span className="text-red-600">*</span>
            </label>
            <Controller
              name="checkOutTime"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomDatePicker
                  field={field}
                  showTime={true}
                  format="DD/MM/YYYY HH:mm"
                  errors={errors}
                  disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }}
                />
              )}
            />
            {errors.checkOutTime && (
              <p className="text-red-500 text-sm">End Time is required</p>
            )}
          </div>

          <div className="md:col-span-2 ">
            <label className={`${inputLabelClassName}`}>
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              {...register("descriptions", {
                required: "Description is required",
              })}
              className={`${inputClassName} ${errors.descriptions ? "border-red-500" : "border-gray-300"} h-24`}
              placeholder="Enter description"
            />
            {errors.descriptions && (
              <p className="text-red-500 text-sm">
                {errors.descriptions.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2 space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer hover:bg-gray-50"
            >
              <FaRegFile className="mr-2" /> Add Attachments
            </label>

            <div className="space-y-2">
              {attachment?.map((file, index) => (
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

        <div className="flex justify-end space-x-4 mt-6">
          <Button onClick={handleCancel} disabled={projectTaskListLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={projectTaskListLoading}
            loading={projectTaskListLoading}
          >
            {projectTaskListLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectTask;