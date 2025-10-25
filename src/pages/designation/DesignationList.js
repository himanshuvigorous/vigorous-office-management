import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../config/Encryption"
import { FaPenToSquare, FaPlus, FaAngleDown } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteDesignation, getDesignationList, designationSearch } from "./designationFeatures/_designation_reducers";
import { FaAngleUp, FaSearch } from "react-icons/fa"
import { Controller, useForm, useWatch } from "react-hook-form";
import { AiOutlineMessage } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { HiOutlineFilter } from "react-icons/hi"
import { domainName, handleSortLogic, inputAntdSelectClassNameFilter, inputClassNameSearch, sortByPropertyAlphabetically } from "../../constents/global"
import CustomPagination from "../../component/CustomPagination/CustomPagination"
import { companySearch } from "../company/companyManagement/companyFeatures/_company_reducers"
import { Select, Tooltip } from "antd"
import getUserIds from "../../constents/getUserIds"
import { deptSearch } from "../department/departmentFeatures/_department_reducers"
import usePermissions from "../../config/usePermissions"
import Loader2 from "../../global_layouts/Loader/Loader2"
import dayjs from "dayjs"
import ListLoader from "../../global_layouts/ListLoader"

function DesignationList() {
    const { register, setValue, formState: { errors }, control } = useForm();
    const { companyList } = useSelector((state) => state.company);
    const { userCompanyId, userType } = getUserIds();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { designationList, totalDesignationCount, loading } = useSelector(state => state.designation);
    const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
    const [sortedList, setSortedList] = useState([]);
    const [searchText, setSearchText] = useState("");
    // const [status, setStatus] = useState("");
    const CompanyId = useWatch({
        control,
        name: "PDCompanyId",
        defaultValue: userCompanyId,
    });
    const departmentId = useWatch({
        control,
        name: "PdDepartmentId",
        defaultValue: "",
    });

    const status = useWatch({
        control,
        name: 'status',
        defaultValue: ''
    });

    useEffect(() => {
        if (userType === "admin") {
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
        dispatch(
            deptSearch({
                departmentId: departmentId,
                companyId: CompanyId,
                text: "",
                sort: true,
                status: true,
                isPagination: false,
            })
        );
    }, []);

    const [currentPage, setCurrentPage] = useState(1);

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    const limit = 10;


    const filters = [CompanyId, departmentId, status, searchText].join("-");
    const [isFirstRender ,setisFirstRender] = useState(false)
    
    useEffect(() => {
      if (!isFirstRender) {
        setisFirstRender(state=>true);
        return;
      }
      if (currentPage === 1) {
        fetDesignationList();
      } else {
        setCurrentPage(1);
      }
    }, [filters])

    useEffect(() => {
        fetDesignationList();
    }, [currentPage]);

    const fetDesignationList = () => {
        const reqListData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                text: searchText,
                sort: true,
                companyId: CompanyId,
                departmentId: departmentId,
                isPagination: true,
                status: status === "true" ? true : status === "false" ? false : "",
            }
        }
        dispatch(getDesignationList(reqListData));
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
                dispatch(deleteDesignation(reqData)).then((data) => {
                    // !data.error && fetDesignationList();
                    if (currentPage > 1 && designationList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        !data.error && fetDesignationList();
                    }
                })
            }
        });
    };

    const handleFocusCompany = () => {
        if (!companyList?.length) {
            dispatch(
                companySearch({
                    isPagination: false,
                    text: "",
                    sort: true,
                    status: true,
                })
            );
        }
    };

    

    const handleOnChange = async (event) => {
        const searchValue = event.target.value;
        setValue("search", searchValue);

        if (searchValue.trim().length > 0) {
            let reqData = {
                searchValue: searchValue,
                size: 3,
                pageNo: 1,
            };

            dispatch(designationSearch(reqData));
        }
    };

    useEffect(() => {
        if (designationList) {
            handleSort();
        }
    }, [designationList]);

    const handleSort = (key, order) => {
        const sortedList = handleSortLogic(key, order, designationList);
        setSortedList(sortedList);
    };

    const onChange = (e) => {
        // 
        setSearchText(e);
    };

    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
    return (
        <GlobalLayout onChange={onChange}>
            
            < div className='' >
               
                <div div className='sm:flex justify-between items-center md:space-y-0 space-y-2 py-1' >

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-3 gap-1">

                        {userType === "admin" && (
                            <div className="w-full">
                                <Controller
                                    name="PDCompanyId"
                                    control={control}
                                    rules={{ required: "Company is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            onFocus={handleFocusCompany}
                                            className={`${inputClassNameSearch} w-full ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"}`}
                                            placeholder="Select Company"
                                            showSearch
                                            filterOption={(input, option) =>
                                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                                            }
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

                        )}

                        <div className="">
                            <Controller
                                control={control}
                                name="PdDepartmentId"
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        className={`${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option value="">Select Department</Select.Option>
                                        {depLoading ? (
                                            <Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option>
                                        ) : (
                                            sortByPropertyAlphabetically(departmentListData)?.map(
                                                (element) => (
                                                    <Select.Option key={element?._id} value={element?._id}>
                                                        {element?.name}
                                                    </Select.Option>
                                                )
                                            )
                                        )}
                                    </Select>
                                )}
                            />
                            {errors.PdDepartmentId && (
                                <p className="text-red-500 text-sm">
                                    {errors.PdDepartmentId.message}
                                </p>
                            )}
                        </div>
                        <Controller
                            name="status"
                            control={control}
                            rules={{}}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                    placeholder="Select Status"
                                    showSearch
                                    filterOption={(input, option) =>
                                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    <Select.Option value="">Select Status</Select.Option>
                                    <Select.Option value="true"> Active </Select.Option>
                                    <Select.Option value="false"> InActive </Select.Option>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="flex justify-end items-center gap-2 ">
                        <button
                            onClick={() => {
                                setValue("status", "");
                                setValue("PDBranchId", '');
                                setValue("PdDepartmentId", "");
                                setValue("PdCompanyId", "");
                            }}
                            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {(canCreate) &&
                            <Tooltip placement="topLeft"  title='Add Designations'>
                                <button onClick={() => { navigate("/admin/designation/create") }} className='bg-header p-2 rounded-md flex justify-center items-center space-x-2 text-white'>
                                    <FaPlus />
                                    <span className='text-[12px] tracking-wide'>Add Designations</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
            </div >
            <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
                {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                    <thead className=''>
                        <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                            <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                S.no.
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                <div className="flex justify-start items-center space-x-1">
                                    <span>Designation Name</span>
                                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                                        <FaAngleUp
                                            onClick={() => handleSort("name", "asc")}
                                        />
                                        <FaAngleDown
                                            onClick={() => handleSort("name", "desc")}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                <div className="flex justify-start items-center space-x-1">
                                    <span>Department Name</span>
                                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                                        <FaAngleUp
                                            onClick={() => handleSort("departmentData.name", "asc")}
                                        />
                                        <FaAngleDown
                                            onClick={() => handleSort("departmentData.name", "desc")}
                                        />
                                    </div>
                                </div>
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                created At
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                created By
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Status
                            </th>
                            {(canDelete || canUpdate) && <th className='border-none p-2 whitespace-nowrap w-[15%]'>
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
                            {sortedList && sortedList?.length > 0 ?
                                sortedList?.map((element, index) => (
                                    <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            {index + 1 + ((currentPage - 1) * limit)}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.name ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.departmentData?.name ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.createdBy ?? "-"}</td>

                                        <td className='whitespace-nowrap border-none p-2 '>
                                            <span className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 border-red-500'
                                                } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                                                {element?.status ? 'Active' : 'Inactive' ?? "-"}
                                            </span>
                                        </td>
                                        {(canUpdate || canDelete) && <td className='whitespace-nowrap border-none p-2'>
                                            <span className="py-1.5 flex justify-start items-center space-x-2">
                                                {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                                                    <button onClick={() => { navigate(`/admin/designation/edit/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                        <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                    </button>
                                                </Tooltip>}
                                                {canDelete && <Tooltip placement="topLeft"  title='Delete'>
                                                    <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                        <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                                    </button>
                                                </Tooltip>}
                                            </span>
                                        </td>}
                                    </tr>
                                ))
                                : (<tr className="bg-white bg-opacity-5 " >
                                    <td colSpan={7} className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500">Record Not Found</td>
                                </tr>)}
                        </tbody>
                    }
                </table>}
            </div>
            {
                designationList?.length > 0 &&
                <CustomPagination
                    totalCount={totalDesignationCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />
            }
        </GlobalLayout >
    )
}
export default DesignationList