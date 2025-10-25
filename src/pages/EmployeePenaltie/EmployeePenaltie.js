import { useNavigate, useSearchParams } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { encrypt } from "../../config/Encryption";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  deleteemployeePenaltyType,
  employeePenaltyTypeSearch,
  getPenaltyList,
  statusEmployeePenaltyType,
} from "./employeePenaltyFeatures/_employeePenalty_reducers";
import {
  domainName,

  inputAntdSelectClassNameFilter,
} from "../../constents/global";
import { MdOutlineUpdate } from "react-icons/md";
import { Select, Tooltip, Dropdown } from "antd";
import usePermissions from "../../config/usePermissions";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../global_layouts/ListLoader";

function EmployeePenaltie() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const {
    register,
    setValue,
    control,

    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { penaltyListData, totapenaltyCount, penaltyloading } =
    useSelector((state) => state.employeePenalty);


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

  const currentStatus = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });


  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );




  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialStatus = searchParams.get("status") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus)
  const [searchText, setSearchText] = useState("");


  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [status, currentPage, searchText,]);
  useEffect(() => {
    fetchPenltyList();
  }, [status, currentPage, searchText,]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setStatus("");
    setSearchText("");
  };
  const onChange = (e) => {
    setSearchText(e);
  };

  const onPaginationChange = (page) => setCurrentPage(page);



  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };




  const fetchPenltyList = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
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
        employeId: "",
        penaltyId: "",

        issueDate: "",
      },
    };
    dispatch(getPenaltyList(data));
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
        dispatch(deleteemployeePenaltyType(reqData)).then((data) => {
          if (currentPage > 1 && penaltyListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {

            fetchPenltyList();
          }

        });
      }
    });
  };

  const handleOnChange = async (event) => {
    const searchValue = event.target.value;
    setValue("search", searchValue);
    if (searchValue?.trim()?.length > 0) {
      let reqData = {
        searchValue: searchValue,
        size: 3,
        pageNo: 1,
      };
      dispatch(employeePenaltyTypeSearch(reqData));
    }
  };

  const handleClickStatus = async (element) => {
    // Show SweetAlert with confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to Update status to  Removed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    // If the user confirms, hit the API
    if (result.isConfirmed) {
      await dispatch(
        statusEmployeePenaltyType({
          _id: element?._id,
          status: "Resolved",
        })
      ).then((data) => {
        !data?.error && fetchPenltyList();
      });
    } else {
      Swal.fire("Cancelled", "Your action has been cancelled.", "info");
    }
  };



  return (
    <GlobalLayout onChange={onChange}>
      <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
        <div className="">

          <Select

            className={`${inputAntdSelectClassNameFilter}`}
            placeholder="Select Status"
            value={status}
            onChange={handleStatusChange}
            disabled={penaltyloading}
            showSearch
            filterOption={(input, option) =>
              String(option?.children).toLowerCase().includes(input.toLowerCase())
            }
          >
            <Select.Option value="">Select Status</Select.Option>
            <Select.Option value="Pending"> Imposed </Select.Option>
            <Select.Option value="Resolved"> Removed </Select.Option>
          </Select>

        </div>
        <div className="flex justify-end items-center gap-2">
          <button
            onClick={() => {
              handleResetFilters()
            }}
            className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
            <span className="text-[12px]">Reset</span>
          </button>
          {canCreate && (
            <Tooltip placement="topLeft" title='Add Employee Penalty'>
              <button
                onClick={() => {
                  navigate("/admin/employee-penalty/create");
                }}
                className="bg-[#074173] px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Employee Penalty</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
        {canRead && (
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[10%]">
                  S.No.
                </th>
                <th className="tableHead w-[10%]">
                  Employee Name
                </th>
                <th className="tableHead w-[10%]">
                  Penalty Name
                </th>
                <th className="tableHead w-[10%]">
                  Date
                </th>
                <th className="tableHead w-[10%]">
                  Imposed By
                </th>
                <th className="tableHead w-[10%]">
                  Penalty Amount
                </th>
                <th className="tableHead w-[10%]">
                  Reason
                </th>
                <th className="tableHead w-[10%]">
                  createdAt
                </th>
                <th className="tableHead w-[10%]">
                  Status
                </th>
                {(canDelete || canUpdate) && (
                  <th className="tableHead w-[10%]">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            {penaltyloading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <ListLoader />
                </td>
              </tr>
            ) : <tbody>
              {penaltyListData &&
                penaltyListData?.length > 0 ? (
                penaltyListData?.map((element, index) => (
                  <tr
                    className={`border-b-[1px] border-[#DDDDDD] text-[#374151] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      }`}
                  >
                    <td className="tableData">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="tableData">
                      {element?.employeName || "-"}
                    </td>
                    <td className="tableData">
                      {element?.penaltyName || "-"}
                    </td>

                    <td className="tableData">
                      {element?.issueDate
                        ? dayjs(element.issueDate).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                    <td className="tableData">
                      {element?.createdBy ?? "-"}
                    </td>
                    <td className="tableData">
                      {element?.amount || "-"}
                    </td>
                    <td className="tableData">
                      {element?.reason || "-"}
                    </td>
                    <td className="tableData">
                      {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm a") || "-"}
                    </td>

                    <td className="tableData">
                      <span
                        className={`${element?.status === "Pending"
                            ? "bg-red-200 border-red-500"
                            : "bg-[#E0FFBE] border-green-500"
                          } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                      >
                        {element?.status === "Pending"
                          ? "Imposed"
                          : element?.status === "Resolved"
                            ? "Removed"
                            : element?.status}
                      </span>
                    </td>


                    {(canDelete || canUpdate) && (
                      <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">

                          {canUpdate &&
                            (
                              <Tooltip placement="topLeft" title='Status'>
                                <button
                                  disabled={element?.status === "Resolved"}
                                  onClick={() => handleClickStatus(element)}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <MdOutlineUpdate
                                    className={
                                      element?.status === "Resolved"
                                        ? "opacity-50 cursor-not-allowed"
                                        : " hover:text-[#337ab7] text-[#3c8dbc]"
                                    }
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            )}

                          <Dropdown
                            menu={{
                              items: [
                                canUpdate && {
                                  key: 'edit',
                                  label: (
                                    <span
                                      onClick={() =>
                                        element?.status !== "Resolved" &&
                                        navigate(`/admin/employee-penalty/edit/${encrypt(element?._id)}`)
                                      }
                                      className={`flex items-center ${element?.status === "Resolved"
                                        ? 'text-gray-400 cursor-not-allowed'
                                        : 'text-[#3c8dbc] hover:text-[#337ab7]'
                                        }`}
                                    >
                                      <FaPenToSquare className="mr-2" size={16} />
                                      Edit
                                    </span>
                                  ),
                                  disabled: element?.status === "Resolved",
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
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft" title="More Actions">
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


                        </span>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={10}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>}
          </table>
        )}
      </div>
      {penaltyListData?.length > 0 && (
        <CustomPagination
          totalCount={totapenaltyCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      )}
    </GlobalLayout>
  );
}
export default EmployeePenaltie;
