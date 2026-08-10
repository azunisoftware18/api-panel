import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page: 1,
  limit: 10,

  search: "",

  entryType: "",
  referenceType: "",
  walletType: "",

  fromDate: "",
  toDate: "",

  selectedLedger: null,
};

const ledgerSlice = createSlice({
  name: "ledger",

  initialState,

  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },

    setLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1;
    },

    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1;
    },

    setEntryType: (state, action) => {
      state.entryType = action.payload;
      state.page = 1;
    },

    setReferenceType: (state, action) => {
      state.referenceType = action.payload;
      state.page = 1;
    },

    setWalletType: (state, action) => {
      state.walletType = action.payload;
      state.page = 1;
    },

    setFromDate: (state, action) => {
      state.fromDate = action.payload;
      state.page = 1;
    },

    setToDate: (state, action) => {
      state.toDate = action.payload;
      state.page = 1;
    },

    setDateRange: (state, action) => {
      state.fromDate = action.payload.fromDate;
      state.toDate = action.payload.toDate;
      state.page = 1;
    },

    setSelectedLedger: (state, action) => {
      state.selectedLedger = action.payload;
    },

    clearSelectedLedger: (state) => {
      state.selectedLedger = null;
    },

    resetFilters: (state) => {
      state.page = 1;
      state.limit = 10;

      state.search = "";

      state.entryType = "";
      state.referenceType = "";
      state.walletType = "";

      state.fromDate = "";
      state.toDate = "";

      state.selectedLedger = null;
    },
  },
});

export const {
  setPage,
  setLimit,
  setSearch,
  setEntryType,
  setReferenceType,
  setWalletType,
  setFromDate,
  setToDate,
  setDateRange,
  setSelectedLedger,
  clearSelectedLedger,
  resetFilters,
} = ledgerSlice.actions;

export default ledgerSlice.reducer;
