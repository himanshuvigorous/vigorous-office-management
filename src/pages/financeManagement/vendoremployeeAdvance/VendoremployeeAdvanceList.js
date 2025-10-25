import  { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  domainName,
  inputAntdSelectClassNameFilter,
} from "../../../constents/global";
import {  useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { getvendoremployeeAdvanceList } from "./vendoremployeeAdvanceFeature/_vendoremployeeAdvance_reducers";
import VendoremployeeAdvanceModalList from "./VendoremployeeAdvanceModalList";
import {  Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import ListLoader from "../../../global_layouts/ListLoader";

function VendoremployeeAdvanceList() {
  const { canCreate, canRead,  } = usePermissions();
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    vendoremployeeAdvanceListData,
    totalvendoremployeeAdvanceListCount,
    loading,
  } = useSelector((state) => state.vendoremployeeAdvance);
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    data: null,
  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const typeSelection = useWatch({
    control,
    name: "typeSelection",
    defaultValue: "Vendor",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    setSearchParams(params);
  }, [currentPage, limit, branchId, searchText]);

  useEffect(() => {
    getvendoremployeeAdvancerequest();
  }, [currentPage, limit, branchId, typeSelection, searchText]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setSearchText("");
  };
  const onChange = (e) => {
    setSearchText(e);
  };

  const onPaginationChange = (page) => setCurrentPage(page);
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };

  const getvendoremployeeAdvancerequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
            ? branchId
            : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,

        employeId: "",
        clientGroupId: "",
        startDate: "",
        endDate: "",
        type: "",
        text: searchText,
        sort: true,
        status: "",
        isPagination: true,
        advanceType: typeSelection,
      },
    };
    dispatch(getvendoremployeeAdvanceList(data));
  };

  useEffect(() => {
    if (
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
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        })
      );
    }
  }, []);
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

  const openModal = (item, type) => {
    setIsModalOpen({
      isOpen: true,
      data: item,
    });
  };

  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
              {(userInfoglobal?.userType === "admin" ||
                userInfoglobal?.userType === "company" ||
                userInfoglobal?.userType === "companyDirector") && (
                <div className="">
                  <Select
                    value={branchId}
                    onChange={handleBranchChange}
                    defaultValue=""
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Branch</Select.Option>
                    {branchListloading ? (
                      <Select.Option disabled>
                        <ListLoader />
                      </Select.Option>
                    ) : (
                      branchList?.map((type) => (
                        <Select.Option key={type?._id} value={type?._id}>
                          {type?.fullName}
                        </Select.Option>
                      ))
                    )}
                  </Select>
                </div>
              )}
            </div>

            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                  handleResetFilters();
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>

              {canCreate && (
                <Tooltip placement="topLeft"  title="Vendor Employee Advance">
                  <button
                    onClick={() => {
                      navigate("/admin/vendoremployeeAdvance/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">
                      Add Vendor  Advance
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && (
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                  <th className="tableHead w-[10%]">S.No.</th>
                  <th className="tableHead">
                  Vendor Name
                  </th>
                  <th className="tableHead">Total Deposit Amount</th>
                  <th className="tableHead">Available Balance</th>

                  {canRead && <th className="tableHead">Transactions</th>}
                </tr>
              </thead>
              {loading ? (
                <tr className="bg-white bg-opacity-5 ">
                  <td
                    colSpan={10}
                    className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                  >
                    <Loader2 />
                  </td>
                </tr>
              ) : (
                <tbody>
                  {vendoremployeeAdvanceListData &&
                  vendoremployeeAdvanceListData?.length > 0 ? (
                    vendoremployeeAdvanceListData.map((element, index) => (
                      <tr
                        className={`text-black ${
                          index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">{element?.fullName}</td>
                       
                        <td className="tableData">
                          {convertIntoAmount(
                            element?.totalDepositAmount ?? "-"
                          )}
                        </td>
                         <td className="tableData">
                          {convertIntoAmount(element?.availableBalance ?? "-")}
                        </td>

                        <td className="tableData">
                          <span className="py-1.5 flex justify-start items-center space-x-2.5">
                            {canRead && (
                              <button
                                onClick={() => openModal(element)}
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <span className=" hover:text-cyan-500 text-cyan-700">
                                  View List
                                </span>
                              </button>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={5}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
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
        {isModalOpen?.isOpen && (
          <VendoremployeeAdvanceModalList
            isModalOpen={isModalOpen}
            getvendoremployeeAdvancerequest={getvendoremployeeAdvancerequest}
            vendoremployeeAdvanceListData={vendoremployeeAdvanceListData}
            onClose={() =>
              setIsModalOpen({
                isOpen: false,
                _id: null,
                type: null,

                // listData  : null
              })
            }
          />
        )}
        {vendoremployeeAdvanceListData?.length > 0 && (
          <CustomPagination
            totalCount={totalvendoremployeeAdvanceListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}
export default VendoremployeeAdvanceList;
