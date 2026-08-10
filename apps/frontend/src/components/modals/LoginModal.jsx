"use client";

import React from "react";
import LoginForm from "@/components/forms/LoginForm";

export default function LoginModal({ handleLogin, onForgotPassword, loading }) {
  return (
    <div className="w-full max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_80px_rgba(0,0,0,0.15)] grid lg:grid-cols-2">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:block min-h-[720px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/video.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-primary/40" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-end p-14 text-white">
          <div className="inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md">
            🚀 Welcome to Edufactory
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-tight">
            Build Your <br />
            Digital Future
          </h1>

          <p className="mt-6 max-w-md text-lg text-white/80">
            Manage users, KYC, wallet, transactions and every fintech operation
            from one secure dashboard.
          </p>

          <div className="mt-10 flex gap-10">
            <div>
              <h2 className="text-3xl font-bold">10K+</h2>
              <p className="text-white/70">Users</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">99.9%</h2>
              <p className="text-white/70">Uptime</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">24/7</h2>
              <p className="text-white/70">Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-white p-8 md:p-14">
        <div className="w-full max-w-md">
          {/* Logo */}

          <div className="mb-10 text-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="mx-auto h-16 w-16 rounded-2xl shadow-md"
            />

            <h2 className="mt-5 text-4xl font-bold text-slate-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-500">
              Login to access your dashboard
            </p>
          </div>

          {/* FORM */}

          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={onForgotPassword}
            loading={loading}
          />

          <div className="mt-10 border-t pt-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Edufactory. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
