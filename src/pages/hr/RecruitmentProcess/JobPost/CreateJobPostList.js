import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
  sortByPropertyAlphabetically,
} from "../../../../constents/global";
import getUserIds from '../../../../constents/getUserIds';
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { createJobPost } from "./JobPostFeatures/_job_post_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import ReactQuill from "react-quill";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";

const CreateJobPostList = () => {
  const { loading: jobPostLoading } = useSelector((state) => state.jobPost);
  const {
    register,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const {
    userCompanyId,

    userBranchId,
    userEmployeId,
    userDepartmentId,
    userDesignationId,
    userType
  } = getUserIds();

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { designationList, loading: desLoading } = useSelector((state) => state.designation);
  const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const [editorValue, setEditorValue] = useState(``);
  const [immediateJoiner, setImmediateJoiner] = useState(false);

  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
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
  const [descriptionWarning, setDescriptionWarning] = useState(false)
  const [skillsWarning, setSkillWarning] = useState(false)
  const formValidation = () => {

    // if(!editorValue){
    //   setDescriptionWarning(true)
    //   return false
    // }
    if (tags.length === 0) {
      setSkillWarning(true)
      return false
    }

    if (!editorValue || editorValue === '<p><br></p>') {
      setDescriptionWarning(true)
      return false
    }
    return true;

  }

  const onSubmit = (data) => {



    if (formValidation()) {


      const finalPayload = {
        employeId: employeId,
        companyId: companyId,
        directorId: '',
        branchId: branchId,
        departmentId: departmentId,
        designationId: designationId,
        title: data?.jobTitle,
        location: data?.location,
        description: editorValue,
        requiredSkills: tags,
        profileType: data?.profileType,
        noOfVacancy: parseInt(data?.noOfVacancy),
        employmentType: data?.employmentType,
        salaryRange: {
          min: parseInt(data?.minSalary),
          max: parseInt(data?.maxSalary),
          currency: 'INR',
        },
        experienceRange: {
          min: parseInt(data?.minExp),
          max: parseInt(data?.maxExp),
        },
        isImmediateJoiner: immediateJoiner,
        status: data?.status,
        // "title": "Frontend Developer",
        // "location": "San Francisco, CA",
        // "description": "Build and optimize UI components.",
        // "requiredSkills": ["HTML", "CSS", "JavaScript", "React"],
        // "noOfVacancy": 2,
        // "employmentType": "Full-Time",
        // "salaryRange": {
        //   "min": 70000,
        //   "max": 110000,
        //   "currency": "USD"
        // },
        // "experienceRange": {
        //   "min": 1,
        //   "max": 3
        // },
        // "status": "Open",
        // "isImmediateJoiner": false,
        // "rawData": {
        //   "externalReferenceId": "JOB20250128",
        //   "notes": "Candidates must be proficient in modern web development tools."
        // },

      };

      dispatch(createJobPost(finalPayload)).then((data) => {
        if (!data.error) navigate(-1);
      });
    }
  };

  const handleJoinerBox = (checked) => {
    setImmediateJoiner(checked);
  };


  useEffect(() => {
    if (userType === "admin") {
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
    if (branchId) {
      dispatch(
        deptSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId,
          branchId: branchId,
        })
      );
    }
  }, [branchId]);

  useEffect(() => {
    if ((companyId && userType === "company" || companyId && userType === "admin")) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: companyId
        })
      );
    }
  }, [companyId])

  useEffect(() => {
    if (companyId && userType === "company" || userType === "admin") {
      dispatch(directorSearch({
        text: "", sort: true, status: true, isPagination: false, companyId: companyId,
      })
      );
    }
  }, [companyId]);

  useEffect(() => {
    if (departmentId) {
      dispatch(
        designationSearch({
          departmentId: departmentId,
          companyId: companyId,
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, [departmentId]);



  const handleTagChange = (e) => {
    setSkillWarning(false)

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
  const handleEditorChange = (value) => {
    setDescriptionWarning(false)
    setEditorValue(value);
  };
  return (
    <GlobalLayout>
      <div className="gap-4" >

        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)} >
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2" >


            < div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 " >
              {(userType === "admin") && (
                <div className="" >
                  <label className={`${inputLabelClassName}`}>
                    Company < span className="text-red-600" >* </span>
                  </label>
                  <Controller
                    name="companyId"
                    control={control}
                    rules={{
                      required: "Company is required",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}

                        placeholder="Select Company"
                        showSearch

                      >
                        <Select.Option value="">Select Company</Select.Option>
                        {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                          (companyList?.map((type) => (
                            <Select.Option value={type?._id} >
                              {type?.fullName}({type?.userName})
                            </Select.Option>
                          )))
                        }
                      </Select>
                    )}
                  />
                  {/* < select
                    {...register("companyId", {
                      required: "Company is required",
                    })
                    }
                    className={` ${inputClassName} ${errors.companyId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="" >
                      Select Company
                    </option>
                    {
                      companyList?.map((type) => (
                        <option value={type?._id} >
                          {type?.fullName}({type?.userName})
                        </option>
                      ))
                    }
                  </select> */}
                  {
                    errors.companyId && (
                      <p className="text-red-500 text-sm" >
                        {errors.companyId.message}
                      </p>
                    )
                  }
                </div>
              )}
              {
                (userType === "admin" || userType === "company" || userType === 'companyDirector') && (
                  <div className="" >
                    <label className={`${inputLabelClassName}`}>
                      Branch < span className="text-red-600" >* </span>
                    </label>
                    <Controller
                      name="branchId"
                      control={control}
                      rules={{
                        required: "Branch is required",
                      }}

                      render={({ field }) => (
                        <Select
                          {...field}
                          onChange={(value) => {
                            setValue("designationId", '')
                            setValue("departmentId", '')
                            field.onChange(value);
                          }}
                          className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select Branch"
                          showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }

                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                            (sortByPropertyAlphabetically(branchList, 'fullName')
                              ?.filter((element) => element?.companyId === companyId)
                              ?.map((element) => (
                                <Select.Option value={element?._id} > {element?.fullName} </Select.Option>
                              )))
                          }
                        </Select>
                      )}
                    />

                    {
                      errors.branchId && (
                        <p className="text-red-500 text-sm" >
                          {errors.branchId.message}
                        </p>
                      )
                    }
                  </div>)}
              <div className="" >
                <label className={`${inputLabelClassName}`}> Job Post Name <span className="text-red-600" >* </span></label >
                <input
                  type="text"
                  {...register("jobTitle", {
                    required: "Job Post Name is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.jobTitle ? "border-[1px] " : "border-gray-300"
                    } `
                  }
                  placeholder="Enter Job Post Name"
                />
                {
                  errors.jobTitle && (
                    <p className="text-red-500 text-sm">
                      {errors.jobTitle.message}
                    </p>
                  )
                }
              </div>
            </div>

            < div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 " >
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
            </div>



            < div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 md:my-1 " >

              <div className="" >
                <label className={`${inputLabelClassName}`}> No.of Vacancy < span className="text-red-600" >* </span></label >
                <input
                  type="number"
                  {...register("noOfVacancy", {
                    required: "No of Vacancy is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.noOfVacancy ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter No of Vacancy"
                />
                {
                  errors.noOfVacancy && (
                    <p className="text-red-500 text-sm">
                      {errors.noOfVacancy.message}
                    </p>
                  )
                }
              </div>

              {/* < div >
                <label className={`${inputLabelClassName}`}>
                  Status < span className="text-red-600" >* </span>
                </label>
                < select
                  {...register("status", {
                    required: "Status is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                >
                  <option value="" > Select Status </option>
                  < option value="Open" > Open </option>
                  < option value="Closed" > Closed </option>
                  < option value="Draft" > Draft </option>
                </select>
                {
                  errors.status && (
                    <p className="text-red-500 text-sm" > {errors.status.message} </p>
                  )
                }
              </div> */}

              < div >
                <label className={`${inputLabelClassName}`}>
                  Employment Type < span className="text-red-600" >* </span>
                </label>
                {/* < select
                  {...register("employmentType", {
                    required: "Sundays Off is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.employmentType ? "border-[1px] " : "border-gray-300"}`}
                >
                  <option value="" > Select Employment Type </option>
                  < option value="Full-Time" > Full - Time </option>
                  < option value="Part-Time" > Part - Time </option>
                  < option value="Contract" > Contract </option>
                  < option value="Internship" > Internship </option>
                </select> */}
                <Controller
                  name="employmentType"
                  control={control}
                  rules={{
                    required: "Employment Type is required",
                  }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={` ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}

                      placeholder="Select Employment Type"
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }

                    >
                      <Select.Option value="">Select Employment Type</Select.Option>


                      <Select.Option value="Full-Time" > Full - Time </Select.Option>
                      <Select.Option value="Part-Time" >Part - Time </Select.Option>
                      <Select.Option value="Contract" >Contract  </Select.Option>
                      <Select.Option value="Internship" >Internship </Select.Option>
                    </Select>
                  )}
                />





                {
                  errors.employmentType && (
                    <p className="text-red-500 text-sm" > {errors.employmentType.message} </p>
                  )
                }
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

            < div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 md:my-1 " >

              <div className="" >
                <label className={`${inputLabelClassName}`}> Location < span className="text-red-600" >* </span></label >
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.location ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter Location"
                />
                {
                  errors.location && (
                    <p className="text-red-500 text-sm">
                      {errors.location.message}
                    </p>
                  )
                }
              </div>

              < div className="" >
                <label className={`${inputLabelClassName}`}>
                  Min Salary (INR) < span className="text-red-600" > * </span>
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
                  className={`placeholder: ${inputClassName} ${errors.minSalary ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter expected salary"
                />
                {
                  errors.minSalary && (
                    <p className="text-red-500 text-sm">
                      {errors.minSalary.message}
                    </p>
                  )
                }
              </div>

              < div className="" >
                <label className={`${inputLabelClassName}`}>
                  Max Salary (INR) < span className="text-red-600" >* </span>
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
                  className={`placeholder: ${inputClassName} ${errors.maxSalary ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Enter Expected Salary"
                />
                {
                  errors.maxSalary && (
                    <p className="text-red-500 text-sm">
                      {errors.maxSalary.message}
                    </p>
                  )
                }
              </div>

              {/* < div >
                <label className={`${inputLabelClassName}`}>
                  Currency < span className="text-red-600" > * </span>
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
                {
                  errors.currency && (
                    <p className="text-red-500 text-sm" > {errors.currency.message} </p>
                  )
                }
              </div> */}

            </div>

            < div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 " >

              < div className="" >
                <label className={`${inputLabelClassName}`}>
                  Min (in Years)< span className="text-red-600" > * </span>
                </label>
                < input
                  type="number"
                  {...register("minExp", {
                    required: "Min Range is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.minExp ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter Minimum Experience"
                />
                {
                  errors.minExp && (
                    <p className="text-red-500 text-sm">
                      {errors.minExp.message}
                    </p>
                  )
                }
              </div>

              < div className="" >
                <label className={`${inputLabelClassName}`}>
                  Max (in Years) < span className="text-red-600" >* </span>
                </label>
                < input
                  type="number"
                  {...register("maxExp", {
                    required: "Max Range is required",
                  })
                  }
                  className={` ${inputClassName} ${errors.maxExp ? "border-[1px] " : "border-gray-300"
                    } `}
                  placeholder="Enter Maximum Experience"
                />
                {
                  errors.maxExp && (
                    <p className="text-red-500 text-sm">
                      {errors.maxExp.message}
                    </p>
                  )
                }
              </div>

            </div>

            < div >
              <div>
                <label className={`${inputLabelClassName}`}> Skills < span className="text-red-600" >* </span></label >
                <input
                  type="text"
                  {...register("skills",

                  )}
                  className={`${inputClassName} ${errors.skills ? "border-[1px] " : "border-gray-300"
                    }`}
                  placeholder="Write Skills & Press Enter"
                  value={tagInput}
                  onChange={handleTagChange}
                  onKeyDown={handleAddTag}
                />

              </div>
              < div className="flex flex-wrap gap-2 mt-2" >
                {
                  tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded-full flex items-center gap-2"
                    >
                      {tag}
                      < button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-red-500 hover:text-red-700"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                {/* {
                  errors.skills && (
                    <p className="text-red-500 text-sm mt-1" >
                      {errors.skills.message}
                    </p>
                  )
                } */}

                {
                  (tags.length === 0 && skillsWarning) && (
                    <span className="text-[14px] text-red-600">
                      skills is required
                    </span>
                  )
                }
              </div>
            </div>

            < div className="" >
              <label className={`${inputLabelClassName}`}>
                Job Description < span className="text-red-600" >* </span>
              </label>

              <ReactQuill
                value={editorValue}
                onChange={handleEditorChange}
                placeholder="Write the email body here"
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    ['link', 'image', 'video'],
                    ['blockquote', 'code-block'],
                    ['clean']
                  ],
                }}
                formats={['header', 'font', 'list', 'bold', 'italic', 'underline', 'link', 'align', 'clean']}
              />
              {
                descriptionWarning && (
                  <span className="text-red-600 text-[14px]"> Job Description is required</span>
                )
              }


            </div>

            <div className="flex items-center mt-2 p-3">
              <input
                type="checkbox"
                id="immediateJoiner"
                onChange={(e) => handleJoinerBox(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="immediateJoiner" className={`${inputLabelClassName}`}>
                isImmediateJoiner
              </label>
            </div>

          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={jobPostLoading}
              className={`${jobPostLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded`}
            >
              {jobPostLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateJobPostList;