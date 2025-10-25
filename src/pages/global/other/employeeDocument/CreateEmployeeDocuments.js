import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../../constents/global";
import { createEmployeeDoc } from "./EmployeeDocumentFeatures/_emp_document_reducers";
import { useEffect } from "react";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";

const CreateEmployeeDocuments = () => {
    const { loading:employeeDocumentLoading } = useSelector(
      (state) => state.employeeDocument
    );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { companyList,companyListLoading } = useSelector((state) => state.company);
  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      name: data?.employeeDocumentName,
      status: true,
      type: data?.type
    };
    dispatch(createEmployeeDoc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Compny 
              </label>
              <Controller
                  control={control}
                  name="PDCompanyId"
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option>: sortByPropertyAlphabetically(companyList,'fullName')?.map((type) => (
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

            <div>
              <label className={`${inputLabelClassName}`}>
                Type <span className="text-red-600">*</span>
              </label>
              <Controller
                name="type"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.type ? "border-[1px] " : "border-gray-300"}`}
                    placeholder="Select Type"
                    showSearch
                  filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                    
                  >
                    <Select.Option value="">Select Type</Select.Option>
                    <Select.Option value="Financial">Financial</Select.Option>
                    <Select.Option value="General">General</Select.Option>
                  </Select>
                )}
              />
              {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("employeeDocumentName", {
                  required: "Employee document is required",
                })}
                className={` ${inputClassName} ${errors.employeeDocumentName
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
                placeholder="Enter Employee document Name"
              />
              {errors.employeeDocumentName && (
                <p className="text-red-500 text-sm">
                  {errors.employeeDocumentName.message}
                </p>
              )}
            </div>
            {/* <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              <select
                {...register("status", { required: "Status is required" })}
                className={`bg-white ${
                  errors.status ? "border-[1px] " : "border-gray-300"
                } ${inputClassName}`}
              >
                <option value="">Select Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div> */}
          </div>
          <div className="flex justify-end ">
          <button
              type="submit"
              disabled={employeeDocumentLoading}
              className={`${employeeDocumentLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {employeeDocumentLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default CreateEmployeeDocuments;
