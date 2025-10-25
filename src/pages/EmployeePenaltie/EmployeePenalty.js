import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { Controller, useForm, useWatch } from "react-hook-form";

import {

  getEmployeePenaltyList,

} from "./employeePenaltyFeatures/_employeePenalty_reducers";
import {
  domainName,

  inputAntdSelectClassNameFilter,
} from "../../constents/global";

import { Select } from "antd";
import usePermissions from "../../config/usePermissions";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import getUserIds from "../../constents/getUserIds";
import Loader2 from "../../global_layouts/Loader/Loader2";


function EmployeePenalty() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const { userCompanyId, userBranchId, userType, userEmployeId } = getUserIds();
  const {
    register,
    setValue,
    control,

    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { employeePenaltyListData, totaemployeePenaltyCount, loading } =
    useSelector((state) => state.employeePenalty);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");

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


  const limit = 10;
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (userInfoglobal?.userType === "employee" && userInfoglobal?._id) {
      fetchPenltyList();
    }

  }, [currentStatus, currentPage, BranchId, CompanyId, searchText, status]);

  const fetchPenltyList = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: userCompanyId || '',
        branchId: userBranchId || '',
        text: searchText,
        sort: true,
        status: currentStatus,
        isPagination: true,
        employeId: userEmployeId,
        penaltyId: "",
        issueDate: "",
      },
    };
    dispatch(getEmployeePenaltyList(data));
  };






  const onChange = (e) => {
    ;
    setSearchText(e);
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
    )
  }

  return (
    <GlobalLayout onChange={onChange}>
      <div className="w-full">
        <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="sm:flex justify-between items-center md:gap-2 gap-1">
            <div className="">
              <Controller
                name="status"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={` w-32 ${inputAntdSelectClassNameFilter} ${errors.status ? "border-[1px] " : "border-gray-300"
                      }`}
                    placeholder="Select Status"
                    disabled={loading}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value="Pending"> Imposed </Select.Option>
                    <Select.Option value="Resolved"> Removed </Select.Option>
                  </Select>
                )}
              />
            </div>
            {/* <Select
          className={` ${inputAntdSelectClassNameFilter} `}
          value={status}
          onChange={(e) => {
            setStatus(e);
          }}
          placeholder="Select Status"
          showSearch
        >
          <Select.Option value="">Select Status</Select.Option>
          <Select.Option value={true}>{"Active"}</Select.Option>
          <Select.Option value={false}>{"InActive"}</Select.Option>
        </Select> */}

            {/* <div className="flex justify-end items-center">
          {canCreate && (
            <button
              onClick={() => {
                navigate("/admin/employee-penalty/create");
              }}
              className="bg-[#074173] px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
            >
              <FaPlus />
              <span className="text-[12px]">Add Employee Penalty</span>
            </button>
          )}
        </div> */}
          </div>
          <div className="flex justify-end items-center">
            <button
              onClick={() => {
                setValue("status", "");
                setValue("PDBranchId", "");
                setValue("PdDepartmentId", "");
                setValue("PdCompanyId", "");
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>
          </div>
        </div>
        {/* <div className=''>
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
                <div className='flex justify-between items-center py-1'>
                    <div className='flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md'>
                        <HiOutlineFilter />
                        <span>Name</span>
                        <FaAngleDown />
                    </div>
                    <button onClick={() => { navigate("/admin/create-employee-penaltee") }} className='bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white'>
                        <FaPlus />
                        <span className='text-[12px]'>Add New Penaltie</span>
                    </button>
                </div>
            </div> */}
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    S.No.
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Employee Name
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Penalty Name
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Date
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Imposed By
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Penalty Amount
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Reason
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    created At
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    created By
                  </th>
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Status
                  </th>
                  {/* {(canDelete || canUpdate) && (
                  <th className="border-none p-2 whitespace-nowrap w-[10%]">
                    Action
                  </th>
                )} */}
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
                  {employeePenaltyListData &&
                    employeePenaltyListData?.length > 0 ? (
                    employeePenaltyListData?.map((element, index) => (
                      <tr
                        className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          }`}
                      >
                        <td className="whitespace-nowrap border-none p-2 ">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.employeName || "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.penaltyName || "-"}
                        </td>

                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.issueDate
                            ? dayjs(element.issueDate).format("YYYY-MM-DD")
                            : "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.createdBy ?? "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.amount || "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.reason || "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {dayjs(element?.createdAt).format('DD-MM-YYYY') || "-"}
                        </td>
                        <td className="whitespace-nowrap border-none p-2 ">
                          {element?.createdBy || "-"}
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

                        {/* {(canDelete || canUpdate) && (
                      <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          {canUpdate && (
                            <button
                              disabled={element?.status === "Resolved"}
                              onClick={() => {
                                navigate(
                                  `/admin/employee-penalty/edit/${encrypt(
                                    element?._id
                                  )}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className={
                                  element?.status === "Resolved"
                                    ? "opacity-50 cursor-not-allowed"
                                    : " hover:text-[#337ab7] text-[#3c8dbc]"
                                }
                                size={16}
                              />
                            </button>
                          )}
                          {canUpdate &
                          (
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
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(element?._id)}
                              className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <RiDeleteBin5Line
                                className="text-red-600 hover:text-red-500"
                                size={16}
                              />
                            </button>
                          )}
                        </span>
                      </td>
                    )} */}
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5 ">
                      <td
                        colSpan={3}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>}
            </table>
          )}
        </div>
        {employeePenaltyListData?.length > 0 && (
          <CustomPagination
            totalCount={totaemployeePenaltyCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>
    </GlobalLayout>
  );
}
export default EmployeePenalty;
