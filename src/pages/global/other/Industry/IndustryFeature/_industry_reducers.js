import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IndustryServices } from "./_industry_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";



export const getIndustryListFunc = createAsyncThunk(
  "user/getIndustryListFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await IndustryServices.getIndustryList(userData);
    
      return user;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const indusSearch = createAsyncThunk(
  "user/indusSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await IndustryServices.indusSearch(userData);
      return user;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getIndustryByIdFunc = createAsyncThunk(
  "user/getIndustryByIdFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await IndustryServices.getIndustryById(userData);
    
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const createIndustryFunc = createAsyncThunk(
  "user/createIndustryFunc",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await IndustryServices.industryCreate(userData);
      showNotification({
        message: user?.userinfo?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const updateIndustryFunc = createAsyncThunk(
  "user/updateIndustryFunc",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await IndustryServices.industryUpdate(userData);
      showNotification({
        message: user?.userinfo?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);
export const deleteIndustryFunc = createAsyncThunk(
  "user/deleteIndustryFunc",
  async (userData, { rejectWithValue }) => {

    try {  
      const user = await IndustryServices.industryDelete(userData);
      showNotification({
        message: user?.userinfo?.message,
        type: 'success',
      });
      return user;
    } catch (error) {
      showNotification({
        message: error?.data?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);


const industrySlice = createSlice({
  name: 'Industry',
  initialState: {
  
  },
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIndustryListFunc.pending, (state, action) => {
        state.loading = true;
        state.industryListData = [];
        state.totalIndustryCount = 0;
      })
      .addCase(getIndustryListFunc.fulfilled, (state, action) => {
        state.industryListData = action.payload?.data?.docs;
        state.totalIndustryCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getIndustryListFunc.rejected, (state, action) => {
        state.loading = false;
        state.industryListData = [];
        state.totalIndustryCount = 0;
      })
      .addCase(indusSearch.pending, (state, action) => {
        state.indusSearchloading = true;
        state.industryListData = [];
        state.totalIndustryCount = 0;
      })
      .addCase(indusSearch.fulfilled, (state, action) => {
        state.industryListData = action.payload?.data?.docs;
        state.totalIndustryCount = action.payload?.data?.totalDocs;
        state.indusSearchloading = false;
      })
      .addCase(indusSearch.rejected, (state, action) => {
        state.indusSearchloading = false;
        state.industryListData = [];
        state.totalIndustryCount = 0;
      })
      .addCase(createIndustryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createIndustryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.industryCreateData = action.payload;
      })
      .addCase(createIndustryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateIndustryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIndustryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.industryUpdateData = action.payload;
      })
      .addCase(updateIndustryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteIndustryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteIndustryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.industrytDeleteData = action.payload;
      })
      .addCase(deleteIndustryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getIndustryByIdFunc.pending, (state) => {
        state.loading = true;
        state.industryByIdData = null;
      })
      .addCase(getIndustryByIdFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.industryByIdData = action.payload;
      })
      .addCase(getIndustryByIdFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.industryByIdData = null;

      })
  },
});

export default industrySlice.reducer;
