import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { SupportServices } from "./_supportmodal_services";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";




export const getSupportList = createAsyncThunk(
  "getSupportList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await SupportServices.getSupportList(reqData);
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
export const SupportSearch = createAsyncThunk(
  "SupportSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await SupportServices.SupportSearch(reqData);
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




export const createSupportModalFunc = createAsyncThunk(
  "createSupportModalFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await SupportServices.createSupportModalFunc(reqData);
      showNotification({
        message: response?.Supportinfo?.message,
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

export const getSupportDetails = createAsyncThunk(
  "/company/getSupportDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await SupportServices.getSupportDetails(reqData);
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

export const updateSupportFunc = createAsyncThunk(
  "/updateSupportFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await SupportServices.updateSupportFunc(reqData);
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

export const deleteSupportFunc = createAsyncThunk(
  "/deleteSupportFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await SupportServices.deleteSupportFunc(reqData);
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

export const statusupdateSupportFunc = createAsyncThunk(
  'file/statusupdateSupportFunc',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await SupportServices.statusupdateSupportFunc(formData);
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

const SupportSlice = createSlice({
  name: 'SupportManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getSupportList.pending, (state, action) => {
        state.loading = true;
        state.SupportList = [];
        state.totalSupportCount = 0;
      })
      .addCase(getSupportList.fulfilled, (state, action) => {
        state.SupportList = action.payload?.data?.docs;
        state.totalSupportCount = action?.payload?.data?.totalDocs;
        state.SupportDetailsData = null;
        state.loading = false;
      })
      .addCase(getSupportList.rejected, (state, action) => {
        state.loading = false;
        state.SupportList = [];
        state.totalSupportCount = 0;
      })
      .addCase(SupportSearch.pending, (state, action) => {
        state.loading = true;
        state.SupportList = [];
        state.totalSupportCount = 0;
      })
      .addCase(SupportSearch.fulfilled, (state, action) => {
        state.SupportList = action.payload?.data?.docs;
        state.totalSupportCount = action.payload?.data?.totalDocs;
        state.SupportDetailsData = null; 
        state.loading = false;
      })
      .addCase(SupportSearch.rejected, (state, action) => {
        state.loading = false;
        state.SupportList = [];
        state.totalSupportCount = 0;
      })
      .addCase(createSupportModalFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSupportModalFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createSupportData = action.payload?.Supportinfo?.data;
      })
      .addCase(createSupportModalFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSupportFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSupportFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateSupportFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteSupportFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSupportFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteSupportFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSupportDetails.pending, (state, action) => {
        state.loading = true;
        state.SupportDetailsData = null;
      })
      .addCase(getSupportDetails.fulfilled, (state, action) => {
        state.SupportDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getSupportDetails.rejected, (state, action) => {
        state.loading = false;
        state.SupportDetailsData = null;
      })
      .addCase(statusupdateSupportFunc.pending, (state, action) => {
        state.loading = true;
        state.SupportDetailsData = null;
      })
      .addCase(statusupdateSupportFunc.fulfilled, (state, action) => {
        state.SupportStatusDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(statusupdateSupportFunc.rejected, (state, action) => {
        state.loading = false;
        state.SupportDetailsData = null;
      });
  },
});

export default SupportSlice.reducer;
