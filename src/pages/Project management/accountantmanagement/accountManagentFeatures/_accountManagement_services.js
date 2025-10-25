import { apiCall } from "../../../../config/Http";




async function getAccountantList(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/accountent/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/accountent/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}


async function accountantSearch(data) {
  try {
    const response = await apiCall("POST", `project/accountent/list` , data);
    return response;
  } catch (error) {
    console.error("clientlist:", error);
    return Promise.reject(error);
  }
}


async function getAccountantByIdFunc(data) {
  if (data) {
    const { page, limit, reqPayload } = data;
    try {
      const response = await apiCall("POST", `project/accountent/list?page=${page}&limit=${limit}`, reqPayload);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  } else {
    try {
      const response = await apiCall("POST", `project/accountent/list`);
      return response;
    } catch (error) {
      console.error("clientlist:", error);
      return Promise.reject(error);
    }
  }
}



async function createAccountantFunc(data) {
  try {
    const response = await apiCall("POST", "project/accountent/create", data);
    if (response) {
      return { clientinfo: response };
    }
  } catch (error) {
    console.error("create client error:", error);
    return Promise.reject(error);
  }
}

async function getAccountantDetails(data) {


  try {
    const response = await apiCall("POST", "project/accountent/detail", data);
    return response;
  } catch (error) {
    console.error("gettaskDetails:", error);
    return Promise.reject(error);
  }
}

async function updateAccountantFunc(data) {
  try {
    const response = await apiCall("POST", "project/accountent/update", data);
    return response;
  } catch (error) {
    console.error("updatetask:", error);
    return Promise.reject(error);
  }
}

async function deleteAccountantFunc(data) {
  try {
    const response = await apiCall("POST", "project/accountent/delete", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error);
  }
}
async function statusAccountantFunc(data) {
  try {
    const response = await apiCall("POST", "project/accountent/status", data);
    return response;
  } catch (error) {
    console.error("deletetask:", error);
    return Promise.reject(error); 
  }
}



export const accountManagementServices = {
  getAccountantList,
  getAccountantByIdFunc,
  createAccountantFunc,
  getAccountantDetails,
  updateAccountantFunc,
  deleteAccountantFunc,
  statusAccountantFunc,
  accountantSearch,
};
