import { apiCall } from "../../../../config/Http";


async function getClientGroupList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/client/groupType/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Client Group List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/client/groupType/list`);
      return response;
    } catch (error) {
      console.error("Client Group List:", error);
      return Promise.reject(error);
    }
  }
}

async function clientGrpSearch(data) {

  try {
    const response = await apiCall("POST", "master/client/groupType/list", data);
    return response;
  } catch (error) {
    console.error("Client Group List:", error);
    return Promise.reject(error);
  }
}
async function getClientGrpDetails(data) {

  try {
    const response = await apiCall("POST", "master/client/groupType/detail", data);
    return response;
  } catch (error) {
    console.error("Client Group:", error);
    return Promise.reject(error);
  }
}
async function createClientGroup(data) {

  try {
    const response = await apiCall("POST", "master/client/groupType/create", data);
    return response;
  } catch (error) {
    console.error("Client Group error:", error);
    return Promise.reject(error);
  }
}
async function updateClientGroup(data) {

  try {
    const response = await apiCall("POST", "master/client/groupType/update", data);
    return response;
  } catch (error) {
    console.error("Client Group error:", error);
    return Promise.reject(error);
  }
}
async function deleteClientGrp(data) {

  try {
    const response = await apiCall("POST", "master/client/groupType/delete", data);
    return response;
  } catch (error) {
    console.error("Client Group error:", error);
    return Promise.reject(error);
  }
}

export const clientGroupServices = {
  getClientGroupList,
  getClientGrpDetails,
  createClientGroup,
  updateClientGroup,
  deleteClientGrp,
  clientGrpSearch,
};