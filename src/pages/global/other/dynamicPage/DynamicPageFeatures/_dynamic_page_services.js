import { apiCall } from "../../../../../config/Http";


async function getDynamicPageList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;


    try {
      const response = await apiCall("POST", `dpage/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("Page List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `dpage/list`);
      return response;
    } catch (error) {
      console.error("Page List:", error);
      return Promise.reject(error);
    }
  }
}

async function getDynamicPageById(data) {
  try {
    const response = await apiCall("POST", "dpage/detail", data);
    return response;
  } catch (error) {
    console.error("Page:", error);
    return Promise.reject(error);
  }
}

async function createDynamicPage(data) {
  try {
    const response = await apiCall("POST", "dpage/create", data);
    return response;
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}

async function updateDynamicPage(data) {
  try {
    const response = await apiCall("POST", "dpage/update", data);
    return response;
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}

async function deleteDynamicPage(data) {
  try {
    const response = await apiCall("POST", "dpage/delete", data);
    return response;
  } catch (error) {
    console.error("Country error:", error);
    return Promise.reject(error);
  }
}

export const dynamicPageServices = {
  getDynamicPageList,
  getDynamicPageById,
  createDynamicPage,
  updateDynamicPage,
  deleteDynamicPage,
};