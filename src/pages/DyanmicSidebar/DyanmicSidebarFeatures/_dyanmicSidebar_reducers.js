import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dyanmicSidebarServices } from "./_dyanmicSidebar_services";
import { showNotification } from "../../../global_layouts/CustomNotification/NotificationManager";




export const getsidebarList = createAsyncThunk(
  "user/getsidebarList",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await dyanmicSidebarServices.getsidebarList(userData);

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
export const getviewFinalsidebarList = createAsyncThunk(
  "user/getviewFinalsidebarList",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await dyanmicSidebarServices.getviewFinalsidebarList(userData);

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

export const dynamicSidebarSearch = createAsyncThunk(
  "user/dynamicSidebarSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await dyanmicSidebarServices.dynamicSidebarSearch(userData);

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

export const getsidebarById = createAsyncThunk(
  "user/getsidebarById",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await dyanmicSidebarServices.getsidebarById(userData);

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
export const dynamicSidebarCreate = createAsyncThunk(
  "user/dynamicSidebarCreate",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await dyanmicSidebarServices.dynamicSidebarCreate(userData);
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
export const dynamicSidebarOrder = createAsyncThunk(
  "user/dynamicSidebarOrder",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await dyanmicSidebarServices.dynamicSidebarOrder(userData);
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
export const dynamicPageUpdate = createAsyncThunk(
  "user/dynamicPageUpdate",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await dyanmicSidebarServices.dynamicPageUpdate(userData);
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
export const dynamicSidebarDelete = createAsyncThunk(
  "user/dynamicSidebarDelete",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await dyanmicSidebarServices.dynamicSidebarDelete(userData);
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
const planSlice = createSlice({
  name: 'Plan',
  initialState: {
  },
  reducers: {
    setFinalSidebarData: (state, action) => {
      state.finalSidebarData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getsidebarList.pending, (state, action) => {
        state.loading = true;
        state.sidebarListData = [];
        state.totalsidebarListDataCount = 0;
      })
      .addCase(getsidebarList.fulfilled, (state, action) => {
        state.sidebarListData = action.payload?.data?.docs;
        state.totalsidebarListDataCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getsidebarList.rejected, (state, action) => {
        state.loading = false;
        state.sidebarListData = [];
        state.totalsidebarListDataCount = 0;
      })
      .addCase(getviewFinalsidebarList.pending, (state, action) => {
        state.loading = true;
        state.sidebarViewData = [];
      })
      .addCase(getviewFinalsidebarList.fulfilled, (state, action) => {
        state.sidebarViewData = action.payload?.data;
        state.loading = false;
      })
      .addCase(getviewFinalsidebarList.rejected, (state, action) => {
        state.loading = false;
        state.sidebarViewData = [];
      })
      .addCase(dynamicSidebarSearch.pending, (state, action) => {
        state.loading = false;
        state.sidebarListData = [];
        state.totalsidebarListDataCount = 0;
      })
      .addCase(dynamicSidebarSearch.fulfilled, (state, action) => {
        state.sidebarListData = action.payload?.data?.docs;
        state.totalsidebarListDataCount = action.payload?.data?.totalDocs;
        state.loading = false;

      })
      .addCase(dynamicSidebarSearch.rejected, (state, action) => {
        state.loading = false;
        state.sidebarListData = [];
        state.totalsidebarListDataCount = 0;
      })
      .addCase(dynamicSidebarCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(dynamicSidebarCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarCreateData = action.payload;
      })
      .addCase(dynamicSidebarCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(dynamicPageUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(dynamicPageUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarUpdateData = action.payload;
      })
      .addCase(dynamicPageUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(dynamicSidebarOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(dynamicSidebarOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarUpdateData = action.payload;
      })
      .addCase(dynamicSidebarOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(dynamicSidebarDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(dynamicSidebarDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarDeleteData = action.payload;
      })
      .addCase(dynamicSidebarDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getsidebarById.pending, (state) => {
        state.loading = true;
        state.sidebarDetailsData = null;
      })
      .addCase(getsidebarById.fulfilled, (state, action) => {
        state.loading = false;
        state.sidebarDetailsData = action.payload;
      })
      .addCase(getsidebarById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.sidebarDetailsData = null;

      })
  },
});

export const { setFinalSidebarData } = planSlice.actions;
export default planSlice.reducer;
