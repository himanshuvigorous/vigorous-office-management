import { apiCall } from "../../../../../config/Http";


async function getpenaltyTypeList(data) {

  if (data) {
    const { currentPage, pageSize, reqData } = data
    try {
      const response = await apiCall("POST", `master/others/penaltyName/list?page=${currentPage}&limit=${pageSize}`, reqData);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/penaltyName/list`);
      return response;
    } catch (error) {
      console.error("Work Type List:", error);
      return Promise.reject(error);
    }
  }
}
async function penaltyTypeSearch(data) {

  try {
    const response = await apiCall("POST", "master/others/penaltyName/list", data);
    return response;
  } catch (error) {
    console.error("Work Type List:", error);
    return Promise.reject(error);
  }
}

async function getpenaltyTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/others/penaltyName/detail", data);
    return response;
  } catch (error) {
    console.error("Work Type:", error);
    return Promise.reject(error);
  }
}
async function createpenaltyType(data) {
  try {
    const response = await apiCall("POST", "master/others/penaltyName/create", data);
    return response;
  } catch (error) {
    console.error("Penalty Type error:", error);
    return Promise.reject(error);
  }
}
async function updatepenaltyType(data) {

  try {
    const response = await apiCall("POST", "master/others/penaltyName/update", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}
async function deletepenaltyType(data) {

  try {
    const response = await apiCall("POST", "master/others/penaltyName/delete", data);
    return response;
  } catch (error) {
    console.error("Work Type error:", error);
    return Promise.reject(error);
  }
}

export const penaltyTypeServices = {
  getpenaltyTypeList,
  getpenaltyTypeDetails,
  createpenaltyType,
  updatepenaltyType,
  deletepenaltyType,
  penaltyTypeSearch
};