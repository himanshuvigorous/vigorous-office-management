import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { vendorServices } from "./_vigo_vendor_services";


export const getVendorList = createAsyncThunk(
  "user/getVendorList",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await vendorServices.getVendorList(reqData);
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
export const vendorSearch = createAsyncThunk(
  "user/vendorSearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const respose = await vendorServices.vendorSearch(reqData);
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
export const getVendorDetails = createAsyncThunk(
  "user/getVendorDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendorServices.getVendorDetails(reqData);
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
export const getvendorFundOrPurchaseReport = createAsyncThunk(
  "user/getvendorFundOrPurchaseReport",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendorServices.getvendorFundOrPurchaseReport(reqData);
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
export const createVendorFunc = createAsyncThunk(
  "user/createVendorFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendorServices.createVendorFunc(reqData);
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

export const updateVendorFunc = createAsyncThunk(
  "user/updateVendorFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendorServices.updateVendorFunc(reqData);
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
export const deleteVendorFunc = createAsyncThunk(
  "user/deleteVendorFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await vendorServices.deleteVendorFunc(reqData);
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

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendorDataList: [],
    totalVendorCount: 0,
    vendorDetails: [],
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getVendorList.pending, (state, action) => {
        state.loading = true;
        state.vendorDataList = [];
        state.totalVendorCount = 0;
      })
      .addCase(getVendorList.fulfilled, (state, action) => {
        state.vendorDataList = action.payload?.data?.docs;
        state.totalVendorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getVendorList.rejected, (state, action) => {
        state.loading = false;
        state.vendorDataList = [];
        state.totalVendorCount = 0;
      })
      .addCase(vendorSearch.pending, (state, action) => {
        state.loading = true;
        state.vendorDataList = [];
        state.totalVendorCount = 0;
      })
      .addCase(vendorSearch.fulfilled, (state, action) => {
        state.vendorDataList = action.payload?.data?.docs;
        state.totalVendorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(vendorSearch.rejected, (state, action) => {
        state.loading = false;
        state.vendorDataList = [];
        state.totalVendorCount = 0;
      })
      .addCase(createVendorFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVendorFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.clientgroupCreateData = action.payload;
      })
      .addCase(createVendorFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVendorFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateVendorFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeUpdateData = action.payload;
      })
      .addCase(updateVendorFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVendorFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteVendorFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.clientGroupDeleteData = action.payload;
      })
      .addCase(deleteVendorFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getVendorDetails.pending, (state) => {
        state.loading = true;
        state.vendorDetails = null;
      })
      .addCase(getVendorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorDetails = action.payload?.data;
      })
      .addCase(getVendorDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.vendorDetails = null;
      })
      .addCase(getvendorFundOrPurchaseReport.pending, (state) => {
        state.loading = true;
        state.vendorFundPurchaseDataList = [];
        state.vendorFundPurchaseDataCount = null;
      })
      .addCase(getvendorFundOrPurchaseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.vendorFundPurchaseDataList = action.payload?.data?.docs
        state.vendorFundPurchaseDataCount = action.payload?.data?.totalDocs;

      })
      .addCase(getvendorFundOrPurchaseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.vendorFundPurchaseDataList = [];
        state.vendorFundPurchaseDataCount = null;
      })
  },
});

export default vendorSlice.reducer;