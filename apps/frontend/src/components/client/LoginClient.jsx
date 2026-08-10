"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

import LoginModal from "@/components/modals/LoginModal";
import ForgotPasswordModal from "@/components/modals/ForgotPasswordModal";
import ConfirmDialog from "@/components/ConfirmDialog";

import { setUser } from "@/store/authSlice";

import { useLogin, useForgotPassword } from "@/hooks/useAuth";

export default function LoginClient() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [forgotOpen, setForgotOpen] = useState(false);

  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: "",
  });

  const loginMutation = useLogin();
  const forgotMutation = useForgotPassword();

  // LOGIN
  const handleLogin = async (data) => {
    try {
      const res = await loginMutation.mutateAsync(data);
      dispatch(setUser(res?.data?.user));

      router.replace("/dashboard");
    } catch (err) {
      setErrorDialog({
        open: true,
        message: err?.response?.data?.message || err?.message || "Login failed",
      });
    }
  };

  // FORGOT PASSWORD
  const handleForgotPassword = async (data) => {
    try {
      const res = await forgotMutation.mutateAsync(data);

      setErrorDialog({
        open: true,

        message: res?.message || "Reset link sent",
      });

      setForgotOpen(false);
    } catch (err) {
      setErrorDialog({
        open: true,

        message:
          err?.response?.data?.message ||
          err?.message ||
          "Forgot password failed",
      });
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/10 blur-3xl" />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <LoginModal
          handleLogin={handleLogin}
          loading={loginMutation.isPending}
          onForgotPassword={() => setForgotOpen(true)}
        />

        <ForgotPasswordModal
          isOpen={forgotOpen}
          onClose={() => setForgotOpen(false)}
          onSubmit={handleForgotPassword}
          loading={forgotMutation.isPending}
        />

        <ConfirmDialog
          open={errorDialog.open}
          onClose={() =>
            setErrorDialog({
              open: false,
              message: "",
            })
          }
          title="Notification"
          description={errorDialog.message}
          cancelText="Close"
          variant="danger"
        />
      </div>
    </div>
  );
}
