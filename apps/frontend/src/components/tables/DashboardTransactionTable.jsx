"use client";

import TableShell from "./core/TableShell";
import TableHeader from "./core/TableHeader";
import TableBody from "./core/TableBody";

const STATUS_COLOR = {
  SUCCESS: "bg-green-100 text-green-700 border border-green-200",
  FAILED: "bg-red-100 text-red-700 border border-red-200",
  PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  PROCESSING: "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function DashboardTransactionTable({ transactions = [] }) {
  const columns = [
    {
      key: "txnId",
      label: "Txn Id",
    },
    {
      key: "customer",
      label: "Customer",
      render: (row) => row.user?.fullName || "-",
    },
    {
      key: "service",
      label: "Service",
      render: (row) => row.serviceProvider?.service?.name || "-",
    },
    {
      key: "provider",
      label: "Provider",
      render: (row) => row.serviceProvider?.provider?.name || "-",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) => (
        <span className="font-semibold">
          ₹
          {Number(row.amount ?? 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            STATUS_COLOR[row.status] || "bg-gray-100"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) =>
        row.initiatedAt ? new Date(row.initiatedAt).toLocaleString() : "-",
    },
  ];

  return (
    <TableShell>
      <TableHeader
        title="Recent Transactions"
        subtitle={`${transactions.length} Transactions`}
      />
      <TableBody columns={columns} data={transactions} />
    </TableShell>
  );
}
