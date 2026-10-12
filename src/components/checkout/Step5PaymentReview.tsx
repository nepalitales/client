"use client";

import React, { useState } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import { useCart } from "@/context/CartContext";
import {
  createClientOrder,
  verifyClientPayment,
  loadRazorpayScript,
  type CreateOrderPayload,
} from "@/lib/api";
import { Loader2, ShieldCheck } from "lucide-react";

export function Step5PaymentReview() {
  const {
    orderType,
    selectedDate,
    selectedSlot,
    contactInfo,
    address,
    user,
    setConfirmedOrder,
    nextStep,
  } = useCheckout();

  const {
    items,
    addons,
    itemsSubtotal,
    addonsSubtotal,
    deliveryFee,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("Connecting to Razorpay...");
  const [paymentError, setPaymentError] = useState("");

  // Delivery charges are paid directly by the user upon delivery via Borzo/Porter
  const totalPayable = itemsSubtotal + addonsSubtotal;

  const slotDisplay = selectedSlot?.label || "12:30 PM - 02:00 PM";
  const dateDisplay = selectedDate || "Tomorrow";

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setPaymentError("");
    setProcessingStatus("Initializing Razorpay Secure Checkout...");

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setPaymentError("Could not load payment gateway. Please check your internet connection and try again.");
        setIsProcessing(false);
        return;
      }

      // 2. Prepare order payload
      const orderPayload: CreateOrderPayload = {
        orderType,
        dispatchSlotId: selectedSlot?.id || "slot_default",
        dispatchDate: selectedDate || undefined,
        customerName: contactInfo.name || user?.username || "Customer",
        contactPhone: contactInfo.phone || user?.phone || "9820098200",
        contactEmail: contactInfo.email || user?.email || undefined,
        notes: contactInfo.notes || undefined,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        addons: addons.map((a) => ({
          addonId: a.addon.id,
          quantity: a.quantity,
        })),
        address: orderType === "delivery" ? address : undefined,
      };

      // 3. Create order on server
      const serverResult = await createClientOrder(orderPayload);

      if (!serverResult.success || !serverResult.order) {
        setPaymentError(
          serverResult.message || "Failed to create order. Please check slot availability and try again."
        );
        setIsProcessing(false);
        return;
      }

      // 4. Resolve Razorpay credentials from server response
      const razorpayOrderId =
        serverResult.razorpay?.orderId ||
        serverResult.payment?.razorpayOrderId;
      const razorpayKeyId =
        serverResult.razorpay?.keyId ||
        serverResult.payment?.keyId ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const amount =
        serverResult.razorpay?.amount ||
        serverResult.payment?.amount ||
        totalPayable * 100;
      const currency =
        serverResult.razorpay?.currency ||
        serverResult.payment?.currency ||
        "INR";

      // 5. If Razorpay order ID and Key are present, open Razorpay Checkout modal
      if (razorpayOrderId && razorpayKeyId && (window as unknown as { Razorpay?: any }).Razorpay) {
        setProcessingStatus("Opening Razorpay Modal...");
        const Razorpay = (window as unknown as { Razorpay: any }).Razorpay;

        const options = {
          key: razorpayKeyId,
          amount,
          currency,
          name: "Nepali Tales",
          description: "Artisanal Nepali Momo Pre-Order",
          order_id: razorpayOrderId,
          prefill: {
            name: contactInfo.name || user?.username || "",
            email: contactInfo.email || user?.email || "",
            contact: contactInfo.phone || user?.phone || "",
          },
          theme: { color: "#D92121" },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setProcessingStatus("");
            },
          },
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            setProcessingStatus("Verifying secure payment with server...");
            try {
              const verifyRes = await verifyClientPayment({
                orderId: serverResult.order!.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                handlePaymentSuccess({
                  orderId: serverResult.order?.orderNumber || serverResult.order?.id || response.razorpay_order_id,
                  serverOrder: verifyRes.order || serverResult.order,
                  razorpayPaymentId: response.razorpay_payment_id,
                });
              } else {
                setPaymentError(verifyRes.message || "Payment verification failed. Please contact support.");
                setIsProcessing(false);
              }
            } catch {
              // Network issue after successful charge - complete checkout with order info
              handlePaymentSuccess({
                orderId: serverResult.order?.orderNumber || serverResult.order?.id || response.razorpay_order_id,
                serverOrder: serverResult.order,
                razorpayPaymentId: response.razorpay_payment_id,
              });
            }
          },
        };

        const rzp = new Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setIsProcessing(false);
          setPaymentError(
            response.error?.description || "Payment failed. Please choose another payment method or try again."
          );
        });
        rzp.open();
        setIsProcessing(false);
        return;
      }

      // If development / simulated mode fallback
      if (serverResult.payment?.isSimulated || serverResult.razorpay?.isSimulated) {
        setProcessingStatus("Processing test sandbox payment...");
        await new Promise((r) => setTimeout(r, 1200));
        handlePaymentSuccess({
          orderId: serverResult.order?.orderNumber || serverResult.order?.id || `NT-${Date.now().toString().slice(-5)}`,
          serverOrder: serverResult.order,
        });
        return;
      }

      // If Razorpay gateway is unconfigured on server
      setPaymentError("Payment gateway is temporarily unavailable. Please try again shortly.");
      setIsProcessing(false);
    } catch (err: any) {
      console.error("[Payment] Error during checkout:", err);
      setPaymentError(err?.message || "An unexpected error occurred during checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = (params: {
    orderId: string;
    serverOrder?: any;
    razorpayPaymentId?: string;
  }) => {
    const confirmedData = {
      id: params.orderId,
      orderNumber: params.orderId,
      orderType,
      totalAmount: totalPayable,
      subtotal: itemsSubtotal + addonsSubtotal,
      deliveryFee: 0,
      status: "confirmed",
      paymentStatus: "paid",
      dispatchDate: dateDisplay,
      dispatchSlotLabel: slotDisplay,
      customerName: contactInfo.name || user?.username || "Food Connoisseur",
      contactPhone: contactInfo.phone || user?.phone || "9820098200",
      contactEmail: contactInfo.email || user?.email || "customer@nepalitales.in",
      items: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      addons: addons.map((a) => ({
        addonId: a.addon.id,
        name: a.addon.name,
        price: a.addon.price,
        quantity: a.quantity,
      })),
      deliveryAddress: orderType === "delivery" ? address : undefined,
      createdAt: new Date().toISOString(),
    };

    setConfirmedOrder(confirmedData);
    clearCart();
    setIsProcessing(false);
    nextStep();
  };

  return (
    <div className="flex flex-col min-h-95 justify-between pt-2 pb-2 font-secondary">
      <div className="space-y-4 pt-1">
        {paymentError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {paymentError}
          </div>
        )}

        {/* ─── Destination & Window Card ───────────────────────── */}
        <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-neutral-900">
            <span>{orderType === "delivery" ? "Doorstep Delivery" : "Cloud Kitchen Pickup"}</span>
            <span className="text-[#D92121]">
              {orderType === "delivery"
                ? (address.city && !address.city.toLowerCase().includes("thane") ? address.city : "All Over Mumbai")
                : "Kasarvadavali Kitchen"}
            </span>
          </div>

          <p className="text-neutral-500 text-[11px]">
            Scheduled Delivery / Pickup: <strong>{dateDisplay}</strong> ({slotDisplay})
          </p>

          <p className="text-neutral-500 text-[11px] truncate">
            {orderType === "delivery"
              ? [
                  address.flatNumber ? `Flat ${address.flatNumber}` : address.apartment,
                  address.wing ? `Wing ${address.wing}` : null,
                  address.addressLine1 || address.building,
                  address.addressLine2 || address.street,
                  address.landmark,
                  address.city || "Thane",
                  address.pincode,
                ]
                  .filter(Boolean)
                  .join(", ")
              : `Contact: ${contactInfo.name || "Customer"} · +91 ${contactInfo.phone}`}
          </p>
        </div>

        {/* ─── Bill Breakdown ─────────────────────────────────── */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200 space-y-2.5 text-xs">
          <div className="flex justify-between text-neutral-600">
            <span>Items Subtotal ({items.length})</span>
            <span className="font-semibold text-neutral-900">₹{itemsSubtotal}</span>
          </div>

          {addonsSubtotal > 0 && (
            <div className="flex justify-between text-neutral-600">
              <span>Add-ons ({addons.length})</span>
              <span className="font-semibold text-neutral-900">₹{addonsSubtotal}</span>
            </div>
          )}

          <div className="flex justify-between text-neutral-600">
            <span>Delivery Charges</span>
            <span className="font-semibold text-neutral-900">
              {orderType === "delivery"
                ? "Paid by user upon delivery"
                : "FREE (Self-Pickup)"}
            </span>
          </div>

          {orderType === "delivery" && (
            <div className="rounded-lg bg-neutral-50 border border-neutral-200/70 p-2.5 text-[11px] text-neutral-600 leading-relaxed">
              Delivery charges are paid directly by user upon delivery to courier service (Borzo / Porter).
            </div>
          )}

          <div className="flex justify-between pt-2.5 border-t border-neutral-200 text-sm font-bold text-neutral-950">
            <span>Total to Pay</span>
            <span className="text-[#D92121] text-base">₹{totalPayable}</span>
          </div>
        </div>

        {/* Razorpay Trust Badge */}
        <div className="py-2.5 px-3 rounded-lg bg-neutral-100 text-center text-[11px] text-neutral-600 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Secured with Razorpay (UPI, Google Pay, Cards, NetBanking)</span>
        </div>
      </div>

      {/* ─── Action Button: Pay with Razorpay ─────────────────── */}
      <div className="pt-6 w-full">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleRazorpayPayment}
          className="w-full bg-[#D92121] hover:bg-[#b81b1b] disabled:opacity-75 text-white font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{processingStatus}</span>
            </>
          ) : (
            <span>Pay ₹{totalPayable} via Razorpay</span>
          )}
        </button>
      </div>
    </div>
  );
}
