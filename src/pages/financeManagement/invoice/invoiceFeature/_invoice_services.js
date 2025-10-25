import { apiCall } from "../../../../config/Http";


async function getinvoiceList(data) {

  if(data){
    const {currentPage , pageSize,reqData} = data
  try {
    const response = await apiCall("POST", `finance/invoice/list?page=${currentPage}&limit=${pageSize}`,reqData);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
  }else{
    try {
      const response = await apiCall("POST", `finance/invoice/list`);
      return response;
    } catch (error) {
      console.error("Office Address List:", error);
      return Promise.reject(error);
    }
  }
}

async function invoiceSearch(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/list", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}
async function invoiceComentCreate(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/commenting", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}
async function invoiceComentList(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/commentList", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}
async function invoiceSummary(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/summary", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}
async function pendingInvoiceSummary(data) {

  try {
    const response = await apiCall("POST", "task/pendingInvoiceSummary", data);
    return response;
  } catch (error) {
    console.error("Office Address List:", error);
    return Promise.reject(error);
  }
}

async function getinvoiceDetails(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/detail", data);
    return response;
  } catch (error) {
    console.error("Office Address:", error);
    return Promise.reject(error);
  }
}
async function createinvoice(data) {
  try {
    const response = await apiCall("POST", "finance/invoice/create", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function updateinvoice(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/update", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function deleteinvoice(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/delete", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function invoiceStatusChangeFunc(data) {

  try {
    const response = await apiCall("POST", "finance/invoice/status", data);
    return response;
  } catch (error) {
    console.error("Office Address error:", error);
    return Promise.reject(error);
  }
}
async function htmlTemplateGenerator(data) {

  try {
    const response = await apiCall("POST", "htmlTemplateGenerator", data);
    return response;
  } catch (error) {
    console.error("htmlTemplateGenerator error:", error);
    return Promise.reject(error);
  }
}

export const invoiceServices = {
  getinvoiceList,
  getinvoiceDetails,
  pendingInvoiceSummary,
  createinvoice,
  updateinvoice,
  deleteinvoice,
  invoiceSearch,
  invoiceStatusChangeFunc,
  invoiceSummary,
  htmlTemplateGenerator,
  invoiceComentCreate,
  invoiceComentList
};