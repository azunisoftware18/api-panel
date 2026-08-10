"use client";

import { KeyRound, ShieldCheck } from "lucide-react";

function Item({ title, value, colorClass = "text-foreground" }) {
  return (
    <div className="rounded-lg border border-border bg-card/50 p-4 transition-all hover:bg-card">
      <p className="text-xs font-medium text-muted-foreground uppercase">
        {title}
      </p>
      <h2 className={`mt-1 text-2xl font-bold tracking-tight ${colorClass}`}>
        {value ?? 0}
      </h2>
    </div>
  );
}

export default function DashboardApiKeys({ apiUsage = {} }) {
  return (
    <div className="h-full rounded-xl border border-border bg-card p-5 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <ShieldCheck className="text-primary h-5 w-5" />
        <h2 className="text-base font-semibold text-card-foreground">
          API Key Usage
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Item title="Total Keys" value={apiUsage.totalKeys} />
        <Item
          title="Active"
          value={apiUsage.activeKeys}
          colorClass="text-emerald-600"
        />
        <Item
          title="Inactive"
          value={apiUsage.inactiveKeys}
          colorClass="text-amber-600"
        />
        <Item
          title="Expired"
          value={apiUsage.expiredKeys}
          colorClass="text-rose-600"
        />
      </div>

      {apiUsage.recentKeys?.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent API Keys
          </h3>

          <div className="space-y-2">
            {apiUsage.recentKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background/50 p-3 text-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <KeyRound className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium text-foreground truncate">
                    {key.name}
                  </span>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    key.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  }`}
                >
                  {key.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
