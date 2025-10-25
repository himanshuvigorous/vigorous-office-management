import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPenToSquare, FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import { FaAngleDown, FaEye } from "react-icons/fa";
import { HiOutlineFilter } from "react-icons/hi";
import { RiDeleteBin5Line } from "react-icons/ri";
import {
  companyPageDelete,
  getCompanyPageList,
} from "./CompanyPageFeatures/_companyPage_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import { Controller, useForm, useWatch } from "react-hook-form";
import dayjs from "dayjs";
import { domainName, inputAntdSelectClassNameFilter } from "../../../../constents/global";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";

function CompanyPage() {

  const { register, setValue, control, formState: { errors } } = useForm();
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector((state) => state.branch);
  const { pageListData, totalpageListCount, loading } = useSelector((state) => state.page);
  const [searchText, setSearchText] = useState("");
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
    name: "status",
    defaultValue: "",
  });

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const limit = 10;

  const filters = [CompanyId, BranchId, status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      getPageList();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    getPageList();
  }, [currentPage])

  const getPageList = () => {
    const reqData = {
      pageSize: 20,
      currentPage: 1,
      data: {
        text: searchText,
        "status": status === 'true' ? true : status === 'false' ? false : '',
      }
    };
    dispatch(getCompanyPageList(reqData));
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
        dispatch(companyPageDelete(reqData)).then((data) => {
          getPageList();
        });
      }
    });
  };



  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();

  const onChange = (e) => {
    
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>

      <section>
        <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="grid lg:grid-cols-3 sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1">
            <Controller
              control={control}
              name="status"
              rules={{ required: "Status is required" }}
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
                  <Select.Option value="">Select status</Select.Option>
                  <Select.Option value="true">Active</Select.Option>
                  <Select.Option value="false">Inactive</Select.Option>
                </Select>
              )}
            />
          </div>

          <div className="flex justify-end items-center gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", '')
                setValue("PDCompanyId", "")
                setValue("status", "")
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>

            {canCreate &&
              <Tooltip placement="topLeft"  title='Add Page'>
                <button
                  onClick={() => {
                    navigate("/admin/company-page/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px] whitespace-nowrap">Add Page</span>
                </button>
              </Tooltip>}
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap ">slug</th>
                <th className="border-none p-2 whitespace-nowrap ">createdAt</th>
                <th className="border-none p-2 whitespace-nowrap ">createdBy</th>
                <th className="border-none p-2 whitespace-nowrap">title</th>

                <th className="border-none p-2 whitespace-nowrap">Status</th>
                {(canUpdate || canDelete || canRead) && <th className="border-none p-2 whitespace-nowrap w-[10%]">
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
                {pageListData &&
                  pageListData?.docs &&
                  pageListData?.docs?.length > 0 ? (
                  pageListData?.docs?.map((element, index) => (
                    <tr
                      key={element?._id} // Ensure unique key for each row
                      className={`border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        }`}
                    >
                      <td className="whitespace-nowrap border-none p-2">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border-none p-2">
                        {`${element?.slug}` ?? "-"}
                      </td>

                      <td className="whitespace-nowrap border-none p-2">{`${dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a')}`}</td>
                      <td className="whitespace-nowrap border-none p-2">{`${element?.createdBy}`}</td>
                      <td className="whitespace-nowrap border-none p-2">{`${element?.title}`}</td>
                      <td className="whitespace-nowrap border-none p-2">
                        <span
                          className={`${element?.status
                            ? "bg-[#E0FFBE] border-green-500"
                            : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status ? "Active" : "Inactive" ?? "-"}
                        </span>
                      </td>
                      {(canUpdate || canDelete || canRead) && <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          {canRead && <Tooltip placement="topLeft"  title='View Details'>
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/view-page/${encrypt(
                                    element?._id
                                  )}`
                                )
                              }
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaEye
                                className="hover:text-[#28a745] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/company-page/edit/${encrypt(element?._id)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaPenToSquare
                                className="hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          {canDelete && <Tooltip placement="topLeft"  title='Delete'>
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
                          </Tooltip>}

                        </span>
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={7}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}
        </div>
        {
          pageListData?.docs?.length > 0 &&
          <CustomPagination
            totalCount={totalpageListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        }
      </section>

    </GlobalLayout>
  );
}
export default CompanyPage;
