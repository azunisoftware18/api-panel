"use client";

import { AlertTriangle, CheckCircle2, Info, Bell } from "lucide-react";

const variants = {
  warning: {
    icon: AlertTriangle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-800",
  },
  danger: {
    icon: AlertTriangle,
    className: "border-red-200 bg-red-50 text-red-800",
  },
  success: {
    icon: CheckCircle2,
    className: "border-green-200 bg-green-50 text-green-800",
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
};

export default function DashboardNotification({ notifications = [] }) {
  if (!notifications.length) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green-600" size={24} />
          <div>
            <h2 className="font-semibold text-green-700">
              Everything looks good
            </h2>
            <p className="text-sm text-green-600">No pending notifications.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => {
        const config = variants[notification.severity] || variants.info;
        const Icon = config.icon;

        return (
          <div
            key={notification.id || index}
            className={`rounded-xl border p-4 ${config.className}`}
          >
            <div className="flex items-start gap-4">
              <Icon size={22} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <Bell size={16} />
                </div>
                <p className="mt-1 text-sm">{notification.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
