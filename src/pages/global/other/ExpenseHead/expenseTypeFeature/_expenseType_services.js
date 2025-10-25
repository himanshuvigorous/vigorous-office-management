import { apiCall } from "../../../../../config/Http";




async function getExpenseTypeList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/finance/expenseType/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/finance/expenseType/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function expenseTypeSearch(data) {
  try {
    const response = await apiCall("POST", `master/finance/expenseType/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getExpenseTypeByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `master/finance/expenseType/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `master/finance/expenseType/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createExpenseTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/expenseType/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getExpenseTypeDetails(data) {


  try {
    const response = await apiCall("POST", "master/finance/expenseType/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateExpenseTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/expenseType/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteExpenseTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/expenseType/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusExpenseTypeFunc(data) {
  try {
    const response = await apiCall("POST", "master/finance/expenseType/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}



export const expenseTypeServices = {
  getExpenseTypeList,
  getExpenseTypeByIdFunc,
  createExpenseTypeFunc,
  getExpenseTypeDetails,
  updateExpenseTypeFunc,
  deleteExpenseTypeFunc,
  statusExpenseTypeFunc,
  expenseTypeSearch,
};
