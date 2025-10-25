import { apiCall } from "../../../../config/Http";


async function getVisitorList(data) {
  const { page, limit, reqPayload } = data
  try {
    const response = await apiCall("POST", `visitor/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("visitorlist:", error);
    return Promise.reject(error);
  }
}

async function getGeneralVisitorList(data) {
  const { page, limit, reqPayload } = data
  try {
    const response = await apiCall("POST", `generalVisitor/list?page=${page}&limit=${limit}`, reqPayload);
    return response;
  } catch (error) {
    console.error("visitorlist:", error);
    return Promise.reject(error);
  }
}


async function visitorSearch(data) {
  try {
    const response = await apiCall("POST", "visitor/list", data);
    return response;
  } catch (error) {
    console.error("visitorlist:", error);
    return Promise.reject(error);
  }
}

async function createVisitor(data) {
  try {
    const response = await apiCall("POST", "visitor/create", data);
    return response;
  } catch (error) {
    console.error("visitor create error:", error);
    return Promise.reject(error);
  }
}


async function createGeneralVisitor(data) {
  try {
    const response = await apiCall("POST", "generalVisitor/create", data);
    return response;
  } catch (error) {
    console.error("visitor General create error:", error);
    return Promise.reject(error);
  }
}


async function getVisitorDetails(data) {
  try {
    const response = await apiCall("POST", "visitor/detail", data);
    return response;
  } catch (error) {
    console.error("getVisitorDetails:", error);
    return Promise.reject(error);
  }
}

async function getGeneralVisitorDetails(data) {
  try {
    const response = await apiCall("POST", "generalVisitor/detail", data);
    return response;
  } catch (error) {
    console.error("getVisitorDetails:", error);
    return Promise.reject(error);
  }
}


async function updateVisitor(data) {
  try {
    const response = await apiCall("POST", "visitor/update", data);
    return response;
  } catch (error) {
    console.error("updateVisitor:", error);
    return Promise.reject(error);
  }
}
async function updateGeneralVisitor(data) {
  try {
    const response = await apiCall("POST", "generalVisitor/update", data);
    return response;
  } catch (error) {
    console.error("updateVisitor:", error);
    return Promise.reject(error);
  }
}


async function deleteVisitor(data) {
  try {
    const response = await apiCall("POST", "visitor/delete", data);
    return response;
  } catch (error) {
    console.error("deleteVisitor:", error);
    return Promise.reject(error);
  }
}

async function deleteGeneralVisitor(data) {
  try {
    const response = await apiCall("POST", "generalVisitor/delete", data);
    return response;
  } catch (error) {
    console.error("deleteVisitor:", error);
    return Promise.reject(error);
  }
}


export const visitorServices = {
  getVisitorList,
  visitorSearch,
  createVisitor,
  getVisitorDetails,
  updateVisitor,
  deleteVisitor,
  createGeneralVisitor,
  getGeneralVisitorList,
  updateGeneralVisitor,
  getGeneralVisitorDetails,
  deleteGeneralVisitor
};