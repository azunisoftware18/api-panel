"use client";

import { Download } from "lucide-react";

import TableShell from "./core/TableShell";
import TableHeader from "./core/TableHeader";
import TableBody from "./core/TableBody";
import TablePagination from "./core/TablePagination";

export default function LedgerTable({
  ledger,
  total,
  page,
  perPage,

  search,
  onSearch,
  onPageChange,

  entryType,
  referenceType,
  walletType,

  fromDate,
  toDate,

  setEntryType,
  setReferenceType,
  setWalletType,
  setFromDate,
  setToDate,

  onReset,
  onRefresh,

  isLoading,
}) {
  const columns = [
    {
      key: "txnId",

      label: "Txn ID",

      render: (row) => row.transaction?.txnId || "-",
    },

    {
      key: "registration",

      label: "Registration",

      render: (row) => row.wallet?.user?.registrationNumber || "-",
    },

    {
      key: "company",

      label: "Company",

      render: (row) => row.wallet?.user?.companyName || "-",
    },

    {
      key: "user",

      label: "User",

      render: (row) => row.wallet?.user?.fullName || "-",
    },

    {
      key: "wallet",

      label: "Wallet",

      render: (row) => row.wallet?.walletType || "-",
    },

    {
      key: "entryType",

      label: "Entry",

      render: (row) => (
        <span
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            row.entryType === "CREDIT"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.entryType}
        </span>
      ),
    },

    {
      key: "reference",

      label: "Reference",

      render: (row) => row.referenceType,
    },

    {
      key: "amount",

      label: "Amount",

      render: (row) => (
        <span
          className={
            row.entryType === "CREDIT"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }
        >
          ₹ {Number(row.amount).toFixed(2)}
        </span>
      ),
    },

    {
      key: "balance",

      label: "Running Balance",

      render: (row) => `₹ ${Number(row.runningBalance).toFixed(2)}`,
    },

    {
      key: "provider",

      label: "Provider",

      render: (row) => row.serviceProvider?.baseUrl || "-",
    },

    {
      key: "narration",

      label: "Narration",

      render: (row) => row.narration,
    },

    {
      key: "created",

      label: "Created At",

      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <TableShell>
      <TableHeader
        title="Wallet Ledger"
        subtitle={`${total} entries found`}
        search={search}
        setSearch={onSearch}
        searchPlaceholder="Search ledger..."
        exportIcon={Download}
        onRefresh={onRefresh}
        isLoading={isLoading}
        onReset={onReset}
        filters={[
          {
            value: entryType,
            onChange: setEntryType,
            placeholder: "Entry Type",
            options: [
              {
                label: "All",
                value: "",
              },
              {
                label: "Credit",
                value: "CREDIT",
              },
              {
                label: "Debit",
                value: "DEBIT",
              },
            ],
          },

          {
            value: walletType,
            onChange: setWalletType,
            placeholder: "Wallet",
            options: [
              {
                label: "All",
                value: "",
              },
              {
                label: "Primary",
                value: "PRIMARY",
              },
              {
                label: "Commission",
                value: "COMMISSION",
              },
              {
                label: "GST",
                value: "GST",
              },
              {
                label: "TDS",
                value: "TDS",
              },
            ],
          },

          {
            value: referenceType,
            onChange: setReferenceType,
            placeholder: "Reference",
            options: [
              {
                label: "All",
                value: "",
              },
              {
                label: "Transaction",
                value: "TRANSACTION",
              },
              {
                label: "Provider Cost",
                value: "PROVIDER_COST",
              },
              {
                label: "Provider GST",
                value: "PROVIDER_GST",
              },
              {
                label: "Commission",
                value: "COMMISSION",
              },
              {
                label: "Settlement",
                value: "SETTLEMENT",
              },
            ],
          },

          {
            type: "date",
            value: fromDate,
            onChange: setFromDate,
            placeholder: "From Date",
          },

          {
            type: "date",
            value: toDate,
            onChange: setToDate,
            placeholder: "To Date",
          },
        ]}
      />

      <TableBody columns={columns} data={ledger} />

      <TablePagination
        page={page}
        setPage={onPageChange}
        total={total}
        perPage={perPage}
      />
    </TableShell>
  );
}
