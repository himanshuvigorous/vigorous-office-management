import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller, useWatch, set } from "react-hook-form";
import { useDispatch } from "react-redux";
import ReactSelect from "react-select";
import {
  formButtonClassName,
  getLocationDataByPincode,
  inputClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
  JobPostApplicationInput,
  JobPostApplicationLabel,
} from "../../constents/global";
import { useNavigate, useParams } from "react-router-dom";
import { createApplication } from "./applicationFeatures/_application_reducers";
import { decrypt } from "../../config/Encryption";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { fileUploadFunc } from "../global/other/fileManagement/FileManagementFeatures/_file_management_reducers";
import { baseUrl } from "../../config/Http";
import axios from "axios";
import {
  AutoComplete,
  Button,
  DatePicker,
  Input,
  Progress,
  Radio,
  Select,
  Tooltip,
  Upload,
} from "antd";
import CustomDatePicker from "../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import { showNotification } from "../../global_layouts/CustomNotification/NotificationManager";
import Swal from "sweetalert2";
import { FaCamera, FaUserAlt } from "react-icons/fa";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { MdPushPin } from "react-icons/md";
import { AiFillEdit, AiOutlineClose } from "react-icons/ai";
import {
  IoBagCheck,
  IoBagCheckSharp,
  IoKeyOutline,
  IoReorderThree,
} from "react-icons/io5";
import { HiOutlineCurrencyRupee } from "react-icons/hi";
import Dragger from "antd/es/upload/Dragger";
import CustomMobileCodePicker from "../../global_layouts/MobileCode/MobileCodePicker";

const JobPostApplication = () => {
  const { jobPostIdEnc } = useParams();
  const [submited, setSubmited] = useState(false)
  const jobPostId = decrypt(jobPostIdEnc);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });
  const [experienceType, setExperienceType] = useState("");
  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
    defaultValue: "",
  });
  const [jobData, setJobData] = useState(null);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceDetails",
  });
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [imageError, setImageError] = useState(null);
  const dispatch = useDispatch();

  const handleFileChange = (info, onChange) => {
    const file = info.fileList[0]?.originFileObj;

    if (!file) {
      return;
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


    onChange(file);
  };

  const [filePath, setFilePath] = useState("");

  // const props = {
  //   name: "file",
  //   multiple: true, // Enable multiple file uploads
  //   beforeUpload: (file) => {
  //     setFilePath(file.name);
  //     return false;
  //   },
  //   onChange(info) {
  //     const { file } = info;
  //     if (file.status !== "uploading") {
  //     }
  //     if (file.status === "done") {
  //       //message.success(`${file.name} file uploaded successfully.`);
  //     } else if (file.status === "error") {
  //       //message.error(`${file.name} file upload failed.`);
  //     }
  //   },
  // };

  const handleFileChangeProfile = (event) => {
    const file = event.target.files[0];
    dispatch(
      fileUploadFunc({
        filePath: file,
        isVideo: false,
        isMultiple: false,
      })
    ).then((res) => {
      setProfileImagePayload(res?.payload?.data);
    });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setImageError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const [showDescription, setShowDescription] = useState(false);
  const handlJobDescription = () => {
    setShowDescription(!showDescription);
  };


  useEffect(() => {
    if (jobPostId) {
      // setValue("profileType", "Fresher");
      const fetchJobDetailsApi = async () => {
        const response = await axios({
          method: "Post",
          url:
            baseUrl.BACKEND_URL + `employe/recruitment/jobpost/jobPostDetail`,
          data: {
            _id: jobPostId,
          },
        });
        setJobData(response?.data?.data);
      };
      fetchJobDetailsApi();
    }
  }, [jobPostId]);

  const submitApplication = async (data) => {
    try {
      const response = await axios({
        method: "POST",
        url:
          baseUrl.BACKEND_URL +
          `employe/recruitment/application/apply?jobPostId=${jobPostId}`,
        data: data,
      });

      // Show SweetAlert2 on success
      Swal.fire({
        title: "Success!",
        text: "Application submitted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          // Update the state after the alert is confirmed

          setApplicationSubmitted(true); // Assuming you have the state `applicationSubmitted` to track submission status

        }
      });

      if (!response.error) {
        setSubmited(true)
      }

    } catch (error) {
      showNotification({
        message: error.response ? error.response.data.message : error.message,
        type: "error",
      });
    }
  };
  const twoColors = {
    "0%": "#108ee9",
    "100%": "#87d068",
  };
  const conicColors = {
    "0%": "#87d068",
    "50%": "#ffe58f",
    "100%": "#ffccc7",
  };

  const onSubmit = async (data, errors) => {

    const finalPayload = {
      jobId: jobPostId,
      employeId: "",
      companyId: jobData?.companyId,
      directorId: jobData?.directorId,
      branchId: jobData?.branchId,
      departmentId: jobData?.departmentId,
      designationId: jobData?.designationId,
      profileType: data?.profileType,
      currentSalary: +data?.currentSalary,
      expectedSalary: +data?.expectedSalary,
      fullName: data?.fullName,
      email: data?.email,
      jobRefrenceFrom: data?.knowUs,
      mobile: {
        code: data?.PDmobileCode,
        number: data?.PDMobileNo,
      },
      previousJobTitle: data?.previousJobTitle,
      previousCompanyName: data?.previousCompanyName,
      previousHRNumber: {
        code: data?.PDPreviousmobileCode,
        number: data?.PDPreviousMobileNo,
      },
      previousCompAdd: data?.previousCompanyAddress,
      resumeUrl: selectedFile,
      gender: data?.gender,
      dateOfBirth: data?.dateOfBirth,
      maritalStatus: data?.maritalStatus,
      totalExp: +data?.totalExp,
      totalReleventExp: +data?.totalReleventExp,
      noticePeriodDays: +data?.noticePeriodDays,
      referenceDetails: data?.referenceDetails,
      address: {
        street: data?.PDAddress ?? "",
        city: data?.PDCity ?? "",
        state: data?.PDState ?? "",
        country: data?.PDCountry ?? "",
        pinCode: data?.PDPinCode,
      },
      profileImage: profileImagePayload,
    };
    if (!profileImage) {
      setImageError("Profile image is required");
    } else {
      await submitApplication(finalPayload);
    }


  };
  useEffect(() => {
    if (
      PrintPincode &&
      PrintPincode.length >= 4 &&
      PrintPincode.length <= 6 &&
      /^\d{6}$/.test(PrintPincode)
    ) {
      getLocationDataByPincode(PrintPincode)
        .then((data) => {
          if (data) {
            setValue("PDCity", data.city);
            setValue("PDState", data.state);
            setValue("PDCountry", data.country);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [PrintPincode]);


  return (
    <div className="h-screen overflow-auto  ">
      <div className="sm:w-full    w-full h-full sm:grid grid-cols-[0.6fr_1.4fr] grid-col-1 ">
        <div
          className={`w-full h-full ${showDescription ? "" : "hidden"
            } sm:flex  flex-col bg-header shadow-2xl  `}
        >
          <div
            className={`sm:hidden  flex justify-end ${showDescription ? "hidden " : ""
              }`}
          >
            <button onClick={() => handlJobDescription()}>
              <AiOutlineClose className="text-red-500 text-2xl m-2" />
            </button>
          </div>

       {jobData?.companyDetails?.profileImage &&    <img className=" m-auto max-w-[200px] max-h-[150px] " src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${jobData?.companyDetails?.profileImage}`}></img>}

          <div className="h-full flex flex-col justify-center items-center flex-1 ">
            <h1
              className="font-medium bg-white rounded-xl text-2xl mt-4 p-6 -rotate-12 shadow-lg relative"
              style={{
                boxShadow: "1px 1px 8px rgba(0, 255, 0, 0.5)",
                animation: "borderRotate 5s linear infinite",
                border: "4px solid transparent",
              }}
            >
              <strong className="text-header ">We Are Hiring</strong>
            </h1>

            <style>
              {`
  @keyframes borderRotate {
    0% { border-color: green transparent transparent transparent; }
    25% { border-color: transparent green transparent transparent; }
    50% { border-color: transparent transparent green transparent; }
    75% { border-color: transparent transparent transparent green; }
    100% { border-color: green transparent transparent transparent; }
  }
`}
            </style>

            <div className="w-full p-5 flex flex-col gap-2 items-center  rounded-md  text-white   m-3 ">
              <h2 className="text-lg font-semibold border-b pb-2 mb-3">
                Position Overview
              </h2>
              <p className="mb-3 font-medium text-green-500">
                {jobData?.title}
              </p>
              <div className="flex flex-row gap-2 items-center">
                <MdPushPin className="text-green-500"></MdPushPin>{" "}
                <strong>Location: </strong>
                <span className="font-medium">{jobData?.location}</span>
              </div>

              <div className="flex flex-row gap-2  items-center justify-center  ">
                <AiFillEdit className="text-black" />
                <h3 className="text-md font-semibold ">Description</h3>
              </div>
              <div
                className="text-sm "
                dangerouslySetInnerHTML={{ __html: jobData?.description }}
              />
              <div className="flex flex-row gap-2  items-center mt-2 justify-center ">
                <IoKeyOutline className="text-gray-400" />
                <h3 className="text-md font-semibold ">Key Responsibilities</h3>
              </div>
              <ul className="list-disc pl-4 text-sm">
                {jobData?.requiredSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <div className="flex flex-row gap-2  mt-2 items-center justify-center ">
                <IoBagCheck className="text-green-500" />
                <h3 className="text-md font-semibold ">Job Details</h3>
              </div>
              <p>
                Profile Type:{" "}
                <span className="font-medium">{jobData?.profileType}</span>
              </p>
              <p>
                Employment Type:{" "}
                <span className="font-medium">{jobData?.employmentType}</span>
              </p>
              <p>
                Experience Required:{" "}
                <span className="font-medium">
                  {jobData?.experienceRange.min} -{" "}
                  {jobData?.experienceRange.max} years
                </span>
              </p>
              <p>
                Vacancies:{" "}
                <span className="font-medium">{jobData?.noOfVacancy}</span>
              </p>
              <p>
                Immediate Joiner:{" "}
                <span className="font-medium">
                  {jobData?.isImmediateJoiner ? "Yes" : "No"}
                </span>
              </p>

              <div className="flex flex-row gap-2  mt-2  items-center justify-center ">
                <HiOutlineCurrencyRupee className="text-green-500" />
                <h3 className="text-md font-semibold">Salary Range</h3>
              </div>
              <p className="font-medium">
                {jobData?.salaryRange.min} - {jobData?.salaryRange.max}{" "}
                {jobData?.salaryRange.currency}
              </p>
            </div>
          </div>
        </div>

        <div className={` flex flex-col items-center overflow-auto bg-white `}>
          {/* <div className="items-end justify-end ">
              <Tooltip placement="topLeft"  title="View Job Description ">
                <button onClick={() => handlJobDescription()}>
                  <IoReorderThree className="text-end text-xl text-header sm:hidden" />
                </button>
              </Tooltip>
            </div> */}

          <section className="">
            <div className="p-4">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)} className=" px-2 gap-2">
                <div className="w-full">
                  {/* <Controller
                    name="profileType"
                    control={control}
                    render={({ field }) => (
                      <Radio.Group
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                        optionType="button"
                        buttonStyle="solid"
                        block
                        defaultValue={"Fresher"}
                        className={`  ${errors.clientSelection
                            ? "border-[1px] "
                            : "border-gray-300"
                          }`}
                      >
                        <Radio value="Fresher">Fresher</Radio>
                        <Radio value="Intern">Intern</Radio>
                        <Radio value="Experience">Experience</Radio>
                      </Radio.Group>
                    )}
                  /> */}

                  <div className=" ">

                    {imageError && (
                      <p className="text-red-500 text-sm text-center">{imageError}</p>
                    )}
                    <div
                      className={`grid ${watch("profileType") === "Experience"
                        ? "grid-cols-1 md:grid-cols-3"
                        : "grid-cols-1 md:grid-cols-2"
                        } md:gap-8 gap-4 md:my-6 my-3 px-3`}
                    >

                      <div
                        className={`${watch("profileType") === "Experience"
                          ? "col-span-1 md:col-span-3"
                          : "col-span-1 md:col-span-2"
                          } relative w-[100px] h-[100px] mx-auto rounded-full border-2 border-slate-600  flex items-center justify-center`}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                      >
                        <div
                          className={`w-full  h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
                          style={{
                            backgroundImage: `url(${profileImage || ""})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                          >
                          {!profileImage && (
                            <FaUserAlt className="text-header w-[50px] h-[40px] cursor-pointer" />
                          )}
                        </div>

                        {isHovering && !profileImage && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                            <FaCamera className="text-white w-[20px] h-[20px] cursor-pointer" />
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChangeProfile}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Profile Type <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="profileType"
                          control={control}
                          rules={{ required: 'Enter Profile Type' }}

                          render={({ field }) => (
                            <Select
                              {...field}
                              placeholder="Select Profile Type"

                              onChange={(value) => field.onChange(value)}
                              defaultValue=""
                              className={`w-full h-9 ${JobPostApplicationInput}`}
                            >
                              <Select.Option value="">Enter Profile Type</Select.Option>
                              <Select.Option value="Fresher">Fresher</Select.Option>
                              <Select.Option value="Intern">Intern</Select.Option>
                              <Select.Option value="Experience">Experience</Select.Option>
                            </Select>
                          )}
                        />
                        {errors.profileType && (
                          <p className="text-red-500 text-sm">
                            {errors.profileType.message}
                          </p>
                        )}
                      </div>
                      <div className="">

                        <label className={`${inputLabelClassName}`}>
                          Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("fullName", {
                            required: "Name is required",
                          })}
                          className={`placeholder: ${JobPostApplicationInput} ${errors.fullName
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Name"
                        />
                        {errors.fullName && (
                          <p className="text-red-500 text-sm">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      {watch("profileType") === "Experience" && (
                        <>
                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Total Experience (Years)
                            </label>
                            <input
                              type="number"
                              {...register("totalExp", {
                                required: "Experience in Years is required",
                                min: {
                                  value: 1,
                                  message:
                                    "Experience must be at least 1 month",
                                },
                              })}
                              className={` ${JobPostApplicationInput} ${errors.totalExp
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter experience in Years"
                            />
                            {errors.totalExp && (
                              <p className="text-red-500 text-sm">
                                {errors.totalExp.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className={`${inputLabelClassName}`}>
                              Relevant Experience (Years)
                            </label>
                            <input
                              type="number"
                              {...register("totalReleventExp", {
                                required: "Experience in Years is required",
                                min: {
                                  value: 1,
                                  message:
                                    "Experience must be at least 1 month",
                                },
                              })}
                              className={` ${JobPostApplicationInput} ${errors.totalReleventExp
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter experience in Years"
                            />
                            {errors.totalReleventExp && (
                              <p className="text-red-500 text-sm">
                                {errors.totalReleventExp.message}
                              </p>
                            )}
                          </div>

                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Current Job Title{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("previousJobTitle", {
                                required: "Current job title is required",
                              })}
                              className={`placeholder: ${JobPostApplicationInput} ${errors.previousJobTitle
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Current job title"
                            />
                            {errors.previousJobTitle && (
                              <p className="text-red-500 text-sm">
                                {errors.previousJobTitle.message}
                              </p>
                            )}
                          </div>

                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Current Company{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("previousCompanyName", {
                                required: "Current company name is required",
                              })}
                              className={`placeholder: ${JobPostApplicationInput} ${errors.previousCompanyName
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Current company name"
                            />
                            {errors.previousCompanyName && (
                              <p className="text-red-500 text-sm">
                                {errors.previousCompanyName.message}
                              </p>
                            )}
                          </div>
                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Current Company Address <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("previousCompanyAddress", {
                                required: "Current company Address is required",
                              })}
                              className={`placeholder: ${inputClassName} ${errors.previousCompanyAddress
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Current company Address"
                            />
                            {errors.previousCompanyAddress && (
                              <p className="text-red-500 text-sm">
                                {errors.previousCompanyAddress.message}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <div className="w-[150px]">
                              <label className={`${inputLabelClassName}`}>
                                code
                              </label>
                              <Controller
                                control={control}
                                name="PDPreviousmobileCode"

                                render={({ field }) => (
                                  <CustomMobileCodePicker
                                    field={field}
                                    errors={errors}
                                  />
                                )}
                              />
                              {errors[`PDPreviousmobileCode`] && (
                                <p className={`${inputerrorClassNameAutoComplete}`}>
                                  {errors[`PDPreviousmobileCode`].message}
                                </p>
                              )}
                            </div>
                            <div className="w-full">
                              <label className={`${inputLabelClassName}`}>
                                Previour HR Number
                              </label>
                              <input
                                type="number"
                                {...register(`PDPreviousMobileNo`, {
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
                                className={` ${inputClassName} ${errors[`PDPreviousMobileNo`]
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                                placeholder="Enter Mobile No"
                                maxLength={10}
                                onInput={(e) => {
                                  if (e.target.value.length > 10) {
                                    e.target.value = e.target.value.slice(0, 10);
                                  }
                                }}
                              />
                              {errors[`PDPreviousMobileNo`] && (
                                <p className="text-red-500 text-sm">
                                  {errors[`PDPreviousMobileNo`].message}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Current Salary{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("currentSalary", {
                                required: "Current Salary is required",
                                pattern: {
                                  value: /^\d+(\.\d+)?$/,
                                  message: "Please enter a valid number",
                                },
                              })}
                              onInput={(e) => {
                                // Allow only numbers and a single dot
                                e.target.value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                // Ensure only one dot is present
                                if (
                                  (e.target.value.match(/\./g) || []).length > 1
                                ) {
                                  e.target.value = e.target.value.slice(0, -1);
                                }
                              }}
                              className={`${JobPostApplicationInput} ${errors.currentSalary
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Current Salary"
                            />
                            {errors.currentSalary && (
                              <p className="text-red-500 text-sm">
                                {errors.currentSalary.message}
                              </p>
                            )}
                          </div>

                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Expected Salary{" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="text"
                              {...register("expectedSalary", {
                                required: "Expected salary is required",
                                pattern: {
                                  value: /^\d+(\.\d+)?$/,
                                  message:
                                    "Only numeric or decimal values are allowed",
                                },
                              })}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                if (
                                  (e.target.value.match(/\./g) || []).length > 1
                                ) {
                                  e.target.value = e.target.value.slice(0, -1);
                                }
                              }}
                              className={`placeholder: ${JobPostApplicationInput} ${errors.expectedSalary
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                              placeholder="Enter Expected salary"
                            />
                            {errors.expectedSalary && (
                              <p className="text-red-500 text-sm">
                                {errors.expectedSalary.message}
                              </p>
                            )}
                          </div>

                          <div className="">
                            <label className={`${inputLabelClassName}`}>
                              Notice Period (Days){" "}
                              <span className="text-red-600">*</span>
                            </label>
                            <input
                              type="number"
                              {...register("noticePeriodDays", {
                                required: "Notice period is required",
                              })}
                              className={`placeholder: ${JobPostApplicationInput} ${errors.noticePeriodDays
                                ? "border-[1px] "
                                : "border-gray-300"
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
                        </>
                      )}
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Location <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("location", {
                            required: "Location is required",
                          })}
                          className={`placeholder: ${JobPostApplicationInput} ${errors.location
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter location"
                        />
                        {errors.location && (
                          <p className="text-red-500 text-sm">
                            {errors.location.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 px-3">
                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Email <span className="text-red-600">*</span>
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
                          className={` ${JobPostApplicationInput} ${errors.email ? "border-[1px] " : "border-gray-300"
                            }`}
                          placeholder="Enter Email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <div className="w-20">
                          <label className={`${inputLabelClassName} `}>
                            Code <span className="text-red-600">*</span>
                          </label>
                          <Controller
                            control={control}
                            name="PDmobileCode"
                            rules={{ required: "code is required" }}
                            render={({ field }) => (

                              <AutoComplete
                                className="border "
                                {...field}
                                onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                                options={[
                                  { value: "+91" },
                                  { value: "+01" },
                                  { value: "+92" },
                                  { value: "+41" },
                                  { value: "+51" },
                                ]}
                              >
                                <input
                                  className={`w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-lg  py-2 transition duration-200 ease-in-out focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-400 shadow-sm ${errors.PDState
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                />
                              </AutoComplete>
                            )}
                          />
                          {errors[`PDmobileCode`] && (
                            <p className={`${inputerrorClassNameAutoComplete}`}>
                              {errors[`PDmobileCode`].message}
                            </p>
                          )}
                        </div>
                        <div className="w-full">
                          <label className={`${inputLabelClassName}`}>
                            Mobile No <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="number"
                            {...register(`PDMobileNo`, {
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
                            className={` ${JobPostApplicationInput} ${errors[`PDMobileNo`]
                              ? "border-[1px] "
                              : "border-gray-300"
                              }`}
                            placeholder="Enter Mobile No"
                            maxLength={10}
                            onInput={(e) => {
                              if (e.target.value.length > 10) {
                                e.target.value = e.target.value.slice(0, 10);
                              }
                            }}
                          />
                          {errors[`PDMobileNo`] && (
                            <p className="text-red-500 text-sm">
                              {errors[`PDMobileNo`].message}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Gender <span className="text-red-600">*</span>
                        </label>
                        <select
                          {...register("gender", {
                            required: "Gender is required",
                          })}
                          className={`mt-0 ${JobPostApplicationInput} ${errors.gender ? "border-[1px] " : "border-gray-300"
                            }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                          <p className="text-red-500 text-sm">
                            {errors.gender.message}
                          </p>
                        )}
                      </div>

                      <div className="">
                        <label className={`${inputLabelClassName}`}>
                          Date of Birth <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          name="dateOfBirth"
                          control={control}
                          render={({ field }) => (
                            <CustomDatePicker
                              field={field}
                              errors={errors}
                              disabledDate={(current) => {
                                return (
                                  current &&
                                  current.isAfter(moment().endOf("day"), "day")
                                );
                              }}
                            />
                          )}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-500 text-sm">
                            {errors.dateOfBirth.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Marital Status <span className="text-red-600">*</span>
                        </label>
                        <select
                          {...register("maritalStatus", {
                            required: "Marital status is required",
                          })}
                          className={`mt-0 ${JobPostApplicationInput} ${errors.maritalStatus
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                        >
                          <option value="">Select Marital Status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                        {errors.maritalStatus && (
                          <p className="text-red-500 text-sm">
                            {errors.maritalStatus.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="fileInput"
                          className={`${inputLabelClassName}`}
                        >
                          Upload Resume <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="fileInput"
                          rules={{ required: "File is required" }}
                          render={({ field: { onChange } }) => (
                            <Upload
                              accept=".pdf"
                              maxCount={1}
                              beforeUpload={() => false}
                              onChange={(info) => handleFileChange(info, onChange)}
                            >
                              <Button icon={<Upload />}>Upload</Button>
                            </Upload>
                          )}
                        />
                        {errors.fileInput && (
                          <p className="text-red-500 text-sm">
                            {errors.fileInput.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
                      <div className="col-span-2">
                        <label className={`${inputLabelClassName}`}>
                          Primary Address <span className="text-red-600">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("PDAddress", {
                            required: "Address  is required",
                          })}
                          className={`${JobPostApplicationInput} ${errors.PDAddress
                            ? "border-[1px] "
                            : "border-gray-300"
                            }`}
                          placeholder="Enter Address "
                        />
                        {errors.PDAddress && (
                          <p className="text-red-500 text-sm">
                            {errors.PDAddress.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          Country <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name="PDCountry"
                          rules={{ required: "Country is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              className="w-full"
                              {...field}
                              onChange={(value) => {
                                // Directly handle country change by using setValue from React Hook Form
                                field.onChange(value); // Update the value in the form control
                              }}
                            >
                              <input
                                placeholder="Enter Country"
                                className={`${JobPostApplicationInput} ${errors.PDCountry
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDCountry && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.PDCountry.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          State <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name="PDState"
                          rules={{ required: "State is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              className="w-full"
                              {...field}
                              onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
                            >
                              <input
                                placeholder="Enter State"
                                className={`${JobPostApplicationInput} ${errors.PDState
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDState && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.PDState.message}
                          </p>
                        )}
                      </div>

                      {/* City Field */}
                      <div>
                        <div className={`${inputLabelClassName}`}>
                          City <span className="text-red-600">*</span>
                        </div>
                        <Controller
                          control={control}
                          name="PDCity"
                          rules={{ required: "City is required" }}
                          render={({ field }) => (
                            <AutoComplete
                              className="w-full"
                              {...field}
                              onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange
                            >
                              <input
                                placeholder="Enter City"
                                className={`${JobPostApplicationInput} ${errors.PDCity
                                  ? "border-[1px] "
                                  : "border-gray-300"
                                  }`}
                              />
                            </AutoComplete>
                          )}
                        />
                        {errors.PDCity && (
                          <p className={`${inputerrorClassNameAutoComplete}`}>
                            {errors.PDCity.message}
                          </p>
                        )}
                      </div>

                      {/* Pin Code Field */}
                      <div>
                        <label className={`${inputLabelClassName}`}>
                          Pin Code <span className="text-red-600">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="PDPinCode"
                          rules={{ required: "Pin Code is required" }}
                          render={({ field }) => (
                            <input
                              {...field}
                              type="number"
                              placeholder="Enter Pin Code"
                              maxLength={6}
                              onInput={(e) => {
                                if (e.target.value.length > 6) {
                                  e.target.value = e.target.value.slice(0, 6);
                                }
                              }}
                              className={`${JobPostApplicationInput} ${errors.PDPinCode
                                ? "border-[1px] "
                                : "border-gray-300"
                                }`}
                            />
                          )}
                        />
                        {errors.PDPinCode && (
                          <p className="text-red-500 text-sm">
                            {errors.PDPinCode.message}
                          </p>
                        )}
                      </div>

                    </div>

                    <div className="grid grid-cols-1  gap-2 md:my-1 px-3 md:mt-4 mt-4 mb-2">
                      <label className={`${inputLabelClassName}`}>
                        From where did you know about us
                      </label>
                      <input
                        type="text"
                        {...register("knowUs")}
                        className={` ${JobPostApplicationInput}`}
                        placeholder="Enter From where did you know about us"
                      />

                    </div>


                    <div className="px-3 pt-1">
                      {fields.map((item, index) => (
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
                            className={`px-4 rounded-md transition-all duration-300 overflow-hidden ${activeIndex === index
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
                                  {...register(
                                    `referenceDetails[${index}].name`,
                                    {
                                      required: "Name is required",
                                    }
                                  )}
                                  defaultValue={item.name}
                                  className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]?.name
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                  placeholder="Enter name"
                                />
                                {errors.referenceDetails?.[index]?.name && (
                                  <p className="text-red-500 text-sm">
                                    {
                                      errors.referenceDetails[index].name
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="mb-2">
                                <label className={`${inputLabelClassName}`}>
                                  Email <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="email"
                                  {...register(
                                    `referenceDetails[${index}].email`,
                                    {
                                      required: "Email is required",
                                    }
                                  )}
                                  defaultValue={item.email}
                                  className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]?.email
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                  placeholder="Enter email"
                                />
                                {errors.referenceDetails?.[index]?.email && (
                                  <p className="text-red-500 text-sm">
                                    {
                                      errors.referenceDetails[index].email
                                        ?.message
                                    }
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-3">
                                <div className="w-[150px]">
                                  <label className={`${inputLabelClassName}`}>
                                    code<span className="text-red-600">*</span>
                                  </label>
                                  <Controller
                                    control={control}
                                    name={`referenceDetails[${index}].mobile.code`}
                                    rules={{ required: "code is required" }}
                                    render={({ field }) => (
                                      <AutoComplete
                                        {...field}
                                        onChange={(value) =>
                                          field.onChange(value)
                                        } // Directly handle state change using React Hook Form's field.onChange
                                        options={[
                                          { value: "+91" },
                                          { value: "+01" },
                                          { value: "+92" },
                                          { value: "+41" },
                                          { value: "+51" },
                                        ]}
                                      >
                                        <input
                                          className={`${JobPostApplicationInput} ${errors.PDState
                                            ? "border-[1px] "
                                            : "border-gray-300"
                                            }`}
                                        />
                                      </AutoComplete>
                                    )}
                                  />
                                  {errors[
                                    `referenceDetails[${index}].mobile.code`
                                  ] && (
                                      <p
                                        className={`${inputerrorClassNameAutoComplete}`}
                                      >
                                        {
                                          errors[
                                            `referenceDetails[${index}].mobile.code`
                                          ].message
                                        }
                                      </p>
                                    )}
                                </div>
                                <div className="w-full">
                                  <label className={`${inputLabelClassName}`}>
                                    Mobile No
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    {...register(
                                      `referenceDetails[${index}].mobile.number`,
                                      {
                                        required: "Mobile No is required",
                                        minLength: {
                                          value: 10,
                                          message: "Must be exactly 10 digits",
                                        },
                                        maxLength: {
                                          value: 10,
                                          message: "Must be exactly 10 digits",
                                        },
                                      }
                                    )}
                                    className={` ${JobPostApplicationInput} ${errors[`PDMobileNo`]
                                      ? "border-[1px] "
                                      : "border-gray-300"
                                      }`}
                                    placeholder="Enter Mobile No"
                                    maxLength={10}
                                    onInput={(e) => {
                                      if (e.target.value.length > 10) {
                                        e.target.value = e.target.value.slice(
                                          0,
                                          10
                                        );
                                      }
                                    }}
                                  />
                                  {errors[
                                    `referenceDetails[${index}].mobile.number`
                                  ] && (
                                      <p className="text-red-500 text-sm">
                                        {
                                          errors[
                                            `referenceDetails[${index}].mobile.number`
                                          ].message
                                        }
                                      </p>
                                    )}
                                </div>
                              </div>

                              <div className="mb-4">
                                <label className={`${inputLabelClassName}`}>
                                  Relationship{" "}
                                  <span className="text-red-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  {...register(
                                    `referenceDetails[${index}].relationship`,
                                    {
                                      required: "Relationship is required",
                                      validate: (value) =>
                                        /^[a-zA-Z\s]*$/.test(value) ||
                                        "Only text is allowed",
                                    }
                                  )}
                                  onInput={(e) => {
                                    e.target.value = e.target.value.replace(
                                      /[^a-zA-Z\s]/g,
                                      ""
                                    );
                                  }}
                                  defaultValue={item.relationship}
                                  className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]
                                    ?.relationship
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                  placeholder="Enter relationship"
                                />
                                {errors.referenceDetails?.[index]
                                  ?.relationship && (
                                    <p className="text-red-500 text-sm">
                                      {
                                        errors.referenceDetails[index]
                                          .relationship?.message
                                      }
                                    </p>
                                  )}
                              </div>

                              <div></div>

                              <div className="w-full flex justify-end items-center">
                                <button
                                  type="button"
                                  className="bg-red-600 text-white p-2 rounded-md text-sm"
                                  onClick={() => remove(index)}
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
                          append({
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

              {(jobData?.status === 'Closed' || jobData?.status === 'closed') && <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"  >
                <img src="/images/closedImage.png" />
              </div>}

              {
                submited && <div className="fixed inset-0 bg-black/5 backdrop-blur-sm text-black text-lg flex flex-col items-center justify-center z-50"  >

                  We'll be in touch soon., Your request has been received., and We'll review your application carefully

                </div>
              }
            </div>
          </section>

          {/* <div className={`w-full h-10 flex flex-row items-center shadow-lg `}>
            <span className="text-header text-lg p-4 ">Application Form</span>

            <div className="   items-end justify-end ">
              <Tooltip placement="topLeft"  title="View Job Description ">
                <button onClick={() => handlJobDescription()}>
                  <IoReorderThree className="text-end text-xl text-header sm:hidden" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className=" flex-1 max-w-full p-5  mt-4 ">
            <div className=" w-full mt-4  ">
              <Progress percent={99.9} strokeColor={twoColors} />
            </div>
            <div className="flex justify-start items-start w-full text-lg mt-4 text-green-500">
              Primary Informations
            </div>
            <div className="w-full flex flex-col justify-center  ">
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="experienceType"
                  control={control}
                  rules={{ required: "Enter your Experience" }}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-evenly",
                        marginTop: "50px",
                        color: "blue",
                      }}
                    >
                      <Radio value={"Intern"}>Intern</Radio>
                      <Radio value={"Fresher"}>Fresher</Radio>
                      <Radio value={"Experience"}>Experience</Radio>
                    </Radio.Group>
                  )}
                />
                {errors.experienceType && (
                  <p className="text-red-500 text-sm">
                    {errors.experienceType.message}
                  </p>
                )}

                <div className="mt-4 flex flex-col">
                  <label className={`${JobPostApplicationLabel}`}>
                    Full Name
                  </label>
                  <input
                    {...register("fullName", {
                      required: "Enter your Full Name",
                    })}
                    type="text"
                    placeholder="Full Name"
                    class={`${JobPostApplicationInput}`}
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-sm">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex flex-col">
                  <label className={`${JobPostApplicationLabel}`}>Email</label>
                  <input
                    {...register("email", {
                      required: "Enter Email",
                    })}
                    type="text"
                    placeholder="Email"
                    class={`${JobPostApplicationInput}`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="w-full mt-4">
                    <label className={`${JobPostApplicationLabel}`}>
                      Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <Controller
                      name="dateOfBirth"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          disabledDate={(current) => {
                            return (
                              current &&
                              current.isAfter(moment().endOf("day"), "day")
                            );
                          }}
                          onChange={(date) => field.onChange(date)}
                          className={`${JobPostApplicationInput} ${
                            errors.recurrence?.date
                              ? "border-[1px] "
                              : "border-gray-300"
                          } `}
                          popupClassName={"!z-[1580]"}
                        />
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-red-500 text-sm">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>

                  <div className="w-ful flex flex-col justify-end">
            <label className={`${JobPostApplicationLabel}`}>Gender</label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Employee is required" }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  options={[
                    { value: "", label: "Select Gender" },
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
    
                  ]}
                  classNamePrefix="react-select"
                  className={`w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-500 hover:border-slate-300 shadow-lg shadow-gray-100 ring-4 ring-transparent focus:ring-slate-100 ${errors.gender ? "border-[1px] " : "border-gray-300"}`}
                  placeholder="Select Employee"
                />
              )}
            />
            {errors.employee && <p className="text-red-500 text-sm">{errors.employee.message}</p>}
          </div>

          
                </div>
                <div className="grid grid-cols-[0.3fr_0.7fr] gap-2">
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>Code</label>
                    <input
                      {...register("code", {
                        required: "Enter Email",
                      })}
                      type="number"
                      placeholder="Code"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.code && (
                      <p className="text-red-500 text-sm">
                        {errors.code.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Phone
                    </label>
                    <input
                      {...register("number", {
                        required: "Enter your Number",
                      })}
                      type="number"
                      placeholder="Phone"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.number && (
                      <p className="text-red-500 text-sm">
                        {errors.number.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-start items-start w-full text-lg mt-5 text-green-500">
                  Carrier Informations
                </div>

                <div className="mt-4 flex flex-col">
                  <label className={`${JobPostApplicationLabel}`}>
                    Year's of Experience
                  </label>
                  <input
                    {...register("experience", {
                      required: "Enter your Experience",
                    })}
                    type="text"
                    placeholder="Year's of Experience"
                    class={`${JobPostApplicationInput}`}
                  />
                  {errors.experience && (
                    <p className="text-red-500 text-sm">
                      {errors.experience.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Current Salary
                    </label>
                    <input
                      {...register("currentSalary", {
                        required: "Enter Current Salary",
                      })}
                      type="number"
                      placeholder="Current Salary"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.currentSalary && (
                      <p className="text-red-500 text-sm">
                        {errors.currentSalary.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Expexted Salary
                    </label>
                    <input
                      {...register("expectedSalary", {
                        required: "Enter Expexted Salary",
                      })}
                      type="number"
                      placeholder="Expexted Salary"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.expectedSalary && (
                      <p className="text-red-500 text-sm">
                        {errors.expectedSalary.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Profile Type
                    </label>
                    <input
                      {...register("profileType", {
                        required: "Enter Profile Type",
                      })}
                      type="text"
                      placeholder="Profile Type"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.profileType && (
                      <p className="text-red-500 text-sm">
                        {errors.profileType.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Previous Profile Type
                    </label>
                    <input
                      {...register("previousProfileType", {
                        required: "Enter Previous Profile Type",
                      })}
                      type="text"
                      placeholder="Previous Profile Type"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.previousProfileType && (
                      <p className="text-red-500 text-sm">
                        {errors.previousProfileType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Previous Company
                    </label>
                    <input
                      {...register("previousCompany", {
                        required: "Enter Previous Company",
                      })}
                      type="text"
                      placeholder="Previous Company"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.previousCompany && (
                      <p className="text-red-500 text-sm">
                        {errors.previousCompany.message}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label className={`${JobPostApplicationLabel}`}>
                      Notice Period (In Days)
                    </label>
                    <input
                      {...register("noticePeriod", {
                        required: "Enter Notice Period ",
                      })}
                      type="text"
                      placeholder="Notice Period"
                      class={`${JobPostApplicationInput}`}
                    />
                    {errors.noticePeriod && (
                      <p className="text-red-500 text-sm">
                        {errors.noticePeriod.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col">
                  <label className={`${JobPostApplicationLabel}`}>
                    Refernce
                  </label>
                  <input
                    {...register("refernce", {
                      required: "Enter Notice Period ",
                    })}
                    type="text"
                    max={10}
                    min={10}
                    placeholder="Reference"
                    class={`${JobPostApplicationInput}`}
                  />
                  {errors.refernce && (
                    <p className="text-red-500 text-sm">
                      {errors.refernce.message}
                    </p>
                  )}
                </div>
                <div>
                  <h2 className={`${JobPostApplicationLabel} mt-4`}>
                    Upload Resume
                  </h2>
                  <Dragger {...props}>
                    <p className="ant-upload-drag-icon"></p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload.
                    </p>
                  </Dragger>
                </div>

                <div className="w-full flex flex-row justify-end">
                  <button
                    type="submit"
                    className="border-2 border-green-700 px-7 py-2 m-7 rounded-lg text-white bg-green-400"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </div> */}
        </div>
      </div>


    </div>
  );
};

export default JobPostApplication;
// !applicationSubmitted ?
//       <section className="">
//         <div className="p-4">
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="grid md:grid-cols-2 grid-cols-1 px-2 gap-2"
//           >

//             <div className="w-full">
//               <Controller
//                 name="profileType"
//                 control={control}

//                 render={({ field }) => (
//                   <Radio.Group
//                     {...field}
//                     onChange={(e) => {
//                       field.onChange(e);

//                     }}
//                     optionType="button"
//                     buttonStyle="solid"
//                     block
//                     defaultValue={"Fresher"}
//                     className={`  ${errors.clientSelection ? "border-[1px] " : "border-gray-300"}`}
//                   >
//                     <Radio value="Fresher">Fresher</Radio>
//                     <Radio value="Intern">Intern</Radio>
//                     <Radio value="Experience">Experience</Radio>
//                   </Radio.Group>
//                 )}
//               />

//               <div className=" ">
//                 <div className={`grid ${watch("profileType") === "Experience" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
//                   } md:gap-8 gap-4 md:my-6 my-3 px-3`}>
//                       <div
//               className={`${watch("profileType") === "Experience" ? "col-span-1 md:col-span-3" : "col-span-1 md:col-span-2"
//               } relative w-[100px] h-[100px] mx-auto rounded-full border-2 border-slate-600  flex items-center justify-center`}
//               onMouseEnter={() => setIsHovering(true)}
//               onMouseLeave={() => setIsHovering(false)}
//             >
//               <div
//                 className={`w-full  h-full rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}
//                 style={{
//                   backgroundImage: `url(${profileImage || ""})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {!profileImage && (
//                   <FaUserAlt className="text-header w-[50px] h-[40px] cursor-pointer" />
//                 )}
//               </div>

//               {isHovering && !profileImage && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
//                   <FaCamera className="text-white w-[20px] h-[20px] cursor-pointer" />
//                 </div>
//               )}

//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChangeProfile}
//                 className="absolute inset-0 opacity-0 cursor-pointer"
//               />
//             </div>
//                   <div className="">
//                     <label className={`${inputLabelClassName}`}>
//                       Name <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       {...register("fullName", {
//                         required: "Name is required",
//                       })}
//                       className={`placeholder: ${JobPostApplicationInput} ${errors.fullName
//                         ? "border-[1px] "
//                         : "border-gray-300"
//                         }`}
//                       placeholder="Enter Name"
//                     />
//                     {errors.fullName && (
//                       <p className="text-red-500 text-sm">
//                         {errors.fullName.message}
//                       </p>
//                     )}
//                   </div>

//                   {watch("profileType") === "Experience" && (
//                     <>

//                       <div>
//                         <label className={`${inputLabelClassName}`}>Total Experience (Months)</label>
//                         <input
//                           type="number"
//                           {...register("totalExp", {
//                             required: "Experience in Years is required",
//                             min: { value: 1, message: "Experience must be at least 1 month" },
//                           })}
//                           className={` ${JobPostApplicationInput} ${errors.totalExp ? "border-[1px] " : "border-gray-300"}`}
//                           placeholder="Enter experience in Years"
//                         />
//                         {errors.totalExp && (
//                           <p className="text-red-500 text-sm">{errors.totalExp.message}</p>
//                         )}
//                       </div>

//                       <div>
//                         <label className={`${inputLabelClassName}`}>Relevant Experience (Months)</label>
//                         <input
//                           type="number"
//                           {...register("totalReleventExp", {
//                             required: "Experience in Years is required",
//                             min: { value: 1, message: "Experience must be at least 1 month" },
//                           })}
//                           className={` ${JobPostApplicationInput} ${errors.totalReleventExp ? "border-[1px] " : "border-gray-300"}`}
//                           placeholder="Enter experience in Years"
//                         />
//                         {errors.totalReleventExp && (
//                           <p className="text-red-500 text-sm">{errors.totalReleventExp.message}</p>
//                         )}
//                       </div>

//                       <div className="">
//                         <label className={`${inputLabelClassName}`}>
//                           Current Job Title <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           {...register("previousJobTitle", {
//                             required: "Current job title is required",
//                           })}
//                           className={`placeholder: ${JobPostApplicationInput} ${errors.previousJobTitle
//                             ? "border-[1px] "
//                             : "border-gray-300"
//                             }`}
//                           placeholder="Enter Current job title"
//                         />
//                         {errors.previousJobTitle && (
//                           <p className="text-red-500 text-sm">
//                             {errors.previousJobTitle.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="">
//                         <label className={`${inputLabelClassName}`}>
//                           Current Company <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           {...register("previousCompanyName", {
//                             required: "Current company name is required",
//                           })}
//                           className={`placeholder: ${JobPostApplicationInput} ${errors.previousCompanyName
//                             ? "border-[1px] "
//                             : "border-gray-300"
//                             }`}
//                           placeholder="Enter Current company name"
//                         />
//                         {errors.previousCompanyName && (
//                           <p className="text-red-500 text-sm">
//                             {errors.previousCompanyName.message}
//                           </p>
//                         )}
//                       </div>

//                       <div className="">
//                         <label className={`${inputLabelClassName}`}>
//                           Current Salary <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           {...register("currentSalary", {
//                             required: "Current Salary is required",
//                             pattern: {
//                               value: /^\d+(\.\d+)?$/,
//                               message: "Please enter a valid number",
//                             },
//                           })}
//                           onInput={(e) => {
//                             // Allow only numbers and a single dot
//                             e.target.value = e.target.value.replace(/[^0-9.]/g, "");
//                             // Ensure only one dot is present
//                             if ((e.target.value.match(/\./g) || []).length > 1) {
//                               e.target.value = e.target.value.slice(0, -1);
//                             }
//                           }}
//                           className={`${JobPostApplicationInput} ${errors.currentSalary ? "border-[1px] " : "border-gray-300"
//                             }`}
//                           placeholder="Enter Current Salary"
//                         />
//                         {errors.currentSalary && (
//                           <p className="text-red-500 text-sm">{errors.currentSalary.message}</p>
//                         )}
//                       </div>

//                       <div className="">
//                         <label className={`${inputLabelClassName}`}>
//                           Expected Salary <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           {...register("expectedSalary", {
//                             required: "Expected salary is required",
//                             pattern: {
//                               value: /^\d+(\.\d+)?$/,
//                               message: "Only numeric or decimal values are allowed",
//                             },
//                           })}
//                           onInput={(e) => {
//                             e.target.value = e.target.value.replace(/[^0-9.]/g, "");
//                             if ((e.target.value.match(/\./g) || []).length > 1) {
//                               e.target.value = e.target.value.slice(0, -1);
//                             }
//                           }}
//                           className={`placeholder: ${JobPostApplicationInput} ${errors.expectedSalary ? "border-[1px] " : "border-gray-300"
//                             }`}
//                           placeholder="Enter Expected salary"
//                         />
//                         {errors.expectedSalary && (
//                           <p className="text-red-500 text-sm">{errors.expectedSalary.message}</p>
//                         )}
//                       </div>

//                       <div className="">
//                         <label className={`${inputLabelClassName}`}>
//                           Notice Period (Days) <span className="text-red-600">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           {...register("noticePeriodDays", {
//                             required: "Notice period is required",
//                           })}
//                           className={`placeholder: ${JobPostApplicationInput} ${errors.noticePeriodDays ? "border-[1px] " : "border-gray-300"
//                             }`}
//                           placeholder="Enter notice period"
//                           onKeyDown={(e) => {
//                             if (e.key === "." || e.key === "e") {
//                               e.preventDefault();
//                             }
//                           }}
//                         />
//                         {errors.noticePeriodDays && (
//                           <p className="text-red-500 text-sm">
//                             {errors.noticePeriodDays.message}
//                           </p>
//                         )}
//                       </div>

//                     </>
//                   )}
//                   <div className="">
//                     <label className={`${inputLabelClassName}`}>
//                       Location <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       {...register("location", {
//                         required: "Location is required",
//                       })}
//                       className={`placeholder: ${JobPostApplicationInput} ${errors.location ? "border-[1px] " : "border-gray-300"
//                         }`}
//                       placeholder="Enter location"
//                     />
//                     {errors.location && (
//                       <p className="text-red-500 text-sm">
//                         {errors.location.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 px-3">
//                   <div className="">
//                     <label className={`${inputLabelClassName}`}>
//                       Email<span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       {...register("email", {
//                         required: "Email is required",
//                         pattern: {
//                           value:
//                             /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//                           message: "Please enter a valid email address",
//                         },
//                       })}
//                       className={` ${JobPostApplicationInput} ${errors.email ? "border-[1px] " : "border-gray-300"
//                         }`}
//                       placeholder="Enter Email"
//                     />
//                     {errors.email && (
//                       <p className="text-red-500 text-sm">
//                         {errors.email.message}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex gap-3">
//                     <div className="w-[150px]">
//                       <label className={`${inputLabelClassName}`}>
//                         code<span className="text-red-600">*</span>
//                       </label>
//                       <Controller
//                         control={control}
//                         name="PDmobileCode"
//                         rules={{ required: "code is required" }}
//                         render={({ field }) => (
//                           <AutoComplete
//                             {...field}
//                             onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
//                             options={[
//                               { value: '+91' },
//                               { value: '+01' },
//                               { value: '+92' },
//                               { value: '+41' },
//                               { value: '+51' },
//                             ]}
//                           >
//                             <input

//                               className={`${JobPostApplicationInput} ${errors.PDState
//                                 ? "border-[1px] "
//                                 : "border-gray-300"
//                                 }`}
//                             />
//                           </AutoComplete>
//                         )}
//                       />
//                       {errors[`PDmobileCode`] && (
//                         <p className={`${inputerrorClassNameAutoComplete}`}>
//                           {errors[`PDmobileCode`].message}
//                         </p>
//                       )}
//                     </div>
//                     <div className="w-full">
//                       <label className={`${inputLabelClassName}`}>
//                         Mobile No<span className="text-red-600">*</span>
//                       </label>
//                       <input
//                         type="number"
//                         {...register(`PDMobileNo`, {
//                           required: "Mobile No is required",
//                           minLength: {
//                             value: 10,
//                             message: "Must be exactly 10 digits",
//                           },
//                           maxLength: {
//                             value: 10,
//                             message: "Must be exactly 10 digits",
//                           },
//                         })}
//                         className={` ${JobPostApplicationInput} ${errors[`PDMobileNo`]
//                           ? "border-[1px] "
//                           : "border-gray-300"
//                           }`}
//                         placeholder="Enter Mobile No"
//                         maxLength={10}
//                         onInput={(e) => {
//                           if (e.target.value.length > 10) {
//                             e.target.value = e.target.value.slice(0, 10);
//                           }
//                         }}
//                       />
//                       {errors[`PDMobileNo`] && (
//                         <p className="text-red-500 text-sm">
//                           {errors[`PDMobileNo`].message}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div>
//                     <label className={`${inputLabelClassName}`}>
//                       Gender <span className="text-red-600">*</span>
//                     </label>
//                     <select
//                       {...register("gender", {
//                         required: "Gender is required",
//                       })}
//                       className={`mt-0 ${JobPostApplicationInput} ${errors.gender ? "border-[1px] " : "border-gray-300"
//                         }`}
//                     >
//                       <option value="">Select Gender</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                     {errors.gender && (
//                       <p className="text-red-500 text-sm">
//                         {errors.gender.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="">
//                     <label className={`${inputLabelClassName}`}>
//                       Date of Birth <span className="text-red-600">*</span>
//                     </label>
//                     <Controller
//                       name="dateOfBirth"
//                       control={control}
//                       render={({ field }) => (
//                         <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
//                           return current && current.isAfter(moment().endOf('day'), 'day');
//                         }} />
//                       )}
//                     />
//                     {errors.dateOfBirth && (
//                       <p className="text-red-500 text-sm">
//                         {errors.dateOfBirth.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <label className={`${inputLabelClassName}`}>
//                       Marital Status <span className="text-red-600">*</span>
//                     </label>
//                     <select
//                       {...register("maritalStatus", {
//                         required: "Marital status is required",
//                       })}
//                       className={`mt-0 ${JobPostApplicationInput} ${errors.maritalStatus
//                         ? "border-[1px] "
//                         : "border-gray-300"
//                         }`}
//                     >
//                       <option value="">Select Marital Status</option>
//                       <option value="Single">Single</option>
//                       <option value="Married">Married</option>
//                       <option value="Divorced">Divorced</option>
//                     </select>
//                     {errors.maritalStatus && (
//                       <p className="text-red-500 text-sm">
//                         {errors.maritalStatus.message}
//                       </p>
//                     )}
//                   </div>

//                   <div className="">
//                     <label htmlFor="fileInput" className={`${inputLabelClassName}`}>
//                       Upload Resume <span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       id="fileInput"
//                       accept=".pdf"
//                       name="fileInput"
//                       {...register("fileInput", {
//                         required: "File is required",
//                         validate: {
//                           fileSize: (file) => file[0]?.size <= 2 * 1024 * 1024 || "File size should not exceed 2 MB",
//                         }
//                       })}

//                       onChange={handleFileChange}
//                       className={`h-12 ${JobPostApplicationInput} ${errors.fileInput ? "border-[1px] " : "border-gray-300"
//                         }`}
//                     />
//                     {errors.fileInput && (
//                       <p className="text-red-500 text-sm">{errors.fileInput.message}</p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:my-1 px-3 md:mt-4">
//                   <div className="col-span-2">
//                     <label className={`${inputLabelClassName}`}>
//                       Primary Address<span className="text-red-600">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       {...register("PDAddress", {
//                         required: "Address  is required",
//                       })}
//                       className={`${JobPostApplicationInput} ${errors.PDAddress ? "border-[1px] " : "border-gray-300"
//                         }`}
//                       placeholder="Enter Address "
//                     />
//                     {errors.PDAddress && (
//                       <p className="text-red-500 text-sm">
//                         {errors.PDAddress.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-3 md:my-1 px-3">
//                   <div>
//                     <div className={`${inputLabelClassName}`}>
//                       Country <span className="text-red-600">*</span>
//                     </div>
//                     <Controller
//                       control={control}
//                       name="PDCountry"
//                       rules={{ required: "Country is required" }}
//                       render={({ field }) => (
//                         <AutoComplete
//                           className="w-full"
//                           {...field}
//                           onChange={(value) => {
//                             // Directly handle country change by using setValue from React Hook Form
//                             field.onChange(value); // Update the value in the form control
//                           }}

//                         >
//                           <input
//                             placeholder="Enter Country"

//                             className={`${JobPostApplicationInput} ${errors.PDCountry
//                               ? "border-[1px] "
//                               : "border-gray-300"
//                               }`}
//                           />
//                         </AutoComplete>
//                       )}
//                     />
//                     {errors.PDCountry && (
//                       <p className={`${inputerrorClassNameAutoComplete}`}>
//                         {errors.PDCountry.message}
//                       </p>
//                     )}
//                   </div>
//                   <div>
//                     <div className={`${inputLabelClassName}`}>
//                       State <span className="text-red-600">*</span>
//                     </div>
//                     <Controller
//                       control={control}
//                       name="PDState"
//                       rules={{ required: "State is required" }}
//                       render={({ field }) => (
//                         <AutoComplete
//                           className="w-full"
//                           {...field}
//                           onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange

//                         >
//                           <input
//                             placeholder="Enter State"

//                             className={`${JobPostApplicationInput} ${errors.PDState
//                               ? "border-[1px] "
//                               : "border-gray-300"
//                               }`}
//                           />
//                         </AutoComplete>
//                       )}
//                     />
//                     {errors.PDState && (
//                       <p className={`${inputerrorClassNameAutoComplete}`}>
//                         {errors.PDState.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* City Field */}
//                   <div>
//                     <div className={`${inputLabelClassName}`}>
//                       City <span className="text-red-600">*</span>
//                     </div>
//                     <Controller
//                       control={control}
//                       name="PDCity"
//                       rules={{ required: "City is required" }}
//                       render={({ field }) => (
//                         <AutoComplete
//                           className="w-full"
//                           {...field}
//                           onChange={(value) => field.onChange(value)} // Directly handle city change using React Hook Form's field.onChange

//                         >
//                           <input

//                             placeholder="Enter City"
//                             className={`${JobPostApplicationInput} ${errors.PDCity
//                               ? "border-[1px] "
//                               : "border-gray-300"
//                               }`}
//                           />
//                         </AutoComplete>
//                       )}
//                     />
//                     {errors.PDCity && (
//                       <p className={`${inputerrorClassNameAutoComplete}`}>
//                         {errors.PDCity.message}
//                       </p>
//                     )}
//                   </div>

//                   {/* Pin Code Field */}
//                   <div>
//                     <label className={`${inputLabelClassName}`}>
//                       Pin Code <span className="text-red-600">*</span>
//                     </label>
//                     <Controller
//                       control={control}
//                       name="PDPinCode"
//                       rules={{ required: "Pin Code is required" }}
//                       render={({ field }) => (
//                         <input
//                           {...field}
//                           type="number"
//                           placeholder="Enter Pin Code"
//                           maxLength={6}
//                           onInput={(e) => {
//                             if (e.target.value.length > 6) {
//                               e.target.value = e.target.value.slice(0, 6);
//                             }
//                           }}
//                           className={`${JobPostApplicationInput} ${errors.PDPinCode
//                             ? "border-[1px] "
//                             : "border-gray-300"
//                             }`}
//                         />
//                       )}
//                     />
//                     {errors.PDPinCode && (
//                       <p className="text-red-500 text-sm">
//                         {errors.PDPinCode.message}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//                 <div className="px-3 pt-1">
//                   {fields.map((item, index) => (
//                     <div
//                       key={item.id}
//                       className="my-2 border border-gray-300 rounded-md"
//                     >
//                       <button
//                         type="button"
//                         onClick={() => toggleAccordion(index)}
//                         className="w-full flex items-center justify-between p-2 bg-header rounded-t-md text-left"
//                       >
//                         <span className="font-semibold text-sm text-white">
//                           Reference {index + 1}
//                         </span>

//                         {activeIndex === index ? (
//                           <FaChevronUp className="text-white" />
//                         ) : (
//                           <FaChevronDown className="text-white" />
//                         )}
//                       </button>

//                       <div
//                         className={`px-4 rounded-md transition-all duration-300 overflow-hidden ${activeIndex === index
//                           ? "max-h-screen py-2"
//                           : "max-h-0 py-0"
//                           }`}
//                       >
//                         <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 px-3 md:mt-4">
//                           <div className="mb-2">
//                             <label className={`${inputLabelClassName}`}>
//                               Name <span className="text-red-600">*</span>
//                             </label>
//                             <input
//                               type="text"
//                               {...register(`referenceDetails[${index}].name`, {
//                                 required: "Name is required",
//                               })}
//                               defaultValue={item.name}
//                               className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]?.name
//                                 ? "border-[1px] "
//                                 : "border-gray-300"
//                                 }`}
//                               placeholder="Enter name"
//                             />
//                             {errors.referenceDetails?.[index]?.name && (
//                               <p className="text-red-500 text-sm">
//                                 {errors.referenceDetails[index].name?.message}
//                               </p>
//                             )}
//                           </div>

//                           <div className="mb-2">
//                             <label className={`${inputLabelClassName}`}>
//                               Email <span className="text-red-600">*</span>
//                             </label>
//                             <input
//                               type="email"
//                               {...register(`referenceDetails[${index}].email`, {
//                                 required: "Email is required",
//                               })}
//                               defaultValue={item.email}
//                               className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]?.email
//                                 ? "border-[1px] "
//                                 : "border-gray-300"
//                                 }`}
//                               placeholder="Enter email"
//                             />
//                             {errors.referenceDetails?.[index]?.email && (
//                               <p className="text-red-500 text-sm">
//                                 {errors.referenceDetails[index].email?.message}
//                               </p>
//                             )}
//                           </div>
//                           <div className="flex gap-3">
//                             <div className="w-[150px]">
//                               <label className={`${inputLabelClassName}`}>
//                                 code<span className="text-red-600">*</span>
//                               </label>
//                               <Controller
//                                 control={control}
//                                 name={`referenceDetails[${index}].mobile.code`}
//                                 rules={{ required: "code is required" }}
//                                 render={({ field }) => (
//                                   <AutoComplete
//                                     {...field}
//                                     onChange={(value) => field.onChange(value)} // Directly handle state change using React Hook Form's field.onChange
//                                     options={[
//                                       { value: '+91' },
//                                       { value: '+01' },
//                                       { value: '+92' },
//                                       { value: '+41' },
//                                       { value: '+51' },
//                                     ]}
//                                   >
//                                     <input

//                                       className={`${JobPostApplicationInput} ${errors.PDState
//                                         ? "border-[1px] "
//                                         : "border-gray-300"
//                                         }`}
//                                     />
//                                   </AutoComplete>
//                                 )}
//                               />
//                               {errors[`referenceDetails[${index}].mobile.code`] && (
//                                 <p className={`${inputerrorClassNameAutoComplete}`}>
//                                   {errors[`referenceDetails[${index}].mobile.code`].message}
//                                 </p>
//                               )}
//                             </div>
//                             <div className="w-full">
//                               <label className={`${inputLabelClassName}`}>
//                                 Mobile No<span className="text-red-600">*</span>
//                               </label>
//                               <input
//                                 type="number"
//                                 {...register(`referenceDetails[${index}].mobile.number`, {
//                                   required: "Mobile No is required",
//                                   minLength: {
//                                     value: 10,
//                                     message: "Must be exactly 10 digits",
//                                   },
//                                   maxLength: {
//                                     value: 10,
//                                     message: "Must be exactly 10 digits",
//                                   },
//                                 })}
//                                 className={` ${JobPostApplicationInput} ${errors[`PDMobileNo`]
//                                   ? "border-[1px] "
//                                   : "border-gray-300"
//                                   }`}
//                                 placeholder="Enter Mobile No"
//                                 maxLength={10}
//                                 onInput={(e) => {
//                                   if (e.target.value.length > 10) {
//                                     e.target.value = e.target.value.slice(0, 10);
//                                   }
//                                 }}
//                               />
//                               {errors[`referenceDetails[${index}].mobile.number`] && (
//                                 <p className="text-red-500 text-sm">
//                                   {errors[`referenceDetails[${index}].mobile.number`].message}
//                                 </p>
//                               )}
//                             </div>
//                           </div>

//                           <div className="mb-4">
//                             <label className={`${inputLabelClassName}`}>
//                               Relationship <span className="text-red-600">*</span>
//                             </label>
//                             <input
//                               type="text"
//                               {...register(
//                                 `referenceDetails[${index}].relationship`,
//                                 {
//                                   required: "Relationship is required",
//                                   validate: (value) =>
//                                     /^[a-zA-Z\s]*$/.test(value) || "Only text is allowed",
//                                 }
//                               )}
//                               onInput={(e) => {
//                                 e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "");
//                               }}
//                               defaultValue={item.relationship}
//                               className={` ${JobPostApplicationInput} ${errors.referenceDetails?.[index]?.relationship
//                                 ? "border-[1px] "
//                                 : "border-gray-300"
//                                 }`}
//                               placeholder="Enter relationship"
//                             />
//                             {errors.referenceDetails?.[index]?.relationship && (
//                               <p className="text-red-500 text-sm">
//                                 {
//                                   errors.referenceDetails[index].relationship
//                                     ?.message
//                                 }
//                               </p>
//                             )}
//                           </div>

//                           <div></div>

//                           <div className="w-full flex justify-end items-center">
//                             <button
//                               type="button"
//                               className="bg-red-600 text-white p-2 rounded-md text-sm"
//                               onClick={() => remove(index)}
//                             >
//                               Remove
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="flex justify-between px-3 py-2">
//                   <button
//                     type="button"
//                     className="bg-header text-white px-2 py-1 rounded-md mt-2 text-sm"
//                     onClick={() =>
//                       append({
//                         name: "",
//                         email: "",
//                         mobile: { code: "", number: "" },
//                         relationship: "",
//                       })
//                     }
//                   >
//                     Add Reference
//                   </button>
//                 </div>

//               </div>
//               <div className="flex justify-between px-3 pb-2">
//                 <button type="Submit" className={`${formButtonClassName}`}>
//                   Submit Details
//                 </button>
//               </div>
//             </div>
//             <div>
//               <div className=" mx-auto p-5 bg-white rounded-md  text-gray-800">
//                 <h2 className="text-lg font-semibold border-b pb-2 mb-3">Position Overview</h2>
//                 <p className="mb-3 font-medium">{jobData?.title}</p>
//                 <p>Location: <span className="font-medium">{jobData?.location}</span></p>

//                 <h3 className="text-md font-semibold mt-4">Description</h3>
//                 <div className="text-sm" dangerouslySetInnerHTML={{ __html: jobData?.description }} />

//                 <h3 className="text-md font-semibold mt-4">Key Responsibilities</h3>
//                 <ul className="list-disc pl-4 text-sm">
//                   {jobData?.requiredSkills.map((skill, index) => (
//                     <li key={index}>{skill}</li>
//                   ))}
//                 </ul>

//                 <h3 className="text-md font-semibold mt-4">Job Details</h3>
//                 <p>Profile Type: <span className="font-medium">{jobData?.profileType}</span></p>
//                 <p>Employment Type: <span className="font-medium">{jobData?.employmentType}</span></p>
//                 <p>Experience Required: <span className="font-medium">{jobData?.experienceRange.min} - {jobData?.experienceRange.max} years</span></p>
//                 <p>Vacancies: <span className="font-medium">{jobData?.noOfVacancy}</span></p>
//                 <p>Immediate Joiner: <span className="font-medium">{jobData?.isImmediateJoiner ? "Yes" : "No"}</span></p>

//                 <h3 className="text-md font-semibold mt-4">Salary Range</h3>
//                 <p className="font-medium">{jobData?.salaryRange.min} - {jobData?.salaryRange.max} {jobData?.salaryRange.currency}</p>
//               </div>
//             </div>
//           </form>
//         </div>
//       </section>
//       :(
//       <div className="fixed  flex justify-center items-center ">
//         form submitted successfully
//       </div>)
