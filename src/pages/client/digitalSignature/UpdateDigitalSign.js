import { useEffect } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import { decrypt } from "../../../config/Encryption";
import getUserIds from '../../../constents/getUserIds';
import moment from "moment";
import { inputClassName, inputLabelClassName, domainName } from "../../../constents/global";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { directorSearch } from "../../Director/director/DirectorFeatures/_director_reducers";
import { getDigitalSignDetails, updateDigitalSign } from "../digitalSignature/digitalSignatureFeatures/_digital_sign_reducers";


function UpdateDigitalSign() {
  const { register, handleSubmit, setValue, control, formState: { errors }, } = useForm();
  const { userCompanyId, userDirectorId, userBranchId, userType } = getUserIds();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { digitalSignIdEnc } = useParams();
  const digitalSignId = decrypt(digitalSignIdEnc);

  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { digitalSignDetails } = useSelector((state) => state.digitalSign);

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
          isPagination:false,
          companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [companyId])

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
      _id: digitalSignId,
    };
    dispatch(getDigitalSignDetails(reqData));
  }, []);

  useEffect(() => {
    if (digitalSignDetails) {
      setValue("PDCompanyId", digitalSignDetails?.companyId);
      setValue("PDBranchId", digitalSignDetails?.branchId);
      setValue("name", digitalSignDetails?.name);
      setValue("startDate", moment(digitalSignDetails?.startDate).format("YYYY-MM-DD"));
      setValue("expiryDate", moment(digitalSignDetails?.expiryDate).format("YYYY-MM-DD"));
      setValue("status", digitalSignDetails?.status);
    }
  }, [digitalSignDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: digitalSignId,
      companyId: userInfoglobal?.userType === "admin" ? companyId :
        userInfoglobal?.userType === "company" ? userInfoglobal?._id :
          userInfoglobal?.companyId,
      branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId :
        userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id :
          userInfoglobal?.branchId,
      directorId: "",
      clientId: "",
      name: data?.name,
      status: data?.status,
      startDate: data?.startDate,
      expiryDate: data?.expiryDate,
    };
    dispatch(updateDigitalSign(finalPayload)).then((data) => {
      if (!data.error) {
        navigate("/admin/digital-sign");
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
                <select
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
                </select>
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
                <select
                  {...register("PDBranchId", { required: "Branch is required" })}
                  className={`${inputClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                >
                  <option value="">Select Branch</option>
                  {branchList?.map((type) => (
                    <option key={type?._id} value={type?._id}>
                      {type?.fullName}
                    </option>
                  ))}
                </select>
                {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Title is required",
                })}
                className={`placeholder: ${inputClassName} ${errors.name
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
                placeholder="Enter Title"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Start Date <span className="text-red-600">*</span>
              </label>
              <input
                {...register("startDate")}
                type="date"
                className={`${inputClassName} ${errors.recurrence?.startDate ? "border-[1px] " : "border-gray-300"}`}
              />
              {errors.recurrence?.startDate && (
                <p className="text-red-500 text-sm">{errors.startDate.message}</p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Expiry Date <span className="text-red-600">*</span>
              </label>
              <input
                {...register("expiryDate")}
                type="date"
                className={`${inputClassName} ${errors.recurrence?.expiryDate ? "border-[1px] " : "border-gray-300"}`}
              />
              {errors.recurrence?.expiryDate && (
                <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
              )}
            </div>
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              <select
                {...register("status", { required: "Status is required" })}
                className={`bg-white ${errors.status ? "border-[1px] " : "border-gray-300"
                  } ${inputClassName}`}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}
export default UpdateDigitalSign;