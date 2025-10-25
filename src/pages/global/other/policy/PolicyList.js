import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../../global_layouts/Loader/Loader";
import { deletePolicyFunc, getpolicyList } from "./policyFeatures/policy_reducers";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { domainName, inputAntdSelectClassNameFilter, inputClassNameSearch, } from "../../../../constents/global";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { CgEyeAlt } from "react-icons/cg";
import { Select, Tooltip } from "antd";
import getUserIds from "../../../../constents/getUserIds";
import { HiOutlineFilter } from "react-icons/hi";


function PolicyList() {
  const { register, control, formState: { errors } } = useForm();
  const { userCompanyId, userBranchId, userType } = getUserIds();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { commonEmailData, totalcommonEmailCount, loading } = useSelector((state) => state.emailTemplate);

  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const { companyList } = useSelector((state) => state.company);
  const { branchList } = useSelector(
    (state) => state.branch
  );
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState("");

  const companyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const branchId = useWatch({
    control,
    name: "PDBranchId",
    defaultValue: userBranchId,
  });
  const limit = 10;

  useEffect(() => {
    getCommonEmailRequest();
  }, [currentPage, branchId, companyId, status, searchText]);


  const getCommonEmailRequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: companyId || "",
        branchId: branchId || "",
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
      }
    };
    dispatch(getpolicyList(data));
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
        dispatch(deletePolicyFunc(reqData)).then((data) => {
          getCommonEmailRequest()
        });
      }
    });
  };
  useEffect(() => {
    if (
      companyId ||
      userType === "company" ||
      userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          isPagination:false,
          companyId: companyId
        })
      );
    }
  }, [companyId])
  useEffect(() => {
    if (userType === "admin") {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // State to store the selected template data

  // Function to open the modal with the template details
  const openModal = (template) => {
    setSelectedTemplate(template);
    setModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalOpen(false);
    setSelectedTemplate(null);
  };

  const onChange = (e) => {
    
    setSearchText(e);
  };

  return (
    <GlobalLayout onChange={onChange}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
              <div className="flex items-center space-x-2">
                {userType === "admin" &&
                  <div className='flex justify-center items-center space-x-2 bg-white p-2 text-[14px] rounded-md'>
                    <HiOutlineFilter />
                    <select
                      {...register("PDCompanyId")}
                      className="bg-white focus:outline-none"
                    >
                      <option className="" value="">Select Comapany</option>
                      {companyList?.map((type) => (
                        <option value={type?._id}>{type?.fullName}</option>
                      ))}
                    </select>
                  </div>}
                {(userType === "admin" || userType === "company" || userType === "companyDirector") &&
                  <div className="">
                    <Controller
                      name="PDBranchId"
                      control={control}
                      rules={{ required: "Branch is required" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          className={`${inputClassNameSearch} ${errors.PDBranchId ? "border-[1px] " : "border-gray-300"}`}
                          placeholder="Select Branch"
                        >
                          <Select.Option value="">Select Branch</Select.Option>
                          {branchList?.map((type) => (
                            <Select.Option key={type?._id} value={type?._id}>
                              {type?.fullName}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.PDBranchId && <p className="text-red-500 text-sm">{errors.PDBranchId.message}</p>}
                  </div>}
                <Select
                  className={` ${inputAntdSelectClassNameFilter} `}
                  value={status}
                  onChange={(e) => {
                    setStatus(e);
                  }}
                  placeholder="Select Status"
                  showSearch
                >
                  <Select.Option value="">Select Status</Select.Option>
                  <Select.Option value={true}>{"Active"}</Select.Option>
                  <Select.Option value={false}>{"InActive"}</Select.Option>
                </Select>
              </div>
              <button
                onClick={() => {
                  navigate("/admin/policy/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add Policy</span>
              </button>
            </div>
          </div>
          {!loading ?
            <div className="w-full">
              <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
                <table className="w-full max-w-full rounded-xl overflow-x-auto">
                  <thead>
                    <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                      <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                      <th className="p-2 whitespace-nowrap">Title</th>
                      <th className="p-2 whitespace-nowrap">Status</th>
                      <th className="p-2 whitespace-nowrap w-[10%]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commonEmailData && commonEmailData?.length > 0 ? (
                      commonEmailData?.map((element, index) => (
                        <React.Fragment key={element._id}>
                          <tr
                            className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"} text-[14px] border-b-[1px] border-[#DDDDDD]`}
                          >
                            <td className="whitespace-nowrap p-2">
                              {index + 1 + (currentPage - 1) * limit}
                            </td>
                            <td className="whitespace-nowrap p-2">{element?.title}</td>
                            <td className="whitespace-nowrap border-none p-2 ">
                              <span
                                className={`${element?.status ? "bg-[#E0FFBE] border-green-500" : "bg-red-200 border-red-500"} border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                              >
                                {element?.status ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="whitespace-nowrap p-2">
                              <span className="py-1.5 flex justify-start items-center space-x-2.5">
                                <Tooltip placement="topLeft"  title='Edit'>
                                  <button
                                    onClick={() => {
                                      navigate(`/admin/policy/edit/${encrypt(element?._id)}`);
                                    }}
                                    className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <FaPenToSquare className="hover:text-[#337ab7] text-[#3c8dbc]" size={16} />
                                  </button>
                                </Tooltip>
                                <Tooltip placement="topLeft"  title='View Details'>
                                  <button
                                    onClick={() => openModal(element)}
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <CgEyeAlt className="text-cyan-600 hover:text-cyan-500" size={16} />
                                  </button>
                                </Tooltip>
                                <Tooltip placement="topLeft"  title='Delete'>
                                  <button
                                    onClick={() => handleDelete(element?._id)}
                                    className="px-2 py-1.5 rounded-md bg-transparent border border-muted"
                                    type="button"
                                  >
                                    <RiDeleteBin5Line className="text-red-600 hover:text-red-500" size={16} />
                                  </button>
                                </Tooltip>
                              </span>
                            </td>

                          </tr>
                        </React.Fragment>
                      ))
                    ) : (
                      <tr className="bg-white bg-opacity-5">
                        <td colSpan={6} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">
                          Record Not Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {commonEmailData?.length > 0 &&
                <CustomPagination
                  totalCount={totalcommonEmailCount}
                  pageSize={limit}
                  currentPage={currentPage}
                  onChange={onPaginationChange}
                />}
            </div>
            : <Loader />}
          {modalOpen && selectedTemplate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1501]" onClick={closeModal}>
              <div className="animate-slideInFromTop bg-white rounded-lg px-6 pt-6 pb-3 w-[800px] max-h-[70vh] overflow-y-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="mt-4">
                  <div dangerouslySetInnerHTML={{ __html: selectedTemplate?.content }}></div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-white bg-header rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </GlobalLayout>
  );
}
export default PolicyList;
