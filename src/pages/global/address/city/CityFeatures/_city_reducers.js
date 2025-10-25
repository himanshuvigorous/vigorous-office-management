import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cityServices } from "./_city_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";



export const getCityList = createAsyncThunk(
  "user/getCityList",
  async (reqCityList, { rejectWithValue }) => {

    try {
      const user = await cityServices.getCityList(reqCityList);
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

export const citySearch = createAsyncThunk(
  "user/citySearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const user = await cityServices.citySearch(reqData);
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

export const secCitySearch = createAsyncThunk(
  "user/secCitySearch",
  async (reqData, { rejectWithValue }) => {

    try {
      const user = await cityServices.citySearch(reqData);
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


export const getCityById = createAsyncThunk(
  "user/getCityById",
  async (reqData, { rejectWithValue }) => {

    try {
      const user = await cityServices.getCityById(reqData);

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
export const createCityFunc = createAsyncThunk(
  "user/createCityFunc",
  async (reqData, { rejectWithValue }) => {

    try {
      const user = await cityServices.createCityFunc(reqData);
      showNotification({
        message: user?.message,
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
export const updateCityData = createAsyncThunk(
  "user/updateCityData",
  async (reqData, { rejectWithValue }) => {

    try {

      const response = await cityServices.updateCityData(reqData);
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
export const deleteCityFunc = createAsyncThunk(
  "user/deleteCityFunc",
  async (reqData, { rejectWithValue }) => {

    try {

      const user = await cityServices.deleteCityFunc(reqData);
      showNotification({
        message: user?.message,
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


const citySlice = createSlice({
  name: 'city',
  initialState: {
    cityListData: [],
    cityByIdData: {},
    totalCityCount: 0,
    secCityList: []
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCityList.pending, (state, action) => {
        state.loading = true;
        state.cityListData = [];
        state.totalCityCount = 0;
      })
      .addCase(getCityList.fulfilled, (state, action) => {
        state.cityListData = action.payload?.data;
        state.totalCityCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getCityList.rejected, (state, action) => {
        state.loading = false;
        state.cityListData = [];
        state.totalCityCount = 0;
      })
      .addCase(citySearch.pending, (state, action) => {
        state.loading = true;
        state.cityListData = [];
        state.totalCityCount = 0;
      })
      .addCase(citySearch.fulfilled, (state, action) => {
        state.cityListData = action.payload?.data;
        state.totalCityCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(citySearch.rejected, (state, action) => {
        state.loading = false;
        state.cityListData = [];
        state.totalCityCount = 0;
      })
      .addCase(secCitySearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(secCitySearch.fulfilled, (state, action) => {
        state.secCityList = action.payload?.data;
        state.totalCityCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(secCitySearch.rejected, (state, action) => {
        state.loading = false;
        state.secCityList = [];
        state.totalCityCount = 0;
      })
      .addCase(createCityFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCityFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypeCreateData = action.payload;
      })
      .addCase(createCityFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCityData.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCityData.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCityData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCityFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCityFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.GstTypetDeleteData = action.payload;
      })
      .addCase(deleteCityFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCityById.pending, (state) => {
        state.loading = true;
        state.cityByIdData = null;
      })
      .addCase(getCityById.fulfilled, (state, action) => {
        state.loading = false;
        state.cityByIdData = action.payload?.data;
      })
      .addCase(getCityById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cityByIdData = null;
      })
  },
});

export default citySlice.reducer;
