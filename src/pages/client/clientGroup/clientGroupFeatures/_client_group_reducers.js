import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { clientGroupServices } from "../clientGroupFeatures/_client_group_services";


export const getClientGroupList = createAsyncThunk(
  "user/getClientGroupList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientGroupServices.getClientGroupList(reqData);
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
export const clientGrpSearch = createAsyncThunk(
  "user/clientGrpSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await clientGroupServices.clientGrpSearch(reqData);
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
export const getClientGrpDetails = createAsyncThunk(
  "user/getClientGrpDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientGroupServices.getClientGrpDetails(reqData);
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

export const createClientGroup = createAsyncThunk(
  "user/createClientGroup",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientGroupServices.createClientGroup(reqData);
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

export const updateClientGroup = createAsyncThunk(
  "user/updateClientGroup",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await clientGroupServices.updateClientGroup(reqData);
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
export const deleteClientGroup = createAsyncThunk(
  "user/deleteClientGroup",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await clientGroupServices.deleteClientGrp(reqData);
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

const clientGroupSlice = createSlice({
  name: 'clientGroup',
  initialState: {
    clientGroupList: [],
    totalClientGroupCount: 0,
    clientGroupDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getClientGroupList.pending, (state, action) => {
        state.loading = true;
        state.clientGroupList = [];
        state.totalClientGroupCount = 0;
      })
      .addCase(getClientGroupList.fulfilled, (state, action) => {
        state.clientGroupList = action.payload?.data?.docs;
        state.totalClientGroupCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getClientGroupList.rejected, (state, action) => {
        state.loading = false;
        state.clientGroupList = [];
        state.totalClientGroupCount = 0;
      })
      .addCase(clientGrpSearch.pending, (state, action) => {
        state.groupSearchLoading = true;
        state.clientGroupList = [];
        state.totalClientGroupCount = 0;
      })
      .addCase(clientGrpSearch.fulfilled, (state, action) => {
        state.clientGroupList = action.payload?.data?.docs;
        state.totalClientGroupCount = action.payload?.data?.totalDocs;
        state.groupSearchLoading = false;
      })
      .addCase(clientGrpSearch.rejected, (state, action) => {
        state.groupSearchLoading = false;
        state.clientGroupList = [];
        state.totalClientGroupCount = 0;
      })
      .addCase(createClientGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createClientGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.clientgroupCreateData = action.payload;
      })
      .addCase(createClientGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateClientGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateClientGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateClientGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteClientGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteClientGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.clientGroupDeleteData = action.payload;
      })
      .addCase(deleteClientGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getClientGrpDetails.pending, (state) => {
        state.loading = true;
        state.clientGroupDetails = null;
      })
      .addCase(getClientGrpDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.clientGroupDetails = action.payload?.data;
      })
      .addCase(getClientGrpDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.clientGroupDetails = null;
      })
  },
});

export default clientGroupSlice.reducer;