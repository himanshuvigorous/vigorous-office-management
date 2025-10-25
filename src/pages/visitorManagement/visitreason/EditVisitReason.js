import { Controller, useForm, useWatch } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../config/Encryption";
import { useEffect } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
} from "../../../constents/global";





import { Select } from "antd";
import Loader from "../../../global_layouts/Loader";
import { getVisitReasonDetails, updateVisitReasonType } from "./visitReasonFeatures/_visitReason_type_reducers";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";


const EditVisitReason = () => {
  const { loading: VisitReasonLoading } = useSelector((state) => state.visitReason);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { visitReasonIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const VisitReasonTypeId = decrypt(visitReasonIdEnc);
  const { VisitReasonDetails } = useSelector((state) => state.visitReason);

  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  useEffect(() => {
    dispatch(employeSearch());
  }, []);
  useEffect(() => {
    let reqData = {
      _id: VisitReasonTypeId,
    };
    dispatch(getVisitReasonDetails(reqData));
  }, []);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  useEffect(() => {
    if (VisitReasonDetails) {
      // setValue("PDCompanyId", VisitReasonDetails?.companyId);
      // setValue("PDBranchId", VisitReasonDetails?.branchId);
      setValue("reason", VisitReasonDetails?.title);
      setValue("status", VisitReasonDetails?.status);

    }
  }, [VisitReasonDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: VisitReasonTypeId,
      companyId: VisitReasonDetails?.companyId,
      directorId: VisitReasonDetails?.directorId,
      branchId: VisitReasonDetails?.branchId,
      title: data?.reason,
      isDeleted: false,
      status: data?.status,
    };
    dispatch(updateVisitReasonType(finalPayload)).then((data) => {
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
            {/* {userInfoglobal?.userType === "admin" && <div className="">
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
            </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">
              <label className={`${inputLabelClassName}`}>
                Branch <span className="text-red-600">*</span>
              </label>
              <select
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
              </select>
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>} */}


            <div className="">
              <label className={`${inputLabelClassName}`}>Visit Reason <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("reason", {
                  required: "Visit Reason is required",
                })}
                className={`${inputClassName} ${errors.reason ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Visit Reason"
              />
              {errors.reason && (
                <p className="text-red-500 text-sm">{errors.reason.message}</p>
              )}
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

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>Status</label>
              <select
                {...register("status")}
                className={`${inputClassName} ${errors.status ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value={true}>Active</option>
                <option value={false}>InActive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div> */}

          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={VisitReasonLoading}
              className={`${VisitReasonLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {VisitReasonLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditVisitReason;
