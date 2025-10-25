import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { Controller, useForm, useWatch } from "react-hook-form";

import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers"
import { domainName, inputAntdSelectClassNameFilter } from "../../../constents/global"
import { FaEye, FaPlus } from "react-icons/fa"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import getUserIds from "../../../constents/getUserIds";
import {  Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import moment from "moment";

import { getGeneralVisitorList,  updateGeneralVisitor, updateVisitor, visitorSearch } from "../visitor/visitorFeatures/_visitor_reducers";
import ClientCheckoutModal, { getCurrentLocation, getFullAddress } from "./ClientCheckoutModal";
import dayjs from "dayjs";
import MapWithDate from "./MapWithDate";
import EmployeeCashbookCreateModalForVisit from "../../financeManagement/cashbook/EmployeeCashbookCreateModalForVisit";
import { AiOutlineBorderInner } from "react-icons/ai";

function EmployeeClientVisitorList() {

    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
    const { setValue, control } = useForm();
    const {
        userCompanyId,
        userBranchId,
        userType
    } = getUserIds();
    const { visitorList, totalVisitorCount, visitorGeneralList, loading } = useSelector(state => state.visitor);
    const { departmentListData } = useSelector((state) => state.department);
    const { branchList } = useSelector((state) => state.branch);
    const userInfoglobal = JSON.parse(
        localStorage.getItem(`user_info_${domainName}`)
    );
    const { employeList } = useSelector((state) => state.employe);
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

    useEffect(() => {
        if(userInfoglobal?.userType === "employee")  fetchVisitorCatList();
    }, [currentPage, branchId, employee, departmentId, category, searchText])

    const fetchVisitorCatList = () => {
        const reqListData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
               companyId: userInfoglobal?.companyId,
      directorId: '',
      branchId: userInfoglobal?.branchId,
               "employeId": userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
                category: category,
                departmentId: departmentId,
                text: searchText,
                sort: true,
                status: "",
                isPagination: true,

            }
        }
        dispatch(getGeneralVisitorList(reqListData));
    }
  

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


    const onChange = (e) => {

        setSearchText(e);
    };
    const handleEmployeeCheckInModal = (element, checkInOrCheckOut) => {
        setCheckIn(checkInOrCheckOut)
        setEmpCheckinDetailModalOpen(true);
        setEmpDetailModalData(element);
    };
     if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    );
  }
    return (
        <GlobalLayout onChange={onChange}>
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
                           
                            <th className='border-none !w-12 p-2 whitespace-nowrap'>
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
                             {( canUpdate) && <th className='border-none p-2 whitespace-nowrap w-[8%]'>
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
                                        <td className='whitespace-nowrap border-none p-2 !w-12 '>{element?.reason ?? "-"}</td>
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
                                            {!element?.cashbookData?._id ?  'Not Claimed' : element?.cashbookData?.status === "Pending" ? "Cashbook Requested" : element?.cashbookData?.status === "Approved" ?   "Claimed" :element?.cashbookData?.status === "Reject" ?  "Claim Rejected" : '-' }
                                        </td>
                                        <td className='whitespace-nowrap border-none p-2 '>{element?.kilometer ?? "-"}</td>
                                          {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                            <span className="py-1.5 flex justify-start items-center space-x-2">
                                               
                                                {canUpdate &&
                                                    <Tooltip placement="topLeft"  title={!element?.cashbookData?._id ?  'Claim Cashbook' : element?.cashbookData?.status === "Pending" ? "Cashbook Requested"  :  element?.cashbookData?.status === "Approved" ?   "Claimed" :element?.cashbookData?.status === "Reject" ?  "Claim Rejected" : '-' }>
                                                        <button disabled={element?.cashbookData?._id} onClick={() => setVisible({ isOpen: true, data: element })} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                            <AiOutlineBorderInner className={element?.cashbookData?._id ? ' text-gray-500' :' hover:text-[#337ab7] text-[#3c8dbc]'} size={16} />
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
export default EmployeeClientVisitorList