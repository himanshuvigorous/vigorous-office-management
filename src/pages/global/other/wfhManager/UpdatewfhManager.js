import { Controller, useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../../../constents/global";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt } from "../../../../config/Encryption";

import { Select } from "antd";
import Loader from "../../../../global_layouts/Loader";
import { wfhManagerDetails, wfhManagerUpdate } from "./wfhManagerfeature/_wfhManager_reducers";




const UpdatewfhManager = () => {
  const {  loading:wfhManagerLoading } = useSelector(
    (state) => state.wfhManager
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

const {wfhManagerIdEnc} = useParams();
const wfhManagerId = decrypt(wfhManagerIdEnc);
const {wfhManagerDetailsData} = useSelector((state) => state.wfhManager);
 



  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const isPercentage = useWatch({
    control,
    name: "isPercentage",
    defaultValue: "",
  });

useEffect(()=>{
if(wfhManagerId){
  dispatch(wfhManagerDetails({
    _id:wfhManagerId
  }));
}
},[wfhManagerId])



  const onSubmit = (data) => {
    const finalPayload = {
      _id: wfhManagerId,
      companyId: wfhManagerDetailsData.companyId,
      directorId:wfhManagerDetailsData?.directorId,
      branchId: wfhManagerDetailsData.branchId,
      name: data?.wfhManagerName,
      // "allowedDays": data?.allowedDays,
    "perdaySalaryPercent": data?.perdaySalaryPercent,
      status:data.status==='true'?true :data.status==='false'?false:''
    };
    dispatch(wfhManagerUpdate(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  useEffect(()=>{
if(wfhManagerDetailsData){
setValue("wfhManagerName", wfhManagerDetailsData?.name);
// setValue("allowedDays", wfhManagerDetailsData?.allowedDays);
setValue("perdaySalaryPercent", wfhManagerDetailsData?.perdaySalaryPercent);
setValue("status",wfhManagerDetailsData?.status===true ? 'true':wfhManagerDetailsData?.status===false ? 'false' : '')
}
  },[wfhManagerDetailsData])


  

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-2 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div className="">
              <label className={`${inputLabelClassName}`}>Name <span className="text-red-600"> *</span></label>
              <input
                type="text"
                {...register("wfhManagerName", {
                  required: "WFH Name  is required",
                })}
                className={`${inputClassName} ${errors.wfhManagerName ? "border-[1px] " : "border-gray-300"
                  }`}
                placeholder="Enter WFH Name"
              />
              {errors.wfhManagerName && (
                <p className="text-red-500 text-sm">
                  {errors.wfhManagerName.message}
                </p>
              )}
            </div>
             {/* <div className="">
                            <label className={`${inputLabelClassName}`}>Maximum Allowed Days  <span className="text-red-600">*</span></label>
                            <input
                              type="number"
                              {...register("allowedDays", {
                                required: "Maximum Days  is required",
                               
                                
                              })}
                              className={`${inputClassName} ${errors.allowedDays ? "border-[1px] " : "border-gray-300"}`}
                              placeholder="Enter Maximum Days "
                            />
                            {errors.allowedDays && (
                              <p className="text-red-500 text-sm">{errors.allowedDays.message}</p>
                            )}
                          </div> */}
            <div className="">
  <label className={`${inputLabelClassName}`}>
    Perday Salary Percent <span className="text-red-600">*</span>
  </label>
  
  <input
    type="number"
    step="0.01"
    {...register("perdaySalaryPercent", {
      required: "Perday Salary Percent is required",
      min: {
        value: 0,
        message: "Percentage must be at least 0%",
      },
      max: {
        value: 100,
        message: "Percentage cannot exceed 100%",
      },
    })}
    className={`${inputClassName} ${errors.perdaySalaryPercent ? "border-[1px] border-red-500" : "border-gray-300"}`}
    placeholder="Enter Perday Salary Percent"
  />

  {errors.perdaySalaryPercent && (
    <p className="text-red-500 text-sm">{errors.perdaySalaryPercent.message}</p>
  )}
</div>


          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
            <div>
              <label className={`${inputLabelClassName}`}>
                Status <span className="text-red-600">*</span>
              </label>
           
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
              disabled={wfhManagerLoading}
              className={`${wfhManagerLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 mt-3 rounded`}
            >
            {wfhManagerLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default UpdatewfhManager;
