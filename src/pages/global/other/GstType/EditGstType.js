import { useForm } from "react-hook-form";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { decrypt } from "../../../../config/Encryption";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  inputClassName,
  inputLabelClassName,
} from "../../../../constents/global";
import { getGstTypeByIdFunc, updateGstTypeFunc } from "./GstTypeFeatures/_gstType_reducers";
import Loader from "../../../../global_layouts/Loader";

function EditGstType() {
  const { loading: gstTypeLoading } = useSelector(state => state.gstType)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gstTypeIdEnc } = useParams();
  const gstTypeId = decrypt(gstTypeIdEnc);
  const { GstTypeDetailsDataById } = useSelector((state) => state.gstType);

  useEffect(() => {
    let reqData = {
      _id: gstTypeId,
    };
    dispatch(getGstTypeByIdFunc(reqData));
  }, []);

  useEffect(() => {
    if (GstTypeDetailsDataById) {
      // setValue("gstTypeName", GstTypeDetailsDataById?.name);
      setValue("percentage", GstTypeDetailsDataById?.percentage);
    }
  }, [GstTypeDetailsDataById]);

  const onSubmit = (data) => {
    const finalPayload = {
      "companyId": GstTypeDetailsDataById?.companyId,
      "directorId": GstTypeDetailsDataById?.directorId,
      "branchId": GstTypeDetailsDataById?.branchId,


      _id: gstTypeId,
      // name: data.gstTypeName,
      percentage: +data.percentage,
    };

    dispatch(updateGstTypeFunc(finalPayload)).then((data) => {
      if (!data.error) navigate(-1);
    });
  };

  return (
    <GlobalLayout>
      <div className="gap-4">
        <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2 md:my-2">
            {/* <div className="">
              <label className={`${inputLabelClassName}`}>Gst Type</label>
              <input
                type="text"
                {...register("gstTypeName", {
                  required: "Gst Type is required",
                })}
                className={` ${inputClassName} ${
                  errors.gstTypeName ? "border-[1px] " : "border-gray-300"
                } `}
                placeholder="Enter Gst Type"
              />
              {errors.gstTypeName && (
                <p className="text-red-500 text-sm">
                  {errors.gstTypeName.message}
                </p>
              )}
            </div> */}
            <div className="">
              <label className={`${inputLabelClassName}`}>Percentage</label>
              <input
                type="number"
                {...register("percentage", {
                  required: "Percentage is required",
                })}
                className={` ${inputClassName} ${errors.percentage ? "border-[1px] " : "border-gray-300"
                  } `}
                placeholder="Enter Percentage"
                step="any"
              />
              {errors.percentage && (
                <p className="text-red-500 text-sm">
                  {errors.percentage.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end ">
            <button
              type="submit"
              disabled={gstTypeLoading}
              className={`${gstTypeLoading ? 'bg-gray-400' : 'bg-header'} text-white p-2 mt-3 px-4 rounded`}
            >
              {gstTypeLoading ? <Loader /> : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </GlobalLayout>
  );
}

export default EditGstType;
