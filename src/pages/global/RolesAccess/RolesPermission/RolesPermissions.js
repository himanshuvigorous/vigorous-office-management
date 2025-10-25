import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaPenToSquare, FaPlus, FaAngleDown } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import { HiOutlineFilter } from "react-icons/hi";
import {
  deleteRolesAndPermissions,
  getRolesPermissionList,
} from "./rolePermissiomnFeatures/_rolePermission_reducers";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import PermissionsModal from "./PermissionsModal";
import CreatePermissionsModal from "./CreatePermissionsModal";
import { domainName, inputAntdSelectClassNameFilter } from "../../../../constents/global";
import { Select, Tooltip } from "antd";
import usePermissions from "../../../../config/usePermissions";
import { encrypt } from "../../../../config/Encryption";
import Loader2 from "../../../../global_layouts/Loader/Loader2";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";

function RolesPermissions() {
  const { register, setValue, control, formState: { errors }, } = useForm();
  const { canCreate, canRead, canUpdate, canDelete } = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState({
    status: false,
    data: null,
  });
  const { departmentListData } = useSelector((state) => state.department);
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { rolesPermissionList, loading } = useSelector((state) => state.rolePermission);

  const CompanyId = useWatch({
    control,
    name: "PDCompanyId",
    defaultValue: "",
  });
  const departmentId = useWatch({
    control,
    name: "PdDepartmentId",
    defaultValue: "",
  });

  const rolepermissionListFunc = () => {
    const reqListData = {
      limit: 20,
      page: 1,

      reqPayload: {
        "text": "",
        "sort": "",
        "status": "",
        "isPagination": false,
       
        companyId:
          userInfoglobal?.userType === "company"
            ? userInfoglobal?._id
            : userInfoglobal?.companyId,
        branchId:
          userInfoglobal?.userType === "companyBranch"
            ? userInfoglobal?._id
            : userInfoglobal?.branchId,
      },
    };
    dispatch(getRolesPermissionList(reqListData));
  };

  useEffect(() => {
    rolepermissionListFunc();
  }, []);

  useEffect(() => {
    dispatch(
      deptSearch({
        departmentId: departmentId,
        companyId: CompanyId,
        text: "",
        sort: true,
        status: true,
        isPagination: false,
      })
    );
  }, []);

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
        dispatch(deleteRolesAndPermissions(reqData)).then((data) => {
          !data.error && rolepermissionListFunc();
        });
      }
    });
  };

  const closePermissionModal = () => {
    setShowCreateModal(false);
    rolepermissionListFunc();
  };

  const onChange = (e) => {
    
    setSearchText(e);
  };


  return (
    <GlobalLayout onChange={onChange}>
      {showModal?.status && (
        <PermissionsModal
          closeModal={() =>
            setShowModal({
              status: false,
              data: null,
            })
          }
          fullData={showModal?.data}
          getRolesPermissionList={rolepermissionListFunc}
        />
      )}
      {showCreateModal && (
        <CreatePermissionsModal
          closeModal={closePermissionModal}
          getRolesPermissionList={rolepermissionListFunc}
        />
      )}
      <div className="">
        <div className="sm:flex justify-between items-center md:space-y-0 space-y-2 py-1">
          <div className="grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-2 sm:gap-3 gap-1">
           
          </div>

          <div className="flex justify-end items-center gap-2 ">
            

            {canCreate &&
              <Tooltip placement="topLeft"  title='Role and Permissions'>
                <button
                  onClick={() => {
                  
                    navigate("/admin/roles-permission/create");
                  }}
                  className="bg-header p-2 rounded-md flex justify-center items-center space-x-2 text-white"
                >
                  <FaPlus />
                  <span className="text-[12px] tracking-wide">
                    Add Role and Permissions
                  </span>
                </button>
              </Tooltip>}
          </div>
        </div>
      </div>
      <div className="bg-[#ffffff]  w-full overflow-x-auto mt-1 rounded-xl">
        {canRead && <table className="w-full max-w-full rounded-xl overflow-x-auto ">
          <thead className="">
            <tr className="border-b-[1px] border-[#DDDDDD] capitalize text-[12px] bg-header text-white font-[500] h-[40px]">
              <th className="border-none p-2 whitespace-nowrap w-[10%]">
                S.no.
              </th>
              <th className="border-none p-2 whitespace-nowrap w-[20%]">
                Name
              </th>
              
              <th className="border-none p-2 whitespace-nowrap w-[20%]">
                Created At
              </th>
              <th className="border-none p-2 whitespace-nowrap w-[20%]">
                Created By
              </th>
          
              {(canUpdate || canDelete) && <th className="border-none p-2 whitespace-nowrap w-[10%]">
                Action
              </th>}
            </tr>
          </thead>
          {
            loading ?
              <tr className="bg-white bg-opacity-5 ">
                <td
                  colSpan={10}
                  className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                >
                  <Loader2 />
                </td>
              </tr> :

              <tbody>
                {rolesPermissionList && rolesPermissionList?.docs?.length > 0 ? (
                  rolesPermissionList?.docs?.map((element, index) => (
                    <tr
                      className={`border-b-[1px] border-[#DDDDDD] ${index % 2 === 0 ? "bg-[#e9ecef]/80" : "bg-white"
                        } text-[#374151] text-[14px]`}
                    >
                      <td className="whitespace-nowrap border-none p-2 ">
                        {index + 1}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {element?.designationName ?? "-"}
                      </td>
                     
                      <td className="whitespace-nowrap border-none p-2 ">
                        {dayjs(element?.createdAt).format('DD-MM-YYYY hh:mm a') ?? "-"}
                      </td>
                      <td className="whitespace-nowrap border-none p-2 ">
                        {element?.createdBy ?? "-"}
                      </td>
                    
                      {(canUpdate || canDelete) && <td className="whitespace-nowrap border-none p-2">
                        <span className="py-1.5 flex justify-start items-center space-x-2">
                          {canUpdate && <Tooltip placement="topLeft"  title='Edit'>
                            <button
                              onClick={() =>
                              
                                navigate(`/admin/roles-permission/edit/${encrypt(element?._id)}`)
                              }
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
                      </td>}
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white bg-opacity-5 ">
                    <td
                      colSpan={4}
                      className="px-6 py-2 whitespace-nowrap font-[600] text-sm text-gray-500"
                    >
                      Record Not Found
                    </td>
                  </tr>
                )}
              </tbody>}
        </table>}
      </div>
    </GlobalLayout>
  );
}
export default RolesPermissions;
