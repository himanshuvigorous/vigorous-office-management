import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";
import { ServerManagementService } from "./_server_Management_services";




export const getServerManagementList = createAsyncThunk(
  "user/getServerManagementList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await ServerManagementService.getServerManagementList(reqData);
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
export const ServerManagementSearch = createAsyncThunk(
  "user/ServerManagementSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await ServerManagementService.ServerManagementSearch(reqData);
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
export const getServerManagementDetails = createAsyncThunk(
  "user/getServerManagementDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await ServerManagementService.getServerManagementDetails(reqData);
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

export const createServerManagement = createAsyncThunk(
  "user/createServerManagement",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await ServerManagementService.createServerManagement(reqData);
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

export const updateServerManagement = createAsyncThunk(
  "user/updateServerManagement",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await ServerManagementService.updateServerManagement(reqData);
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
export const deleteServerManagement = createAsyncThunk(
  "user/deleteServerManagement",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await ServerManagementService.deleteServerManagement(reqData);
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

const ServerManagementSlice = createSlice({
  name: 'ServerManagement',
  initialState: {
    ServerManagementList: [],
    totalServerManagementCount: 0,
    clientServiceDetails: [],
    ServerManagementDetails:[],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getServerManagementList.pending, (state, action) => {
        state.loading = true;
        state.ServerManagementList = [];
        state.totalServerManagementCount = 0;
      })
      .addCase(getServerManagementList.fulfilled, (state, action) => {
        state.ServerManagementList = action.payload?.data;
        state.totalServerManagementCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getServerManagementList.rejected, (state, action) => {
        state.loading = false;
        state.ServerManagementList = [];
        state.totalServerManagementCount = 0;
      })
      .addCase(ServerManagementSearch.pending, (state, action) => {
        state.loading = true;
        state.ServerManagementList = [];
        state.totalServerManagementCount = 0;
      })
      .addCase(ServerManagementSearch.fulfilled, (state, action) => {
        state.ServerManagementList = action.payload?.data?.docs;
        state.totalServerManagementCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(ServerManagementSearch.rejected, (state, action) => {
        state.loading = false;
        state.ServerManagementList = [];
        state.totalServerManagementCount = 0;
      })
      .addCase(createServerManagement.pending, (state) => {
        state.loading = true;
      })
      .addCase(createServerManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.ServerManagementCreateData = action.payload;
        
      })
      .addCase(createServerManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateServerManagement.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateServerManagement.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.ServerManagementUpdateData = action.payload;
      })
      .addCase(updateServerManagement.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteServerManagement.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteServerManagement.fulfilled, (state, action) => {
        state.loading = false;
        state.ServerManagementDeleteData = action.payload;
      })
      .addCase(deleteServerManagement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getServerManagementDetails.pending, (state) => {
        state.loading = true;
        state.ServerManagementDetails = null;
      })
      .addCase(getServerManagementDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.ServerManagementDetails = action.payload?.data;
      })
      .addCase(getServerManagementDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.ServerManagementDetails = null;
      })
  },
});

export default ServerManagementSlice.reducer;