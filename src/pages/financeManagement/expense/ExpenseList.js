import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import {  domainName, inputAntdSelectClassNameFilter, } from "../../../constents/global";
import {  useForm, } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deleteExpense, getExpenseList } from "./expenseFeature/_expense_reducers";
import getUserIds from "../../../constents/getUserIds";
import usePermissions from "../../../config/usePermissions";
import { BsEyeFill } from "react-icons/bs";
import ExpenseListModal from "./ExpenseListModal";
import { Select } from "antd";
import ListLoader from "../../../global_layouts/ListLoader";
import { decrypt, encrypt } from "../../../config/Encryption";

function ExpenseList() {
  const {
    userCompanyId,    
    userType
  } = getUserIds();
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const { register, control, formState: { errors }, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  
  const { expenseListData, totaladvanceListCount, loading } = useSelector((state) => state.expense);

  const { companyList } = useSelector((state) => state.company);
  const { branchList, loading: branchListloading } = useSelector((state) => state.branch);
  const [isModalOpen, setIsModalOpen] = useState({
    data: null,
    isOpen: false
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
          getExpenceListData();
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

  const getExpenceListData = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId: userCompanyId,
        branchId:
        userInfoglobal?.userType === "company" ||
          userInfoglobal?.userType === "admin" ||
          userInfoglobal?.userType === "companyDirector"
          ? branchId
          : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": searchText,
        "type": "",
        "sort": true,
        "status": "",
        "isPagination": true,
      }
    };
    dispatch(getExpenseList(data));
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
        dispatch(deleteExpense(reqData)).then((data) => {
          getExpenceListData()
        });
      }
    });
  };
  useEffect(() => {
    if (
      userType === "company" || userType === "companyDirector"
    ) {
      dispatch(
        branchSearch({
          text: "",
          sort: true,
          status: true,
          companyId: userCompanyId,
          isPagination: false,
        })
      );
    }
  }, [])
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


  return (
    <GlobalLayout onChange={onChange}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            <div className="sm:flex justify-between items-center sm:space-y-0 space-y-2 py-1">
              <div className="sm:flex items-center sm:space-x-2 sm:space-y-0 space-y-1 ">
               
                {(userType === "admin" || userType === "company" || userType === "companyDirector") &&
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
              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => {
                    handleResetFilters()
                  }}
                  className="bg-header  py-1.5 rounded-md flex px-10 justify-center items-center  text-white"
                >
                  <span className="text-[12px]">Reset</span>
                </button>
                {canCreate &&
                  <button
                    onClick={() => {
                      navigate("/admin/expense/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add expense</span>
                  </button>}
              </div>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                  <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                  <th className="p-2 whitespace-nowrap">Client Name</th>

                  <th className="p-2 whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenseListData && expenseListData?.length > 0 ? (
                  expenseListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap p-2">{element?.clientName}</td>

                      <td className="whitespace-nowrap p-2"><button
                        onClick={() => setIsModalOpen({
                          data: element,
                          isOpen: true
                        })}
                        className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                        type="button"
                      >
                        <BsEyeFill
                          className=" hover:text-[#337ab7] text-[#3c8dbc]"
                          size={16}
                        />
                      </button></td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5">
                    <td
                      colSpan={5}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-center text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>}
          </div>
          <ExpenseListModal
            handleDelete={handleDelete}
            isModalOpen={isModalOpen}
            onClose={() => setIsModalOpen({
              data: null,
              isOpen: false
            })}
            expenseListData={expenseListData}

          />
          {expenseListData?.length > 0 &&
            <CustomPagination
              totalCount={totaladvanceListCount}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />}
        </>
      )}
    </GlobalLayout>
  );
}
export default ExpenseList;
