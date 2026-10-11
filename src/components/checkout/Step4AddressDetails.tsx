"use client";

import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { Store, Info } from "lucide-react";

const baseInputClass =
  "w-full px-4 py-3 bg-white border rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all";
const phoneInputClass =
  "w-full pl-12 pr-4 py-3 bg-white border rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all";

export function Step4AddressDetails() {
  const {
    orderType,
    contactInfo,
    setContactInfo,
    address,
    setAddress,
    orderSettings,
    nextStep,
  } = useCheckout();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!contactInfo.name.trim()) {
      errs.name = "Please enter receiver's name";
    }

    const cleanPhone = contactInfo.phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 10) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }

    if (orderType === "delivery") {
      if (!address.building?.trim()) {
        errs.building = "Please enter building name / flat no";
      }
      if (!address.street.trim()) {
        errs.street = "Please enter complete address";
      }
      const cleanPincode = (address.pincode || "").replace(/\D/g, "");
      if (!cleanPincode || cleanPincode.length !== 6) {
        errs.pincode = "Enter a valid 6-digit pincode";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      nextStep();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-95 justify-between pt-2 pb-2 font-secondary">
      {orderType === "delivery" ? (
        /* ─── Doorstep Delivery Form (Matches Reference Screenshot Layout) ─── */
        <div className="space-y-3 pt-1">
          {/* 1. Receiver's Name */}
          <div>
            <input
              type="text"
              required
              value={contactInfo.name}
              onChange={(e) => {
                setContactInfo((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Receiver's Name"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.name ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* 1b. Mobile Number */}
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-semibold text-neutral-400 select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                required
                value={contactInfo.phone}
                onChange={(e) => {
                  setContactInfo((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, ""),
                  }));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Mobile Number (for delivery rider)"
                className={`${phoneInputClass} placeholder-neutral-400 ${
                  errors.phone ? "border-red-500" : "border-neutral-200"
                }`}
              />
            </div>
            {errors.phone && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.phone}</p>}
          </div>

          {/* 2. Building Name, Flat No */}
          <div>
            <input
              type="text"
              required
              value={address.building || ""}
              onChange={(e) => {
                setAddress((prev) => ({ ...prev, building: e.target.value }));
                if (errors.building) setErrors((prev) => ({ ...prev, building: "" }));
              }}
              placeholder="Building Name, Flat No"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.building ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.building && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.building}</p>}
          </div>

          {/* 3. Enter Complete Address */}
          <div>
            <input
              type="text"
              required
              value={address.street || ""}
              onChange={(e) => {
                setAddress((prev) => ({ ...prev, street: e.target.value }));
                if (errors.street) setErrors((prev) => ({ ...prev, street: "" }));
              }}
              placeholder="Enter Complete Address"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.street ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.street && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.street}</p>}
          </div>

          {/* 4. 2-column: Pincode & City */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <input
                type="text"
                maxLength={6}
                required
                value={address.pincode || ""}
                onChange={(e) => {
                  setAddress((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/\D/g, ""),
                  }));
                  if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: "" }));
                }}
                placeholder="Pincode"
                className={`${baseInputClass} placeholder-neutral-400 ${
                  errors.pincode ? "border-red-500" : "border-neutral-200"
                }`}
              />
              {errors.pincode && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.pincode}</p>}
            </div>

            <div>
              <input
                type="text"
                required
                value={address.city || "Mumbai"}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, city: e.target.value }));
                }}
                placeholder="City (e.g. Mumbai)"
                className={`${baseInputClass} placeholder-neutral-400 border-neutral-200 font-medium`}
              />
            </div>
          </div>

          {/* 5. Nearby landmark */}
          <div>
            <input
              type="text"
              value={address.landmark || ""}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, landmark: e.target.value }))
              }
              placeholder="Nearby landmark"
              className={`${baseInputClass} placeholder-neutral-400 border-neutral-200`}
            />
          </div>
        </div>
      ) : (
        /* ─── Self-Pickup Contact Form ─────────────────────────────── */
        <div className="space-y-3.5 pt-1">
          {/* Receiver's Name */}
          <div>
            <input
              type="text"
              required
              value={contactInfo.name}
              onChange={(e) => {
                setContactInfo((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Receiver's Name"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.name ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-xs font-semibold text-neutral-400 select-none">
                +91
              </span>
              <input
                type="tel"
                maxLength={10}
                required
                value={contactInfo.phone}
                onChange={(e) => {
                  setContactInfo((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, ""),
                  }));
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                }}
                placeholder="Mobile Number"
                className={`${phoneInputClass} placeholder-neutral-400 ${
                  errors.phone ? "border-red-500" : "border-neutral-200"
                }`}
              />
            </div>
            {errors.phone && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.phone}</p>}
          </div>

          {/* Kitchen Pickup Instructions Card */}
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#D92121]" />
              <span className="font-bold text-xs text-neutral-900">
                Kitchen Collection Counter
              </span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, Thane West - 400615.
            </p>
            <div className="flex items-start gap-1.5 pt-1 text-[11px] text-neutral-500">
              <Info className="w-3.5 h-3.5 shrink-0 text-neutral-400 mt-0.5" />
              <span>
                {orderSettings.pickupInstructions ||
                  "Present your Order ID or registered email at the counter."}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Proceed to checkout CTA Button ─────────────────────── */}
      <div className="pt-6 w-full">
        <button
          type="submit"
          className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer"
        >
          Proceed to checkout
        </button>
      </div>
    </form>
  );
}
