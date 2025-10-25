import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { expenseTypeServices } from "./_expenseType_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";









export const expenseTypeSearch = createAsyncThunk(
  "getExpenseTypeList/expenseTypeSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseTypeServices.expenseTypeSearch(reqData);
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



export const getExpenseTypeListFunc = createAsyncThunk(
  "getExpenseTypeList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseTypeServices.getExpenseTypeList(reqData);
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

export const getRoleList = createAsyncThunk(
  "getRoleList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await expenseTypeServices.getRoleList();
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


export const createExpenseTypeFunc = createAsyncThunk(
  "createExpenseTypeFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await expenseTypeServices.createExpenseTypeFunc(reqData);
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

export const getExpenseTypeDetails = createAsyncThunk(
  "/company/getExpenseTypeDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await expenseTypeServices.getExpenseTypeDetails(reqData);
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

export const updateExpenseTypeFunc = createAsyncThunk(
  "/updateExpenseTypeFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseTypeServices.updateExpenseTypeFunc(reqData);
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

export const deleteExpenseTypeFunc = createAsyncThunk(
  "/deleteExpenseTypeFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await expenseTypeServices.deleteExpenseTypeFunc(reqData);
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




const expenseTypeSlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getExpenseTypeListFunc.pending, (state, action) => {
        state.loading = true;
        state.expenseTypeList = [];
        state.totalExpenseTypeCount = 0;
      })
      .addCase(getExpenseTypeListFunc.fulfilled, (state, action) => {
        state.expenseTypeList = action.payload?.data?.docs;
        state.totalExpenseTypeCount = action.payload?.data?.totalDocs;
        state.expenseTypeDetailsData = null;
        state.loading = false;
      })
      .addCase(getExpenseTypeListFunc.rejected, (state, action) => {
        state.loading = false;
        state.expenseTypeList = [];
        state.totalExpenseTypeCount = 0;
      })
      .addCase(createExpenseTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createExpenseTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createExpenseTypeData = action.payload?.expenseTypeinfo?.data;
      })
      .addCase(createExpenseTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExpenseTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExpenseTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateExpenseTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteExpenseTypeFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExpenseTypeFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteExpenseTypeFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getExpenseTypeDetails.pending, (state, action) => {
        state.loading = true;
        state.expenseTypeDetailsData = null;
      })
      .addCase(getExpenseTypeDetails.fulfilled, (state, action) => {
        state.expenseTypeDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getExpenseTypeDetails.rejected, (state, action) => {
        state.loading = false;
        state.expenseTypeDetailsData = null;
      })




    

      .addCase(expenseTypeSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(expenseTypeSearch.fulfilled, (state, action) => {
        state.expenseTypeList = action.payload?.data?.docs;
        state.totalExpenseTypeCount = action.payload?.data?.totalDocs;
        state.expenseTypeDetailsData = null;
        state.loading = false;
      })
      .addCase(expenseTypeSearch.rejected, (state, action) => {
        state.loading = false;
        state.expenseTypeList = [];
        state.totalExpenseTypeCount = 0;
      })
      
  },
});

export default expenseTypeSlice.reducer;
