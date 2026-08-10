"use client";

import { Building2 } from "lucide-react";
import { Download } from "lucide-react";

import TableShell from "./core/TableShell";
import TableHeader from "./core/TableHeader";
import TableBody from "./core/TableBody";
import TablePagination from "./core/TablePagination";

export default function SystemSettingTable({
  data = [],
  total = 0,
  page,
  perPage,
  search,
  onSearch,
  onPageChange,
  onEdit,
  onRefresh,
  isLoading,
}) {
  const columns = [
    {
      key: "company",
      label: "Company",

      render: (row) => (
        <div className="flex items-center gap-3">
          {row.companyLogo ? (
            <img
              src={row.companyLogo}
              alt={row.companyName}
              className="h-11 w-11 rounded-xl border object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
          )}

          <div>
            <div className="font-semibold">{row.companyName}</div>

            <div className="text-xs text-muted-foreground">
              {row.companyEmail}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: "phone",

      label: "Phone",

      render: (row) => row.phoneNumber || "-",
    },

    {
      key: "whatsapp",

      label: "Whatsapp",

      render: (row) => row.whtsappNumber || "-",
    },

    {
      key: "facebook",

      label: "Facebook",

      render: (row) =>
        row.facebookUrl ? (
          <a
            href={row.facebookUrl}
            target="_blank"
            className="text-primary underline"
          >
            Open
          </a>
        ) : (
          "-"
        ),
    },

    {
      key: "instagram",

      label: "Instagram",

      render: (row) =>
        row.instagramUrl ? (
          <a
            href={row.instagramUrl}
            target="_blank"
            className="text-primary underline"
          >
            Open
          </a>
        ) : (
          "-"
        ),
    },

    {
      key: "createdAt",

      label: "Created",

      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },

    {
      key: "actions",

      label: "Actions",
    },
  ];

  return (
    <TableShell>
      <TableHeader
        title="System Settings"
        subtitle={`${total} Settings`}
        search={search}
        setSearch={onSearch}
        searchPlaceholder="Search company..."
        exportIcon={Download}
        onRefresh={onRefresh}
        isLoading={isLoading}
      />

      <TableBody columns={columns} data={data} onEdit={onEdit} />

      <TablePagination
        page={page}
        setPage={onPageChange}
        total={total}
        perPage={perPage}
      />
    </TableShell>
  );
}
