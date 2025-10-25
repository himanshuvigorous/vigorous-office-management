import { FaAngleDown, FaAngleUp, FaPenToSquare, FaPlus } from "react-icons/fa6"
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { encrypt } from "../../config/Encryption"
import { RiDeleteBin5Line } from "react-icons/ri"
import Swal from "sweetalert2"
import { Controller, useForm, useWatch } from "react-hook-form";
import { HiOutlineFilter } from "react-icons/hi";
import { domainName, inputClassNameSearch } from "../../constents/global";
import getUserIds from '../../constents/getUserIds';
import CustomPagination from "../../component/CustomPagination/CustomPagination"
import { deleteTimeSlotsFunc, getTimeSlotList } from "./timeSlotsFeatures/_timeSlots_reducers"
import { branchSearch } from "../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip } from "antd"
import usePermissions from "../../config/usePermissions"
import Loader2 from "../../global_layouts/Loader/Loader2"
import dayjs from "dayjs"

function TimeSlotsList() {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { timeSlotsListData, totalTimeSlotsCount , loading } = useSelector(state => state.timeSlots)
    // const { companyList } = useSelector((state) => state.company);
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    const { companyList } = useSelector((state) => state.company);
    const { branchList } = useSelector((state) => state.branch);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchText, setSearchText] = useState("");
    const [status, setStatus] = useState("");

    const CompanyId = useWatch({
        control,
        name: "PDCompanyId",
        defaultValue: "",
    });
    const BranchId = useWatch({
        control,
        name: "PDBranchId",
        defaultValue: "",
    });

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    const limit = 10;

    useEffect(() => {
        fetchTimeSlotsList();
    }, [CompanyId, BranchId, status,currentPage, searchText])


    const fetchTimeSlotsList = () => {
        const reqListData = {
            limit: limit,
            page: currentPage,
            reqPayload: {
                "text": searchText,
                "sort": true,
                "status": status,
                isPagination: true,
                companyId: CompanyId,
                "directorId": "",
                branchId:
                    userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
                        ? userInfoglobal?._id
                        : userInfoglobal?.branchId,
            }
        }
        dispatch(getTimeSlotList(reqListData));
    }

    const handleDelete = (id) => {
        let reqData = {
            _id: id,
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteTimeSlotsFunc(reqData)).then((data) => {
                    fetchTimeSlotsList();
                })
            }
        });
    };



    useEffect(() => {
        if (
            CompanyId ||
            userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "companyDirector"
        ) {
            dispatch(
                branchSearch({
                    text: "",
                    sort: true,
                    status: true,
                    isPagination:false,
                    companyId: userInfoglobal?.userType === "admin" ? CompanyId : userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
                })
            );
        }
    }, [CompanyId])

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

    const onChange = (e) => {
        
        setSearchText(e);
    };
    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

    return (
        <GlobalLayout onChange={onChange}>
            <>
                {/* <h2 className="text-2xl font-bold">
                    Time Slot List
                </h2> */}
                <div className=''>
                    <div className='sm:flex justify-between items-center md:space-y-0 space-y-2 py-1'>
                        <div className="flex items-center space-x-2">
                            {userInfoglobal?.userType === "admin" &&
                                <div className="">
                                    <Controller
                                        name="PDCompanyId"
                                        control={control}
                                        rules={{ required: "Company is required" }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                className={`w-full ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
                                                placeholder="Select Company"
                                            >
                                                <Select.Option value="">Select Company</Select.Option>
                                                {companyList?.map((type) => (
                                                    <Select.Option key={type?._id} value={type?._id}>
                                                        {type?.fullName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.PDCompanyId && (
                                        <p className="text-red-500 text-sm">{errors.PDCompanyId.message}</p>
                                    )}
                                </div>
                            }
                            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&

                                <div className="">
                                    <Controller
                                        name="PDBranchId"
                                        control={control}
                                        rules={{ required: "Branch is required" }}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                className={`w-full ${inputClassNameSearch} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                                                placeholder="Select Branch"
                                            >
                                                <Select.Option value="">Select Branch</Select.Option>
                                                {branchList?.map((type) => (
                                                    <Select.Option key={type?._id} value={type?._id}>
                                                        {type?.fullName}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
                                </div>
                            }
                        </div>
                        <div className='sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2'>
                            {/* <div className="relative flex items-center bg-white border rounded-md p-2 text-sm w-[50%]">
                                <HiOutlineFilter className="text-gray-800 mr-2" />
                                <select
                                    {...register("PDCompanyId", {
                                        required: "Company is required",
                                    })}
                                    className={`w-full bg-transparent outline-none border-none focus:ring-0 ${errors.PDCompanyId ? "text-red-500" : "text-gray-700"
                                        }`}
                                >
                                    <option value="" disabled selected>
                                        Select Company
                                    </option>
                                    {companyList?.map((type) => (
                                        <option key={type?._id} value={type?._id}>
                                            {type?.fullName} ({type?.userName})
                                        </option>
                                    ))}
                                </select>
                            </div> */}

                            {/* <div className='flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md'>
                                <HiOutlineFilter />
                                <span>Role</span>
                                <FaAngleDown />
                            </div>
                            <div className='flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md'>
                                <HiOutlineFilter />
                                <span>Status</span>
                                <FaAngleDown />
                            </div> */}
                        </div>
                        {timeSlotsListData?.length > 0 ? (
                            null
                        ) : (
                            <button
                                onClick={() => navigate("/admin/timeSlots/create")}
                                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white">
                                <FaPlus />
                                <span className="text-[12px]">Add New Time Slot</span>
                            </button>)}
                    </div>
                </div>
                <div className="bg-[#ffffff] w-full overflow-x-auto rounded-xl mt-1">
                   {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    S.No.
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Working Days</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Sunday Offs</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Saturday Offs</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Opening Time</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Closing Time</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>created At</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>created By</span>
                                        {/* <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div> */}
                                    </div>
                                </th>
                                {/* <th className='border-none p-2 whitespace-nowrap'>
                                    <div className='flex justify-start items-center space-x-1'>
                                        <span>Status</span>
                                        <div className='flex flex-col -space-y-1.5 cursor-pointer'>
                                            <FaAngleUp />
                                            <FaAngleDown />
                                        </div>
                                    </div>
                                </th> */}
                               {canUpdate && <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    Action
                                </th>}
                            </tr>
                        </thead>
                        {loading ? <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr> :
                        <tbody>
                            {timeSlotsListData && timeSlotsListData?.length > 0 ?
                                timeSlotsListData?.map((element, index) => (
                                    <tr className={` ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            {index + 1}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>  {element?.workingDays?.join(", ") ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            <span
                                                className={`${element?.weekOffRules?.sundaysOff ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500'
                                                    } border-[1px] px-2 py-1 rounded-lg text-black text-[12px]`}>
                                                {element?.weekOffRules?.sundaysOff ? 'Yes' : 'No' ?? "-"}
                                            </span>
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.weekOffRules?.saturdaysOff?.join(", ") ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.openingTime ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.closingTime ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.createdBy ?? "-"}</td>
                                        {/* <td className='whitespace-nowrap border-none p-2 '>
                                            <span
                                                className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500'
                                                    } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                                                {element?.status ? 'Active' : 'Inactive' ?? "-"}
                                            </span>
                                        </td> */}
                                        {canUpdate &&<td className='whitespace-nowrap border-none p-2'>
                                            {(element?.companyId === "null" || element?.companyId === null) ? (
                                                <span className="py-1.5 text-black "> - </span>
                                            ) : (
                                                <span className="py-1.5 flex justify-start items-center space-x-2">
                                                    <Tooltip placement="topLeft"  title='Edit'>
                                                        <button onClick={() => { navigate(`/admin/timeSlots/edit/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                        </button>
                                                    </Tooltip>
                                                    {/* {(userType === "admin" || userType === "company") && (
                                                        <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                            <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                                        </button>
                                                    )} */}
                                                </span>
                                            )}
                                        </td>}
                                    </tr>
                                ))
                                : (<tr className="bg-white bg-opacity-5 " >
                                    <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                                </tr>)}
                        </tbody>}
                    </table>}
                </div>
                {timeSlotsListData?.length > 0 &&
                    <CustomPagination
                        totalCount={totalTimeSlotsCount}
                        pageSize={limit}
                        currentPage={currentPage}
                        onChange={onPaginationChange}
                    />}
            </>
        </GlobalLayout >
    )
}
export default TimeSlotsList;