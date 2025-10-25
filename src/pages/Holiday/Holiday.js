import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../config/Encryption"


import { FaPenToSquare, FaPlus, FaAngleDown } from "react-icons/fa6"
import { deleteHolidayFunc, getHolidayListFunc, holidaySearch } from "../../redux/_reducers/_holiday_reducers"
import moment from "moment/moment"
import { RiDeleteBin5Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa"
import { AiOutlineMessage } from "react-icons/ai"
import { IoMdNotificationsOutline } from "react-icons/io"
import { HiOutlineFilter } from "react-icons/hi"
import { LoginDetails } from "../../component/LoginDetails/LoginDetails"

function Holiday() {
    const { register, setValue, formState: { errors } } = useForm();

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { HolidayListData, } = useSelector(state => state.holiday)

    useEffect(() => {
        const reqData = {
            "size": 20,
            "pageNo": 1
        }
        dispatch(getHolidayListFunc())
    }, [])


    const handleDelete = (id) => {
        let reqData1 = {
            id: id
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteHolidayFunc(reqData1)).then((data) => {

                    dispatch(getHolidayListFunc())
                })
            }
        });
        let reqData = {
            id: id
        }
        Swal.fire({
            title: "Warning",
            text: "Are you sure you want to delete!",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteHolidayFunc(reqData)).then((data) => {

                    dispatch(getHolidayListFunc())
                })
            }
        });

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

            dispatch(holidaySearch(reqData));
        }
    };

    return (
        <GlobalLayout>
            <h2 className="text-2xl font-bold">
                Holiday List
            </h2>
            <div className=''>
                <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
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
                </div>
                <div className='sm:flex justify-between items-center md:space-y-0 space-y-2 py-1'>
                    <div className='flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md'>
                        <HiOutlineFilter />
                        <span>Title</span>
                        <FaAngleDown />
                    </div>
                    <button onClick={() => { navigate("/admin/create-holiday") }} className='bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white'>
                        <FaPlus />
                        <span className='text-[12px]'>Add New Holiday</span>
                    </button>
                </div>
            </div>
            <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                <table className="w-full max-w-full rounded-xl overflow-x-auto">
                    <thead className=''>
                         <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                            <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                S.No.
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Holiday Date
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Holiday Day
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Title
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                Type
                            </th>
                            <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {HolidayListData && HolidayListData.length > 0 ?
                            HolidayListData.map((element, index) => (
                                <tr className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'}`}>
                                    <td className='whitespace-nowrap border-none p-2 '>{index + 1}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{moment(element?.holidayDate).format('DD-MM-YYYY') ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{`${element?.holidayDay} ` ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{`${element?.title}` ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2 '>{`${element?.holidayType} ` ?? "-"}</td>
                                    <td className='whitespace-nowrap border-none p-2'>
                                        <span className="py-1.5 flex justify-start items-center space-x-2">
                                            <button onClick={() => { navigate(`/admin/edit-holiday/${encrypt(element?._id)}`) }} className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
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
                                <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                            </tr>)}
                    </tbody>

                </table>
            </div>
        </GlobalLayout>
    )
}
export default Holiday