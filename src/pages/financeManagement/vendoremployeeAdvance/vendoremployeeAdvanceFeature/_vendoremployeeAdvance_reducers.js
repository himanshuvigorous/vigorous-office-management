import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { vendoremployeeAdvanceServices } from "./_vendoremployeeAdvance_services";







export const getvendoremployeeAdvanceList = createAsyncThunk(
  "user/getvendoremployeeAdvanceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await vendoremployeeAdvanceServices.getvendoremployeeAdvanceList(reqData);
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

export const vendoremployeeAdvanceSearch = createAsyncThunk(
  "user/vendoremployeeAdvanceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await vendoremployeeAdvanceServices.vendoremployeeAdvanceSearch(reqData);
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

export const getvendoremployeeAdvanceDetails = createAsyncThunk(
  "user/getvendoremployeeAdvanceDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendoremployeeAdvanceServices.getvendoremployeeAdvanceDetails(reqData);
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

export const createvendoremployeeAdvance = createAsyncThunk(
  "user/createvendoremployeeAdvance",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendoremployeeAdvanceServices.createvendoremployeeAdvance(reqData);
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

export const updatevendoremployeeAdvance = createAsyncThunk(
  "user/updatevendoremployeeAdvance",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await vendoremployeeAdvanceServices.updatevendoremployeeAdvance(reqData);
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
export const deletevendoremployeeAdvance = createAsyncThunk(
  "user/deletevendoremployeeAdvance",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await vendoremployeeAdvanceServices.deletevendoremployeeAdvance(reqData);
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

const vendoremployeeAdvanceSlice = createSlice({
  name: 'vendoremployeeAdvanceSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getvendoremployeeAdvanceList.pending, (state, action) => {
        state.loading = true;
        state.vendoremployeeAdvanceListData = [];
        state.totalvendoremployeeAdvanceListCount = 0;
      })
      .addCase(getvendoremployeeAdvanceList.fulfilled, (state, action) => {
        state.vendoremployeeAdvanceListData = action.payload?.data?.docs;
        state.totalvendoremployeeAdvanceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getvendoremployeeAdvanceList.rejected, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceListData = [];
        state.totalvendoremployeeAdvanceListCount = 0;
      })
      .addCase(vendoremployeeAdvanceSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(vendoremployeeAdvanceSearch.fulfilled, (state, action) => {
        state.vendoremployeeAdvanceListData = action.payload?.data?.docs;
        state.totalvendoremployeeAdvanceListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(vendoremployeeAdvanceSearch.rejected, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceListData = [];
        state.totalvendoremployeeAdvanceListCount = 0;
      })
      .addCase(createvendoremployeeAdvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(createvendoremployeeAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceCreateData = action.payload;
      })
      .addCase(createvendoremployeeAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatevendoremployeeAdvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatevendoremployeeAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceUpdateData = action.payload;
      })
      .addCase(updatevendoremployeeAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletevendoremployeeAdvance.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletevendoremployeeAdvance.fulfilled, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceDeleteData = action.payload;
      })
      .addCase(deletevendoremployeeAdvance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getvendoremployeeAdvanceDetails.pending, (state) => {
        state.loading = true;
        state.vendoremployeeAdvanceDetails = null;
        
      })
      .addCase(getvendoremployeeAdvanceDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.vendoremployeeAdvanceDetails = action.payload?.data;
      })
      .addCase(getvendoremployeeAdvanceDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.vendoremployeeAdvanceDetails = null;

      })
  },
});

export default vendoremployeeAdvanceSlice.reducer;
