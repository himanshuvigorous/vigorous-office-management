import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../constents/global";
import { useEffect } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import Loader from "../../../global_layouts/Loader";
import { createLeadCategoryFunc, getLeadCategoryById, updateLeadCategoryFunc } from "./LeadCategoryFeatures/_LeadCategory_reducers";
import { decrypt } from "../../../config/Encryption";
import { Select } from "antd";


function EditLeadsManagementCategory() {
  const { loading: leadCategoryLoading , LeadCategoryByIdData } = useSelector(state => state.leadCategory)
      const { leadCategoryIdEnc } = useParams();
      const leadCategoryId = decrypt(leadCategoryIdEnc);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  useEffect(() => {
    let reqData = {
      _id: leadCategoryId,
    };
    dispatch(getLeadCategoryById(reqData));
  }, []);
 
  useEffect(() => {
    if (LeadCategoryByIdData) {
      setValue("Category", LeadCategoryByIdData?.name);
      setValue("status", LeadCategoryByIdData?.status?'true':'false');
    }
  }, [LeadCategoryByIdData]);


  const onSubmit = (data) => {
    const finalPayload = {
      _id: leadCategoryId , 
      companyId:  LeadCategoryByIdData?.companyId,
      directorId:LeadCategoryByIdData?.directorId,
      branchId: LeadCategoryByIdData?.branchId,
   "leadCategoryId":  LeadCategoryByIdData?.leadCategoryId  || null,
    "name": data?.Category,
    "status": data?.status=='true' ? true : false

    };

    dispatch(updateLeadCategoryFunc(finalPayload)).then((data) => {
    if(!data?.error){
        navigate(-1)
    }
    });
  }
 

  return (
    <GlobalLayout>
      <div className="gap-4">

        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">      
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">      
            <div className="">
              <label className={`${inputLabelClassName}`}>Status</label>
                  <Controller
                name="status"
                control={control}
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}

                    className={` ${inputAntdSelectClassName} ${errors.status ? "border-[1px] " : "border-gray-300"
                    } `}
                    placeholder="Select Status"
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Select.Option value="true">Active</Select.Option>
                    <Select.Option value="false">Inactive</Select.Option>
                  </Select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-sm">
                  {errors.status.message}
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

export default EditLeadsManagementCategory
