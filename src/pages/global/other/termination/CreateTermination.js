import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { domainName, inputAntdSelectClassName, inputAntdSelectClassNameFilter, inputClassName, inputLabelClassName, inputLabelClassNameReactSelect } from "../../../../constents/global";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { DatePicker, Select } from "antd";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";

import dayjs from "dayjs";
import { createTerminationFunc } from "./terminationFeatures/termination_reducers";
import Loader from "../../../../global_layouts/Loader";
import { fileUploadFunc } from "../fileManagement/FileManagementFeatures/_file_management_reducers";
import { FaRegFile, FaTimes } from "react-icons/fa";


const CreateTermination = () => {
  const { loading: terminationLoading } = useSelector((state) => state.Termination);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [formData, setFormData] = useState({
    attachments: []
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { employeList } = useSelector((state) => state.employe);
  const [isPreview, setIsPreview] = useState(false);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });

// useEffect(()=>{
// setValue("employee",'')
// },[branchId])

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: '',
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
      employeId: data?.employee,
      title: data?.title,
      description: data?.description,
      applyDate: dayjs(data?.applyDate).format("YYYY-MM-DD"),
      type: "termination",
      attachment: formData?.attachments,
    };
    dispatch(createTerminationFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
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
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, res.payload?.data]
        }));
      }
    });
  };

  const handleRemoveFile = (index) => {
    setFormData(prev => {
      const updatedAttachments = prev.attachments.filter((_, i) => i !== index);
      return { ...prev, attachments: updatedAttachments };
    });
  };

  useEffect(() => {
    if (
      CompanyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId])

  useEffect(() => {
    if (userInfoglobal?.userType === "admin") {
      dispatch(
        companySearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
        })
      );
    }
  }, []);

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 md:my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>


              <Controller
                control={control}
                name="PDCompanyId"
                rules={{ required: "Company is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}

                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select Company</Select.Option>
                    {companyList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.PDCompanyId && (
                <p className="text-red-500 text-sm">
                  {errors.PDCompanyId.message}
                </p>
              )}
            </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>


              <Controller
                control={control}
                name="PDBranchId"
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onChange={(value)=>{
                      setValue("employee",'')
                      field.onChange(value);
                    }}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>
            }


            <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Employee Name <span className="text-red-600">*</span>
              </label>
              <Controller
                name="employee"
                control={control}
                rules={{ required: "Employee is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.employee ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Employee"
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    onFocus={() => {
                      const reqPayload = {
                        text: "",
                        status: true,
                        sort: true,
                        isTL: "",
                        isHR: "",
                        isPagination: true,
                        departmentId: "",
                        designationId: "",
                        companyId: userInfoglobal?.userType === "admin" ? userInfoglobal?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                        directorId: "",
                        branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
                      };
                      dispatch(employeSearch(reqPayload));
                    }}
                  >
                    <Select.Option value="">Select Employee</Select.Option>
                    {employeList?.map((employee) => (
                      <Select.Option key={employee?._id} value={employee?._id}>
                        {employee?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">{errors.employee.message}</p>
              )}
            </div>


          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 my-2">

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Description <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("description", {
                  required: "Description is required",
                })}
                className={`${inputClassName} ${errors.description ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Description"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className={`${inputLabelClassName}`}>
                Apply Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="applyDate"
                control={control}
                rules={{
                  required:'Apply Date is Required'
                }}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.applyDate && (
                <p className="text-red-500 text-sm">Apply Date is required</p>
              )}
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 my-2">

            

          </div>

          <div className="">
            <label className={`${inputLabelClassName}`}>
              Documents 
            </label>
            {!isPreview ? (
              <div className="space-y-4">
                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-600 bg-white cursor-pointer">
                  <FaRegFile className="mr-2" /> Add Documents
                </label>

                <div className="space-y-2">
                  {formData.attachments.map((file, index) => (
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
            ) : (
              <div className="space-y-2">
                {/* Attachments preview logic */}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={terminationLoading}
              className={`${terminationLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {terminationLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateTermination;
