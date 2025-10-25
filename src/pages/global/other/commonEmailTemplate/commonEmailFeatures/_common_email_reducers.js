import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { commonEmailServices } from "./_common_email_services";





export const getcommonEmailList = createAsyncThunk(
  "user/getcommonEmailList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await commonEmailServices.getcommonEmailList(reqData);
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

export const commonEmailSearch = createAsyncThunk(
  "user/commonEmailSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await commonEmailServices.commonEmailSearch(reqData);
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

export const getcommonEmailDetails = createAsyncThunk(
  "user/getcommonEmailDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await commonEmailServices.getcommonEmailDetails(reqData);
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

export const createcommonEmail = createAsyncThunk(
  "user/createcommonEmail",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await commonEmailServices.createcommonEmail(reqData);
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

export const updatecommonEmail = createAsyncThunk(
  "user/updatecommonEmail",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await commonEmailServices.updatecommonEmail(reqData);
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
export const deletecommonEmail = createAsyncThunk(
  "user/deletecommonEmail",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await commonEmailServices.deletecommonEmail(reqData);
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

const employeeDocumentSlice = createSlice({
  name: 'employeeDocument',
  initialState: {
    employeeDocumentList: [],
    totalUserDesignationCount: 0,
    employeeDocDetails: {},
    commonEmailData:[]
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getcommonEmailList.pending, (state, action) => {
        state.loading = true;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(getcommonEmailList.fulfilled, (state, action) => {
        state.commonEmailData = action.payload?.data?.docs;
        state.totalcommonEmailCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getcommonEmailList.rejected, (state, action) => {
        state.loading = false;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(commonEmailSearch.pending, (state, action) => {
        state.loading = true;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(commonEmailSearch.fulfilled, (state, action) => {
        state.commonEmailData = action.payload?.data?.docs;
        state.totalcommonEmailCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(commonEmailSearch.rejected, (state, action) => {
        state.loading = false;
        state.commonEmailData = [];
        state.totalcommonEmailCount = 0;
      })
      .addCase(createcommonEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(createcommonEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailCreateData = action.payload;
      })
      .addCase(createcommonEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatecommonEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatecommonEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailUpdateData = action.payload;
      })
      .addCase(updatecommonEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletecommonEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletecommonEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailDeleteData = action.payload;
      })
      .addCase(deletecommonEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getcommonEmailDetails.pending, (state) => {
        state.loading = true;
        state.commonEmailDetails = null;
      })
      .addCase(getcommonEmailDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.commonEmailDetails = action.payload?.data;
      })
      .addCase(getcommonEmailDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.commonEmailDetails = null;

      })
  },
});

export default employeeDocumentSlice.reducer;
