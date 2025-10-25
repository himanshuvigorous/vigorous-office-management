import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import getUserIds from '../../../constents/getUserIds';
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName, sortByPropertyAlphabetically } from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { createClientNews } from "../clientNews/clientNewsFeatures/_client_news_reducers";
import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";

function CreateClientNews() {
  const { loading: clientNewsLoading } = useSelector(state => state.clientNews);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

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

  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);


  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });

  const directorId = useWatch({
    control,
    name: "directorId",
    defaultValue: userDirectorId,
  });

  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });

  // useEffect(() => {
  //   setValue("PDMobileCode", "+91");
  // }, [countryListData]);

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

  useEffect(() => {
    if (companyId && userType === "company" || userType === "admin") {
      dispatch(
        directorSearch({
          text: "", sort: true, status: true, isPagination: false, companyId: companyId,
        })
      );
    }
  }, [companyId]);

  const onSubmit = (data) => {
    const finalPayload = {
      companyId: userInfoglobal?.userType === "admin" ? companyId :
        userInfoglobal?.userType === "company" ? userInfoglobal?._id :
          userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      "directorId": "",
      title: data?.title,
    };
    dispatch(createClientNews(finalPayload)).then((data) => {
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
                        <Loader />
                      </Select.Option> : (sortByPropertyAlphabetically(companyList, 'fullName')?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      )))}
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
                {/* <select
                  {...register("PDBranchId", { required: "Branch is required" })}
                  className={`${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                >
                  <option value="">Select Branch</option>
                  {branchList?.map((type) => (
                    <option key={type?._id} value={type?._id}>
                      {type?.fullName}
                    </option>
                  ))}
                </select> */}
                <Controller
                  control={control}
                  name="PDBranchId"
                  rules={{ required: "Branch is required" }}
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
                      <Select.Option value="">Select Branch</Select.Option>
                      {branchListloading ? <Select.Option disabled>
                        <Loader />
                      </Select.Option> : (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.title
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Name"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">
                  {errors.title.message}
                </p>
              )}
            </div>

          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={clientNewsLoading}
              className={`${clientNewsLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 rounded mt-3`}
            >
              {clientNewsLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  )
}

export default CreateClientNews
