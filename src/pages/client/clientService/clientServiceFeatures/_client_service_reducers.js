import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { clientServeServices } from "./_client_service_services";


export const getClientServiceList = createAsyncThunk(
  "user/getClientServiceList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientServeServices.getClientServiceList(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'e  rror',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const clientServiceSearch = createAsyncThunk(
  "user/clientServiceSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientServeServices.clientServiceSearch(reqData);
      return respose;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const getClientServiceDetails = createAsyncThunk(
  "user/getClientServiceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServeServices.getClientServiceDetails(reqData);
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

export const createClientService = createAsyncThunk(
  "user/createClientService",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServeServices.createClientService(reqData);
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

export const updateClientService = createAsyncThunk(
  "user/updateClientService",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientServeServices.updateClientService(reqData);
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
export const deleteClientService = createAsyncThunk(
  "user/deleteClientService",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientServeServices.deleteClientService(reqData);
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

const clientServiceSlice = createSlice({
  name: 'clientService',
  initialState: {
    ClientServiceList: [],
    totalClientServiceCount: 0,
    clientServiceDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientServiceList.pending, (state, action) => {
        state.loading = true;
        state.ClientServiceList = [];
        state.totalClientServiceCount = 0;
      })
      .addCase(getClientServiceList.fulfilled, (state, action) => {
        state.ClientServiceList = action.payload?.data;
        state.totalClientServiceCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getClientServiceList.rejected, (state, action) => {
        state.loading = false;
        state.ClientServiceList = [];
        state.totalClientServiceCount = 0;
      })
      .addCase(clientServiceSearch.pending, (state, action) => {
        state.loading = true;
        state.ClientServiceList = [];
        state.totalClientServiceCount = 0;
      })
      .addCase(clientServiceSearch.fulfilled, (state, action) => {
        state.ClientServiceList = action.payload?.data;
        state.totalClientServiceCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(clientServiceSearch.rejected, (state, action) => {
        state.loading = false;
        state.ClientServiceList = [];
        state.totalClientServiceCount = 0;
      })
      .addCase(createClientService.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClientService.fulfilled, (state, action) => {
        state.loading = false;
        state.clientServiceCreateData = action.payload;
      })
      .addCase(createClientService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClientService.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientService.fulfilled, (state, action) => {
        state.loading = false;
        state.clientServiceUpdateData = action.payload;
      })
      .addCase(updateClientService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClientService.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientService.fulfilled, (state, action) => {
        state.loading = false;
        state.clientServiceDeleteData = action.payload;
      })
      .addCase(deleteClientService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClientServiceDetails.pending, (state) => {
        state.loading = true;
        state.clientServiceDetails = null;
      })
      .addCase(getClientServiceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.clientServiceDetails = action.payload?.data;
      })
      .addCase(getClientServiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.clientServiceDetails = null;
      })
  },
});

export default clientServiceSlice.reducer;