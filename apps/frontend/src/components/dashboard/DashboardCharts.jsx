"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#2563eb", "#22c55e", "#eab308", "#ef4444", "#8b5cf6"];

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-base font-semibold text-card-foreground">
        {title}
      </h3>
      <div className="h-[280px] w-full">{children}</div>
    </div>
  );
}

export default function DashboardCharts({
  analytics = [],
  transactionSummary = {},
  kycSummary = {},
  title,
}) {
  const pieData = [
    { name: "Success", value: transactionSummary.successTransactions || 0 },
    { name: "Failed", value: transactionSummary.failedTransactions || 0 },
    { name: "Pending", value: transactionSummary.pendingTransactions || 0 },
  ];

  const kycData = [
    { name: "Verified", value: kycSummary.verified || 0 },
    { name: "Pending", value: kycSummary.pending || 0 },
    { name: "Rejected", value: kycSummary.rejected || 0 },
  ];

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card title="Daily Transaction Volume">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analytics}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#colorVolume)"
              />
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Daily Transaction Amount (₹)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                  color: "var(--foreground)",
                }}
              />
              <Bar dataKey="volume" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Transaction Status Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="KYC Verification Breakdown">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={kycData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {kycData.map((entry, index) => (
                  <Cell
                    key={`cell-kyc-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </section>
  );
}
