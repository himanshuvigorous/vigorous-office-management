import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { countryServices } from "./_country_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";

export const getCountryListFunc = createAsyncThunk(
  "user/getCountryListFunc",
  async (countryReqData, { rejectWithValue }) => {

    try {
      const user = await countryServices.getCountryList(countryReqData);

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

export const countrySearch = createAsyncThunk(
  "user/countrySearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await countryServices.countrySearch(userData);

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

export const secCountrySearch = createAsyncThunk(
  "user/secCountrySearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await countryServices.countrySearch(userData);

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
export const countrycodeSearch = createAsyncThunk(
  "user/countrycodeSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await countryServices.countrySearch(userData);

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

export const getCountryByIdFunc = createAsyncThunk(
  "user/getCountryByIdFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await countryServices.getCountryById(userData);

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
export const createCountryFunc = createAsyncThunk(
  "user/createCountryFunc",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await countryServices.countryCreate(userData);
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
export const updateCountryFunc = createAsyncThunk(
  "user/updateCountryFunc",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await countryServices.countryUpdate(userData);
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
export const deleteCountryFunc = createAsyncThunk(
  "user/deleteCountryFunc",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await countryServices.countryDelete(userData);
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


const countrySlice = createSlice({
  name: 'Country',
  initialState: {
    secCountryList: []
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCountryListFunc.pending, (state, action) => {
        state.loading = true;
        state.countryListData = [];
        state.totalCountryCount = 0;
      })
      .addCase(getCountryListFunc.fulfilled, (state, action) => {
        state.countryListData = action.payload?.data;
        state.totalCountryCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getCountryListFunc.rejected, (state, action) => {
        state.loading = false;
        state.countryListData = [];
        state.totalCountryCount = 0;
      })
      .addCase(countrycodeSearch.pending, (state, action) => {
        state.loadingCodes = true;
        state.countrycodeListData = [];
        state.totalCountryCodeCount = 0;
      })
      .addCase(countrycodeSearch.fulfilled, (state, action) => {
        state.countrycodeListData = action.payload?.data;
        state.totalCountryCodeCount = action.payload?.data?.totalDocs;
        state.loadingCodes = false;
      })
      .addCase(countrycodeSearch.rejected, (state, action) => {
        state.loadingCodes = false;
        state.countrycodeListData = [];
        state.totalCountryCodeCount = 0;
      })
      .addCase(countrySearch.pending, (state, action) => {
        state.loading = true;
        state.countryListData = [];
        state.totalCountryCount = 0;
      })
      .addCase(countrySearch.fulfilled, (state, action) => {
        state.countryListData = action.payload?.data;
        state.totalCountryCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(countrySearch.rejected, (state, action) => {
        state.loading = false;
        state.countryListData = [];
        state.totalCountryCount = 0;
      })
      .addCase(secCountrySearch.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(secCountrySearch.fulfilled, (state, action) => {
        state.secCountryList = action.payload?.data;
        state.totalCountryCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(secCountrySearch.rejected, (state, action) => {
        state.loading = false;
        state.secCountryList = [];
        state.totalCountryCount = 0;
      })
      .addCase(createCountryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCountryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.countryCreateData = action.payload;
      })
      .addCase(createCountryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCountryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCountryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.countryUpdateData = action.payload;
      })
      .addCase(updateCountryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCountryFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCountryFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.countrytDeleteData = action.payload;
      })
      .addCase(deleteCountryFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCountryByIdFunc.pending, (state) => {
        state.loading = true;
        state.countryByIdData = null;
      })
      .addCase(getCountryByIdFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.countryByIdData = action.payload;
      })
      .addCase(getCountryByIdFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.countryByIdData = null;
      })
  },
});

export default countrySlice.reducer;