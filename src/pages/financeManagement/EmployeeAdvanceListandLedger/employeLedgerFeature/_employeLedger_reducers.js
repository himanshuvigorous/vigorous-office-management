import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { employeLedgerServices } from "./_employeLedger_services";








export const getemployeLedgerList = createAsyncThunk(
  "user/getemployeLedgerList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeLedgerServices.getemployeLedgerList(reqData);
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

export const employeLedgerSearch = createAsyncThunk(
  "user/employeLedgerSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await employeLedgerServices.employeLedgerSearch(reqData);
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

export const getemployeLedgerDetails = createAsyncThunk(
  "user/getemployeLedgerDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeLedgerServices.getemployeLedgerDetails(reqData);
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

export const createemployeLedger = createAsyncThunk(
  "user/createemployeLedger",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeLedgerServices.createemployeLedger(reqData);
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

export const updateemployeLedger = createAsyncThunk(
  "user/updateemployeLedger",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await employeLedgerServices.updateemployeLedger(reqData);
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
export const deleteemployeLedger = createAsyncThunk(
  "user/deleteemployeLedger",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await employeLedgerServices.deleteemployeLedger(reqData);
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

const employeLedgerSlice = createSlice({
  name: 'employeLedgerSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getemployeLedgerList.pending, (state, action) => {
        state.loading = true;
        state.employeLedgerListData = [];
        state.totalEmployeLedgerListCount = 0;
      })
      .addCase(getemployeLedgerList.fulfilled, (state, action) => {
        state.employeLedgerListData = action.payload?.data?.docs;
        state.totalEmployeLedgerListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getemployeLedgerList.rejected, (state, action) => {
        state.loading = false;
        state.employeLedgerListData = [];
        state.totalEmployeLedgerListCount = 0;
      })
      .addCase(employeLedgerSearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(employeLedgerSearch.fulfilled, (state, action) => {
        state.employeLedgerListData = action.payload?.data?.docs;
        state.totalemployeLedgerListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(employeLedgerSearch.rejected, (state, action) => {
        state.loading = false;
        state.employeLedgerListData = [];
        state.totalemployeLedgerListCount = 0;
      })
      .addCase(createemployeLedger.pending, (state) => {
        state.loading = true;
      })
      .addCase(createemployeLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.employeLedgerCreateData = action.payload;
      })
      .addCase(createemployeLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateemployeLedger.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateemployeLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.employeLedgerUpdateData = action.payload;
      })
      .addCase(updateemployeLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteemployeLedger.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteemployeLedger.fulfilled, (state, action) => {
        state.loading = false;
        state.employeLedgerDeleteData = action.payload;
      })
      .addCase(deleteemployeLedger.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getemployeLedgerDetails.pending, (state) => {
        state.loading = true;
        state.employeLedgerDetails = null;
        
      })
      .addCase(getemployeLedgerDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.employeLedgerDetails = action.payload?.data;
      })
      .addCase(getemployeLedgerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.employeLedgerDetails = null;

      })
  },
});

export default employeLedgerSlice.reducer;
