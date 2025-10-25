import { apiCall } from "../../../config/Http";



async function getDigitalSignatureTypeList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `master/client/signatureType/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/client/signatureType/list`);
      return response;
    } catch (error) {
      console.error("Client Service List:", error);
      return Promise.reject(error);
    }
  }
}

async function DigitalSignatureTypeSearch(data) {

  try {
    const response = await apiCall("POST", "master/client/signatureType/list", data);
    return response;
  } catch (error) {
    console.error("Client Service List:", error);
    return Promise.reject(error);
  }
}
async function getDigitalSignatureTypeDetails(data) {

  try {
    const response = await apiCall("POST", "master/client/signatureType/detail", data);
    return response;
  } catch (error) {
    console.error("Client Service:", error);
    return Promise.reject(error);
  }
}
async function createDigitalSignatureType(data) {

  try {
    const response = await apiCall("POST", "master/client/signatureType/create", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function updateDigitalSignatureType(data) {

  try {
    const response = await apiCall("POST", "master/client/signatureType/update", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}
async function deleteDigitalSignatureType(data) {

  try {
    const response = await apiCall("POST", "master/client/signatureType/delete", data);
    return response;
  } catch (error) {
    console.error("Client Service error:", error);
    return Promise.reject(error);
  }
}

export const digitalSignatureTypeService = {
  getDigitalSignatureTypeList,
  getDigitalSignatureTypeDetails,
  createDigitalSignatureType,
  updateDigitalSignatureType,
  deleteDigitalSignatureType,
  DigitalSignatureTypeSearch
};