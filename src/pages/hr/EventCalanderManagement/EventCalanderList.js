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
  domainName,
  handleSortLogic,
  inputAntdSelectClassNameFilter,
  showSwal,
} from "../../../constents/global";

import "react-datepicker/dist/react-datepicker.css";

import {
  deleteEventCalander,
  getEventCalanderList,
} from "./EventCalanderFeatures/_event_calander_reducers";
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

function EventCalanderList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { eventCalanderData, totaleventCalanderCount, loading } = useSelector(
    (state) => state.eventCalander
  );
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });
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

  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const limit = 10;
  const [searchText, setSearchText] = useState("");

  const filters = [BranchId, searchText, status].join("-");

  const [isFirstRender, setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state => true);
      return;
    }
    if (currentPage === 1) {
      getEventCalanderRequest();
    } else {
      setCurrentPage(1);
    }
  }, [filters]);

  useEffect(() => {
    getEventCalanderRequest();
  }, [currentPage]);

  const getEventCalanderRequest = () => {
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
        status: status === "true" ? true : status === "false" ? false : "",
        sort: true,
        isPagination: true,
      },
    };
    dispatch(getEventCalanderList(data));
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
        dispatch(deleteEventCalander(reqData)).then((data) => {
          // getEventCalanderRequest();
          if (currentPage > 1 && eventCalanderData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            getEventCalanderRequest();
          }
        });
      }
    });
  };

  const [sortedList, setSortedList] = useState([]);
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
  useEffect(() => {
    if (eventCalanderData) {
      handleSort();
    }
  }, [eventCalanderData]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, eventCalanderData);
    setSortedList(sortedList);
  };

  const onChange = (e) => {
    ;
    setSearchText(e);
  };
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>

      <>
        <div className="">
          <div className="md:flex grid grid-cols-1 justify-between items-center md:space-y-0 space-y-2 py-1">
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
                        defaultValue={""}
                        disabled={loading}
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

              <Controller
                name="status"
                control={control}
                rules={{}}
                render={({ field }) => (
                  <Select
                    {...field}
                    className={`w-32  ${inputAntdSelectClassNameFilter}`}
                    disabled={loading}
                    placeholder="Select Status"
                    defaultValue={''}
                    showSearch
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value={'true'}> Active </Select.Option>
                    <Select.Option value={'false'}> InActive </Select.Option>
                  </Select>
                )}
              />

              <button
                onClick={() => {
                  setValue("PDBranchId", "");
                  setValue("PdCompanyId", "");
                  setValue("status", "");
                }}
                className="bg-header  py-1 my-0.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
            </div>
            {canCreate && (
              <Tooltip placement="topLeft"  title="Add Events">
                <button
                  onClick={() => {
                    navigate("/admin/event-calander/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Event Calander</span>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Name
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp onClick={() => handleSort("title", "asc")} />
                      <FaAngleDown
                        onClick={() => handleSort("title", "desc")}
                      />
                    </div>
                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex gap-1">
                    Start Date
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("startDate", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("startDate", "desc")}
                      />
                    </div>
                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    End Date

                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex gap-1">
                    Created At

                  </div>
                </th>
                <th className="tableHead">
                  <div className="flex gap-1">
                    Created By
                    <div className="flex flex-col -space-y-1.5 cursor-pointer">
                      <FaAngleUp
                        onClick={() => handleSort("createdBy", "asc")}
                      />
                      <FaAngleDown
                        onClick={() => handleSort("createdBy", "desc")}
                      />
                    </div>
                  </div>
                </th>


                <th className="tableHead">status</th>
                {(canDelete || canUpdate) && (
                  <th className="tableHead w-[10%]">Action</th>
                )}
              </tr>
            </thead>
            {loading ?
              <tr className="bg-white bg-opacity-5 ">
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
                      key={element?._id}
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">  {index + 1 + (currentPage - 1) * limit}</td>
                      <td className="tableData">
                        {element?.title}
                      </td>

                      <td className="tableData">
                        {dayjs(element?.startDate).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td className="tableData">
                        {dayjs(element?.endDate).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td className="tableData">
                        {dayjs(element?.createdAt).format("DD-MM-YYYY hh:mm A")}
                      </td>
                      <td className="tableData">
                        {element?.createdBy}
                      </td>
                      <td className="tableData">
                        <Tooltip placement="topLeft" 
                          title={`Status - ${element?.status ? "Active" : "InActive"
                            }`}
                        >
                          <span
                            className={`${element?.status
                              ? "bg-[#E0FFBE] border-green-500"
                              : "bg-red-200 border-red-500"
                              } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                          >
                            {element?.status ? "Active" : "Inactive" ?? "-"}
                          </span>
                        </Tooltip>
                      </td>

                      {(canDelete || canUpdate) && (
                        <td className="tableData">
                          <Dropdown
                            menu={{
                              items: [
                                ...(canUpdate
                                  ? [{
                                    key: 'edit-event',
                                    label: (
                                      <span
                                        className="flex justify-start items-center"
                                        onClick={() => navigate(`/admin/event-calander/edit/${encrypt(element?._id)}`)}>
                                        <FaPenToSquare className="mr-2 text-[#3c8dbc] hover:text-[#337ab7]" size={16} />
                                        Edit
                                      </span>
                                    ),
                                  }]
                                  : []),
                                ...(canDelete
                                  ? [{
                                    key: 'delete-event',
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



                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={10}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500">
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        {eventCalanderData?.length > 0 && (
          <CustomPagination
            totalCount={totaleventCalanderCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>

    </GlobalLayout>
  );
}
export default EventCalanderList;
