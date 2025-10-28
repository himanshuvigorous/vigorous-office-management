import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, formatAddress, inputAntdSelectClassNameFilter, inputClassNameSearch, sortByPropertyAlphabetically } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { getVendorList, vendorSearch, deleteVendorFunc } from "./VigovendorFeatures/_vigo_vendor_reducers";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import ListLoader from "../../../global_layouts/ListLoader";
import { BsEye } from "react-icons/bs";

function VigoVendorList() {
    const { register, control, setValue, formState: { errors } } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { companyList } = useSelector((state) => state.company);
    const { branchList, loading: branchSearchLoading } = useSelector((state) => state.branch);
    const { vendorDataList, totalVendorCount, loading } = useSelector(state => state.vendor)
    const [searchText, setSearchText] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

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

    const status = useWatch({
        control,
        name: 'status',
        defaultValue: ''
    });

    const limit = 10;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };


    const filters = [CompanyId, BranchId, status, searchText].join("-");
    const [isFirstRender ,setisFirstRender] = useState(false)
    
    useEffect(() => {
        if (!isFirstRender) {
          setisFirstRender(state=>true);
          return;
        }
        if (currentPage === 1) {
          fetchVendorList();
        } else {
          setCurrentPage(1);
        }
      }, [filters])

    useEffect(() => {
        fetchVendorList()
    }, [currentPage])


    const fetchVendorList = () => {
        const reqData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId:
                    userInfoglobal?.userType === "admin"
                        ? CompanyId
                        :
                        userInfoglobal?.userType === "company"
                            ? userInfoglobal?._id
                            : userInfoglobal?.companyId,
                branchId:
                    userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
                        ? userInfoglobal?._id
                        : userInfoglobal?.branchId,
                directorId: "",
                text: searchText,
                sort: true,
                status: status === "true" ? true : status === "false" ? false : "",
                isPagination: true,
            }
        }
        dispatch(getVendorList(reqData))
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
                dispatch(deleteVendorFunc(reqData)).then((data) => {
                    // fetchVendorList()

                    if (currentPage > 1 && vendorDataList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        fetchVendorList();
                    }
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
                    isPagination: false,
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

 

    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

    const onChange = (e) => {

        setSearchText(e);
    };

    return (
        <GlobalLayout onChange={onChange}>

            <section>
                <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
                    <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
                        {userInfoglobal?.userType === "admin" && <div className="">

                           
                            <Controller
                                control={control}
                                name="PDCompanyId"
                                rules={{ required: "Company is required" }}
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
                                <p className="text-red-500 text-sm">
                                    {errors.PDCompanyId.message}
                                </p>
                            )}
                        </div>}
                        {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">

                           

                            <Controller
                                control={control}
                                name="PDBranchId"
                                rules={{ required: "Branch is required" }}
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
                                        <Select.Option value="">Select Branch</Select.Option>
                                        {branchSearchLoading ? (
                                            <Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option>
                                        ) : (
                                            sortByPropertyAlphabetically(branchList)?.map((type) => (
                                                <Select.Option key={type?._id} value={type?._id}>
                                                    {type?.fullName}
                                                </Select.Option>
                                            ))
                                        )}
                                    </Select>
                                )}
                            />
                            {errors.PDBranchId && (
                                <p className="text-red-500 text-sm">
                                    {errors.PDBranchId.message}
                                </p>
                            )}
                        </div>}
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
                                setValue("PdCompanyId", "");
                                // setValue("PdDepartmentId", "");
                            }}
                            className="bg-header   py-[5px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate &&
                            <Tooltip placement="topLeft"  title='Add Vendor'>
                                <button
                                    onClick={() => {
                                        navigate("/admin/project-vendor/create");
                                    }}
                                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                                >
                                    <FaPlus />
                                    <span className="text-[12px]">Add Vendor</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
                <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                    {(canRead) && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    S.No.
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                    Name
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    Email
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    Mobile Number
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                Total Transaction 
                                                                </th>

                                <th className='border-none p-2 whitespace-nowrap'>
                                    Created At
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    Created By
                                </th>
                                <th className='border-none p-2 whitespace-nowrap'>
                                    Status
                                </th>
                                {(canDelete || canUpdate) && <th className='border-none p-2 whitespace-nowrap w-[10%]'>
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
                                {vendorDataList && vendorDataList?.length > 0 ?
                                    vendorDataList?.map((element, index) => (
                                        <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.fullName ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.email ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.mobile?.code + element?.mobile?.number}</td>
                                            <td className='whitespace-nowrap border-none p-2 text-green-500 font-semibold '>{element?.projectAmount ? `₹ ${Number(element?.projectAmount).toFixed(2)}` : "-"}</td>
                                            
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.createdBy ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                <span
                                                    className={`${element?.status
                                                        ? "bg-[#E0FFBE] border-green-500"
                                                        : "bg-red-200 border-red-500"
                                                        } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                                                >
                                                    {element?.status ? "Active" : "Inactive" ?? "-"}
                                                </span>
                                            </td>
                                            {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                                <span className="py-1.5 flex justify-start items-center space-x-2">
                                                    {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/project-vendor/edit/${encrypt(element?._id)}`);
                                                            }}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                        </button>
                                                    </Tooltip>}
                                                    {canDelete && <Tooltip placement="topLeft"  title='Delete'>
                                                        <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                            <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                                        </button>
                                                    </Tooltip>}
                                                    
                                                    <Tooltip placement="topLeft"  title='Edit'>
                                                        <button
                                                            onClick={() => {
                                                                navigate(`/admin/project-vendor-report/${encrypt(element?._id)}`);
                                                            }}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <BsEye className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                        </button>
                                                    </Tooltip>
                                                </span>
                                            </td>}
                                        </tr>
                                    ))
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={10} className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">Record Not Found</td>
                                    </tr>)}
                            </tbody>}
                    </table>}
                </div>

                <CustomPagination
                    totalCount={totalVendorCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />
            </section>

        </GlobalLayout>
    )
}
export default VigoVendorList