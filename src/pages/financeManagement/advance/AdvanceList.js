import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { convertIntoAmount, domainName, inputAntdSelectClassNameFilter, showSwal, } from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import AdvanceModalList from "./AdvanceModalList";
import moment from "moment";
import usePermissions from "../../../config/usePermissions";
import { Dropdown, Select, Tooltip } from "antd";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import ListLoader from "../../../global_layouts/ListLoader";
import { getadvanceList } from "./advanceFeature/_advance_reducers";
import { PiDotsThreeOutlineVerticalBold } from 'react-icons/pi';
import { GrValidate } from "react-icons/gr";
import { TbPencilMinus } from "react-icons/tb";
import dayjs from "dayjs";
import { decrypt, encrypt } from "../../../config/Encryption";


function AdvanceList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { advanceListData, totaladvanceListCount, loading } = useSelector(
    (state) => state.advance
  );
  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    data: null,
    type: null,
   
  });
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
      getadvancerequest();
    }, [currentPage, limit, branchId, searchText]);

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

  const getadvancerequest = () => {
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
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? branchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": searchText,
        "type": "",
        "sort": true,
        "status": "",
        "isPagination": true,
      }
    };
    dispatch(getadvanceList(data))

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
          companyId: userInfoglobal?.userType === "company" ? userInfoglobal?._id : userInfoglobal?.companyId,
        })
      );
    }
  }, [])

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
      type: type,
    });

  }
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();


  return (
    <GlobalLayout onChange={onChange}>

      <>
        <div className="">
          <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
             
              {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
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
                </div>}
            </div>
            <div className="flex justify-end items-center gap-2 ">
              <button
                onClick={() => {
                 handleResetFilters()
                }}
                className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
              >
                <span className="text-[12px]">Reset</span>
              </button>
              {canCreate &&
                <Tooltip placement="topLeft"  title='Add Advance'>
                  <button
                    onClick={() => {
                      navigate("/admin/advance/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Advance</span>
                  </button>
                </Tooltip>}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[#ffff] font-[500] h-[40px]">
                <th className="tableHead w-[10%]">S.No.</th>
                <th className="tableHead">Group Name</th>
                <th className="tableHead">Group User Name</th>
                <th className="tableHead">Amount</th>
                <th className="tableHead">Date</th>
                {/* <th className="tableHead">Created At</th> */}
                <th className="tableHead">Transactions</th>
                <th className="tableHead">Action</th>
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
                {advanceListData && advanceListData?.length > 0 ? (
                  advanceListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="tableData">{element?.groupName || '-'}</td>
                      <td className="tableData">{element?.groupUserName || '-'}</td>
                      <td className="tableData">{convertIntoAmount(element?.availableBalance || '-')}</td>
                      <td className="tableData">{moment(element?.date).format("DD-MM-YYYY hh:mm a") || '-'}</td>
                      {/* <td className="tableData">{moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") || '-'}</td> */}
                      {canRead &&
                        <td className="tableData">
                          <span className="py-1.5 flex justify-start items-center space-x-2.5">
                            {canRead && <button

                              onClick={() => openModal(element, "up")}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <span className=" hover:text-cyan-600 text-header">

                                View List
                              </span>
                            </button>
                            }
                          </span>
                        </td>}
                      <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          <Tooltip placement="topLeft"  title='More Actions'>
                            <Dropdown
                              menu={{
                                items: [
                                  {
                                    key: 'created-at',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') || "Data not available")
                                        }
                                        className="flex items-center text-teal-800 hover:text-teal-700"
                                      >
                                        <GrValidate className="mr-2" size={16} />
                                        Created At
                                      </span>
                                    ),
                                  },
                                  {
                                    key: 'created-by',
                                    label: (
                                      <span
                                        onClick={() =>
                                          showSwal(element?.createdBy || "Data not available")
                                        }
                                        className="flex items-center text-sky-800 hover:text-sky-700"
                                      >
                                        <TbPencilMinus className="mr-2" size={16} />
                                        Created By
                                      </span>
                                    ),
                                  },
                                ],
                              }}
                              trigger={['click']}
                            >
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={16}
                                />
                              </button>
                            </Dropdown>
                          </Tooltip>
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
              </tbody>}
          </table>}
        </div>
        {isModalOpen?.isOpen && (
          <AdvanceModalList isModalOpen={isModalOpen} getadvancerequest={getadvancerequest} advanceListData={advanceListData} onClose={() => setIsModalOpen({
            isOpen: false,
            _id: null,
            type: null,


          })} />

        )}
        {advanceListData?.length > 0 &&
          <CustomPagination
            totalCount={totaladvanceListCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />}
      </>

    </GlobalLayout>
  );
}
export default AdvanceList;
