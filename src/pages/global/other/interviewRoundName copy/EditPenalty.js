import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import {
  getpenaltyDetails,
  updatepenaltyType,
} from "./penaltyFeatures/_penalty_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";

// import { getpenaltyDetails, updatepenaltyType } from "./penaltyFeatures/_penalty_type_reducers";

const EditPenalty = () => {
  const { loading: penaltyLoading } = useSelector((state) => state.penalty);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { penaltyIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const penaltyTypeId = decrypt(penaltyIdEnc);
  const { penaltyDetails } = useSelector((state) => state.penalty);
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });


  // useEffect(() => {
  //   dispatch(employeSearch());
  // }, []);


  useEffect(() => {
    let reqData = {
      _id: penaltyTypeId,
    };
    dispatch(getpenaltyDetails(reqData));
  }, []);

  useEffect(() => {
    if (penaltyDetails) {
      // setValue("PDCompanyId", penaltyDetails?.companyId);
      // setValue("PDBranchId", penaltyDetails?.branchId);
      setValue("name", penaltyDetails?.name);
      setValue("status", penaltyDetails?.status);
      setValue('amount', penaltyDetails?.amount)
    }
  }, [penaltyDetails]);

  const onSubmit = (data) => {
    const finalPayload = {
      _id: penaltyTypeId,
      companyId: penaltyDetails?.companyId,
      directorId: penaltyDetails?.directorId,
      branchId: penaltyDetails?.branchId,
      name: data?.name,
      amount: +data?.amount,
      isDeleted: false,
      status: data?.status,
    };
    dispatch(updatepenaltyType(finalPayload)).then((data) => {
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
            <div className="">
              <label className={`${inputLabelClassName}`}>
                Penalty Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Penalty name is required",
                })}
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Penalty name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="">
              <label className={`${inputLabelClassName}`}>
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                 step="0.01"
                {...register("amount", {
                  required: "Amount is required",
                })}
                className={`${inputClassName} ${errors.name ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
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
                    placeholder="Select Status"
                  >
                    <Select.Option value={true}>Active</Select.Option>
                    <Select.Option value={false}>In Active</Select.Option>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={penaltyLoading}
              className={`${penaltyLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {penaltyLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditPenalty;
