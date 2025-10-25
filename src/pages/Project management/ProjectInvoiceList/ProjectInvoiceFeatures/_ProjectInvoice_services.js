import { apiCall } from "../../../../config/Http";




async function getprojectInvoiceReportList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/invoice/report?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/invoice/report`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}
async function getprojectInvoiceList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/invoice/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/invoice/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function projectInvoiceSearch(data) {
  try {
    const response = await apiCall("POST", `project/invoice/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getprojectInvoiceByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/invoice/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/invoice/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createprojectInvoiceFunc(data) {
  try {
    const response = await apiCall("POST", "project/invoice/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getprojectInvoiceDetails(data) {


  try {
    const response = await apiCall("POST", "project/invoice/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateprojectInvoiceFunc(data) {
  try {
    const response = await apiCall("POST", "project/invoice/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteprojectInvoiceFunc(data) {
  try {
    const response = await apiCall("POST", "project/invoice/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusprojectInvoiceFunc(data) {
  try {
    const response = await apiCall("POST", "project/invoice/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const projectInvoiceServices = {
  getprojectInvoiceList,
  getprojectInvoiceByIdFunc,
  createprojectInvoiceFunc,
  getprojectInvoiceDetails,
  updateprojectInvoiceFunc,
  deleteprojectInvoiceFunc,
  statusprojectInvoiceFunc,
  projectInvoiceSearch,
  getprojectInvoiceReportList
};
