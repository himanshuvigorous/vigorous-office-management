import { apiCall, apiCallForm } from "../../../../config/Http";

async function getCompanyList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall(
        "POST",
        `company/list?page=${page}&limit=${limit}`,
        reqPayload
      );
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `company/list`);
      return response;
    } catch (error) {
      console.error("companylist:", error);
      return Promise.reject(error);
    }
  }
}

async function companySearch(data) {
  try {
    const response = await apiCall("POST", "company/list", data);
    return response;
  } catch (error) {
    console.error("companylist:", error);
    return Promise.reject(error);
  }
}

async function companyCreate(data) {
  try {
    const response = await apiCall("POST", "company/create", data);
    if (response) {
      return { companyinfo: response };
    }
  } catch (error) {
    console.error("company create error:", error);
    return Promise.reject(error);
  }
}

async function getCompanyDetails(data) {
  try {
    const response = await apiCall("POST", "company/detail", data);
    return response;
  } catch (error) {
    console.error("getcompanyDetails:", error);
    return Promise.reject(error);
  }
}

async function updateCompany(data) {
  try {
    const response = await apiCall("POST", "company/update", data);
    return response;
  } catch (error) {
    console.error("updatecompany:", error);
    return Promise.reject(error);
  }
}
async function updateCompanyOwner(data) {
  try {
    const response = await apiCall("POST", "master/company/owner/update", data);
    return response;
  } catch (error) {
    console.error("updatecompany:", error);
    return Promise.reject(error);
  }
}
async function deleteCompanyOwner(data) {
  try {
    const response = await apiCall("POST", "master/company/owner/delete", data);
    return response;
  } catch (error) {
    console.error("updatecompany:", error);
    return Promise.reject(error);
  }
}

async function deleteCompany(data) {
  try {
    const response = await apiCall("POST", "company/delete", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function companyStatuspdate(data) {
  try {
    const response = await apiCall("POST", "company/status", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function companyRazorPayfunc(data) {
  try {
    const response = await apiCall("POST", "company/razorpaykey", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function companyPlanHistory(data) {
  try {
    const response = await apiCall("POST", "company/planhistory", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}
async function verifyAuthFunc(data) {
  try {
    const response = await apiCall("POST", "company/verifyAuth", data);
    return response;
  } catch (error) {
    console.error("deletecompany:", error);
    return Promise.reject(error);
  }
}

async function regeneratePassfunc(data) {
  try {
    const response = await apiCall("POST", "auth/forgot/regeneratePassword", data);
    return response;
  } catch (error) {
    console.error("regenerate Password:", error);
    return Promise.reject(error);
  }
}
async function subscriptionFunc(data) {
  try {
    const response = await apiCall("POST", "company/subscription", data);
    return response;
  } catch (error) {
    console.error("Subscription", error);
    return Promise.reject(error);
  }
}
async function companyInvoiveDetail(data) {
  try {
    const response = await apiCall("POST", "company/invoice/detail", data);
    return response;
  } catch (error) {
    console.error("invoice company:", error);
    return Promise.reject(error);
  }
}
async function companyInvoiceRefund(data) {
  try {
    const response = await apiCall("POST", "company/invoice/refund", data);
    return response;
  } catch (error) {
    console.error("invoice company:", error);
    return Promise.reject(error);
  }
}
async function companySubscriptionStatus(data) {
  try {
    const response = await apiCall("POST", "company/subscription/status", data);
    return response;
  } catch (error) {
    console.error("invoice company:", error);
    return Promise.reject(error);
  }
}


export const companyServices = {
  getCompanyList,
  companySearch,
  companyCreate,
  getCompanyDetails,
  updateCompany,
  deleteCompany,
  companyStatuspdate,
  updateCompanyOwner,
  deleteCompanyOwner,
  companyRazorPayfunc,
  verifyAuthFunc,
  regeneratePassfunc,
  companyPlanHistory,
  subscriptionFunc,
  companyInvoiveDetail,
  companyInvoiceRefund,
  companySubscriptionStatus
};
