import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getInterviewDetails, updateInterview } from "./InterviewFeatures/_interview_reducers";
import { decrypt } from "../../../../config/Encryption";
import { domainName, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import { jobPostSearch } from "../JobPost/JobPostFeatures/_job_post_reducers";
import { applicationSearch } from "../../../applicationManagement/applicationFeatures/_application_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactSelect from "react-select";
import dayjs from "dayjs";
import { Select } from "antd";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { getInterviewRoundList } from "../../../global/other/interviewRoundName/InterviewRoundFeatures/_interviewRound_type_reducers";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import Loader2 from "../../../../global_layouts/Loader/Loader2";

const EditInterview = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const { interviewIdEnc } = useParams();
  const interviewId = decrypt(interviewIdEnc);
  const { interviewDetails } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [editPageLoader,setEditPageLoader]=useState(true);
  const {  interviewRoundListData } = useSelector((state) => state.interviewRound);

  const {
    userCompanyId,
    userBranchId,
    userDepartmentId,
    userDesignationId,
  } = getUserIds();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { employeList ,loading:employeeLoading} = useSelector((state) => state.employe);
  const fullName = useWatch({
    control,
    name: "fullName",
    defaultValue: "",
  }); 
   const inteviewType = useWatch({
    control,
    name: "type",
    defaultValue: "",
  });


  useEffect(() => {
    if (interviewId) {
      dispatch(getInterviewDetails({ _id: interviewId })).then(()=>{
        setEditPageLoader(false)
      })
    }
  }, [dispatch, interviewId]);


  const {  loading:interviewLoading } = useSelector(
    (state) => state.interview
  );
  useEffect(() => {
    if (interviewDetails) {
      dispatch(getInterviewRoundList({
        directorId: "",
        companyId: interviewDetails?.companyId,
        branchId: interviewDetails?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": false,
      }))
      setValue("interviewerName", interviewDetails?.interviewerName);
      setValue("interviewerPosition", interviewDetails?.interviewerPosition);
      setValue("fullName", interviewDetails?.interviewerId);
      setValue("feedback", interviewDetails?.feedback);
      setValue("jobId", interviewDetails?.jobId);
      setValue("date", dayjs(interviewDetails?.date))
      setValue("type", interviewDetails?.type);
      setValue("roundName", interviewDetails?.roundName);
      setValue("roundNumber", interviewDetails?.roundNumber);
      setValue("candidateName", interviewDetails?.applicationData?.fullName);
      setValue("position", interviewDetails?.applicationData?.designationData?.name);
      setValue("status", interviewDetails?.status);
      setValue("meetingLink", interviewDetails?.meetingUrl);
      setValue("location", interviewDetails?.location);
      
      dispatch(employeSearch({
         companyId: interviewDetails?.companyId,
        branchId: interviewDetails?.branchId,
        designationId: "",
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        isTL: "",
          isBranch: true,
      isDirector: true,
      })).then((data) => {
       if(!data?.error){
        const selectedEmployee = data?.payload?.data?.docs?.find(employee => employee._id === interviewDetails?.interviewerId);
        if (selectedEmployee) {setValue('employee', {value: selectedEmployee._id,label: selectedEmployee.fullName})}
       }
      });
    }
  }, [interviewDetails, setValue])

  const onSubmit = (data) => {
    const finalPayload = {
      _id: interviewId,
      interviewerId: data?.fullName,
      applicationId: interviewDetails?.applicationId,
      directorId: interviewDetails?.directorId,
      companyId: interviewDetails?.companyId,
      departmentId: interviewDetails?.departmentId,
      designationId: interviewDetails?.designationId,
      branchId: interviewDetails?.branchId,
      interviewerName:employeList?.find(element => element?._id ===  data?.fullName)?.fullName,
      interviewerPosition:employeList?.find(element => element?._id ===  data?.fullName)?.designationData?.name,
      feedback: data?.feedback,
      type: data?.type,
      roundName: data?.roundName,
      date: data?.date,
      meetingUrl: data?.type === "online" ? data?.meetingLink : null,
      location: data?.type === "online" ? null : data?.location,
    };
    dispatch(updateInterview(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/interview");
    });
  };




  return (
    <GlobalLayout>
    
        {editPageLoader ? <div className="h-screen w-full flex justify-center items-center"><Loader2/></div> : <div>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className="">
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
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          >
                          <Select.Option value="">Select Interviewr</Select.Option>
                          {employeeLoading ? <Select.Option disabled><ListLoader /></Select.Option> : (employeList?.map((item) => (
                      <Select.Option key={item._id} value={item._id}>
                        {item.userName}({item.fullName})
                      </Select.Option>
                    )))}
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
                  Date <span className="text-red-600">*</span>
                </label>
                <Controller
                      name="date"
                      control={control}
                      rules={{
                        required:'Date is required'
                      }}
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
                  Type <span className="text-red-600">*</span>
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
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          >
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
                  Location <span className="text-red-600">*</span>
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
                  Meeting Link <span className="text-red-600">*</span>
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
            {interviewLoading ? <Loader/> : 'Submit'}
            </button>

          </div>
          </form>
        </div>}
      
    </GlobalLayout>
  );
};

export default EditInterview;