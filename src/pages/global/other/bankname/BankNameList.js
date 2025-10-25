import { FaAngleDown, FaAngleUp, FaPenToSquare, FaPlus } from "react-icons/fa6";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { encrypt } from "../../../../config/Encryption";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Controller, useForm, useWatch } from "react-hook-form";
import { inputAntdSelectClassName, inputAntdSelectClassNameFilter, inputClassNameSearch } from "../../../../constents/global";
import getUserIds from "../../../../constents/getUserIds";
import CustomPagination from "../../../../component/CustomPagination/CustomPagination";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { Select, Tooltip } from "antd";
import { banknameSearch, deletebankNameFunc, getbankNameList } from "./bankNameFeatures/_bankName_reducers";
import usePermissions from "../../../../config/usePermissions";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import ListLoader from "../../../../global_layouts/ListLoader";

function BankNameList() {
  const { register, setValue, formState: { errors }, control } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    userCompanyId,
    userType
  } = getUserIds();


  const { bankNameListData, totalbankNameCount, loading } = useSelector(
    (state) => state.bankname
  );

  const [searchText, setSearchText] = useState("");
  // const [status, setStatus] = useState("");
  const { companyList, companyListLoading } = useSelector((state) => state.company);
  const [currentPage, setCurrentPage] = useState(1);

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };
  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: userCompanyId,
  });
  const status = useWatch({
    control,
    name: 'status',
    defaultValue: ''
  });
  const limit = 10;


  const filters = [CompanyId, status, searchText].join("-");
  const [isFirstRender ,setisFirstRender] = useState(false)
  
  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      fetchbanknameList();
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    fetchbanknameList();
  }, [currentPage]);

  const fetchbanknameList = () => {
    const reqListData = {
      limit: limit,
      page: currentPage,
      reqPayload: {
        text: searchText,
        sort: true,
        status: status === "true" ? true : status === "false" ? false : "",
        companyId: CompanyId,
        isPagination: true,
      },
    };
    dispatch(getbankNameList(reqListData));
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
        dispatch(deletebankNameFunc(reqData)).then((data) => {
          // !data.error && dispatch(fetchbanknameList());
          if (currentPage > 1 && bankNameListData?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            !data.error && dispatch(fetchbanknameList());
          }
        });
      }
    });
  };



  const handleCompanyChange = (event) => {
    setValue("PDCompanyId", event.target.value);
    dispatch(
      banknameSearch({
        isPagination: false,
        text: "",
        sort: true,
        status: true,
        companyId: event.target.value,
      })
    );
  };

  const handleFocusCompany = () => {
    if (!companyList?.length) {
      dispatch(
        companySearch({
          isPagination: false,
          text: "",
          sort: true,
          status: true,
        })
      );
    }
  };

  const onChange = (e) => {

    setSearchText(e);
  };
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
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
      <>

        <div className="">

          <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
            <div className="sm:flex justify-start items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
              {userType === "admin" && (
                <div className="">
                  {/* <select
                    {...register("PDCompanyId", {
                      required: "company is required",
                    })}
                    onChange={handleCompanyChange}
                    onFocus={handleFocusCompany}
                    className={` ${inputClassNameSearch} ${errors.PDCompanyId ? "border-[1px] " : "border-gray-300"
                      }`}
                  >
                    <option className="" value="">
                      Select Comapany
                    </option>
                    {companyList?.map((type) => (
                      <option value={type?._id}>{type?.fullName}</option>
                    ))}
                  </select> */}

                  <Controller
                    control={control}
                    name="PDCompanyId"
                    rules={{ required: "Company is required" }}
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
                        <Select.Option value="">Select Company</Select.Option>
                        {companyListLoading ? <Select.Option disabled>
                          <ListLoader />
                        </Select.Option> : companyList?.map((type) => (
                          <Select.Option key={type?._id} value={type?._id}>
                            {type?.fullName}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.PDCompanyId && (
                    <p className="text-red-500 text-sm">
                      {errors.PDCompanyId.message}
                    </p>
                  )}
                </div>
              )}
              <div>
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
                <Tooltip placement="topLeft"  title='New Bankname'>
                  <button
                    onClick={() => {
                      navigate("/admin/bankname/create");
                    }}
                    className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                  >
                    <FaPlus />
                    <span className="text-[12px]">Add Bank Name</span>
                  </button>
                </Tooltip>}
            </div>
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto rounded-xl mt-1">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
                <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  S.No.
                </th>
                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Bank Name</span>
                    
                  </div>
                </th>

                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>created At</span>
                    
                  </div>
                </th>

                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>created By</span>
                    
                  </div>
                </th>

                <th className="border-none p-2 whitespace-nowrap">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Status</span>
                    
                  </div>{" "}
                </th>
                {(canDelete || canUpdate) && <th className="border-none p-2 whitespace-nowrap w-[10%]">
                  Action
                </th>}
              </tr>
            </thead>

            {loading ?
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr>
              :
              <tbody>
                {bankNameListData && bankNameListData?.length > 0 ? (
                  bankNameListData?.map((element, index) => (
                    <tr
                      key={index}
                      className={` ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
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
                      {(canDelete || canUpdate) && <td className="whitespace-nowrap border-none p-2">
                        {element?.companyId === "null" ||
                          element?.companyId === null ? (
                          <span className="py-1.5 text-black "> - </span>
                        ) : (
                          <span className="py-1.5 flex justify-start items-center space-x-2">
                            {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                              <button
                                onClick={() => {
                                  navigate(
                                    `/admin/bankname/edit/${encrypt(
                                      element?._id
                                    )}`
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
                        )}
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={6}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>}
        </div>
        {totalbankNameCount > limit && (
          <CustomPagination
            totalCount={totalbankNameCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />
        )}
      </>
    </GlobalLayout>
  );
}

export default BankNameList;
