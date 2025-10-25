import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectservicesServices } from "./_projectservices_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";









export const projectserviceSearch = createAsyncThunk(
  "getprojectserviceList/projectserviceSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectservicesServices.projectservicesSearch(reqData);
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



export const getprojectserviceListFunc = createAsyncThunk(
  "getprojectserviceList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectservicesServices.getprojectservicesList(reqData);
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




export const createprojectserviceFunc = createAsyncThunk(
  "createprojectserviceFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectservicesServices.createprojectservicesFunc(reqData);
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

export const getprojectserviceDetails = createAsyncThunk(
  "/company/getprojectserviceDetails",
  async (reqData, { rejectWithValue }) => {

    try {
      const response = await projectservicesServices.getprojectservicesDetails(reqData);
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

export const updateprojectserviceFunc = createAsyncThunk(
  "/updateprojectserviceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectservicesServices.updateprojectservicesFunc(reqData);
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

export const deleteprojectserviceFunc = createAsyncThunk(
  "/deleteprojectserviceFunc",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await projectservicesServices.deleteprojectservicesFunc(reqData);
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




const projectserviceSlice = createSlice({
  name: 'taskManagement',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getprojectserviceListFunc.pending, (state, action) => {
        state.loading = true;
        state.projectserviceList = [];
        state.totalprojectserviceCount = 0;
      })
      .addCase(getprojectserviceListFunc.fulfilled, (state, action) => {
        state.projectserviceList = action.payload?.data?.docs;
        state.totalprojectserviceCount = action.payload?.data?.totalDocs;
        state.projectserviceDetailsData = null;
        state.loading = false;
      })
      .addCase(getprojectserviceListFunc.rejected, (state, action) => {
        state.loading = false;
        state.projectserviceList = [];
        state.totalprojectserviceCount = 0;
      })
      .addCase(createprojectserviceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createprojectserviceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.createprojectserviceData = action.payload?.projectserviceinfo?.data;
      })
      .addCase(createprojectserviceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateprojectserviceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateprojectserviceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.hrupdateData = action.payload;
      })
      .addCase(updateprojectserviceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteprojectserviceFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteprojectserviceFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.userdeleteData = action.payload;
      })
      .addCase(deleteprojectserviceFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getprojectserviceDetails.pending, (state, action) => {
        state.loading = true;
        state.projectserviceDetailsData = null;
      })
      .addCase(getprojectserviceDetails.fulfilled, (state, action) => {
        state.projectserviceDetailsData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getprojectserviceDetails.rejected, (state, action) => {
        state.loading = false;
        state.projectserviceDetailsData = null;
      })




    

      .addCase(projectserviceSearch.pending, (state, action) => {
        state.loading = true;
        state.gstTypeSearch = null;
      })
      .addCase(projectserviceSearch.fulfilled, (state, action) => {
        state.projectserviceList = action.payload?.data?.docs;
        state.totalprojectserviceCount = action.payload?.data?.totalDocs;
        state.projectserviceDetailsData = null;
        state.loading = false;
      })
      .addCase(projectserviceSearch.rejected, (state, action) => {
        state.loading = false;
        state.projectserviceList = [];
        state.totalprojectserviceCount = 0;
      })
      
  },
});

export default projectserviceSlice.reducer;
