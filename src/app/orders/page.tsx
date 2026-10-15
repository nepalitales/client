"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useCheckout } from "@/context/CheckoutContext";
import {
  getClientOrders,
  cancelClientOrder,
  downloadClientOrderInvoice,
  subscribeToLiveCatalogUpdates,
  formatExternalTrackingUrl,
  type ClientOrder,
  type ClientOrderStatus,
} from "@/lib/api";
import {
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Copy,
  Check,
  Truck,
  ExternalLink,
  MapPin,
  Calendar,
  ArrowLeft,
  Receipt,
  Store,
  Download,
  Loader2,
  Phone,
  Info,
  ChefHat,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

// Helper: Format raw ISO/date string into friendly human date
function formatReadableDate(dateStr?: string) {
  if (!dateStr) return "Scheduled Pre-order";
  try {
    // If format is YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const target = new Date(year, month - 1, day);
      const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      const formatted = new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);

      if (diffDays === 0) return `Today (${formatted})`;
      if (diffDays === 1) return `Tomorrow (${formatted})`;
      if (diffDays === -1) return `Yesterday (${formatted})`;
      return formatted;
    }

    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

// Helper: Format timestamps to readable IST time
function formatDateTime(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateStr;
  }
}

function formatCancelDeadline(dateStr?: string) {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export default function MyOrdersPage() {
  const { isLoggedIn, openAuthModal, user } = useCheckout();
  const [orders, setOrders] = useState<ClientOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  // Filter Tabs: "all" | "active" | "delivered" | "cancelled"
  const [activeTab, setActiveTab] = useState<"all" | "active" | "delivered" | "cancelled">("all");

  // Cancellation Modal State
  const [orderToCancel, setOrderToCancel] = useState<ClientOrder | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const handleDownloadInvoice = async (order: ClientOrder) => {
    setDownloadingInvoiceId(order.id);
    try {
      toast.info(`Preparing invoice for #${order.orderNumber}...`);
      await downloadClientOrderInvoice(order.id, order.orderNumber);
      toast.success("Invoice PDF downloaded!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to download bill PDF");
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!isSilent) setLoading(true);

    try {
      const res = await getClientOrders();
      if (res.success && Array.isArray(res.orders)) {
        setOrders(res.orders);
      } else {
        if (!isSilent) toast.error(res.message || "Unable to fetch orders.");
      }
    } catch {
      if (!isSilent) toast.error("Network error fetching orders.");
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  // 1. Initial load on mount or auth change
  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [isLoggedIn, fetchOrders]);

  // 2. Real-time Updates (SWR + Live broadcast + Adaptive Polling)
  useEffect(() => {
    if (!isLoggedIn) return;

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchOrders(true);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    const unsubscribeLive = subscribeToLiveCatalogUpdates(() => {
      fetchOrders(true);
    });

    const hasActiveOrders = orders.some(
      (o) =>
        o.status !== "delivered" &&
        o.status !== "cancelled_by_customer" &&
        o.status !== "cancelled_by_admin"
    );

    const pollIntervalMs = hasActiveOrders ? 8000 : 45000;

    const intervalId = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchOrders(true);
      }
    }, pollIntervalMs);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      unsubscribeLive();
      clearInterval(intervalId);
    };
  }, [isLoggedIn, orders, fetchOrders]);

  const handleCopy = (orderNumber: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(orderNumber);
      setCopiedOrderId(orderNumber);
      toast.success(`Copied Order #${orderNumber}`);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setCancelling(true);

    try {
      const res = await cancelClientOrder(orderToCancel.id);
      if (res.success) {
        toast.success(res.message || "Order cancelled successfully. Full refund initiated.");
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderToCancel.id
              ? {
                  ...o,
                  status: "cancelled_by_customer" as ClientOrderStatus,
                  refund: {
                    status: "refunded",
                    amount: o.totalAmount,
                    type: "full",
                    reason: "Cancelled by customer before order window closed",
                  },
                }
              : o
          )
        );
        setOrderToCancel(null);
      } else {
        toast.error(res.message || "Could not cancel order.");
      }
    } catch {
      toast.error("Network error attempting to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: ClientOrderStatus) => {
    switch (status) {
      case "placed":
        return {
          label: "Order Confirmed",
          bgColor: "bg-blue-50 text-blue-700 border-blue-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "preparing":
        return {
          label: "Cooking Fresh",
          bgColor: "bg-amber-50 text-amber-700 border-amber-200",
          icon: <ChefHat className="w-3.5 h-3.5" />,
        };
      case "ready":
        return {
          label: "Packed & Ready",
          bgColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          icon: <Package className="w-3.5 h-3.5" />,
        };
      case "porter_booked":
      case "out_for_delivery":
        return {
          label: "Out for Delivery",
          bgColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          icon: <Truck className="w-3.5 h-3.5" />,
        };
      case "delivered":
        return {
          label: "Delivered",
          bgColor: "bg-green-50 text-green-700 border-green-200",
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case "cancelled_by_customer":
        return {
          label: "Cancelled by You",
          bgColor: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <X className="w-3.5 h-3.5" />,
        };
      case "cancelled_by_admin":
        return {
          label: "Cancelled by Kitchen",
          bgColor: "bg-rose-50 text-rose-700 border-rose-200",
          icon: <X className="w-3.5 h-3.5" />,
        };
      case "pending_payment":
        return {
          label: "Awaiting Payment",
          bgColor: "bg-neutral-100 text-neutral-700 border-neutral-200",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      default:
        return {
          label: status,
          bgColor: "bg-neutral-100 text-neutral-700 border-neutral-200",
          icon: <Clock className="w-3.5 h-3.5" />,
        };
    }
  };

  const isOrderCancellable = (order: ClientOrder) => {
    if (order.status !== "placed") return false;
    if (!order.canCustomerCancelUntil) return false;
    const deadline = new Date(order.canCustomerCancelUntil).getTime();
    return Date.now() <= deadline;
  };

  // Filtered orders and counts
  const counts = useMemo(() => {
    let active = 0;
    let delivered = 0;
    let cancelled = 0;

    for (const o of orders) {
      if (o.status === "delivered") {
        delivered++;
      } else if (
        o.status === "cancelled_by_customer" ||
        o.status === "cancelled_by_admin"
      ) {
        cancelled++;
      } else {
        active++;
      }
    }

    return { all: orders.length, active, delivered, cancelled };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (activeTab === "active") {
      return orders.filter(
        (o) =>
          o.status !== "delivered" &&
          o.status !== "cancelled_by_customer" &&
          o.status !== "cancelled_by_admin"
      );
    }
    if (activeTab === "delivered") {
      return orders.filter((o) => o.status === "delivered");
    }
    if (activeTab === "cancelled") {
      return orders.filter(
        (o) =>
          o.status === "cancelled_by_customer" ||
          o.status === "cancelled_by_admin"
      );
    }
    return orders;
  }, [orders, activeTab]);

  return (
    <main className="min-h-screen bg-[#FDFCFB] pt-28 pb-20 font-secondary text-neutral-900">
      <div className="figma-container max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-accent-red uppercase tracking-wider transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="font-secondary text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Track live chef preparation, delivery schedules, and manage your pre-orders.
            </p>
          </div>
        </div>

        {/* ─── State 1: User Not Logged In ─────────────────────────────── */}
        {!isLoggedIn ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-accent-red flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Package className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h2 className="font-secondary text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
              Sign In to View Your Orders
            </h2>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-7 leading-relaxed">
              Log in with your mobile number or email to view your orders, live preparation status, and download invoices.
            </p>
            <button
              type="button"
              onClick={openAuthModal}
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-[#b81b1b] rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In to Your Account
            </button>
          </div>
        ) : loading ? (
          /* ─── State 2: Loading Skeleton ─────────────────────────────── */
          <div className="space-y-5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-neutral-200/80 p-6 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-neutral-200 rounded w-32" />
                  <div className="h-6 bg-neutral-200 rounded-full w-28" />
                </div>
                <div className="h-20 bg-neutral-100 rounded-xl" />
                <div className="h-12 bg-neutral-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          /* ─── State 3: Empty State (No orders) ───────────────────────── */
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-5">
              <Receipt className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="font-secondary text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
              No Orders Placed Yet
            </h2>
            <p className="text-sm text-neutral-500 max-w-md mx-auto mb-7 leading-relaxed">
              You haven&apos;t placed any orders yet. Treat yourself to handcrafted authentic Nepali momos made fresh by our chefs!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-accent-red hover:bg-[#b81b1b] rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              Explore Our Menu
            </Link>
          </div>
        ) : (
          /* ─── State 4: Orders List with Tabs ─────────────────────────── */
          <div className="space-y-6">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "all"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                All Orders ({counts.all})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "active"
                    ? "bg-amber-500 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                {counts.active > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span>Active ({counts.active})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("delivered")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeTab === "delivered"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                Delivered ({counts.delivered})
              </button>

              {counts.cancelled > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("cancelled")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeTab === "cancelled"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                  }`}
                >
                  Cancelled ({counts.cancelled})
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200/80 p-8 text-center text-sm text-neutral-500">
                No orders found under this tab.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const cancellable = isOrderCancellable(order);
                const isCancelled =
                  order.status === "cancelled_by_customer" ||
                  order.status === "cancelled_by_admin";
                const isPickup = order.orderType === "pickup";

                // Step status index: 0=placed, 1=preparing, 2=ready, 3=out_for_delivery, 4=delivered
                const getStepIndex = (status: ClientOrderStatus): number => {
                  switch (status) {
                    case "placed":
                      return 0;
                    case "preparing":
                      return 1;
                    case "ready":
                      return 2;
                    case "porter_booked":
                    case "out_for_delivery":
                      return 3;
                    case "delivered":
                      return 4;
                    default:
                      return 0;
                  }
                };
                const currentStepIdx = getStepIndex(order.status);

                const timelineSteps = [
                  { label: "Confirmed", desc: "Payment verified", icon: CheckCircle2 },
                  { label: "Cooking", desc: "Chefs preparing", icon: ChefHat },
                  { label: "Packed", desc: isPickup ? "Ready at kitchen" : "Ready for courier", icon: Package },
                  { label: isPickup ? "Pickup Ready" : "On the Way", desc: isPickup ? "Collect at counter" : "Rider dispatched", icon: Truck },
                  { label: "Delivered", desc: isPickup ? "Picked up" : "Delivered", icon: CheckCircle2 },
                ];

                // Assemble clean address
                const addr = order.deliveryAddress;
                const addressParts: string[] = [];
                if (addr?.flatNumber) addressParts.push(`Flat ${addr.flatNumber}`);
                if (addr?.wing) addressParts.push(`Wing ${addr.wing}`);
                if (addr?.building) addressParts.push(addr.building);
                if (addr?.street) addressParts.push(addr.street);
                if (addr?.landmark) addressParts.push(`Near ${addr.landmark}`);
                if (addr?.city) addressParts.push(addr.city);
                if (addr?.pincode) addressParts.push(addr.pincode);

                const formattedAddress = addressParts.length > 0
                  ? addressParts.join(", ")
                  : (addr?.borzoFormat?.address || "Address provided during checkout");

                const customerName = order.customer?.name || user?.username || "Customer";
                const customerPhone = order.customer?.phone || user?.phone || "";

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all"
                  >
                    {/* ─── Card Header ───────────────────────────────── */}
                    <div className="p-5 sm:p-6 border-b border-neutral-100 bg-neutral-50/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-extrabold text-neutral-900 tracking-tight">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(order.orderNumber)}
                            title="Copy Order Number"
                            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                          >
                            {copiedOrderId === order.orderNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <span className="text-neutral-300 hidden sm:inline">|</span>

                        <span className="text-xs text-neutral-500">
                          Placed on {formatDateTime(order.createdAt)}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-neutral-200/70 text-neutral-700">
                          {isPickup ? (
                            <>
                              <Store className="w-3 h-3 text-emerald-600" />
                              <span>Self Pickup</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3 text-blue-600" />
                              <span>Delivery</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Download Bill PDF */}
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(order)}
                          disabled={downloadingInvoiceId === order.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 transition-colors shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
                          title="Download Receipt / Invoice PDF"
                        >
                          {downloadingInvoiceId === order.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                          ) : (
                            <Download className="w-3.5 h-3.5 text-neutral-500" />
                          )}
                          <span>Bill PDF</span>
                        </button>

                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${statusBadge.bgColor}`}
                        >
                          {statusBadge.icon}
                          <span>{statusBadge.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* ─── Card Body ─────────────────────────────────── */}
                    <div className="p-5 sm:p-6 space-y-6">
                      
                      {/* 1. Visual Progress Stepper (Only for active / delivered orders) */}
                      {!isCancelled ? (
                        <div className="bg-neutral-50/80 rounded-2xl p-4 sm:p-5 border border-neutral-200/60">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 sm:mb-4">
                            Live Order Journey
                          </p>

                          {/* Desktop Stepper */}
                          <div className="hidden sm:grid sm:grid-cols-5 relative">
                            {/* Connecting Line behind icons */}
                            <div className="absolute top-4 left-[10%] right-[10%] h-0.5 bg-neutral-200 z-0">
                              <div
                                className="h-full bg-emerald-500 transition-all duration-500"
                                style={{
                                  width: `${Math.min(100, (currentStepIdx / 4) * 100)}%`,
                                }}
                              />
                            </div>

                            {timelineSteps.map((step, idx) => {
                              const isCompleted = idx < currentStepIdx;
                              const isCurrent = idx === currentStepIdx;
                              const StepIcon = step.icon;

                              return (
                                <div key={idx} className="flex flex-col items-center text-center relative z-10 px-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                      isCompleted
                                        ? "bg-emerald-500 text-white shadow-2xs"
                                        : isCurrent
                                        ? "bg-accent-red text-white ring-4 ring-red-100 shadow-xs"
                                        : "bg-white text-neutral-300 border border-neutral-200"
                                    }`}
                                  >
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                  <span
                                    className={`text-xs font-bold mt-2 ${
                                      isCurrent
                                        ? "text-neutral-900 font-extrabold"
                                        : isCompleted
                                        ? "text-emerald-700 font-semibold"
                                        : "text-neutral-400 font-medium"
                                    }`}
                                  >
                                    {step.label}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 mt-0.5 leading-tight">
                                    {step.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Mobile Stepper View */}
                          <div className="sm:hidden flex items-center justify-between bg-white rounded-xl p-3 border border-neutral-200/80">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-accent-red text-white flex items-center justify-center shrink-0 shadow-2xs">
                                {React.createElement(timelineSteps[currentStepIdx]?.icon || Clock, {
                                  className: "w-4 h-4",
                                })}
                              </div>
                              <div>
                                <span className="text-xs font-extrabold text-neutral-900 block">
                                  Stage {currentStepIdx + 1} of 5: {timelineSteps[currentStepIdx]?.label}
                                </span>
                                <span className="text-[11px] text-neutral-500 block">
                                  {timelineSteps[currentStepIdx]?.desc}
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-accent-red px-2 py-1 rounded bg-red-50">
                              {currentStepIdx === 4 ? "Done" : "In Progress"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Cancelled Alert Box */
                        <div className="bg-rose-50/70 rounded-2xl p-4 sm:p-5 border border-rose-200/80 text-xs text-rose-950 flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-rose-900">
                              Order Cancelled {order.status === "cancelled_by_admin" ? "by Kitchen" : "by You"}
                            </p>
                            <p className="text-neutral-700 leading-relaxed">
                              A 100% full refund of <strong>₹{order.totalAmount}</strong> has been initiated directly to your original payment method via Razorpay. Depending on your bank or UPI app, it will be credited within 3–5 working days.
                            </p>
                            {order.refund?.razorpayRefundId && (
                              <p className="font-mono text-[11px] text-neutral-500 pt-1">
                                Razorpay Refund ID: <strong className="text-neutral-800">{order.refund.razorpayRefundId}</strong>
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 2. Schedule & Fulfillment Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 bg-neutral-50/70 rounded-2xl p-4 sm:p-5 border border-neutral-200/70 text-xs">
                        
                        {/* Scheduled Timing */}
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-accent-red flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                              {isPickup ? "Scheduled Pickup Window" : "Scheduled Delivery Window"}
                            </p>
                            <p className="font-bold text-neutral-900 text-sm mt-0.5">
                              {formatReadableDate(order.dispatchDate)}
                            </p>
                            <div className="flex items-center gap-1.5 text-neutral-600 mt-1">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Slot: {order.dispatchSlot?.label || "Kitchen Batch Window"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Destination & Recipient */}
                        <div className="flex items-start gap-3 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-neutral-200/70 md:pl-4">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isPickup ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                          }`}>
                            {isPickup ? <Store className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                          </div>
                          <div className="space-y-1">
                            <p className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                              {isPickup ? "Kitchen Pickup Location" : "Delivery Destination"}
                            </p>

                            {/* Recipient info */}
                            <div className="flex items-center gap-2 font-semibold text-neutral-900">
                              <span>{customerName}</span>
                              {customerPhone && (
                                <a
                                  href={`tel:${customerPhone}`}
                                  className="text-neutral-500 hover:text-neutral-900 flex items-center gap-1 text-[11px] font-normal"
                                  title="Contact phone"
                                >
                                  <Phone className="w-3 h-3 text-neutral-400" />
                                  <span>+91 {customerPhone.replace(/^\+?91/, "")}</span>
                                </a>
                              )}
                            </div>

                            {/* Address details */}
                            <p className="text-neutral-600 leading-relaxed">
                              {isPickup
                                ? "Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, Thane West 400615"
                                : formattedAddress}
                            </p>

                            {addr?.borzoFormat?.note && (
                              <p className="text-neutral-500 italic text-[11px] bg-white/80 rounded px-2 py-0.5 border border-neutral-200/50 inline-block">
                                Note: {addr.borzoFormat.note}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. Dishes Ordered Breakdown */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Items Ordered</span>
                          </p>
                          <span className="text-xs text-neutral-500 font-medium">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "plate" : "plates"}
                          </span>
                        </div>

                        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200/80 bg-white overflow-hidden">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-3.5 sm:p-4 flex items-start justify-between gap-4 text-xs sm:text-sm hover:bg-neutral-50/50 transition-colors"
                            >
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-neutral-100 text-neutral-800 text-[11px] font-bold">
                                    {item.quantity}×
                                  </span>
                                  <span className="font-bold text-neutral-900">
                                    {item.productName}
                                  </span>
                                </div>

                                {item.addons && item.addons.length > 0 && (
                                  <div className="pl-7 text-xs text-neutral-500 space-y-1 pt-0.5">
                                    {item.addons.map((add, addIdx) => (
                                      <div key={addIdx} className="flex items-center gap-1 text-[11px]">
                                        <span className="text-neutral-400">+</span>
                                        <span>{add.name}</span>
                                        <span className="text-neutral-400">({add.quantity}×)</span>
                                        <span className="text-neutral-700 font-medium">₹{add.subtotal}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <span className="font-bold text-neutral-900 shrink-0 text-sm">
                                ₹{item.subtotal}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Order Notes (if any) */}
                      {order.notes && (
                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-950">Special Instructions to Kitchen: </span>
                            <span className="italic text-neutral-700">&ldquo;{order.notes}&rdquo;</span>
                          </div>
                        </div>
                      )}

                      {/* 4. Payment & Bill Breakdown Card */}
                      <div className="bg-neutral-50/90 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                          Payment &amp; Bill Breakdown
                        </p>

                        <div className="flex justify-between text-xs text-neutral-600">
                          <span>Items Subtotal</span>
                          <span className="font-semibold text-neutral-900">₹{order.itemTotal}</span>
                        </div>

                        <div className="flex justify-between text-xs text-neutral-600">
                          <span>Delivery Fee</span>
                          <span className="font-semibold text-neutral-900">
                            {isPickup ? (
                              <span className="text-emerald-600 font-semibold">Self Pickup (Free)</span>
                            ) : order.deliveryFee > 0 ? (
                              `₹${order.deliveryFee}`
                            ) : (
                              <span className="text-neutral-600" title="Calculated as per Porter / Borzo rider rate">
                                Borzo / Porter (Pay to delivery partner)
                              </span>
                            )}
                          </span>
                        </div>

                        {order.discount > 0 && (
                          <div className="flex justify-between text-xs text-emerald-600">
                            <span>Discount</span>
                            <span className="font-bold">-₹{order.discount}</span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                              Total Paid
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Paid via Razorpay (Online)</span>
                            </div>
                            {order.payment?.razorpayPaymentId && (
                              <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                                Txn: {order.payment.razorpayPaymentId}
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="font-secondary text-2xl font-extrabold text-neutral-900">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 5. Live Courier Tracking Button (Borzo) */}
                      {order.borzo?.trackingUrl && !isCancelled && (
                        <div className="pt-1">
                          <a
                            href={formatExternalTrackingUrl(order.borzo.trackingUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs active:scale-[0.99]"
                          >
                            <Truck className="w-4 h-4 stroke-[2.2] animate-bounce" />
                            <span>Track Rider Live on Map (Borzo)</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
                          </a>
                        </div>
                      )}

                      {/* 6. Instant Cancellation Banner / Action */}
                      <div className="pt-2 border-t border-neutral-100">
                        {cancellable ? (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-red-50/60 rounded-xl p-3.5 border border-red-100">
                            <div className="text-xs text-neutral-600">
                              <p className="font-bold text-neutral-900">
                                Instant Cancellation Window Open
                              </p>
                              <p className="text-neutral-500 mt-0.5">
                                You can cancel until{" "}
                                <strong className="text-neutral-900">
                                  {formatCancelDeadline(order.canCustomerCancelUntil)}
                                </strong>{" "}
                                for a 100% full instant refund to your original payment method.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setOrderToCancel(order)}
                              className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-full transition-colors active:scale-[0.98] cursor-pointer shrink-0 shadow-2xs"
                            >
                              Cancel Order
                            </button>
                          </div>
                        ) : isCancelled ? null : (
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            <span>
                              Cancellation window closed. Kitchen ingredients have been prepped and scheduled for fresh cooking.
                            </span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>
        )}

      </div>

      {/* ─── Cancellation Confirmation Modal ───────────────────────────── */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-neutral-200 text-left space-y-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                disabled={cancelling}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-secondary text-lg sm:text-xl font-bold text-neutral-900">
                Cancel Order #{orderToCancel.orderNumber}?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Are you sure you want to cancel this order? Since our kitchen has not yet started cooking, an instant 100% full refund of <strong className="text-neutral-900">₹{orderToCancel.totalAmount}</strong> will be initiated directly to your original payment method via Razorpay (credited within 3–5 working days).
              </p>
            </div>

            {/* Email Notification Alert */}
            <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 text-xs text-neutral-600">
              <p className="font-semibold text-neutral-900">
                Email Notifications:
              </p>
              <p className="text-neutral-500 mt-0.5">
                A cancellation confirmation email will be sent immediately to {orderToCancel.customer?.email || user?.email || "your registered email"} and our kitchen admin.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                disabled={cancelling}
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={cancelling}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] cursor-pointer"
              >
                {cancelling ? "Processing Refund..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
