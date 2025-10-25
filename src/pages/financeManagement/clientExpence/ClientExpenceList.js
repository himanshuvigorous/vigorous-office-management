import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPenToSquare } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { encrypt } from "../../../config/Encryption";
import { FaPlus } from "react-icons/fa6";
import Loader from "../../../global_layouts/Loader/Loader";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { domainName, inputClassNameSearch, } from "../../../constents/global";
import { useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import { deleteclientExpence, getclientExpenceList } from "./clientExpenceFeature/_clientExpence_reducers";
import { FaDownload } from "react-icons/fa";



function ClientExpenceList() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { clientExpenceListData, totalclientExpenceListCount, loading } = useSelector(
    (state) => state.clientExpence
  );

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
  const limit = 10;
  useEffect(() => {
    if (CompanyId) {
      setValue("PDBranchId", "");
    }
  }, [CompanyId])
  useEffect(() => {
    getclientExpencerequest();
  }, [currentPage, BranchId, CompanyId]);

  const getclientExpencerequest = () => {
    const data = {
      currentPage: currentPage,
      pageSize: limit,
      reqData: {
        directorId: "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
        "text": "",
        "sort": true,
        "status": "",
        "isPagination": true,
        "clientId": "",
        "groupId": "",
        "startDate": "",
        "endDate": "",
        "paymentmode": "",
      }
    };
    dispatch(getclientExpenceList(data));
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
        dispatch(deleteclientExpence(reqData)).then((data) => {
          getclientExpencerequest()
        });
      }
    });
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
          isPagination:false,
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

  return (
    <GlobalLayout>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="">
            <div className="flex justify-between items-center md:space-y-0 space-y-2 py-1">
              <div className="flex items-center space-x-2">
                {userInfoglobal?.userType === "admin" && <div className="">

                  <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    className={` ${inputClassNameSearch} ${errors.PDCompanyId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
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
                </div>}
                {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") && <div className="">

                  <select
                    {...register("PDBranchId", {
                      required: "Branch is required",
                    })}
                    className={` ${inputClassNameSearch} ${errors.PDBranchId
                      ? "border-[1px] "
                      : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Branch
                    </option>
                    {branchList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select>
                  {errors.PDBranchId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDBranchId.message}
                    </p>
                  )}
                </div>}
              </div>
              <button
                onClick={() => {
                  navigate("/admin/clientExpence/create");
                }}
                className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
              >
                <FaPlus />
                <span className="text-[12px]">Add clientExpence</span>
              </button>
            </div>
          </div>
          <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
            <table className="w-full max-w-full rounded-xl overflow-x-auto ">
              <thead className="">
                <tr className="border-b-[1px] border-[#DDDDDD] bg-header capitalize text-[12px] text-[#ffff] font-[500] h-[40px]">
                  <th className="p-2 whitespace-nowrap w-[10%]">S.No.</th>
                  <th className="p-2 whitespace-nowrap">client</th>
                  <th className="p-2 whitespace-nowrap">Amount</th>
                  <th className="p-2 whitespace-nowrap w-[10%]">Action</th>
                </tr>
              </thead>
              <tbody>
                {clientExpenceListData && clientExpenceListData?.length > 0 ? (
                  clientExpenceListData?.map((element, index) => (
                    <tr
                      className={`text-black ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[14px] border-b-[1px] border-[#DDDDDD]`}
                    >
                      <td className="whitespace-nowrap p-2">
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className="whitespace-nowrap p-2">{element?.clientName}</td>
                      <td className="whitespace-nowrap p-2">{element?.grandTotalAmount}</td>
                      <td className="whitespace-nowrap p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2.5">
                        <button
                           onClick={() => {
                            if (element?.clientExpencePDFPath) {
                              const pdfLink = `${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public${element?.clientExpencePDFPath}`;
                              const link = document.createElement("a");
                              link.href = pdfLink;
                              link.target = "_blank"; 
                              link.rel = "noopener noreferrer"; 
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                          
                            className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                            type="button"
                          >
                            <FaDownload
                              className="hover:text-[#337ab7] text-[#3c8dbc]"
                              size={16}
                            />
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/admin/clientExpence/edit/${encrypt(element?._id)}`
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
            </table>
          </div>
          {clientExpenceListData?.length > 0 &&
            <CustomPagination
              totalCount={totalclientExpenceListCount}
              pageSize={limit}
              currentPage={currentPage}
              onChange={onPaginationChange}
            />}
        </>
      )}
    </GlobalLayout>
  );
}
export default ClientExpenceList;
