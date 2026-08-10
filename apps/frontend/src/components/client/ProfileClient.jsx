"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useResetPassword, useResetPin } from "@/hooks/useAuth";

import {
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  CreditCard,
  Shield,
  Clock,
  Calendar,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Key,
} from "lucide-react";

// --- Custom UI Imports ---
import Header from "@/components/ui/Header";
import Alert from "@/components/ui/Alert";

import ResetPasswordModal from "../modals/ResetPasswordModal";
import ResetPinModal from "../modals/ResetPinModal";

export default function ProfileClient() {
  const user = useSelector((state) => state.auth.user);
  const isLoading = !user;

  // --- Mutations ---
  const resetPasswordMutation = useResetPassword();
  const resetPinMutation = useResetPin ? useResetPin() : null;

  // --- Global Page Alert ---
  const [pageNotification, setPageNotification] = useState(null);

  // --- Password Modal & Form State ---
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // --- PIN Modal & Form State ---
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinForm, setPinForm] = useState({
    oldPin: "",
    newPin: "",
    confirmPin: "",
  });
  const [showPin, setShowPin] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // --- Handlers: Password Form ---
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordError) setPasswordError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError("");
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setShowPassword({ old: false, new: false, confirm: false });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirm password do not match.");
      return;
    }

    try {
      const payload = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      };

      const res = await resetPasswordMutation.mutateAsync(payload);

      setPageNotification({
        type: "success",
        title: "Security Updated",
        message: res?.message || "Your password has been successfully updated.",
      });

      handleClosePasswordModal();
    } catch (err) {
      setPasswordError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update password. Please try again.",
      );
    }
  };

  // --- Handlers: PIN Form ---
  const handlePinInputChange = (e) => {
    const { name, value } = e.target;
    setPinForm((prev) => ({ ...prev, [name]: value }));
    if (pinError) setPinError("");
  };

  const togglePinVisibility = (field) => {
    setShowPin((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClosePinModal = () => {
    setIsPinModalOpen(false);
    setPinError("");
    setPinForm({ oldPin: "", newPin: "", confirmPin: "" });
    setShowPin({ old: false, new: false, confirm: false });
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    setPinError("");

    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinError("New PIN and confirm PIN do not match.");
      return;
    }

    try {
      const payload = {
        oldPin: pinForm.oldPin,
        newPin: pinForm.newPin,
        confirmPin: pinForm.confirmPin,
      };

      if (resetPinMutation) {
        const res = await resetPinMutation.mutateAsync(payload);
        setPageNotification({
          type: "success",
          title: "PIN Updated",
          message: res?.message || "Your PIN has been successfully updated.",
        });
      }

      handleClosePinModal();
    } catch (err) {
      setPinError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update PIN. Please try again.",
      );
    }
  };

  const formatText = (text) => {
    if (!text) return "Not set";
    return text
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const isActive = user?.status?.toUpperCase() === "ACTIVE";

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 mt-2">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 pb-16 font-sans">
      <div>
        <Header
          title="Account Settings"
          subtitle="Manage your profile information and security preferences."
        />

        {pageNotification && (
          <div className="mt-6">
            <Alert
              type={pageNotification.type}
              title={pageNotification.title}
              icon={<CheckCircle2 className="w-5 h-5" />}
            >
              {pageNotification.message}
            </Alert>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* --- Left Column: Profile Summary & Security Actions --- */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="h-24 bg-sky-100/70 border-b border-sky-100"></div>

              <div className="px-6 pb-6 flex flex-col items-center text-center -mt-12">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-sm">
                    <div className="w-full h-full rounded-full bg-sky-50 flex items-center justify-center overflow-hidden border border-sky-100">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user?.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sky-600 text-3xl font-bold uppercase">
                          {user?.fullName?.charAt(0) || "F"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                      isActive ? "bg-sky-500" : "bg-amber-500"
                    }`}
                  >
                    {isActive ? (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    ) : (
                      <Clock className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-slate-900 capitalize">
                    {user?.fullName || "User"}
                  </h2>
                  <p className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full mt-2 inline-flex items-center gap-1.5 border border-sky-100">
                    <Shield className="w-3.5 h-3.5" />
                    {formatText(user?.role) || "Member"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Member Since</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-slate-400" />
                      <span>KYC Status</span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide ${
                        user?.isKycVerified !== false
                          ? "bg-sky-50 text-sky-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {user?.isKycVerified !== false ? "Verified" : "Pending"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div
                      className={`h-full rounded-full ${
                        user?.isKycVerified !== false
                          ? "bg-sky-500 w-full"
                          : "bg-amber-500 w-1/2"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-50 opacity-60 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

              <div className="relative flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="text-md font-bold text-slate-900">
                      Account Security
                    </h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      Update your credentials regularly to keep your account
                      safe.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full pt-2">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex-1 cursor-pointer px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded-lg text-sm font-semibold transition-all text-center"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={() => setIsPinModalOpen(true)}
                    className="flex-1 cursor-pointer px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-lg text-sm font-semibold transition-all text-center"
                  >
                    Change PIN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Personal & Company Details --- */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Personal Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Personal Information
              </h3>
              <div className="space-y-1">
                <DetailRow
                  icon={<User />}
                  label="Full Name"
                  value={user?.fullName}
                  capitalize
                />
                <DetailRow
                  icon={<Mail />}
                  label="Email Address"
                  value={user?.email}
                />
                <DetailRow
                  icon={<Phone />}
                  label="Phone Number"
                  value={user?.phoneNumber}
                />
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                Company Details
              </h3>
              <div className="space-y-1">
                <DetailRow
                  icon={<Building2 />}
                  label="Company Name"
                  value={user?.companyName}
                  capitalize
                />
                <DetailRow
                  icon={<Briefcase />}
                  label="Company Type"
                  value={formatText(user?.companyType)}
                />
                <DetailRow
                  icon={<CreditCard />}
                  label="Registration Number"
                  value={user?.registrationNumber}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <ResetPasswordModal
        open={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        passwordForm={passwordForm}
        showPassword={showPassword}
        handleInputChange={handlePasswordInputChange}
        toggleVisibility={togglePasswordVisibility}
        handleSubmit={handlePasswordSubmit}
        loading={
          resetPasswordMutation.isPending || resetPasswordMutation.isLoading
        }
        error={passwordError}
      />

      <ResetPinModal
        open={isPinModalOpen}
        onClose={handleClosePinModal}
        pinForm={pinForm}
        showPin={showPin}
        handleInputChange={handlePinInputChange}
        toggleVisibility={togglePinVisibility}
        handleSubmit={handlePinSubmit}
        loading={resetPinMutation?.isPending || resetPinMutation?.isLoading}
        error={pinError}
      />
    </div>
  );
}

function DetailRow({ icon, label, value, capitalize }) {
  return (
    <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="text-slate-400">
          {React.cloneElement(icon, { className: "w-5 h-5" })}
        </div>
        <span className="text-sm font-medium text-slate-500">{label}</span>
      </div>
      <span
        className={`text-sm font-semibold text-slate-900 text-right max-w-[200px] sm:max-w-[300px] truncate ${
          capitalize ? "capitalize" : ""
        }`}
      >
        {value ? (
          value
        ) : (
          <span className="text-slate-400 font-normal italic">Not set</span>
        )}
      </span>
    </div>
  );
}
