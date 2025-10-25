import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare, FaPeopleGroup } from "react-icons/fa6";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  customDayjs,
  domainName,
  inputAntdSelectClassNameFilter,

} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import moment from "moment";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import {
  FaEye,
} from "react-icons/fa";
import { getprojetpurchaseExpenceDetails, getprojetpurchaseExpenceList } from "./projectpurchseFeature/_projectpurchseFeature_reducers";
import NewDataModal from "./NewDataModal";
import ListLoader from "../../../global_layouts/ListLoader";


function ProjectPurchaseandexpenceList() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [viewOpen, setViewOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    projectpurchaseExpenceListData,
    projectpurchaseExpenceDetails,
    totalprojectpurchaseExpenceListCount,
    loading,
  } = useSelector((state) => state.projectpurchaseExpence);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);

    if (branchId) params.set("branchId", branchId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [currentPage, limit, branchId, status, searchText]);
  useEffect(() => {
    getprojectpurchaseExpencerequest();
  }, [currentPage, limit, branchId, status, searchText]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setStatus("");
    setSearchText("");
  };

  const onPaginationChange = (page) => setCurrentPage(page);
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const getprojectpurchaseExpencerequest = () => {
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
        text: searchText,
        sort: true,
        status: status,
        isPagination: true,
      },
    };
    dispatch(getprojetpurchaseExpenceList(data));
  };

  const handleView = (element) => {
    dispatch(
      getprojetpurchaseExpenceDetails({
        _id: element?._id,
      })
    );
    setViewOpen(true);
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

  const onChange = (e) => {
    setSearchText(e);
  };



  return (
    <GlobalLayout onChange={onChange}>
      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid grid-cols-1 md:gap-2 gap-1 md:grid-cols-3 items-center">
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
              <div className="">
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  disabled={loading}
                  className={`${inputAntdSelectClassNameFilter} `}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.children)
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Pending">Pending</Select.Option>
                  <Select.Option value="Paid">Paid</Select.Option>
                </Select>
              </div>
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
                <Tooltip placement="topLeft" title="Add Purchase Expense">
                  <button
                    onClick={() => {
                      navigate("/admin/project-purchase-and-expence/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Purchase Expense</span>
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
                  <th className="tableHead w-[10%]">Date Of Entry</th>
                  <th className="tableHead">Bill Date</th>
                  <th className="tableHead">Vendor Name</th>
                  <th className="tableHead">Expense Head</th>
                  <th className="tableHead">Accountant</th>

                  <th className="tableHead">Amount</th>


                  {(canDelete || canUpdate) && (
                    <th className="tableHead w-[10%]">Action</th>
                  )}
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
                  {projectpurchaseExpenceListData &&
                    projectpurchaseExpenceListData?.length > 0 ? (
                    projectpurchaseExpenceListData?.map((element, index) => (
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="tableData">
                          {index + 1 + (currentPage - 1) * limit}
                        </td>
                        <td className="tableData">
                          {element?.createdAt ? customDayjs(element?.createdAt) : "-"}
                        </td>
                        <td className="tableData">
                          {moment(element?.date)?.format("DD-MM-YYYY")}
                        </td>
                        <td className="tableData">
                          <Tooltip placement="topLeft"
                            title={`Vendor Name - ${element?.vendorName}`}
                          >
                            {element?.vendorName
                              ? `    ${element?.vendorName}`
                              : `${element?.vendorOtherName || '-'} `}
                          </Tooltip>
                        </td>
                        <td className="tableData">
                          {element?.expenseHeadName}
                        </td>
                        <td className="tableData">
                          {element?.userName}
                        </td>

                       

                        <td className="tableData">
                          {convertIntoAmount(
                            element?.totalAmount ? element?.totalAmount : "-"
                          )}
                        </td>


                        {(canDelete || canUpdate) && (
                          <td className="tableData">
                            <span className="py-1.5 flex justify-start items-center space-x-2.5">
                              <Tooltip placement="topLeft" title="View Details">
                                <button
                                  onClick={() => {
                                    handleView(element);
                                  }}
                                  className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                                  type="button"
                                >
                                  <FaEye
                                    className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
                                  />
                                </button>
                              </Tooltip>
                            </span>
                          </td>
                        )}
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
        {projectpurchaseExpenceListData?.length > 0 && (
          <CustomPagination
            totalCount={totalprojectpurchaseExpenceListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}

<NewDataModal setViewOpen={setViewOpen} viewOpen={viewOpen} projectpurchaseExpenceDetails={projectpurchaseExpenceDetails} />
      </>
    </GlobalLayout>
  );
}
export default ProjectPurchaseandexpenceList;
