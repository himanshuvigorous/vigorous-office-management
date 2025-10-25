import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaEye, FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa6";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import {
  getwfhRequestList,
  updatewfhRequestStatus,
} from "./WFHRequestFeatures/_wfh_request_reducers";
import { domainName, inputClassNameSearch, showSwal, sortByPropertyAlphabetically } from "../../../../constents/global";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
// import CreatewfhRequestModal from "./CreatewfhRequestModal";
import { FaCheck, FaFilePdf, FaImages } from "react-icons/fa";
import moment from "moment";
// import EditwfhRequestModal from "./EditwfhRequestModal";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip, Dropdown, Modal } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { CgComment } from "react-icons/cg";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import CommonImageViewer from "../../../../global_layouts/ImageViewrModal/CommonImageViewer";
import { employeSearch } from "../../../employeManagement/employeFeatures/_employe_reducers";
import CustomDatePicker from "../../../../global_layouts/DatePicker/CustomDatePicker";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";
import CreateWfhRequestModal from "./CreateWfhRequestModal";
import EditWfhRequestModal from "./EditWfhRequestModal";
import WFHRequestViewModal from "./WFHRequestViewModal";
import CreateWfhRequestModalEmployee from "./CreateWfhRequestModalEmployee";

function WfhRequestListEmployee() {
  const { employeList } = useSelector((state) => state.employe);

  const { departmentListData, loading: depLoading } = useSelector(
    (state) => state.department
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      status: ''
    }
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { wfhRequestData, totalwfhrequestCount, loading } = useSelector((state) => state.wfhRequest);
  const { companyList } = useSelector((state) => state.company);


  const [modal, setModal] = useState({
    isOpen: false,
    data: {},
    wfhRequest: {}
  })

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

  const { branchList } = useSelector(
    (state) => state.branch
  );
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const department = useWatch({
    control,
    name: "department",
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
  const [isCraeteModalOpen, setIsCraeteModalOpen] = useState(false);
  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [editModalId, setEditModalId] = useState(null);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  )
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const employeeId = useWatch({
    control,
    defaultValue: '',
    name: 'employeeId',


  })

  const limit = 10;
  const [searchText, setSearchText] = useState("");

  const filters = [CompanyId, BranchId, searchText, status, startDate, endDate, employeeId, department].join("-");
  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      getwfhRequestListRequest();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    getwfhRequestListRequest();
  }, [currentPage]);
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();


  const getwfhRequestListRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        // employeId: '6842fc518d31f1150317f8cf',
        employeId: userInfoglobal?.userType === "employee" ? userInfoglobal?._id : null,
        companyId: userInfoglobal?.companyId,
        branchId: userInfoglobal?.branchId,
        directorId: '',
        text: searchText,
        startDate: startDate ? dayjs(startDate).format("YYYY-MM-DD") : '',
        endDate: endDate ? dayjs(endDate).format("YYYY-MM-DD") : '',
        sort: true,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getwfhRequestList(data));
  };

  const [isModalViewOpen, setisViewModalOpen] = useState({
    isOpen: false,
    data: null
  })
  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    )
  }

  const onChange = (e) => {

    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <>

        <div className="">
          <div class="2xl:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto gap-1">
            <div className="grid sm:grid-cols-3 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 sm:gap-3 gap-1">




              <div className="">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <CustomDatePicker size={"middle"} disabled={loading} report={true} field={field} errors={errors} />
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="endDate"
                  control={control}
                  className={`inputAntdSelectClassNameFilterReport`}
                  render={({ field }) => (
                    <CustomDatePicker size={"middle"} disabled={loading} report={true} field={field} errors={errors} />
                  )}
                />
              </div>
              <div className="">
                <Controller
                  name="status"
                  control={control}
                  rules={{}}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className={`inputAntdSelectClassNameFilterReport`}
                      placeholder="Select Status"
                      disabled={loading}
                      showSearch
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      <Select.Option value="">Select Status</Select.Option>
                      <Select.Option value="pending"> pending </Select.Option>
                      <Select.Option value="approved"> approved </Select.Option>
                      <Select.Option value="rejected"> rejected </Select.Option>
                    </Select>
                  )}
                />
              </div>
              {/* <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PdCompanyId", "")
                  setValue("status", "")
                }}
                className="bg-header h-8 rounded-md hidden lg:flex px-2 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button> */}
            </div>
            <div className="2xl:flex hidden justify-end items-center gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", '')
                  setValue("PdCompanyId", "")
                  setValue("endDate", "")
                  setValue("startDate", "")
                  setValue("status", "")
                  setValue("department", "")
                  setValue("employeeId", "")
                }}
                className="bg-header  py-1.5 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
                <span className="text-[12px]">Reset</span>
              </button>
              {(canCreate) && <Tooltip placement="topLeft" title='Add wfh Request'>
                <button
                  onClick={() => {
                    // navigate("/admin/wfh-request-list/create");
                    setIsCraeteModalOpen(true);
                  }}
                  className="bg-header px-2 py-1.5 w-44 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add wfh Request</span>
                </button>
              </Tooltip>}
            </div>
          </div>
          <div className="flex 2xl:hidden justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", '')
                setValue("PdCompanyId", "")
                setValue("endDate", "")
                setValue("startDate", "")
                setValue("status", "")
                setValue("department", "")
                setValue("employeeId", "")

              }}
              className="bg-header  py-1.5 my-0.5 rounded-md flex px-10 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>
            {(canCreate) && <Tooltip placement="topLeft" title='Add wfh Request'>
              <button
                onClick={() => {
                  // navigate("/admin/wfh-request-list/create");
                  setIsCraeteModalOpen(true);
                }}
                className="bg-header px-2 py-1.5 w-44 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add wfh Request</span>
              </button>
            </Tooltip>}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead>
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[5%]">S.No.</th>
                {/* <th className="tableHead">Name</th> */}
                {/* <th className="tableHead">Department</th> */}
                <th className="tableHead">Reason</th>
                <th className="tableHead">WFH Type</th>
                <th className="tableHead">Requested days</th>
                <th className="tableHead">from date</th>
                <th className="tableHead">to date</th>
                <th className="tableHead">Requested At</th>
                <th className="tableHead">approved By</th>
                <th className="tableHead">approved Date</th>
                <th className="tableHead">Status</th>
                <th className="tableHead w-[10%]">Action</th>
              </tr>
            </thead>
            <tbody>
              {wfhRequestData && wfhRequestData.length > 0 ? (
                wfhRequestData.map((element, index) => (
                  <tr
                    key={element._id}
                    className={`text-black ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} border-b-[1px] border-[#DDDDDD]`}
                  >
                    <td className="tableData">{index + 1}</td>
                    {/* <td className="tableData">{element?.employeName}</td> */}
                    {/* <td className="tableData">{element?.designationName || 'N/A'}</td> */}
                    <td className="tableData">{element?.reason || 'N/A'}</td>
                    <td className="tableData">{element?.wfhManagerData?.name || 'N/A'}</td>

                    <td className="tableData">
                      {moment(element?.endDate).diff(moment(element?.startDate), 'days') + 1}
                    </td>
                    <td className="tableData">
                      {moment(element?.startDate).format('DD-MM-YYYY')}
                    </td>
                    <td className="tableData">
                      {moment(element?.endDate).format('DD-MM-YYYY')}
                    </td>
                    <td className="tableData">
                      {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}
                    </td>
                    <td className="tableData">{element?.status !== 'pending' ? element?.updatedBy || 'SJC and Saar Group' : '-'}</td>
                    <td className="tableData">
                      {dayjs(element?.updatedAt).format('DD-MM-YYYY hh:mm a')}
                    </td>
                    <td className="tableData">
                      <Tooltip placement="topLeft" title={`WFH Status - ${element?.status}`}>
                        <span
                          className={`${element?.status === 'approved'
                            ? 'bg-green-200 border-green-500 text-black'
                            : element?.status === 'pending'
                              ? 'bg-yellow-200 border-yellow-500 text-black'
                              : element?.status === 'rejected'
                                ? 'bg-red-200 border-red-500 text-black'
                                : 'bg-gray-200 border-gray-500 text-black'
                            } border-[1px] px-2 py-1.5 rounded-lg text-[12px]`}
                        >
                          {element?.status || '-'}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="tableData">
                      <Dropdown
                        menu={{
                          items: [

                            {
                              key: 'view',
                              label: (
                                <span className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]">
                                  <FaEye className="mr-2" size={16} />
                                  view Request
                                </span>
                              ),

                              onClick: () => {
                                setisViewModalOpen({
                                  isOpen: true,
                                  data: element
                                })
                              }
                            },
                            {
                              key: 'edit',
                              label: (
                                <span className="flex items-center text-[#3c8dbc] hover:text-[#337ab7]">
                                  <FaPenToSquare className="mr-2" size={16} />
                                  Edit Request
                                </span>
                              ),
                              disabled: element?.status !== 'pending',
                              onClick: () => {
                                if (element?.status === "pending") {
                                  setisEditModalOpen(true);
                                  setEditModalId(element?._id);
                                }
                              }
                            },


                          ],
                        }}
                        trigger={['click']}
                      >
                        <Tooltip placement="topLeft" title="Actions">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5">
                  <td
                    colSpan={12}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-center text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CustomPagination
          totalCount={totalwfhrequestCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
        <CreateWfhRequestModalEmployee
          isOpen={isCraeteModalOpen}
          onClose={() => setIsCraeteModalOpen(false)}
          fetchattendanceListData={getwfhRequestListRequest}

        />
        <EditWfhRequestModal
          isOpen={isEditModalOpen}
          onClose={() => { setisEditModalOpen(false); setEditModalId(null) }}
          wfhRequestId={editModalId}
          fetchattendanceListData={getwfhRequestListRequest}

        />
        <WFHRequestViewModal
          modaldata={isModalViewOpen}
          handleClose={() => {
            setisViewModalOpen({
              isOpen: false,
              data: null
            })
          }}
        />

      </>

    </GlobalLayout >
  );
}
export default WfhRequestListEmployee;