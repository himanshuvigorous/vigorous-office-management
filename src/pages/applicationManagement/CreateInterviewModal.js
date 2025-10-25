import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';

import { employeSearch } from '../employeManagement/employeFeatures/_employe_reducers';
import { useDispatch, useSelector } from 'react-redux';
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from '../../constents/global';
import { createInterview } from '../hr/RecruitmentProcess/Interview/InterviewFeatures/_interview_reducers';
import { Select } from 'antd';
import CustomDatePicker from '../../global_layouts/DatePicker/CustomDatePicker';
import dayjs from 'dayjs';
import { getInterviewRoundList, InterviewRoundTypeSearch } from '../global/other/interviewRoundName/InterviewRoundFeatures/_interviewRound_type_reducers';
import Loader from '../../global_layouts/Loader';


const CreateInterviewModal = ({ isOpen, onClose, fetchinterviewListData, applicationId }) => {
  const { loading:interviewLoading } = useSelector(
    (state) => state.interview
  );

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
    defaultValues: {
      employeeName: '',
      date: dayjs(),
      checkInTime: '',
      checkOutTime: '',
      reason: '',
      errors: {},
    }
  });
  const {  interviewRoundListData } = useSelector((state) => state.interviewRound);

  const dispatch = useDispatch();
  const { employeList } = useSelector((state) => state.employe);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const inteviewType = useWatch({
    control,
    name: "type",
    defaultValue: "",
  });
  const fullName = useWatch({
    control,
    name: "fullName",
    defaultValue: "",
  });

  const onFormSubmit = (data) => {
    const finalPayload = {
      interviewerId: data?.fullName,
      branchId: applicationId?.branchId,
      directorId: '',
      applicationId: applicationId?._id,
      companyId: applicationId?.companyId,
      departmentId: applicationId?.companyId,
      interviewerName:employeList?.find(element => element?._id ===  data?.fullName)?.fullName,
      interviewerPosition:employeList?.find(element => element?._id ===  data?.fullName)?.designationData?.name,
      feedback: data?.feedback,
      type: data?.type,
      roundName: data?.roundName,
      date: data?.date,
      meetingUrl: data?.type === "online" ? data?.meetingLink : null,
      location: data?.type === "online" ? null : data?.location,
    };

    dispatch(createInterview(finalPayload)).then((data) => {
      if (!data.error)
        fetchinterviewListData();
         onClose();
    });
  };


  // const handleSelectInterviewer = (selectedOption) => {
  //   const selectedEmployee = employeList?.find((employee) => employee?._id === selectedOption?.value);
  //   setSelectedDesignation(selectedEmployee?.designationData?.name || "");
  //   setValue("interviewerName", employeList?.find(element => element?._id === selectedOption?.value)?.fullName);
  //   setValue("interviewerPosition", employeList?.find(element => element?._id === selectedOption?.value)?.designationData?.name);
  // };

  // const handleInputChange = (inputValue) => {
  //   if (inputValue.length > 2) {
  //     dispatch(employeSearch({ text: inputValue, sort: true, status: true, isPagination: false, isTL: "" }));
  //   }
  // };



  useEffect(() => {
    fetchEmployeListData()
    getInterviewRound()

  }, [])

  const getInterviewRound = () => {
  const   reqData = {
      directorId: "",
      companyId: applicationId?.companyId,
      branchId: applicationId?.branchId,
      "text": "",
      "sort": true,
      "status": "",
      "isPagination": false,
    }
    dispatch(InterviewRoundTypeSearch(reqData));
  };
  const fetchEmployeListData = () => {
    const reqPayload = {
      text: "",
      status: true,
      sort: true,
      isTL: "",
      isHR: "",
      isPagination: false,
      departmentId: '',
      designationId: '',
      companyId: applicationId?.companyId,
      branchId: applicationId?.branchId,
      isBranch: true,
      isDirector: true,
    };

    dispatch(employeSearch(reqPayload));
  };
  if (!isOpen) return null;


  return (

    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1560]" onClick={onClose} >
      <div className="animate-slideInFromTop bg-gray-100 rounded-lg p-6 w-full max-w-full md:max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div>
          <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
            <div className="grid grid-col-1 md:grid-cols-2 gap-4">


              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Interviewer Name <span className="text-red-600">*</span>
                </label>
                

                <Controller
                      name="fullName"
                      control={control}
                      rules={{
                        required: "InterViewr Name is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.fullName ? "border-[1px] " : "border-gray-300"}`}
                          popupClassName={'!z-[1580]'}
                          placeholder="Select Interviewr"
                          showSearch
                          filterOption={(input, option) =>
                            option?.children?.toLowerCase()?.includes(input.toLowerCase())
                          }
                          optionLabelProp="children"
                          >
                          <Select.Option value="">Select Interviewr</Select.Option>
                          {employeList?.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                       {item.fullName}
                      </Select.Option>
                    ))}
                        </Select>
                      )}
                    />

                {errors.fullName && (
                  <p className="text-red-500 text-sm">{errors.fullName.message}</p>
                )}

                {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
              </div>

              <div className="w-full ">
                <label className={`${inputLabelClassName}`}>Interviewer Designation</label>
                <input
                  type="text"
                  value={employeList?.find(element => element?._id === fullName)?.designationData?.name}
                  readOnly
                  {...register("interviewerPosition",)}
                  className={` ${inputDisabledClassName} text-gray-700 ${errors.interviewerPosition ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter interviewer position"
                />
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Date<span className="text-red-600"> *</span>
                </label>
                <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <CustomDatePicker
                          field={field}
                          showTime={true} 
                          format = "DD/MM/YYYY hh:mm"
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
                {/* <input
                  type="datetime-local"
                  min={new Date().toISOString().slice(0, 16)}
                  {...register("date", {
                    required: "Date is required",
                  })}
                  className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Date of Birth"
                /> */}

                {errors.date && (
                  <p className="text-red-500 text-sm">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Type<span className="text-red-600"> *</span>
                </label>
                <Controller
                      name="type"
                      control={control}
                      rules={{
                        required: "Type is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.fullName ? "border-[1px] " : "border-gray-300"}`}
                          popupClassName={'!z-[1580]'}
                          placeholder="Select Type"
                          showSearch >
                           <Select.Option className="" value="">Select type</Select.Option>
                  <Select.Option value="online">Online</Select.Option>
                  <Select.Option value="offline">Ofline</Select.Option>
               
                        </Select>
                      )}
                    />
                {/* <select
                  {...register("type", {
                    required: "Type is required",
                  })}
                  className={` ${inputClassName} ${errors.type
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">Select type</option>
                  <option value="online">Online</option>
                  <option value="offline">Ofline</option>
                </select> */}
                {errors.type && (
                  <p className="text-red-500 text-sm">
                    {errors.type.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Round Name <span className="text-red-600">*</span>
                </label>
                <Controller
                      name="roundName"
                      control={control}
                      rules={{
                        required: "Round is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.fullName ? "border-[1px] " : "border-gray-300"}`}
                          popupClassName={'!z-[1580]'}
                          placeholder="Select Round Name"
                          showSearch >
                          <Select.Option value="">Select Round Name</Select.Option>
                          {interviewRoundListData?.map((item) => (
                      <Select.Option key={item.name} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                        </Select>
                      )}
                    />
                
                
                {errors.roundName && (
                  <p className="text-red-500 text-sm">
                    {errors.roundName.message}
                  </p>
                )}
              </div>

              {inteviewType === "offline" && <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Location<span className="text-red-600">*</span>
                </label>
                <input 
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={` ${inputClassName} ${errors.location ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div> }
              {inteviewType === "online" && <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Meeting Link<span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("meetingLink", {
                    required: "Meeting Link is required",
                  })}
                  className={` ${inputClassName} ${errors.meetingLink ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Meeting Link"
                />
                {errors.meetingLink && (
                  <p className="text-red-500 text-sm">
                    {errors.meetingLink.message}
                  </p>
                )}
              </div> }

            </div>
            <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={interviewLoading}
              className={`${interviewLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {interviewLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default CreateInterviewModal;