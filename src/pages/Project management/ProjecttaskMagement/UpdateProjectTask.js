import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Modal, Select, Button, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import getUserIds from '../../../constents/getUserIds';
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { getProjectTaskDetails, projectTaskreset, updateProjectTaskFunc } from "./ProjecttaskFeatures/_project_task_reducers";
import { projectmanagementSearch } from "../ProjectManagement/ProjectManagementFeatures/_ProjectManagement_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import moment from "moment";
import dayjs from "dayjs";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";

function UpdateProjectTask({ isOpen, data, fetchListAfterSuccess, closeModalFunc }) {
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

  const projectTaskId = data?._id;
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();

  const dispatch = useDispatch();
  const [attachment, setAttachment] = useState([]);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { employeList, loading: employeeLoading } = useSelector((state) => state.employe);
  const { projectmanagementList } = useSelector((state) => state.projectManagement);
  const { projectTaskDetails } = useSelector((state) => state.projectTask);

  const relatedTo = useWatch({
    control,
    name: "relatedTo",
    defaultValue: "",
  });

  const employeeId = useWatch({
    control,
    name: "employee",
    defaultValue: "",
  });

  const reportingperson = employeList?.find(data => data?._id === employeeId)?.reportingperson;

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
    setAttachment((prev) => prev?.filter((_, i) => i !== index));
  };

  // Get dropdown container for select elements to work properly in modal
  const getPopupContainer = (triggerNode) => {
    return triggerNode.parentNode;
  };

  // Fetch task details when modal opens
  useEffect(() => {
    if (isOpen && projectTaskId) {
      dispatch(getProjectTaskDetails({ _id: projectTaskId }));
    }
  }, [isOpen, projectTaskId]);

  // Set form values when details are loaded
  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && projectTaskDetails) {
        try {
          await Promise.all([
            dispatch(projectmanagementSearch({
              directorId: "",
              companyId: projectTaskDetails?.companyId,
              branchId: projectTaskDetails?.branchId,
              text: '',
              sort: true,
              status: '',
              isPagination: false,
            })),

          ]);

          // Set form values
          reset({
            name: projectTaskDetails?.title,
            projectId: projectTaskDetails?.projectId,
            descriptions: projectTaskDetails?.description,
            employee: projectTaskDetails?.assignedTo,
            assignedPersonname: projectTaskDetails?.assignedToData?.fullName,
            checkInTime: projectTaskDetails?.startDateTime ? dayjs(projectTaskDetails?.startDateTime) : null,
            checkOutTime: projectTaskDetails?.endDateTime ? dayjs(projectTaskDetails?.endDateTime) : null,
            relatedTo: projectTaskDetails?.relatedTo,
            taskPriority: projectTaskDetails?.priority,

          });

          setAttachment(projectTaskDetails?.attachment || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [isOpen, projectTaskDetails]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(projectTaskreset());
    };
  }, []);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: projectTaskId, // Include ID for update
      companyId: projectTaskDetails?.companyId,
      directorId: "",
      branchId: projectTaskDetails?.branchId,
      title: data?.name,
      projectId: data?.relatedTo === "project" ? data?.projectId : null,
      description: data?.descriptions,
      followerIds: [],
      assignedTo: data?.employee,
      startDateTime: data?.checkInTime,
      endDateTime: data?.checkOutTime,
      relatedTo: data?.relatedTo,
      priority: data?.taskPriority,
      attachment: attachment,
      estimatedHours: null,
      tags: [],
    };

    dispatch(updateProjectTaskFunc(finalPayload)).then((result) => {
      if (!result.error) {
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
      title="Update Project Task"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
      destroyOnClose
      className="antmodalclassName"
    >
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
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

          <div className="">
            <label className={`${inputLabelClassName}`}>
              Assign To <span className="text-red-600">*</span>
            </label>
            <div className="">

              <input
                type="text"
                {...register("assignedPersonname")}
                disabled
                className={`${inputDisabledClassName} ${errors.name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Assigned To "
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

          </div>

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
                  getPopupContainer={getPopupContainer}
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
                  getPopupContainer={getPopupContainer}
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
                    className={`${inputAntdSelectClassName} ${errors.projectId ? "border-red-500" : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    getPopupContainer={getPopupContainer}
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

          <div className="col-span-2">
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

          <div className="col-span-2 space-y-4">
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
            {projectTaskListLoading ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default UpdateProjectTask;