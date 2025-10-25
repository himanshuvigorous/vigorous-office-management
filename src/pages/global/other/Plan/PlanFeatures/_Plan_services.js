import { apiCall} from "../../../../../config/Http";



async function getPlanList(data) {
  if (data) {
    const { currentPage, pageSize, reqPayload } = data
    try {
      const response = await apiCall("POST", `plan/list?page=${currentPage}&limit=${pageSize}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `plan/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}

async function planSearch(reqData) {
  try {
    const response = await apiCall("POST", `plan/list`, reqData);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
}

async function getPlanById(data) {

  try {
    const response = await apiCall("POST", "plan/detail ", data);
    return response;
  } catch (error) {
    console.error("Plan:", error);
    return Promise.reject(error);
  }
}
async function planCreate(data) {

  try {
    const response = await apiCall("POST", "plan/create", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function planUpdate(data) {

  try {
    const response = await apiCall("POST", "plan/update", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function planDelete(data) {

  try {
    const response = await apiCall("POST", "plan/delete", data);
    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function planStatus(data) {

  try {
    const response = await apiCall("POST", "plan/status", data);
    if (response) {
      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function planSidbarpermission(data) {

  try {
    const response = await apiCall("POST", "dpageManager/create", data);
    if (response) {
      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function planSidbarpermissionDetails(data) {

  try {
    const response = await apiCall("POST", "dpageManager/detail", data);
    if (response) {
      return  response ;
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}

export const planServices = {
  getPlanList,
  getPlanById,
  planCreate,
  planUpdate,
  planDelete,
  planSearch,
  planStatus,
  planSidbarpermission,
  planSidbarpermissionDetails
};