"use client";

import PinVerifyForm from "../forms/PinVerifyForm";

export default function PinVerifyModal({ open, onClose, onSubmit, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center sm:items-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full rounded-t-3xl bg-white shadow-2xl sm:mx-4 sm:max-w-sm sm:rounded-3xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">Verify PIN</h2>
            <p className="text-sm text-slate-500">
              Enter your 4 digit transaction PIN
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] overflow-y-auto p-5">
          <PinVerifyForm onSubmit={onSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
