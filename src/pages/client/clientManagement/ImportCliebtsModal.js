import { Modal, Select } from 'antd';
import React, { useEffect, useRef ,useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import ListLoader from '../../../global_layouts/ListLoader';
import { branchSearch } from '../../branch/branchManagement/branchFeatures/_branch_reducers';
import { companySearch } from '../../company/companyManagement/companyFeatures/_company_reducers';
import { domainName, inputAntdSelectClassName, inputLabelClassName, sortByPropertyAlphabetically } from '../../../constents/global';
import Loader from '../../../global_layouts/Loader';
import { importClients } from './clientFeatures/_client_reducers';
import { downloadExcelFunc } from '../../../redux/_reducers/_reports_reducers';
import ValidationResultsModal from '../../hr/onBoarding/ValidationResultsModal';
import { employeExcelDownloadFunc } from '../../hr/onBoarding/onBoardingFeatures/_onBoarding_reducers';

const ImportCliebtsModal = ({ isOpen, onClose, fetchList }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            filePath: []
        }
    });
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
    const fileInputRef = useRef(null);
    const { importClientsData : validationResults } = useSelector((state) => state.client);

    //   const handleFileChange = (event) => {
    //     const file = event.target.files[0];
    //     setValue("filepath" , file)
    //     // if (file) {
    //     //   const formData = new FormData();
    //     //   formData.append("filePath", file);
    //     //   formData.append("companyId", "68036597fc0a68c5b308b82f");
    //     //   formData.append("branchId", "680b206ba0a321a0c689a3df");
    //     //   formData.append("directorId", "");

    //     //   // Dispatch Redux action
    //     //   dispatch(importDirectOnBoarding(formData));
    //     // }
    //   };

    const handleDownloadExcel = () => {
        dispatch(employeExcelDownloadFunc({"userType": "client"})).then((res) => {
            if (!res?.error) {
                window.location.href=res?.payload?.downloadUrl
            }
           
        })
    }


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
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
                ? userInfoglobal?._id
                : userInfoglobal?.branchId);
        formData.append("directorId", "");
        dispatch(importClients(formData)).then((res) => {
            if (!res?.error) {
                setIsModalVisible(true);
                fetchList()
                onClose()
                reset()
            }
        })
    }


    return (
       <>
        <ValidationResultsModal
          open={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          summary={validationResults?.data?.summary}
          details={validationResults?.data?.details}
          
      />
        <Modal
        className="antmodalclassName"
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
            title="Import Clients"
            width={600}
            height={400}
            zIndex={1050}

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
                            <div>
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

                        rules={{
                            validate: (files) => files?.length > 0 || 'File is required',
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
                                {field?.value?.length > 0 && (
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
        </Modal>
       </>
    );
};

export default ImportCliebtsModal;