import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import moment from "moment";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";
import Swal from "sweetalert2";
import {
  createLeaveRequest,
  getLeaveDashboard,
} from "./LeaveRequestFeatures/_leave_request_reducers";
import { leaveTypeSearch } from "../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";
import { fileUploadFunc } from "../../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { getAssignLeaveDetails } from "../AssignLeaves/AssignLeaveFeatures/_assign_leave_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import dayjs from "dayjs";
import { Modal, Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";

const CreateLeaveRequestModal = ({
  isOpen,
  onClose,
  fetchattendanceListData,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employeeName: "",
      date: moment().format("YYYY-MM-DD"),
      checkInTime: "",
      checkOutTime: "",
      reason: "",
      errors: {},
    },
  });

  const navigate = useNavigate();
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const multipleType = useWatch({
    control,
    name: "dayType",
    defaultValue: "",
  });
  const fromDate = useWatch({
    control,
    name: "fromDate",
    defaultValue: "",
  });

  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });
  const employeeId = useWatch({
    control,
    name: "employee",
    defaultValue: "",
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const dispatch = useDispatch();
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { employeList } = useSelector((state) => state.employe);
  const [attachments, setAttachments] = useState([]);
  const { assignLeaveRequestDetails, loading: assignRequestLoading } = useSelector(
    (state) => state.assignLeave
  );
  const { loading: leaverequestLoading } = useSelector(
    (state) => state.leaveRequest
  );

  const attachmentRef = useRef([]);

  const onFormSubmit = (data) => {
    const reqData = {
      employeId: data?.employee?.value,
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
      directorId:
        userInfoglobal?.userType === "companyDirector"
          ? userInfoglobal?._id
          : userInfoglobal?.directorId,
      approvedBy: null,
      leaveTypeId: data?.leaveTypeId,
      type: data?.dayType,
      subType: data.dayType === "Single" ? data.fromDayStatus : "",
      startDate: dayjs(data?.fromDate).format("YYYY-MM-DD"),
      startDateBreakDown: data.dayType === "Single" ? "" : data?.fromDayStatus,
      endDate: data?.dayType === "Single" ? dayjs(data?.fromDate).format("YYYY-MM-DD") : dayjs(data?.toDate).format("YYYY-MM-DD"),
      endDateBreakDown: data?.dayType === "Single" ? "" : data?.toDayStatus,
      reason: data?.leaveReason,
      attachment: attachments,
      "status": "Approved"
    };

    dispatch(createLeaveRequest(reqData)).then((response) => {
      if (!response.error) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Leave Request sent successfully.",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "bg-header text-white hover:bg-[#063156]",
          },
        });

        fetchattendanceListData();
        onClose();
        reset()
      }
    });
  };
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
      (userInfoglobal?.userType === "admin" && companyId) ||
      (userInfoglobal?.userType === "company" && userInfoglobal?._id) ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      setValue("PDDepartmentId", "");
      setValue("PDDesignationId", "");
      setValue("PDBranchId", "");

      dispatch(
        branchSearch({
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [companyId]);
  useEffect(() => {
    if (
      (companyId || userInfoglobal?.userType !== "admin") &&
      (branchId ||
        userInfoglobal?.userType !== "companBranch" ||
        userInfoglobal?.userType === "employee")
    ) {
      fetchEmployeListData();
    }
  }, [companyId, branchId]);

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

  useEffect(() => {
    if (employeeId?.value) {
      getAssignRequestData(employeeId?.value);
    }
  }, [employeeId]);
  const getAssignRequestData = (employeId) => {
    const reqData = {
      employeId: employeId,
      companyId:
        userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      branchId:
        userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
      text: "",
      sort: true,
      status: "",
      isPagination: false,
      leaveTypeId: "",
    };
    dispatch(getAssignLeaveDetails(reqData));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reqData = {
      filePath: file,
      isVideo: false,
      isMultiple: false,
    };
    dispatch(fileUploadFunc(reqData)).then((res) => {
      if (res?.payload?.data) {
        setAttachments((prev) => [...prev, res.payload?.data]);
      }
    }).then(() => {
      if (attachmentRef.current) attachmentRef.current.value = ''
    })
  };
  const handleRemoveFile = (index) => {
    setAttachments((prev) => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      return updatedAttachments;
    });
  };
  if (!isOpen) return null;
  return (
    <Modal
      visible={isOpen}
      onCancel={() => {
        onClose();
        reset()
      }}
      footer={null}
      title="Apply Leave"
      width={600}
      height={400}
      className="antmodalclassName"


    >
      {assignLeaveRequestDetails?.docs?.length > 0 && employeeId?.value && (
        <div className="p-2 border rounded-lg">
          <div className={`${inputLabelClassName}`}>Available Leave</div>
          <div className="flex gap-2 flex-wrap">
            {assignLeaveRequestDetails?.docs?.map((element, index) => (
              <div
                key={index}
                className="bg-header rounded-full shadow-sm p-1 "
              >
                <div className="flex justify-between items-center ">
                  <span className="text-white text-xs capitalize px-2">
                    {element?.leaveTypeData?.name}
                  </span>{" "}
                  :
                  <span className="text-white text-xs capitalize px-2">
                    {element?.availableLeaves}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">
            {userInfoglobal?.userType === "admin" && (
              <div>
                <label className={`${inputLabelClassName}`}>Company <span className="text-red-600">*</span></label>
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
                      {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (companyList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        )))
                      }
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
                <div>
                  <label className={`${inputLabelClassName}`}>Branch <span className="text-red-600">*</span></label>
                  <Controller
                    control={control}
                    name="PDBranchId"
                    rules={{ required: "Branch is required" }}

                    render={({ field }) => (
                      <Select
                        {...field}
                        onChange={(value) => {
                          setValue("employee", '')
                          setValue("leaveTypeId", '')
                          setValue("fromDayStatus", '')
                          setValue("toDayStatus", '')
                          field.onChange(value);
                        }}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                          (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          )))
                        }
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

            <div className="w-full">
              <label className={`${inputLabelClassName}`}>Employee <span className="text-red-600">*</span></label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <ReactSelect
                    {...field}
                    options={sortByPropertyAlphabetically(employeList, 'fullName')?.map((employee) => ({
                      value: employee?._id,
                      label: employee?.fullName,
                    }))}
                    classNamePrefix="react-select"
                    className={`${inputLabelClassNameReactSelect} ${errors.employee ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Employee"
                  />
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">
                  {errors.employee.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Single day / Multiple days <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="dayType"
                rules={{ required: "Day Type is required" }}

                render={({ field }) => (
                  <Select
                    {...field}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    defaultValue={""}

                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select Single / Multiple </Select.Option>
                    {["Single", "Multiple"].map((type) => (
                      <Select.Option key={type} value={type}>
                        {type}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.dayType && (
                <p className="text-red-500 text-sm">
                  {errors.dayType.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Leave Type <span className="text-red-600">*</span>
              </label>
              <Controller
                control={control}
                name="leaveTypeId"
                rules={{ required: "leave Request is required" }}

                render={({ field }) => (
                  <Select
                    {...field}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select Leave Request</Select.Option>
                    {assignRequestLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (assignLeaveRequestDetails?.docs?.map((leaveRequest) => (
                      <Select.Option key={leaveRequest?.leaveTypeId} value={leaveRequest?.leaveTypeId}>
                        {leaveRequest?.leaveTypeData?.name}
                      </Select.Option>
                    )))}
                  </Select>
                )}
              />
              {errors.leaveTypeId && (
                <p className="text-red-500 text-sm">
                  {errors.leaveTypeId.message}
                </p>
              )}
            </div>
          </div>
          <div className="border border-gray-800 rounded-md p-2 my-2">
            <div className="grid grid-col-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${inputLabelClassName}`}>
                  {multipleType === "Multiple" ? "From" : ""} Date <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="fromDate"
                  control={control}
                  rules={
                    {
                      required: 'Date is required'
                    }
                  }
                  render={({ field }) => (
                    <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                      return current && current.isBefore(moment().endOf('day'), 'day');
                    }} />
                  )}
                />
                {errors.fromDate && (
                  <p className="text-red-500 text-sm">Date is required</p>
                )}
              </div>
              <div>
                <label className={`${inputLabelClassName}`}>Day Type <span className="text-red-600">*</span></label>
                <Controller
                  control={control}
                  name="fromDayStatus"
                  rules={{ required: "Day Status is required" }}

                  render={({ field }) => (
                    <Select
                      {...field}
                      getPopupContainer={(trigger) => trigger.parentNode}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                    >
                      <Select.Option value="">Select Day Type</Select.Option>
                      <Select.Option disabled={multipleType === "Multiple"} value="firstHalf">firstHalf</Select.Option>
                      <Select.Option value="secondHalf">secondHalf</Select.Option>
                      <Select.Option value="fullDay">fullDay</Select.Option>
                    </Select>
                  )}
                />
                {errors.fromDayStatus && (
                  <p className="text-red-500 text-sm">
                    {errors.fromDayStatus.message}
                  </p>
                )}
              </div>

              {multipleType === "Multiple" && (
                <div>
                  <label className={`${inputLabelClassName}`}>To Date <span className="text-red-600">*</span></label>
                  <Controller
                    name="toDate"
                    control={control}
                    rules={{
                      required: 'To date is required'
                    }}
                    render={({ field }) => (
                      <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                        return (
                          current &&
                          (dayjs(current).isBefore(dayjs(), 'day') || dayjs(current).isSame(dayjs(), 'day'))
                        )
                      }} />
                    )}
                  />
                  {errors?.toDate && (
                    <p className="text-red-500 text-sm">To Date is required</p>
                  )}
                </div>
              )}
              {multipleType === "Multiple" && (
                <div>
                  <label className={`${inputLabelClassName}`}>Day Type <span className="text-red-600">*</span></label>

                  <Controller
                    control={control}
                    name="toDayStatus"
                    rules={{ required: "Day Status is required" }}

                    render={({ field }) => (
                      <Select
                        {...field}
                        getPopupContainer={(trigger) => trigger.parentNode}
                        defaultValue={""}

                        className={`${inputAntdSelectClassName} `}
                      >
                        <Select.Option value="">Select Day Type</Select.Option>
                        <Select.Option value="firstHalf">firstHalf</Select.Option>
                        <Select.Option disabled value="secondHalf">secondHalf</Select.Option>
                        <Select.Option value="fullDay">fullDay</Select.Option>
                      </Select>
                    )}
                  />
                  {errors.toDayStatus && (
                    <p className="text-red-500 text-sm">
                      {errors.toDayStatus.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="border-t">
            <label className={`${inputLabelClassName}`}>Attachments </label>
            <div className="space-y-4">
              <input
                type="file"
                ref={attachmentRef}
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
              >
                <FaRegFile className="mr-2" /> Add Attachments
              </label>

              <div className="space-y-2">
                {attachments.map((file, index) => (
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
                      <span className="text-sm text-gray-600">{file}</span>
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
          <div className="grid grid-col-1 md:grid-cols-1 gap-4">
            <div className="">
              <label className={`${inputLabelClassName}`}>Leave Reason <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("leaveReason", {
                  required: "Leave Reason is required",
                })}
                className={` ${inputClassName} ${errors.leaveReason ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Leave Reason"
              />
              {errors.leaveReason && (
                <p className="text-red-500 text-sm">
                  {errors.leaveReason.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={leaverequestLoading}
              className={`${leaverequestLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {leaverequestLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateLeaveRequestModal;
