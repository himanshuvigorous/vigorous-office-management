import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";
import { standardPayrollServices } from "./_standardPayroll_services";






export const standardPayrollCreate = createAsyncThunk(
  "standardPayrollCreate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollCreate(userData);
    
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
export const getstandardPayrollList = createAsyncThunk(
  "getstandardPayrollList",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.getstandardPayrollList(userData);
    
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
export const standardPayrollListSearch = createAsyncThunk(
  "standardPayrollListSearch",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollListSearch(userData);
    
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
export const standardPayrollDetails = createAsyncThunk(
  "standardPayrollDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollDetails(userData);
    
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
export const standardPayrollUpdate = createAsyncThunk(
  "standardPayrollUpdate",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollUpdate(userData);
    
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
export const standardPayrollDelete = createAsyncThunk(
  "standardPayrollDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollDelete(userData);
    
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
export const standardPayrollStatus = createAsyncThunk(
  "standardPayrollStatus",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await standardPayrollServices.standardPayrollStatus(userData);
    
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





const attendancegSlice = createSlice({
  name: 'user',
  initialState: {
  
  },
  reducers: {
    resetStandardPayrollState: (state) => {
      state.standardPayrollCreateData = null;
      state.standardPayrollListData = [];
      state.standardPayrollListTotal = 0;
      state.standardPayrollDetailsData = {};
      state.craetestandardPayrollData = {};
      state.deletestandardPayrollData = {};
      state.statusStandardPayrollData = {};
      state.loading = false;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(standardPayrollCreate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(standardPayrollCreate.fulfilled, (state, action) => {
        state.standardPayrollCreateData = action.payload?.data;
        state.loading = false;
      })
      .addCase(standardPayrollCreate.rejected, (state, action) => {
        state.loading = false;;
      })
      .addCase(getstandardPayrollList.pending, (state, action) => {
        state.standardPayrollListData = [];
        state.standardPayrollListTotal = 0;
        state.loading = true;
      })
      .addCase(getstandardPayrollList.fulfilled, (state, action) => {
        state.standardPayrollListData = action.payload?.data?.docs;
        state.standardPayrollListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getstandardPayrollList.rejected, (state, action) => {
        state.loading = false;
        state.standardPayrollListData = [];
        state.standardPayrollListTotal = 0;
      })
      .addCase(standardPayrollListSearch.pending, (state, action) => {
        state.standardPayrollListData = [];
        state.standardPayrollListTotal = 0;
        state.loading = true;
      })
      .addCase(standardPayrollListSearch.fulfilled, (state, action) => {
        state.standardPayrollListData = action.payload?.data?.docs;
        state.standardPayrollListTotal = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(standardPayrollListSearch.rejected, (state, action) => {
        state.loading = false;
        state.standardPayrollListData = [];
        state.standardPayrollListTotal = 0;
      })
      .addCase(standardPayrollDetails.pending, (state, action) => {
         
        state.loading = true;
        state.standardPayrollDetailsData = {};
      })
      .addCase(standardPayrollDetails.fulfilled, (state, action) => {
        state.standardPayrollDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(standardPayrollDetails.rejected, (state, action) => {
        state.loading = false;
        state.standardPayrollDetailsData = {};

      })
      .addCase(standardPayrollUpdate.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(standardPayrollUpdate.fulfilled, (state, action) => {
        state.craetestandardPayrollData = action.payload?.data;
        state.loading = false;
      })
      .addCase(standardPayrollUpdate.rejected, (state, action) => {
        state.loading = false;
        state.craetestandardPayrollData = {};

      })
      .addCase(standardPayrollDelete.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(standardPayrollDelete.fulfilled, (state, action) => {
        state.deletestandardPayrollData = action.payload?.data;
        state.loading = false;
      })
      .addCase(standardPayrollDelete.rejected, (state, action) => {
        state.loading = false;
        state.craetestandardPayrollData = {};
      })
      .addCase(standardPayrollStatus.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(standardPayrollStatus.fulfilled, (state, action) => {
        state.statusStandardPayrollData = action.payload?.data;
        state.loading = false;
      })
      .addCase(standardPayrollStatus.rejected, (state, action) => {
        state.loading = false;
        state.craetestandardPayrollData = {};
      })
  
      
  },
});
export const {  resetStandardPayrollState } = attendancegSlice.actions;
export default attendancegSlice.reducer;
