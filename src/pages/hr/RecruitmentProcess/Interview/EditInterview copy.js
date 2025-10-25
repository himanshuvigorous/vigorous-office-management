import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { getInterviewDetails, updateInterview } from "./InterviewFeatures/_interview_reducers";
import { decrypt } from "../../../../config/Encryption";
import { domainName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import { jobPostSearch } from "../JobPost/JobPostFeatures/_job_post_reducers";
import { applicationSearch } from "../../../applicationManagement/applicationFeatures/_application_reducers";


const EditInterview = () => {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();

  const { interviewIdEnc } = useParams();
  const interviewId = decrypt(interviewIdEnc);
  const { interviewDetails } = useSelector((state) => state.interview);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const userTypeglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;
  const { companyList } = useSelector((state) => state.company);
  const { designationList } = useSelector((state) => state.designation);
  const { departmentListData } = useSelector((state) => state.department);
  const { branchList } = useSelector((state) => state.branch);
  const { directorLists } = useSelector((state) => state.director);
  const { jobPostData } = useSelector((state) => state.jobPost);
  const { applicationList } = useSelector((state) => state.application);

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
    name: "branchId",
    defaultValue: userBranchId,
  });

  const departmentId = useWatch({
    control,
    name: "PDdepartmentId",
    defaultValue: userDepartmentId,
  });

  const designationId = useWatch({
    control,
    name: "designationId",
    defaultValue: userDesignationId,
  });
  const employeId = useWatch({
    control,
    name: "employeId",
    defaultValue: userEmployeId,
  });
  const jobId = useWatch({
    control,
    name: "jobId",
    defaultValue: "",
  });


  // useEffect(() => {
  //   if (interviewId) {
  //     dispatch(getInterviewDetails({ _id: interviewId }));
  //   }
  // }, [dispatch, interviewId]);


  useEffect(() => {
    if (interviewId) {
      fetchData();
    }
  }, [dispatch, interviewId]);

  const fetchData = async (interviewId) => {
    try {
      const reqData = {
        _id: interviewId,
      };
      if (companyId && userType === "company" || userType === "admin") {
        await dispatch(directorSearch({ companyId: companyId, text: "", status: true, sort: true, "isPagination": false }));
      }
      if (companyId && userType === "companyDirector" || userType === "company" || userType === "admin") {
        await dispatch(branchSearch({ companyId: companyId, text: "", status: true, sort: true, isPagination: false }));
      }
      if (branchId) {
        await dispatch(deptSearch({ branchId: branchId, "text": "", "sort": true, "status": true, "isPagination": false }));
      }
      await dispatch(designationSearch({ departmentId: departmentId, "text": "", "sort": true, "status": true, "isPagination": false }));

      await dispatch(getInterviewDetails(reqData)).then((data) => {
        setPageLoading(false);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  useEffect(() => {
    if (!userInfoglobal?.companyId) {
      dispatch(
        companySearch({
          userType: "company",
          text: "",
          status: true,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (companyId && userType === "companyDirector" || userType === "company" || userType === "admin") {
      dispatch(
        branchSearch({
          companyId: companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId && userType === "company" || userType === "admin") {
      dispatch(
        directorSearch({
          companyId: companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [companyId]);

  useEffect(() => {
    if (branchId) {
      dispatch(
        deptSearch({
          branchId: branchId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [branchId]);

  useEffect(() => {
    if (departmentId) {
      dispatch(
        designationSearch({
          departmentId: departmentId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [departmentId]);

  useEffect(() => {
    if (designationId) {
      dispatch(jobPostSearch({
        text: "",
        status: "",
        sort: true,
        isPagination: false,
        employeId: employeId,
        companyId: companyId,
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
      }));
    }
  }, [designationId])

  useEffect(() => {
    if (jobId) {
      dispatch(applicationSearch({
        text: "",
        status: "",
        sort: true,
        isPagination: false,
        employeId: employeId,
        companyId: companyId,
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        jobId: jobId,
      }));
    }
  }, [jobId])


  useEffect(() => {
    if (interviewDetails) {
      setValue("companyId", interviewDetails?.companyId);
      setValue("directorId", interviewDetails?.directorId);
      setValue("branchId", interviewDetails?.branchId);
      setValue("PDdepartmentId", interviewDetails?.departmentId);
      setValue("designationId", interviewDetails?.designationId);
      setValue("applicationId", interviewDetails?.applicationId);
      setValue("employeId", interviewDetails?.employeId);
      setValue("interviewerName", interviewDetails?.interviewerName);
      setValue("interviewerPosition", interviewDetails?.interviewerPosition);
      setValue("feedback", interviewDetails?.feedback);
      const formattedDate = new Date(interviewDetails?.date).toISOString().slice(0, 16);
      setValue("date", formattedDate);
      setValue("type", interviewDetails?.type);
      setValue("round", interviewDetails?.round);
      setValue("status", interviewDetails?.status);
    }
  }, [interviewDetails, setValue]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: interviewId,
      applicationId: data?.applicationId,
      employeId: data?.employeId,
      adminId: data?.adminId,
      creatorId: data?.creatorId,
      directorId: data?.directorId,
      companyId: companyId,
      departmentId: departmentId,
      designationId: designationId,
      branchId: branchId,
      interviewerName: data?.interviewerName,
      feedback: data?.feedback,
      type: data?.type,
      round: data?.round,
      date: data?.date,
      status: data?.status,
      interviewerName: data?.interviewerName,
      interviewerPosition: data?.interviewerPosition,
    };

    dispatch(updateInterview(finalPayload)).then((data) => {
      if (!data.error) navigate("/admin/interview");
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1">
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Interviewer Position</label>
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
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Interviewer Name</label>
                <input
                  type="text"
                  {...register("interviewerName", {
                    required: "Interviewer name is required",
                  })}
                  className={` ${inputClassName} ${errors.interviewerName ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter interviewer name"
                />
                {errors.interviewerName && (
                  <p className="text-red-500 text-sm">
                    {errors.interviewerName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              {(userTypeglobal === "admin") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Company<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDCompanyId", {
                      required: "Company is required",
                    })}
                    className={` ${inputClassName} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Company
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>
                        {type?.fullName}({type?.userName})
                      </option>
                    ))}
                  </select>
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )}
              {(userTypeglobal === "admin" || userTypeglobal === "company") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Director<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("directorId", {
                      required: "Director is required",
                    })}
                    className={` ${inputClassName} ${errors.directorId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Director
                    </option>
                    {directorLists?.map((element) => (
                      <option value={element?._id}>{element?.fullName}</option>
                    ))}
                  </select>
                  {errors.directorId && (
                    <p className="text-red-500 text-sm">
                      {errors.directorId.message}
                    </p>
                  )}
                </div>)}

              {(userTypeglobal === "admin" || userTypeglobal === "company") && (
                <div className="w-full">
                  <label className={`${inputLabelClassName}`}>
                    Branch<span className="text-red-600">*</span>
                  </label>
                  <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
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
                  Department<span className="text-red-600">*</span>
                </label>
                <select
                  {...register("departmentId", {
                    required: "Department is required",
                  })}
                  className={` ${inputClassName} ${errors.departmentId ? "border-[1px] " : "border-gray-300"
                    }`}
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
                <label className={`${inputLabelClassName}`}>Designation</label>
                <select
                  {...register("designationId", {
                    required: "Designation is required",
                  })}
                  className={` ${inputClassName} ${errors.designationId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
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
                <label className={`${inputLabelClassName}`}>Job Post</label>
                <select
                  {...register("jobId", {
                    required: "Job Post is required",
                  })}
                  className={` ${inputClassName} ${errors.jobId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
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
                <label className={`${inputLabelClassName}`}>Application</label>
                <select
                  {...register("applicationId", {
                    required: "Application is required",
                  })}
                  className={` ${inputClassName} ${errors.applicationId
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">
                    Select Application
                  </option>
                  {applicationList?.map((type) => (
                    <option value={type?._id}>{type?.name}</option>
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
                <label className={`${inputLabelClassName}`}>
                  Date<span className="text-red-600">*</span>
                </label>
                <input
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
                  Type<span className="text-red-600">*</span>
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
                <label className={`${inputLabelClassName}`}>Status<span className="text-red-600">*</span></label>
                <select
                  {...register("status", {
                    required: "Status is required",
                  })}
                  className={` ${inputClassName} ${errors.status
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                >
                  <option className="" value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Process">Process</option>
                  <option value="Completed">Completed</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Round</label>
                <input
                  type="text"
                  {...register("round", {
                    required: "Round is required",
                  })}
                  className={` ${inputClassName} ${errors.round ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter round"
                />
                {errors.round && (
                  <p className="text-red-500 text-sm">
                    {errors.round.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Feedback
              </label>
              <input
                type="text"
                {...register("feedback", {
                  required: "Job Description is required",
                })}
                className={` ${inputClassName} ${errors.feedback ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Job Description"
              />
              {errors.feedback && (
                <p className="text-red-500 text-sm">
                  {errors.feedback.message}
                </p>
              )}
            </div>
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

export default EditInterview;
