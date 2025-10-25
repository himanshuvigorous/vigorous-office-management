import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../config/Encryption";
import { useEffect, useState } from "react";
import { getDesignationDetails, getDesignationRole, updateDesignation } from "./designationFeatures/_designation_reducers";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { deptSearch } from "../department/departmentFeatures/_department_reducers";
import Loader from "../../global_layouts/Loader/Loader";
import { inputClassName, inputLabelClassName, domainName, inputDisabledClassName, inputAntdSelectClassName } from "../../constents/global";
import { Select, Spin } from "antd";


function UpdateDesignation() {
  const { loading: designationLoading } = useSelector(state => state.designation);

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const [pageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { desigIdEnc } = useParams();
  const designationId = decrypt(desigIdEnc);
  const { designationDetails, designationRoleData } = useSelector((state) => state.designation);
  const { companyList } = useSelector((state) => state.company);
  const { departmentListData } = useSelector((state) => state.department);
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
    name: "branchiId",
    defaultValue: userInfoglobal?.branchId || "",
  });

  
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userInfoglobal?.departmentId || "",
  });
  const directorId = useWatch({
    control,
    name: "directorId",
    defaultValue: userInfoglobal?.directorId || "",
  });

  const roleId = useWatch({
    control,
    name: "roleId",
    defaultValue: designationDetails?.roleKey || '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {


        const reqData = {
          _id: designationId,
        };
        await dispatch(getDesignationDetails(reqData)).then((data) => {
          //         if(!data.error){
          //            dispatch(deptSearch({ text: "", sort: true, status: true, isPagination: false,companyId: designationDetails?.companyId })).then((data)=>{
          // !data?.error && setValue("departmentId", designationDetails?.departmentId)
          //            })
          //         }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      finally {
        setPageLoading(false)
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (designationDetails) {
      setValue("designationName", designationDetails?.name);
      setValue("CompanyName", designationDetails?.companyData?.fullName);
      setValue("departmentName", designationDetails?.departmentData?.name);
      setValue("departmentId", designationDetails?.departmentId);
      setValue("roleId", designationDetails?.roleKey);
      setValue("status", designationDetails?.status);
    }

  }, [designationDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: designationId,
      name: data?.designationName,
      companyId: designationDetails?.companyId,
      departmentId: designationDetails?.departmentId,
      status: data?.status,
      roleKey: data?.roleId,
    };

    dispatch(updateDesignation(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  useEffect(() => {
    let reqData = {
      text: ''
    }
    dispatch(getDesignationRole(reqData))
  }, [])

  return (
    <GlobalLayout>
      {!pageLoading ? (
        <div className="gap-4">
          {/* <h2 className="text-2xl font-bold mb-4 col-span-2">
            Update User Designations: {designationDetails?.name}
          </h2> */}
          <form autoComplete="off" className="mt-0" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">

              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Company <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  {...register("CompanyName")}
                  className={`placeholder: ${inputDisabledClassName} ${errors.designationName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Company Name"
                />
              </div>
              <div className="">
                <label className={`${inputLabelClassName}`}>
                  Department <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  disabled
                  {...register("departmentName")}
                  className={`placeholder: ${inputDisabledClassName} ${errors.designationName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Department Name"
                />
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Designation Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  {...register("designationName", {
                    required: "Designation Name is required",
                  })}
                  className={`placeholder: ${inputClassName} ${errors.designationName
                    ? "border-[1px] "
                    : "border-gray-300"
                    }`}
                  placeholder="Enter Designation Name"
                />
                {errors.designationName && (
                  <p className="text-red-500 text-sm">
                    {errors.designationName.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Role <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="roleId"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.roleId ? "border-[1px] " : "border-gray-300"}`}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                      placeholder="Select Roles"
                    >
                      <Select.Option value="">Roles</Select.Option>
                      {designationRoleData?.map((element) => (
                        <Select.Option key={element?._id} value={element?.name}>
                          {element?.name}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                />
                {errors.roleId && <p className="text-red-500 text-sm">{errors.roleId.message}</p>}
              </div>

              <div className="w-full">
                <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                      placeholder="Select Status"
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value={true}>Active</Select.Option>
                      <Select.Option value={false}>In Active</Select.Option>
                    </Select>
                  )}
                />
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
            </div>
            <div className="flex justify-end ">
              <button
                type="submit"
                disabled={designationLoading}
                className={`${designationLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
              >
                {designationLoading ? <div className='text-center flex justify-center items-center'>
                  <Spin />
                </div> : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <Loader />
      )}
    </GlobalLayout>
  );
}

export default UpdateDesignation;