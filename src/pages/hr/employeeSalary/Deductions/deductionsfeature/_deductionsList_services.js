import { apiCall } from "../../../../../config/Http";

async function getdeductionsList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `master/deduction/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/deduction/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function deductionsListSearch(data) {
  try {
    const response = await apiCall("POST", "master/deduction/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function deductionsCreate(data) {
  try {
    const response = await apiCall("POST", "master/deduction/create", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function deductionsDetails(data) {
  try {
    const response = await apiCall("POST", "master/deduction/detail", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function deductionsUpdate(data) {
  try {
    const response = await apiCall("POST", "master/deduction/update", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function deductionsDelete(data) {
  try {
    const response = await apiCall("POST", "master/deduction/delete", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}


export const deductionsServices = {
  getdeductionsList,
  deductionsListSearch,
  deductionsCreate,
  deductionsDetails,
  deductionsUpdate,
  deductionsDelete

};
