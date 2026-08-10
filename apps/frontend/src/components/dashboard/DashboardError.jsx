"use client";

import { TriangleAlert } from "lucide-react";

export default function DashboardError({
  onRetry,
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
      <TriangleAlert
        size={50}
        className="mx-auto text-red-500"
      />

      <h2 className="mt-4 text-xl font-semibold">
        Failed to Load Dashboard
      </h2>

      <button
        onClick={onRetry}
        className="mt-5 rounded-lg bg-red-500 px-5 py-2 text-white"
      >
        Retry
      </button>
    </div>
  );
}