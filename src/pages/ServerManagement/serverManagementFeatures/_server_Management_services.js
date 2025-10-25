import { apiCall } from "../../../config/Http";



async function getServerManagementList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `project/server/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/server/list`);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  }
}

async function ServerManagementSearch(data) {

  try {
    const response = await apiCall("POST", "project/server/list", data);
    return response;
  } catch (error) {
    console.error("Client Service List:", error);
    return Promise.reject(error);
  }
}
async function getServerManagementDetails(data) {

  try {
    const response = await apiCall("POST", "project/server/detail", data);
    return response;
  } catch (error) {
    console.error("Client Service:", error);
    return Promise.reject(error);
  }
}
async function createServerManagement(data) {

  try {
    const response = await apiCall("POST", "project/server/create", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function updateServerManagement(data) {

  try {
    const response = await apiCall("POST", "project/server/update", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function deleteServerManagement(data) {

  try {
    const response = await apiCall("POST", "project/server/delete", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}

export const ServerManagementService = {
  getServerManagementList,
  getServerManagementDetails,
  createServerManagement,
  updateServerManagement,
  deleteServerManagement,
  ServerManagementSearch
};