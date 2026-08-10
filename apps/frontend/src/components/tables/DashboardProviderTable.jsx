"use client";

import { Download, Server } from "lucide-react";
import TableShell from "./core/TableShell";
import TableHeader from "./core/TableHeader";
import TableBody from "./core/TableBody";

function ProgressBar({ value = 0 }) {
  const percentage = Number(value);

  const getColor = (val) => {
    if (val >= 95) return "bg-emerald-500";
    if (val >= 80) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="min-w-[140px] space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span>{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${getColor(percentage)}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function Badge({ value, variant = "default" }) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    failed: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    default: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}
    >
      {value}
    </span>
  );
}

export default function DashboardProviderTable({ providers = [] }) {
  const columns = [
    {
      key: "provider",
      label: "Provider",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">
            {row.providerName}
          </span>
        </div>
      ),
    },
    {
      key: "service",
      label: "Service",
      render: (row) => (
        <span className="text-muted-foreground">{row.serviceName}</span>
      ),
    },
    {
      key: "total",
      label: "Total",
      render: (row) => (
        <span className="font-medium text-foreground">
          {row.totalTransactions}
        </span>
      ),
    },
    {
      key: "success",
      label: "Success",
      render: (row) => <Badge value={row.success} variant="success" />,
    },
    {
      key: "failed",
      label: "Failed",
      render: (row) => <Badge value={row.failed} variant="failed" />,
    },
    {
      key: "pending",
      label: "Pending",
      render: (row) => <Badge value={row.pending} variant="pending" />,
    },
    {
      key: "successRate",
      label: "Success Rate",
      render: (row) => <ProgressBar value={row.successRate} />,
    },
  ];

  return (
    <TableShell>
      <TableHeader
        title="Provider Health"
        subtitle={`${providers.length} Active Services`}
        exportIcon={Download}
      />
      <TableBody columns={columns} data={providers} />
    </TableShell>
  );
}
