import { useEffect } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { decrypt } from "../../../config/Encryption";
import getUserIds from "../../../constents/getUserIds";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  inputAntdSelectClassName,
  sortByPropertyAlphabetically,
} from "../../../constents/global";
import { countrySearch } from "../../global/address/country/CountryFeatures/_country_reducers";
import { AutoComplete, Input, Select } from "antd";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import {
  getClientGrpDetails,
  updateClientGroup,
} from "../clientGroup/clientGroupFeatures/_client_group_reducers";
import CustomMobileCodePicker from "../../../global_layouts/MobileCode/MobileCodePicker";
import Loader from "../../../global_layouts/Loader";

function UpdateClientGroup() {
  const { loading: clientGroupLoading } = useSelector(state => state.clientGroup)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const { userCompanyId, userDirectorId, userBranchId, userType } =
    getUserIds();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clientGrpIdEnc } = useParams();
  const clientGrpId = decrypt(clientGrpIdEnc);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { clientGroupDetails } = useSelector((state) => state.clientGroup);

  const { companyList } = useSelector((state) => state.company);
  const { countryListData, companyListLoading } = useSelector(
    (state) => state.country
  );
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );

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
          companyId:
            userInfoglobal?.userType === "admin"
              ? companyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId]);

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
    let reqData = {
      _id: clientGrpId,
    };
    dispatch(getClientGrpDetails(reqData));
  }, []);

  useEffect(() => {
    if (clientGroupDetails) {
      setValue("PDCompanyId", clientGroupDetails?.companyId);
      setValue("PDBranchId", clientGroupDetails?.branchId);
      setValue("fullName", clientGroupDetails?.fullName);
      setValue("email", clientGroupDetails?.email);
      setValue("password", clientGroupDetails?.password);
      setValue("PDCode", clientGroupDetails?.mobile?.code);
      setValue("openingBalance", clientGroupDetails?.openingBalance);
      setValue("PDNumber", clientGroupDetails?.mobile?.number);
      setValue("status", clientGroupDetails?.status ? "true" : "false");
    }
  }, [clientGroupDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: clientGrpId,
      companyId:
        userInfoglobal?.userType === "admin"
          ? companyId
          : userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      directorId: "",
      branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      fullName: data?.fullName,
      openingBalance: +data?.openingBalance,
      email: data?.email?.toLowerCase(),
      userType: "clientGroup",
      mobile: {
        code: data?.PDCode,
        number: data?.PDNumber,
      },
      status: data?.status === "true" ? true : false,
    };
    dispatch(updateClientGroup(finalPayload)).then((data) => {
      if (!data.error) {
        navigate(-1);
      }
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form
          autoComplete="off"
          className="mt-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
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
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Company</Select.Option>
                      {companyListLoading ? (
                        <Select.Option disabled>
                          <Loader />
                        </Select.Option>
                      ) : (
                        companyList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.PDCompanyId && (
                  <p className="text-red-500 text-sm">
                    {errors.PDCompanyId.message}
                  </p>
                )}
              </div>
            )}
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
                <div>
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
                        defaultValue={""}
                        className={`${inputAntdSelectClassName} `}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                      >
                        <Select.Option value="">Select Branch</Select.Option>
                        {branchListloading ? (
                          <Select.Option disabled>
                            <Loader />
                          </Select.Option>
                        ) : (
                          sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          ))
                        )}
                      </Select>
                    )}
                  />
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>
              )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("fullName", {
                  required: "Name is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.fullName
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={` ${inputClassName} ${errors.email
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Email"
                style={{ textTransform: "lowercase" }}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex gap-3">
              <div className="w-[150px]">
                <label className={`${inputLabelClassName}`}>
                  Code <span className="text-red-600">*</span>
                </label>
                <Controller
                  control={control}
                  name="PDCode"
                  rules={{ required: "code is required" }}
                  render={({ field }) => (
                    <CustomMobileCodePicker field={field} errors={errors} />
                  )}
                />
                {errors[`PDCode`] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors[`PDCode`].message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className={`${inputLabelClassName}`}>
                  Mobile No <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  {...register(`PDNumber`, {
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
                  className={` ${inputClassName} ${errors[`PDNumber`]
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
                {errors[`PDNumber`] && (
                  <p className="text-red-500 text-sm">
                    {errors[`PDNumber`].message}
                  </p>
                )}
              </div>
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Opening Balance
              </label>
              <input
                type="number"
                step="any"
                {...register("openingBalance", {


                })}
                disabled={clientGroupDetails?.openingBalance}
                className={` ${inputClassName} ${errors.openingBalance
                  ? "border-[1px] "
                  : "border-gray-300"
                  } `}
                placeholder="Enter Opening Balance"

              />
              {errors.openingBalance && (
                <p className="text-red-500 text-sm">
                  {errors.openingBalance.message}
                </p>
              )}
            </div>
            <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("status", { required: "Status is required" })}
                className={`bg-white ${
                  errors.status
                    ? "border-[1px] "
                    : "border-gray-300"
                } ${inputClassName}`}
              >
                <option value={"true"}>Active</option>
                <option value={"false"}>Inactive</option>
              </select> */}
              <Controller
                control={control}
                name="status"
                rules={{ required: "status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    className={`${inputAntdSelectClassName} `}
                  >
                    <Select.Option value="">Select status</Select.Option>
                    <Select.Option value={"true"}>Active</Select.Option>
                    <Select.Option value={"false"}>Inactive</Select.Option>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={clientGroupLoading}
              className={`${clientGroupLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {clientGroupLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default UpdateClientGroup;
