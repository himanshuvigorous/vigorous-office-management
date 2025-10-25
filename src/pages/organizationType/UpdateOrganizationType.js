import { Controller, useForm } from "react-hook-form";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { decrypt } from "../../config/Encryption";
import { useEffect } from "react";
import { getOrgTypeDetails, updateOrgType } from "./organizationTypeFeatures/_org_type_reducers";
import { domainName, inputAntdSelectClassName, inputClassName, inputLabelClassName } from "../../constents/global";
import { Select } from "antd";
import Loader from "../../global_layouts/Loader";


const UpdateOrganizationType = () => {
        const { loading:oragnisationTypeLoading} = useSelector(state => state.orgType)

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { orgTypeIdEnc } = useParams();
    const orgTypeId = decrypt(orgTypeIdEnc);
    const { orgTypeData } = useSelector((state) => state.orgType);

    useEffect(() => {
        let reqData = {
            _id: orgTypeId,
        };
        dispatch(getOrgTypeDetails(reqData));
    }, []);
    const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

    useEffect(() => {
        if (orgTypeData) {
            setValue("organizationTypeName", orgTypeData?.name);
            setValue("status", orgTypeData?.status);
        }

    }, [orgTypeData]);

    const onSubmit = (data) => {
        const finalPayload = {
            _id: orgTypeId,
            companyId:
          userInfoglobal?.userType === "admin"
            ? ''
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
            "name": data?.organizationTypeName,
            "status": data?.status
        };

        dispatch(updateOrgType(finalPayload)).then((data) => {
            if (!data.error) navigate(-1);
        });
    };


    return (
        <GlobalLayout>
            <div className="gap-4">
                {/* <h2 className="text-2xl font-bold mb-4 col-span-2">
                    Update Organization Types : {orgTypeData?.organizationTypeName}
                </h2> */}
                <form autoComplete="off" className="mt-0 md:px-1" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:my-2">
                        <div className="w-full">
                            <label className={`${inputLabelClassName}`}>
                                Name <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                {...register("organizationTypeName", {
                                    required: "Designation Name is required",
                                })}
                                className={`placeholder: ${inputClassName} ${errors.organizationTypeName
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                placeholder="Enter Designation Name"
                            />
                            {errors.organizationTypeName && (
                                <p className="text-red-500 text-sm">
                                    {errors.organizationTypeName.message}
                                </p>
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
                    <div className="flex justify-end ">
                    <button
              type="submit"
              disabled={oragnisationTypeLoading}
              className={`${oragnisationTypeLoading ? 'bg-gray-400': 'bg-header' } text-white p-2 px-4 mt-3 rounded`}
            >
            {oragnisationTypeLoading ? <Loader /> : 'Submit'}
            </button>
                    </div>
                </form>
            </div>
        </GlobalLayout>
    )
}

export default UpdateOrganizationType