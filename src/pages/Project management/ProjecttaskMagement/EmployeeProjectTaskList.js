import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6"
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, inputAntdSelectClassNameFilter, ProjectTaskStatus} from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import {  getProjectTaskList, statusProjectTaskFunc } from "./ProjecttaskFeatures/_project_task_reducers";
import CreateProjectTask from "./CreateProjectTask";
import { BsEye } from "react-icons/bs";
import LogsProjectTaskView from "./LogsProjectTaskView";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import StatusDropdown from "./StatusDropDown";

function EmployeeProjectTaskList() {
    const { register, control, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { projectTaskList, totalProjectTaskCount, loading } = useSelector(state => state.projectTask)

    const [searchText, setSearchText] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState({
        isOpen: false,
        data: null
    })
    const [openLogsModal, setOpenLogsModal] = useState({
        isOpen: false,
        data: null
    })

    const [currentPage, setCurrentPage] = useState(1);


    const status = useWatch({
        control,
        name: 'status',
        defaultValue: ''
    });
    const startDate = useWatch({
        control,
        name: "startDate",
        defaultValue: dayjs(),
    });

    const endDate = useWatch({
        control,
        name: "endDate",
        defaultValue: dayjs(),
    });
    const limit = 10;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };


    const filters = [status, searchText, startDate, endDate].join("-");
    const [isFirstRender, setisFirstRender] = useState(false)

    useEffect(() => {
        if (!isFirstRender) {
            setisFirstRender(state => true);
            return;
        }
        if (currentPage === 1) {
            fetchProjectTaskList();
        } else {
            setCurrentPage(1);
        }
    }, [filters])

    useEffect(() => {
        if (userInfoglobal?.userType !== "employee") return
        fetchProjectTaskList()
    }, [currentPage])


    const fetchProjectTaskList = () => {
        const reqData = {
            page: currentPage,
            limit: limit,
            reqPayload: {
                companyId:userInfoglobal?.companyId,
                branchId:userInfoglobal?.branchId,
                directorId: "",
                text: searchText,
                sort: true,
                status: status,
                isPagination: true,
                "projectId": "",
                "taskId": "",
                "assignedTo": userInfoglobal?._id,
                "departmentId": userInfoglobal?.departmentId,
                "creatorId": "",
                "followerIds": [],
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',


            }
        }
        if (!userInfoglobal?.departmentId) return
        dispatch(getProjectTaskList(reqData))
    }

   
   
    const handleStatusChange = (status, id) => {
        dispatch(statusProjectTaskFunc({

            "_id": id,
            "status": status

        })).then((res) => {
            if (!res.error) {
                fetchProjectTaskList()
            }
        })
    }
    const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

    const onChange = (e) => {

        setSearchText(e);
    };
    if (userInfoglobal?.userType !== "employee" ) {
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

            <section>
                <div className="">

                    <div className="grid grid-cols-1 sm:flex  gap-2 items-center justify-start py-1 text-[14px] rounded-md w-full">
                        <div >
                            <Controller
                                name="status"
                                control={control}
                                rules={{}}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        className={`capitalize w-32 ${inputAntdSelectClassNameFilter} ${errors.status
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
                                        {ProjectTaskStatus?.map(data =>


                                            <Select.Option className="capitalize" key={data} value={data}> {data} </Select.Option>)}

                                    </Select>
                                )}
                            />
                        </div>
                        <div >
                            <Controller
                                name="startDate"
                                control={control}
                                defaultValue={dayjs()}
                                render={({ field }) => (
                                    <CustomDatePicker
                                        report={true}
                                        disabled={loading}
                                        placeholder="Start date"
                                        size={"middle"} field={field} errors={errors} />
                                )}
                            />
                        </div>
                        <div >
                            <Controller
                                name="endDate"
                                report={true}
                                control={control}
                                defaultValue={dayjs()}
                                render={({ field }) => (
                                    <CustomDatePicker size={"middle"}
                                        disabled={loading}
                                        placeholder="Start date"
                                        report={true} field={field} errors={errors} />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 my-1">
                        <button
                            onClick={() => {
                                setValue("status", "");
                                setValue("PDBranchId", '');
                                setValue("PdCompanyId", "");
                                setValue("startDate", dayjs());
                                setValue("endDate", dayjs());
                            }}
                            className="bg-header   py-[5px]  rounded-md  flex px-5 justify-center items-center  text-white">
                            <span className="text-[12px]">Reset</span>
                        </button>
                        {canCreate &&
                            <Tooltip placement="topLeft" title='Add task'>
                                <button
                                    onClick={() => {
                                        // navigate("/admin/project-task/create");
                                        setOpenCreateModal({
                                            isOpen: true,
                                            data: null
                                        })
                                    }}
                                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                                >
                                    <FaPlus />
                                    <span className="text-[12px]">Add Your task</span>
                                </button>
                            </Tooltip>}
                    </div>
                </div>
                <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                    {(canRead) && <table className="w-full max-w-full rounded-xl overflow-x-auto">
                        <thead className=''>
                            <tr className='border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]'>
                                <th className='border-none p-2 whitespace-nowrap w-[5%]'>
                                    S.No.
                                </th>

                                <th className='border-none p-2 whitespace-nowrap w-[20%]'>
                                    Title
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                    Assigned To
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    Department
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    Time Spent
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                    Created By
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[15%]'>
                                    Created At
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
                                    Priority
                                </th>
                                <th className='border-none p-2 whitespace-nowrap w-[10%]'>
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
                                {projectTaskList && projectTaskList?.length > 0 ?
                                    projectTaskList?.map((element, index) => (
                                        <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151] text-[14px]`}>
                                            <td className='whitespace-nowrap border-none p-2 text-center'>
                                                {index + 1 + ((currentPage - 1) * limit)}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {element?.title ?? "-"}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {element?.assignedToData?.fullName ?? "-"}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {element?.departmentName ?? "-"}
                                            </td>
                                             <td className='whitespace-nowrap border-none text-teal-600 p-2'>
                                                {element?.totalTimeSpentInMin !== undefined
                                                    ? `${Math.floor(element.totalTimeSpentInMin / 60)}h ${element.totalTimeSpentInMin % 60}m`
                                                    : "-"}
                                            </td>

                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {element?.createdBy ?? "-"}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                <span className={`px-2 py-1 rounded-lg text-white text-[12px] ${element?.priority === 'high' ? 'bg-red-500' :
                                                    element?.priority === 'medium' ? 'bg-yellow-500' :
                                                        'bg-green-500'
                                                    }`}>
                                                    {element?.priority ? element.priority.charAt(0).toUpperCase() + element.priority.slice(1) : "-"}
                                                </span>
                                            </td>
                                            <td className='whitespace-nowrap border-none p-2 '>
                                                <StatusDropdown element={element} handleStatusChange={handleStatusChange} employeePortal={true} />
                                            </td>
                                            {(canDelete || canUpdate) && <td className='whitespace-nowrap border-none p-2'>
                                                <span className="py-1.5 flex justify-start items-center space-x-2">
                                                    {canUpdate &&
                                                        <Tooltip placement="topLeft" title='view'>
                                                            <button
                                                                onClick={() => {
                                                                    setOpenLogsModal({
                                                                        isOpen: true,
                                                                        data: element

                                                                    })

                                                                }}
                                                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted" type="button">
                                                                <BsEye className=' hover:text-[#337ab7] text-[#3c8dbc]' size={16} />
                                                            </button>
                                                        </Tooltip>
                                                    }
                                                </span>
                                            </td>}
                                        </tr>
                                    ))
                                    : (<tr className="bg-white bg-opacity-5 " >
                                        <td colSpan={10} className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">No Tasks Found</td>
                                    </tr>)}
                            </tbody>}
                    </table>}
                </div>

                <CustomPagination
                    totalCount={totalProjectTaskCount}
                    pageSize={limit}
                    currentPage={currentPage}
                    onChange={onPaginationChange}
                />

                <CreateProjectTask isOpen={openCreateModal?.isOpen} data={openCreateModal?.data} fetchListAfterSuccess={fetchProjectTaskList} closeModalFunc={() => setOpenCreateModal({
                    isOpen: false,
                    data: null
                })} handlingPerson = "employee"   />
              
                <LogsProjectTaskView isOpen={openLogsModal?.isOpen} data={openLogsModal?.data} fetchListAfterSuccess={fetchProjectTaskList} closeModalFunc={() => {
                    setOpenLogsModal({
                        isOpen: false,
                        data: null
                    })
                    fetchProjectTaskList()
                }
                } />
            </section>

        </GlobalLayout>
    )
}
export default EmployeeProjectTaskList