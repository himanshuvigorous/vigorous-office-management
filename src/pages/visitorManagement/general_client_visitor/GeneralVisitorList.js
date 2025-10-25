import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Controller, useForm, useWatch } from "react-hook-form";

import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers"
import { domainName, inputAntdSelectClassNameFilter } from "../../../constents/global"
import { FaPlus } from "react-icons/fa"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import getUserIds from "../../../constents/getUserIds";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import moment from "moment";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";
import { deleteGeneralVisitor, deleteVisitor, getGeneralVisitorList, getVisitorList, updateGeneralVisitor, updateVisitor, visitorSearch } from "../visitor/visitorFeatures/_visitor_reducers";

function GeneralVisitorList() {

    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
    const { setValue, control } = useForm();
    const {
        userCompanyId,
        userBranchId,
        userType
    } = getUserIds();
    const { visitorList, totalVisitorCount,visitorGeneralList, loading } = useSelector(state => state.visitor);
    const { departmentListData } = useSelector((state) => state.department);
    const { branchList } = useSelector((state) => state.branch);
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    const { employeList } = useSelector((state) => state.employe);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
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
    const departmentId = useWatch({
        control,
        name: "PdDepartmentId",
        defaultValue: '',
    });
    const employee = useWatch({
        control,
        name: "employee",
        defaultValue: '',
    });

    const category = useWatch({
        control,
        name: "category",
        defaultValue: '',
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
        fetchVisitorCatList();
    }, [currentPage, branchId, employee, departmentId, category, searchText])

    const fetchVisitorCatList = () => {
        const reqListData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId: companyId,
                branchId: branchId,
                "directorId": "",
                category:'general',
                employeId: employee,
                departmentId: '',
                text: searchText,
                sort: true,
                status: "",
                isPagination: true,
               
            }
        }
        dispatch(getGeneralVisitorList(reqListData));
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
                dispatch(deleteGeneralVisitor(reqData)).then((data) => {
                    !data.error && fetchVisitorCatList();
                })
            }
        });
    };

    const handleCheckOut = (element) => {
        let reqData = {
            ...element,

            _id: element?._id,
            checkOutTime: moment(),

        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to checkout!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(updateGeneralVisitor(reqData)).then((data) => {
                    !data.error && fetchVisitorCatList();
                })
            }
        });
    };
    const handleOnChange = async (event) => {
        const searchValue = event.target.value;
        setValue("category", searchValue);
        if (searchValue.trim().length > 0) {
            const reqListData = {
                companyId: companyId,
                branchId: branchId,
                "directorId": "",
                text: "",
                sort: true,
                status: "",
                isPagination: false,
                category: searchValue
            }
            dispatch(visitorSearch(reqListData));
        }
    };
    const fetchEmployeListData = () => {
        const reqPayload = {
            text: "",
            status: true,
            sort: true,
            isTL: "",
            isHR: "",

            isPagination: false,
            designationId: '',
            departmentId: '',
            companyId: companyId,
            branchId: branchId,
        };

        dispatch(employeSearch(reqPayload));
    };

    const onChange = (e) => {
        
        setSearchText(e);
    };

    return (
        <GlobalLayout onChange={onChange}>

            <div className=''>
                <div class="xl:flex justify-between items-center py-1 xl:space-y-0 space-y-2 overflow-y-auto">
                    <div className="grid sm:grid-cols-2 grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 md:grid-cols-3 sm:gap-3 gap-1">
                        {/* <div className="">
                            <Controller
                                control={control}
                                name="category"
                                rules={{ required: "category is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        className={` ${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option className="" value="">Select Category</Select.Option>
                                        <Select.Option value="general">General Visitor</Select.Option>
                                        <Select.Option value="existing">Existing Client</Select.Option>
                                        <Select.Option value="new">New Client</Select.Option>
                                        <Select.Option value="employe">Employe To Client</Select.Option>
                                    </Select>
                                )}
                            />
                        </div> */}
                        {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && (
                            <div className="">
                                <Controller
                                    control={control}
                                    name="PDBranchId"
                                    rules={{ required: "Branch is required" }}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            defaultValue={""}
                                            onFocus={() => {
                                                dispatch(
                                                    branchSearch({
                                                        text: "",
                                                        sort: true,
                                                        status: true,
                                                        isPagination: false,
                                                        companyId:
                                                            userInfoglobal?.userType === "admin"
                                                                ? companyId
                                                                : userInfoglobal?.userType === "company"
                                                                    ? userInfoglobal?._id
                                                                    : userInfoglobal?.companyId,
                                                    }))
                                            }}
                                            className={`${inputAntdSelectClassNameFilter} `}
                                            showSearch
                                            filterOption={(input, option) =>
                                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                                            }
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
                            </div>
                        )}

                        <div className="">
                            <Controller
                                control={control}
                                name="PdDepartmentId"
                                rules={{ required: "Department is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        onFocus={() => {
                                            dispatch(
                                                deptSearch({
                                                    text: "",
                                                    sort: true,
                                                    status: true,
                                                    companyId:
                                                        userInfoglobal?.userType === "admin"
                                                            ? companyId
                                                            : userInfoglobal?.userType === "company"
                                                                ? userInfoglobal?._id
                                                                : userInfoglobal?.companyId,
                                                    branchId: branchId,
                                                    isPagination: false
                                                })
                                            );
                                        }}
                                        className={`${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option value="">Select Department</Select.Option>
                                        {departmentListData?.map((type) => (
                                            <Select.Option key={type?._id} value={type?._id}>
                                                {type?.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="">
                            <Controller
                                name="employee"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassNameFilter} `}
                                        popupClassName={'!z-[1580]'}
                                        placeholder="Select Employee"
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                        optionLabelProp="children"
                                        onFocus={() => fetchEmployeListData()}
                                    >
                                        <Select.Option value="">Select Employee</Select.Option>
                                        {employeList?.map((item) => (
                                            <Select.Option key={item._id} value={item._id}>
                                                {item.fullName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 ">
                        <button
                            onClick={() => {
                                setValue("employee", "");
                                setValue("PDBranchId", '');
                                setValue("PdDepartmentId", '');
                                setValue("category", "");
                                setValue("PdCompanyId", "");
                            }}
                            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate &&
                            <Tooltip placement="topLeft"  title='Add Visitor'>
                                <button onClick={() => { navigate("/admin/general-client-visitor/create") }} className='bg-header p-2 rounded-md flex justify-center items-center space-x-2 text-white'>
                                    <FaPlus />
                                    <span className='text-[12px] text-nowrap tracking-wide'>Add Visitor</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
            </div>
            <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
                {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                    <thead className=''>
                        <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                            <th className='border-none p-2 whitespace-nowrap w-[8%]'>
                                S.no.
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Visitor Name
                            </th>
                            {/* <th className='border-none p-2 whitespace-nowrap'>
                                Client Name
                            </th> */}
                            <th className='border-none p-2 whitespace-nowrap'>
                                Category type
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Mobile Number
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Contact Person
                            </th>
                            {/* <th className='border-none p-2 whitespace-nowrap'>
                                Employe Name
                            </th> */}
                            <th className='border-none p-2 whitespace-nowrap'>
                                Reason
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Start Time
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                End Time
                            </th>
                             <th className='border-none p-2 whitespace-nowrap'>
                                Check In Time
                            </th>
                             <th className='border-none p-2 whitespace-nowrap'>
                                Check Out Time
                            </th>
                            {/* <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Category
                            </th> */}
                            <th className='border-none p-2 whitespace-nowrap'>
                                Created By
                            </th>
                            {/* <th className='border-none p-2 whitespace-nowrap'>
                                Status
                            </th> */}
                            {(canDelete || canUpdate) && <th className='border-none p-2 whitespace-nowrap w-[8%]'>
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
                            {visitorGeneralList && visitorGeneralList?.length > 0 ?
                                visitorGeneralList?.map((element, index) => (
                                    <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            {index + 1 + ((currentPage - 1) * limit)}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.name ?? "-"}</td>
                                        {/* <td className='whitespace-nowrap border-none p-2 '>{element?.clientName ?? "-"}</td> */}
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.category ?? "-"}</td>
                                        <td className="whitespace-nowrap border-none p-2">
                                            {element?.mobile?.code + " " + element?.mobile?.number || '-'}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            <div className={`  flex items-center justify-center`}>
                                            {element?.employeData?.map((element,index)=>{
                                                return (

                                    <Tooltip placement="topLeft"  title={element?.fullName}>

                                        <img
                                        key={index}
                                          alt=""
                                          src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                                          className={`w-10 h-10 ${index > 0 ? ' -ml-2' : '0'} rounded-full bg-gray-500 flex items-center justify-center`}
                                        />
                                        </Tooltip>
                                      ) 
                                               

                                            },[])}
                                            </div>
                                            
                                            </td>
                                        {/* <td className='whitespace-nowrap border-none p-2 '>{element?.employeName ?? "-"}</td> */}
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.reason ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.timeDurationStart ? moment(element?.timeDurationStart).format('DD-MM-YYYY hh:mm a') : "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.timeDurationEnd ? moment(element?.timeDurationEnd).format('DD-MM-YYYY hh:mm a') : <Tooltip placement="topLeft"  title='Checkout'>
                                            <button onClick={() => { handleCheckOut(element) }} className="px-2 py-1.5 text-xs rounded-md bg-header text-white border border-muted" type="button">
                                                {/*  <BiArrowFromLeft className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} /> */}
                                                CheckOut
                                        </button>
                                        </Tooltip>}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.checkInTime ? moment(element?.checkInTime).format('DD-MM-YYYY hh:mm a') : "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.checkOutTime ? moment(element?.checkOutTime).format('DD-MM-YYYY hh:mm a') : <Tooltip placement="topLeft"  title='Checkout'>
                                            <button onClick={() => { handleCheckOut(element) }} className="px-2 py-1.5 text-xs rounded-md bg-header text-white border border-muted" type="button">
                                                {/*  <BiArrowFromLeft className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} /> */}
                                                CheckOut
                                        </button>
                                        </Tooltip>}</td>
                                        {/* <td className='whitespace-nowrap border-none p-2 '>{element?.category ?? "-"}</td> */}
                                        <td className="whitespace-nowrap border-none px-2 py-3">
                                            {element?.createdBy || "-"}
                                        </td>
                                        {/* <td className='whitespace-nowrap border-none p-2 '>{element?.createdBy ?? "-"}</td> */}
                                        {/* <td className='whitespace-nowrap border-none p-2 '>
                                        <span className={`${element?.status ? 'bg-[#E0FFBE] border-green-500' : 'bg-red-200 '
                                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}>
                                            {element?.status ? 'Active' : 'Inactive' ?? "-"}
                                        </span>
                                    </td> */}
                                        {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                            <span className="py-1.5 flex justify-start items-center space-x-2">
                                                {canUpdate &&
                                                    <Tooltip placement="topLeft"  title='Edit'>
                                                        <button onClick={() => { navigate(`/admin/general-client-visitor/edit/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
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
                                    <td colSpan={4} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                                </tr>)}
                        </tbody>}
                </table>}
            </div>
            {visitorList?.length > 0 &&
                <CustomPagination
                    totalCount={totalVisitorCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />}
        </GlobalLayout>
    )
}
export default GeneralVisitorList