import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { useEffect } from "react";
import { Select } from "antd";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../global_layouts/Loader";
import ListLoader from "../../../global_layouts/ListLoader";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { createLeadCategoryFunc } from "./LeadCategoryFeatures/_LeadCategory_reducers";


function CreateLeadsManagementCategory() {
  const { loading: leadCategoryLoading } = useSelector(state => state.leadCategory)
    const [searchParams, setSearchParams] = useSearchParams();
    const parentPageId =searchParams.get('parentPageId') || null;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );


  const onSubmit = (data) => {
    const finalPayload = {
      companyId:  userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
      directorId: userInfoglobal?.userType === "companyDirector" ? userInfoglobal?._id : userInfoglobal?.directorId,
      branchId: (userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" || userInfoglobal?.userType === "company") ? data?.PDBranchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
   "leadCategoryId": parentPageId ? parentPageId : null,
    "name": data?.Category

    };

    dispatch(createLeadCategoryFunc(finalPayload)).then((data) => {
    if(!data?.error){
        navigate(-1)
    }
    });
  }
  useEffect(() => {
    if (
      userInfoglobal?.userType === "company" ||
      userInfoglobal?.userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination: false,
          companyId:  userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [])

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
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
              <label className={`${inputLabelClassName}`}>Category</label>
              <input
                type="text"
                {...register("Category", {
                  required: "Category is required",
                })}
                className={` ${inputClassName} ${errors.Category ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Category"
            
              />
              {errors.Category && (
                <p className="text-red-500 text-sm">
                  {errors.Category.message}
                </p>
              )}
            </div>


          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={leadCategoryLoading}
              className={`${leadCategoryLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 mt-3 px-4 rounded`}
            >
              {leadCategoryLoading ? <Loader /> : 'Submit'}
            </button>
          </div>

        </form>


      </div>
    </GlobalLayout>
  )
}

export default CreateLeadsManagementCategory
