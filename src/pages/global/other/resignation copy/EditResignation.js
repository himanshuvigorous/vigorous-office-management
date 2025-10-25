import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputAntdSelectClassNameFilter,
  inputClassName,
  inputDisabledClassName,
  inputLabelClassName,
  inputLabelClassNameReactSelect,
} from "../../../../constents/global";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { getResignationDetails, updateResignationFunc } from "./resignationFeatures/resignation_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
import { Select } from "antd";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import getUserIds from "../../../../constents/getUserIds";
import Loader from "../../../../global_layouts/Loader";
import Loader2 from "../../../../global_layouts/Loader/Loader2";


const EditResignation = () => {
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const { userCompanyId, userBranchId, userType } = getUserIds();

  const { resignIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const resignId = decrypt(resignIdEnc);
  const { resignationDetails } = useSelector((state) => state.resignation);
  const { employeList } = useSelector((state) => state.employe);
  const {  loading:reginationLoading } = useSelector((state) => state.resignation);
  const [editPageLoader,setEditPageLoader]=useState(true);

  useEffect(() => {
    dispatch(employeSearch());
  }, []);
    const companyId = useWatch({
      control,
      name: "PDCompanyId",
      defaultValue: userCompanyId,
    });
    const branchId = useWatch({
      control,
      name: "PDBranchId",
      defaultValue: userBranchId,
    });
  useEffect(() => {
    if (
      companyId ||
      userType === "company" ||
      userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          companyId: companyId
        })
      );
    }
  }, [companyId])
  useEffect(() => {
    if (userType === "admin") {
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

  useEffect(() => {
    let reqData = {
      _id: resignId,
    };
    dispatch(getResignationDetails(reqData)).then(()=>{
      setEditPageLoader(false)
    })
  }, []);

  useEffect(() => {
    if (resignationDetails) {

      setValue('PDBranchId',resignationDetails?.branchId)
      setValue('PDCompanyId',resignationDetails?.companyId);   
      setValue("employee", resignationDetails?.employeName);
      setValue("title", resignationDetails?.title);
      setValue("description", resignationDetails?.description);
      setValue("applyDate", moment(resignationDetails?.applyDate));
    }
  }, [resignationDetails]);

  const onSubmit = (data) => {

    const finalPayload = {
      _id: resignId,
      companyId: resignationDetails.companyId,
      directorId: '',
      branchId: resignationDetails?.branchId,
      employeId: resignationDetails?.employeId,
      title: data?.title,
      description: data?.description,
      applyDate: dayjs(data?.applyDate).format("YYYY-MM-DD"),
      //completeDate: data?.completeDate,
      noticePeriod: resignationDetails?.noticePeriod,
      type:"resignation",
      status: resignationDetails?.status,
    };

    dispatch(updateResignationFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };


  return (
    <GlobalLayout>
     {editPageLoader ? <div className="h-screen w-full flex justify-center items-center"><Loader2/></div> : <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select> */}

              <Controller
                      control={control}
                      name="PDCompanyId"
                      rules={{ required: "Company is required" }}
                      disabled
                      render={({ field }) => (
                        <Select
                          {...field}
                        
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
              {/* <select
                {...register("PDBranchId", {
                  required: "Branch is required",
                })}
                className={` ${inputClassName} ${errors.PDBranchId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Branch
                </option>
                {branchList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                ))}
              </select> */}
               <Controller
                      control={control}
                      name="PDBranchId"
                      disabled
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                        
                          className={`${inputAntdSelectClassName} `}
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
              <input
                type="text"
                disabled
                {...register("employee")}
                className={`placeholder: ${inputDisabledClassName} ${errors.employee
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Employee Name"
              />
              {errors.employee && (
                <p className="text-red-500 text-sm">{errors.employee.message}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 my-2">

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`${inputClassName} ${errors.title ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Title"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

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

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-3 my-2">

            <div>
              <label className={`${inputLabelClassName}`}>
                Apply Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="applyDate"
                control={control}
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


            {/* <div>
              <label className={`${inputLabelClassName}`}>
                Complete Date <span className="text-red-600">*</span>
              </label>
              <Controller
                name="completeDate"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker field={field} errors={errors} disabledDate={(current) => {
                    return current && current.isBefore(moment().endOf('day'), 'day');
                  }} />
                )}
              />
              {errors.completeDate && (
                <p className="text-red-500 text-sm">Complete Date is required</p>
              )}
            </div> */}


            {/* <div className="w-full">
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors?.status ? "border-[1px] " : ""}`}
                    placeholder="Select Status"
                  >
                    <Select.Option value="Requested">Requested</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Rejected">Rejected</Select.Option>
                    <Select.Option value="Completed">Completed</Select.Option>
                  </Select>
                )}
              />
              {errors?.status && (
                <p className="text-red-600 text-sm">{errors.status.message}</p>
              )}
            </div> */}


          </div>

          {/* Submit Button */}
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={reginationLoading}
              className={`${reginationLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {reginationLoading ? <Loader /> : 'Submit'}
            </button>

          </div>
        </form>
      </div>}
    </GlobalLayout>
  );
};

export default EditResignation;