import { apiCall } from "../../../../../config/Http";

async function getwfhManagerList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `master/others/wfhManager/list?page=${currentPage}&limit=${pageSize}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("attendancelist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/others/wfhManager/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function wfhManagerListSearch(data) {
  try {
    const response = await apiCall("POST", "master/others/wfhManager/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function wfhManagerCreate(data) {
  try {
    const response = await apiCall("POST", "master/others/wfhManager/create", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function wfhManagerDetails(data) {
  try {
    const response = await apiCall("POST", "master/others/wfhManager/detail", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function wfhManagerUpdate(data) {
  try {
    const response = await apiCall("POST", "master/others/wfhManager/update", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}
async function wfhManagerDelete(data) {
  try {
    const response = await apiCall("POST", "master/others/wfhManager/delete", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}


export const wfhManagerServices = {
  getwfhManagerList,
  wfhManagerListSearch,
  wfhManagerCreate,
  wfhManagerDetails,
  wfhManagerUpdate,
  wfhManagerDelete

};
