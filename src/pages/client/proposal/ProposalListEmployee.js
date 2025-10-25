import { useNavigate } from "react-router-dom"
import GlobalLayout from "../../../global_layouts/GlobalLayout/GlobalLayout"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { encrypt } from "../../../config/Encryption"
import { FaPlus, FaPenToSquare } from "react-icons/fa6"
import { RiDeleteBin5Line, RiEjectFill, RiProfileFill } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { domainName, inputAntdSelectClassNameFilter, inputClassName, inputClassNameSearch, inputLabelClassName } from "../../../constents/global";
import { getProposalList, proposalSearch, deleteProposal, sendProposalEmail, updateProposalStatus } from "./proposalFeatures/_proposal_reducers"
import CustomPagination from "../../../component/CustomPagination/CustomPagination"
import { branchSearch } from "../../branch/branchManagement/branchFeatures/_branch_reducers";
import { companySearch } from "../../company/companyManagement/companyFeatures/_company_reducers";
import Loader from "../../../global_layouts/Loader/Loader"
import { MdChangeCircle, MdEmail, MdRemoveCircle } from "react-icons/md"
import SendProposalModal from "./SendProposalModal"
import { BiCheckCircle, BiUserCircle } from "react-icons/bi"
import { Button, Input, Modal, Select, Spin, Tooltip, Dropdown } from "antd"
import usePermissions from "../../../config/usePermissions"
import TextArea from "antd/es/input/TextArea"
import { fileUploadFunc } from "../../global/other/fileManagement/FileManagementFeatures/_file_management_reducers"
import { FaEye, FaRegFile, FaTimes } from "react-icons/fa"
import { LoadingOutlined } from '@ant-design/icons';
import moment from "moment"
import Loader2 from "../../../global_layouts/Loader/Loader2"
import { PiDotsThreeOutlineVerticalBold } from "react-icons/pi";
import ListLoader from "../../../global_layouts/ListLoader"



function ProposalListEmployee() {
  const { register, setValue, control, formState: { errors } } = useForm();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { companyList } = useSelector((state) => state.company);
  const { branchList, branchListloading } = useSelector((state) => state.branch);
  const { proposalList, totalProposalCount, loading } = useSelector(state => state.proposal);
  const userInfoglobal = JSON.parse(localStorage.getItem(`user_info_${domainName}`));
  const [proposalId, setProposalId] = useState(1);
  const [isProposalOpen, setIsProposalOpen] = useState(false);

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
  const status = useWatch({
    control,
    name: "status",
    defaultValue: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const limit = 10;

  const onPaginationChange = (page) => {
    setCurrentPage(page);
  };

  const filters = [BranchId, CompanyId, status, searchText].join("-");

const [isFirstRender ,setisFirstRender] = useState(false)

  useEffect(() => {
    if (!isFirstRender) {
      setisFirstRender(state=>true);
      return;
    }
    if (currentPage === 1) {
      fetchProposalList()
    } else {
      setCurrentPage(1);
    }
  }, [filters])

  useEffect(() => {
    fetchProposalList()
  }, [currentPage])

  const fetchProposalList = () => {
    const reqData = {
      page: currentPage,
      limit: limit,
      reqPayload: {
        companyId:
          userInfoglobal?.userType === "admin"
            ? CompanyId
            :
            userInfoglobal?.userType === "company"
              ? userInfoglobal?._id
              : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "company" || userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "companyDirector" ? BranchId : userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
            employeId: userInfoglobal?.userType === "employee" ? userInfoglobal?._id : "",
        "directorId": "",
        "text": searchText,
        "sort": true,
        "status": status,
        "isPagination": true,
      }
    }
    dispatch(getProposalList(reqData))
  }

  const handleDelete = (id) => {
    let reqData = {
      _id: id,
    }
    Swal.fire({
      title: "Warning",
      text: "Are you sure you want to delete!",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProposal(reqData)).then((data) => {
          // fetchProposalList()
          if (currentPage > 1 && proposalList?.length == 1) {
            setCurrentPage(Number(currentPage - 1));

          } else {
            fetchProposalList();
          }
        })
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
          isPagination: false,
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

  const handleProposalEmail = (emailData) => {
    dispatch(sendProposalEmail(emailData)).then(data => {
      if (!data.error) {

        setIsProposalOpen(false);
        setProposalId([])
        Swal.fire({
          icon: 'success',
          title: 'Proposal Email',
          html: `
                <p>Proposal Email has been send successfully!</p>
              `,
          confirmButtonColor: '#3085d6'
        });
      }
    });
  };


  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    data: null,
    status: ""
  })

  const handleStatusModalOpen = (data, status) => {
    setStatusModal({
      isOpen: true,
      data: data,
      status: status
    })
  }

  const handleStatusModalClose = () => {

    setStatusModal({
      isOpen: false,
      data: null,
      status: ""
    })
  }
  const [remark, setRemark] = useState('');
  const [finalizeAmount, setFinalizeAmount] = useState('');
  const [attachment, setAttachments] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  // Error states for validation
  const [remarkError, setRemarkError] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
    if (e.target.value) {
      setRemarkError("");
    }
    else {
      setRemarkError("Remark is required.");
    }
  };

  const handleAmountChange = (e) => {
    setFinalizeAmount(e.target.value);
    if (e.target.value) {
      setAmountError("");
    }
    else {
      setAmountError("Finalize Amount is required.");
    }
  };

  const handleSubmit = () => {


    let isValid = true;

    if (!remark) {
      setRemarkError("Remark is required.");
      isValid = false;
    }

    if (!finalizeAmount) {
      setAmountError("Finalize Amount is required.");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const payload = {
      "_id": statusModal?.data?._id,
      "status": statusModal?.status,
      "remark": remark,
      "finalizedAmount": finalizeAmount,
      "attachments": attachment,
    };

    dispatch(updateProposalStatus(payload)).then((data) => {
      if (!data?.error) {
        fetchProposalList()
        handleStatusModalClose()
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      e.target.value = null;

      const reqData = {
        filePath: file,
        isVideo: false,
        isMultiple: false,
      };

      dispatch(fileUploadFunc(reqData)).then((res) => {
        if (res?.payload?.data) {
          setAttachments(prev => [...prev, res.payload?.data]);
        }
      });
    }
  };
  const handleRemoveFile = (index) => {
    setAttachments(prev => {
      const updatedAttachments = prev.filter((_, i) => i !== index);
      return updatedAttachments
    });
  };

  const onChange = (e) => {

    setSearchText(e);
  };

  const getMenuItems = (element) => {
    const items = [];

    if (element?.status !== 'Approved' && element?.status !== 'Cancelled') {
      canUpdate && items.push({
        key: 'approve',
        label: (
          <div className="flex items-center gap-2" onClick={() => handleStatusModalOpen(element, 'Approved')}>
            <BiCheckCircle size={16} className="text-[#3c8dbc]" />
            <span>Approve</span>
          </div>
        )
      });

      canUpdate && items.push({
        key: 'edit',
        label: (
          <div className="flex items-center gap-2" onClick={() => navigate(`/admin/proposal/edit/${encrypt(element?._id)}`)}>
            <FaPenToSquare size={16} className="text-[#3c8dbc]" />
            <span>Edit Proposal</span>
          </div>
        )
      });

      canDelete && items.push({
        key: 'delete',
        label: (
          <div className="flex items-center gap-2" onClick={() => handleDelete(element?._id)}>
            <RiDeleteBin5Line size={16} className="text-red-600" />
            <span>Delete</span>
          </div>
        )
      });

      canCreate && items.push({
        key: 'email',
        label: (
          <div className="flex items-center gap-2" onClick={() => { setProposalId(element); setIsProposalOpen(true); }}>
            <MdEmail size={16} className="text-green-600" />
            <span>Send Email</span>
          </div>
        )
      });

      if (element?.status === 'Pending' && canUpdate) {
        items.push({
          key: 'cancel',
          label: (
            <div className="flex items-center gap-2" onClick={() => {
              Swal.fire({
                text: 'Do you want to Reject this proposal?',
                input: 'textarea',
                inputPlaceholder: 'Enter remarks...',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                cancelButtonText: 'Cancel',
                preConfirm: (remark) => {
                  if (!remark) {
                    Swal.showValidationMessage('Please enter a remark.');
                  }
                  return remark;
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  dispatch(updateProposalStatus({
                    _id: element?._id,
                    status: 'Cancelled',
                    remark: result.value
                  }))
                    .then((data) => {
                      if (!data?.error) {
                        Swal.fire({ title: 'Success!', text: 'Proposal has been Rejected.', icon: 'success' });
                        fetchProposalList();
                      } else {
                        Swal.fire({ title: 'Error!', text: 'Failed to Reject proposal. Please try again.', icon: 'error' });
                      }
                    }).catch(() => {
                      Swal.fire({ title: 'Error!', text: 'Unexpected error. Try again later.', icon: 'error' });
                    });
                }
              });
            }}>
              <MdRemoveCircle size={16} className="text-rose-600" />
              <span>Cancel Proposal</span>
            </div>
          )
        });
      }
    }

    if (element?.status === 'Approved') {
      items.push({
        key: 'approved',
        label: (
          <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
            <BiCheckCircle size={16} />
            <span>Approved</span>
          </div>
        )
      });

      items.push({
        key: 'view',
        label: (
          <div className="flex items-center gap-2" onClick={() => {
            Swal.fire({
              title: 'Approval Details',
              html: `
              <div>
                <p><strong>Client Name:</strong> ${element?.name}</p>
                <p><strong>Remarks:</strong> ${element?.remark}</p>
                <p><strong>Final Amount:</strong> ${element?.finalizedAmount}</p>
                <div>
                  <strong>Attachments:</strong>
                  <ul>
                    ${element?.attachments?.length > 0 ? element.attachments.map((a) =>
                `<li><a href="${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${a}" target="_blank">${a}</a></li>`
              ).join('') : 'No Attachment Found'}
                  </ul>
                </div>
              </div>
            `,
              confirmButtonText: 'Close',
              confirmButtonColor: '#3085d6',
            });
          }}>
            <FaEye size={16} className="text-[#3c8dbc]" />
            <span>View Approval</span>
          </div>
        )
      });

      items.push(...['delete', 'email'].map(key => ({
        key,
        label: (
          <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
            {key === 'delete'
              ? <RiDeleteBin5Line size={16} />
              : <MdEmail size={16} />}
            <span>{key === 'delete' ? 'Delete' : 'Send Email'}</span>
          </div>
        )
      })));

      items.push({
        key: 'client',
        label: (
          <div className="flex items-center gap-2" onClick={() => navigate(`/admin/client/edit/${encrypt(element?.clientData?._id)}`)}>
            <BiUserCircle size={16} className="text-cyan-600" />
            <span>View Client</span>
          </div>
        )
      });
    }

    if (element?.status === 'Cancelled') {
      ['approve', 'edit', 'delete', 'email'].forEach(key => {
        items.push({
          key,
          label: (
            <div className="flex items-center gap-2 text-gray-600 cursor-not-allowed">
              {{
                approve: <BiCheckCircle size={16} />,
                edit: <FaPenToSquare size={16} />,
                delete: <RiDeleteBin5Line size={16} />,
                email: <MdEmail size={16} />
              }[key]}
              <span>{{
                approve: 'Approved',
                edit: 'Edit Proposal',
                delete: 'Delete',
                email: 'Send Email'
              }[key]}</span>
            </div>
          )
        });
      });

      items.push({
        key: 'client',
        label: (
          <div className="flex items-center gap-2 text-gray-600">
            <BiUserCircle size={16} />
            <span>View Client</span>
          </div>
        )
      });
    }

    return items;
  };
  if (userInfoglobal?.userType !== "employee") {
    return (
      <GlobalLayout>
        <div className="bg-red-100 text-red-800 p-4 rounded-md mt-2">
          <p className="text-center font-semibold">
            You are not an employee. This page is viewable for employees only.
          </p>
        </div>
      </GlobalLayout>
    )
  }
  return (
    <GlobalLayout onChange={onChange}>

      {statusModal?.isOpen && (
        <Modal className="antmodalclassName" open={statusModal?.isOpen} footer={null} onCancel={() => handleStatusModalClose()}>
          <div>
            <label className={`${inputLabelClassName}`}>
              Remark <span className="text-red-600">*</span>
            </label>
            <textarea
              id="remark"
              value={remark}
              onChange={handleRemarkChange}
              className={`mt-1 block w-full px-2 py-[12px] min-h-[150px] shadow-sm rounded-xl text-sm bg-gray-50 outline-1 outline-black !border !border-gray-900`}
              placeholder="Enter your remark here"
              required
            />
            {remarkError && <p className="text-red-500 text-sm mt-1">{remarkError}</p>} {/* Error message for remark */}
          </div>

          <div className="mt-4">
            <label className={`${inputLabelClassName}`}>
              Finalize Amount: <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              id="finalizeAmount"
              value={finalizeAmount}
              onChange={handleAmountChange}
              className={`mt-1 block w-full px-2 py-[12px] shadow-sm rounded-xl text-sm bg-gray-50 outline-1 outline-black !border !border-gray-900`}
              placeholder="Enter amount"
              required
            />
            {amountError && <p className="text-red-500 text-sm mt-1">{amountError}</p>} {/* Error message for amount */}
          </div>

          <div className="pt-4 mt-6">
            <div className="font-medium mb-2">Attachments:</div>
            {!isPreview ? (
              <div className="space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white cursor-pointer"
                >
                  <FaRegFile className="mr-2" /> Add Attachments
                </label>

                <div className="space-y-2">
                  {attachment?.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <a
                        href={`${process.env.REACT_APP_BACKEND_DOMAIN_NAME}/public/${file}`}
                        className="flex items-center space-x-2"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaRegFile className="text-gray-500" />
                        <span className="text-sm text-gray-600">{file}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2"></div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-header text-white p-2 px-4 rounded mt-4"
            >
              {loading ? (
                <Spin indicator={<LoadingOutlined spin />} size="small" style={{ color: 'white' }} />
              ) : (
                'Submit'
              )}
            </button>
          </div>

        </Modal>
      )}

      <SendProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        onSubmit={handleProposalEmail}
        proposalData={proposalId}
        setProposalId={setProposalId}
      />

      <section>
        <div className="xl:flex justify-between items-center xl:space-y-0 space-y-2 py-1">
          <div className="grid md:flex sm:grid-cols-3 grid-cols-1 flex-wrap md:gap-3 gap-1.5">
            {userInfoglobal?.userType === "admin" &&
              <div className="">
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
                      {companyList?.map((type) => (
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
              </div>}
            {(userInfoglobal?.userType === "admin" || userInfoglobal?.userType === "company" || userInfoglobal?.userType === "companyDirector") &&
              <div className="">
                <Controller
                  control={control}
                  name="PDBranchId"
                  rules={{ required: "Branch is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      defaultValue={""}
                      disabled={loading}
                      className={`${inputAntdSelectClassNameFilter} `}
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

              </div>}
            <div className="">
              <Controller
                control={control}
                name="status"
                rules={{ required: "Status is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    defaultValue={""}
                    disabled={loading}
                    className={`${inputAntdSelectClassNameFilter} `}
                    showSearch
                    filterOption={(input, option) =>
                      String(option?.children).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    <Select.Option value="">Select Status</Select.Option>
                    <Select.Option value="Pending">Pending</Select.Option>
                    <Select.Option value="Approved">Approved</Select.Option>
                    <Select.Option value="Cancelled">Cancel</Select.Option>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-end gap-2">
            <button
              onClick={() => {
                setValue("PDBranchId", '')
                setValue("PDCompanyId", "")
                setValue("status", "")
              }}
              className="bg-header   py-[6px]  rounded-md  flex px-5 justify-center items-center  text-white">
              <span className="text-[12px]">Reset</span>
            </button>
            {canCreate &&
              <Tooltip placement="topLeft"  title='Add Proposal'>
                <button
                  onClick={() => {
                    navigate("/admin/proposal/create");
                  }}
                  className="bg-header px-2 py-1.5 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px]">Add Proposal</span>
                </button>
              </Tooltip>
            }
          </div>
        </div>
        <div className="bg-[#ffffff] w-full overflow-x-auto mt-1 rounded-xl">
          {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
            <thead className=''>
              <tr className='border-b-[1px] border-[#DDDDDD] capitalize bg-header text-white font-[500] h-[40px]'>
                <th className='tableHead w-[10%]'>
                  S.No.
                </th>
                <th className='tableHead w-[15%]'>
                  Name
                </th>
                <th className='tableHead'>
                  Email
                </th>
                <th className='tableHead'>
                  Mobile Number
                </th>
                <th className='tableHead'>
                 Proposal Amount
                </th>
                <th className='tableHead'>
                  Remarks
                </th>
                <th className='tableHead'>
                  Finalize Remark
                </th>
                <th className='tableHead'>
                  Finalize Amount
                </th>
                
                <th className='tableHead'>
                  Updated By
                </th>
                <th className='tableHead'>
                  Updated At
                </th>
                <th className='tableHead'>
                  Status
                </th>
                {(canCreate || canDelete || canUpdate) && <th className='tableHead w-[10%]'>
                  Action
                </th>}
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
                {proposalList && proposalList?.length > 0 ?
                  proposalList?.map((element, index) => (
                    <tr className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? 'bg-[#e9ecef]/80' : 'bg-white'} text-[#374151]`}>
                      <td className='tableData '>
                        {index + 1 + ((currentPage - 1) * limit)}
                      </td>
                      <td className='tableData '>{element?.name ?? "-"}</td>
                      <td className='tableData '>{element?.email ?? "-"}</td>
                      <td className='tableData '>{element?.mobile?.code + element?.mobile?.number}</td>
                      <td className='tableData '>{element?.fee ?? "-"}</td>
                      <td className='tableData '>{element?.description ?? "-"}</td>
                      <td className='tableData '>{element?.remark ?? "-"}</td>
                      <td className='tableData '>{element?.finalizedAmount ?? "-"}</td>
                      <td className='tableData '>{element?.updatedBy ?? "-"}</td>
                      <td className='tableData '>{moment(element?.updatedAt).format("DD-MM-YYYY hh:mm a") ?? "-"}</td>
                      <td className='tableData '>
                        <span
                          className={`${element?.status === "Approved"
                            ? "bg-[#E0FFBE] border-green-500"
                            : element?.status === "Pending" ? "bg-gray-500 border-gray-500 text-white" : "bg-red-200 border-red-500"
                            } border-[1px] px-2 py-1.5 rounded-lg text-black text-[12px]`}
                        >
                          {element?.status}
                        </span>
                      </td>
                      {(canCreate || canDelete || canUpdate) &&
                        <td className='tableData'>

                          <Dropdown
                            trigger={['click']}
                            menu={{ items: getMenuItems(element) }}
                            placement="bottomLeft"
                          >
                            <Tooltip placement="topLeft"  title="More Actions">
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
                        </td>
                      }
                    </tr>
                  ))
                  : (<tr className="bg-white bg-opacity-5 " >
                    <td colSpan={5} className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500">Record Not Found</td>
                  </tr>)}
              </tbody>}
          </table>}
        </div>
        {proposalList?.length > 0 && (
          <CustomPagination
            totalCount={totalProposalCount}
            pageSize={limit}
            currentPage={currentPage}
            onChange={onPaginationChange}
          />)}
      </section>

    </GlobalLayout>
  )
}
export default ProposalListEmployee;