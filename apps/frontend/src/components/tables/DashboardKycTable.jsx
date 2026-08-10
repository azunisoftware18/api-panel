"use client";

import { Download } from "lucide-react";

import TableShell from "./core/TableShell";
import TableHeader from "./core/TableHeader";
import TableBody from "./core/TableBody";

const STATUS_COLOR = {
  VERIFIED: "bg-green-100 text-green-700",

  PENDING: "bg-yellow-100 text-yellow-700",

  REJECTED: "bg-red-100 text-red-700",

  PROCESSING: "bg-blue-100 text-blue-700",
};

export default function DashboardKycTable({ data, total, search, onSearch }) {
  const columns = [
    {
      key: "user",
      label: "User",

      render: (row) => (
        <span className="font-medium">{row.user?.fullName}</span>
      ),
    },

    {
      key: "company",
      label: "Company",

      render: (row) => row.user?.companyName || "-",
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
      key: "createdAt",
      label: "Created",

      render: (row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-",
    },

    {
      key: "updatedAt",
      label: "Updated",

      render: (row) =>
        row.updatedAt ? new Date(row.updatedAt).toLocaleDateString() : "-",
    },
  ];

  return (
    <TableShell>
      <TableHeader
        title="Recent KYC"
        subtitle={`${total} KYC Records`}
        search={search}
        setSearch={onSearch}
        searchPlaceholder="Search KYC..."
        exportIcon={Download}
      />

      <TableBody columns={columns} data={data} />
    </TableShell>
  );
}
