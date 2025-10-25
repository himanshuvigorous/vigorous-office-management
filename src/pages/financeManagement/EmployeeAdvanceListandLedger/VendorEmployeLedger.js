import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { decrypt, encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {
  convertIntoAmount,
  customDayjs,
  domainName,
  inputAntdSelectClassNameFilter,
} from "../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { Modal, Radio, Select, Tooltip } from "antd";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import ListLoader from "../../../global_layouts/ListLoader";
import { getemployeLedgerList } from "./employeLedgerFeature/_employeLedger_reducers";
import moment from "moment";
import { FaImages } from "react-icons/fa";
import dayjs from "dayjs";
import CustomDatePickerFilter from "../../../global_layouts/DatePicker/CustomDatePickerFilter";

function EmployeLedgerList({ searchText, setSearchText }) {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    employeLedgerListData,
    totalEmployeLedgerListCount,
    loading,
  } = useSelector((state) => state.EmployeLedger);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { branchList, branchListloading } = useSelector(
    (state) => state.branch
  );
  const [viewAttachment, setViewAttachment] = useState(false)
  const [viewAttachmentData, setViewAttachmentData] = useState([])
  const typeSelection = useWatch({
    control,
    name: "typeSelection",
    defaultValue: "Vendor",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialStartDate = searchParams.get("startDate") || null;
  const initialEndDate = searchParams.get("endDate") || null;
  const initialBranchId = searchParams.get("branchId") || "";
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [startDate, setStartDate] = useState(
    initialStartDate ? dayjs(initialStartDate) : null
  );
  const [endDate, setEndDate] = useState(
    initialEndDate ? dayjs(initialEndDate) : null
  );

  const [branchId, setBranchId] = useState(initialBranchId);
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (branchId) params.set("branchId", branchId);
    params.set("paging", 'approval');
    setSearchParams(params);
  }, [currentPage, limit, branchId, searchText, startDate, endDate]);

  useEffect(() => {
    getEmployeLedgerrequest();

  }, [currentPage, limit, branchId, typeSelection, searchText, startDate, endDate]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setSearchText("");
    setStartDate(null);
    setEndDate(null);
  };


  const onPaginationChange = (page) => setCurrentPage(page);
  const handleBranchChange = (value) => {
    setBranchId(value);
    setCurrentPage(1);
  };

  const getEmployeLedgerrequest = () => {
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
        startDate: customDayjs(startDate),
        endDate: customDayjs(endDate),
        type: "",
        text: searchText,
        sort: true,
        status: "",
        isPagination: true,
        advanceType: 'employee',
      },
    };
    dispatch(getemployeLedgerList(data));
  };
    const handleStartDateChange = (date) => {
    setStartDate(date);
    setCurrentPage(1);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    setCurrentPage(1);
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




  return (

    <>

      <div className="">
        <div class="sm:flex justify-between items-center py-1 lg:space-y-0 space-y-2 overflow-y-auto">
          <div className="grid sm:grid-cols-3 grid-cols-1 lg:grid-cols-4 sm:gap-3 gap-1">
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
              <div>
                <CustomDatePickerFilter
                  value={startDate}
                  onChange={handleStartDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
              </div>
              <div>
                <CustomDatePickerFilter
                  value={endDate}
                  onChange={handleEndDateChange}
                  disabled={loading}
                  report={true}
                  size={"middle"}
                />
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
              <Tooltip placement="topLeft" title="Vendor Employee Advance">
                <button
                  onClick={() => {
                    navigate("/admin/finance-employee-advance-ledger/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">
                    Add  Employee Advance
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
                  Employee Name
                </th>
                <th className="tableHead">payment Mode</th>
                <th className="tableHead">payment Details</th>
                <th className="tableHead">Amount</th>
                <th className="tableHead">Bill Date</th>
                <th className="tableHead">Narration</th>
                <th className="tableHead">Attachment</th>
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
                {employeLedgerListData &&
                  employeLedgerListData?.length > 0 ? (
                  employeLedgerListData.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="tableData">{element?.fullName}</td>


                      <td className="tableData">{element?.type}</td>
                      <td className="tableData">
                        {element?.type == 'bank' && `${element?.bankData?.bankName || '-'} / ${element?.bankData?.bankholderName || '-'} / ${element?.bankData?.accountNumber || '-'}`}
                        {element?.type == 'cash' && `${element?.cashReciverEmploye?.fullName || "-"} `}
                      </td>
                      <td className="tableData">{convertIntoAmount(element?.amount)}</td>
                      <td className="tableData">{moment(element?.date).format("DD/MM/YYYY")}</td>
                      <td className="tableData">{element?.naration || "-"}</td>
                      <td className="tableData">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                          <button
                            onClick={() => {
                              setViewAttachment(true)
                              setViewAttachmentData(element?.attachment)
                            }}
                            disabled={element?.attachment?.length > 0 ? false : true}
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaImages
                              className={element?.attachment?.length > 0 ? " text-rose-700" : "text-gray-400"}
                              size={16}
                            />
                          </button>
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
      <Modal
        className="antmodalclassName"
        visible={viewAttachment}
        onCancel={() => {
          setViewAttachment(false)
          setViewAttachmentData([])
        }}
        footer={null}
        width='800px'
        destroyOnClose
      >
        <div className="flex gap-2 flex-wrap mt-4">
          {viewAttachmentData?.map((filePath, index) => {
            const fileExtension = filePath.split('.').pop().toLowerCase();
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension);
            const isPdf = fileExtension === 'pdf';

            return (
              <div key={index} style={{ flex: '1 1 calc(33.333% - 10px)', marginBottom: '20px' }}>
                {isImage ? (
                  // If it's an image, show the image
                  <a
                    href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      alt={`attachment-${index}`}
                      style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                  </a>
                ) : isPdf ? (<a
                  href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                    <iframe
                      src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${filePath}`}
                      title={`attachment-${index}`}
                      style={{ width: '100%', height: '100%' }}
                    ></iframe>
                  </div>
                </a>
                ) : (
                  <p>Unsupported file type</p>
                )}
              </div>
            );
          })}
        </div>
      </Modal>
      {employeLedgerListData?.length > 0 && (
        <CustomPagination
          totalCount={totalEmployeLedgerListCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      )}
    </>

  );
}
export default EmployeLedgerList;
