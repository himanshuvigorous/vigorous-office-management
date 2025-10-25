import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getUserIds from '../../../constents/getUserIds';
import { AutoComplete, Input, Select } from "antd";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { createClientService } from "../clientService/clientServiceFeatures/_client_service_reducers"
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";


function CreateClientService() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const { loading: clientServiceLoading } = useSelector(state => state.clientService)
  const {
    userCompanyId,
    userDirectorId,
    userBranchId,
    userType
  } = getUserIds();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { companyList } = useSelector((state) => state.company);
  const { countryListData, companyListLoading } = useSelector((state) => state.country);
  const { branchList, branchListloading } = useSelector((state) => state.branch);


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
    setValue("PDMobileCode", "+91");
  }, [countryListData]);

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

  useEffect(() => {
    if (
      companyId ||
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId])

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? companyId :
        userInfoglobal?.userType === "company" ? userInfoglobal?._id :
          userInfoglobal?.companyId,

      "directorId": "",
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      name: data?.name,
    };
    dispatch(createClientService(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  }

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
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
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      className={`${inputAntdSelectClassName} `}
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : companyList?.map((type) => (
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
              </div>)}

            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
              <div>
                <label className={`${inputLabelClassName}`}>
                  Branch <span className="text-red-600">*</span>
                </label>
                <Controller
                  name="PDBranchId"
                  control={control}
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                      placeholder="Select Branch"
                      showSearch
                      filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
                    >
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                        <ListLoader />
                      </Select.Option> : (branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
                    </Select>
                  )}
                />
                {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
              </div>
            )}

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.name
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Service"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={clientServiceLoading}
              className={`${clientServiceLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {clientServiceLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateClientService
