import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { LeadCategoryServices } from "./_LeadCategory_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";


export const getLeadCategoryList = createAsyncThunk(
  "user/LeadCategoryList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await LeadCategoryServices.getLeadCategoryList(reqData);
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



export const getLeadCategoryById = createAsyncThunk(
  "user/getLeadCategoryById",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadCategoryServices.getLeadCategoryById(userData);
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

export const createLeadCategoryFunc = createAsyncThunk(
  "user/createLeadCategoryFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadCategoryServices.LeadCategoryCreate(userData);
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

export const updateLeadCategoryFunc = createAsyncThunk(
  "user/updateLeadCategoryFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadCategoryServices.LeadCategoryUpdate(userData);
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

export const deleteLeadCategoryFunc = createAsyncThunk(
  "user/deleteLeadCategoryFunc",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LeadCategoryServices.LeadCategoryDelete(userData);
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

const LeadCategorySlice = createSlice({
  name: 'LeadCategory',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getLeadCategoryList.pending, (state, action) => {
        state.loading = true;
        state.LeadCategoryListData = [];
        state.totalLeadCategoryCount = 0;
      })
      .addCase(getLeadCategoryList.fulfilled, (state, action) => {
        state.LeadCategoryListData = action.payload?.data?.docs;
        state.totalLeadCategoryCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getLeadCategoryList.rejected, (state, action) => {
        state.loading = false;
        state.LeadCategoryListData = [];
        state.totalLeadCategoryCount = 0;
      })
      .addCase(createLeadCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createLeadCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadCategoryCreateData = action.payload;
      })
      .addCase(createLeadCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLeadCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLeadCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadCategoryUpdateData = action.payload;
      })
      .addCase(updateLeadCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteLeadCategoryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLeadCategoryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadCategoryDeleteData = action.payload;
      })
      .addCase(deleteLeadCategoryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getLeadCategoryById.pending, (state) => {
        state.loading = true;
        state.LeadCategoryByIdData = null;
      })

      .addCase(getLeadCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.LeadCategoryByIdData = action.payload?.data;
      })
      .addCase(getLeadCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.LeadCategoryByIdData = null;
      })
  },
});

export default LeadCategorySlice.reducer;
