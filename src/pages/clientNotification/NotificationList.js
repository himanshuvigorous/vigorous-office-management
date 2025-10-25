import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { useForm, useWatch } from "react-hook-form";
import { deleteNotification, getNotificationList, notificationSearch } from "./notificationFeatures/_notification_reducers"
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers"
import { domainName, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../constents/global"
import { FaPlus } from "react-icons/fa"
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { encrypt } from "../../config/Encryption";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import getUserIds from "../../constents/getUserIds";
import { Tooltip } from "antd";

function NotificationList() {
    const { register, setValue, formState: { errors }, control } = useForm();
    const {
        userCompanyId,
        userDirectorId,
        userBranchId,
        userEmployeId,
        userDepartmentId,
        userDesignationId,
        userType
    } = getUserIds();
    const { companyList } = useSelector((state) => state.company);
    const { notificationList, totalNotificationCount } = useSelector(state => state.notification);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const companyId = useWatch({
        control,
        name: "PDCompanyId",
        defaultValue: userCompanyId,
    });
    const branchId = useWatch({
        control,
        name: "PDBranchId",
        defaultValue: userBranchId,
    });
    const notificationType = useWatch({
        control,
        name: "notificationType",
        defaultValue: userBranchId,
    });
    useEffect(() => {
        if (userType === "admin") {
            dispatch(companySearch({
                text: "",
                sort: true,
                status: true,
                isPagination: false,
            }));
        }
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    const limit = 10;

    useEffect(() => {
        fetchNotificationList();
    }, [currentPage])

    const fetchNotificationList = () => {
        const reqListData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId: companyId,
                branchId: branchId,
                "directorId": "",
                text: "",
                sort: true,
                status: "",
                isPagination: true,
            }
        }
        dispatch(getNotificationList(reqListData));
    }
    const handleDelete = (id) => {
        let reqData = {
            _id: id
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteNotification(reqData)).then((data) => {
                    !data.error && getNotificationList();
                })
            }
        });
    };

    const handleOnChange = async (event) => {
        const searchValue = event.target.value;
        setValue("notificationType", searchValue);

        if (searchValue.trim().length > 0) {
            const reqListData = {
                page: currentPage,
                limit: limit,
                reqPayload: {
                    companyId: companyId,
                    branchId: branchId,
                    "directorId": "",
                    text: "",
                    sort: true,
                    status: "",
                    isPagination: false,
                    notificationType: searchValue
                }
            }
            dispatch(getNotificationList(reqListData));
        }
    };


    return (
        <GlobalLayout>
            {/* <h2 className="text-2xl font-bold col-span-2">
                User Designations
            </h2> */}
            <div className=''>
                {/* <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
                    <div className="relative flex items-center">
                        <FaSearch className="absolute left-3 text-gray-400" size={14} />
                        <input
                            type="text"
                            {...register("search")}
                            onChange={handleOnChange}
                            className="pl-10 pr-4 py-2 text-left rounded-md text-[12px] border border-gray-300 bg-white"
                            placeholder="Search Anything.."
                        />
                    </div>
                    <LoginDetails />
                </div> */}

                <div className='flex justify-between items-center md:space-y-0 space-y-2 py-1'>
                    <div className="flex justify-start">
                        <div className="w-fit">
                            <label className={`${inputLabelClassName}`}>
                                Type<span className="text-red-600">*</span>
                            </label>
                            <select
                                {...register("notificationType", {
                                    required: "Type is required",
                                })}
                                className={` ${inputClassName} ${errors.notificationType
                                    ? "border-[1px] "
                                    : "border-gray-300"
                                    }`}
                                onChange={handleOnChange}
                            >
                                <option className="" value="">Select Type</option>
                                <option value="group">Client Group</option>
                                <option value="client">Client Wise</option>
                                <option value="department">Department Wise</option>
                                <option value="other">other</option>
                            </select>
                        </div>
                        {userType === "admin" && (
                            <div className="">
                                <select
                                    {...register("PDCompanyId", {
                                        required: "company is required",
                                    })}
                                    className={` ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                                        }`}
                                >
                                    <option className="" value="">
                                        Select Comapany
                                    </option>
                                    {companyList?.map((type) => (
                                        <option value={type?._id}>{type?.fullName}</option>
                                    ))}
                                </select>
                                {errors.PDCompanyId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.PDCompanyId.message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    <button onClick={() => { navigate("/admin/notification/create") }} className='bg-header p-2 rounded-md flex justify-center items-center space-x-2 text-white'>
                        <FaPlus />
                        <span className='text-[12px] tracking-wide'>Add Notification</span>
                    </button>
                </div>
            </div>
            <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
                <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                    <thead className=''>
                        <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                            <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                SNo.
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Type
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Subject
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[30%]'>
                                Message
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Status
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificationList && notificationList?.length > 0 ?
                            notificationList?.map((element, index) => (
                                <tr key={index} className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                    <td className='whitespace-nowrap border-none p-2 '>
                                        {index + 1 + ((currentPage - 1) * limit)}
                                    </td>
                                    <td className='whitespace-nowrap border-none p-2 '>{element?.notificationType ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{element?.subject ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{element?.message ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>
                                        <span className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500'
                                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                                            {element?.status ? 'Active' : 'Inactive' ?? "-"}
                                        </span>
                                    </td>
                                    <td className='whitespace-nowrap border-none p-2'>
                                        <span className="py-1.5 flex justify-start items-center space-x-2">
                                            {/* <button onClick={() => { navigate(`/admin/notification/edit/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                            </button> */}
                                            <Tooltip placement="topLeft"  title='Delete'>
                                            <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                            </button>
                                            </Tooltip>
                                        </span>
                                    </td>
                                </tr>
                            ))
                            : (<tr className="bg-white bg-opacity-5 " >
                                <td colSpan={4} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                            </tr>)}
                    </tbody>
                </table>
            </div>
            {notificationList?.length > 0 &&
                <CustomPagination
                    totalCount={totalNotificationCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />}
        </GlobalLayout>
    )
}
export default NotificationList