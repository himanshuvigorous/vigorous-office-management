import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { bankNameServices } from "./_bankName_services";

export const getbankNameList = createAsyncThunk(
  "user/bankNameList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.getbankNameList(reqData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const banknameSearch = createAsyncThunk(
  "user/banknameSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.bankNameSearch(userData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getbankNameById = createAsyncThunk(
  "user/getbankNameById",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.getbankNameById(userData);
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

export const createbankNameFunc = createAsyncThunk(
  "user/createbankNameFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.bankNameCreate(userData);
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

export const updatebankNameFunc = createAsyncThunk(
  "user/updatebankNameFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.bankNameUpdate(userData);
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

export const deletebankNameFunc = createAsyncThunk(
  "user/deletebankNameFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await bankNameServices.bankNameDelete(userData);
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

const bankNameSlice = createSlice({
  name: 'bankName',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getbankNameList.pending, (state, action) => {
        state.loading = true;
        state.bankNameListData = [];
        state.totalbankNameCount = 0;
      })
      .addCase(getbankNameList.fulfilled, (state, action) => {
        state.bankNameListData = action.payload?.data?.docs;
        state.totalbankNameCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getbankNameList.rejected, (state, action) => {
        state.loading = false;
        state.bankNameListData = [];
        state.totalbankNameCount = 0;
      })
      .addCase(banknameSearch.pending, (state, action) => {
        state.bankNameLoading = true;
        state.bankNameListData = [];
        state.totalbankNameCount = 0;
      })
      .addCase(banknameSearch.fulfilled, (state, action) => {
        state.bankNameListData = action.payload?.data?.docs;
        state.totalbankNameCount = action.payload?.data?.totalDocs;
        state.bankNameLoading = false;
      })
      .addCase(banknameSearch.rejected, (state, action) => {
        state.bankNameLoading = false;
        state.bankNameListData = [];
        state.totalbankNameCount = 0;
      })
      .addCase(createbankNameFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createbankNameFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.bankNameCreateData = action.payload;
      })
      .addCase(createbankNameFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatebankNameFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatebankNameFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.bankNameUpdateData = action.payload;
      })
      .addCase(updatebankNameFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletebankNameFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletebankNameFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.bankNameDeleteData = action.payload;
      })
      .addCase(deletebankNameFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getbankNameById.pending, (state) => {
        state.loading = true;
        state.bankNameByIdData = null;
      })

      .addCase(getbankNameById.fulfilled, (state, action) => {
        state.loading = false;
        state.bankNameByIdData = action.payload;
      })
      .addCase(getbankNameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.bankNameByIdData = null;
      })
  },
});

export default bankNameSlice.reducer;
