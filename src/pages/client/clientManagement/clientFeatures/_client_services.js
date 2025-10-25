import { apiCall, apiCallForm } from "../../../../config/Http";


async function getClientList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `client/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `client/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}
async function clientSearch(data) {
  try {
    const response = await apiCall("POST", "client/list", data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}
async function importClients(data) {
  try {
    const response = await apiCallForm("POST", "client/import", data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}
async function createClientFunc(data) {
  try {
    const response = await apiCall("POST", "client/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getClientDetails(data) {
  try {
    const response = await apiCall("POST", "client/detail", data);
    return response;
  } catch (error) {
    console.error("getClientDetails:", error);
    return Promise.reject(error);
  }
}

async function updateClientFunc(data) {
  try {
    const response = await apiCall("POST", "client/update", data);
    return response;
  } catch (error) {
    console.error("updateclient:", error);
    return Promise.reject(error);
  }
}
async function statusClientFunc(data) {
  try {
    const response = await apiCall("POST", "client/status", data);
    return response;
  } catch (error) {
    console.error("statusclient:", error);
    return Promise.reject(error);
  }
}

async function deleteClientFunc(data) {
  try {
    const response = await apiCall("POST", "client/delete", data);
    return response;
  } catch (error) {
    console.error("deleteclient:", error);
    return Promise.reject(error);
  }
}

async function getRoleList() {
  try {
    const response = await apiCall("POST", `roles/list`);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}


async function updateOwner(data) {
  try {
    const response = await apiCall("POST", "client/owner/update", data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}
async function updateService(data) {
  try {
    const response = await apiCall("POST", "client/service/update", data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}
async function deleteService(data) {
  try {
    const response = await apiCall("POST", "client/service/delete", data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}

export const clientServices = {
  getClientList,
  createClientFunc,
  getClientDetails,
  updateClientFunc,
  deleteClientFunc,
  updateOwner,
  getRoleList,
  clientSearch,
  updateService,
  deleteService,
  statusClientFunc,
  importClients

};
