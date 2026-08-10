"use client";

import { useEffect, useState } from "react";
import { RefreshCw, LayoutDashboard, Bell } from "lucide-react";
import { useDispatch } from "react-redux";

import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ConfirmDialog";

import {
  setDashboard,
  setDashboardError,
  setDashboardLoading,
} from "@/store/dashboardSlice";
import { useDashboard } from "@/hooks/useDashboard";
import DashboardCards from "../dashboard/DashboardCards";
import DashboardNotification from "../dashboard/DashboardNotification";
import DashboardTransactionTable from "../tables/DashboardTransactionTable";
import DashboardKycTable from "../tables/DashboardKycTable";
import DashboardProviderTable from "../tables/DashboardProviderTable";
import DashboardCharts from "../dashboard/DashboardCharts";
import DashboardSkeleton from "../dashboard/DashboardSkeleton";
import DashboardError from "../dashboard/DashboardError";
import DashboardApiKeys from "../dashboard/DashboardApiKeys";

export default function DashboardClient() {
  const dispatch = useDispatch();

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
  });

  const { data, error, isLoading, isFetching, refetch } = useDashboard();

  useEffect(() => {
    dispatch(setDashboardLoading(isLoading));
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (data?.data) {
      dispatch(setDashboard(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!error) return;

    dispatch(setDashboardError(error));

    setDialog({
      open: true,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Dashboard load failed.",
    });
  }, [error, dispatch]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <DashboardError onRetry={refetch} />;
  }

  const dashboard = data?.data || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left */}
        <div>
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />

            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Overview and real-time operations of your Fintech Management
                System
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-start gap-3 lg:items-center ">
          <DashboardNotification
            notifications={dashboard?.notifications ?? []}
          />

          <Button
            onClick={refetch}
            disabled={isFetching}
            className="shrink-0 flex items-center cursor-pointer"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <DashboardCards
        title={"Key Metrics"}
        wallet={dashboard.wallet ?? {}}
        today={dashboard.today ?? {}}
        month={dashboard.month ?? {}}
        users={dashboard.users ?? {}}
        kyc={dashboard.kyc ?? {}}
        commission={dashboard.commission ?? {}}
        profit={dashboard.profit ?? {}}
        apiUsage={dashboard.apiUsage ?? {}}
      />

      {/* Operational Analytics Charts */}
      <DashboardCharts
        title={"Analytics Overview"}
        analytics={dashboard?.analytics ?? []}
        transactionSummary={dashboard?.transactions ?? {}}
        kycSummary={dashboard?.kyc ?? {}}
      />

      {/* Main Data Tables Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardTransactionTable
          transactions={dashboard?.recentTransactions ?? []}
        />
        <DashboardKycTable
          data={dashboard?.recentKyc ?? []}
          total={dashboard?.kyc?.total ?? 0}
        />
      </section>

      {/* Infrastructure & API Management */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardProviderTable providers={dashboard?.providerHealth ?? []} />
        </div>
        <div className="lg:col-span-1">
          <DashboardApiKeys apiUsage={dashboard.apiUsage ?? {}} />
        </div>
      </section>

      {/* Error Confirmation Dialog */}
      <ConfirmDialog
        open={dialog.open}
        onClose={() =>
          setDialog({
            open: false,
            message: "",
          })
        }
        title="Dashboard Error"
        description={dialog.message}
        variant="danger"
        cancelText="Close"
      />
    </div>
  );
}
