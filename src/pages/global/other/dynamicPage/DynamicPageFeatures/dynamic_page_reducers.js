import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicPageServices } from "./_dynamic_page_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";

export const getDynamicPageList = createAsyncThunk(
  "user/getDynamicPageList",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await dynamicPageServices.getDynamicPageList(reqData);
      return response;
    } catch (error) {
      // showNotification({
      //   message: error?.data?.message,
      //   type: 'error',
      // });
      return rejectWithValue(error.message);
    }
  }
);

export const getDynamicPageById = createAsyncThunk(
  "user/getDynamicPageById",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await dynamicPageServices.getDynamicPageById(reqData);
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

export const createDynamicPage = createAsyncThunk(
  "user/createDynamicPage",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await dynamicPageServices.createDynamicPage(reqData);
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

export const updateDynamicPage = createAsyncThunk(
  "user/updateDynamicPage",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await dynamicPageServices.updateDynamicPage(reqData);
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

export const deleteDynamicPage = createAsyncThunk(
  "user/deleteDynamicPage",
  async (reqData, { rejectWithValue }) => {
    try {
      const response = await dynamicPageServices.deleteDynamicPage(reqData);
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

const dynamicPageSlice = createSlice({
  name: 'dynamicPage',
  initialState: {

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getDynamicPageList.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getDynamicPageList.fulfilled, (state, action) => {
        state.pageListData = action?.payload?.data;
        state.totalpageListCount = action.payload?.data?.total;
        state.loading = false;
      })
      .addCase(getDynamicPageList.rejected, (state, action) => {
        state.loading = false;
        state.pageListData = [];
        state.totalpageListCount = 0;
      })
      .addCase(createDynamicPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDynamicPage.fulfilled, (state, action) => {
        state.loading = false;
        state.countryCreateData = action.payload;
      })
      .addCase(createDynamicPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDynamicPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDynamicPage.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPageData = action.payload;
      })
      .addCase(updateDynamicPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDynamicPage.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDynamicPage.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPagetDeleteData = action.payload;
      })
      .addCase(deleteDynamicPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getDynamicPageById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDynamicPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.dynamicPageByIdData = action.payload;
      })
      .addCase(getDynamicPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.dynamicPageByIdData = null;

      })
  },
});

export default dynamicPageSlice.reducer;
