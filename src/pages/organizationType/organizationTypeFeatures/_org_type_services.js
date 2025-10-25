import { apiCall } from "../../../config/Http";

async function getOrgTypeList(data) {

  try {
    const { page, limit } = data
    const response = await apiCall("POST", `company/type/list?page=${page}&limit=${limit}`, data);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function orgTypeSearch(data) {

  try {
    const response = await apiCall("POST", "company/type/list", data);
    return response;
  } catch (error) {
    console.error("GST Type List:", error);
    return Promise.reject(error);
  }
}

async function getOrgTypeDetails(data) {

  try {
    const response = await apiCall("POST", "company/type/detail", data);
    return response;
  } catch (error) {
    console.error("GST Type:", error);
    return Promise.reject(error);
  }
}
async function createOrgType(data) {

  try {
    const response = await apiCall("POST", "company/type/create", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function updateOrgType(data) {

  try {
    const response = await apiCall("POST", "company/type/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteOrgType(data) {

  try {
    const response = await apiCall("POST", "company/type/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

export const orgTypeServices = {
  getOrgTypeList,
  getOrgTypeDetails,
  createOrgType,
  updateOrgType,
  deleteOrgType,
  orgTypeSearch,
};