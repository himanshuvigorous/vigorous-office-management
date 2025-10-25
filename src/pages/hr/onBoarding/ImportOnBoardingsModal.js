import { Modal, Select } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ListLoader from '../../../global_layouts/ListLoader';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { domainName, inputAntdSelectClassName, inputLabelClassName, sortByPropertyAlphabetically } from '../../../constents/global';
import { employeExcelDownloadFunc, importDirectOnBoarding } from './onBoardingFeatures/_onBoarding_reducers';
import { downloadExcelFunc } from '../../../redux/_reducers/_reports_reducers';
import ValidationResultsModal from './ValidationResultsModal';

const ImportOnBoardingsModal = ({ isOpen, onClose, fetchList }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const branchId = useWatch({
        control,
        name: "PDBranchId",
        defaultValue: "",
    });
    const companyId = useWatch({
        control,
        name: "PDCompanyId",
        defaultValue: "",
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const dispatch = useDispatch();
    const { branchList, branchListloading } = useSelector((state) => state.branch);
    const { companyList, companyListLoading } = useSelector((state) => state.company);
    const { importDirectOnBoardingData : validationResults } = useSelector((state) => state.onBoarding);
    const fileInputRef = useRef(null);
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
    useEffect(() => {
        if (
            (userInfoglobal?.userType === "admin" && companyId) ||
            (userInfoglobal?.userType === "company" && userInfoglobal?._id) ||
            userInfoglobal?.userType === "companyDirector"
        ) {
            setValue("PDBranchId", "");
            dispatch(
                branchSearch({
                    companyId:
                        userInfoglobal?.userType === "admin"
                            ? companyId
                            : userInfoglobal?.userType === "company"
                                ? userInfoglobal?._id
                                : userInfoglobal?.companyId,
                    text: "",
                    sort: true,
                    status: true,
                    isPagination: false,
                })
            );
        }
    }, [companyId]);



    const onFormSubmit = (data) => {
        const formData = new FormData();
        formData.append("filePath", data?.filePath[0]);
        formData.append("companyId", userInfoglobal?.userType === "admin"
            ? companyId
            : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId);
        formData.append("branchId", userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? (branchId ? branchId : "")
            : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId);
        formData.append("directorId", "");
        dispatch(importDirectOnBoarding(formData)).then((res) => {
            if (!res?.error) {
                setIsModalVisible(true);
                fetchList()
                onClose()
                reset()
                fileInputRef.current.value = ''
            }
           
        })
    }

    const handleDownloadExcel = () => {
        dispatch(employeExcelDownloadFunc({"userType": "employee"})).then((res) => {
            if (!res?.error) {
                window.location.href=res?.payload?.downloadUrl
            }
           
        })
    }
    return (
        <> 
            <ValidationResultsModal
             open={isModalVisible}
             onClose={() => setIsModalVisible(false)}
             summary={validationResults?.companyinfo?.data?.summary}
             details={validationResults?.companyinfo?.data?.details}
             
      />
      <Modal
            visible={isOpen}
            onCancel={() => {
                fileInputRef.current.value = ''
                reset({
                    PDBranchId: '',
                    "filePath": []
                });
                onClose();

            }}
            footer={null}
            title="Import Employee"
            width={600}
            zIndex={1050}
 className="antmodalclassName"


        >
            <form autoComplete="off" onSubmit={handleSubmit(onFormSubmit)} className="">
        
                <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                    {userInfoglobal?.userType === "admin" && (
                        <div>
                            <label className={`${inputLabelClassName}`}>Company <span className="text-red-600">*</span></label>
                            <Controller
                                control={control}
                                name="PDCompanyId"
                                rules={{ required: "Company is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        className={`${inputAntdSelectClassName} `}
                                    >
                                        <Select.Option value="">Select Company</Select.Option>
                                        {companyListLoading ? <Select.Option disabled><ListLoader /></Select.Option> :
                                            (companyList?.map((type) => (
                                                <Select.Option key={type?._id} value={type?._id}>
                                                    {type?.fullName}
                                                </Select.Option>
                                            )))
                                        }
                                    </Select>
                                )}
                            />
                            {errors.PDCompanyId && (
                                <p className="text-red-500 text-sm">
                                    {errors.PDCompanyId.message}
                                </p>
                            )}
                        </div>
                    )}

                    {(userInfoglobal?.userType === "admin" ||
                        userInfoglobal?.userType === "company" ||
                        userInfoglobal?.userType === "companyDirector") && (
                            <div className=''>
                                <label className={`${inputLabelClassName}`}>Branch <span className="text-red-600">*</span></label>
                                <Controller
                                    control={control}
                                    name="PDBranchId"
                                    rules={{ required: "Branch is required" }}

                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            getPopupContainer={() => document.body}
                                            dropdownStyle={{ zIndex: 2000 }}

                                            className={`${inputAntdSelectClassName} `}
                                        >
                                            <Select.Option value="">Select Branch</Select.Option>
                                            {branchListloading ? <Select.Option disabled><ListLoader /></Select.Option> :
                                                (sortByPropertyAlphabetically(branchList, 'fullName')?.map((type) => (
                                                    <Select.Option key={type?._id} value={type?._id}>
                                                        {type?.fullName}
                                                    </Select.Option>
                                                )))
                                            }
                                        </Select>
                                    )}
                                />
                                {errors.PDBranchId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.PDBranchId.message}
                                    </p>
                                )}
                            </div>
                        )}
                    <Controller
                        name="filePath"
                        control={control}
                        defaultValue={[]}
                        rules={{
                            validate: (files) => files.length > 0 || 'File is required',
                        }}
                        render={({ field }) => (
                            <div className='flex flex-col gap-2'>
                                <label className={`${inputLabelClassName}`}>Upload File <span className="text-red-600">*</span></label>
                                <button
                                    type="button"
                                    onClick={() => document.getElementById('hiddenFileInput').click()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Upload
                                </button>
                                <input
                                    type="file"
                                    id="hiddenFileInput"
                                    ref={fileInputRef}
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    style={{ display: 'none' }}
                                    onChange={(e) => field.onChange(e.target.files)}
                                />
                                {field.value.length > 0 && (
                                    <p className="text-green-600 text-sm">
                                        {field.value[0].name}
                                    </p>
                                )}
                                {errors.filePath && (
                                    <p className="text-red-500 text-sm">{errors.filePath.message}</p>
                                )}
                            </div>
                        )}
                    />
                </div>
                <div className="flex justify-between items-center gap-2 mt-4">
                    <button type="button" onClick={() => handleDownloadExcel()} target='_blank' className={`bg-header text-white p-2 px-4 rounded`} >DownLoad Excel</button>

                    <button
                        type="submit"
                        className={`bg-header text-white p-2 px-4 rounded`}
                    >
                        {'Submit'}
                    </button>

                </div>
            </form>

        </Modal >
        </>
        
    );
};

export default ImportOnBoardingsModal;