"use client";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-gray-200"
          />
        ))}
      </div>

      <div className="h-96 rounded-xl bg-gray-200" />

      <div className="h-96 rounded-xl bg-gray-200" />

      <div className="h-96 rounded-xl bg-gray-200" />
    </div>
  );
}