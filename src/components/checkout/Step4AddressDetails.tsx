"use client";

import React, { useState, useEffect } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import {
  updateClientProfile,
  type ClientAddress,
} from "@/lib/api";
import {
  Store,
  Info,
  Home,
  Briefcase,
  MapPin,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const baseInputClass =
  "w-full px-4 py-3 bg-white border rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all";
const phoneInputClass =
  "w-full pl-12 pr-4 py-3 bg-white border rounded-lg text-xs sm:text-sm text-neutral-900 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all";

export function Step4AddressDetails() {
  const {
    orderType,
    user,
    setUser,
    contactInfo,
    setContactInfo,
    address,
    setAddress,
    savedAddresses,
    saveAddressToServer,
    orderSettings,
    nextStep,
  } = useCheckout();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize or prefill contact details from logged-in user profile
  useEffect(() => {
    if (user) {
      setContactInfo((prev) => ({
        ...prev,
        name: prev.name?.trim() ? prev.name : (user.username || ""),
        phone: prev.phone?.trim() ? prev.phone : (user.phone || ""),
        email: prev.email?.trim() ? prev.email : (user.email || ""),
      }));
    }
  }, [user, setContactInfo]);

  // If saved addresses exist from DB and address fields are empty, prefill from first saved address
  useEffect(() => {
    if (orderType === "delivery" && savedAddresses.length > 0 && !address.flatNumber && !address.addressLine1) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setAddress((prev) => ({
        ...prev,
        label: defaultAddr.label || prev.label || "Home",
        flatNumber: defaultAddr.flatNumber || defaultAddr.apartment || "",
        wing: defaultAddr.wing || "",
        addressLine1: defaultAddr.addressLine1 || defaultAddr.building || "",
        addressLine2: defaultAddr.addressLine2 || defaultAddr.street || "",
        street: defaultAddr.street || defaultAddr.addressLine2 || "",
        building: defaultAddr.building || defaultAddr.addressLine1 || "",
        apartment: defaultAddr.apartment || defaultAddr.flatNumber || "",
        landmark: defaultAddr.landmark || "",
        city: defaultAddr.city || "Mumbai",
        pincode: defaultAddr.pincode || "",
      }));
    }
  }, [orderType, savedAddresses, address.flatNumber, address.addressLine1, setAddress]);

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
      const flat = (address.flatNumber || address.apartment || "").trim();
      if (!flat) {
        errs.flatNumber = "Please enter flat / house number";
      }

      const line1 = (address.addressLine1 || address.building || "").trim();
      if (!line1) {
        errs.addressLine1 = "Please enter building / society name";
      }

      const line2 = (address.addressLine2 || address.street || "").trim();
      if (!line2) {
        errs.addressLine2 = "Please enter street / area / locality";
      }

      const cleanPincode = (address.pincode || "").replace(/\D/g, "");
      if (!cleanPincode || cleanPincode.length !== 6) {
        errs.pincode = "Enter a valid 6-digit pincode";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Sync receiver phone and username to user profile in MongoDB and update state
      const cleanPhone = contactInfo.phone.replace(/\D/g, "");
      const cleanName = contactInfo.name.trim();

      if (cleanPhone || cleanName) {
        try {
          const profileRes = await updateClientProfile({
            phone: cleanPhone || user?.phone,
            username: cleanName || user?.username,
          });
          if (profileRes?.success && profileRes?.user) {
            setUser(profileRes.user);
            try {
              localStorage.setItem("nt_client_user", JSON.stringify(profileRes.user));
            } catch {}
          } else if (user) {
            const mergedUser = {
              ...user,
              phone: cleanPhone || user.phone,
              username: cleanName || user.username,
            };
            setUser(mergedUser);
            try {
              localStorage.setItem("nt_client_user", JSON.stringify(mergedUser));
            } catch {}
          }
        } catch (e) {
          console.warn("[Address] Non-fatal user phone/profile update error:", e);
        }
      }

      // 2. Persist specific delivery address to MongoDB server
      if (orderType === "delivery") {
        const fullAddressToSave: ClientAddress = {
          label: address.label || "Home",
          flatNumber: (address.flatNumber || address.apartment || "").trim(),
          wing: (address.wing || "").trim(),
          addressLine1: (address.addressLine1 || address.building || "").trim(),
          addressLine2: (address.addressLine2 || address.street || "").trim(),
          street: (address.addressLine2 || address.street || address.addressLine1 || "").trim(),
          building: (address.addressLine1 || address.building || "").trim(),
          apartment: (address.flatNumber || address.apartment || "").trim(),
          landmark: (address.landmark || "").trim(),
          city: (address.city || "Mumbai").trim(),
          pincode: (address.pincode || "").replace(/\D/g, "").trim(),
        };

        setAddress(fullAddressToSave);
        await saveAddressToServer(fullAddressToSave);
      }

      nextStep();
    } catch (err) {
      console.warn("[Address] Submit address error:", err);
      nextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasSavedAddressInDb = savedAddresses.length > 0;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col min-h-95 justify-between pt-2 pb-2 font-secondary">
      {orderType === "delivery" ? (
        /* ─── Doorstep Delivery Form (Zomato / Blinkit / Swiggy standard) ─── */
        <div className="space-y-3 pt-1 text-left">
          {/* Saved Address Status Badge */}
          {hasSavedAddressInDb && (
            <div className="flex items-center gap-2 p-2 px-3 bg-emerald-50 border border-emerald-200/80 rounded-lg text-emerald-800 text-[11px] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Loaded your saved address from account</span>
            </div>
          )}

          {/* ─── 1. Receiver Details ───────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Receiver Name */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Receiver&apos;s Name <span className="text-accent-red">*</span>
              </label>
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
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Mobile Number <span className="text-accent-red">*</span>
              </label>
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
                  placeholder="10-digit mobile"
                  className={`${phoneInputClass} placeholder-neutral-400 ${
                    errors.phone ? "border-red-500" : "border-neutral-200"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.phone}</p>}
            </div>
          </div>

          {/* ─── 2. Address Type Pills (Home / Work / Other) ────── */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1.5">
              Save As
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: "Home", label: "Home", icon: Home },
                { id: "Work", label: "Work", icon: Briefcase },
                { id: "Other", label: "Other", icon: MapPin },
              ].map((pill) => {
                const Icon = pill.icon;
                const isSelected = (address.label || "Home") === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setAddress((prev) => ({ ...prev, label: pill.id }))}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isSelected
                        ? "bg-neutral-900 text-white shadow-xs"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── 3. Specific Delivery Details (Flat & Wing) ─────── */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Flat / House No */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Flat / House No. <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                required
                value={address.flatNumber || address.apartment || ""}
                onChange={(e) => {
                  setAddress((prev) => ({
                    ...prev,
                    flatNumber: e.target.value,
                    apartment: e.target.value,
                  }));
                  if (errors.flatNumber) setErrors((prev) => ({ ...prev, flatNumber: "" }));
                }}
                placeholder="e.g. Flat 402"
                className={`${baseInputClass} placeholder-neutral-400 ${
                  errors.flatNumber ? "border-red-500" : "border-neutral-200"
                }`}
              />
              {errors.flatNumber && (
                <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.flatNumber}</p>
              )}
            </div>

            {/* Wing / Tower */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Wing / Tower (Optional)
              </label>
              <input
                type="text"
                value={address.wing || ""}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, wing: e.target.value }));
                }}
                placeholder="e.g. Wing B / Tower 1"
                className={`${baseInputClass} placeholder-neutral-400 border-neutral-200`}
              />
            </div>
          </div>

          {/* ─── 4. Address Line 1 (Building / Society Name) ────── */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Building / Society / Apartment <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              required
              value={address.addressLine1 || address.building || ""}
              onChange={(e) => {
                setAddress((prev) => ({
                  ...prev,
                  addressLine1: e.target.value,
                  building: e.target.value,
                }));
                if (errors.addressLine1) setErrors((prev) => ({ ...prev, addressLine1: "" }));
              }}
              placeholder="e.g. Metropolis Riveria"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.addressLine1 ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.addressLine1 && (
              <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.addressLine1}</p>
            )}
          </div>

          {/* ─── 5. Address Line 2 (Street / Area / Locality) ────── */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Area / Street / Locality <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              required
              value={address.addressLine2 || address.street || ""}
              onChange={(e) => {
                setAddress((prev) => ({
                  ...prev,
                  addressLine2: e.target.value,
                  street: e.target.value,
                }));
                if (errors.addressLine2) setErrors((prev) => ({ ...prev, addressLine2: "" }));
              }}
              placeholder="e.g. Kasarvadavali, Ghodbunder Road"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.addressLine2 ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.addressLine2 && (
              <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.addressLine2}</p>
            )}
          </div>

          {/* ─── 6. Landmark & Pincode / City ──────────────────── */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Nearby Landmark (Optional)
            </label>
            <input
              type="text"
              value={address.landmark || ""}
              onChange={(e) => setAddress((prev) => ({ ...prev, landmark: e.target.value }))}
              placeholder="e.g. Opp. Laxmi Narayan Mandir"
              className={`${baseInputClass} placeholder-neutral-400 border-neutral-200`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Pincode */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                Pincode <span className="text-accent-red">*</span>
              </label>
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
                placeholder="6-digit pincode"
                className={`${baseInputClass} placeholder-neutral-400 ${
                  errors.pincode ? "border-red-500" : "border-neutral-200"
                }`}
              />
              {errors.pincode && (
                <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.pincode}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                City <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                required
                value={address.city || "Thane"}
                onChange={(e) => {
                  setAddress((prev) => ({ ...prev, city: e.target.value }));
                }}
                placeholder="Thane / Mumbai"
                className={`${baseInputClass} placeholder-neutral-400 border-neutral-200 font-medium`}
              />
            </div>
          </div>
        </div>
      ) : (
        /* ─── Self-Pickup Contact Form ─────────────────────────────── */
        <div className="space-y-3.5 pt-1 text-left">
          {/* Receiver's Name */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Collector&apos;s Name <span className="text-accent-red">*</span>
            </label>
            <input
              type="text"
              required
              value={contactInfo.name}
              onChange={(e) => {
                setContactInfo((prev) => ({ ...prev, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Your Name"
              className={`${baseInputClass} placeholder-neutral-400 ${
                errors.name ? "border-red-500" : "border-neutral-200"
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-600 mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
              Mobile Number <span className="text-accent-red">*</span>
            </label>
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

      {/* ─── Order Notes / Dietary Instructions ─────────────── */}
      <div className="pt-1 text-left">
        <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
          Specify in Order Notes (Optional)
        </label>
        <textarea
          rows={2}
          value={contactInfo.notes || ""}
          onChange={(e) =>
            setContactInfo((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder='e.g. "No peanut chutney", "Mild spice, no chilli oil"'
          className={`${baseInputClass} placeholder-neutral-400 border-neutral-200 resize-none py-2 text-xs`}
        />
        <p className="text-[10px] text-neutral-500 mt-1 pl-1">
          State any ingredient exclusions or special preparation notes for the kitchen.
        </p>
      </div>

      {/* ─── Proceed to checkout CTA Button ─────────────────────── */}
      <div className="pt-6 w-full">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#D92121] hover:bg-[#b81b1b] text-white font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 select-none disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving details...</span>
            </>
          ) : (
            <span>Proceed to checkout</span>
          )}
        </button>
      </div>
    </form>
  );
}
