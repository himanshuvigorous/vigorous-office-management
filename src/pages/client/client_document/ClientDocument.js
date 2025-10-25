import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteClientDocument,
  getClientDocumentList,
  updateClientDocument,
} from "./clientGroupFeatures/_client_document_reducers";
import moment from "moment";
import dayjs from "dayjs";
import { FaEye, FaRegFilePdf } from "react-icons/fa";
import { Image, Popconfirm, Select, Tooltip, Modal } from "antd";

import { RiDeleteBin5Line } from "react-icons/ri";
import { MdDone } from "react-icons/md";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  domainName,
  inputAntdSelectClassNameFilter,
} from "../../../constents/global";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import ListLoader from "../../../global_layouts/ListLoader";

const ClientDocument = () => {
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const [searchText, setSearchText] = useState("");
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm();
  const BranchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    if (
      userInfoglobal?._id ||
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
              ? userInfoglobal?._id
              : userInfoglobal?.userType === "company"
                ? userInfoglobal?._id
                : userInfoglobal?.companyId,
        })
      );
    }
  }, []);
  const { ClientDocumentList, totalClientDocumentCount, loading } = useSelector(
    (state) => state.clientDocument
  );
  const dispatch = useDispatch();

  const fetchClientDocuments = () => {
    const reqPayload = {
      text: searchText,
      status: "",
      sort: true,
      limit: limit,
      page: currentPage,
      isPagination: true,
      companyId: userInfoglobal?.userType === "company"
        ? userInfoglobal?._id
        : userInfoglobal?.companyId,
      branchId:
        (userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector") ? BranchId : userInfoglobal?.userType === "companyBranch"
          ? userInfoglobal?._id
          : userInfoglobal?.branchId,
    };

    dispatch(getClientDocumentList(reqPayload));
  };

  const [documentData, setDocumentData] = useState([]);
  const [documentModal, setDocumentModal] = useState(false);

  const handleDocumentList = (data) => {
    setDocumentModal(true);
    setDocumentData([
      ...(data?.documentData?.map((item) => ({ ...item, type: "General" })) ||
        []),
      ...(data?.financeData?.map((item) => ({ ...item, type: "Finance" })) ||
        []),
    ]);
  };


  const handleDelete = (data) => {
    const payload = {
      _id: data?._id,
      type: data?.type === "General" ? "documents" : "financial",
    };

    dispatch(deleteClientDocument(payload)).then((res) => {
      if (res?.meta?.arg?._id) {
        const deletedId = res.meta.arg._id;

        setDocumentData((prev) => prev.filter((doc) => doc._id !== deletedId));
      }
    });
  };


  const handleVerify = (data) => {
    const payload = {
      _id: data?._id,
      type: data?.type == "General" ? "documents" : "financial",
      isVerified: true,
    };
    dispatch(updateClientDocument(payload)).then((data) => {
      if (data) {
        setDocumentData((prev) =>
          prev.map((doc) => {
            return doc._id === data.meta?.arg?._id
              ? { ...doc, isVerified: true }
              : doc;
          })
        );
        fetchClientDocuments();
      }
    });
  };

  const filters = [BranchId,searchText].join("-");

const [isFirstRender ,setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      fetchClientDocuments()
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    fetchClientDocuments();
  }, [BranchId, currentPage, searchText]);

  const onChange = (e) => {
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      <div className="flex justify-start items-center md:space-x-2 space-x-2 py-1">
        {(userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "companyDirector") && (
            <div>
              <Controller
                control={control}
                name="PDBranchId"
                rules={{ required: "Branch is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter}`}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
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
        <button
          onClick={() => {
            setValue("PDBranchId", '')

          }}
          className="bg-header rounded-md py-1.5 flex px-4 mt-1 justify-center items-center  text-white">
          <span className="text-[12px]">Reset</span>
        </button>
      </div>
      <div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                <th className="p-2 whitespace-nowrap">Client Name</th>
                <th className="p-2 whitespace-nowrap">Client Id</th>
                <th className="p-2 whitespace-nowrap">Client Email</th>
                <th className="p-2 whitespace-nowrap">Requested By</th>
                <th className="p-2 whitespace-nowrap">Approved By</th>
                <th className="p-2 whitespace-nowrap">Created At</th>
                <th className="p-2 whitespace-nowrap">Total documents</th>

                <th className="p-2 whitespace-nowrap">
                  Pending Document Approval
                </th>

                <th className="p-2 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            {loading ? (
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
                >
                  <ListLoader />
                </td>
              </tr>
            ) : <tbody>
              {ClientDocumentList && ClientDocumentList?.length > 0 ? (
                ClientDocumentList?.map((element, index) => (
                  <tr
                    key={element?._id}
                    className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                      } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                  >
                    <td className="whitespace-nowrap p-2">{index + 1 + ((currentPage - 1) * limit)}</td>
                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {element?.fullName || "-"}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {element?.userName || "-"}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {element?.email || "-"}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {element?.createdBy || "-"}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {element?.updatedBy || "-"}
                    </td>

                    <td className="whitespace-nowrap p-2 text-[13px]">
                      {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") || "-"}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px] text-center">
                      {element?.documentData?.length +
                        element?.financeData?.length}
                    </td>
                    <td className="whitespace-nowrap p-2 text-[13px] text-center">
                      <div className="flex justify-center items-center ">
                        <div className="w-8 h-8 flex justify-center items-center  text-white bg-[#3D90D7] rounded-full">
                          {element?.documentDataCount +
                            element?.financeDataCount}
                        </div>
                      </div>
                    </td>

                    {/* <td className="whitespace-nowrap p-2 text-[13px] text-center">
                      {element?.financeData?.length}
                    </td> */}
                    {/* <td className="whitespace-nowrap p-2 text-[13px] text-center">
                      <div className="flex justify-center items-center ">
                        <div className="w-8 h-8 flex justify-center items-center  text-white bg-[#3D90D7] rounded-full">
                          {element?.financeDataCount
                            ? element?.financeDataCount
                            : 0}
                        </div>
                      </div>
                    </td> */}

                    <td className="whitespace-nowrap p-2 ">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip placement="topLeft"  title={"View document Details"}>
                          <button
                            onClick={() => {
                              handleDocumentList(element);
                            }}
                            className="px-2 py-2 text-xs rounded-md bg-transparent text-header border border-muted"
                            type="button"
                          >
                            <FaEye
                              className={`${" hover:text-[#337ab7] text-[#3c8dbc]"}`}
                            />
                          </button>
                        </Tooltip>

                      </div>
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
          </table>
        </div>
        {documentModal && (

          <Modal
            title="Documents"
            open={documentModal}
            onCancel={() => setDocumentModal(false)}
            footer={null}
            width="90%"
            centered
            zIndex={1460}
            className="antmodalclassName"
          >
            <div className="w-full max-w-full overflow-x-auto">
              <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                <thead className="">
                  <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                    <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                    <th className="p-2 whitespace-nowrap">Name</th>
                    <th className="p-2 whitespace-nowrap">Type</th>
                    <th className="p-2 whitespace-nowrap">Number</th>
                    <th className="p-2 whitespace-nowrap">Image</th>
                    <th className="p-2 whitespace-nowrap">Status</th>
                    <th className="p-2 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>

                  {documentData && documentData?.length > 0 ? (
                    documentData?.map((element, index) => (
                      <tr
                        className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                      >
                        <td className="whitespace-nowrap p-2">{index + 1}</td>
                        <td className="whitespace-nowrap p-2">
                          {element?.name || "-"}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {element?.type || "-"}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          {element?.number || "-"}
                        </td>
                        <td className="whitespace-nowrap p-2">
                          <div className="w-full flex justify-start items-center gap-1">
                            {Array.isArray(element?.filePath) &&
                              element.filePath.map((file, index) =>
                                typeof file === "string" ? (
                                  file.toLowerCase().endsWith(".pdf") ? (
                                    <a
                                      key={index}
                                      href={file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 underline block"
                                    >
                                      <FaRegFilePdf
                                        className="text-rose-400 "
                                        size={20}
                                      />
                                    </a>
                                  ) : (
                                    <Image
                                      key={index}
                                      width={35}
                                      src={file}
                                      alt={`Preview ${index}`}
                                    />
                                  )
                                ) : null
                              )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap p-2">
                          {element?.isVerified ? (
                            <span className="bg-teal-400 py-1 px-2 text-white border-green-800 rounded-sm">
                              {" "}
                              Verified{" "}
                            </span>
                          ) : (
                            <span className="bg-rose-500 py-1 px-2 text-white  rounded-sm">
                              Not Verified{" "}
                            </span>
                          )}
                        </td>
                        <td className="whitespace-nowrap  p-2">
                          <div className="flex gap-2 z-50">
                            <Popconfirm
                              key={index}
                              title="Verify the document"
                              description="Are you sure to Verify this document?"
                              onConfirm={() => handleVerify(element)}
                              // onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                              zIndex={1601}
                            >
                              <Tooltip placement="topLeft"  title={"Verify"}>
                                <button
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                  disabled={element?.isVerified}
                                >
                                  <MdDone
                                    className={`${element?.isVerified
                                      ? "text-gray-500"
                                      : " hover:text-green-500 text-green-600"
                                      }`}
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            </Popconfirm>

                            <Popconfirm
                              title="Delete the document"
                              description="Are you sure to Delete this document?"
                              onConfirm={() => handleDelete(element)}
                              // onCancel={cancel}
                              okText="Yes"
                              cancelText="No"
                              zIndex={1601}
                            >
                              <Tooltip placement="topLeft"  title={"Delete"}>
                                <button
                                  // onClick={() => handleDelete(element)}
                                  className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                  type="button"
                                  disabled={element?.isVerified}
                                >
                                  <RiDeleteBin5Line
                                    className={`${element?.isVerified
                                      ? "text-gray-500"
                                      : " hover:text-rose-700 text-rose-800"
                                      }`}
                                    size={16}
                                  />
                                </button>
                              </Tooltip>
                            </Popconfirm>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white bg-opacity-5">
                      <td
                        colSpan={7}
                        className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                      >
                        Record Not Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Modal>
          //   </div>
          // </div>
        )}

        {/* {fdocumentModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1460]"
            onClick={() => setfDocumentModal(false)}
          >
            <div
              className="animate-slideInFromTop bg-gray-100 rounded-lg top-16 p-6 w-full max-w-full md:w-[70%]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-full overflow-x-auto">
                <table className="w-full max-w-full rounded-xl overflow-x-auto ">
                  <thead className="">
                    <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                      <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                      <th className="p-2 whitespace-nowrap">Name</th>
                     
                      <th className="p-2 whitespace-nowrap">Image</th>
                      <th className="p-2 whitespace-nowrap">isVerified</th>

                      <th className="p-2 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody>
          
                    {fDocumentData && fDocumentData?.length > 0 ? (
                      fDocumentData?.map((element, index) => (
                        <tr
                          className={`text-black ${
                            index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                          } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                        >
                          <td className="whitespace-nowrap p-2">{index + 1}</td>
                          <td className="whitespace-nowrap p-2">
                            {element?.name}
                          </td>
                      

                          <td className="whitespace-nowrap p-2">
                            <Image width={35} src={`${element?.filePath}`} />
                          </td>
                          <td className="whitespace-nowrap p-2">
                            {element?.isVerified ? "verified" : "not Verified"}
                          </td>
                          <td className="whitespace-nowrap  p-2">
                            <div className="flex gap-2">
                              <Popconfirm
                                key={index}
                                title="Verify the document"
                                description="Are you sure to Verify this document?"
                                onConfirm={() =>
                                  handleVerifyFinancialDocument(element)
                                }
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                                zIndex={1601}
                              >
                                <Tooltip placement="topLeft"  title={"Verify"}>
                                  <button
                                    // onClick={() =>
                                    //   handleVerifyFinancialDocument(element)
                                    // }
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                    disabled={element?.isVerified}
                                  >
                                    <MdDone
                                      className={`${
                                        element?.isVerified
                                          ? "text-gray-500"
                                          : " hover:text-green-500 text-green-600"
                                      }`}
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                              </Popconfirm>

                              <Popconfirm
                                title="Delete the document"
                                description="Are you sure to Delete this document?"
                                onConfirm={() =>
                                  handleDeleteFinancialDocument(element)
                                }
                                // onCancel={cancel}
                                okText="Yes"
                                cancelText="No"
                                zIndex={1601}
                              >
                                <Tooltip placement="topLeft"  title={"Delete"}>
                                  <button
                                    // onClick={() =>
                                    //   handleDeleteFinancialDocument(element)
                                    // }
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                    disabled={element?.isVerified}
                                  >
                                    <RiDeleteBin5Line
                                      className={`${
                                        element?.isVerified
                                          ? "text-gray-500"
                                          : " hover:text-rose-700 text-rose-800"
                                      }`}
                                      size={16}
                                    />
                                  </button>
                                </Tooltip>
                              </Popconfirm>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="bg-white bg-opacity-5">
                        <td
                          colSpan={7}
                          className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                        >
                          Record Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )} */}

        {ClientDocumentList?.length > 0 && (
          <CustomPagination
            totalCount={totalClientDocumentCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </div>
    </GlobalLayout>
  );
};

export default ClientDocument;
