import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { purchaseExpenceServices } from "./_purchaseandexpence_services";






export const getpurchaseExpenceList = createAsyncThunk(
  "user/getpurchaseExpenceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await purchaseExpenceServices.getpurchaseExpenceList(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const purchaseExpenceSearch = createAsyncThunk(
  "user/purchaseExpenceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await purchaseExpenceServices.purchaseExpenceSearch(reqData);
      return respose;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getpurchaseExpenceDetails = createAsyncThunk(
  "user/getpurchaseExpenceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await purchaseExpenceServices.getpurchaseExpenceDetails(reqData);
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

export const createpurchaseExpence = createAsyncThunk(
  "user/createpurchaseExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await purchaseExpenceServices.createpurchaseExpence(reqData);
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

export const updatepurchaseExpence = createAsyncThunk(
  "user/updatepurchaseExpence",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await purchaseExpenceServices.updatepurchaseExpence(reqData);
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
export const deletepurchaseExpence = createAsyncThunk(
  "user/deletepurchaseExpence",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await purchaseExpenceServices.deletepurchaseExpence(reqData);
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

const purchaseExpenceSlice = createSlice({
  name: 'purchaseExpenceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getpurchaseExpenceList.pending, (state, action) => {
        state.loading = true;
        state.purchaseExpenceListData = [];
        state.totalpurchaseExpenceListCount = 0;
      })
      .addCase(getpurchaseExpenceList.fulfilled, (state, action) => {
        state.purchaseExpenceListData = action.payload?.data?.docs;
        state.totalpurchaseExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getpurchaseExpenceList.rejected, (state, action) => {
        state.loading = false;
        state.purchaseExpenceListData = [];
        state.totalpurchaseExpenceListCount = 0;
      })
      .addCase(purchaseExpenceSearch.pending, (state, action) => {
        state.loading = true;
        state.purchaseExpenceListData = [];
        state.totalpurchaseExpenceListCount = 0;
      })
      .addCase(purchaseExpenceSearch.fulfilled, (state, action) => {
        state.purchaseExpenceListData = action.payload?.data?.docs;
        state.totalpurchaseExpenceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(purchaseExpenceSearch.rejected, (state, action) => {
        state.loading = false;
        state.purchaseExpenceListData = [];
        state.totalpurchaseExpenceListCount = 0;
      })
      .addCase(createpurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(createpurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseExpenceCreateData = action.payload;
      })
      .addCase(createpurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatepurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatepurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseExpenceUpdateData = action.payload;
      })
      .addCase(updatepurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletepurchaseExpence.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletepurchaseExpence.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseExpenceDeleteData = action.payload;
      })
      .addCase(deletepurchaseExpence.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getpurchaseExpenceDetails.pending, (state) => {
        state.loading = true;
        state.purchaseExpenceDetails = null;
      })
      .addCase(getpurchaseExpenceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseExpenceDetails = action.payload?.data;
      })
      .addCase(getpurchaseExpenceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.purchaseExpenceDetails = null;

      })
  },
});

export default purchaseExpenceSlice.reducer;
