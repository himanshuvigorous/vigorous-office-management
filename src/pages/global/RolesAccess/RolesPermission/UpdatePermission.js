import React, { useEffect, useState, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  dynamicSidebarSearch,
  getsidebarById,
} from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { companySearch } from "../../../company/companyManagement/companyFeatures/_company_reducers";
import { directorSearch } from "../../../Director/director/DirectorFeatures/_director_reducers";
import { branchSearch } from "../../../branch/branchManagement/branchFeatures/_branch_reducers";
import { deptSearch } from "../../../department/departmentFeatures/_department_reducers";
import { designationSearch } from "../../../designation/designationFeatures/_designation_reducers";
import {
  inputClassName,
  inputLabelClassName,
  domainName,
  transformDataRole,
  inputDisabledClassName,
} from "../../../../constents/global";
import {
  createRolePermission,
  getDesignationDetails,
  getPermissionsDetails,
  updateRolesAndPermissions,
} from "./rolePermissiomnFeatures/_rolePermission_reducers";
import getUserIds from "../../../../constents/getUserIds";
import { Button, Checkbox, Table } from "antd";
import GlobalLayout from "../../../../global_layouts/GlobalLayout/GlobalLayout";
import { decrypt } from "../../../../config/Encryption";
import ListLoader from "../../../../global_layouts/ListLoader";

function UpdatePermission() {
  const {
    register,
    handleSubmit,
    setValue,
    getValue,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkAll, setCheckAll] = useState(false);
  const { permissionIdEnc } = useParams();
  const permissionId = decrypt(permissionIdEnc);
  const { companyList } = useSelector((state) => state.company);
  const [permissionsState, setPermissionsState] = useState([]);
  const [permissionsStateView, setPermissionsStateView] = useState([]);
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);
  const { sidebarViewData } = useSelector((state) => state.dynamicSidebar);
  const { roleAccessDetails } = useSelector((state) => state.rolePermission);
  const { loading } = useSelector((state) => state.rolePermission);


  const {
    userCompanyId,

    userBranchId,
    userEmployeId,
    userDepartmentId,

    userType,
  } = getUserIds();
  const companyId = useWatch({
    control,
    name: "companyId",
    defaultValue: userCompanyId,
  });

  const branchId = useWatch({
    control,
    name: "branchId",
    defaultValue: userBranchId,
  });
  const departmentId = useWatch({
    control,
    name: "departmentId",
    defaultValue: userDepartmentId,
  });
  const designationName = useWatch({
    control,
    name: "designationName",

  });
  const userInfoglobal = JSON.parse(
    localStorage.getItem(`user_info_${domainName}`)
  );

  useEffect(() => {
    dispatch(
      dynamicSidebarSearch({
        isPagination: false,
      })
    );
    dispatch(
      getPermissionsDetails({
        _id: permissionId,
      })
    );
  }, []);
  useEffect(() => {
    if (sidebarListData && roleAccessDetails) {
      const allowedPermissions = roleAccessDetails?.permissions;

      const updatedPermissions = sidebarListData?.map((sidebarItem) => {
        const data = allowedPermissions?.find(
          (perm) => perm?.pageId === sidebarItem?._id
        );

        return {
          ...sidebarItem,
          canCreate: data?.canCreate,
          canRead: data?.canRead,
          canUpdate: data?.canUpdate,
          canDelete: data?.canDelete,
        };
      });

      setPermissionsState(updatedPermissions);
    }
  }, [sidebarListData, roleAccessDetails]);

  const handleCheckAll = (e) => {
    setCheckAll(e.target.checked);
  };
  useEffect(() => {
    if (checkAll) {
      const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
        ...sidebarItem,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      }));
      setPermissionsState(updatedPermissions);
    } else {
      const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
        ...sidebarItem,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
      }));
      setPermissionsState(updatedPermissions);
    }
  }, [checkAll]);

  const onSubmit = (data) => {
    const permission = permissionsState
      ?.map((permissionData) => {
        if (
          permissionData?.canCreate ||
          permissionData?.canRead ||
          permissionData?.canUpdate ||
          permissionData?.canDelete
        ) {
          return {
            pageId: permissionData?._id,
            canCreate: permissionData?.canCreate,
            canRead: permissionData?.canRead,
            canUpdate: permissionData?.canUpdate,
            canDelete: permissionData?.canDelete,
          };
        }
        return null;
      })
      .filter(Boolean);

    const finalPayload = {
      _id: roleAccessDetails?._id,
      companyId: roleAccessDetails?.companyId,
      directorId: roleAccessDetails?.directorId,
      branchId: roleAccessDetails?.branchId,
      departmentId: roleAccessDetails?.departmentId,
      designationId: roleAccessDetails?.designationId,
      designationName: designationName,
      permissions: permission,

    };
    dispatch(updateRolesAndPermissions(finalPayload)).then((response) => {
      if (!response.error) {
        navigate(-1);
        // getRolesPermissionList();
        // closeModal();
      }
    });
  };

  const handleSelectCompany = useCallback(
    (event) => {
      const companyId = event.target.value;
      setValue("companyId", companyId);
      const companyName = companyList?.docs?.find(
        (company) => company._id === companyId
      )?.name;
      setValue("companyName", companyName);
      setValue("stateId", "");
      setValue("stateName", "");
      // Dispatch state search if needed
      // dispatch(stateSearch({ companyId }));
    },
    [companyList, setValue]
  );


  useEffect(() => {
    setValue('designationName', roleAccessDetails?.designationName)
  }, [roleAccessDetails])

  const handlePermissionToggle = (pageId, permissionType) => {
    const parent = permissionsState?.find(
      (item) => item._id === pageId
    )?.parentPageId;
    if (parent) {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === parent
            ? {
              ...item,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
            : item
        )
      );
    }
    const firstparent = permissionsState?.find(
      (item) => item._id === parent
    )?.parentPageId;
    if (firstparent) {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === firstparent
            ? {
              ...item,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
            : item
        )
      );
    }
    setPermissionsState((prevState) =>
      prevState.map((item) =>
        item._id === pageId
          ? { ...item, [permissionType]: !item[permissionType] }
          : item
      )
    );
  };
  const handlePermissionToggleRow = (e, pageId) => {
    const parent = permissionsState?.find(
      (item) => item._id === pageId
    )?.parentPageId;
    if (parent) {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === parent
            ? {
              ...item,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
            : item
        )
      );
    }
    const firstparent = permissionsState?.find(
      (item) => item._id === parent
    )?.parentPageId;
    if (firstparent) {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === firstparent
            ? {
              ...item,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
            : item
        )
      );
    }
    if (e.target.checked) {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === pageId
            ? {
              ...item,
              canCreate: true,
              canRead: true,
              canUpdate: true,
              canDelete: true,
            }
            : item
        )
      );
    } else {
      setPermissionsState((prevState) =>
        prevState.map((item) =>
          item._id === pageId
            ? {
              ...item,
              canCreate: false,
              canRead: false,
              canUpdate: false,
              canDelete: false,
            }
            : item
        )
      );
    }
  };

  useEffect(() => {
    if (checkAll) {
      const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
        ...sidebarItem,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      }));
      setPermissionsState(updatedPermissions);
    } else {
      const updatedPermissions = sidebarListData?.map((sidebarItem) => ({
        ...sidebarItem,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
      }));
      setPermissionsState(updatedPermissions);
    }
  }, [checkAll]);

  const getButtonClassName = (id, button) => {
    const isActive =
      button && permissionsState?.find((item) => item._id === id)
        ? permissionsState?.find((item) => item._id === id)[button]
        : false;
    return `px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${isActive
        ? "bg-header text-white border-header"
        : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
      }`;
  };
  useEffect(() => {
    setPermissionsStateView(transformDataRole(sidebarViewData));
  }, [sidebarViewData]);
  const getPermission = (id, button) => {
    return permissionsState?.find((item) => item._id === id)?.[button];
  };
  const columns = [
    {
      title: "title",
      dataIndex: "title",
      width: 300,
      key: "_id",
      render: (text, permission) => <div className="text-nowrap">{text}</div>,
    },
    {
      title: (
        <div>
          <Checkbox onClick={(e) => handleCheckAll(e)} />
        </div>
      ),
      key: "_id",
      width: 100,
      render: (text, permission) => (
        <div>
          <Checkbox
            onClick={(e) => handlePermissionToggleRow(e, permission._id)}
            checked={
              getPermission(permission._id, "canRead") &&
              getPermission(permission._id, "canCreate") &&
              getPermission(permission._id, "canUpdate") &&
              getPermission(permission._id, "canDelete")
            }
          />
        </div>
      ),
    },
    {
      title: <div>{"Actions"}</div>,
      key: "_id",
      render: (text, permission) => (
        <div className="flex items-center flex-nowrap gap-2">
          {["canRead", "canCreate", "canUpdate", "canDelete"].map((button) => (
            <Button
              className={getButtonClassName(permission._id, button)}
              key={button}
              type="button"
              onClick={(e) => handlePermissionToggle(permission._id, button)}
              style={{ margin: "0 5px" }}
            >
              {button}
            </Button>
          ))}
        </div>
      ),
    },
  ];

  return (
    <GlobalLayout>
      <div className="">

        <div className="grid gap-2 lg:grid-cols-3 md:grid-cols-2">
          <input
            className={`${inputDisabledClassName} `}
            value={roleAccessDetails?.branchName}
            readOnly
          />
          <input
            {...register('designationName')}
            className={inputClassName}
          />

        </div>


        <Table
          columns={columns}
          pagination={false}
          dataSource={permissionsStateView}
          scroll={{
            y: 90 * 5,
            x: true,
          }}
          rowKey="_id"
        />

        {/* <div className="pt-2 text-gray-700">
                    {permissionsState?.map((permission) => (
                        <div
                            key={permission._id}
                            className="flex lg:justify-between lg:items-center lg:flex-row flex-col justify-center items-start gap-2 border-b p-2"
                        >
                            <div>
                                <span className="capitalize font-medium text-sm">
                                    {permission?.name}
                                </span>
                            </div>

                            <div className="flex justify-between gap-1 w-full lg:w-auto">
                                {["canRead", "canCreate", "canUpdate", "canDelete"].map(
                                    (permissionType) => (
                                        <div key={permissionType}>
                                            <button
                                                className={getButtonClassName(
                                                    permission[permissionType]
                                                )}
                                                onClick={(e) =>
                                                    handlePermissionToggle(
                                                        e,
                                                        permission._id,
                                                        permissionType
                                                    )
                                                }
                                            >
                                                {permission[permissionType]
                                                    ? `✔ ${permissionType.replace("can", "")}`
                                                    : permissionType.replace("can", "")}
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    ))}
                </div> */}
        <div className="flex justify-end my-2 mx-2">
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="bg-header text-white py-1.5 px-3 text-nowrap text-sm rounded "
          >
            {loading ? <ListLoader /> : 'save'}
          </button>
        </div>
      </div>
    </GlobalLayout>
  );
}

export default UpdatePermission;
