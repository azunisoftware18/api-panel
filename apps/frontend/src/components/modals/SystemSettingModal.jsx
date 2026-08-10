"use client";

import { useEffect } from "react";
import { Settings, X } from "lucide-react";

import SystemSettingForm from "../forms/SystemSettingForm";

export default function SystemSettingModal({
  open,
  onClose,
  onSubmit,
  initialData,
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      {/* Overlay */}

      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {initialData
                  ? "Update System Setting"
                  : "Create System Setting"}
              </h2>

              <p className="text-sm text-muted-foreground">
                Manage company branding, contact details and social links.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}

        <div className="max-h-[85vh] overflow-y-auto px-8 py-8">
          <SystemSettingForm
            initialData={initialData}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}
