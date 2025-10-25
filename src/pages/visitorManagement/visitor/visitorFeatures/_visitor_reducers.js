import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { visitorServices } from "./_visitor_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";

export const getVisitorList = createAsyncThunk(
  "visitor/visitorList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.getVisitorList(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const getGeneralVisitorList = createAsyncThunk(
  "visitor/getGeneralVisitorList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.getGeneralVisitorList(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);


export const visitorSearch = createAsyncThunk(
  "visitor/visitorSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.visitorSearch(reqData);
      return response;
    } catch (error) {
      showNotification({
        message: error?.message,
        type: 'error',
      });
      return rejectWithValue(error.message);
    }
  }
);

export const createVisitor = createAsyncThunk(
  "visitor/createVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.createVisitor(reqData);
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


export const createGeneralVisitor = createAsyncThunk(
  "visitor/createGeneralVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.createGeneralVisitor(reqData);
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

export const getVisitorDetails = createAsyncThunk(
  "visitor/getVisitorDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.getVisitorDetails(reqData);
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

export const getGeneralVisitorDetails = createAsyncThunk(
  "visitor/getGeneralVisitorDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.getGeneralVisitorDetails(reqData);
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
export const updateVisitor = createAsyncThunk(
  "visitor/updateVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.updateVisitor(reqData);
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

export const updateGeneralVisitor = createAsyncThunk(
  "visitor/updateGeneralVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.updateGeneralVisitor(reqData);
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

export const deleteVisitor = createAsyncThunk(
  "visitor/deleteVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.deleteVisitor(reqData);
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

export const deleteGeneralVisitor = createAsyncThunk(
  "visitor/deleteGeneralVisitor",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorServices.deleteGeneralVisitor(reqData);
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


const visitorSlice = createSlice({
  name: 'visitor',
  initialState: {
    visitorList: [],
    loading: false,
    totalVisitorCount: 0
  },
  
  reducers: {
    resetState : (state)=>{
state.visitorDetails = null
state.generalVisitorDetails = null
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getVisitorList.pending, (state, action) => {
        state.loading = true;
        state.visitorList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(getVisitorList.fulfilled, (state, action) => {
        state.visitorList = action.payload?.data?.docs;
        state.totalVisitorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getVisitorList.rejected, (state, action) => {
        state.loading = false;
        state.visitorList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(getGeneralVisitorList.pending, (state, action) => {
        state.loading = true;
        state.visitorGeneralList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(getGeneralVisitorList.fulfilled, (state, action) => {
        state.visitorGeneralList = action.payload?.data?.docs;
        state.totalVisitorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getGeneralVisitorList.rejected, (state, action) => {
        state.loading = false;
        state.visitorGeneralList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(visitorSearch.pending, (state, action) => {
        state.loading = true;
        state.visitorList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(visitorSearch.fulfilled, (state, action) => {
        state.visitorList = action.payload?.data?.docs;
        state.totalVisitorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(visitorSearch.rejected, (state, action) => {
        state.loading = false;
        state.visitorList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(createVisitor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createVisitor.fulfilled, (state, action) => {
        state.visitorList = action.payload?.data?.list;
        state.totalVisitorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(createVisitor.rejected, (state, action) => {
        state.loading = false;
        state.visitorList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(createGeneralVisitor.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createGeneralVisitor.fulfilled, (state, action) => {
        state.visitorGeneralList = action.payload?.data?.list;
        state.totalVisitorCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(createGeneralVisitor.rejected, (state, action) => {
        state.loading = false;
        state.visitorGeneralList = [];
        state.totalVisitorCount = 0;
      })
      .addCase(getVisitorDetails.pending, (state, action) => {
        state.loading = true;
        state.visitorDetails = null;
      })
      .addCase(getVisitorDetails.fulfilled, (state, action) => {
        state.visitorDetails = action.payload?.data;
        state.loading = false;
      })
      .addCase(getVisitorDetails.rejected, (state, action) => {
        state.loading = false;
        state.visitorDetails = null;
      })
      .addCase(getGeneralVisitorDetails.pending, (state, action) => {
        state.loading = true;
        state.generalVisitorDetails = null;
      })
      .addCase(getGeneralVisitorDetails.fulfilled, (state, action) => {
        state.generalVisitorDetails = action.payload?.data;
        state.loading = false;
      })
      .addCase(getGeneralVisitorDetails.rejected, (state, action) => {
        state.loading = false;
        state.generalVisitorDetails = null;
      })
      
      

  },
});
export const  {resetState}  = visitorSlice.actions
export default visitorSlice.reducer;
