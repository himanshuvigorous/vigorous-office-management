import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";
import { expenseServices } from "./_expense_services";

export const getExpenseList = createAsyncThunk(
  "user/getExpenseList",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await expenseServices.getExpenseList(reqData);
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

export const expenseSearch = createAsyncThunk(
  "user/expenseSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const respose = await expenseServices.expenseSearch(reqData);
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

export const getExpenseDetails = createAsyncThunk(
  "user/getExpenseDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseServices.getExpenseDetails(reqData);
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

export const createExpense = createAsyncThunk(
  "user/createExpense",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseServices.createExpense(reqData);
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

export const updateExpense = createAsyncThunk(
  "user/updateExpense",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseServices.updateExpense(reqData);
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
export const deleteExpense = createAsyncThunk(
  "user/deleteExpense",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await expenseServices.deleteExpense(reqData);
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

const expenseSlice = createSlice({
  name: 'expenseSlice',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenseList.pending, (state, action) => {
        state.loading = true;
        state.expenseListData = [];
        state.totalExpenseListCount = 0;
      })
      .addCase(getExpenseList.fulfilled, (state, action) => {
        state.expenseListData = action.payload?.data?.docs;
        state.totalExpenseListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getExpenseList.rejected, (state, action) => {
        state.loading = false;
        state.expenseListData = [];
        state.totalExpenseListCount = 0;
      })
      .addCase(expenseSearch.pending, (state, action) => {
        state.loading = true;
        state.expenseListData = [];
        state.totalExpenseListCount = 0;
      })
      .addCase(expenseSearch.fulfilled, (state, action) => {
        state.expenseListData = action.payload?.data?.docs;
        state.totalExpenseListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(expenseSearch.rejected, (state, action) => {
        state.loading = false;
        state.expenseListData = [];
        state.totalExpenseListCount = 0;
      })
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.advanceCreateData = action.payload;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseUpdateData = action.payload;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteExpense.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseDeleteData = action.payload;
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getExpenseDetails.pending, (state) => {
        state.loading = true;
        state.expenseDetails = null;
      })
      .addCase(getExpenseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.expenseDetails = action.payload?.data;
      })
      .addCase(getExpenseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.expenseDetails = null;

      })
  },
});

export default expenseSlice.reducer;
