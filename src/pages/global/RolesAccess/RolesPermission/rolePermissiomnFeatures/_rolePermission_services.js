import { apiCall } from "../../../../../config/Http";


async function getRolesPermissionList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `company/department/role/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function RolesPermissionSearch(data) {
  try {
    const response = await apiCall("POST", "company/department/role/list", data);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function getPermissionsDetails(data) {
  try {
    const response = await apiCall("POST", "company/department/role/detail", data);
    return response;
  } catch (error) {
    console.error("GST Type:", error);
    return Promise.reject(error);
  }
}

async function createRolePermission(data) {
  try {
    const response = await apiCall("POST", "company/department/role/create", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function updateRolesAndPermissions(data) {
  try {
    const response = await apiCall("POST", "company/department/role/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function deleteRolesAndPermissions(data) {
  try {
    const response = await apiCall("POST", "company/department/role/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function getPageRole(data) {
  try {
    const response = await apiCall("POST", "pageRole", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

export const rolePermissionServices = {
  getRolesPermissionList,
  getPermissionsDetails,
  createRolePermission,
  updateRolesAndPermissions,
  deleteRolesAndPermissions,
  RolesPermissionSearch,
  getPageRole
};