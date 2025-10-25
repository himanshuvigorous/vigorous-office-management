import { apiCall } from "../../../../config/Http";



async function getLeadmanagementFeatureList(data = {}) {
  try {
    const { page, limit, reqPayload } = data;

    let url = "project/lead/list";
    let payload = data;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
      payload = reqPayload || {};
    }

    const response = await apiCall("POST", url, payload);
    return response;
  } catch (error) {
    console.error("LeadmanagementFeatureList:", error);
    return Promise.reject(error);
  }
}


async function getLeadmanagementFeatureSearch(data = {}) {
  try {

    let url = "project/lead/list";
    const response = await apiCall("POST", url, data);
    return response;
  } catch (error) {
    console.error("LeadmanagementFeatureList:", error);
    return Promise.reject(error);
  }
}
async function getLeadmanagementFeatureById(data) {
  try {
    const response = await apiCall("POST", "project/lead/detail", data);
    return response;
  } catch (error) {
    console.error("LeadmanagementFeature:", error);
    return Promise.reject(error);
  }
}

async function LeadmanagementFeatureCreate(data) {
  try {
    const response = await apiCall("POST", "project/lead/create", data);
    return response;
  } catch (error) {



    console.error("user create error:", error);
    return Promise.reject(error);
  }
}

async function LeadmanagementFeatureUpdate(data) {
  try {
    const response = await apiCall("POST", "project/lead/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function LeadmanagementFeatureDelete(data) {
  try {
    const response = await apiCall("POST", "project/lead/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadmanagementFeatureStatus(data) {
  try {
    const response = await apiCall("POST", "project/lead/status", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadmanagementFollowupcommentCreate(data) {
  try {
    const response = await apiCall("POST", "project/lead/followUp/create", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function LeadmanagementFollowupcommentListFunc(data) {
  try {
    const response = await apiCall("POST", "project/lead/followUp/list", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadmanagementTransferListCreate(data) {
  try {
    const response = await apiCall("POST", "project/lead/transferRequest/create", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}

async function LeadmanagementTransferListUpdate(data) {
  try {
    const response = await apiCall("POST", "project/lead/transferRequest/update", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadmanagementTransferListStatus(data) {
  try {
    const response = await apiCall("POST", "project/lead/transferRequest/status", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadmanagementTransferListDelete(data) {
  try {
    const response = await apiCall("POST", "project/lead/transferRequest/delete", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function LeadManagementReport(data) {
  try {
    const response = await apiCall("POST", "project/lead/report", data);
    return response;
  } catch (error) {
    console.error("user update error:", error);
    return Promise.reject(error);
  }
}
async function getLeadmanagementtransferList(data = {}) {
  try {
    const { page, limit, reqPayload } = data;

    let url = "project/lead/transferRequest/list";
    let payload = data;
    if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
      payload = reqPayload || {};
    }

    const response = await apiCall("POST", url, payload);
    return response;
  } catch (error) {
    console.error("LeadmanagementFeatureList:", error);
    return Promise.reject(error);
  }
}
export const LeadmanagementFeatureServices = {
  getLeadmanagementFeatureList,
  LeadmanagementFeatureCreate,
  LeadmanagementFeatureUpdate,
  LeadmanagementFeatureDelete,
  getLeadmanagementFeatureById,
  LeadmanagementFeatureStatus,
  LeadmanagementFollowupcommentCreate,
  LeadmanagementFollowupcommentListFunc,
  getLeadmanagementtransferList,
  LeadmanagementTransferListCreate,
  LeadmanagementTransferListUpdate,
  LeadmanagementTransferListStatus,
  LeadmanagementTransferListDelete,
  LeadManagementReport,
  getLeadmanagementFeatureSearch

};