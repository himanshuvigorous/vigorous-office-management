import React, { useEffect, useState } from "react";
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaPlus } from "react-icons/fa6";
import { FaAngleUp, FaAngleDown, FaEye } from "react-icons/fa";

import { encrypt } from "../../../config/Encryption";
import CustomPagination from "../../../component/CustomPagination/CustomPagination";
import { createEmployeeFromOnBoarding, getOnBoardingList, sendEmailCommon, statusOnBoarding } from "./onBoardingFeatures/_onBoarding_reducers";

import moment from "moment/moment";
import { domainName, handleSortLogic, inputAntdSelectClassNameFilter } from "../../../constents/global";
import EmailTemplateModal from './EmailTemplateModal';
import { MdEmail } from "react-icons/md";
import { BiSolidSend } from "react-icons/bi"
import { Dropdown, Select, Switch, Tooltip } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../../department/departmentFeatures/_department_reducers";
import usePermissions from "../../../config/usePermissions";
import Loader2 from "../../../global_layouts/Loader/Loader2";
import ImportOnBoardingsModal from "./ImportOnBoardingsModal";
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader";
import { designationSearch } from "../../designation/designationFeatures/_designation_reducers";

function OnBoardingManagment() {
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    control,

    formState: { errors },
    setValue,

  } = useForm()

  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { onBoardingList, totalOnBoardingCount, loading } = useSelector(
    (state) => state.onBoarding
  );
  const { departmentListData, loading: departmentListloading } = useSelector(
    (state) => state.department
  );
  const { designationList, loading: designationloading } = useSelector((state) => state.designation);
  const [sortedList, setSortedList] = useState([]);

  useEffect(() => {
    if (onBoardingList) {
      handleSort();
    }
  }, [onBoardingList]);

  const handleSort = (key, order) => {
    const sortedList = handleSortLogic(key, order, onBoardingList);
    setSortedList(sortedList);
  };


  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [onBoardingId, setOnBoardingId] = useState(1);

  const [filterText, setFilterText] = useState('');
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [importModal, setImportModal] = useState(false);


  const handleEmailSubmit = (emailData) => {




    dispatch(sendEmailCommon(emailData)).then(data => {
      if (!data.error) {

        setIsEmailModalOpen(false);
        setOnBoardingId([])
        Swal.fire({
          icon: 'success',
          title: 'Email Generated',
          html: `
            <p>Offer letter email has been generated successfully!</p>
          `,
          confirmButtonColor: '#3085d6'
        });
      }
    });


  };



  const handleViewDetails = (element) => {
    const generatePassword = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@';
      let password = '';
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      return password;
    };

    const officeEmail = element.email ? element.email : element.officeEmail;
    const portalUrl = window.location.origin;

    const password = generatePassword();
    dispatch(createEmployeeFromOnBoarding({
      "_id": element._id,
      "officeEmail": officeEmail,
      "portalUrl": portalUrl,
      "password": password
    })).then((data) => {
      if (!data?.error) {
        Swal.fire({
          title: 'Success!',
          html: `
        <div>Email: ${officeEmail}</div>
        <div>Portal URL: ${portalUrl}</div>
        <div>Password: <strong id="generatedPassword">${password}</strong></div>
        <div>UserName: <strong id="generatedPassword">${element?.employeData?.userName}</strong></div>
      `,
          icon: 'success',
          confirmButtonColor: '#074173'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data?.payload ? data?.payload : 'An error occurred while submitting details.',
          icon: 'error',
          confirmButtonColor: '#d33'
        });
      }
    });
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [filterText]);


  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialLimit = 10;
  const initialBranchId = searchParams.get("branchId") || "";
  const initialStatus = searchParams.get("status") || "";
  const initialDepartmentId = searchParams.get("departmentId") || "";
  const initialDesignationId = searchParams.get("designationId") || "";



  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [status, setStatus] = useState(initialStatus);
  const [searchText, setSearchText] = useState("");
  const [branchId, setBranchId] = useState(initialBranchId);
  const [departmentId, setDepartmentId] = useState(initialDepartmentId);
  const [designationId, setDesignationId] = useState(initialDesignationId);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", currentPage);
    if (branchId) params.set("branchId", branchId);
    if (departmentId) params.set("departmentId", departmentId);
    if (designationId) params.set("designationId", designationId);
    if (status) params.set("status", status);
    setSearchParams(params);
  }, [branchId, status, currentPage, searchText, debouncedFilterText, designationId, departmentId]);
  useEffect(() => {
    fetchOnBoardingListData(debouncedFilterText);
  }, [branchId, status, currentPage, searchText, debouncedFilterText, designationId, departmentId]);

  const handleResetFilters = () => {
    setCurrentPage(1);
    setBranchId("");
    setStatus("");
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


  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
    setCurrentPage(1);
  };
  const handleDesignationChange = (value) => {
    setDesignationId(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    setDesignationId("");
    dispatch(
      designationSearch({
        text: "",
        sort: true,
        status: true,
        departmentId: departmentId,
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
      })
    ).then((data) => {
      data.error && setDesignationId("");
    });
  }, [departmentId]);


  const fetchOnBoardingListData = (filterText) => {
    let reqData = {
      currentPage: currentPage,
      pageSize: limit,
      reqPayload: {
        "text": searchText,
        "status": status === 'true' ? true : status === "false" ? false : '',
        "sort": true,
        "isPagination": true,
        isTL: "",
        isHR: "",
        isManager: "",
        isReceptionist: "",
        employeId:
          "",
        companyId:
          userInfoglobal?.userType === "admin"
            ? ''
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          (userInfoglobal?.userType === "company" ||
            userInfoglobal?.userType === "admin" ||
            userInfoglobal?.userType === "companyDirector")
            ? branchId
            :
            userInfoglobal?.userType === "companyBranch"
              ? userInfoglobal?._id
              : userInfoglobal?.branchId,
        departmentId: departmentId,
        designationId: designationId,
        "applicationId": "",
      },
    };
    dispatch(getOnBoardingList(reqData));
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
          companyId: userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        })
      ).then((data) => {
        data.error && setValue("PDBranchId", "");
      });

    }
  }, []);

  useEffect(() => {
    dispatch(
      deptSearch({
        text: "",
        sort: true,
        status: true,
        isPagination: false,
        companyId: userInfoglobal?.userType === "company"
          ? userInfoglobal?._id
          : userInfoglobal?.companyId,
      })
    ).then((data) => {
      data.error && setValue("PdDepartmentId", "");
    });
  }, [branchId])


  return (
    <GlobalLayout onChange={onChange}>
      <div className="bg-grey-100 w-full p-1">
        <div className="">
          <div className="lg:flex justify-between items-center lg:space-y-0 space-y-2 py-1">
            <div className="grid gap-2 grid-cols-1 sm:flex justify-start  items-center sm:space-x-2 space-x-0 sm:space-y-0 space-y-2">
              <div className="sm:flex gap-2 justify-between grid grid-cols-1 items-center  text-[14px] rounded-md">
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
                    value={departmentId}
                    onChange={handleDepartmentChange}
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
                    <Select.Option value="">Select Department</Select.Option>
                    {departmentListloading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (departmentListData?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.name}
                      </Select.Option>
                    )))}
                  </Select>
                </div>
                <div className="">
                  <Select
                    value={designationId}
                    onChange={handleDesignationChange}
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
                    <Select.Option value="">Select Designation</Select.Option>
                    {designationloading ? <Select.Option disabled>
                      <ListLoader />
                    </Select.Option> : (designationList?.map((type) => (
                      <Select.Option key={type?._id} value={type?._id}>
                        {type?.name}
                      </Select.Option>
                    )))}
                  </Select>
                </div>
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
                    <Select.Option value="true" > Active  </Select.Option>
                    <Select.Option value="false" > InActive  </Select.Option>
                  </Select>

                </div>
                <button
                  onClick={() => {
                    handleResetFilters()
                  }}
                  className="bg-header py-2 rounded-md sm:flex hidden px-10 justify-center items-center text-white"
                >
                  <span className="text-[12px]">Reset</span>
                </button>
              </div>
            </div>
            {canCreate &&
              <div className="sm:flex justify-end items-center gap-2">
                {/* <OnboardingZipDownload onboardingList={onBoardingList} /> */}
                <button
                  onClick={() => {
                    setValue("PDBranchId", "");

                    setValue("status", "");
                  }}
                  className="sm:w-auto w-full bg-header  py-2 my-0.5 rounded-md sm:hidden flex px-10 justify-center items-center  text-white"
                >
                  <span className="text-[12px]">Reset</span>
                </button>
                <button
                  onClick={() => setImportModal(true)}
                  className="sm:w-auto w-full bg-header px-2 py-1.5 my-0.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">import On Boarding</span>
                </button>
                <button
                  onClick={() => {
                    navigate("/admin/onBoarding/create");
                  }}
                  className="sm:w-auto w-full bg-header px-2 py-1.5 my-0.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add On Boarding</span>
                </button>
              </div>}
          </div>
        </div>
        <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
          <table className="w-full max-w-full rounded-xl overflow-x-auto">
            <thead className="">
              <tr className="border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]">
                <th className="tableHead w-[5%]">
                  S.No.
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Profile </span>

                  </div>
                </th>
                <th className="tableHead w-[10%]">
                  <div className="flex justify-start items-center space-x-1">
                    <div className="flex gap-1">
                      Applicant Name
                      <div className="flex flex-col -space-y-1.5 cursor-pointer">
                        <FaAngleUp
                          onClick={() => handleSort("fullName", "asc")}
                        />
                        <FaAngleDown
                          onClick={() => handleSort("fullName", "desc")}
                        />
                      </div>
                    </div>
                  </div>
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <div className="flex gap-1">
                      <span>E-mail</span>

                    </div>
                  </div>{" "}
                </th>
                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Mobile</span>

                  </div>{" "}
                </th>


                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <div className="flex gap-1">
                      <span>Created At</span>

                    </div>
                  </div>{" "}
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <div className="flex gap-1">
                      <span>Created By</span>

                    </div>
                  </div>{" "}
                </th>

                <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <div className="flex gap-1">
                      <span>updatedBy</span>

                    </div>
                  </div>{" "}
                </th>

                {canUpdate && <th className="tableHead">
                  <div className="flex justify-start items-center space-x-1">
                    <span>Status</span>

                  </div>
                </th>}

                {(


                  canCreate || canRead) && <th className="tableHead w-[5%]">
                    Action
                  </th>}
              </tr>
            </thead>
            {loading ? <tr className="bg-white bg-opacity-5 ">
              <td
                colSpan={9}
                className="px-6 py-2 whitespace-nowrap text-center font-[600] text-sm text-gray-500"
              >
                <Loader2 />
              </td>
            </tr> :
              <tbody>
                {sortedList && sortedList.length > 0 ? (
                  sortedList.map((element, index) => (
                    <tr
                      className={`border-b-[1px] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } border-[#DDDDDD] text-[#374151]`}
                    >
                      <td className="tableData">
                        {index + 1 + (currentPage - 1) * limit}
                      </td>
                      <td className="tableData ">
                        {element.profileImage ? (
                          <img
                            alt=""
                            src={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${element.profileImage}`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        ) : (
                          <img
                            alt=""
                            src={`/images/avatar.jpg`}
                            className="rounded-full min-w-10 min-h-10 w-10 h-10 ring-1 ring-amber-300"
                          />
                        )}
                      </td>
                      <td className="tableData">
                        {element?.fullName || '-'}
                      </td>

                      <td className="tableData ">
                        {(element?.email) || '-'}
                      </td>
                      <td className="tableData ">
                        {element?.mobile?.code + element?.mobile?.number || '-'}{" "}
                      </td>
                      <td className="tableData ">
                        {moment(element?.createdAt).format("DD-MM-YYYY hh:mm a") || '-'}{" "}
                      </td>
                      <td className="tableData ">
                        {element?.createdBy || '-'}{" "}
                      </td>
                      <td className="tableData">
                        {element?.updatedBy || '-'}{" "}
                      </td>
                      {(canUpdate) &&
                        <td className="tableData">
                          {canUpdate && <Tooltip placement="topLeft" title={`${element?.status ? 'Tap to Inactive' : 'Tap to Active'}`}>
                            <Switch
                              checked={element?.status}
                              onChange={() => {
                                dispatch(
                                  statusOnBoarding({ _id: element?._id, status: !element?.status })
                                ).then((data) => {
                                  if (!data?.error) {
                                    fetchOnBoardingListData();
                                  }
                                });
                              }}
                              style={{
                                backgroundColor: element?.status
                                  ? "#4caf50"
                                  : "#f44336",
                                transition: "background-color 0.3s ease",
                              }}
                              height={20}
                              width={40}
                            />
                          </Tooltip>}
                        </td>}


                      {(canDelete || canCreate || canRead) && <td className="whitespace-nowrap text-center  border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          {canRead && <Tooltip placement="topLeft" title='View Detail'>
                            <button
                              onClick={() => {
                                navigate(
                                  `/admin/onBoarding/onBoardingView/${encrypt(element?._id)}`
                                );
                              }}
                              className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                              type="button"
                            >
                              <FaEye
                                className=" hover:text-[#337ab7] text-[#3c8dbc]"
                                size={16}
                              />
                            </button>
                          </Tooltip>}
                          <Dropdown
                            menu={{
                              items: [
                                // Send
                                {
                                  key: 'send',
                                  label: canCreate ? (

                                    <span
                                      onClick={() => handleViewDetails(element)}
                                      className="flex items-center gap-2 text-[#3c8dbc] hover:text-[#337ab7]"
                                    >
                                      <BiSolidSend size={16} />
                                      Send Credential
                                    </span>

                                  ) : (

                                    <span className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                      <BiSolidSend size={16} />
                                      Send
                                    </span>

                                  ),
                                  disabled: !canCreate,
                                },

                                // Email
                                {
                                  key: 'email',
                                  label: canCreate ? (
                                    <Tooltip placement="topLeft" title="Email">
                                      <span
                                        onClick={() => {
                                          setOnBoardingId(element);
                                          setIsEmailModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 text-green-600 hover:text-green-500"
                                      >
                                        <MdEmail size={16} />
                                        Email
                                      </span>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip placement="topLeft" title="No permission">
                                      <span className="flex items-center gap-2 text-gray-400 cursor-not-allowed">
                                        <MdEmail size={16} />
                                        Email
                                      </span>
                                    </Tooltip>
                                  ),
                                  disabled: !canCreate,
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Tooltip placement="topLeft" title="More">
                              <button
                                className="px-2 py-1.5 text-xs rounded-md bg-transparent border border-muted"
                                type="button"
                              >
                                <PiDotsThreeOutlineVerticalBold
                                  className="hover:text-[#337ab7] text-[#3c8dbc]"
                                  size={16}
                                />
                              </button>
                            </Tooltip>
                          </Dropdown>


                        </span>
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={9}
                      className="px-6 py-2 whitespace-nowrap text-center  font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
          </table>
        </div>
        <CustomPagination
          totalCount={totalOnBoardingCount}
          pageSize={limit}
          currentPage={currentPage}
          onChange={onPaginationChange}
        />
      </div>
      <EmailTemplateModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSubmit={handleEmailSubmit}
        onBoardingData={onBoardingId}
        setOnBoardingId={setOnBoardingId}
      />
      <ImportOnBoardingsModal
        isOpen={importModal}
        onClose={() => setImportModal(false)}
        fetchList={fetchOnBoardingListData}
      />
    </GlobalLayout >
  );
}

export default OnBoardingManagment;
