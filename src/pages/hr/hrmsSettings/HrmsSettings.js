import React, { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import GlobalLayout from '../../../global_layouts/GlobalLayout/GlobalLayout'
import { domainName, formButtonClassName, formButtonClassNameDisabled, inputAntdSelectClassName, inputClassName, inputDisabledClassName, inputLabelClassName } from '../../../constents/global'
import { useDispatch, useSelector } from 'react-redux'
import getUserIds from '../../../constents/getUserIds'
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers'
import { getHrmsSettingsDetails, updateHrmsSettings } from './hrmsSettingsFeatures/_hrms_settings_reducers'
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers'
import { Select } from 'antd'
import usePermissions from '../../../config/usePermissions'
import ListLoader from '../../../global_layouts/ListLoader'

function HrmsSettings() {
    const { register, handleSubmit, formState: { errors }, control, setValue } = useForm()
    const dispatch = useDispatch()
    const { companyList, companyListLoading } = useSelector((state) => state.company);
    const { branchList, branchListloading } = useSelector((state) => state.branch);
    const { hrmsSettingsData } = useSelector((state) => state.hrmsSetting);
    const [editable, setEditable] = useState(false);
   
    const { userType } = getUserIds();
    const companyId = useWatch({
        control,
        name: "companyId",
        defaultValue: ""
    });
    const branchId = useWatch({
        control,
        name: "PDBranchId",
        defaultValue: ""
    });
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    useEffect(() => {
        if (userType === "admin") {
            dispatch(companySearch({ isPagination: false, text: "", sort: true, status: true }));
        }
    }, []);
    useEffect(() => {
        if (
            companyId ||
            userType === "company" ||
            userType === "companyDirector"
        ) {
            setValue("PDBranchId", "")
            dispatch(
                branchSearch({
                    text: "",
                    sort: true,
                    status: true,
                    isPagination: false,
                    companyId: userType === "admin" ? companyId : userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                })
            );
        }
    }, [companyId])


    useEffect(() => {

        if ((userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId) && (userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId) && !editable) {
            fetchHrmsSettingsData()
        }
    }, [companyId, branchId, editable])
    const fetchHrmsSettingsData = () => {
        dispatch(getHrmsSettingsDetails({
            companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
            branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
        }))
    }


    useEffect(() => {

        setValue("basicSalaryAmountForPf", hrmsSettingsData?.basicSalaryAmountForPf ? hrmsSettingsData?.basicSalaryAmountForPf : "")
        setValue("basicSalaryPercentage", hrmsSettingsData?.basicSalaryPercentage ? hrmsSettingsData?.basicSalaryPercentage : "")
        setValue("pfPercentage", hrmsSettingsData?.pfPercentage ? hrmsSettingsData?.pfPercentage : "")
        setValue("fixedPf", hrmsSettingsData?.fixedPf ? hrmsSettingsData?.fixedPf : "")
        setValue("esicEmployeePercentage", hrmsSettingsData?.esicEmployeePercentage ? hrmsSettingsData?.esicEmployeePercentage : "")
        setValue("esicEmployerPercentage", hrmsSettingsData?.esicEmployerPercentage ? hrmsSettingsData?.esicEmployerPercentage : "")
        setValue("esicAmount", hrmsSettingsData?.esicAmount ? hrmsSettingsData?.esicAmount : '')
        setValue("minWorkingHrs", hrmsSettingsData?.minWorkingMin ? hrmsSettingsData?.minWorkingMin : '')
        setValue("overtimeSkipHrs", hrmsSettingsData?.overtimeSkipMin ? hrmsSettingsData?.overtimeSkipMin : "")
        setValue("lateTimeInMin", hrmsSettingsData?.lateTimeInMin ? hrmsSettingsData?.lateTimeInMin : "")
        setValue("noticePeriod", hrmsSettingsData?.noticePeriod ? hrmsSettingsData?.noticePeriod : "")
        setValue("empUserPrefix", hrmsSettingsData?.employeUserNamePrefix ? hrmsSettingsData?.employeUserNamePrefix : "")
        setValue("clientUserPrefix", hrmsSettingsData?.clientUserNamePrefix ? hrmsSettingsData?.clientUserNamePrefix : "")
        setValue("vendorUserNamePrefix", hrmsSettingsData?.vendorUserNamePrefix ? hrmsSettingsData?.vendorUserNamePrefix : "")
        setValue("groupNamePrefix", hrmsSettingsData?.groupNamePrefix ? hrmsSettingsData?.groupNamePrefix : "")
        setValue("taskNamePrefix", hrmsSettingsData?.taskNamePrefix ? hrmsSettingsData?.taskNamePrefix : "")
        setValue("attendanceDisInMeter", hrmsSettingsData?.attendanceDisInMeter ? hrmsSettingsData?.attendanceDisInMeter : "")
        setValue("recruitmentEmail",hrmsSettingsData?.recruitmentEmail ? hrmsSettingsData?.recruitmentEmail :"" )




    }, [hrmsSettingsData])

    const onSubmit = (data) => {
        const reqPayload = {
            "employeUserNamePrefix": data?.empUserPrefix,
            "clientUserNamePrefix": data?.clientUserPrefix,
            "vendorUserNamePrefix": data?.vendorUserNamePrefix,
            "groupNamePrefix": data?.groupNamePrefix,
            "taskNamePrefix": data?.taskNamePrefix,
            companyId: userInfoglobal?.userType === "admin" ? companyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
            branchId: userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch" ? userInfoglobal?._id : userInfoglobal?.branchId,
            "basicSalaryAmountForPf": +data?.basicSalaryAmountForPf,
            "basicSalaryPercentage": +data?.basicSalaryPercentage,
            "pfPercentage": +data?.pfPercentage,
            "fixedPf": +data?.fixedPf,
            "esicEmployeePercentage": +data?.esicEmployeePercentage,
            "esicEmployerPercentage": +data?.esicEmployerPercentage,
            "esicAmount": +data?.esicAmount,
            "minWorkingMin": +data?.minWorkingHrs,
            "overtimeSkipMin": +data?.overtimeSkipHrs,
            "lateTimeInMin": +data?.lateTimeInMin,
            'noticePeriod': +data?.noticePeriod,
            'attendanceDisInMeter': +data?.attendanceDisInMeter,
            recruitmentEmail:data?.recruitmentEmail
        }
        dispatch(updateHrmsSettings(reqPayload)).then((response) => {
            !response.error && fetchHrmsSettingsData()
        })
    }






    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();


    return (
        <GlobalLayout>
            {canRead && <form autoComplete="off" className='mt-2 md:px-1' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex justify-between items-center'>
                    {canUpdate && <button onClick={() => setEditable(!editable)} type="button" className={`${formButtonClassName}`}>{editable ? "Cancel" : "Edit"}</button>}
                    {canUpdate && <button disabled={!editable} type="submit" className={`${editable ? formButtonClassName : formButtonClassNameDisabled}`}>Submit</button>}
                </div>
                <div className='border border-header mt-2 rounded-lg '>
                    <div className='bg-header text-white py-2 px-4 rounded-t-lg'>Basic Settings</div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2'>
                        {userType === "admin" && <div className="">
                            <label className={`${inputLabelClassName}`}>
                                Company
                            </label>
                            <select

                                {...register("companyId", {
                                    required: "Company is required",
                                })}
                                className={` ${inputClassName} ${errors.companyId
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                            >
                                <option className="" value="">
                                    Select Company
                                </option>
                                {companyListLoading ? <Select.Option disabled>
                                    <ListLoader />
                                </Select.Option> : (companyList?.map((type) => (
                                    <option value={type?._id}>
                                        {type?.fullName}({type?.userName})
                                    </option>
                                )))}
                            </select>

                            {errors.companyId && (
                                <p className="text-red-500 text-sm">
                                    {errors.companyId.message}
                                </p>
                            )}
                        </div>}
                        {(userType === "admin" || userType === "company" || userType === "companyDirector") && <div className="">
                            <label className={`${inputLabelClassName}`}>
                                Branch
                            </label>
                            <Controller
                                name="PDBranchId"
                                control={control}
                                rules={{ required: "Branch is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={`${inputAntdSelectClassName} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
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
                      




                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Notice Period (days)
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                step="0.0001"
                                {...register("noticePeriod")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.noticePeriod ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter Notice Period "
                            />
                            {errors.noticePeriod && (
                                <p className="text-red-500 text-sm">
                                    {errors.noticePeriod.message}
                                </p>
                            )}
                        </div>
                         <div>
                            <label className={`${inputLabelClassName}`}>
                                Recruitment Email
                            </label>
                            <input
                                type="email"
                                disabled={!editable}
                                {...register("recruitmentEmail", {
                       
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                               
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.recruitmentEmail ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter Email "
                            />
                            {errors.recruitmentEmail && (
                                <p className="text-red-500 text-sm">
                                    {errors.recruitmentEmail.message}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Allowed Attendance Meters 
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                
                                {...register("attendanceDisInMeter")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.attendanceDisInMeter ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter  Allowed Attendance Meters "
                            />
                            {errors.attendanceDisInMeter && (
                                <p className="text-red-500 text-sm">
                                    {errors.attendanceDisInMeter.message}
                                </p>
                            )}
                        </div>
                        
                    </div>
                </div>

                <div className='border border-header mt-2 rounded-lg '>
                    <div className='bg-header text-white py-2 px-4 rounded-t-lg'>PF Settings</div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2'>
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Basic Salary Amount for PF
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                {...register("basicSalaryAmountForPf")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.basicSalaryAmountForPf ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter Basic Salary Amount for PF"
                            />
                            {errors.basicSalaryAmountForPf && (
                                <p className="text-red-500 text-sm">
                                    {errors.basicSalaryAmountForPf.message}
                                </p>
                            )}
                        </div>



                        <div>
                            <label className={`${inputLabelClassName}`}>
                                PF Percentage
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                step="0.01"
                                {...register("pfPercentage")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.pfPercentage ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter PF Percentage"
                            />
                            {errors.pfPercentage && (
                                <p className="text-red-500 text-sm">
                                    {errors.pfPercentage.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Fixed PF
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                {...register("fixedPf")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.fixedPf ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter Fixed PF"
                            />
                            {errors.fixedPf && (
                                <p className="text-red-500 text-sm">
                                    {errors.fixedPf.message}
                                </p>
                            )}
                        </div>

                    </div>
                </div>







                <div className='border border-header mt-2 rounded-lg '>
                    <div className='bg-header text-white py-2 px-4 rounded-t-lg'>Pre Fix Settings</div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2'>
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Employee UserName Prefix
                            </label>
                            <input
                                type="text"
                                disabled={!editable}
                                {...register("empUserPrefix")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.empUserPrefix ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Employee UserName Prefix"
                            />
                            {errors.empUserPrefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.empUserPrefix.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Client UserName Prefix
                            </label>
                            <input
                                type="text"
                                disabled={!editable}
                                {...register("clientUserPrefix")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.clientUserPrefix ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Client UserName Prefix"
                            />
                            {errors.clientUserPrefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.clientUserPrefix.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Vendor UserName Prefix
                            </label>
                            <input
                                type="text"
                                disabled={!editable}
                                {...register("vendorUserNamePrefix")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.vendorUserNamePrefix ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="vendorUserNamePrefix Prefix"
                            />
                            {errors.vendorUserNamePrefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.vendorUserNamePrefix.message}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Group UserName Prefix
                            </label>
                            <input
                                type="text"
                                disabled={!editable}
                                {...register("groupNamePrefix")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.groupNamePrefix ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="groupNamePrefix Prefix"
                            />
                            {errors.groupNamePrefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.groupNamePrefix.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`${inputLabelClassName}`}>
                                Task UserName Prefix
                            </label>
                            <input
                                type="text"
                                disabled={!editable}
                                {...register("taskNamePrefix")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.taskNamePrefix ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="taskNamePrefix Prefix"
                            />
                            {errors.taskNamePrefix && (
                                <p className="text-red-500 text-sm">
                                    {errors.taskNamePrefix.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='border border-header mt-2 rounded-lg '>
                    <div className='bg-header text-white py-2 px-4 rounded-t-lg'>ESIC Settings</div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2'>
                        <div>
                            <label className={`${inputLabelClassName}`}>
                                ESIC Employee Percentage
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                step="0.0001"
                                {...register("esicEmployeePercentage")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.esicEmployeePercentage ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter ESIC Employee Percentage"
                            />
                            {errors.esicEmployeePercentage && (
                                <p className="text-red-500 text-sm">
                                    {errors.esicEmployeePercentage.message}
                                </p>
                            )}
                        </div>


                        <div>
                            <label className={`${inputLabelClassName}`}>
                                ESIC Employer Percentage
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                step="0.0001"
                                {...register("esicEmployerPercentage")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.esicEmployerPercentage ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter ESIC Employer Percentage"
                            />
                            {errors.esicEmployerPercentage && (
                                <p className="text-red-500 text-sm">
                                    {errors.esicEmployerPercentage.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className={`${inputLabelClassName}`}>
                                ESIC Amount
                            </label>
                            <input
                                type="number"
                                disabled={!editable}
                                {...register("esicAmount")}
                                className={`${!editable ? inputDisabledClassName : inputClassName} ${errors.esicAmount ? "border-[1px] " : "border-gray-300"}`}
                                placeholder="Enter ESIC Amount"
                            />
                            {errors.esicAmount && (
                                <p className="text-red-500 text-sm">
                                    {errors.esicAmount.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </form>}
        </GlobalLayout>
    )
}

export default HrmsSettings
