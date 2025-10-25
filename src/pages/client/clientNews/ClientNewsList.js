import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../../global_layouts/Loader/Loader"
import { getClientNewsList, clientNewsSearch, deleteClientNews } from "../clientNews/clientNewsFeatures/_client_news_reducers"
import { Select, Tooltip, Dropdown } from "antd"
import usePermissions from "../../../config/usePermissions"
import Loader2 from "../../../global_layouts/Loader/Loader2"
import dayjs from "dayjs"
import { PiDotsThreeOutlineVerticalBold } from 'react-icons/pi';
import ListLoader from "../../../global_layouts/ListLoader"

function ClientNewsList() {
    const { register, setValue, control, formState: { errors } } = useForm();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const [searchText, setSearchText] = useState("");
    const { companyList } = useSelector((state) => state.company);
    const { branchList, branchListloading } = useSelector((state) => state.branch);
    const { clientNewsList, totalNewzCount, loading } = useSelector(state => state.clientNews);

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
        name: "status",
        defaultValue: "",
    });

    const [currentPage, setCurrentPage] = useState(1);

    const limit = 10;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };


    const filters = [BranchId,searchText,status,CompanyId].join("-");

   const [isFirstRender ,setisFirstRender] = useState(false)
   
     useEffect(() => {
       if (!isFirstRender) {
         setisFirstRender(state=>true);
         return;
       }
        if (currentPage === 1) {
          fetchClientNewsList()
        } else {
          setCurrentPage(1);
        }
      }, [filters])

    useEffect(() => {
        fetchClientNewsList()
    }, [currentPage])

    const fetchClientNewsList = () => {
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
                "directorId": "",
                "text": searchText,
                "sort": true,
                "status": status === 'true' ? true : status === 'false' ? false : '',
                "isPagination": true,
            }
        }
        dispatch(getClientNewsList(reqData))
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
                dispatch(deleteClientNews(reqData)).then((data) => {
                    // fetchClientNewsList()
                    if (currentPage > 1 && clientNewsList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        fetchClientNewsList();
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
                <div className="lg:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
                    <div className="grid md:flex sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1.5">
                        {userInfoglobal?.userType === "admin" &&
                            <div className="">
                                <Controller
                                    control={control}
                                    name="PDCompanyId"
                                    rules={{ required: "Company is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={""}
                                            disabled={loading}
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
                        {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
                            <div className="">
                                <Controller
                                    control={control}
                                    name="PDBranchId"
                                    rules={{ required: "Branch is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={""}
                                            disabled={loading}
                                            className={`${inputAntdSelectClassNameFilter} `}
                                            showSearch
                                            filterOption={(input, option) =>
                                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            <Select.Option value="">Select Branch</Select.Option>
                                            {branchListloading ? (<Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option>) : (branchList?.map((type) => (
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
                            <Controller
                                control={control}
                                name="status"
                                rules={{ required: "Status is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        disabled={loading}
                                        className={`${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option value="">Select status</Select.Option>
                                        <Select.Option value="true">Active</Select.Option>
                                        <Select.Option value="false">Inactive</Select.Option>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-end gap-2">
                        <button
                            onClick={() => {
                                setValue("PDBranchId", '')
                                setValue("PDCompanyId", "")
                                setValue("status", "")
                            }}
                            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate &&
                            <Tooltip placement="topLeft"  title='Add News'>
                                <button
                                    onClick={() => {
                                        navigate("/admin/client-news/create");
                                    }}
                                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                                >
                                    <FaPlus />
                                    <span className="text-[12px]">Add News</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
                <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                    {(canRead) && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]'>
                                <th className='tableHead w-[10%]'>
                                    S.No.
                                </th>
                                <th className='tableHead'>
                                    Title
                                </th>
                                <th className='tableHead'>
                                    Created At
                                </th>
                                <th className='tableHead'>
                                    Created By
                                </th>

                                <th className='tableHead'>
                                    Status
                                </th>

                                {(canDelete || canUpdate) && <th className='tableHead w-[15%]'>
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
                                {clientNewsList && clientNewsList?.length > 0 ?
                                    clientNewsList?.map((element, index) => (
                                        <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151]`}>
                                            <td className='tableData '>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='tableData '>{element?.title ?? "-"}</td>
                                            <td className='tableData '>{dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}</td>
                                            <td className='tableData '>{element?.createdBy ?? "-"}</td>
                                            <td className='tableData '>
                                                <span
                                                    className={`${element?.status
                                                        ? "bg-[#E0FFBE] border-green-500"
                                                        : "bg-red-200 border-red-500"
                                                        } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                                                >
                                                    {element?.status ? "Active" : "Inactive" ?? "-"}
                                                </span>
                                            </td>
                                            {(canDelete || canUpdate) && <td className='tableData'>
                                                <Dropdown
                                                    menu={{
                                                        items: [
                                                            canUpdate && {
                                                                key: 'edit',
                                                                label: (
                                                                    <span
                                                                        onClick={() => navigate(`/admin/client-news/edit/${encrypt(element?._id)}`)}
                                                                        className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]"
                                                                    >
                                                                        <FaPenToSquare className="mr-2" size={16} />
                                                                        Edit
                                                                    </span>
                                                                ),
                                                            },
                                                            canDelete && {
                                                                key: 'delete',
                                                                label: (
                                                                    <span
                                                                        onClick={() => handleDelete(element?._id)}
                                                                        className="flex items-center text-red-600 hover:text-red-500"
                                                                    >
                                                                        <RiDeleteBin5Line className="mr-2" size={16} />
                                                                        Delete
                                                                    </span>
                                                                ),
                                                            },
                                                        ].filter(Boolean), // Removes null if permission is false
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Tooltip placement="topLeft"  title="More Actions">
                                                        <button
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                                            type="button"
                                                        >
                                                            <PiDotsThreeOutlineVerticalBold
                                                                className="hover:text-[#337ab7] text-[#3c8dbc]"
                                                                size={16}
                                                            />
                                                        </button>
                                                    </Tooltip>
                                                </Dropdown>

                                            </td>}
                                        </tr>
                                    ))
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                                    </tr>)}
                            </tbody>}
                    </table>}
                </div>
                {clientNewsList?.length > 0 && (
                    <CustomPagination
                        totalCount={totalNewzCount}
                        pageSize={limit}
                        currentPage={currentPage}
                        onChange={onPaginationChange}
                    />)}
            </section>

        </GlobalLayout >
    )
}
export default ClientNewsList