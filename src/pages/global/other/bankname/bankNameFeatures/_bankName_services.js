import { apiCall } from "../../../../../config/Http";


async function getbankNameList(data) {
  try {
    const { page, limit, reqPayload } = data;
    const response = await apiCall("POST", `master/others/bankName/list?page=${page}&&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("bankNameList:", error);
    return Promise.reject(error);
  }
}

async function bankNameSearch(data) {
  try {
    const response = await apiCall("POST", "master/others/bankName/list", data);
    return response;
  } catch (error) {
    console.error("bankNameList:", error);
    return Promise.reject(error);
  }
}

async function getbankNameById(data) {
  try {
    const response = await apiCall("POST", "master/others/bankName/detail", data);
    return response;
  } catch (error) {
    console.error("bankName:", error);
    return Promise.reject(error);
  }
}

async function bankNameCreate(data) {
  try {
    const response = await apiCall("POST", "master/others/bankName/create", data);
    return response;
  } catch (error) {
    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function bankNameUpdate(data) {
  try {
    const response = await apiCall("POST", "master/others/bankName/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function bankNameDelete(data) {
  try {
    const response = await apiCall("POST", "master/others/bankName/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

export const bankNameServices = {
  getbankNameList,
  bankNameCreate,
  bankNameUpdate,
  bankNameDelete,
  getbankNameById,
  bankNameSearch,
};