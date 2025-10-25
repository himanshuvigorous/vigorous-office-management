import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { FaAngleDown, FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { HiOutlineFilter } from "react-icons/hi";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { encrypt } from "../../../config/Encryption";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, ProjectmanagementStatus, sortByPropertyAlphabetically } from "../../../constents/global";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { Dropdown, Modal, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import dayjs from "dayjs";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import ListLoader from "../../../global_layouts/ListLoader";
import { deleteprojectmanagementFunc, getprojectmanagementListFunc, statusprojectmanagementFunc } from "./ProjectManagementFeatures/_ProjectManagement_reducers";
import { TbHistoryToggle } from "react-icons/tb";
import {
  FaPlayCircle,
  FaPauseCircle,
  FaCheckCircle,
  FaTools,
  FaTruck,
  FaStopCircle,
} from "react-icons/fa";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { GrTransaction } from "react-icons/gr";









function ProjectManagement() {
  const { register, setValue, control, formState: { errors }, } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { projectmanagementList, totalprojectManagementCount, loading } = useSelector((state) => state.projectManagement);
  const [searchText, setSearchText] = useState("");
  // const [status, setStatus] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, loading: branchSearchLoading } = useSelector((state) => state.branch);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
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

  const filters = [CompanyId, BranchId, status, searchText].join("-");
  const [isFirstRender, setisFirstRender] = useState(false)
  const [statusLogsModalVisible, setStatusLogsModalVisible] = useState(false);
  const [currentProjectLogs, setCurrentProjectLogs] = useState([]);

  const showStatusLogs = (logs) => {
    setCurrentProjectLogs(logs);
    setStatusLogsModalVisible(true);
  };

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      fetchprojectManagement();
    } else {
      setCurrentPage(1);
    }
  }, [filters])


  useEffect(() => {
    fetchprojectManagement();
  }, [currentPage]);

  const fetchprojectManagement = async () => {
    const reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector"
            ? BranchId
            : userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
      },
    };
    await dispatch(getprojectmanagementListFunc(reqData));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteprojectmanagementFunc(reqData)).then((data) => {
          // fetchprojectManagement();

          if (currentPage > 1 && projectmanagementList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchprojectManagement();
          }
        });
      }
    });
  };

  const onChange = (e) => {

    setSearchText(e);
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

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
const handleStatusChange = async (projectId, newStatus) => {
  let reqData = {
    _id: projectId,
    status: newStatus
  };

  if (["Completed", "Delivered", "ForceClosed"].includes(newStatus)) {
    const { value: formValues } = await Swal.fire({
      title: `Enter remarks and date for ${newStatus} status`,
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Enter remarks...">` +
        `<input id="swal-input2" type="date" class="swal2-input">`,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const remark = document.getElementById('swal-input1').value;
        const date = document.getElementById('swal-input2').value;

        if (!remark || !date) {
          Swal.showValidationMessage('Both fields are required');
        }

        return { remark, date };
      }
    });

    if (!formValues) return; // User cancelled

    reqData = {
      ...reqData,
      remark: formValues.remark,
      date: new Date(formValues.date).toISOString()
    };
  }

  try {
    await dispatch(statusprojectmanagementFunc(reqData));
    fetchprojectManagement();
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

  return (
    <GlobalLayout onChange={onChange}>
      <div className="">
        <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1.5">
            {userInfoglobal?.userType === "admin" && (
              <div className="">
                <select
                  {...register("PDCompanyId", {
                    required: "company is required",
                  })}
                  className={` ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                    }`}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children).toLowerCase().includes(input.toLowerCase())
                  }
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
              </div>
            )}
            {(userInfoglobal?.userType === "admin" ||
              userInfoglobal?.userType === "company" ||
              userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <Controller
                    name="PDBranchId"
                    control={control}
                    rules={{ required: "Branch is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        className={`${inputAntdSelectClassNameFilter} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                        showSearch
                        filterOption={(input, option) =>
                          String(option?.children).toLowerCase().includes(input.toLowerCase())
                        }
                        placeholder="Select Branch"
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
                  {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
                </div>
              )}
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
                  {ProjectmanagementStatus?.map(data=>
                    <Select.Option key={data} value={data}> {data} </Select.Option>

                  )}
                
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

            {canCreate &&
              <Tooltip placement="topLeft" title=''>
                <button
                  onClick={() => {
                    navigate("/admin/project-management/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex whitespace-nowrap justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add New Project</span>
                </button>
              </Tooltip>}
          </div>
        </div>
      </div>
     <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (<table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 w-[5%]">S.No.</th>
                <th className="border-none p-2 w-[15%]">Project Code</th>
                <th className="border-none p-2 w-[20%]">Title</th>
                <th className="border-none p-2 w-[15%]">Customer</th>
                <th className="border-none p-2 w-[10%]">Start Date</th>
                <th className="border-none p-2 w-[15%]">Status</th>
                <th className="border-none p-2 w-[10%]">Team Lead</th>
                {(canUpdate || canDelete) && <th className="border-none p-2 w-[10%]">Action</th>}
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5">
                <td colSpan={8} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {projectmanagementList && projectmanagementList?.length > 0 ? (
                  projectmanagementList?.map((element, index) => (
                    <tr
                      className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                      key={element._id}
                    >
                      <td className="p-2 text-center">{index + 1 + (currentPage - 1) * limit}</td>
                      <td className="p-2">{element?.projectCode ?? "-"}</td>
                      <td className="p-2">{element?.title ?? "-"}</td>
                      <td className="p-2">{element?.customerName ?? "-"}</td>
                      <td className="p-2">
                        {element?.startDate ? dayjs(element.startDate).format('DD-MM-YYYY') : "-"}
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`${element?.status === "NotStarted"
                              ? "bg-yellow-100 border-yellow-500"
                              : element?.status === "Working"
                                ? "bg-blue-100 border-blue-500"
                                : element?.status === "OnHold"
                                  ? "bg-orange-100 border-orange-500"
                                  : element?.status === "Completed"
                                    ? "bg-green-100 border-green-500"
                                    : element?.status === "Maintenance"
                                      ? "bg-purple-100 border-purple-500"
                                      : element?.status === "Delivered"
                                        ? "bg-teal-100 border-teal-500"
                                        : element?.status === "ForceClosed"
                                          ? "bg-red-100 border-red-500"
                                          : "bg-gray-100 border-gray-500"
                              } border-[1px] px-2 py-1 rounded-lg text-black text-[12px] inline-block`}
                          >
                            {element?.status ?? "-"}
                          </span>


                        </div>
                      </td>
                      <td className="p-2">{element?.teamLeadName ?? "-"}</td>
                      {(canUpdate || canDelete) && (
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/admin/project-invoicing/${encrypt(JSON.stringify(element))}`)}
                              className="p-1 text-xs rounded-md bg-transparent border border-muted"
                              title="View Status History"
                            >
                              <GrTransaction className="hover:text-[#337ab7] text-[#3c8dbc]" size={16} />
                            </button>
                            <button
                              onClick={() => showStatusLogs(element.statusLogs)}
                              className="p-1 text-xs rounded-md bg-transparent border border-muted"
                              title="View Status History"
                            >
                              <TbHistoryToggle className="hover:text-[#337ab7] text-[#3c8dbc]" size={16} />
                            </button>

                            {canUpdate && (
                              <button
                                onClick={() => navigate(`/admin/project-management/edit/${encrypt(element._id)}`)}
                                className="p-1 text-xs rounded-md bg-transparent border border-muted"
                                title="Edit"
                              >
                                <FaPenToSquare className="hover:text-[#337ab7] text-[#3c8dbc]" size={16} />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDelete(element._id)}
                                className="p-1 rounded-md bg-transparent border border-muted"
                                title="Delete"
                              >
                                <RiDeleteBin5Line className="text-red-600 hover:text-red-500" size={16} />
                              </button>
                            )}

                            <Dropdown
                              menu={{
                                items: [
                                  element?.status !== "Working" && {
                                    key: "Working",
                                    label: (
                                      <span className="flex items-center text-green-600 hover:text-green-500">
                                        <FaPlayCircle className="mr-2" size={16} />
                                        Start Working
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "Working"), // Explicit onClick
                                  },
                                  element?.status !== "OnHold" && {
                                    key: "OnHold",
                                    label: (
                                      <span className="flex items-center text-amber-600 hover:text-amber-500">
                                        <FaPauseCircle className="mr-2" size={16} />
                                        Put On Hold
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "OnHold"),
                                  },
                                  element?.status !== "Completed" && {
                                    key: "Completed",
                                    label: (
                                      <span className="flex items-center text-blue-600 hover:text-blue-500">
                                        <FaCheckCircle className="mr-2" size={16} />
                                        Mark Completed
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "Completed"),
                                  },
                                  element?.status !== "Maintenance" && {
                                    key: "Maintenance",
                                    label: (
                                      <span className="flex items-center text-purple-600 hover:text-purple-500">
                                        <FaTools className="mr-2" size={16} />
                                        Needs Maintenance
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "Maintenance"),
                                  },
                                  element?.status !== "Delivered" && {
                                    key: "Delivered",
                                    label: (
                                      <span className="flex items-center text-cyan-600 hover:text-cyan-500">
                                        <FaTruck className="mr-2" size={16} />
                                        Mark Delivered
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "Delivered"),
                                  },
                                  element?.status !== "ForceClosed" && {
                                    key: "ForceClosed",
                                    danger: true,
                                    label: (
                                      <span className="flex items-center text-red-600 hover:text-red-500">
                                        <FaStopCircle className="mr-2" size={16} />
                                        Force Close
                                      </span>
                                    ),
                                    onClick: () => handleStatusChange(element?._id, "ForceClosed"),
                                  },
                                ].filter(Boolean), // Remove falsy values
                              }}
                              trigger={["click"]}
                            >
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={16}
                                />
                              </button>
                            </Dropdown>

                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td colSpan={8} className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">
                      data Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        )}
      </div>
      <Modal
        title="Project Status History"
        visible={statusLogsModalVisible}
        onCancel={() => setStatusLogsModalVisible(false)}
        footer={null}
        width={800}
        className="antmodalclassName"

      >
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="timeline-container">
            {currentProjectLogs?.map((log, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${log.status === "NotStarted" ? "bg-yellow-500" :
                      log.status === "Working" ? "bg-blue-500" :
                        log.status === "OnHold" ? "bg-orange-500" :
                          log.status === "Completed" ? "bg-green-500" :
                            log.status === "Maintenance" ? "bg-purple-500" :
                              log.status === "Delivered" ? "bg-teal-500" :
                                log.status === "ForceClosed" ? "bg-red-500" :
                                  "bg-gray-500"
                      }`}></div>
                    <div className="ml-3">
                      <div className="font-medium">{log.status}</div>
                      <div className="text-sm text-gray-500">
                        {dayjs(log.date).format('DD-MM-YYYY HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    by {log.userName} ({log.userType})
                  </div>
                </div>
                {log.remark && (
                  <div className="ml-6 mt-2 p-3 bg-gray-50 rounded text-sm">
                    {log.remark}
                  </div>
                )}
                {index < currentProjectLogs.length - 1 && (
                  <div className="ml-[5px] mt-2 h-4 border-l-2 border-dashed border-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
      {projectmanagementList?.length > 0 &&
        <CustomPagination
          totalCount={totalprojectManagementCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />}
    </GlobalLayout>
  );
}
export default ProjectManagement;
