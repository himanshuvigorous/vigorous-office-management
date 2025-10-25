import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Controller, useForm, useWatch } from "react-hook-form";

import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers"
import { domainName, inputAntdSelectClassNameFilter, sortByPropertyAlphabetically } from "../../../constents/global"
import { FaEye, FaPlus } from "react-icons/fa"
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
import ClientCheckoutModal, { getCurrentLocation, getFullAddress } from "./ClientCheckoutModal";
import dayjs from "dayjs";
import MapWithDate from "./MapWithDate";
import EmployeeCashbookCreateModalForVisit from "../../financeManagement/cashbook/EmployeeCashbookCreateModalForVisit";
import { AiOutlineBorderInner } from "react-icons/ai";
import ListLoader from "../../../global_layouts/ListLoader";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";

function ClientVisitorList() {

    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
    const { setValue, control } = useForm();
    const {
        userCompanyId,
        userBranchId,
        userType
    } = getUserIds();
    const { visitorList, totalVisitorCount, visitorGeneralList, loading } = useSelector(state => state.visitor);
    const { departmentListData, loading: depLoading } = useSelector((state) => state.department);
    const { branchList, loading: branchListLoading } = useSelector((state) => state.branch);
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    const { employeList, loading: employeListLoading } = useSelector((state) => state.employe);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState("");
    const [visitorModal, setVisitorModal] = useState({
        data: null,
        isOpen: false
    });
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
    const startDate = useWatch({
        control,
        name: "startDate",
        defaultValue: "",
    });
    const endDate = useWatch({
        control,
        name: "endDate",
        defaultValue: "",
    });
    const category = useWatch({
        control,
        name: "category",
        defaultValue: '',
    });
    const [visible, setVisible] = useState({
        isOpen: false,
        data: null
    })
    const [empDetailModalData, setEmpDetailModalData] = useState({});
    const [empCheckInDetailModalOpen, setEmpCheckinDetailModalOpen] = useState(false);
    const [checkIn, setCheckIn] = useState('')
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

    const filters = [branchId, employee, departmentId, category, searchText,startDate, endDate].join("-");
    const [isFirstRender ,setisFirstRender] = useState(false)
    
      useEffect(() => {
        if (!isFirstRender) {
          setisFirstRender(state=>true);
          return;
        }
        if (currentPage === 1) {
          fetchVisitorCatList();
        } else {
          setCurrentPage(1);
        }
      }, [filters]);

    useEffect(() => {
        fetchVisitorCatList();
    }, [currentPage])

    const fetchVisitorCatList = () => {
        const reqListData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId: companyId,
                branchId: branchId,
                "directorId": "",
                employeId: employee,
                category: category,
                departmentId: departmentId,
                text: searchText,
                sort: true,
                status: "",
                isPagination: true,
                startDate: startDate ? dayjs(startDate)?.format("YYYY-MM-DD") : null,
                                endDate: endDate ? dayjs(endDate)?.format("YYYY-MM-DD") : null,

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
                    // !data.error && fetchVisitorCatList();
                    if (currentPage > 1 && visitorGeneralList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        !data.error && fetchVisitorCatList();
                    }
                })
            }
        });
    };

    const handleEmloyeeCehckin = async (vistorData) => {
        const location = await getCurrentLocation();
        const address = await getFullAddress(location?.lat, location?.lng);
        const {
            date,
            checkInTime,
            checkOutTime,
            timeDurationStart,
            timeDurationEnd,
            ...payload
        } = vistorData;
        const finalPayload = {
            ...payload,
            checkInTime: dayjs(),
            checkInLocation: {
                latitude: location?.lat ?? 0,
                longitude: location.lng ?? 0,
                address: address ?? "",
            },
        };

        dispatch(updateGeneralVisitor(finalPayload)).then((data) => {
            if (!data.error) fetchVisitorCatList()
        });
    }

    const handleEmloyeeCehckout = (element) => {
        setVisitorModal({
            data: element,
            isOpen: true
        })
    }

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
    const handleEmployeeCheckInModal = (element, checkInOrCheckOut) => {
        setCheckIn(checkInOrCheckOut)
        setEmpCheckinDetailModalOpen(true);
        setEmpDetailModalData(element);
    };
    return (
        <GlobalLayout onChange={onChange}>

            <div className=''>
                <div class="xl:flex justify-between items-center py-1 xl:space-y-0 space-y-2 overflow-y-auto">
                    <div className="grid sm:grid-cols-2 grid-cols-1 md:grid-cols-6 sm:gap-3 gap-1">
                        <div className="">
                            <Controller
                                control={control}
                                name="category"
                                rules={{ required: "category is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        defaultValue={""}
                                        disabled={loading}
                                        className={` ${inputAntdSelectClassNameFilter} `}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }
                                    >
                                        <Select.Option className="" value="">Select Category</Select.Option>
                                        <Select.Option value="general">General Visitor</Select.Option>
                                        <Select.Option value="client"> Client Visitor</Select.Option>

                                    </Select>
                                )}
                            />
                        </div>
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
                                            disabled={loading}
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

                                            {branchListLoading ? (
                                                <Select.Option disabled>
                                                    <ListLoader />
                                                </Select.Option>
                                            ) : (
                                                sortByPropertyAlphabetically(branchList)?.map(
                                                    (type) => (
                                                        <Select.Option key={type?._id} value={type?._id}>
                                                            {type?.fullName}
                                                        </Select.Option>
                                                    )
                                                )
                                            )}
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
                                        disabled={loading}
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
                        </div>
                        <div className="">
                            <Controller
                                name="employee"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={` ${inputAntdSelectClassNameFilter} `}
                                        disabled={loading}
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
                                        {employeListLoading ? (
                                            <Select.Option disabled>
                                                <ListLoader />
                                            </Select.Option>
                                        ) : (
                                            sortByPropertyAlphabetically(employeList)?.map(
                                                (item) => (
                                                    <Select.Option key={item._id} value={item._id}>
                                                        {item.fullName}
                                                    </Select.Option>
                                                )
                                            )
                                        )}
                                    </Select>
                                )}
                            />
                        </div>
                         <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomDatePicker
                                            report={true}
                                            defaultValue={dayjs().subtract(1, 'month')}
                                            size={"middle"} field={field} />
                                    )}
                                />
                        
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <CustomDatePicker report={true}
                                        defaultValue={dayjs()}
                                        size={"middle"} field={field} />
                                )}
                            />
                    </div>
                    <div className="flex justify-end items-center gap-2 ">
                        <button
                            onClick={() => {
                                setValue("employee", "");
                                setValue("PDBranchId", '');
                                setValue("PdDepartmentId", '');
                                setValue("category", "");
                                setValue("PdCompanyId", "");
                                   setValue("startDate",null)
                                setValue("endDate",null)
                            }}
                            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate &&
                            <Tooltip placement="topLeft"  title='Add Visitor'>
                                <button onClick={() => { navigate("/admin/client-visitor/create") }} className='bg-header p-2 rounded-md flex justify-center items-center space-x-2 text-white'>
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

                            <th className='border-none p-2 whitespace-nowrap'>
                                Category type
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Mobile Number
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Employees
                            </th>

                            <th className='border-none p-2 !w-12 whitespace-nowrap'>
                                Reason
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Expected Checkin
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Expected CheckOut
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Employee Checkin
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Employee Checkout
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                Cashbook Status
                            </th>
                            <th className='border-none p-2 whitespace-nowrap'>
                                KM
                            </th>
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
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.category == "client" ? "Client Visit" : "General Visit"}</td>
                                        <td className="whitespace-nowrap border-none p-2">
                                            {element?.mobile?.code + " " + element?.mobile?.number || '-'}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            <div className={`  `}>
                                                {element?.employeData?.map((element, index) => {
                                                    return (
                                                        element?.fullName
                                                    )
                                                }, [])}
                                            </div>

                                        </td>
                                        <td className='whitespace-nowrap border-none !w-12 p-2 '>{element?.reason ?? "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.timeDurationStart ? moment(element?.timeDurationStart).format('DD-MM-YYYY hh:mm a') : "-"}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.timeDurationEnd ? moment(element?.timeDurationEnd).format('DD-MM-YYYY hh:mm a') : '-'}</td>
                                        <td className='whitespace-nowrap border-none p-2 '>

                                            <div className="flex justify-center items-center gap-2">
                                                {element?.checkInTime ? moment(element?.checkInTime).format('DD-MM-YYYY hh:mm a') : <Tooltip placement="topLeft"  title='Checkin'>
                                                    <button onClick={() => { handleEmloyeeCehckin(element) }} className="px-2 py-1.5 text-xs rounded-md bg-header text-white border border-muted" type="button">
                                                        check in
                                                    </button>
                                                </Tooltip>}
                                                {element.checkInTime ?
                                                    <FaEye
                                                        onClick={() => handleEmployeeCheckInModal(element, 'checkin')}
                                                        className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                                        size={14}
                                                    /> : ''}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap border-none p-2">
                                            <div className="flex justify-center items-center gap-2">
                                                {!element?.checkInTime ? (
                                                    '-'
                                                ) : element?.checkOutTime ? (
                                                    moment(element.checkOutTime).format('DD-MM-YYYY hh:mm a')
                                                ) : (
                                                    <Tooltip placement="topLeft"  title="Checkout">
                                                        <button
                                                            onClick={() => handleEmloyeeCehckout(element)}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-header text-white border border-muted"
                                                            type="button"
                                                        >
                                                            Check Out
                                                        </button>
                                                    </Tooltip>
                                                )}
                                                {element.checkOutTime ?
                                                    <FaEye
                                                        onClick={() => handleEmployeeCheckInModal(element, 'checkout')}
                                                        className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                                        size={14}
                                                    /> : ''}
                                            </div>
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>
                                            {!element?.cashbookData?._id ? 'Not Claimed' : element?.cashbookData?.status === "Pending" ? "Cashbook Requested" : element?.cashbookData?.status === "Approved" ? "Cashbook Approved" : element?.cashbookData?.status === "Reject" ? "Claim Rejected" : '-'}
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.kilometer ?? "-"}</td>
                                        {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                            <span className="py-1.5 flex justify-start items-center space-x-2">
                                                {canUpdate && (
                                                    <Tooltip placement="topLeft"  title={(element?.checkInTime || element?.checkOutTime) ? "No Actions" : "Edit"}>
                                                        <button
                                                            disabled={!!(element?.checkInTime || element?.checkOutTime)}
                                                            onClick={() => { navigate(`/admin/client-visitor/edit/${encrypt(element?._id)}`) }}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                                            type="button"
                                                        >
                                                            <FaPenToSquare
                                                                className={(element?.checkInTime || element?.checkOutTime)
                                                                    ? 'hover:text-gray-500 text-gray-500'
                                                                    : 'hover:text-[#337ab7] text-[#3c8dbc]'}
                                                                size={16}
                                                            />
                                                        </button>
                                                    </Tooltip>
                                                )}

                                                {canUpdate &&
                                                    <Tooltip placement="topLeft"  title={!element?.cashbookData?._id ? 'Claim Cashbook' : element?.cashbookData?.status === "Pending" ? "Cashbook Requested" : element?.cashbookData?.status === "Approved" ? "Cashbook Approved" : element?.cashbookData?.status === "Reject" ? "Claim Rejected" : '-'}>
                                                        <button disabled={element?.cashbookData?._id} onClick={() => setVisible({ isOpen: true, data: element })} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <AiOutlineBorderInner className={element?.cashbookData?._id ? ' text-gray-500' : ' hover:text-[#337ab7] text-[#3c8dbc]'} size={16} />
                                                        </button>
                                                    </Tooltip>}
                                                {canDelete && (
                                                    <Tooltip placement="topLeft"  title={(element?.checkInTime || element?.checkOutTime) ? "No Actions" : "Delete"}>
                                                        <button
                                                            disabled={!!(element?.checkInTime || element?.checkOutTime)}
                                                            onClick={() => handleDelete(element?._id)}
                                                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                                            type="button"
                                                        >
                                                            <RiDeleteBin5Line
                                                                className={(element?.checkInTime || element?.checkOutTime)
                                                                    ? 'hover:text-gray-500 text-gray-500'
                                                                    : 'text-red-600 hover:text-red-500'}
                                                                size={16}
                                                            />
                                                        </button>
                                                    </Tooltip>
                                                )}
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

            <EmployeeCashbookCreateModalForVisit visible={visible} onCancel={() => setVisible({ isOpen: false, data: null })} onSuccess={fetchVisitorCatList} />
            <ClientCheckoutModal setVisitorModal={setVisitorModal} visitorModal={visitorModal} updateList={fetchVisitorCatList} />
            <MapWithDate empDetailModalData={empDetailModalData} empCheckInDetailModalOpen={empCheckInDetailModalOpen} checkIn={checkIn} setEmpCheckinDetailModalOpen={setEmpCheckinDetailModalOpen} />
            {visitorGeneralList?.length > 0 &&
                <CustomPagination
                    totalCount={totalVisitorCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />}
        </GlobalLayout>
    )
}
export default ClientVisitorList