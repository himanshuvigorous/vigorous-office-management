import { useEffect, useState } from "react";
import { useForm, useWatch, useFieldArray } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useDispatch, useSelector } from "react-redux";
import {
  domainName,
  formButtonClassName,
  inputClassName,
  inputLabelClassName,
} from "../../constents/global.js";
import { useNavigate, useParams } from "react-router-dom";
import { countrySearch } from "../global/address/country/CountryFeatures/_country_reducers";
import { stateSearch } from "../global/address/state/featureStates/_state_reducers";
import { citySearch } from "../global/address/city/CityFeatures/_city_reducers";
import { getEmployeeDocument } from "../global/other/employeeDocument/EmployeeDocumentFeatures/_emp_document_reducers";
import { decrypt } from "../../config/Encryption.js";
import { getEmployeDetails, updateApplicationFunc, getApplicationDetails } from "../applicationManagement/applicationFeatures/_application_reducers.js";
import { directorSearch } from "../Director/director/DirectorFeatures/_director_reducers.js";
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers.js";
import { deptSearch } from "../department/departmentFeatures/_department_reducers.js";
import { designationSearch } from "../designation/designationFeatures/_designation_reducers.js";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { encrypt } from "../../config/Encryption";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers.js";
import { fileUploadFunc } from "../global/other/fileManagement/FileManagementFeatures/_file_management_reducers.js";
import { getJobPostList, jobPostSearch } from "../hr/RecruitmentProcess/JobPost/JobPostFeatures/_job_post_reducers.js";
import moment from "moment";
import { MdDone } from "react-icons/md";

const EditApplication = ({ existingReferences = [] }) => {

  const { applicationIdEnc } = useParams();
  const applicationId = decrypt(applicationIdEnc);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState([1]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pageLoading, setPageLoading] = useState(false)

  const { countryListData } = useSelector((state) => state.country);
  const { companyList } = useSelector((state) => state.company);
  const { departmentListData } = useSelector((state) => state.department);
  const { designationList } = useSelector((state) => state.designation);
  const { branchList } = useSelector((state) => state.branch);
  const { directorLists } = useSelector((state) => state.director);

  const { applicationDetails } = useSelector((state) => state.application);


  const { jobPostData } = useSelector((state) => state.jobPost);


  const [activeIndex, setActiveIndex] = useState(null);

  const { reset, register, handleSubmit, setValue, defaultValues, control, formState: { errors } ,setError } = useForm({
    defaultValues: {
      referenceDetails: existingReferences,
    },
  });

  const dispatch = useDispatch();

  const [isExperience, setIsExperience] = useState(false);


  const [progress, setProgress] = useState(0);
  const [completedProgress, setCompletedProgress] = useState(0);


  // useEffect(() => {
  //   const progressInterval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(progressInterval);
  //         return 100;
  //       }
  //       return prev + incrementSpeed;
  //     });
  //   }, intervalSpeed);

  //   return () => clearInterval(progressInterval);
  // }, []);

  useEffect(() => {
    if (defaultValues?.profileType === "Experience") {
      setIsExperience(true);
    }
  }, [defaultValues]);

  const handleProfileType = (event) => {
    const selectedValue = event.target.value;
    setIsExperience(selectedValue === "Experience");
  };

  const {
    fields: referenceDetailsFields,
    append: appendreferenceDetails,
    remove: removereferenceDetails,
  } = useFieldArray({
    control,
    name: "referenceDetails",
  });

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const userTypeglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )?.userType;

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userInfoglobal?.companyId || "",
  });
  const branchId = useWatch({
    control,
    name: "PDBranchiId",
    defaultValue: userInfoglobal?.branchId || "",
  });

  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userInfoglobal?.departmentId || "",
  });
  const directorId = useWatch({
    control,
    name: "PDDirectorId",
    defaultValue: userInfoglobal?.directorId || "",
  });
  const designationId = useWatch({
    control,
    name: "designationId",
    defaultValue: userInfoglobal?.designationId || "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(countrySearch({ text: "", sort: true, status: true, isPagination: false }));
        await dispatch(stateSearch({ text: "", sort: true, status: true, isPagination: false }));
        await dispatch(citySearch({ text: "", sort: true, status: true, isPagination: false }));
        // await dispatch(getEmployeeDocument());

        const reqData = {
          _id: applicationId,
        };

        // if (!userInfoglobal?.companyId) {
        //   dispatch(companySearch({ userType: "company", text: "", status: true, }));
        // }

        // dispatch(directorSearch({ companyId: companyId, text: "", status: true, sort: true, "isPagination": false }));
        // dispatch(branchSearch({ companyId: companyId, text: "", status: true, sort: true, "isPagination": false }));
        // dispatch(deptSearch({ companyId: companyId, "text": "", "sort": true, "status": true, "isPagination": false }));
        // dispatch(designationSearch({ departmentId: departmentId, "text": "", "sort": true, "status": true, "isPagination": false }));

        await dispatch(getApplicationDetails(reqData)).then((data) => {
          setPageLoading(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
    if (departmentId) {
      dispatch(
        deptSearch({
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
      dispatch(
        jobPostSearch({
          designationId: designationId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [designationId]);

  useEffect(() => {
    if (applicationDetails) {
      setValue("companyId", applicationDetails?.companyId);
      setValue("branchId", applicationDetails?.branchId);
      setValue("departmentId", applicationDetails?.departmentId);
      setValue("designationId", applicationDetails?.designationId);
      setValue("profileType", applicationDetails?.profileType);
      setValue("experienceInMonths", applicationDetails?.experienceInMonths);


      setValue("candidateName", applicationDetails?.candidateName);
      setSelectedFile(applicationDetails?.resumeUrl)
      // Contact details
      setValue("email", applicationDetails?.email);
      setValue("mobileCode", applicationDetails?.mobile?.code);
      setValue("mobileNo", applicationDetails?.mobile?.number);

      setValue("currentJobTitle", applicationDetails?.currentJobTitle);
      setValue("currentCompany", applicationDetails?.currentCompany);
      setValue("currentSalary", applicationDetails?.currentSalary);
      setValue("expectedSalary", applicationDetails?.expectedSalary);
      setValue("noticePeriodDays", applicationDetails?.noticePeriodDays);
      setValue("lastWorkingDay", moment(applicationDetails?.lastWorkingDay).format("YYYY-MM-DD"));
      setValue("location", applicationDetails?.location);
      setValue("coverLetter", applicationDetails?.coverLetter);
      // generalInfo
      setValue("PDDateOfBirth", applicationDetails?.generalInfo?.dateOfBirth);
      setValue("PDGender", applicationDetails?.generalInfo?.gender);
      setValue("PDMaritalStatus", applicationDetails?.generalInfo?.maritalStatus);
      setValue("PDfrn", applicationDetails?.generalInfo?.frn);
      setValue("PDTanNumber", applicationDetails?.generalInfo?.tanNumber);

      applicationDetails?.referenceDetails?.forEach((reference, index) => {
        setValue(`referenceDetails[${index}].name`, reference?.name || "");
        setValue(`referenceDetails[${index}].email`, reference?.email || "");
        setValue(`referenceDetails[${index}].mobile.code`, reference?.mobile?.code || "");
        setValue(`referenceDetails[${index}].mobile.number`, reference?.mobile?.number || "");
        setValue(`referenceDetails[${index}].relationship`, reference?.relationship || "");
      });

      setProgress(applicationDetails?.interviewData?.totalInterviews)
      setCompletedProgress(applicationDetails?.interviewData?.completedInterviews)

      reset({
        referenceDetails: [],
      });

      applicationDetails?.referenceDetails?.forEach((reference) => {
        const formattedreferenceDetail = {
          ...reference,
        };
        appendreferenceDetails(formattedreferenceDetail);
      });

      if (applicationDetails?.experienceInMonths) {
        setIsExperience(true);
      }
    }
  }, [applicationDetails]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceDetails",
  });

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) { 

      return setError("fileInput", {
        type: "manual",
        message: "File size should not exceed 2 MB"
      });
    }
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((res) => {
      setSelectedFile(res?.payload?.data);
    });

    if (file) {

    }
  };

  const onSubmit = (data) => {
    const finalPayload = {
      _id: applicationId,
      jobId: data?.jobPost,
      employeId: applicationDetails?.employeId,
      companyId: applicationDetails?.companyId,
      directorId: applicationDetails?.directorId,
      branchId: applicationDetails?.branchId,
      departmentId: applicationDetails?.departmentId,
      designationId: applicationDetails?.designationId,
      profileType: data?.profileType,
      experienceInMonths: isExperience ? data?.experienceInMonths : "",
      noticePeriodDays: data?.noticePeriodDays,
      lastWorkingDay: data?.lastWorkingDay,

      candidateName: data?.candidateName,
      email: data?.email,
      mobile: {
        code: data?.mobileCode,
        number: data?.mobileNo,
      },
      isInternal: false,
      resumeUrl: selectedFile,
      coverLetter: data?.coverLetter,
      currentJobTitle: data?.currentJobTitle,
      currentCompany: data?.currentCompany,
      currentSalary: data?.currentSalary,
      expectedSalary: data?.expectedSalary,
      noticePeriod: data?.noticePeriod,
      location: data?.location,
      referenceDetails: data?.referenceDetails,

    };
    dispatch(updateApplicationFunc(finalPayload)).then((output) => {
      if (!output.error) {
        navigate(
          `/admin/application`
        );
      }
    });
  };



  return (
    <GlobalLayout>
      <div>
        
          {applicationDetails?.interviewData &&
        <div className="flex justify-between items-center my-8">
            <>
              <div className="relative flex items-center justify-center w-1/4">
                <div
                  className={`md:w-10 md:h-10 h-5 w-5  text-[8px] md:text-sm flex items-center justify-center rounded-full border-2 ${progress >= 1
                    ? "bg-header text-white"
                    : "bg-gray-200 text-gray-500"
                    } font-semibold`}
                >
                  <MdDone />
                </div>
              </div>


              {applicationDetails?.interviewData?.interviewList?.length > 0 &&
                applicationDetails?.interviewData?.interviewList?.map((interview, index) => {
                  return (
                    <>
                      <div className={`w-full h-1 bg-gray-300 relative`}>
                        <div
                          className={`h-1 ${completedProgress >= index + 1 ? "bg-header" : "bg-gray-300"
                            }`}
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                      <div className="relative flex items-center justify-center w-1/4">
                        <div
                          className={`md:w-10 md:h-10 h-5 w-5  text-[8px] md:text-sm flex items-center justify-center rounded-full border-2 ${completedProgress >= index + 1
                            ? "bg-header text-white"
                            : "bg-gray-200 text-gray-500"
                            } font-semibold`}
                        >
                          <MdDone />
                        </div>
                        <span
                          className={`absolute ${4 % 2 === 0 ? "md:top-[40px] top-[20px]" : "top-[-20px]"} text-[8px] text-nowrap md:text-sm font-semibold ${progress >= 4 ? "text-header" : "text-gray-500"
                            }`}
                        >
                          Round {index + 1}
                        </span>
                      </div>
                    </>
                  )
                })

              }
            </>
        </div>
          }
        <div className="grid grid-cols-12 gap-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 md:col-span-12 col-span-12"
          >
            <div className="w-full">
              <div className=" ">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 px-3">

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Full Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("candidateName", {
                        required: "Candidate Name is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.candidateName
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Candidate Name"
                    />
                    {errors.candidateName && (
                      <p className="text-red-500 text-sm">
                        {errors.candidateName.message}
                      </p>
                    )}
                  </div>



                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Email<span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className={` ${inputClassName} ${errors.email ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter Email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className={`grid ${isExperience ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
                  } md:gap-8 gap-4 px-3 md:my-5 my-3`}>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Job Type <span className="text-red-600">*</span>
                    </label>
                    <select
                      {...register("profileType", {
                        required: "Designation is required",
                        onChange: handleProfileType,
                      })}
                      defaultValue={defaultValues?.profileType || ""}
                      className={` ${inputClassName} ${errors.profileType ? "border-[1px] " : "border-gray-300"}`}
                    >
                      <option value="">Select Job Type</option>
                      <option value="Fresher">Fresher</option>
                      <option value="Intern">Intern</option>
                      <option value="Experience">Experience</option>
                    </select>
                    {errors.profileType && (
                      <p className="text-red-500 text-sm">{errors.profileType.message}</p>
                    )}
                  </div>

                  {isExperience && (
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Experience (Months) <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("experienceInMonths", {
                          required: "Experience in months is required",
                          min: { value: 1, message: "Experience must be at least 1 month" },
                        })}
                        defaultValue={defaultValues?.experienceInMonths || ""}
                        className={` ${inputClassName} ${errors.experienceInMonths ? "border-[1px] " : "border-gray-300"}`}
                        placeholder="Enter experience in months"
                      />
                      {errors.experienceInMonths && (
                        <p className="text-red-500 text-sm">{errors.experienceInMonths.message}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <div className="w-[150px]">
                      <label className={`${inputLabelClassName}`}>
                        Code<span className="text-red-600">*</span>
                      </label>
                      <select
                        {...register("mobileCode", {
                          required: "MobileCode is required",
                        })}
                        className={` ${inputClassName} ${errors.mobileCode ? "border-[1px] " : "border-gray-300"
                          }`}
                      >
                        <option className="" value="">
                          Select Mobile Code
                        </option>
                        {countryListData?.docs?.map((type) => (
                          <option value={type?.countryMobileNumberCode}>
                            {type?.countryMobileNumberCode}
                          </option>
                        ))}
                      </select>
                      {errors[`mobileCode`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`mobileCode`].message}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <label className={`${inputLabelClassName}`}>
                        Mobile No<span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        {...register(`mobileNo`, {
                          required: "Mobile No is required",
                          minLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                          maxLength: {
                            value: 10,
                            message: "Must be exactly 10 digits",
                          },
                        })}
                        maxLength={10}
                        onInput={(e) => {
                          if (e.target.value.length > 10) {
                            e.target.value = e.target.value.slice(0, 10);
                          }
                        }}
                        className={` ${inputClassName} ${errors[`mobileNo`]
                          ? "border-[1px] "
                          : "border-gray-300"
                          }`}
                        placeholder="Enter Mobile No"

                      />
                      {errors[`mobileNo`] && (
                        <p className="text-red-500 text-sm">
                          {errors[`mobileNo`].message}
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 px-3 md:mt-4">

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Current Job Title <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("currentJobTitle", {
                        required: "Current job title is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.currentJobTitle
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Current job title"
                    />
                    {errors.currentJobTitle && (
                      <p className="text-red-500 text-sm">
                        {errors.currentJobTitle.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Current Company <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("currentCompany", {
                        required: "Current company name is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.currentCompany
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Current company name"
                    />
                    {errors.currentCompany && (
                      <p className="text-red-500 text-sm">
                        {errors.currentCompany.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Current Salary <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="decimal"
                      {...register("currentSalary", {
                        required: "Current is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      className={`placeholder: ${inputClassName} ${errors.currentSalary
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter Current salary"
                    />
                    {errors.currentSalary && (
                      <p className="text-red-500 text-sm">
                        {errors.currentSalary.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Expected Salary <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="decimal"
                      {...register("expectedSalary", {
                        required: "Expected salary is required",
                        pattern: {
                          value: /^[0-9]+(\.[0-9]+)?$/,
                          message: "Please enter a valid number",
                        },
                      })}
                      className={`placeholder: ${inputClassName} ${errors.expectedSalary
                        ? "border-[1px] "
                        : "border-gray-300"
                        }`}
                      placeholder="Enter expected sallary"
                    />
                    {errors.expectedSalary && (
                      <p className="text-red-500 text-sm">
                        {errors.expectedSalary.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Notice Period (Days) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("noticePeriodDays", {
                        required: "Notice period is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.noticePeriodDays ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter notice period"
                      onKeyDown={(e) => {
                        if (e.key === "." || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                    {errors.noticePeriodDays && (
                      <p className="text-red-500 text-sm">
                        {errors.noticePeriodDays.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Last Working Day <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("lastWorkingDay", {
                        required: "Last Working Day is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.lastWorkingDay ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter notice period"
                    />
                    {errors.lastWorkingDay && (
                      <p className="text-red-500 text-sm">
                        {errors.lastWorkingDay.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Location <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("location", {
                        required: "Location is required",
                      })}
                      className={`placeholder: ${inputClassName} ${errors.location ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter location"
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm">
                        {errors.location.message}
                      </p>
                    )}
                  </div>

                  <div className="">
                    <label htmlFor="fileInput" className={`${inputLabelClassName}`}>
                      Upload Resume <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf"  
                      name="fileInput"
                      {...register("fileInput", {
                     
                        // validate: {
                        //   fileSize: (file) => file[0]?.size <= 2 * 1024 * 1024 || "File size should not exceed 2 MB",
                        // }
                      })}
                      onChange={handleFileChange}
                      className={`h-12  ${inputClassName} ${selectedFile ? "border-gray-300" : "border-[1px] "
                        }`}
                    />


                    <a className="text-sm text-cyan-800" rel="noreferrer" href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${selectedFile}`} target="_blank">View Resume</a>
                    {errors.fileInput && (
                    <p className="text-red-500 text-sm">{errors.fileInput.message}</p>
                  )}
                  </div>

                  <div className="">
                    <label className={`${inputLabelClassName}`}>
                      Cover Letter
                    </label>
                    <textarea
                      {...register("coverLetter")}
                      className={`h-12 placeholder: ${inputClassName} ${errors.coverLetter ? "border-[1px] " : "border-gray-300"
                        }`}
                      placeholder="Enter your cover letter"
                    />
                    {errors.coverLetter && (
                      <p className="text-red-500 text-sm">
                        {errors.coverLetter.message}
                      </p>
                    )}
                  </div>

                </div>

                <div className="px-3 pt-1">
                  {referenceDetailsFields.map((item, index) => (
                    <div
                      key={item.id}
                      className="my-2 border border-gray-300 rounded-md"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(index)}
                        className="w-full flex items-center justify-between p-2 bg-header rounded-t-md text-left"
                      >
                        <span className="font-semibold text-sm text-white">
                          Reference {index + 1}
                        </span>

                        {activeIndex === index ? (
                          <FaChevronUp className="text-white" />
                        ) : (
                          <FaChevronDown className="text-white" />
                        )}
                      </button>

                      <div
                        className={`rounded-md transition-all duration-300 overflow-hidden ${activeIndex === index
                          ? "max-h-screen py-2"
                          : "max-h-0 py-0"
                          }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 px-3 md:mt-4">
                          <div className="mb-2">
                            <label className={`${inputLabelClassName}`}>
                              Name <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register(`referenceDetails[${index}].name`, {
                                required: "Name is required",
                              })}
                              defaultValue={item.name}
                              className={` ${inputClassName} ${errors.referenceDetails?.[index]?.name
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter name"
                            />
                            {errors.referenceDetails?.[index]?.name && (
                              <p className="text-red-500 text-sm">
                                {errors.referenceDetails[index].name?.message}
                              </p>
                            )}
                          </div>
                          <div className="mb-2">
                            <label className={`${inputLabelClassName}`}>
                              Email <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="email"
                              {...register(`referenceDetails[${index}].email`, {
                                required: "Email is required",
                              })}
                              defaultValue={item.email}
                              className={` ${inputClassName} ${errors.referenceDetails?.[index]?.email
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter email"
                            />
                            {errors.referenceDetails?.[index]?.email && (
                              <p className="text-red-500 text-sm">
                                {errors.referenceDetails[index].email?.message}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <div className="w-[150px]">
                              <label className={`${inputLabelClassName}`}>
                                Code <span className="text-red-600">*</span>
                              </label>
                              <select
                                type="number"
                                {...register(
                                  `referenceDetails[${index}].mobile.code`,
                                  {
                                    required: "MobileCode is required",
                                  }
                                )}
                                className={` ${inputClassName} ${errors.referenceDetails?.[index]?.mobile?.code
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              >
                                <option className="" value="">
                                  Select Mobile Code
                                </option>
                                {countryListData?.docs?.map((type) => (
                                  <option value={type?.countryMobileNumberCode}>
                                    {type?.countryMobileNumberCode}
                                  </option>
                                ))}
                              </select>
                              {errors.referenceDetails?.[index]?.mobile?.code && (
                                <p className="text-red-500 text-sm">
                                  {
                                    errors.referenceDetails[index].mobile.code
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>

                            <div className="w-full">

                              <label className={`${inputLabelClassName}`}>
                                Mobile Number{" "}
                                <span className="text-red-600">*</span>
                              </label>
                              <input
                                type="number"
                                {...register(
                                  `referenceDetails[${index}].mobile.number`,
                                  {
                                    required: "Mobile number is required",
                                    minLength: {
                                      value: 10,
                                      message: "Must be exactly 10 digits",
                                    },
                                    maxLength: {
                                      value: 10,
                                      message: "Must be exactly 10 digits",
                                    },
                                  })}
                                maxLength={10}
                                onInput={(e) => {
                                  if (e.target.value.length > 10) {
                                    e.target.value = e.target.value.slice(0, 10);
                                  }
                                }}
                                defaultValue={item.mobile.number}
                                className={` ${inputClassName} ${errors.referenceDetails?.[index]?.mobile?.number
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                                placeholder="Enter mobile number"
                              />
                              {errors.referenceDetails?.[index]?.mobile?.number && (
                                <p className="text-red-500 text-sm">
                                  {
                                    errors.referenceDetails[index].mobile.number
                                      ?.message
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label className={`${inputLabelClassName}`}>
                              Relationship <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register(
                                `referenceDetails[${index}].relationship`,
                                {
                                  required: "Relationship is required",
                                }
                              )}
                              defaultValue={item.relationship}
                              className={` ${inputClassName} ${errors.referenceDetails?.[index]?.relationship
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter relationship"
                            />
                            {errors.referenceDetails?.[index]?.relationship && (
                              <p className="text-red-500 text-sm">
                                {
                                  errors.referenceDetails[index].relationship
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div></div>

                          <div className="w-full flex justify-end items-center">
                            <button
                              type="button"
                              className="bg-red-600 text-white p-2 rounded-md text-sm"
                              onClick={() => removereferenceDetails(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between px-3 py-2">
                  <button
                    type="button"
                    className="bg-header text-white px-2 py-1 rounded-md mt-2 text-sm"
                    onClick={() =>
                      appendreferenceDetails({
                        name: "",
                        email: "",
                        mobile: { code: "", number: "" },
                        relationship: "",
                      })
                    }
                  >
                    Add Reference
                  </button>
                </div>
              </div>

              <div className="flex justify-between px-3 pb-2">
                <button type="Submit" className={`${formButtonClassName}`}>
                  Submit Details
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default EditApplication;