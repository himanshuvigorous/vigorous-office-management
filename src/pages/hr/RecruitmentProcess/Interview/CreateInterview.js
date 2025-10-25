import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  domainName,
  inputClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
} from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';

import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { createInterview } from "./InterviewFeatures/_interview_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import { jobPostSearch } from "../JobPost/JobPostFeatures/_job_post_reducers";
import { applicationSearch } from "../../../applicationManagement/applicationFeatures/_application_reducers";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import ReactSelect from "react-select";

const CreateInterview = () => {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [interviewerId, setInterviewerId] = useState("");
  const [interviewerStatus, setInterviewerStatus] = useState(false);

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userType
  } = getUserIds();

  const { companyList } = useSelector((state) => state.company);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { branchList } = useSelector((state) => state.branch);


  const { jobPostData } = useSelector((state) => state.jobPost);



  const { applicationList } = useSelector((state) => state.application);


  const { employeList  } = useSelector((state) => state.employe);

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });
  const directorId = useWatch({
    control,
    name: "directorId",
    defaultValue: userDirectorId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: '',
  });
  const designationId = useWatch({
    control,
    name: "designationId",
    defaultValue: '',
  });
  const employeId = useWatch({
    control,
    name: "employeId",
    defaultValue: '',
  });



  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));


  const onSubmit = (data) => {

    const finalPayload = {
      applicationId: data?.applicationId,
      directorId: '',
      employeId: userType === "employee" ? employeId : null,
      companyId: userInfoglobal?.userType === "admin" ? data?.companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      departmentId: data?.departmentId,
      designationId: data?.designationId,
      interviewerId: interviewerId,
      interviewerName: data?.interviewerName,
      interviewerPosition: data?.interviewerPosition,
      feedback: data?.feedback,
      type: data?.type,
      roundName: data?.roundName,
      date: data?.date,
      // roundNumber: parseInt(data?.roundNumber),
    };

    // '{
    //   "applicationId": "679a22d069e02df9ffb433a9",
    //   "companyId": "675bc6f0c1fedb871b511b91",
    //   "directorId": "",
    //   "branchId": "675bc880c1fedb871b511ca3",
    //   "interviewerId": "6765734afd8ea2438058883f",
    //   "type": "offline",
    //   "roundName": "mamnager 3",
    //   "date": "2025-02-02T14:00:00.000Z",
    //   "interviewerName": "Jane Smith",
    //   "interviewerPosition": "HR Manager",
    // }'

    dispatch(createInterview(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/interview");
    });
  };

  const handleSelectInterviewer = (selectedOption) => {
    if (!selectedOption) {

      setInterviewerId("");
      setValue("interviewerName", "");
      setValue("interviewerPosition", "");
      setInterviewerStatus(true)

    } else {
      const value = selectedOption.value;
      const selectedEmployee = employeList?.find((element) => element._id === value);


      setInterviewerId(value);
      setValue("interviewerName", selectedEmployee?.fullName || "");
      setValue("interviewerPosition", selectedEmployee?.designationData?.name || "");
      setInterviewerStatus(false)
    }
  };


  const handleFocusInterviewer = (inputValue) => {
    dispatch(employeSearch(

      {
        branchId: branchId,
        text: inputValue,
        sort: true,
        status: true,
        isPagination: false, isTL: ""
      }
    )
    );

  };

  const handleFocusCompany = () => {
    if (!companyList?.length) {
      dispatch(companySearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
      );
    }
  };

  const handleCompanyChange = (event) => {
    setValue("companyId", event.target.value);
    setValue("branchId", "");
    setValue("directorId", "");
    dispatch(directorSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: event.target.value
    })
    );
    dispatch(branchSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: event.target.value
    })
    );
  };




  const handleBranchChange = (event) => {
    setValue("PDBranchId", event.target.value);

    dispatch(deptSearch({
      text: "",
      sort: true,
      status: true,
      isPagination: false,
      companyId: companyId,
      branchId: event.target.value
    })
    );
  }

  const handleFocusBranch = () => {
    if (!branchList && userType === "company") {
      dispatch(branchSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: companyId,
      })
      );
    }
  }

  
  const handleFocusDepartment = () => {
      dispatch(deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "admin" ? companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      })
      );
  }



  const handleFocusDesignation = () => {

      dispatch(designationSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "admin" ? companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
        departmentId: departmentId
      })
      );
   
  }
  const handleFocusApplication = ()=>{
    let reqData = {
      text: "",
      status: "Shortlisted",
      // "offerLatterStatus": "",
      sort: true,
      isPagination: false,
      companyId: userInfoglobal?.userType === "admin" ? companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      departmentId: departmentId,
      designationId: designationId,
      jobId: "",
    };
    dispatch(applicationSearch(reqData));
  }


  const handleFocusJobPost = () => {
    dispatch(jobPostSearch({
      text: "",
      sort: true,
      status: 'Open',
      isPagination: false,
      companyId: userInfoglobal?.userType === "admin" ? companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      departmentId: departmentId,
      designationId: designationId,
    })
    )
  }




  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              {(userType === "admin") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Company <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("companyId", {
                      required: "Company is required",
                    })}
                    className={`${inputClassName}  ${errors.companyId ? "border-[1px] " : "border-gray-300"
                      } `}
                    onChange={handleCompanyChange}
                    onFocus={handleFocusCompany}
                  >
                    <option value="">Select Company</option>
                    {companyList?.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company?.fullName}
                      </option>
                    ))}
                  </select>
                  {errors.companyId && (
                    <p className="text-red-500 text-sm">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>
              )}
              {(userType === "admin" || userType === "company" || userType === "companyDirector") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Branch <span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                      }`}
                    onChange={handleBranchChange}
                    onFocus={handleFocusBranch}>
                    <option className="" value="">
                      Select Branch
                    </option>
                    {branchList?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Department <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("departmentId", {
                    required: "Department is required",
                  })}
                  className={` ${inputClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"
                    }`}
      
                  onFocus={()=>{
                    handleFocusDepartment()
                  }}
                >
                  <option className="" value="">
                    Select Department
                  </option>
                  {departmentListData?.map((element) => (
                    <option value={element?._id}>{element?.name}</option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-500 text-sm">
                    {errors.departmentId.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Designation <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("designationId", {
                    required: "Designation is required",
                  })}
                  className={` ${inputClassName} ${errors.designationId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
               
                  onFocus={()=>handleFocusDesignation()}
                >
                  <option className="" value="">
                    Select Designation
                  </option>
                  {designationList?.map((type) => (
                    <option value={type?._id}>{type?.name}</option>
                  ))}
                </select>
                {errors.designationId && (
                  <p className="text-red-500 text-sm">
                    {errors.designationId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Job Post <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("jobId", {
                    required: "Job Post is required",
                  })}
                  className={` ${inputClassName} ${errors.jobId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
             
                  onFocus={handleFocusJobPost}
                >
                  <option className="" value="">
                    Select Job Post
                  </option>
                  {jobPostData?.map((type) => (
                    <option value={type?._id}>{type?.title}</option>
                  ))}
                </select>
                {errors.jobId && (
                  <p className="text-red-500 text-sm">
                    {errors.jobId.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Application <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("applicationId", {
                    required: "Application is required",
                  })}
                  onFocus={()=>handleFocusApplication()}
                  className={` ${inputClassName} ${errors.applicationId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Application
                  </option>
                  {applicationList?.map((type) => (
                    <option value={type?._id}>{type?.fullName}</option>
                  ))}
                </select>
                {errors.applicationId && (
                  <p className="text-red-500 text-sm">
                    {errors.applicationId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Interviewer Name <span className="text-red-600">*</span></label>
                <ReactSelect
                  options={employeList?.map((type) => ({
                    value: type?._id,
                    label: type?.fullName,
                  }))}
                  onClick={handleFocusInterviewer}
                  onFocus={handleFocusInterviewer}
                  onChange={handleSelectInterviewer}
                  onInputChange={handleFocusInterviewer}
                  isClearable
                  placeholder="Select interviewer's name"
                  classNamePrefix="react-select"
                  className={` ${inputLabelClassNameReactSelect} ${errors.fullName ? "border-[1px] " : "border-gray-300"}`}
                />
                {interviewerStatus && (
                  <p className="text-red-500 text-sm">Interviewer Name is required</p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Interviewer Position <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("interviewerPosition", {
                    required: "Interviewer position is required",
                  })}
                  className={` ${inputClassName} ${errors.interviewerPosition ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter interviewer position"
                />
                {errors.interviewerPosition && (
                  <p className="text-red-500 text-sm">
                    {errors.interviewerPosition.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 md:my-1">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Date <span className="text-red-600">*</span>
                </label>
                <input
                  min={new Date().toISOString().slice(0, 16)}
                  type="datetime-local"
                  {...register("date", {
                    required: "Date is required",
                  })}
                  className={` ${inputClassName} ${errors.date ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Date of Birth"
                />

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
                <select
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
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm">
                    {errors.type.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Round <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("roundName", {
                    required: "Round is required",
                  })}
                  className={` ${inputClassName} ${errors.roundName ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter roundName"
                />
                {errors.roundName && (
                  <p className="text-red-500 text-sm">
                    {errors.roundName.message}
                  </p>
                )}
              </div>
              {/* <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Round Number<span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register("roundNumber", {
                    required: "Round is required",
                  })}
                  className={` ${inputClassName} ${errors.roundNumber ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter roundNumber"
                />
                {errors.roundNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.roundNumber.message}
                  </p>
                )}
              </div> */}
            </div>
            {/* <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Feedback
              </label>
              <input
                type="text"
                {...register("feedback", {
                  // required: "Job Description is required",
                })}
                className={` ${inputClassName} ${errors.feedback ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Feedback"
              />
              {errors.feedback && (
                <p className="text-red-500 text-sm">
                  {errors.feedback.message}
                </p>
              )}
            </div> */}
          </div>

          <div className="flex justify-end">
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
};

export default CreateInterview;
