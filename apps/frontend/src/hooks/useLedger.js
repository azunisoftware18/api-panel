import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

// GET ALL LEDGER ENTRIES
export const useGetAllLedger = ({
  page = 1,
  limit = 10,
  search = "",
  entryType = "",
  referenceType = "",
  walletType = "",
  fromDate = "",
  toDate = "",
}) =>
  useQuery({
    queryKey: [
      "ledger",
      page,
      limit,
      search,
      entryType,
      referenceType,
      walletType,
      fromDate,
      toDate,
    ],

    queryFn: async () => {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("limit", limit);

      if (search) {
        params.append("search", search);
      }

      if (entryType) {
        params.append("entryType", entryType);
      }

      if (referenceType) {
        params.append("referenceType", referenceType);
      }

      if (walletType) {
        params.append("walletType", walletType);
      }

      if (fromDate) {
        params.append("fromDate", fromDate);
      }

      if (toDate) {
        params.append("toDate", toDate);
      }

      return apiClient(`/ledger-entries?${params.toString()}`, {
        method: "GET",
      });
    },

    keepPreviousData: true,
  });

// GET ONE LEDGER (Optional)
// export const useGetOneLedger = () =>
//   useQuery({
//     enabled: false,
//     queryKey: ["ledger-one"],

//     queryFn: async ({ queryKey }) => {
//       const [, id] = queryKey;

//       return apiClient(`/ledger/${id}`, {
//         method: "GET",
//       });
//     },
//   });

// EXPORT EXCEL
// export const useExportLedgerExcel = () =>
//   useQuery({
//     enabled: false,
//     queryKey: ["ledger-export-excel"],

//     queryFn: async () =>
//       apiClient("/ledger/export/excel", {
//         method: "GET",
//       }),
//   });

// // EXPORT PDF
// export const useExportLedgerPdf = () =>
//   useQuery({
//     enabled: false,
//     queryKey: ["ledger-export-pdf"],

//     queryFn: async () =>
//       apiClient("/ledger/export/pdf", {
//         method: "GET",
//       }),
//   });
