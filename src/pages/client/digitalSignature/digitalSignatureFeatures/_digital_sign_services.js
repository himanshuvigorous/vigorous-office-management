import { apiCall } from "../../../../config/Http";


async function getDigitalSignList(data) {

  if (data) {
    const { page, limit, reqPayload } = data
    try {
      const response = await apiCall("POST", `client/signature/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Digital Signature List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/signature/list`);
      return response;
    } catch (error) {
      console.error("Digital Signature List:", error);
      return Promise.reject(error);
    }
  }
}

async function eventSearch(data) {

  try {
    const response = await apiCall("POST", "searchClientGroup", data);
    return response;
  } catch (error) {
    console.error("Digital Signature List:", error);
    return Promise.reject(error);
  }
}
async function getDigitalSignDetails(data) {

  try {
    const response = await apiCall("POST", "client/signature/detail", data);
    return response;
  } catch (error) {
    console.error("Digital Signature:", error);
    return Promise.reject(error);
  }
}
async function createDigitalSign(data) {

  try {
    const response = await apiCall("POST", "client/signature/create", data);
    return response;
  } catch (error) {
    console.error("Digital Signature error:", error);
    return Promise.reject(error);
  }
}
async function updateDigitalSign(data) {

  try {
    const response = await apiCall("POST", "client/signature/update", data);
    return response;
  } catch (error) {
    console.error("Digital Signature error:", error);
    return Promise.reject(error);
  }
}
async function deleteDigitalSignData(data) {

  try {
    const response = await apiCall("POST", "client/signature/delete", data);
    return response;
  } catch (error) {
    console.error("Digital Signature error:", error);
    return Promise.reject(error);
  }
}

export const digitalSignServices = {
  getDigitalSignList,
  getDigitalSignDetails,
  createDigitalSign,
  updateDigitalSign,
  deleteDigitalSignData,
  eventSearch
};