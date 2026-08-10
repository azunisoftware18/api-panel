"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

export default function PinVerifyForm({ onSubmit, loading }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (loading) {
      setPin(["", "", "", ""]);
    }
  }, [loading]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (loading) return;
    if (!/^\d?$/.test(value)) return;

    const updated = [...pin];
    updated[index] = value;
    setPin(updated);

    if (error) setError("");

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto verify when all 4 digits entered
    const finalPin = updated.join("");

    if (finalPin.length === 4 && !updated.includes("")) {
      inputRefs.current.forEach((input) => input?.blur());
      onSubmit(finalPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (pin[index]) {
        const updated = [...pin];
        updated[index] = "";
        setPin(updated);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();

        const updated = [...pin];
        updated[index - 1] = "";
        setPin(updated);
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);

    if (!pasted) return;

    const updated = ["", "", "", ""];

    pasted.split("").forEach((digit, i) => {
      updated[i] = digit;
    });

    setPin(updated);

    const nextIndex = Math.min(pasted.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center space-y-6 py-2">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <LockKeyhole className="h-8 w-8 text-primary" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold">Enter Transaction PIN</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Enter your 4 digit PIN to continue
        </p>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-center gap-3 " onPaste={handlePaste}>
          {pin.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type={showPin ? "text" : "password"}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading}
              className={`
                h-14
                w-14
                rounded-xl
                border
                border-gray-300
                text-center
                text-xl
                font-bold
                outline-none
                transition
                disabled:opacity-60
                disabled:cursor-not-allowed
                focus:border-primary
                focus:ring-2
                focus:ring-primary/20
                `}
            />
          ))}
        </div>
        <div className="flex w-full items-center justify-end">
          <button
            type="button"
            onClick={() => setShowPin((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer transition "
          >
            {showPin ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide PIN
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show PIN
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Verifying PIN...
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
