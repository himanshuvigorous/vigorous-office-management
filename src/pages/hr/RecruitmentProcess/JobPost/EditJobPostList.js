import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getJobPostDetails,
  updateJobPost,
} from "./JobPostFeatures/_job_post_reducers";
import { decrypt } from "../../../../config/Encryption";
import {
  domainName,
  inputClassName,
  inputLabelClassName,
  inputDisabledClassName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameDisabled,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import ReactQuill from "react-quill";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import ListLoader from "../../../../global_layouts/ListLoader";

const EditJobPostList = () => {
  const [editPageLoader,setEditPageLoader]=useState(true);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const { jobpostEnc } = useParams();
  const jobPostId = decrypt(jobpostEnc);
  const { jobPostDetails } = useSelector((state) => state.jobPost);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { designationList ,loading:desLoading } = useSelector((state) => state.designation);
  const { departmentListData ,loading:depLoading } = useSelector((state) => state.department);
  const [editorValue, setEditorValue] = useState(``);
  const departmentId = useWatch({
    control,
    name: "PDDepartmentId",
    defaultValue: "",
  });

  const [immediateJoiner, setImmediateJoiner] = useState(false);
   const {  loading:jobPostLoading } = useSelector((state) => state.jobPost);

  useEffect(() => {

    if (jobPostId) {
      
      dispatch(getJobPostDetails({ _id: jobPostId })).then(()=>{
        setEditPageLoader(false)

        dispatch(designationSearch({
          companyId: jobPostDetails?.companyId,
          branchId: jobPostDetails?.branchId,
          departmentId: jobPostDetails?.departmentId,
          isPagination: false,
          sort: true,
        }))
        dispatch(deptSearch({
          companyId: jobPostDetails?.companyId,
          branchId: jobPostDetails?.branchId,
          isPagination: false,
          sort: true,
        }))
      })
    }
  }, [dispatch, jobPostId]);
  useEffect(() => {
    
    if (jobPostDetails) {
      setValue("jobTitle", jobPostDetails?.title);
      setValue("jobdepartmentName", jobPostDetails?.departmentName);
      setValue("departmentId", jobPostDetails?.departmentId);
      setValue("designationId", jobPostDetails?.designationId);
      setValue("jobdesignationName", jobPostDetails?.designationName);
      setValue("noOfVacancy", jobPostDetails?.noOfVacancy);
      setValue("location", jobPostDetails?.location);
      setValue("currency", jobPostDetails?.salaryRange?.currency);
      setValue("maxSalary", jobPostDetails?.salaryRange?.max);
      setValue("minSalary", jobPostDetails?.salaryRange?.min);
      setValue("minExp", jobPostDetails?.experienceRange?.min);
      setValue("maxExp", jobPostDetails?.experienceRange?.max);
      setValue("employmentType", jobPostDetails?.employmentType);
      setValue("profileType", jobPostDetails?.profileType);
      setValue("status", jobPostDetails?.status);
      setTags(jobPostDetails?.requiredSkills);
      setImmediateJoiner(jobPostDetails?.isImmediateJoiner);
      setEditorValue(jobPostDetails?.description);
    }
    

  }, [jobPostDetails, setValue]);
  const handleEditorChange = (value) => {
    setEditorValue(value);
  };
  const onSubmit = (data) => {
    const finalPayload = {
      _id: jobPostId,
      companyId: jobPostDetails?.companyId,
      directorId: jobPostDetails?.directorId,
      departmentId: jobPostDetails?.departmentId,
      designationId: jobPostDetails?.designationId,
      branchId: jobPostDetails?.branchId,
      title: data?.jobTitle,
      location: data?.location,
      description: editorValue,
      requiredSkills: tags,
      profileType:data?.profileType,
      noOfVacancy: parseInt(data?.noOfVacancy),
      employmentType: data?.employmentType,
      salaryRange: {
        min: parseInt(data?.minSalary),
        max: parseInt(data?.maxSalary),
        currency: data?.currency,
      },
      experienceRange: {
        min: parseInt(data?.minExp),
        max: parseInt(data?.maxExp),
      },
      isImmediateJoiner: immediateJoiner,
 status: data?.status,
    };

    dispatch(updateJobPost(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };
  useEffect(() => {
    setValue("PDDesignationId", "");
  }, [departmentId]);

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

  const handleJoinerBox = (checked) => {
    setImmediateJoiner(checked);
  };

  return (
    <GlobalLayout>
      {editPageLoader ? <div className="h-screen w-screen flex justify-center items-center"><Loader2/></div> :<div className="gap-4">
        <form
          autoComplete="off"
          className="mt-2 md:px-1"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-5 md:my-2">
                  
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Job Post Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("jobTitle", {
                  required: "Job Post Name is required",
                })}
                className={` ${inputClassName} ${
                  errors.jobTitle
                    ? "border-[1px] "
                    : "border-gray-300"
                } `}
                placeholder="Enter Job Post Name"
              />
              {errors.jobTitle && (
                <p className="text-red-500 text-sm">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>
           { jobPostDetails?.isApplicationCreated &&  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:my-1 ">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Department <span className="text-red-600">*</span>
                </label>
                <input
                  disabled
                  type="text"
                  {...register("jobdepartmentName")}
                  className={` ${inputDisabledClassName}  `}
                  placeholder="Enter Department"
                />
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Designation <span className="text-red-600">*</span>
                </label>
                <input
                  disabled
                  type="text"
                  {...register("jobdesignationName")}
                  className={` ${inputDisabledClassName}  `}
                  placeholder="Enter Designation"
                />
              </div>
            </div>}
         {  !jobPostDetails?.isApplicationCreated &&   < div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 " >
              <div className="" >
                <label className={`${inputLabelClassName}`}>
                  Department < span className="text-red-600" >* </span>
                </label>

                <Controller
                  name="departmentId"
                  control={control}
                  rules={{
                    required: "Department is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(value) => {
                        setValue("designationId", '')
                        field.onChange(value);
                      }}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Department"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }

                    >
                      <Select.Option value="">Select Department</Select.Option>
                      {depLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (sortByPropertyAlphabetically(departmentListData, 'name')
                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.name} </Select.Option>
                          )))
                      }
                    </Select>
                  )}
                />
                {
                  errors.departmentId && (
                    <p className="text-red-500 text-sm" >
                      {errors.departmentId.message}
                    </p>
                  )
                }
              </div>

              < div className="" >
                <label className={`${inputLabelClassName}`}> Designation < span className="text-red-600" >* </span></label >
              

                <Controller
                  name="designationId"
                  control={control}
                  rules={{
                    required: "Designation is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}

                      placeholder="Select Designation"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }

                    >
                      <Select.Option value="">Select Designation</Select.Option>
                      {desLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                        (designationList

                          ?.map((element) => (
                            <Select.Option value={element?._id} > {element?.name} </Select.Option>
                          )))
                      }
                    </Select>
                  )}
                />

                {
                  errors.designationId && (
                    <p className="text-red-500 text-sm" >
                      {errors.designationId.message}
                    </p>
                  )
                }
              </div>
            </div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:my-1 ">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  {" "}
                  No.of Vacancy <span className="text-red-600">* </span>
                </label>
                <input
                  type="number"
                  {...register("noOfVacancy", {
                    required: "No of Vacancy is required",
                  })}
                  className={` ${inputClassName} ${
                    errors.noOfVacancy
                      ? "border-[1px] "
                      : "border-gray-300"
                  } `}
                  placeholder="Enter No of Vacancy"
                />
                {errors.noOfVacancy && (
                  <p className="text-red-500 text-sm">
                    {errors.noOfVacancy.message}
                  </p>
                )}
              </div>

              <div>
                <label className={`${inputLabelClassName}`}>
                  Employment Type <span className="text-red-600">* </span>
                </label>
                <Controller
                  name="employmentType"
                  control={control}
                  rules={{
                    required: "Employment Type is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${
                        errors.PDPlan
                          ? "border-[1px] "
                          : "border-gray-300"
                      }`}
                      placeholder="Select Employment Type"
                      showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                    >
                      <Select.Option value="">
                        Select Employment Type
                      </Select.Option>
                      <Select.Option value="Full-Time">
                        {" "}
                        Full - Time{" "}
                      </Select.Option>
                      <Select.Option value="Part - Time">
                        Part - Time{" "}
                      </Select.Option>
                      <Select.Option value="Contract">Contract </Select.Option>
                      <Select.Option value="Internship">
                        Internship{" "}
                      </Select.Option>
                    </Select>
                  )}
                />
                {errors.employmentType && (
                  <p className="text-red-500 text-sm">
                    {" "}
                    {errors.employmentType.message}{" "}
                  </p>
                )}
              </div>

                < div >
                              <label className={`${inputLabelClassName}`}>
                                Profile Type < span className="text-red-600" >* </span>
                              </label>
                              
                              <Controller
                                    name="profileType"
                                    control={control}
                                    rules={{
                                      required: "profileType is required",
                                    }}
                                    render={({ field }) => (
                                      <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                              
                                        placeholder="Select profileType"
                                        showSearch
                                        filterOption={(input, option) =>
                                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
              
                                      >
                                        <Select.Option value="">Select profileType</Select.Option>
                                     
                                        <Select.Option value="Intern" >Intern </Select.Option>
                                          <Select.Option value="Fresher" > Fresher </Select.Option>
                                         
                                           <Select.Option value="Experience" >Experience  </Select.Option>
                                        
                                      </Select>
                                    )}
                                  />
                              
              
              
                              
                                  
                              {
                                errors.profileType && (
                                  <p className="text-red-500 text-sm" > {errors.profileType.message} </p>
                                )
                              }
                            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:my-1 ">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  {" "}
                  Location <span className="text-red-600">* </span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={` ${inputClassName} ${
                    errors.location
                      ? "border-[1px] "
                      : "border-gray-300"
                  } `}
                  placeholder="Enter Location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Min Salary (INR)<span className="text-red-600">* </span>
                </label>
                <input
                  type="text"
                  {...register("minSalary", {
                    required: "Minimum salary is required",
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: "Only numeric or decimal values are allowed",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    if ((e.target.value.match(/\./g) || []).length > 1) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                  className={`placeholder: ${inputClassName} ${
                    errors.minSalary
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                  placeholder="Enter Expected Salary"
                />
                {errors.minSalary && (
                  <p className="text-red-500 text-sm">
                    {errors.minSalary.message}
                  </p>
                )}
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Max Salary (INR) <span className="text-red-600">* </span>
                </label>
                <input
                  type="text"
                  {...register("maxSalary", {
                    required: "Maximum salary is required",
                    pattern: {
                      value: /^\d+(\.\d+)?$/,
                      message: "Only numeric or decimal values are allowed",
                    },
                  })}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9.]/g, "");
                    if ((e.target.value.match(/\./g) || []).length > 1) {
                      e.target.value = e.target.value.slice(0, -1);
                    }
                  }}
                  className={`placeholder: ${inputClassName} ${
                    errors.maxSalary
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                  placeholder="Enter expected salary"
                />
                {errors.maxSalary && (
                  <p className="text-red-500 text-sm">
                    {errors.maxSalary.message}
                  </p>
                )}
              </div>

              {/* <div>
                <label className={`${inputLabelClassName}`}>
                  Currency <span className="text-red-600">* </span>
                </label>
              
                <Controller
                      name="currency"
                      control={control}
                      rules={{
                        required: "currency  is required",
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                
                          placeholder="Select Currency"
                          showSearch

                        >
                          <Select.Option value="">Select Currency</Select.Option>
                       
                       
                            <Select.Option value="INR" > INR  </Select.Option>
                             <Select.Option value="USD" > USD  </Select.Option>
                           
                        </Select>
                      )}
                    />
                {errors.currency && (
                  <p className="text-red-500 text-sm">
                    {" "}
                    {errors.currency.message}{" "}
                  </p>
                )}
              </div> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 ">
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Min (in Years) <span className="text-red-600">* </span>
                </label>
                <input
                  type="number"
                  {...register("minExp", {
                    required: "Min Range is required",
                  })}
                  className={` ${inputClassName} ${
                    errors.minExp
                      ? "border-[1px] "
                      : "border-gray-300"
                  } `}
                  placeholder="Enter Minimum Experience"
                />
                {errors.minExp && (
                  <p className="text-red-500 text-sm">
                    {errors.minExp.message}
                  </p>
                )}
              </div>

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Max (in Years) <span className="text-red-600">* </span>
                </label>
                <input
                  type="number"
                  {...register("maxExp", {
                    required: "Max Range is required",
                  })}
                  className={` ${inputClassName} ${
                    errors.maxExp
                      ? "border-[1px] "
                      : "border-gray-300"
                  } `}
                  placeholder="Enter Maximum Experience"
                />
                {errors.maxExp && (
                  <p className="text-red-500 text-sm">
                    {errors.maxExp.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div>
                <label className={`${inputLabelClassName}`}>
                  Skills <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("skills")}
                  className={`${inputClassName} ${
                    errors.skills
                      ? "border-[1px] "
                      : "border-gray-300"
                  }`}
                  placeholder="Write Skills & Press Enter"
                  value={tagInput}
                  onChange={handleTagChange}
                  onKeyDown={handleAddTag}
                />
                {tags.length === 0 && errors.skills && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skills.message}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
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
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1">
             <div>
             <label className={`${inputLabelClassName}`}>
                  Status <span className="text-red-600">*</span>
                </label>
             <Controller
                control={control}
                name="status"
                rules={{ required: "status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={` ${inputAntdSelectClassName} `}
                    showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                  >
                    <Select.Option className="" value="">
                      Select Status
                    </Select.Option>
                    <Select.Option value="Open">Open</Select.Option>
                    <Select.Option value="Closed">Closed</Select.Option>
                    <Select.Option value="Draft">Draft</Select.Option>
                  </Select>
                )}
              />
             </div>
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Job Description <span className="text-red-600">* </span>
              </label>
              <ReactQuill
                value={editorValue}
                onChange={handleEditorChange}
                placeholder="Write the email body here"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["bold", "italic", "underline", "strike"],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["blockquote", "code-block"],
                    ["clean"],
                  ],
                }}
                formats={[
                  "header",
                  "font",
                  "list",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "align",
                  "clean",
                ]}
              />
            </div>

            <div className="flex items-center mt-2 p-3">
              <input
                type="checkbox"
                id="immediateJoiner"
                checked={immediateJoiner}
                onChange={(e) => handleJoinerBox(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="immediateJoiner"
                className={`${inputLabelClassName}`}
              >
                isImmediateJoiner
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={jobPostLoading}
              className={`${jobPostLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {jobPostLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>}
    </GlobalLayout>
  );
};

export default EditJobPostList;
