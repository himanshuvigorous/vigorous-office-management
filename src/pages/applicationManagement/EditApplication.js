import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReactSelect from "react-select";
import {
  domainName,
  formButtonClassName,
  getLocationDataByPincode,
  inputAntdSelectClassName,
  inputClassName,
  inputerrorClassNameAutoComplete,
  inputLabelClassName,
} from "../../constents/global";
import { useNavigate, useParams } from "react-router-dom";
import {
  createApplication,
  getApplicationDetails,
  updateApplicationFunc,
} from "./applicationFeatures/_application_reducers";
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
  message,
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
import getUserIds from "../../constents/getUserIds";
import { jobPostSearch } from "../hr/RecruitmentProcess/JobPost/JobPostFeatures/_job_post_reducers";
import dayjs from "dayjs";
import CustomMobileCodePicker from "../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../global_layouts/Loader";
import Loader2 from "../../global_layouts/Loader/Loader2";
import ImageUploader from "../../global_layouts/ImageUploader/ImageUploader";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
const EditApplication = () => {
  const { applicationIdEnc } = useParams();
  const applicationId = decrypt(applicationIdEnc);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const [editPageLoader, setEditPageLoader] = useState(true);
  const { applicationDetails } = useSelector((state) => state.application);
  const { loading: applicationLoader } = useSelector(
    (state) => state.application
  );

  const { jobPostData } = useSelector((state) => state.jobPost);
  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fileInput: `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${applicationDetails?.resumeUrl}`,
    },
  });

  const PrintPincode = useWatch({
    control,
    name: "PDPinCode",
    defaultValue: "",
  });
  const jobPostId = useWatch({
    control,
    name: "jobPostId",
    defaultValue: "",
  });
  const [fileList, setFileList] = useState([]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "referenceDetails",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePayload, setProfileImagePayload] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const dispatch = useDispatch();
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (!file || file.length === 0) {
  //     return;
  //   }
  //   if (file.size > 2 * 1024 * 1024) {
  //     return setError("fileInput", {
  //       type: "manual",
  //       message: "File size should not exceed 2 MB",
  //     });
  //   }

  //   dispatch(
  //     fileUploadFunc({
  //       filePath: file,
  //       isVideo: false,
  //       isMultiple: false,
  //     })
  //   ).then((res) => {
  //     setSelectedFile(res?.payload?.data);
  //   });

  //   if (file) {
  //   }
  // };
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

    // Update React Hook Form state
    onChange(file);
  };

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
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await dispatch(countrySearch({ text: "", sort: true, status: true, isPagination: false }));
        // await dispatch(stateSearch({ text: "", sort: true, status: true, isPagination: false }));
        // await dispatch(citySearch({ text: "", sort: true, status: true, isPagination: false }));
        // // await dispatch(getEmployeeDocument());
        const reqData = {
          _id: applicationId,
        };
        await dispatch(getApplicationDetails(reqData)).then(() => {
          setEditPageLoader(false);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (applicationDetails) {
      setValue("profileType", applicationDetails?.profileType);
      setValue("experienceInMonths", applicationDetails?.experienceInMonths);
      setValue("fullName", applicationDetails?.fullName);
      setSelectedFile(applicationDetails?.resumeUrl);
      setValue("email", applicationDetails?.email);
      setValue("PDmobileCode", applicationDetails?.mobile?.code);
      setValue("PDMobileNo", applicationDetails?.mobile?.number);
      setValue("previousJobTitle", applicationDetails?.previousJobTitle);
      setValue("previousCompanyName", applicationDetails?.previousCompanyName);
       setValue("knowUs", applicationDetails?.jobRefrenceFrom);
      setValue(
        "PDPreviousmobileCode",
        applicationDetails?.previousHRNumber?.code
      );
      setValue(
        "PDPreviousMobileNo",
        applicationDetails?.previousHRNumber?.number
      );
      setValue("previousCompanyAddress", applicationDetails?.previousCompAdd);
      setValue("currentSalary", applicationDetails?.currentSalary);
      setValue("expectedSalary", applicationDetails?.expectedSalary);
      setValue("noticePeriodDays", applicationDetails?.noticePeriodDays);
      setValue("totalExp", applicationDetails?.totalExp);
      setValue("totalReleventExp", applicationDetails?.totalReleventExp);
      setValue("noticePeriod", applicationDetails?.noticePeriodDays);
      setValue("dateOfBirth", dayjs(applicationDetails?.dateOfBirth));
      setValue("gender", applicationDetails?.gender);
      setValue("maritalStatus", applicationDetails?.maritalStatus);

      setValue("PDAddress", applicationDetails?.address?.street);
      setValue("PDCity", applicationDetails?.address?.city);
      setValue("PDState", applicationDetails?.address?.state);
      setValue("PDCountry", applicationDetails?.address?.country);
      setValue("PDPinCode", applicationDetails?.address?.pinCode);
      setValue("ProfileImage", applicationDetails?.profileImage);
      setValue("referenceDetails", []);

      const fullUrl = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${
        applicationDetails?.resumeUrl || ""
      }`;

      if (applicationDetails?.resumeUrl) {
        const fileName = applicationDetails.resumeUrl.split("/").pop();

        setFileList([
          {
            uid: "-1",
            name: fileName,
            status: "done",
            url: fullUrl,
          },
        ]);
      } else {
        setFileList([]);
      }

      applicationDetails?.referenceDetails?.forEach((reference, index) => {
        setActiveIndex([...activeIndex, index]);
        const formattedreferenceDetail = {
          ...reference,
        };
        append(formattedreferenceDetail);
      });

      // if (applicationDetails?.experienceInMonths) {
      //   setIsExperience(true);
      // }
    }
  }, [applicationDetails]);

  const onSubmit = async (data, errors) => {
    const finalPayload = {
      _id: applicationId,
      jobId: jobPostId,
      employeId: "",
      companyId: applicationDetails?.companyId,
      directorId: applicationDetails?.directorId,
      branchId: applicationDetails?.branchId,
      departmentId: applicationDetails?.departmentId,
      designationId: applicationDetails?.designationId,
      profileType: data?.profileType,
      currentSalary: +data?.currentSalary,
      expectedSalary: +data?.expectedSalary,
      fullName: data?.fullName,
      jobRefrenceFrom: data?.knowUs,
      email: data?.email,
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
      profileImage: data?.ProfileImage,
    };
    dispatch(updateApplicationFunc(finalPayload)).then((response) => {
      if (!response?.error) {
        navigate(-1);
      }
    });
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
    <GlobalLayout>
      {editPageLoader ? (
        <div className="h-screen w-full flex justify-center items-center">
          <Loader2 />
        </div>
      ) : (
        <div className="">
          <section className="">
            <div className="">
              <form
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
                className=" px-2 gap-2"
              >
                <div
                  className={`grid ${
                    watch("profileType") === "Experience"
                      ? "grid-cols-1 md:grid-cols-3"
                      : "grid-cols-1 md:grid-cols-2"
                  } md:gap-8 gap-4  md:my-6 my-3 px-3`}
                >
                  <div
                    className={`${
                      watch("profileType") === "Experience"
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

                    {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChangeProfile}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                /> */}
                    <Controller
                      name="ProfileImage"
                      control={control}
                      rules={{required:'Enter Profile Image'}}
                      render={({ field }) => (
                        <ImageUploader
                          setValue={setValue}
                          name="image"
                          field={field}
                          error={errors.ProfileImage}
                        />
                      )}
                    />
                  </div>
                </div>
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
                      className={`  ${
                        errors.clientSelection
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


                   <div>
                                                        <label className={`${inputLabelClassName}`}>
                                                          Profile Type <span className="text-red-600">*</span>
                                                        </label>
                                                      <Controller
                                  name="profileType"
                                  control={control}
                                  rules={{required:'Enter Profile Type'}}
                                  
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      placeholder="Select Profile Type"
                                      
                                      onChange={(value) => field.onChange(value)}
                                      defaultValue=""
                                      className={`w-full h-9 ${inputAntdSelectClassName}`}
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

                <div className=" ">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 gap-4">
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        {...register("fullName", {
                          required: "Name is required",
                        })}
                        className={`placeholder: ${inputClassName} ${
                          errors.fullName ? "border-[1px] " : "border-gray-300"
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
                            Total Experience (Years){" "}
                            <span className="text-red-600"> *</span>
                          </label>
                          <input
                            type="number"
                            {...register("totalExp", {
                              required: "Experience in years is required",
                              min: {
                                value: 1,
                                message: "Experience must be at least 1 month",
                              },
                            })}
                            className={` ${inputClassName} ${
                              errors.totalExp
                                ? "border-[1px] "
                                : "border-gray-300"
                            }`}
                            placeholder="Enter experience in years"
                          />
                          {errors.totalExp && (
                            <p className="text-red-500 text-sm">
                              {errors.totalExp.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className={`${inputLabelClassName}`}>
                            Relevant Experience (Years){" "}
                            <span className="text-red-600"> *</span>
                          </label>
                          <input
                            type="number"
                            {...register("totalReleventExp", {
                              required: "Experience in years is required",
                              min: {
                                value: 1,
                                message: "Experience must be at least 1 month",
                              },
                            })}
                            className={` ${inputClassName} ${
                              errors.totalReleventExp
                                ? "border-[1px] "
                                : "border-gray-300"
                            }`}
                            placeholder="Enter experience in years"
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
                            className={`placeholder: ${inputClassName} ${
                              errors.previousJobTitle
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
                            <span className="text-red-600"> *</span>
                          </label>
                          <input
                            type="text"
                            {...register("previousCompanyName", {
                              required: "Current company name is required",
                            })}
                            className={`placeholder: ${inputClassName} ${
                              errors.previousCompanyName
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
                            Current Company Address{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <input
                            type="text"
                            {...register("previousCompanyAddress", {
                              required: "Current company Address is required",
                            })}
                            className={`placeholder: ${inputClassName} ${
                              errors.previousCompanyAddress
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
                              <p
                                className={`${inputerrorClassNameAutoComplete}`}
                              >
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
                              className={` ${inputClassName} ${
                                errors[`PDPreviousMobileNo`]
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
                            <span className="text-red-600"> *</span>
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
                            className={`${inputClassName} ${
                              errors.currentSalary
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
                            <span className="text-red-600"> *</span>
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
                            className={`placeholder: ${inputClassName} ${
                              errors.expectedSalary
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
                            <span className="text-red-600"> *</span>
                          </label>
                          <input
                            type="number"
                            {...register("noticePeriodDays", {
                              required: "Notice period is required",
                            })}
                            className={`placeholder: ${inputClassName} ${
                              errors.noticePeriodDays
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
                    {/* <div className="">
                <label className={`${inputLabelClassName}`}>
                  Location <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={`placeholder: ${inputClassName} ${
                    errors.location ? "border-[1px] " : "border-gray-300"
                  }`}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm">
                    {errors.location.message}
                  </p>
                )}
              </div> */}
                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Email<span className="text-red-600"> *</span>
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
                        className={` ${inputClassName} ${
                          errors.email ? "border-[1px] " : "border-gray-300"
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
                      <div className="w-[150px]">
                        <label className={`${inputLabelClassName}`}>
                          code<span className="text-red-600"> *</span>
                        </label>
                        <Controller
                          control={control}
                          name="PDmobileCode"
                          rules={{ required: "code is required" }}
                          render={({ field }) => (
                            <CustomMobileCodePicker
                              field={field}
                              errors={errors}
                            />
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
                          Mobile No<span className="text-red-600"> * </span>
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
                          className={` ${inputClassName} ${
                            errors[`PDMobileNo`]
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
                      <Controller
                        name="gender"
                        control={control}
                        rules={{
                          required: "Gender is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={` ${inputAntdSelectClassName} ${
                              errors.gender
                                ? "border-[1px] "
                                : "border-gray-300"
                            }`}
                            placeholder="Select Gender"
                            showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          >
                            <Select.Option value="">
                              Select Gender
                            </Select.Option>
                            <Select.Option value="Male">Male</Select.Option>
                            <Select.Option value="Female">Female</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                          </Select>
                        )}
                      />

                      {errors.gender && (
                        <p className="text-red-500 text-sm">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>

                    <div className="">
                      <label className={`${inputLabelClassName}`}>
                        Date of Birth <span className="text-red-600"> *</span>
                      </label>
                      <Controller
                        name="dateOfBirth"
                        control={control}
                        rules={{
                          required: "Date of Birth is required",
                        }}
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
                        Marital Status <span className="text-red-600"> *</span>
                      </label>
                      <Controller
                        name="maritalStatus"
                        control={control}
                        rules={{
                          required: "Marital status is required",
                        }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            className={` ${inputAntdSelectClassName} ${
                              errors.maritalStatus
                                ? "border-[1px] "
                                : "border-gray-300"
                            }`}
                            placeholder="Select Marital Status"
                            showSearch
                          filterOption={(input, option) =>
                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                          }
                          >
                            <Select.Option value="">
                              Select Marital Status
                            </Select.Option>
                            <Select.Option value="Single">Single</Select.Option>
                            <Select.Option value="Married">
                              Married
                            </Select.Option>
                            <Select.Option value="Divorced">
                              Divorced
                            </Select.Option>
                          </Select>
                        )}
                      />
                      {errors.maritalStatus && (
                        <p className="text-red-500 text-sm">
                          {errors.maritalStatus.message}
                        </p>
                      )}
                    </div>

                    {/* <div className="flex flex-col gap-3">
                    <label
                      htmlFor="fileInput"
                      className={`${inputLabelClassName}`}
                    >
                      Update Resume <span className="text-red-600"> *</span>
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf"
                      name="fileInput"
                      {...register("fileInput")}
                      onChange={handleFileChange}
                      className={`h-12 ${inputClassName} ${
                        errors.fileInput ? "border-[1px] " : "border-gray-300"
                      }`}
                    />
                    <Controller
                      control={control}
                      name="fileInput"
                      rules={{ required: "File is required" }}
                      render={({ field: { onChange } }) => (
                        <Upload
                          accept=".pdf"
                          maxCount={1}
                          beforeUpload={() => false}
                          onChange={(info) => handleFileChange(info, onChange)} // Pass to both handlers
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
                     <a className="text-sm text-cyan-800" rel="noreferrer" href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${selectedFile}`} target="_blank">View Resume</a>
                  </div> */}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 md:my-1 md:mt-4">
                    <div className="col-span-2">
                      <label className={`${inputLabelClassName}`}>
                        Primary Address<span className="text-red-600"> *</span>
                      </label>
                      <input
                        type="text"
                        {...register("PDAddress", {
                          required: "Address  is required",
                        })}
                        className={`${inputClassName} ${
                          errors.PDAddress ? "border-[1px] " : "border-gray-300"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 md:gap-8 gap-4 gap-3 md:my-1">
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
                              className={`${inputClassName} ${
                                errors.PDCountry
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
                        State <span className="text-red-600"> *</span>
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
                              className={`${inputClassName} ${
                                errors.PDState
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
                        City <span className="text-red-600"> *</span>
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
                              className={`${inputClassName} ${
                                errors.PDCity
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
                        Pin Code <span className="text-red-600"> *</span>
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
                            className={`${inputClassName} ${
                              errors.PDPinCode
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

                  <div className="grid grid-cols-1  gap-2 md:my-1  md:mt-4 mt-4 mb-2">
                                                          <label className={`${inputLabelClassName}`}>
                                                            From where did you  about us
                                                          </label>
                                                          <input
                                                            type="text"
                                                            {...register("knowUs")}
                                                            className={` ${inputClassName}`}
                                                            placeholder="Enter From where did you  about us"
                                                          />
                                                          
                                                        </div>


                  <div className="flex flex-col gap-3 my-2">
                    <label
                      htmlFor="fileInput"
                      className={`${inputLabelClassName}`}
                    >
                      Update Resume <span className="text-red-600"> *</span>
                    </label>
                    <Controller
                      control={control}
                      name="fileInput"
                      rules={{ required: "File is required" }}
                      render={({ field: { onChange } }) => {
                        const props = {
                          name: "file",
                          multiple: false,
                          fileList,
                          beforeUpload: (file) => {
                            dispatch(
                              fileUploadFunc({
                                filePath: file,
                                isVideo: false,
                                isMultiple: false,
                              })
                            ).then((res) => {
                              if (res?.payload?.data) {
                                setSelectedFile(res.payload.data);
                                setFileList([file]);
                                message.success(
                                  `${file.name} file uploaded successfully.`
                                );
                                onChange(res.payload.data);
                              } else {
                                message.error(
                                  `${file.name} file upload failed.`
                                );
                                setFileList([]);
                                onChange(null);
                              }
                            });

                            return false;
                          },
                          onRemove: () => {
                            setFileList([]);
                            setSelectedFile(null);
                            onChange(null);
                          },
                          
                        };

                        return (
                          <>
                            <Dragger {...props}>
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">
                                Click or drag file to this area to upload
                              </p>
                              <p className="ant-upload-hint">
                                Upload Updated Resume Here
                              </p>
                            </Dragger>
                            {errors.fileInput && (
                              <p style={{ color: "red", marginTop: 4 }}>
                                {errors.fileInput.message}
                              </p>
                            )}
                          </>
                        );
                      }}
                    />
                    {errors.fileInput && (
                      <p className="text-red-500 text-sm">
                        {errors.fileInput.message}
                      </p>
                    )}
                    <a
                      className="text-sm text-cyan-800"
                      rel="noreferrer"
                      href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${selectedFile}`}
                      target="_blank"
                    >
                      View Resume
                    </a>
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
                          className={`px-4 rounded-md transition-all duration-300 overflow-hidden ${
                            activeIndex === index
                              ? "max-h-screen py-2"
                              : "max-h-0 py-0"
                          }`}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4 px-3 md:mt-4">
                            <div className="mb-2">
                              <label className={`${inputLabelClassName}`}>
                                Name <span className="text-red-600"> *</span>
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
                                className={` ${inputClassName} ${
                                  errors.referenceDetails?.[index]?.name
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
                                Email <span className="text-red-600"> *</span>
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
                                className={` ${inputClassName} ${
                                  errors.referenceDetails?.[index]?.email
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
                                  code<span className="text-red-600"> *</span>
                                </label>
                                <Controller
                                  control={control}
                                  name={`referenceDetails[${index}].mobile.code`}
                                  rules={{ required: "code is required" }}
                                  render={({ field }) => (
                                    <CustomMobileCodePicker
                                      field={field}
                                      errors={errors}
                                    />
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
                                  <span className="text-red-600"> *</span>
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
                                  className={` ${inputClassName} ${
                                    errors[`PDMobileNo`]
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
                                <span className="text-red-600"> *</span>
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
                                className={` ${inputClassName} ${
                                  errors.referenceDetails?.[index]?.relationship
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                }`}
                                placeholder="Enter relationship"
                              />
                              {errors.referenceDetails?.[index]
                                ?.relationship && (
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

                  <div className="flex justify-between py-2">
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
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    disabled={applicationLoader}
                    className={`${
                      applicationLoader ? "bg-gray-400" : "bg-header"
                    } text-white p-2 px-4 rounded`}
                  >
                    {applicationLoader ? <Loader /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </GlobalLayout>
  );
};

export default EditApplication;
