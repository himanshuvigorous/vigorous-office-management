import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Label from "../../component/Label/Label.js";
import InputBox from "../../component/InputBox/InputBox.js";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout.js";
import { useForm } from "react-hook-form";
import { createOrgType } from "./organizationTypeFeatures/_org_type_reducers.js";
import { domainName, inputClassName, inputLabelClassName } from "../../constents/global.js";
import Loader from "../../global_layouts/Loader.js";


const CreateOrganizationType = () => {
    const { loading:oragnisationTypeLoading} = useSelector(state => state.orgType)

    const { register, handleSubmit, formState: { errors } } = useForm();
const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = (data) => {
        const finalPayload = {
           companyId:
          userInfoglobal?.userType === "admin"
            ? ''
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
            "name": data?.organizationTypeName,
            "status": data?.status,
        };
        dispatch(createOrgType(finalPayload)).then((data) => {
            if (!data.error) navigate(-1);
        });
    }

    return (
        <GlobalLayout>
            <div className="gap-4">
                {/* <h2 className="text-2xl font-bold mb-4 col-span-2">
                    Add Organization Types
                </h2> */}
                <form autoComplete="off" className="mt-5 md:px-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                        <div className="">
                            <label className={`${inputLabelClassName}`}>Name <span className="text-red-600">*</span></label>
                            <input
                                type="text"
                                {...register("organizationTypeName", {
                                    required: "Organization Type is required",
                                })}
                                className={` ${inputClassName} ${errors.organizationTypeName ? "border-[1px] " : "border-gray-300"
                                    } `}
                                placeholder="Enter Organization Type"
                            />
                            {errors.organizationTypeName && (
                                <p className="text-red-500 text-sm">
                                    {errors.organizationTypeName.message}
                                </p>
                            )}
                        </div>
                        {/* <div>
                            <label className={`${inputLabelClassName}`}>Status <span className="text-red-600">*</span></label>
                            <select
                                {...register("status", { required: "Status is required" })}
                                className={`bg-white ${errors.status ? "border-[1px] " : "border-gray-300"} ${inputClassName}`}
                            >
                                <option value="">Select Status</option>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm">{errors.status.message}</p>
                            )}
                        </div> */}
                    </div>
                    <div className="flex justify-end ">
                    <button
              type="submit"
              disabled={oragnisationTypeLoading}
              className={`${oragnisationTypeLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 rounded`}
            >
            {oragnisationTypeLoading ? <Loader /> : 'Submit'}
            </button>
                    </div>

                </form>


            </div>
        </GlobalLayout>
    )
}

export default CreateOrganizationType