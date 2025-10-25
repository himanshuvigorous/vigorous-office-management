import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { visitorCatServices } from "./_visitor_categories_services";
import { showNotification } from "../../../../global_layouts/CustomNotification/NotificationManager";

export const getVisitorCatList = createAsyncThunk(
  "visitor/visitorCatList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.getVisitorCatList(reqData);
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

export const visitorCatSearch = createAsyncThunk(
  "visitor/visitorCateSearch",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.visitorCatSearch(reqData);
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

export const createVisitorCat = createAsyncThunk(
  "visitor/createVisitorCat",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.createVisitorCat(reqData);
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

export const getVisitorCatDetails = createAsyncThunk(
  "visitor/getVisitorCatDetails",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.getVisitorCatDetails(reqData);
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

export const updateVisitorCat = createAsyncThunk(
  "visitor/updateVisitorCat",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.updateVisitorCat(reqData);
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

export const deleteVisitorCat = createAsyncThunk(
  "visitor/deleteVisitorCat",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await visitorCatServices.deleteVisitorCat(reqData);
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

const visitorCatSlice = createSlice({
  name: 'visitorCategory',
  initialState: {
    visitorCatList: [],
    visitorCatDetails: {},
    loading: false,
    totalVisitorCatCount: 0
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getVisitorCatList.pending, (state, action) => {
        state.loading = true;
        state.visitorCatList = [];
        state.totalVisitorCatCount = 0;
      })
      .addCase(getVisitorCatList.fulfilled, (state, action) => {
        state.visitorCatList = action.payload?.data?.docs;
        state.totalVisitorCatCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(getVisitorCatList.rejected, (state, action) => {
        state.loading = false;
        state.visitorCatList = [];
        state.totalVisitorCatCount = 0;
      })
      .addCase(visitorCatSearch.pending, (state, action) => {
        state.loading = true;
        state.visitorCatList = [];
        state.totalVisitorCatCount = 0;
      })
      .addCase(visitorCatSearch.fulfilled, (state, action) => {
        state.visitorCatList = action.payload?.data?.docs;
        state.totalVisitorCatCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(visitorCatSearch.rejected, (state, action) => {
        state.loading = false;
        state.visitorCatList = [];
        state.totalVisitorCatCount = 0;
      })
      .addCase(createVisitorCat.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(createVisitorCat.fulfilled, (state, action) => {
        state.visitorCatList = action.payload?.data?.list;
        state.totalVisitorCatCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(createVisitorCat.rejected, (state, action) => {
        state.loading = false;
        state.visitorCatList = [];
        state.totalVisitorCatCount = 0;
      })
      .addCase(getVisitorCatDetails.pending, (state, action) => {
        state.loading = true;
        state.visitorCatDetails = {};
      })
      .addCase(getVisitorCatDetails.fulfilled, (state, action) => {
        state.visitorCatDetails = action.payload?.data;
        state.loading = false;
      })
      .addCase(getVisitorCatDetails.rejected, (state, action) => {
        state.loading = false;
        state.visitorCatDetails = {};
      });
  },
});

export default visitorCatSlice.reducer;
