import { apiCall } from "../../../../config/Http";


async function getClientServiceList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/client/service/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/client/service/list`);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  }
}

async function clientServiceSearch(data) {

  try {
    const response = await apiCall("POST", "master/client/service/list", data);
    return response;
  } catch (error) {
    console.error("Client Service List:", error);
    return Promise.reject(error);
  }
}
async function getClientServiceDetails(data) {

  try {
    const response = await apiCall("POST", "master/client/service/detail", data);
    return response;
  } catch (error) {
    console.error("Client Service:", error);
    return Promise.reject(error);
  }
}
async function createClientService(data) {

  try {
    const response = await apiCall("POST", "master/client/service/create", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function updateClientService(data) {

  try {
    const response = await apiCall("POST", "master/client/service/update", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function deleteClientService(data) {

  try {
    const response = await apiCall("POST", "master/client/service/delete", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}

export const clientServeServices = {
  getClientServiceList,
  getClientServiceDetails,
  createClientService,
  updateClientService,
  deleteClientService,
  clientServiceSearch
};