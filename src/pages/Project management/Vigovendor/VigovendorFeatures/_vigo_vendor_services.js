import { apiCall } from "../../../../config/Http";


async function getVendorList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `vendor/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Vendor List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `vendor/list`);
      return response;
    } catch (error) {
      console.error("Vendor List:", error);
      return Promise.reject(error);
    }
  }
}

async function vendorSearch(data) {

  try {
    const response = await apiCall("POST", "vendor/list", data);
    return response;
  } catch (error) {
    console.error("Vendor List:", error);
    return Promise.reject(error);
  }
}
async function getVendorDetails(data) {

  try {
    const response = await apiCall("POST", "vendor/detail", data);
    return response;
  } catch (error) {
    console.error("Vendor:", error);
    return Promise.reject(error);
  }
}
async function createVendorFunc(data) {

  try {
    const response = await apiCall("POST", "vendor/create", data);
    return response;
  } catch (error) {
    console.error("Vendor error:", error);
    return Promise.reject(error);
  }
}
async function updateVendorFunc(data) {

  try {
    const response = await apiCall("POST", "vendor/update", data);
    return response;
  } catch (error) {
    console.error("Vendor error:", error);
    return Promise.reject(error);
  }
}
async function deleteVendorFunc(data) {

  try {
    const response = await apiCall("POST", "vendor/delete", data);
    return response;
  } catch (error) {
    console.error("Vendor error:", error);
    return Promise.reject(error);
  }
}

export const vendorServices = {
  getVendorList,
  getVendorDetails,
  createVendorFunc,
  updateVendorFunc,
  deleteVendorFunc,
  vendorSearch,
};