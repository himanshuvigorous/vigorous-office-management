import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyPageServices } from "./_companyPage_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";





export const getCompanyPageList = createAsyncThunk(
  "user/getCompanyPageList",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyPageServices.getCompanyPageList(userData);

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

// export const countrySearch = createAsyncThunk(
//   "user/countrySearch",
//   async (userData, { rejectWithValue }) => {

//     try {
//       const user = await companyPageServices.countrySearch(userData);

//       return user;
//     } catch (error) {
//       showNotification({
//         message: error?.data?.message,
//         type: 'error',
//       });
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const getCompanyPageById = createAsyncThunk(
  "user/getCompanyPageById",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await companyPageServices.getCompanyPageById(userData);

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
export const companyPageCreate = createAsyncThunk(
  "user/companyPageCreate",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await companyPageServices.companyPageCreate(userData);
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
export const companyPageUpdate = createAsyncThunk(
  "user/companyPageUpdate",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await companyPageServices.companyPageUpdate(userData);
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
export const companyPageDelete = createAsyncThunk(
  "user/companyPageDelete",
  async (userData, { rejectWithValue }) => {

    try {

      const user = await companyPageServices.companyPageDelete(userData);
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

  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getCompanyPageList.pending, (state, action) => {
        state.loading = true;
        state.pageListData = [];
        state.totalpageListCount = 0;
      })
      .addCase(getCompanyPageList.fulfilled, (state, action) => {
        state.pageListData = action?.payload?.data;
        state.totalpageListCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getCompanyPageList.rejected, (state, action) => {
        state.loading = false;
        state.pageListData = [];
        state.totalpageListCount = 0;
      })
      // .addCase(countrySearch.pending, (state, action) => {
      //   state.loading = true;
      // })
      // .addCase(countrySearch.fulfilled, (state, action) => {
      //   state.countryListData = action.payload?.data?.list;
      //   state.totalCountryCount = action.payload?.data?.total;
      //   state.loading = false;
      // })
      // .addCase(countrySearch.rejected, (state, action) => {
      //   state.loading = true;
      // state.pageListData = [];
      // state.totalpageListCount = 0;
      // })
      .addCase(companyPageCreate.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyPageCreate.fulfilled, (state, action) => {
        state.loading = false;
        state.countryCreateData = action.payload;
      })
      .addCase(companyPageCreate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(companyPageUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyPageUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPageData = action.payload;
      })
      .addCase(companyPageUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(companyPageDelete.pending, (state) => {
        state.loading = true;
      })
      .addCase(companyPageDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPagetDeleteData = action.payload;
      })
      .addCase(companyPageDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCompanyPageById.pending, (state) => {
        state.loading = true;
        state.companyPageByIdData = null;
      })
      .addCase(getCompanyPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyPageByIdData = action.payload;
      })
      .addCase(getCompanyPageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.companyPageByIdData = null;
      })
  },
});

export default countrySlice.reducer;
