"use client";

import React from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CartProvider } from "@/context/CartContext";
import { CheckoutProvider } from "@/context/CheckoutContext";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

import { HealthAdvisoryModal } from "@/components/ui/HealthAdvisoryModal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <CartProvider>
        <CheckoutProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <CartDrawer />
          <CheckoutModal />
          <HealthAdvisoryModal />
        </CheckoutProvider>
      </CartProvider>
    </SmoothScrollProvider>
  );
}
