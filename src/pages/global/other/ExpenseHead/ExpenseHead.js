import { useNavigate } from "react-router-dom";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaAngleDown, FaPenToSquare, FaPlus } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { HiOutlineFilter } from "react-icons/hi";
import {
  deleteExpenseTypeFunc,
  getExpenseTypeListFunc,
} from "./expenseTypeFeature/_expenseType_reducers";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, sortByPropertyAlphabetically } from "../../../../constents/global";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import ListLoader from "../../../../global_layouts/ListLoader";

function ExpenseHead() {
  const { register, setValue, control, formState: { errors }, } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { expenseTypeList, totalExpenseTypeCount, loading } = useSelector((state) => state.expenceHead);
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
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      fetchExpenceHead();
    } else {
      setCurrentPage(1);
    }
  }, [filters])


  useEffect(() => {
    fetchExpenceHead();
  }, [currentPage]);

  const fetchExpenceHead = () => {
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
        status: status === "true" ? true : status === "false" ? false : "",
        isPagination: true,
      },
    };
    dispatch(getExpenseTypeListFunc(reqData));
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
        dispatch(deleteExpenseTypeFunc(reqData)).then((data) => {
          // fetchExpenceHead();

          if (currentPage > 1 && expenseTypeList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchExpenceHead();
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
                  <Select.Option value="true"> Active </Select.Option>
                  <Select.Option value="false"> InActive </Select.Option>
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
              <Tooltip placement="topLeft"  title=''>
                <button
                  onClick={() => {
                    navigate("/admin/expence-head/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex whitespace-nowrap justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add New Expense Head</span>
                </button>
              </Tooltip>}
          </div>
        </div>
      </div>
      <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
        {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
              <th className="border-none p-2 whitespace-nowrap w-[10%]">
                S.No.
              </th>
              <th className="border-none p-2 whitespace-nowrap">Name</th>
              <th className="border-none p-2 whitespace-nowrap">Created At</th>
              <th className="border-none p-2 whitespace-nowrap">Created By</th>
              <th className="border-none p-2 whitespace-nowrap">Status</th>
              {(canUpdate || canDelete) && <th className="border-none p-2 whitespace-nowrap w-[10%]">
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
              {expenseTypeList && expenseTypeList?.length > 0 ? (
                expenseTypeList?.map((element, index) => (
                  <tr
                    className={`${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } border-b-[1px] border-[#DDDDDD] text-[#374151] text-[14px]`}
                  >
                    <td className="whitespace-nowrap border-none p-2 ">
                      {index + 1 + (currentPage - 1) * limit}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.name ?? "-"}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      {element?.createdBy ?? "-"}
                    </td>
                    <td className="whitespace-nowrap border-none p-2 ">
                      <span
                        className={`${element?.status
                          ? "bg-[#E0FFBE] border-green-500"
                          : "bg-red-200 border-red-500"
                          } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                      >
                        {element?.status ? "Active" : "Inactive" ?? "-"}
                      </span>
                    </td>
                    {(canUpdate || canDelete) && <td className="whitespace-nowrap border-none p-2">
                      <span className="py-1.5 flex justify-start items-center space-x-2">
                        {canUpdate && <button
                          onClick={() => {
                            navigate(
                              `/admin/expence-head/edit/${encrypt(element?._id)}`
                            );
                          }}
                          className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <FaPenToSquare
                            className=" hover:text-[#337ab7] text-[#3c8dbc]"
                            size={16}
                          />
                        </button>}
                        {canDelete && <button
                          onClick={() => handleDelete(element?._id)}
                          className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                          type="button"
                        >
                          <RiDeleteBin5Line
                            className="text-red-600 hover:text-red-500"
                            size={16}
                          />
                        </button>}
                      </span>
                    </td>}
                  </tr>
                ))
              ) : (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={6}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                  >
                    Record Not Found
                  </td>
                </tr>
              )}
            </tbody>}
        </table>}
      </div>
      {expenseTypeList?.length > 0 &&
        <CustomPagination
          totalCount={totalExpenseTypeCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />}
    </GlobalLayout>
  );
}
export default ExpenseHead;
