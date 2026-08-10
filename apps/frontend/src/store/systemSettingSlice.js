"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const systemSettingSlice = createSlice({
  name: "systemSetting",
  initialState,
  reducers: {
    setSystemSettingLoading: (state, action) => {
      state.loading = action.payload;
    },

    setSystemSetting: (state, action) => {
      state.data = action.payload;
      state.error = null;
    },

    setSystemSettingError: (state, action) => {
      state.error = action.payload;
    },

    resetSystemSetting: () => initialState,
  },
});

export const {
  setSystemSetting,
  setSystemSettingLoading,
  setSystemSettingError,
  resetSystemSetting,
} = systemSettingSlice.actions;

export default systemSettingSlice.reducer;