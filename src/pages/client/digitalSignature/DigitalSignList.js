import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { useForm, useWatch } from "react-hook-form";
import moment from "moment";
import { domainName, inputClassNameSearch } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../../global_layouts/Loader/Loader"
import { getDigitalSignList, eventSearch, deleteDigitalSign } from "../digitalSignature/digitalSignatureFeatures/_digital_sign_reducers";
import Loader2 from "../../../global_layouts/Loader/Loader2"


function DigitalSignList() {
    const { register, setValue, control, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { companyList } = useSelector((state) => state.company);
    const { branchList } = useSelector((state) => state.branch);
    const { digitalSignList, totalDigitalSignCount, loading } = useSelector(state => state.digitalSign);

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

    const [currentPage, setCurrentPage] = useState(1);

    const limit = 10;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        fetchDigitalSignList()
    }, [currentPage, BranchId, CompanyId])

    const fetchDigitalSignList = () => {
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
                "text": "",
                "sort": true,
                "status": "",
                "isPagination": true,
            }
        }
        dispatch(getDigitalSignList(reqData))
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
                dispatch(deleteDigitalSign(reqData)).then((data) => {
                    fetchDigitalSignList()
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

    // const handleOnChange = async (event) => {
    //     const searchValue = event.target.value;
    //     setValue("search", searchValue);

    //     let reqData = {
    //         searchValue: searchValue,
    //         size: 3,
    //         pageNo: 1,
    //     };

    //     if (searchValue.length >= 1) {
    //         dispatch(eventSearch(reqData));
    //     }
    // };

    return (
        <GlobalLayout>

                <section>
                    <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
                        <div className="flex items-center space-x-2">
                            {userInfoglobal?.userType === "admin" && <div className="">

                                <select
                                    {...register("PDCompanyId", {
                                        required: "company is required",
                                    })}
                                    className={` ${inputClassNameSearch} ${errors.PDCompanyId
                                        ? "border-[1px] "
                                        : "border-gray-300"
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
                            </div>}
                            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">

                                <select
                                    {...register("PDBranchId", {
                                        required: "Branch is required",
                                    })}
                                    className={` ${inputClassNameSearch} ${errors.PDBranchId
                                        ? "border-[1px] "
                                        : "border-gray-300"
                                        }`}
                                >
                                    <option className="" value="">
                                        Select Branch
                                    </option>
                                    {branchList?.map((type) => (
                                        <option value={type?._id}>{type?.fullName}</option>
                                    ))}
                                </select>
                                {errors.PDBranchId && (
                                    <p className="text-red-500 text-sm">
                                        {errors.PDBranchId.message}
                                    </p>
                                )}
                            </div>}
                        </div>
                        <div className="flex justify-end items-end">
                            <button
                                onClick={() => {
                                    navigate("/admin/digital-sign/create");
                                }}
                                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                            >
                                <FaPlus />
                                <span className="text-[12px]">Add Digital Signature</span>
                            </button>
                        </div>
                    </div>
                    <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                        <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                            <thead className=''>
                                <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                                    <th className='border-none p-2 whitespace-nowrap w-[15%]'>S.No.</th>
                                    <th className='border-none p-2 whitespace-nowrap'>Name</th>
                                    <th className="border-none p-2 whitespace-nowrap">Start Date</th>
                                    <th className="border-none p-2 whitespace-nowrap">Expiry Date</th>
                                    <th className='border-none p-2 whitespace-nowrap'>Status</th>
                                    <th className='border-none p-2 whitespace-nowrap w-[15%]'>Action</th>
                                </tr>
                            </thead>
                            {loading ?<tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>:
                            <tbody>
                                {digitalSignList && digitalSignList?.length > 0 ?
                                    digitalSignList?.map((element, index) => (
                                        <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>{element?.name ?? "-"}</td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {moment(element?.startDate).format("DD-MM-YYYY")}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {moment(element?.expiryDate).format("DD-MM-YYYY")}
                                            </td>
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
                                            <td className='whitespace-nowrap border-none p-2'>
                                                <span className="py-1.5 flex justify-start items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            navigate(`/admin/digital-sign/edit/${encrypt(element?._id)}`);
                                                        }}
                                                        className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                        <FaPenToSquare className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(element?._id)} className="px-2 py-1.5 rounded-md bg-transparent border border-muted" type="button">
                                                        <RiDeleteBin5Line className='text-red-600 hover:text-red-500' size={16} />
                                                    </button>
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                                    </tr>)}
                            </tbody>}
                        </table>
                    </div>
                    {totalDigitalSignCount > limit && (
                        <CustomPagination
                            totalCount={totalDigitalSignCount}
                            pageSize={limit}
                            currentPage={currentPage}
                            onChange={onPaginationChange}
                        />)}
                </section>
     
        </GlobalLayout>
    )
}
export default DigitalSignList;