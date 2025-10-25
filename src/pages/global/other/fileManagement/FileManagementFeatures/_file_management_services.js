import { apiCall, apiCallForm } from "../../../../../config/Http";


async function getDocumentList(data) {
  if (data) {
    const { page, limit } = data
    try {
      const response = await apiCall("POST", `file/list?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `file/list`);
      return response;
    } catch (error) {
      console.error("Plan List:", error);
      return Promise.reject(error);
    }
  }
}
async function getDocumentListseearch(data) {
  try {
    const response = await apiCall("POST", `file/list`,data);
    return response;
  } catch (error) {
    console.error("Plan List:", error);
    return Promise.reject(error);
  }
}

async function createDocument(data) {
  try {
    const response = await apiCallForm("POST", "file/create", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

async function updateDocument(data) {

  try {
    const response = await apiCall("POST", "file/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function updateFinacialDocument(data) {

  try {
    const response = await apiCall("POST", "company/financial/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function updateExperianceFunc(data) {

  try {
    const response = await apiCall("POST", "master/company/experience/update", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteExperianceFunc(data) {

  try {
    const response = await apiCall("POST", "master/company/experience/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteFinacialDocument(data) {
  try {
    const response = await apiCall("POST", "company/financial/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}
async function deleteDocument(data) {

  try {
    const response = await apiCall("POST", "file/delete", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}


async function fileUploadFunc(data) {

  try {
    const response = await apiCallForm("POST", "fileUpload", data);
    return response;
  } catch (error) {
    console.error("GST Type error:", error);
    return Promise.reject(error);
  }
}

export const fileManagementServices = {
  getDocumentList,
  createDocument,
  updateDocument,
  getDocumentListseearch,
  fileUploadFunc,
  deleteDocument,
  updateFinacialDocument,
  deleteFinacialDocument,
  updateExperianceFunc,
  deleteExperianceFunc
};