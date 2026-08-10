import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboard: null,

  loading: false,

  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    setDashboard(state, action) {
      state.dashboard = action.payload;

      state.loading = false;

      state.error = null;
    },

    setDashboardLoading(state, action) {
      state.loading = action.payload;
    },

    setDashboardError(state, action) {
      state.error = action.payload;

      state.loading = false;
    },

    clearDashboard(state) {
      state.dashboard = null;

      state.loading = false;

      state.error = null;
    },
  },
});

export const {
  setDashboard,
  setDashboardLoading,
  setDashboardError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
