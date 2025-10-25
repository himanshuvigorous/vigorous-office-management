import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { planServices } from "./_Plan_services";
import { showNotification } from "../../../../../global_layouts/CustomNotification/NotificationManager";




export const getPlanListFunc = createAsyncThunk(
  "user/getPlanListFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await planServices.getPlanList(userData);

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

export const planSearch = createAsyncThunk(
  "user/planSearch",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await planServices.planSearch(userData);
    
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

export const getPlanByIdFunc = createAsyncThunk(
  "user/getPlanByIdFunc",
  async (userData, { rejectWithValue }) => {

    try {
      const user = await planServices.getPlanById(userData);
    
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
export const createPlanFunc = createAsyncThunk(
  "user/createPlanFunc",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await planServices.planCreate(userData);
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
export const updatePlanFunc = createAsyncThunk(
  "user/updatePlanFunc",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await planServices.planUpdate(userData);
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
export const deletePlanFunc = createAsyncThunk(
  "user/deletePlanFunc",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await planServices.planDelete(userData);
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
export const planStatus = createAsyncThunk(
  "user/planStatus",
  async (userData, { rejectWithValue }) => {

    try {
  
      const user = await planServices.planStatus(userData);
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
export const planSidbarpermission = createAsyncThunk(
  "user/planSidbarpermission",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await planServices.planSidbarpermission(userData);
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
export const planSidbarpermissionDetails = createAsyncThunk(
  "user/planSidbarpermissionDetails",
  async (userData, { rejectWithValue }) => {
    try {
      const user = await planServices.planSidbarpermissionDetails(userData);
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
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlanListFunc.pending, (state, action) => {
        state.loading = true;
        state.planListData = [];
        state.totalPlanCount = 0;
      })
      .addCase(getPlanListFunc.fulfilled, (state, action) => {
        state.planListData = action.payload?.data?.docs;
        state.totalPlanCount = action.payload?.data?.totalDocs;
        state.loading = false;
      })
      .addCase(getPlanListFunc.rejected, (state, action) => {
        state.loading = false;
        state.planListData = [];
        state.totalPlanCount = 0;
      })
      .addCase(planSearch.pending, (state, action) => {
        state.loading=true;
        state.planListData = [];
        state.totalPlanCount = 0;
   
      })
      .addCase(planSearch.fulfilled, (state, action) => {
        state.planListData = action.payload?.data?.docs;
        state.totalPlanCount = action.payload?.data?.totalDocs;

      })
      .addCase(planSearch.rejected, (state, action) => {
        state.loading = false;
        state.planListData = [];
        state.totalPlanCount = 0;
      })
      .addCase(createPlanFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPlanFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.planCreateData = action.payload;
      })
      .addCase(createPlanFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePlanFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePlanFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.PlanUpdateData = action.payload;
      })
      .addCase(updatePlanFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePlanFunc.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePlanFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.PlantDeleteData = action.payload;
      })
      .addCase(deletePlanFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPlanByIdFunc.pending, (state) => {
        state.loading = true;
        state.planByIdData = null;

      })
      .addCase(getPlanByIdFunc.fulfilled, (state, action) => {
        state.loading = false;
        state.planByIdData = action.payload;
      })
      .addCase(getPlanByIdFunc.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;        
        state.planByIdData = null;

      })
      .addCase(planStatus.pending, (state) => {
        state.loading = true;
        state.planStatusData = null;
      })
      .addCase(planStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.planStatusData = action.payload;
      })
      .addCase(planStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;        
        state.planStatusData = null;
      })
      .addCase(planSidbarpermission.pending, (state) => {
        state.loading = true;
        state.planSidbarpermissionData = null;
      })
      .addCase(planSidbarpermission.fulfilled, (state, action) => {
        state.loading = false;
        state.planSidbarpermissionData = action.payload;
      })
      .addCase(planSidbarpermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;        
        state.planSidbarpermissionData = null;
      })
      .addCase(planSidbarpermissionDetails.pending, (state) => {
        state.loading = true;
        state.planSidbarpermissionDetailsData = null;
      })
      .addCase(planSidbarpermissionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.planSidbarpermissionDetailsData = action.payload?.data;
      })
      .addCase(planSidbarpermissionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;        
        state.planSidbarpermissionDetailsData = null;
      })
  },
});

export default planSlice.reducer;
