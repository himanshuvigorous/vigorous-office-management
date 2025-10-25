import { apiCall } from "../../../../../config/Http";


async function getofficeAddressList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `master/branch/layout/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `master/branch/layout/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}
async function officeAddressSearch(data) {

  try {
    const response = await apiCall("POST", "master/branch/layout/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getofficeAddressDetails(data) {

  try {
    const response = await apiCall("POST", "master/branch/layout/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createofficeAddress(data) {
  try {
    const response = await apiCall("POST", "master/branch/layout/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateofficeAddress(data) {

  try {
    const response = await apiCall("POST", "master/branch/layout/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteofficeAddress(data) {

  try {
    const response = await apiCall("POST", "master/branch/layout/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}

export const officeAddressServices = {
  getofficeAddressList,
  getofficeAddressDetails,
  createofficeAddress,
  updateofficeAddress,
  deleteofficeAddress,
  officeAddressSearch
};