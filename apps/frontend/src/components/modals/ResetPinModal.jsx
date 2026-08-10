"use client";

import React from "react";
import { Eye, EyeOff, X, Key } from "lucide-react";

import Input from "@/components/ui/InputField";
import Button from "@/components/ui/Button";

export default function ResetPinModal({
  open,
  onClose,
  pinForm,
  showPin,
  handleInputChange,
  toggleVisibility,
  handleSubmit,
  loading,
  error,
}) {
  if (!open) return null;

  const fields = [
    {
      label: "Current PIN",
      name: "oldPin",
      key: "old",
      placeholder: "Enter current PIN",
    },
    {
      label: "New PIN",
      name: "newPin",
      key: "new",
      placeholder: "Enter new PIN",
    },
    {
      label: "Confirm PIN",
      name: "confirmPin",
      key: "confirm",
      placeholder: "Confirm PIN",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Reset Security PIN
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">
              {error}
            </div>
          )}

          {fields.map((item) => (
            <div key={item.name} className="relative">
              <Input
                type={showPin[item.key] ? "text" : "password"}
                name={item.name}
                label={item.label}
                placeholder={item.placeholder}
                value={pinForm[item.name]}
                onChange={handleInputChange}
              />

              <button
                type="button"
                onClick={() => toggleVisibility(item.key)}
                className="absolute right-3 top-[34px] p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPin[item.key] ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <div className="flex-1">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? "Updating..." : "Update PIN"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
