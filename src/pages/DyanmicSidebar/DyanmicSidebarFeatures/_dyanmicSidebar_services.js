import { decryptObject, encryptObject } from "../../../config/Encryption";
import { apiCall, apiCallForm } from "../../../config/Http";

  const structuredSidebarList = 'U2FsdGVkX1%2BfTHAQBYUK0oXoWEt3jbWlHGG9azs5zm%2Bwh6G%2Bzu3vXQqoatblF%2Fa9'
 const sidebarList = 'U2FsdGVkX1%2BfTHAQBYUK0oXoWEdhgggjergerguegererhehrgjegbeghergehgerhg5874'

async function getsidebarList(data) {
  if (data) {
    const { currentPage, pageSize } = data
    try {
      const response = await apiCall("POST", `dpage/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `dpage/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function getviewFinalsidebarList(data) {

  try {
    const localStorageData = localStorage.getItem(structuredSidebarList);
    let response
    if (localStorageData) {
      response = decryptObject(JSON.parse(localStorageData));
    } else {
      const apiresponse = await apiCall("POST", `dpage/sideBarList`, data);
      localStorage.setItem(structuredSidebarList, JSON.stringify(encryptObject(apiresponse)));
      response = apiresponse;
    }

    return response;
  } catch (error) {
    console.error("sidebar List:", error);
    return Promise.reject(error);
  }
}
async function dynamicSidebarSearch(data) {

  try {
      const localStorageData = localStorage.getItem(sidebarList);
   let response
    if (localStorageData) {
      response = decryptObject(JSON.parse(localStorageData));
    } else {
      const apiresponse = await apiCall("POST", `dpage/list`, data);
      localStorage.setItem(sidebarList, JSON.stringify(encryptObject(apiresponse)));
      response = apiresponse;
    }
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
}
async function getsidebarById(data) {
  try {
    const response = await apiCall("POST", "dpage/detail", data);
    return response;
  } catch (error) {
    console.error("Plan:", error);
    return Promise.reject(error);
  }
}
async function dynamicSidebarCreate(data) {
  try {
            localStorage.removeItem(structuredSidebarList)
    localStorage.removeItem(sidebarList)
    const response = await apiCall("POST", "dpage/create", data);

    if (response) {
      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function dynamicPageUpdate(data) {
  try {
            localStorage.removeItem(structuredSidebarList)
    localStorage.removeItem(sidebarList)
    const response = await apiCall("POST", "dpage/update", data);

    if (response) {
      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}
async function dynamicSidebarDelete(data) {

  try {
            localStorage.removeItem(structuredSidebarList)
    localStorage.removeItem(sidebarList)
    const response = await apiCall("POST", "dpage/delete", data);

    if (response) {

      return { userinfo: response };
    }
  } catch (error) {
    console.error("Plan error:", error);
    return Promise.reject(error);
  }
}

export const dyanmicSidebarServices = {
  getsidebarList,
  getsidebarById,
  dynamicSidebarCreate,
  dynamicPageUpdate,
  dynamicSidebarDelete,
  dynamicSidebarSearch,
  getviewFinalsidebarList
};