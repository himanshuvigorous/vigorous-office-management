import { apiCall } from "../../../config/Http";

async function getDesignationList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `master/department/post/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function designationSearch(data) {
  try {
    const response = await apiCall("POST", "master/department/post/list", data);
    return response;
  } catch (error) {
    console.error("desgination Type List:", error);
    return Promise.reject(error);
  }
}

async function getDesignationDetails(data) {
  try {
    const response = await apiCall("POST", "master/department/post/detail", data);
    return response;
  } catch (error) {
    console.error("GST Type:", error);
    return Promise.reject(error);
  }
}

async function createDesignation(data) {
  try {
    const response = await apiCall("POST", "master/department/post/create", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function updateDesignation(data) {
  try {
    const response = await apiCall("POST", "master/department/post/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function deleteDesignation(data) {
  try {
    const response = await apiCall("POST", "master/department/post/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function getDesignationRole(data) {
  try {
    const response = await apiCall("POST", "master/department/post/designationroles", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

export const designationServices = {
  getDesignationList,
  getDesignationDetails,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  designationSearch,
  getDesignationRole
};