import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from '../../../../constents/global';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getLeaveRequestDetails, updateleaveRequest } from './LeaveRequestFeatures/_leave_request_reducers';
import { leaveTypeSearch } from '../../../global/other/leavetypeManagment/LeaveTypeFeatures/_leave_type_reducers';
import { FaRegFile, FaTimes } from 'react-icons/fa';
import { fileUploadFunc } from '../../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers';
import dayjs from 'dayjs';
import { Modal, Select } from 'antd';
import Loader from '../../../../global_layouts/Loader';
import ListLoader from '../../../../global_layouts/ListLoader';
import CustomDatePicker from '../../../../global_layouts/DatePicker/CustomDatePicker';

const EditLeaveRequestModal = ({ isOpen, onClose, fetchattendanceListData, leaveRequestId }) => {

  const { register, handleSubmit, control, setValue,reset, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: moment().format('YYYY-MM-DD'),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });
  const { leaveListData, loading: LeaveTypeLoading } = useSelector((state) => state.leaveType);
  const { loading: leaveLoading } = useSelector(
    (state) => state.leaveRequest
  );
  const attachmentRef = useRef([]);

  useEffect(() => {
    dispatch(
      leaveTypeSearch({
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? companyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        employeId: '',
        text: "",
        sort: true,
        status: "",
        isPagination: false,
      })
    );
  }, []);
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
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const dispatch = useDispatch();
  const { leaverequestDetails } = useSelector((state) => state.leaveRequest);
  const [attachments, setAttachments] = useState([])

  useEffect(() => {
    if (leaveRequestId) {
      dispatch(getLeaveRequestDetails({ _id: leaveRequestId }));
    }
  }, [dispatch, leaveRequestId]);


  useEffect(() => {
    if (leaverequestDetails) {
      setValue("leaveTypeId", leaverequestDetails?.leaveTypeId);
      setValue("dayType", leaverequestDetails?.type);
      setValue("fromDate", dayjs(leaverequestDetails?.startDate));
      setValue("fromDayStatus", leaverequestDetails?.type === "Single" ? leaverequestDetails?.subType : leaverequestDetails?.startDateBreakDown)
      setValue("toDate", leaverequestDetails?.type === "Single" ? dayjs(leaverequestDetails?.startDate) : dayjs(leaverequestDetails?.endDate));
      setValue("toDayStatus", leaverequestDetails?.type === "Single" ? leaverequestDetails?.subType : leaverequestDetails?.endDateBreakDown);
      setValue("leaveReason", leaverequestDetails?.reason);
      setAttachments(leaverequestDetails?.attachment)
    }

  }, [leaverequestDetails, setValue]);
  const onFormSubmit = (data) => {
    const reqData = {
      _id: leaveRequestId,
      employeId: leaverequestDetails?.employeId,
      companyId: leaverequestDetails?.companyId,
      branchId: leaverequestDetails?.branchId,
      "approvedBy": null,
      "leaveTypeId": data?.leaveTypeId,
      type: data?.dayType,
      subType: data.dayType === "Single" ? data.fromDayStatus : "",
      startDate: dayjs(data?.fromDate).format("YYYY-MM-DD"),
      startDateBreakDown: data.dayType === "Single" ? "" : data?.fromDayStatus,
      endDate: data?.dayType === "Single" ? dayjs(data?.fromDate).format("YYYY-MM-DD") : dayjs(data?.toDate).format("YYYY-MM-DD"),
      endDateBreakDown: data?.dayType === "Single" ? "" : data?.toDayStatus,
      reason: data?.leaveReason,
      attachment: attachments,
    };

    dispatch(updateleaveRequest(reqData)).then((response) => {
      if (!response.error) {

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Leave Request sent successfully.',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'bg-header text-white hover:bg-[#063156]',
          },
        });


        fetchattendanceListData();
        onClose();
        reset()
      }

    });
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
        setAttachments(prev => (

          [...prev, res.payload?.data]
        ));
      }
    }).then(() => {
      if (attachmentRef.current) attachmentRef.current.value = ''
    })
  };
  const handleRemoveFile = (index) => {
    setAttachments(prev => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      return updatedAttachments
    });
  };
  if (!isOpen) return null;
  return (
    <Modal
      visible={isOpen}
      onCancel={()=>{
        onClose();
        reset()
      }}
      footer={null}
      title="Edit Leave"
      width={600}
      height={400}
 className="antmodalclassName"
    >
      <div>
        <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
          <div className="grid grid-col-1 md:grid-cols-2 gap-4">

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

                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select Leave Request</Select.Option>
                    {LeaveTypeLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (leaveListData?.map((leaveRequest) => (
                      <Select.Option key={leaveRequest?._id} value={leaveRequest?._id}>
                        {leaveRequest?.name}
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
          <div className="border-t pt-4 mt-6">


            <div className="space-y-4">
              <input ref={attachmentRef} type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer">
                <FaRegFile className="mr-2" /> Add Attachments
              </label>

              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
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
          <div className='grid grid-col-1 md:grid-cols-1 gap-4'>
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
              disabled={leaveLoading}
              className={`${leaveLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {leaveLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>

    </Modal>
  );
};

export default EditLeaveRequestModal;
