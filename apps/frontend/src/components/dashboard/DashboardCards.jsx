"use client";

import {
  Wallet,
  Activity,
  Calendar,
  Users,
  ShieldCheck,
  IndianRupee,
  TrendingUp,
  KeyRound,
} from "lucide-react";

function Card({ title, value, icon: Icon, colorClass }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-border/80">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {typeof value === "number"
              ? value.toLocaleString("en-IN")
              : (value ?? 0)}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${colorClass} shadow-sm`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

const formatINR = (val) => {
  if (val === undefined || val === null) return "₹0.00";
  return `₹${Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function DashboardCards({
  wallet = {},
  today = {},
  month = {},
  users = {},
  kyc = {},
  commission = {},
  profit = {},
  apiUsage = {},
  title,
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Wallet Balance"
          value={formatINR(wallet.totalBalance)}
          icon={Wallet}
          colorClass="bg-indigo-600"
        />
        <Card
          title="Today's Transactions"
          value={today.transactions}
          icon={Activity}
          colorClass="bg-emerald-600"
        />
        <Card
          title="Monthly Transactions"
          value={month.transactions}
          icon={Calendar}
          colorClass="bg-blue-600"
        />
        <Card
          title="Total Users"
          value={users.totalUsers}
          icon={Users}
          colorClass="bg-purple-600"
        />
        <Card
          title="Verified KYC"
          value={kyc.verified}
          icon={ShieldCheck}
          colorClass="bg-teal-600"
        />
        <Card
          title="Total Commission"
          value={formatINR(commission.totalCommission)}
          icon={IndianRupee}
          colorClass="bg-amber-600"
        />
        <Card
          title="Net Profit"
          value={formatINR(profit.netProfit)}
          icon={TrendingUp}
          colorClass="bg-cyan-600"
        />
        <Card
          title="Active API Keys"
          value={apiUsage.activeKeys}
          icon={KeyRound}
          colorClass="bg-rose-600"
        />
      </div>
    </section>
  );
}
