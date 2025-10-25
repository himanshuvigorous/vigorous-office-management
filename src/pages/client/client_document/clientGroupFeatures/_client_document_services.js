import { apiCall } from "../../../../config/Http";


async function getClientDocumentList(data) {

  if (data) {
    const { page, limit, } = data
    try {
      const response = await apiCall("POST", `company/branch/client/document/list?page=${page}&limit=${limit}`, data);
      return response;
    } catch (error) {
      console.error("Client Group List:", error);
      return Promise.reject(error);
    }
  } 
}
async function updateClientDocument(data) {

  try {
    const response = await apiCall("POST", "company/branch/client/document/verify", data);
    return response;
  } catch (error) {
    console.error("Client Group error:", error);
    return Promise.reject(error);
  }
}
async function deleteClientDocument(data) {

  try {
    const response = await apiCall("POST", "company/branch/client/document/delete", data);
    return response;
  } catch (error) {
    console.error("Client Group error:", error);
    return Promise.reject(error);
  }
}

export const ClientDocumentServices = {
  getClientDocumentList,

  updateClientDocument,
  deleteClientDocument,

};