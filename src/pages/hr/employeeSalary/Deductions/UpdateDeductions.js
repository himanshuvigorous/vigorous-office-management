import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt } from "../../../../config/Encryption";
import { deductionsDetails, deductionsUpdate } from "./deductionsfeature/_deductionsList_reducers";
import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";




const UpdateDeductions = () => {
  const {  loading:deductionLoading } = useSelector(
    (state) => state.deductions
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

const {deductionIdEnc} = useParams();
const deductionId = decrypt(deductionIdEnc);
const {deductionsDetailsData} = useSelector((state) => state.deductions);
 



  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const isPercentage = useWatch({
    control,
    name: "isPercentage",
    defaultValue: "",
  });

useEffect(()=>{
if(deductionId){
  dispatch(deductionsDetails({
    _id:deductionId
  }));
}
},[deductionId])



  const onSubmit = (data) => {
    const finalPayload = {
      _id: deductionId,
      companyId: deductionsDetailsData.companyId,
      directorId:deductionsDetailsData?.directorId,
      branchId: deductionsDetailsData.branchId,
      "name": data?.allowanceName,
      "description": '',
      "isPercentage": false,
      "amount": 0,
      status:data.status==='true'?true :data.status==='false'?false:''
    };
    dispatch(deductionsUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  useEffect(()=>{
if(deductionsDetailsData){
setValue("allowanceName", deductionsDetailsData?.name);
// setValue("description", deductionsDetailsData?.description);
// setValue("isPercentage", deductionsDetailsData?.isPercentage === true ? 'Active' : 'InActive');
// setValue("amount", deductionsDetailsData?.amount);
setValue("status",deductionsDetailsData?.status===true ? 'true':deductionsDetailsData?.status===false ? 'false' : '')
}
  },[deductionsDetailsData])


  

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">



            <div className="">
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register("allowanceName", {
                  required: "Deduction  is required",
                })}
                className={`${inputClassName} ${errors.allowanceName ? "border-[1px] " : "border-gray-300"}`}
                placeholder="Enter Deduction  Name"
              />
              {errors.allowanceName && (
                <p className="text-red-500 text-sm">{errors.allowanceName.message}</p>
              )}
            </div>
            
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
              {/* <select
                {...register("isPercentage", {
                  required: "isPercentage is required",
                })}
                className={`${inputClassName} ${errors.isPercentage ? "border-[1px] " : "border-gray-300"}`}
              >
                <option value="">Select isPercentage</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select> */}
                  <Controller
                      name="status"
                      control={control}
                      rules={{
                        required:'status is required'
                      }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={` w-32 ${inputAntdSelectClassName} ${errors.PDPlan ? "border-[1px] " : "border-gray-300"}`}
                
                          placeholder="Select Status"
                          showSearch

                        >
                          <Select.Option value="">Select Status</Select.Option>
                       
                       
                            <Select.Option value="true" > Active  </Select.Option>
                             <Select.Option value="false" > InActive  </Select.Option>
                           
                        </Select>
                      )}
                    />
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
              </div>
            </div>

          <div className="flex justify-end">
          <button
              type="submit"
              disabled={deductionLoading}
              className={`${deductionLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 mt-3 rounded`}
            >
            {deductionLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default UpdateDeductions;
