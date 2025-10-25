import { Controller, useForm, useWatch } from "react-hook-form";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../../../config/Encryption";
import { useEffect, useState } from "react";
import {
  domainName,
  inputAntdSelectClassName,
  inputClassName,
  inputClassNameSearch,
  inputDisabledClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";

import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import ListLoader from "../../../../global_layouts/ListLoader";
import { getAssetTypeDetails, updateAssetType } from "./AssetTypeFeatures/_AssetType_reducers";


const EditAssetType = () => {
  const { loading: AssetTypeloading } = useSelector(
    (state) => state.AssetType
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { AssetTypeIdEnc } = useParams();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const AssetTypeId = decrypt(AssetTypeIdEnc);
  const { AssetTypeDetails } = useSelector((state) => state.AssetType);
  const [isDurationActive, setIsDurationActive] = useState(false);
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  // useEffect(() => {
  //   dispatch(employeSearch());
  // }, []);
  useEffect(() => {
    let reqData = {
      _id: AssetTypeId,
    };
    dispatch(getAssetTypeDetails(reqData));
  }, []);
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const isPaid = useWatch({
    control,
    name: "isPaid",
    defaultValue: "",
  });
  useEffect(() => {
    if (AssetTypeDetails) {
      setValue("PDCompanyId", AssetTypeDetails?.companyId);
      setValue("PDBranchId", AssetTypeDetails?.branchId);
      setValue("AssetTypeName", AssetTypeDetails?.name);
      setValue("amount", AssetTypeDetails?.amount);
      setValue("quantity", AssetTypeDetails?.quantity);
      setValue("openingBalance", AssetTypeDetails?.openingBalance);
    
    }
  }, [AssetTypeDetails]);

  const onSubmit = (data) => {

    const finalPayload = {
      _id: AssetTypeId,
      companyId: userInfoglobal?.userType === "admin" ? data?.PDCompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
        name: data?.AssetTypeName,        
        "quantity": +data?.quantity,
        "amount": +data?.amount,
        "openingBalance": +data?.openingBalance
    };

    dispatch(updateAssetType(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
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
  const handleDurationChange = (e) => {
    setIsDurationActive(e.target.value === "true");
    setValue("maxDays", "");
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">

            {userInfoglobal?.userType === "admin" && <div className="">
              <label className={`${inputLabelClassName}`}>
                Company <span className="text-red-600">*</span>
              </label>
              <select
                {...register("PDCompanyId", {
                  required: "company is required",
                })}
                showSearch
                filterOption={(input, option) =>
                  String(option?.children).toLowerCase().includes(input.toLowerCase())
                }
                className={` ${inputClassName} ${errors.PDCompanyId
                  ? "border-[1px] "
                  : "border-gray-300"
                  }`}
              >
                <option className="" value="">
                  Select Comapany
                </option>
                {companyListLoading ? <Select.Option disabled>
                  <ListLoader />
                </Select.Option> : (companyList?.map((type) => (
                  <option value={type?._id}>{type?.fullName}</option>
                )))}
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
              <Controller
                name="PDBranchId"
                control={control}
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                    placeholder="Select Branch"
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
              {errors.PDBranchId && (
                <p className="text-red-500 text-sm">
                  {errors.PDBranchId.message}
                </p>
              )}
            </div>}

            <div className="">
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("AssetTypeName", {
                  required: "Asset Name is required",
                })}
                className={`${inputClassName} ${errors.AssetTypeName ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Asset Name  Name"
              />
              {errors.AssetTypeName && (
                <p className="text-red-500 text-sm">{errors.AssetTypeName.message}</p>
              )}
            </div>

           
              <div className="">
                <label className={`${inputLabelClassName}`}>quantity<span className="text-red-600">*</span></label>
                <input
                  type="number"
                  disabled
                  {...register("quantity", {
                    required: "quantity is required",
                  })}
                  className={`${inputDisabledClassName} ${errors.maxDays ? "border-[1px] " : "border-gray-300"}`}
                  placeholder="Enter quantity"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm">{errors.quantity.message}</p>
                )}
              </div>
     

            {/* <div className="">
              <label className={`${inputLabelClassName}`}>Amount<span className="text-red-600">*</span></label>
              <input
                type="number"
                {...register("amount", {
                  required: "Amount is required",
                })}
                disabled
                className={`${inputDisabledClassName} ${errors.totalLeaves ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Amount"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div> */}


              <div className="">
              <label className={`${inputLabelClassName}`}>Opening Balance </label>
              <input
                type="number"
                step="any"
                disabled
                {...register("openingBalance", {
                
                })}
                className={`${inputDisabledClassName} ${errors.totalLeaves ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Opening Balance"
              />
              {errors.openingBalance && (
                <p className="text-red-500 text-sm">{errors.openingBalance.message}</p>
              )}
            </div>


          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={AssetTypeloading}
              className={`${AssetTypeloading ? 'bg-gray-400' : 'bg-header'} text-white p-2 px-4 mt-3 rounded`}
            >
              {AssetTypeloading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default EditAssetType;
