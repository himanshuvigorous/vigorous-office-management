import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dynamicSidebarSearch, getsidebarList } from "../../../DyanmicSidebar/DyanmicSidebarFeatures/_dyanmicSidebar_reducers";
import { updateRolesAndPermissions } from "./rolePermissiomnFeatures/_rolePermission_reducers";

function PermissionsModal({ closeModal, fullData ,getRolesPermissionList }) {
  const data = fullData?.permissions
  const dispatch = useDispatch();
  const { sidebarListData } = useSelector((state) => state.dynamicSidebar);

  const [permissionsState, setPermissionsState] = useState([]);


  useEffect(() => {

    dispatch(dynamicSidebarSearch({
      isPagination: false
    }));
  }, []);

  useEffect(() => {
    if (sidebarListData?.length > 0) {
      const updatedPermissions = sidebarListData.map((sidebarItem) => {
        const permission = data
          ? data?.find((perm) => perm?.pageId === sidebarItem?._id)
          : null;
        return {
          ...sidebarItem,
          canCreate: permission?.canCreate ?? false,
          canRead: permission?.canRead ?? false,
          canUpdate: permission?.canUpdate ?? false,
          canDelete: permission?.canDelete ?? false,
        };
      });
      setPermissionsState(updatedPermissions);
    }
  }, [sidebarListData, data]);

  const handlePermissionToggle = (e,pageId, permissionType) => {
    e.preventDefault()
    setPermissionsState((prevState) => {
      return prevState.map((item) => {
        if (item._id === pageId) {
          return {
            ...item,
            [permissionType]: !item[permissionType],
          };
        }
        return item;
      });
    });
  };

  const closeModalWithAnimation = () => {

    setTimeout(() => {
      closeModal();
    }, 300); // Wait for animation to finish before closing modal
  };

  const onSubmit = () => {
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
      _id : fullData?._id,
      companyId: fullData?.companyId      ,
      directorId: fullData?.directorId,
      branchId: fullData?.branchId,
      departmentId: fullData?.departmentId,
      designationId: fullData?.designationId,
      permissions: permission,
      designationName: fullData?.designationName,
    };
    dispatch(updateRolesAndPermissions(finalPayload)).then((response) => {
      if (!response.error) {
        getRolesPermissionList()
        closeModal()
      };
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-black bg-opacity-50 flex justify-center items-center transition-all `}
      onClick={closeModalWithAnimation}
    >
      <div
        className={`bg-white   rounded-lg w-full max-w-3xl  transition-all transform mx-2 pb-2`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center rounded-lg bg-header px-2 py-3 ">
          <div className="text-lg  text-white">Edit Role</div>
          <button
            onClick={closeModalWithAnimation}
            className="text-white text-3xl hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="pt-2 text-gray-700 max-h-[60vh] overflow-auto">
          {permissionsState?.map((permission, index) => (
            <div
              key={index}
              className="flex lg:justify-between lg:items-center lg:flex-row flex-col justify-center items-start gap-2 border-b p-2"
            >
              <div>
                <span className="capitalize font-medium text-sm">
                  {permission?.name}
                </span>
              </div>

              <div className="flex justify-between gap-1 w-full lg:w-auto">
                <div>
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${
                      permission?.canRead
                        ? "bg-header text-white border-header"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
                    }`}
                    onClick={(e) => handlePermissionToggle(e,permission._id, "canRead")}
                  >
                    {permission?.canRead ? "✔ Read" : "Read"}
                  </button>
                </div>

                <div>
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${
                      permission?.canCreate
                        ? "bg-header text-white border-header"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
                    }`}
                    onClick={(e) => handlePermissionToggle(e,permission._id, "canCreate")}
                  >
                    {permission?.canCreate ? "✔ Write" : "Write"}
                  </button>
                </div>

                <div>
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${
                      permission?.canUpdate
                        ? "bg-header text-white border-header"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
                    }`}
                    onClick={(e) => handlePermissionToggle(e,permission._id, "canUpdate")}
                  >
                    {permission?.canUpdate ? "✔ Update" : "Update"}
                  </button>
                </div>

                <div>
                  <button
                    className={`px-3 sm:px-4 py-2 rounded-md text-[9px] sm:text-sm text-nowrap font-medium transition-all duration-300 ${
                      permission?.canDelete
                        ? "bg-header text-white border-header"
                        : "bg-gray-200 text-gray-700 border-gray-300 hover:border-header border-2 hover:text-header"
                    }`}
                    onClick={(e) => handlePermissionToggle(e,permission._id, "canDelete")}
                  >
                    {permission?.canDelete ? "✔ Delete" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
           <div className="flex text-sm justify-end gap-4 mt-3 px-3 py-2">
          <button
            onClick={onSubmit}
            className="py-2 px-2 font-semibold text-header hover:bg-header border-header border-2 hover:text-white rounded"
          >
            save
          </button>
          <button
            onClick={closeModalWithAnimation}
            className="py-2 px-2 font-semibold text-header hover:bg-header border-header border-2 hover:text-white rounded"
          >
            Close
          </button>
        </div>
        </div>

       
      </div>
    </div>
  );
}

export default PermissionsModal;
