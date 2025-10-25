import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, inputAntdSelectClassNameFilter, ProjectmanagementStatus, ProjectTaskStatus, sortByPropertyAlphabetically } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../../global_layouts/Loader/Loader";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import ListLoader from "../../../global_layouts/ListLoader";
import { deleteProjectTaskFunc, getProjectTaskList, statusProjectTaskFunc } from "./ProjecttaskFeatures/_project_task_reducers";
import CreateProjectTask from "./CreateProjectTask";
import UpdateProjectTask from "./UpdateProjectTask";
import { BsEye } from "react-icons/bs";
import LogsProjectTaskView from "./LogsProjectTaskView";
import CustomDatePicker from "../../../global_layouts/DatePicker/CustomDatePicker";
import StatusDropdown from "./StatusDropDown";
import { employeSearch } from "../../employeManagement/employeFeatures/_employe_reducers";

function ProjectTaskList() {
    const { register, control, setValue, formState: { errors } } = useForm();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
    const { companyList } = useSelector((state) => state.company);
    const { branchList, loading: branchSearchLoading } = useSelector((state) => state.branch);
    const { projectTaskList, totalProjectTaskCount, loading } = useSelector(state => state.projectTask)
    const { employeList, laoding: employeelistLoading } = useSelector((state) => state.employe);

    const [searchText, setSearchText] = useState("");
    const [openCreateModal, setOpenCreateModal] = useState({
        isOpen: false,
        data: null
    })
    const [openUpdateModal, setOpenUpdateModal] = useState({
        isOpen: false,
        data: null
    })
    const [openLogsModal, setOpenLogsModal] = useState({
        isOpen: false,
        data: null
    })

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
    const employeeId = useWatch({
        control,
        name: "employeeId",
        defaultValue: "",
    });
    const limit = 10;

    const onPaginationChange = (page) => {
        setCurrentPage(page);
    };


    const filters = [CompanyId, BranchId, status, searchText, startDate, endDate, employeeId].join("-");
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
        fetchProjectTaskList()
    }, [currentPage])


    const fetchProjectTaskList = () => {
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
                status: status,
                isPagination: true,
                "projectId": "",
                "taskId": "",
                "assignedTo": employeeId,
                "departmentId": '',
                "creatorId": "",
                "followerIds": [],
                startDate: startDate ? dayjs(startDate).format('YYYY-MM-DD') : '',
                endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : '',


            }
        }
        dispatch(getProjectTaskList(reqData))
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
                dispatch(deleteProjectTaskFunc(reqData)).then((data) => {
                    // fetchVendorList()

                    if (currentPage > 1 && projectTaskList?.length == 1) {
                        setCurrentPage(Number(currentPage - 1));

                    } else {
                        fetchProjectTaskList();
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
    const handleEmployeeFocus = () => {
        dispatch(
            employeSearch({
                companyId: userInfoglobal?.userType === "company"
                    ? userInfoglobal?._id
                    : userInfoglobal?.companyId,
                branchId:
                    ["admin", "company", "companyDirector"].includes(userInfoglobal?.userType)
                        ? BranchId
                        : userInfoglobal?.userType === "companyBranch"
                            ? userInfoglobal?._id
                            : userInfoglobal?.branchId,
                departmentId: '',
                directorId: "",
                text: "",
                sort: true,
                status: true,
                isPagination: false,
                isBranch: true,
                isDirector: false,
            })
        )
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

    return (
        <GlobalLayout onChange={onChange}>

            <section>
                <div className="">

                    <div className="grid grid-cols-1 sm:flex  gap-2 items-center justify-start py-1 text-[14px] rounded-md w-full">
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

                        <div >
                            <Controller
                                name="employeeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        allowClear
                                        className={`inputAntdSelectClassNameFilterReport`}
                                        disabled={loading}
                                        placeholder="Select Employee"
                                        onFocus={handleEmployeeFocus}
                                        showSearch
                                        filterOption={(input, option) =>
                                            String(option?.children).toLowerCase().includes(input.toLowerCase())
                                        }

                                        value={field.value || []}
                                        onChange={(val) => field.onChange(val)}
                                    >
                                        <Select.Option value="">Select Employee</Select.Option>
                                        {employeelistLoading ? (<Select.Option disabled>
                                            <ListLoader />
                                        </Select.Option>) : (sortByPropertyAlphabetically(employeList, 'fullName')?.map((type) => (
                                            <Select.Option key={type?._id} value={type?._id}>
                                                {type?.fullName}
                                            </Select.Option>
                                        )))}
                                    </Select>
                                )}
                            />
                        </div>
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
                                // setValue("PdDepartmentId", "");
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
                                    <span className="text-[12px]">Add task</span>
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
                                                <StatusDropdown element={element} handleStatusChange={handleStatusChange} />


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
                                                    {canUpdate && (
                                                        <Tooltip
                                                            placement="topLeft"
                                                            title={
                                                                element?.status === "done" || element?.status === "rejected"
                                                                    ? "Edit not allowed for Done/Rejected"
                                                                    : "Edit"
                                                            }
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    if (element?.status === "done" || element?.status === "rejected") return;
                                                                    setOpenUpdateModal({
                                                                        isOpen: true,
                                                                        data: element,
                                                                    });
                                                                }}
                                                                disabled={element?.status === "done" || element?.status === "rejected"}
                                                                className={`px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted transition ${element?.status === "done" || element?.status === "rejected"
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : "hover:border-[#337ab7]"
                                                                    }`}
                                                                type="button"
                                                            >
                                                                <FaPenToSquare
                                                                    className={`${element?.status === "done" || element?.status === "rejected"
                                                                        ? "text-gray-400"
                                                                        : "text-[#3c8dbc] hover:text-[#337ab7]"
                                                                        }`}
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </Tooltip>
                                                    )}

                                                    {canDelete && (
                                                        <Tooltip
                                                            placement="topLeft"
                                                            title={
                                                                element?.status === "done" || element?.status === "rejected"
                                                                    ? "Delete not allowed for Done/Rejected"
                                                                    : "Delete"
                                                            }
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    if (element?.status === "done" || element?.status === "rejected") return;
                                                                    handleDelete(element?._id);
                                                                }}
                                                                disabled={element?.status === "done" || element?.status === "rejected"}
                                                                className={`px-2 py-1.5 rounded-md bg-transparent border border-muted transition ${element?.status === "done" || element?.status === "rejected"
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : "hover:border-red-400"
                                                                    }`}
                                                                type="button"
                                                            >
                                                                <RiDeleteBin5Line
                                                                    className={`${element?.status === "done" || element?.status === "rejected"
                                                                        ? "text-gray-400"
                                                                        : "text-red-600 hover:text-red-500"
                                                                        }`}
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
                })} isDirector={true} />
                <UpdateProjectTask isOpen={openUpdateModal?.isOpen} data={openUpdateModal?.data} fetchListAfterSuccess={fetchProjectTaskList} closeModalFunc={() => setOpenUpdateModal({
                    isOpen: false,
                    data: null
                })} />
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
export default ProjectTaskList