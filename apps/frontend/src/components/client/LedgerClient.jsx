"use client";

import { useSelector, useDispatch } from "react-redux";
import { Activity } from "lucide-react";

import Header from "@/components/ui/Header";
import Button from "@/components/ui/Button";
import QuickStats from "@/components/QuickStats";

import LedgerTable from "@/components/tables/LedgerTable";

import { useGetAllLedger } from "@/hooks/useLedger";

import {
  setPage,
  setSearch,
  setEntryType,
  setReferenceType,
  setWalletType,
  setFromDate,
  setToDate,
  resetFilters,
} from "../../store/ledgerSlice";

export default function LedgerClient() {
  const dispatch = useDispatch();

  const {
    page,
    limit,
    search,
    entryType,
    referenceType,
    walletType,
    fromDate,
    toDate,
  } = useSelector((state) => state.ledger);

  const {
    data: ledgerResponse,
    refetch,
    isLoading,
    isFetching,
  } = useGetAllLedger({
    page,
    limit,
    search,
    entryType,
    referenceType,
    walletType,
    fromDate,
    toDate,
  });

  const ledger = ledgerResponse?.data?.items || [];
  const pagination = ledgerResponse?.data?.pagination || {};

  const total = pagination.total || 0;

  const credit = ledger
    .filter((x) => x.entryType === "CREDIT")
    .reduce((sum, x) => sum + Number(x.amount), 0);

  const debit = ledger
    .filter((x) => x.entryType === "DEBIT")
    .reduce((sum, x) => sum + Number(x.amount), 0);

  return (
    <div className="space-y-8">
      <Header
        title="Ledger"
        subtitle="Wallet Ledger Entries"
        actions={
          <Button leftIcon={<Activity />} onClick={() => refetch()}>
            Refresh
          </Button>
        }
      />

      <QuickStats
        stats={[
          {
            title: "Total Entries",
            value: total.toLocaleString(),
            icon: Activity,
            iconColor: "text-info",
            bgColor: "stat-total",
          },
          {
            title: "Total Credit",
            value: credit.toLocaleString(),
            icon: Activity,
            iconColor: "text-success",
            bgColor: "stat-active",
          },
          {
            title: "Total Debit",
            value: debit.toLocaleString(),
            icon: Activity,
            iconColor: "text-error",
            bgColor: "stat-inactive",
          },
        ]}
      />

      <LedgerTable
        ledger={ledger}
        total={total}
        page={page}
        perPage={limit}
        search={search}
        entryType={entryType}
        referenceType={referenceType}
        walletType={walletType}
        fromDate={fromDate}
        toDate={toDate}
        onSearch={(v) => dispatch(setSearch(v))}
        onPageChange={(v) => dispatch(setPage(v))}
        setEntryType={(v) => dispatch(setEntryType(v))}
        setReferenceType={(v) => dispatch(setReferenceType(v))}
        setWalletType={(v) => dispatch(setWalletType(v))}
        setFromDate={(v) => dispatch(setFromDate(v))}
        setToDate={(v) => dispatch(setToDate(v))}
        onReset={() => dispatch(resetFilters())}
        onRefresh={refetch}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}
