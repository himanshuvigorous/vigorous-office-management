import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";

import { clientServices } from "./_client_services";

export const getClientList = createAsyncThunk(
  "getClientList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.getClientList(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getRoleList = createAsyncThunk(
  "getRoleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clientServices.getRoleList();
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const clientSearch = createAsyncThunk(
  "user/clientSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.clientSearch(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const importClients = createAsyncThunk(
  "user/importClients",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.importClients(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const createClientFunc = createAsyncThunk(
  "createClientFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientServices.createClientFunc(reqData);
      showNotification({
        message: response?.clientinfo?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getClientDetails = createAsyncThunk(
  "/company/getClientDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientServices.getClientDetails(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const updateClientFunc = createAsyncThunk(
  "/updateClientFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.updateClientFunc(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const statusClientFunc = createAsyncThunk(
  "/statusClientFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.statusClientFunc(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const deleteClientFunc = createAsyncThunk(
  "/deleteClientFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServices.deleteClientFunc(reqData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const uploadDocFile = createAsyncThunk(
  'file/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await clientServices.uploadDocFile(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateOwner = createAsyncThunk(
  'file/updateOwner',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await clientServices.updateOwner(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
       showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.response.data);
    }
  }
);
export const updateService = createAsyncThunk(
  'file/updateService',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await clientServices.updateService(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
       showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteService = createAsyncThunk(
  'file/deleteService',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await clientServices.deleteService(formData);
      showNotification({
        message: response?.message,
        type: 'success',
      });
      return response.data;
    } catch (error) {
       showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.response.data);
    }
  }
);
const initialState = {
  loading: false,
  clientList: [],
  totalEmployeCount: 0,
  roleList: [],
  createClientData: null,
  hrupdateData: null,
  userdeleteData: null,
  clientDetailsData: null,
  updateOwnerForClient: null,
  updateServiceForClient: null,
  deleteServiceForClient: null,
  error: null,
};

const clientSlice = createSlice({
  name: 'clientManagement',
  initialState,
  reducers: {
    emptyClientState: () => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientList.pending, (state, action) => {
        state.loading = true;
        state.clientList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(getClientList.fulfilled, (state, action) => {
        state.clientList = action.payload?.data?.docs;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getClientList.rejected, (state, action) => {
        state.loading = false;
        state.clientList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(getRoleList.pending, (state, action) => {
        state.loading = true;
        state.roleList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(getRoleList.fulfilled, (state, action) => {
        state.roleList = action.payload?.data;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getRoleList.rejected, (state, action) => {
        state.loading = false;
        state.roleList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(clientSearch.pending, (state, action) => {
        state.loading = true;
        state.clientList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(clientSearch.fulfilled, (state, action) => {
        state.clientList = action.payload?.data?.docs;
        state.totalEmployeCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(clientSearch.rejected, (state, action) => {
        state.loading = false;
        state.clientList = [];
        state.totalEmployeCount = 0;
      })
      .addCase(createClientFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClientFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createClientData = action.payload?.clientinfo?.data;
      })
      .addCase(createClientFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClientFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateClientFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusClientFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusClientFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.statusUpdateData = action.payload;
      })
      .addCase(statusClientFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClientFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteClientFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClientDetails.pending, (state, action) => {
        state.loading = true;
        state.clientDetailsData = null;
      })
      .addCase(getClientDetails.fulfilled, (state, action) => {
        state.clientDetailsData = action.payload;
        state.loading = false;
      })
      .addCase(getClientDetails.rejected, (state, action) => {
        state.loading = false;
        state.clientDetailsData = null;
      })
      .addCase(importClients.pending, (state, action) => {
        state.loading = true;
        state.importClientsData = null;
      })
      .addCase(importClients.fulfilled, (state, action) => {
        state.importClientsData = action.payload;
        state.loading = false;
      })
      .addCase(importClients.rejected, (state, action) => {
        state.loading = false;
        state.importClientsData = null;
      })
      .addCase(updateOwner.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateOwner.fulfilled, (state, action) => {
        state.updateOwnerForClient = action.payload;
        state.loading = false;
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.loading = false;
        state.updateOwnerForClient = null;
      })
      .addCase(updateService.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.updateServiceForClient = action.payload;
        state.loading = false;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.updateServiceForClient = null;
      })
      .addCase(deleteService.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.deleteServiceForClient = action.payload;
        state.loading = false;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.deleteServiceForClient = null;
      });
  },
});

export default clientSlice.reducer;
