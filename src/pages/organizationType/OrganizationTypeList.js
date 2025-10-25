import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../config/Encryption";
import { FaPlus, FaPenToSquare, FaPencil, FaAngleDown } from "react-icons/fa6";
import {
  deleteOrgType,
  getOrgTypeList,
  orgTypeSearch,
} from "./organizationTypeFeatures/_org_type_reducers";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { HiOutlineFilter } from "react-icons/hi";
import { LoginDetails } from "../../component/LoginDetails/LoginDetails";
import CustomPagination from "../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import { domainName, inputAntdSelectClassNameFilter } from "../../constents/global";
import usePermissions from "../../config/usePermissions";
import Loader2 from "../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";

function OrganizationTypeList() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgTypeList, totalOrgTypeCount, loading } = useSelector(
    (state) => state.orgType
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");
const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  

  const filters = [status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      fetchOrgTypeList();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    fetchOrgTypeList();
  }, [currentPage]);

  const fetchOrgTypeList = () => {
    const reqData = {
      page: currentPage,
      companyId:
          userInfoglobal?.userType === "admin"
            ? ''
            : userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
      limit: limit,
      text: searchText,
      sort: false,
      status: status,
      isPagination: true,
    };
    dispatch(getOrgTypeList(reqData));
  };

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    };
    const listData = {
      limit: 20,
      page: 1,
      text: "",
      sort: false,
      status: "",
    };
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteOrgType(reqData)).then((data) => {

          // if (!data.error) dispatch(getOrgTypeList(listData));
           if (currentPage > 1 && orgTypeList?.length==1) {
            setCurrentPage(Number(currentPage-1));  
             
          }else {
        if (!data.error) dispatch(getOrgTypeList(listData));  
          } 
        });
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
 
      dispatch(orgTypeSearch(reqData));
    }
  };

  const onChange = (e) => {

    setSearchText(e);
    if(currentPage!=1){
      setCurrentPage(1)
    }
  };

  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  return (
    <GlobalLayout onChange={onChange}>
      <div className="">
        <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
            <Select
              className={` ${inputAntdSelectClassNameFilter} `}
              value={status}
              onChange={(e) => {
                setStatus(e);
              }}
              placeholder="Select Status"
              showSearch
              filterOption={(input, option) =>
                String(option?.children)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              <Select.Option value="">Select Status</Select.Option>
              <Select.Option value={true}>{"Active"}</Select.Option>
              <Select.Option value={false}>{"InActive"}</Select.Option>
            </Select>
          </div>

          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setStatus("");
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white"
            >
              <span className="text-[12px]">Reset</span>
            </button>

            
            {canCreate && (
              <button
                onClick={() => {
                  navigate("/admin/organization-type/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Organization type</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
        {canRead && (
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#fff]  ">
                <th className="p-2 whitespace-nowrap  w-[10%]">
                  S.No.
                </th>
                <th className="p-2 whitespace-nowrap  w-[10%]">
                  Name
                </th>
                <th className="p-2 whitespace-nowrap  w-[10%]">
                  createdAt
                </th>
                <th className="p-2 whitespace-nowrap  w-[10%]">
                  createdBy
                </th>
                <th className="p-2 whitespace-nowrap  w-[10%]">
                  Status
                </th>
                {(canUpdate || canDelete) && (
                  <th className="p-2 whitespace-nowrap  w-[10%]">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap  font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
            ) : (
              <tbody>
                {orgTypeList && orgTypeList?.length > 0 ? (
                  orgTypeList?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] border-[#DDDDDD] text-black text-[14px] ${
                        index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      }`}
                    >
                      <td className="whitespace-nowrap  border-none p-2 ">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2 ">
                        {element?.name ?? "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2 ">
                        {dayjs(element?.createdAt).format(
                          "DD-MM-YYYY hh:mm a"
                        ) ?? "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2 ">
                        {element?.createdBy ?? "-"}
                      </td>
                      <td className="whitespace-nowrap  border-none p-2 ">
                        <span
                          className={`${
                            element?.status
                              ? "bg-[#E0FFBE] border-green-500"
                              : "bg-red-200 border-red-500"
                          } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td>
                      {(canUpdate || canDelete) && (
                        <td className="whitespace-nowrap  p-2">
                          <span className="py-1.5 flex justify-start items-center space-x-2.5">
                            {canUpdate && (
                              <Tooltip placement="topLeft"  title="Edit">
                                <button
                                  onClick={() => {
                                    navigate(
                                      `/admin/organization-type/edit/${encrypt(
                                        element?._id
                                      )}`
                                    );
                                  }}
                                  className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                  type="button"
                                >
                                  <FaPenToSquare
                                    className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            )}
                            {canDelete && (
                              <Tooltip placement="topLeft"  title="Delete">
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
                              </Tooltip>
                            )}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={6}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        )}
      </div>
      {totalOrgTypeCount > limit && (
        <CustomPagination
          totalCount={totalOrgTypeCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      )}
    </GlobalLayout>
  );
}
export default OrganizationTypeList;
