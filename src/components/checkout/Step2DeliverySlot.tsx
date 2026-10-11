"use client";

import React, { useState, useEffect } from "react";
import { useCheckout } from "@/context/CheckoutContext";
import {
  getDispatchSlots,
  FALLBACK_DISPATCH_SLOTS,
  type AvailableSlotItem,
  type DispatchAvailabilityResponse,
} from "@/lib/api";
import { Loader2, Check } from "lucide-react";

export function Step2DeliverySlot() {
  const {
    orderType,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    nextStep,
  } = useCheckout();

  const [isLoading, setIsLoading] = useState(true);
  const [slotData, setSlotData] = useState<DispatchAvailabilityResponse | null>(null);
  const [slotsList, setSlotsList] = useState<AvailableSlotItem[]>(FALLBACK_DISPATCH_SLOTS);
  const [displayDateStr, setDisplayDateStr] = useState<string>("Tomorrow");

  useEffect(() => {
    let isMounted = true;
    async function loadSlots() {
      setIsLoading(true);
      try {
        const res = await getDispatchSlots();
        if (!isMounted) return;

        if (res && res.success && res.slots && res.slots.length > 0) {
          setSlotData(res);
          setSlotsList(res.slots);
          if (res.targetDate) setSelectedDate(res.targetDate);
          if (res.displayDate) setDisplayDateStr(res.displayDate);

          if (!selectedSlot) {
            const firstAvailable = res.slots.find((s) => !s.isFull && s.isActive);
            if (firstAvailable) {
              setSelectedSlot(firstAvailable);
            }
          }
        } else {
          setSlotsList(FALLBACK_DISPATCH_SLOTS);
          if (!selectedSlot && FALLBACK_DISPATCH_SLOTS.length > 0) {
            setSelectedSlot(FALLBACK_DISPATCH_SLOTS[0]);
          }
        }
      } catch (err) {
        console.warn("[DeliverySlot] Error loading slots:", err);
        setSlotsList(FALLBACK_DISPATCH_SLOTS);
        if (!selectedSlot && FALLBACK_DISPATCH_SLOTS.length > 0) {
          setSelectedSlot(FALLBACK_DISPATCH_SLOTS[0]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [setSelectedDate, setSelectedSlot, selectedSlot]);

  const handleSlotSelect = (slot: AvailableSlotItem) => {
    if (slot.isFull) return;
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (!selectedSlot && slotsList.length > 0) {
      setSelectedSlot(slotsList[0]);
    }
    nextStep();
  };

  return (
    <div className="flex flex-col min-h-95 justify-between pt-2 pb-2 font-secondary">
      {/* ─── Top Instructions & Date ───────────────────────────── */}
      <div className="space-y-4 pt-1">
        <div className="space-y-1.5 text-left">
          <h4 className="font-secondary font-bold text-lg sm:text-xl text-neutral-900">
            {orderType === "delivery" ? "Select delivery window" : "Select pickup window"}
          </h4>
          <p className="text-xs text-neutral-500">
            Pre-order for <strong className="text-neutral-900">{displayDateStr}</strong>
          </p>
        </div>

        {/* ─── Time Slots List ──────────────────────────────────── */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-neutral-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#D92121]" />
            <span className="text-xs font-medium">Checking available slots...</span>
          </div>
        ) : (
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="space-y-2.5 max-h-[300px] sm:max-h-[340px] overflow-y-auto pr-1.5 custom-scrollbar overscroll-contain touch-pan-y"
          >
            {slotsList.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isFull = slot.isFull || slot.availableCapacity <= 0;

              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isFull}
                  onClick={() => handleSlotSelect(slot)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isFull
                      ? "opacity-45 cursor-not-allowed border-neutral-200 bg-neutral-50"
                      : isSelected
                      ? "border-[#D92121] bg-red-50/50 shadow-xs ring-1 ring-[#D92121]"
                      : "border-neutral-200 hover:border-neutral-300 bg-white"
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-secondary font-bold text-xs sm:text-sm text-neutral-900">
                      {slot.label}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {isFull
                        ? "Window at full capacity"
                        : `${slot.availableCapacity ?? 20} slots remaining`}
                    </p>
                  </div>

                  {/* Radio / Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-3 ${
                      isSelected
                        ? "border-[#D92121] bg-[#D92121] text-white"
                        : "border-neutral-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Bottom Continue Action Button ─────────────────────── */}
      <div className="pt-6 w-full">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedSlot}
          className={`w-full font-secondary font-bold py-3.5 px-6 rounded-full text-sm sm:text-base tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 select-none ${
            selectedSlot
              ? "bg-[#D92121] hover:bg-[#b81b1b] text-white cursor-pointer active:scale-[0.98]"
              : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
