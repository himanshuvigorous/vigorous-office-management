import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { projectInvoiceServices } from "./_ProjectInvoice_services";










export const projectInvoiceSearch = createAsyncThunk(
  "getprojectInvoiceList/projectInvoiceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.projectInvoiceSearch(reqData);
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



export const getprojectInvoiceReportList = createAsyncThunk(
  "getprojectInvoiceReportList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.getprojectInvoiceReportList(reqData);
   
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
export const getprojectInvoiceListFunc = createAsyncThunk(
  "getprojectInvoiceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.getprojectInvoiceList(reqData);
   
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




export const createprojectInvoiceFunc = createAsyncThunk(
  "createprojectInvoiceFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectInvoiceServices.createprojectInvoiceFunc(reqData);
      showNotification({
        message: response?.taskinfo?.message,
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

export const getprojectInvoiceDetails = createAsyncThunk(
  "/company/getprojectInvoiceDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectInvoiceServices.getprojectInvoiceDetails(reqData);
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

export const updateprojectInvoiceFunc = createAsyncThunk(
  "/updateprojectInvoiceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.updateprojectInvoiceFunc(reqData);
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

export const deleteprojectInvoiceFunc = createAsyncThunk(
  "/deleteprojectInvoiceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.deleteprojectInvoiceFunc(reqData);
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
export const statusprojectInvoiceFunc = createAsyncThunk(
  "/statusprojectInvoiceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectInvoiceServices.statusprojectInvoiceFunc(reqData);
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




const projectInvoiceSlice = createSlice({
  name: 'projectInvoice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getprojectInvoiceListFunc.pending, (state, action) => {
        state.loading = true;
        state.projectInvoiceList = [];
        state.totalprojectInvoiceCount = 0;
      })
      .addCase(getprojectInvoiceListFunc.fulfilled, (state, action) => {
        state.projectInvoiceList = action.payload?.data?.docs;
        state.totalprojectInvoiceCount = action.payload?.data?.totalDocs;
        state.projectInvoiceDetailsData = null;
        state.loading = false;
      })
      .addCase(getprojectInvoiceListFunc.rejected, (state, action) => {
        state.loading = false;
        state.projectInvoiceList = [];
        state.totalprojectInvoiceCount = 0;
      })
      .addCase(getprojectInvoiceReportList.pending, (state, action) => {
        state.loading = true;
        state.projectInvoiceReportList = [];
      })
      .addCase(getprojectInvoiceReportList.fulfilled, (state, action) => {
        state.projectInvoiceReportList = action.payload?.data;
        state.loading = false;
      })
      .addCase(getprojectInvoiceReportList.rejected, (state, action) => {
        state.loading = false;
        state.projectInvoiceReportList = [];
      })
      .addCase(createprojectInvoiceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createprojectInvoiceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createprojectInvoiceData = action.payload?.projectInvoiceinfo?.data;
      })
      .addCase(createprojectInvoiceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateprojectInvoiceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateprojectInvoiceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateprojectInvoiceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteprojectInvoiceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteprojectInvoiceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteprojectInvoiceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(statusprojectInvoiceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(statusprojectInvoiceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.usersttatusData = action.payload;
      })
      .addCase(statusprojectInvoiceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getprojectInvoiceDetails.pending, (state, action) => {
        state.loading = true;
        state.projectInvoiceDetailsData = null;
      })
      .addCase(getprojectInvoiceDetails.fulfilled, (state, action) => {
        state.projectInvoiceDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getprojectInvoiceDetails.rejected, (state, action) => {
        state.loading = false;
        state.projectInvoiceDetailsData = null;
      })
      .addCase(projectInvoiceSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(projectInvoiceSearch.fulfilled, (state, action) => {
        state.projectInvoiceList = action.payload?.data?.docs;
        state.totalprojectInvoiceCount = action.payload?.data?.totalDocs;
        state.projectInvoiceDetailsData = null;
        state.loading = false;
      })
      .addCase(projectInvoiceSearch.rejected, (state, action) => {
        state.loading = false;
        state.projectInvoiceList = [];
        state.totalprojectInvoiceCount = 0;
      })
      
  },
});

export default projectInvoiceSlice.reducer;
