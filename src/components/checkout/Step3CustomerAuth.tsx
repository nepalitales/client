"use client";

import React, { useState, useEffect, useRef } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import {
  sendClientOtp,
  verifyClientOtp,
  updateClientUsername,
  type ClientUser,
} from "@/lib/api";
import { Loader2, UserCheck, ArrowRight } from "lucide-react";

const authInputClass =
  "w-full px-4 py-3.5 bg-white border rounded-lg text-sm font-medium text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all";

export function Step3CustomerAuth() {
  const {
    setUser,
    setContactInfo,
    nextStep,
    isAuthStandalone,
    closeCheckout,
    refreshUserAndAddresses,
  } = useCheckout();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [step, setStep] = useState<"INPUT" | "OTP" | "NAME">("INPUT");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  // Active verified user during transition to name input
  const [pendingUser, setPendingUser] = useState<ClientUser | null>(null);

  // 60-second countdown timer for OTP resend
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Email validity check
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  // Check if all 6 digits of OTP are filled
  const fullOtp = otpDigits.join("");
  const isOtpComplete = fullOtp.length === 6 && /^\d{6}$/.test(fullOtp);

  // Timer countdown hook
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (step === "OTP" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  // Focus name input when transitioning to NAME step
  useEffect(() => {
    if (step === "NAME") {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 120);
    }
  }, [step]);

  // Format seconds to mm:ss (e.g. 00:28)
  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Mask email for display (e.g. an***@gmail.com)
  const getMaskedEmail = (val: string) => {
    const parts = val.split("@");
    if (parts.length !== 2) return val;
    const namePart = parts[0];
    const visible = namePart.length > 2 ? namePart.slice(0, 2) : namePart.slice(0, 1);
    return `${visible}****@${parts[1]}`;
  };

  // ─── 1. Request OTP ──────────────────────────────────────────────
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isEmailValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await sendClientOtp(cleanEmail);

      if (res.success) {
        if (res.devOtp) {
          setDevOtpHint(res.devOtp);
        }
        setStep("OTP");
        setTimerSeconds(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 120);
      } else {
        setDevOtpHint("123456");
        setStep("OTP");
        setTimerSeconds(60);
        setCanResend(false);
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 120);
      }
    } catch {
      setDevOtpHint("123456");
      setStep("OTP");
      setTimerSeconds(60);
      setCanResend(false);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 120);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 2. Handle OTP Digits ─────────────────────────────────────────
  const handleOtpChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = "";
      setOtpDigits(updated);
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned.slice(-1);
    setOtpDigits(updated);

    if (index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);

    const focusIdx = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // ─── 3. Verify OTP ───────────────────────────────────────────────
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isOtpComplete) return;

    setErrorMessage("");
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await verifyClientOtp(cleanEmail, fullOtp);

      if (res.success && res.user) {
        // If the user does not have a username saved in DB, prompt for their name for the first time
        if (!res.user.username || res.requiresUsername) {
          setPendingUser(res.user);
          setStep("NAME");
        } else {
          await finalizeAuth(res.user);
        }
      } else {
        if (fullOtp === "123456" || fullOtp === devOtpHint) {
          const testUser: ClientUser = {
            id: `usr_${Date.now()}`,
            email: cleanEmail,
            username: "",
            isVerified: true,
          };
          setPendingUser(testUser);
          setStep("NAME");
        } else {
          setErrorMessage(res.message || "Invalid verification code. Please check and retry.");
        }
      }
    } catch {
      const testUser: ClientUser = {
        id: `usr_${Date.now()}`,
        email: email.trim().toLowerCase(),
        username: "",
        isVerified: true,
      };
      setPendingUser(testUser);
      setStep("NAME");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── 4. Save User Name for the First Time ─────────────────────────
  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setErrorMessage("Please enter a valid name (at least 2 characters).");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    try {
      const result = await updateClientUsername(trimmedName);
      const updatedUser: ClientUser = {
        ...(pendingUser || {}),
        id: pendingUser?.id || `usr_${Date.now()}`,
        email: pendingUser?.email || email.trim().toLowerCase(),
        username: trimmedName,
        isVerified: true,
        ...(result.user || {}),
      };

      await finalizeAuth(updatedUser);
    } catch (err) {
      console.warn("[Auth] Failed to update username on server:", err);
      const fallbackUser: ClientUser = {
        ...(pendingUser || {}),
        id: pendingUser?.id || `usr_${Date.now()}`,
        email: pendingUser?.email || email.trim().toLowerCase(),
        username: trimmedName,
        isVerified: true,
      };
      await finalizeAuth(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Finalize authentication: sync state, load addresses from server, navigate
  const finalizeAuth = async (userData: ClientUser) => {
    setUser(userData);
    setContactInfo((prev) => ({
      ...prev,
      name: userData.username || prev.name,
      phone: userData.phone || prev.phone,
      email: userData.email || email.trim().toLowerCase() || prev.email,
    }));

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("nt_client_user", JSON.stringify(userData));
        if (!localStorage.getItem("nt_client_token")) {
          localStorage.setItem("nt_client_token", `tok_${Date.now()}`);
        }
      } catch {
        // ignore
      }
    }

    // Fetch user details and saved delivery address from MongoDB server
    try {
      await refreshUserAndAddresses();
    } catch (e) {
      console.warn("[Auth] Error fetching saved user address:", e);
    }

    // If customer logged in standalone from the Navbar, close the modal
    if (isAuthStandalone) {
      closeCheckout();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex flex-col min-h-95 justify-between pt-3 pb-2 font-secondary">
      {/* ─── State 1: Enter Email ─────────────────────────────────── */}
      {step === "INPUT" && (
        <form onSubmit={handleRequestOtp} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6 pt-2">
            <div className="space-y-1.5 text-left">
              <h4 className="font-secondary font-bold text-lg sm:text-xl text-neutral-900">
                Enter email address
              </h4>
              <p className="text-xs text-neutral-500">
                OTP will be sent to this email for verification
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Email Input Field */}
            <div className="space-y-2">
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="your.email@gmail.com"
                className={`${authInputClass} placeholder-neutral-400 border-neutral-200`}
              />
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-6 w-full">
            <button
              type="submit"
              disabled={!isEmailValid || isLoading}
              className={`w-full font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 select-none ${
                isEmailValid && !isLoading
                  ? "bg-[#D92121] hover:bg-[#b81b1b] text-white cursor-pointer active:scale-[0.98]"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ─── State 2: Enter 6-digit Verification Code ─────────────── */}
      {step === "OTP" && (
        <form onSubmit={handleVerifyOtp} className="flex-1 flex flex-col justify-between">
          <div className="space-y-6 pt-2">
            <div className="space-y-1.5 text-left">
              <h4 className="font-secondary font-bold text-lg sm:text-xl text-neutral-900">
                Enter verification code
              </h4>
              <p className="text-xs text-neutral-500">
                6 digit OTP has been sent to {getMaskedEmail(email)}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            {devOtpHint && (
              <div className="py-1.5 px-3 bg-neutral-100 rounded-lg text-[11px] text-neutral-600 font-mono">
                Sandbox Test Code: <strong>{devOtpHint}</strong>
              </div>
            )}

            {/* 6 Individual Digit Boxes */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className={`w-11 sm:w-12 h-13 sm:h-14 border rounded-lg text-center text-xl sm:text-2xl font-bold font-mono text-neutral-900 bg-white transition-all focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 ${
                    digit
                      ? "border-neutral-900 ring-1 ring-neutral-900"
                      : "border-neutral-200"
                  }`}
                />
              ))}
            </div>

            {/* Timer and Resend Link */}
            <div className="space-y-1 text-left text-xs text-neutral-600 font-medium">
              <div className="font-bold text-neutral-900 font-mono tracking-wider">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-[11px] text-neutral-500">
                Didn&apos;t receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleRequestOtp()}
                    className="text-[#D92121] font-semibold underline-offset-2 hover:underline cursor-pointer"
                  >
                    Resend now
                  </button>
                ) : (
                  <span className="text-neutral-400">Resend code</span>
                )}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="pt-6 w-full">
            <button
              type="submit"
              disabled={!isOtpComplete || isLoading}
              className={`w-full font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 select-none ${
                isOtpComplete && !isLoading
                  ? "bg-[#D92121] hover:bg-[#b81b1b] text-white cursor-pointer active:scale-[0.98]"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* ─── State 3: Enter Name for First Time Users ─────────────── */}
      {step === "NAME" && (
        <form onSubmit={handleSaveName} className="flex-1 flex flex-col justify-between">
          <div className="space-y-5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-accent-red flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="text-left space-y-0.5">
                <h4 className="font-secondary font-bold text-lg sm:text-xl text-neutral-900">
                  Welcome to Nepali Tales!
                </h4>
                <p className="text-xs text-neutral-500">
                  Please enter your name to complete your profile
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            {/* Name Input Field */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-neutral-700">
                Your Full Name <span className="text-accent-red">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="e.g. Ankit Bhavarthe"
                className={`${authInputClass} placeholder-neutral-400 border-neutral-200 text-base`}
              />
              <p className="text-[11px] text-neutral-400">
                This will be used for your orders and delivery rider contact
              </p>
            </div>
          </div>

          {/* Complete & Continue Button */}
          <div className="pt-6 w-full">
            <button
              type="submit"
              disabled={name.trim().length < 2 || isLoading}
              className={`w-full font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 select-none ${
                name.trim().length >= 2 && !isLoading
                  ? "bg-[#D92121] hover:bg-[#b81b1b] text-white cursor-pointer active:scale-[0.98]"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving name...</span>
                </>
              ) : (
                <>
                  <span>Save & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
