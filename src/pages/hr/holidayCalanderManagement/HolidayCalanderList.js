import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleUp, FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { FaPlus, FaAngleDown } from "react-icons/fa6";

import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";

import { encrypt } from "../../../config/Encryption";
import {
  deleteHolidayCalander,
  getHolidayCalanderList,
} from "./holidayCalanderFeatures/_holiday_calander_reducers";
import {
  domainName,
  handleSortLogic,
  inputAntdSelectClassNameFilter,

  showSwal,
} from "../../../constents/global";

import moment from "moment";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";

import { Select, Tooltip, Dropdown } from "antd";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";
import usePermissions from "../../../config/usePermissions";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import { CgComment } from "react-icons/cg";
import ListLoader from "../../../global_layouts/ListLoader";

function HolidayCalanderList() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedYear, setSelectedYear] = useState(dayjs());
  const { holidayCalanderData, totalholidayCalanderCount, loading } =
    useSelector((state) => state.holidayCalander);

  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm()

  const [sortedList, setSortedList] = useState([]);
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  useEffect(() => {
    if (holidayCalanderData) {
      handleSort();
    }
  }, [holidayCalanderData]);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, holidayCalanderData);
    setSortedList(sortedList);
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
  })
  const [searchText, setSearchText] = useState("");

  const filters = [selectedYear, BranchId, searchText, status].join("-");

  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      getHolidayCalanderRequest(selectedYear);
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    getHolidayCalanderRequest(selectedYear);
  }, [currentPage]);
  const getHolidayCalanderRequest = (selectedSearch) => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
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
        text: searchText,
        status: status === 'true' ? true : status === 'false' ? false : '',
        sort: true,
        isPagination: true,
        year: dayjs(selectedYear)?.format("YYYY"),
      },
    };
    dispatch(getHolidayCalanderList(data));
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
        dispatch(deleteHolidayCalander(reqData)).then((data) => {

          if (currentPage > 1 && holidayCalanderData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            getHolidayCalanderRequest();
          }
        });
      }
    });
  };

  const onChange = (e) => {

    setSearchText(e);
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
          companyId:
            userInfoglobal?.userType === "admin"
              ? CompanyId
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, [CompanyId]);
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

  return (
    <GlobalLayout onChange={onChange}>

      <>
        <div className="">
          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="">
              <div className="md:flex justify-between grid-cols-1 grid items-center md:space-y-0 space-y-2 py-1">
                <div className="grid md:grid-cols-3 grid-cols-1 gap-3">
                  {userInfoglobal?.userType === "admin" && (
                    <div className="">
                      <Controller
                        control={control}
                        name="PDCompanyId"
                        rules={{ required: "Company is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            disabled={loading}
                            defaultValue={""}
                            className={`${inputAntdSelectClassNameFilter} `}
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
                    </div>
                  )}
                  {(userInfoglobal?.userType === "admin" ||
                    userInfoglobal?.userType === "company" ||
                    userInfoglobal?.userType === "companyDirector") && (
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
                              showSearch
                              filterOption={(input, option) =>
                                String(option?.children).toLowerCase().includes(input.toLowerCase())
                              }
                              className={`${inputAntdSelectClassNameFilter} `}
                            >
                              <Select.Option value="">Select Branch</Select.Option>
                              {branchListloading ? (<Select.Option disabled>
                                <ListLoader />
                              </Select.Option>) : (branchList?.map((type) => (
                                <Select.Option key={type?._id} value={type?._id}>
                                  {type?.fullName}
                                </Select.Option>
                              )))}
                            </Select>
                          )}
                        />
                        {errors.PDBranchId && (
                          <p className="text-red-500 text-sm">
                            {errors.PDBranchId.message}
                          </p>
                        )}
                      </div>
                    )}
                  <div className="">
                    <Controller
                      name="status"
                      control={control}
                      rules={{}}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`w-32  ${inputAntdSelectClassNameFilter}`}
                          placeholder="Select Status"
                          defaultValue={''}
                          disabled={loading}
                          showSearch
                        >
                          <Select.Option value="">Select Status</Select.Option>
                          <Select.Option value={'true'}> Active </Select.Option>
                          <Select.Option value={'false'}> InActive </Select.Option>
                        </Select>
                      )}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setValue("PDBranchId", "");
                      setValue("PdCompanyId", "");
                      setValue("status", "");
                    }}
                    className="bg-header py-1 rounded-md md:flex hidden px-10 justify-center items-center  text-white"
                  >
                    <span className="text-[12px]">Reset</span>
                  </button>
                </div>
              </div>
            </div>
            {(canRead && canCreate) && <div className="flex justify-end items-center sm:!mt-3 gap-2">
              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("status", "");
                }}
                className="bg-header py-1.5 rounded-md md:hidden flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              <Tooltip placement="topLeft"  title="Create Holiday Calander">
                <button
                  onClick={() => {
                    navigate("/admin/holiday-calander/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Holiday Calander</span>
                </button>
              </Tooltip>
            </div>}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Name
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("name", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("name", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Date
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("date", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("date", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Created At
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("createdAt", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("createdAt", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Created By
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("createdBy", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("createdBy", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">status</th>
                {(canUpdate || canDelete) && <th className="tableHead w-[10%]">Action</th>}
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
                {sortedList && sortedList?.length > 0 ? (
                  sortedList?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">  {index + 1 + (currentPage - 1) * limit}</td>
                      <td className="tableData">{element?.name}</td>

                      <td className="tableData">
                        {moment(element?.date).format("DD-MM-YYYY")}
                      </td>
                      <td className="tableData">
                        {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a")}
                      </td>
                      <td className="tableData">
                        {element?.createdBy || "N/A"}
                      </td>
                      <td className="tableData">
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td>

                      {(canUpdate || canDelete) &&
                        <td className="tableData">
                          <Dropdown
                            menu={{
                              items: [
                                ...(canUpdate
                                  ? [{
                                    key: 'edit-holiday',
                                    label: (
                                      <span
                                        className="flex justify-start items-center"
                                        onClick={() => navigate(`/admin/holiday-calander/edit/${encrypt(element?._id)}`)}>
                                        <FaPenToSquare className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  }]
                                  : []),
                                ...(canDelete
                                  ? [{
                                    key: 'delete-holiday',
                                    label: (
                                      <span
                                        className="flex justify-start items-center text-red-500"
                                        onClick={() => handleDelete(element?._id)}>
                                        <RiDeleteBin5Line className="mr-2 text-red-600 hover:text-red-500" size={16} />
                                        Delete
                                      </span>
                                    ),
                                  }]
                                  : []),
                                {
                                  key: 'view-comment',
                                  label: (
                                    <span
                                      className="flex justify-start items-center"
                                      onClick={() => showSwal(element?.description || "Data not available")}>
                                      <CgComment className="mr-2 text-blue-800" size={18} />
                                      View Description
                                    </span>
                                  ),
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft"  title='More Actions'>
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

                        </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={8}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}
        </div>
        {holidayCalanderData?.length > 0 && (
          <CustomPagination
            totalCount={totalholidayCalanderCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>

    </GlobalLayout>
  );
}
export default HolidayCalanderList;
