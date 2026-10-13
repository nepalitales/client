"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type {
  AvailableSlotItem,
  ClientUser,
  ClientAddress,
  ClientOrderSettings,
} from "@/lib/api";
import {
  getClientOrderSettings,
  DEFAULT_CLIENT_ORDER_SETTINGS,
  getClientMe,
  clientSignOut,
  getClientAddresses,
  saveClientAddress,
} from "@/lib/api";

export type CheckoutStep =
  | "ORDER_TYPE"
  | "DELIVERY_SLOT"
  | "AUTH_LOGIN"
  | "USER_DETAILS"
  | "PAYMENT"
  | "ORDER_SUCCESS";

export type OrderType = "delivery" | "pickup";

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface ConfirmedOrderData {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  status: string;
  paymentStatus: string;
  dispatchDate: string;
  dispatchSlotLabel: string;
  customerName: string;
  contactPhone: string;
  contactEmail: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    addons?: Array<{ addonId: string; name: string; price: number; quantity: number }>;
  }>;
  addons?: Array<{ addonId: string; name: string; price: number; quantity: number }>;
  deliveryAddress?: ClientAddress;
  createdAt?: string;
}

interface CheckoutContextType {
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  openAuthModal: () => void;
  closeCheckout: () => void;
  signOut: () => Promise<void>;
  isAuthStandalone: boolean;
  currentStep: CheckoutStep;
  goToStep: (step: CheckoutStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  orderSettings: ClientOrderSettings;
  refreshOrderSettings: () => Promise<void>;

  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedSlot: AvailableSlotItem | null;
  setSelectedSlot: (slot: AvailableSlotItem | null) => void;

  user: ClientUser | null;
  setUser: (user: ClientUser | null) => void;
  isLoggedIn: boolean;

  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;

  address: ClientAddress;
  setAddress: React.Dispatch<React.SetStateAction<ClientAddress>>;
  savedAddresses: ClientAddress[];
  setSavedAddresses: React.Dispatch<React.SetStateAction<ClientAddress[]>>;
  refreshUserAndAddresses: () => Promise<void>;
  saveAddressToServer: (addr: ClientAddress) => Promise<ClientAddress | null>;

  deliveryFee: number;

  confirmedOrder: ConfirmedOrderData | null;
  setConfirmedOrder: (order: ConfirmedOrderData | null) => void;

  resetCheckout: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const USER_STORAGE_KEY = "nt_client_user";
const TOKEN_STORAGE_KEY = "nt_client_token";
const LAST_ADDRESS_STORAGE_KEY = "nt_last_checkout_address";

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthStandalone, setIsAuthStandalone] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("ORDER_TYPE");
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [orderSettings, setOrderSettings] =
    useState<ClientOrderSettings>(DEFAULT_CLIENT_ORDER_SETTINGS);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlotItem | null>(null);

  const [user, setUser] = useState<ClientUser | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ClientAddress[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [address, setAddress] = useState<ClientAddress>({
    label: "Home",
    flatNumber: "",
    wing: "",
    addressLine1: "",
    addressLine2: "",
    street: "",
    building: "",
    floor: "",
    apartment: "",
    landmark: "",
    city: "Mumbai",
    pincode: "",
  });

  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderData | null>(null);

  // 1. Fetch live server order settings (pickupEnabled, deliveryEnabled, deliveryFee, pickupInstructions)
  const refreshOrderSettings = useCallback(async () => {
    try {
      const s = await getClientOrderSettings();
      if (s) {
        setOrderSettings(s);
        if (!s.deliveryEnabled && s.pickupEnabled) {
          setOrderType("pickup");
        } else if (s.deliveryEnabled && !s.pickupEnabled) {
          setOrderType("delivery");
        }
      }
    } catch (err) {
      console.warn("[Checkout] Error loading order settings:", err);
    }
  }, []);

  useEffect(() => {
    refreshOrderSettings();
  }, [refreshOrderSettings]);

  // Fetch full user profile & all saved addresses from database
  const refreshUserAndAddresses = useCallback(async () => {
    // Skip network calls if customer is not logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!token) return;
    }

    try {
      const liveUser = await getClientMe();
      if (liveUser) {
        setUser(liveUser);
        setContactInfo((prev) => ({
          ...prev,
          name: prev.name?.trim() ? prev.name : (liveUser.username || ""),
          phone: prev.phone?.trim() ? prev.phone : (liveUser.phone || ""),
          email: prev.email?.trim() ? prev.email : (liveUser.email || ""),
        }));
        try {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(liveUser));
        } catch {}

        // Fetch addresses from server DB
        const serverAddresses = await getClientAddresses();
        if (serverAddresses && serverAddresses.length > 0) {
          setSavedAddresses(serverAddresses);
          const defaultAddr = serverAddresses.find((a) => a.isDefault) || serverAddresses[0];
          setAddress(defaultAddr);
          try {
            localStorage.setItem(LAST_ADDRESS_STORAGE_KEY, JSON.stringify(defaultAddr));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("[Checkout] Error loading live user & addresses:", err);
    }
  }, []);

  // Save address directly to MongoDB server collection
  const saveAddressToServer = useCallback(async (addrToSave: ClientAddress) => {
    try {
      const preparedAddr: ClientAddress = {
        ...addrToSave,
        street: addrToSave.addressLine2 || addrToSave.addressLine1 || addrToSave.street || "",
        building: addrToSave.addressLine1 || addrToSave.building || "",
        apartment: addrToSave.flatNumber || addrToSave.apartment || "",
      };
      const saved = await saveClientAddress(preparedAddr);
      if (saved) {
        setAddress(saved);
        setSavedAddresses((prev) => {
          const filtered = prev.filter((a) => a.id !== saved.id);
          return [saved, ...filtered];
        });
        try {
          localStorage.setItem(LAST_ADDRESS_STORAGE_KEY, JSON.stringify(saved));
        } catch {}
        return saved;
      }
      return null;
    } catch (err) {
      console.warn("[Checkout] Error saving address to server:", err);
      return null;
    }
  }, []);

  // 2. Hydrate user from localStorage on mount & verify session via cookies / token
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === "object") {
          setUser(parsed);
          setContactInfo((prev) => ({
            ...prev,
            name: prev.name?.trim() ? prev.name : (parsed.username || ""),
            phone: prev.phone?.trim() ? prev.phone : (parsed.phone || ""),
            email: prev.email?.trim() ? prev.email : (parsed.email || ""),
          }));
        }
      }

      const storedAddr = localStorage.getItem(LAST_ADDRESS_STORAGE_KEY);
      if (storedAddr) {
        const parsedAddr = JSON.parse(storedAddr);
        if (parsedAddr && typeof parsedAddr === "object") {
          setAddress(parsedAddr);
        }
      }
    } catch {
      // Storage access blocked or invalid
    }

    refreshUserAndAddresses();
  }, [refreshUserAndAddresses]);

  const isLoggedIn = useMemo(() => {
    if (!user) return false;
    return Boolean(user.id || user.isVerified || user.phone || user.email);
  }, [user]);

  // Delivery fee is dynamic from order settings for delivery, 0 for pickup
  const deliveryFee = useMemo(() => {
    return orderType === "delivery" ? (orderSettings.deliveryFee ?? 0) : 0;
  }, [orderType, orderSettings.deliveryFee]);

  const openCheckout = useCallback(() => {
    setIsAuthStandalone(false);
    setCurrentStep("ORDER_TYPE");
    setIsCheckoutOpen(true);
  }, []);

  const openAuthModal = useCallback(() => {
    setIsAuthStandalone(true);
    setCurrentStep("AUTH_LOGIN");
    setIsCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
    setIsAuthStandalone(false);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await clientSignOut();
    } finally {
      setUser(null);
      setSavedAddresses([]);
      setContactInfo({
        name: "",
        phone: "",
        email: "",
        notes: "",
      });
      setAddress({
        label: "Home",
        flatNumber: "",
        wing: "",
        addressLine1: "",
        addressLine2: "",
        street: "",
        building: "",
        floor: "",
        apartment: "",
        landmark: "",
        city: "Mumbai",
        pincode: "",
      });
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(USER_STORAGE_KEY);
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          localStorage.removeItem(LAST_ADDRESS_STORAGE_KEY);
        } catch {}
      }
    }
  }, []);

  const goToStep = useCallback((step: CheckoutStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      switch (prev) {
        case "ORDER_TYPE":
          return "DELIVERY_SLOT";

        case "DELIVERY_SLOT":
          // If customer is already logged in, skip the auth popup directly to address/user details
          if (isLoggedIn) {
            return "USER_DETAILS";
          }
          return "AUTH_LOGIN";

        case "AUTH_LOGIN":
          if (isAuthStandalone) {
            setIsCheckoutOpen(false);
            setIsAuthStandalone(false);
            return "ORDER_TYPE";
          }
          return "USER_DETAILS";

        case "USER_DETAILS":
          return "PAYMENT";

        case "PAYMENT":
          return "ORDER_SUCCESS";

        case "ORDER_SUCCESS":
          return "ORDER_SUCCESS";

        default:
          return "ORDER_TYPE";
      }
    });
  }, [isLoggedIn, isAuthStandalone]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => {
      switch (prev) {
        case "ORDER_TYPE":
          return "ORDER_TYPE";

        case "DELIVERY_SLOT":
          return "ORDER_TYPE";

        case "AUTH_LOGIN":
          if (isAuthStandalone) {
            setIsCheckoutOpen(false);
            setIsAuthStandalone(false);
            return "ORDER_TYPE";
          }
          return "DELIVERY_SLOT";

        case "USER_DETAILS":
          // If user was logged in before, back goes to slot selection
          return isLoggedIn ? "DELIVERY_SLOT" : "AUTH_LOGIN";

        case "PAYMENT":
          return "USER_DETAILS";

        case "ORDER_SUCCESS":
          return "ORDER_SUCCESS";

        default:
          return "ORDER_TYPE";
      }
    });
  }, [isLoggedIn, isAuthStandalone]);

  const resetCheckout = useCallback(() => {
    setCurrentStep("ORDER_TYPE");
    setConfirmedOrder(null);
    setSelectedSlot(null);
    setSelectedDate("");
    setIsCheckoutOpen(false);
    setIsAuthStandalone(false);
  }, []);

  // Save address whenever it changes and user is on address step
  useEffect(() => {
    if (address.street || address.building) {
      try {
        localStorage.setItem(LAST_ADDRESS_STORAGE_KEY, JSON.stringify(address));
      } catch {
        // ignore
      }
    }
  }, [address]);

  return (
    <CheckoutContext.Provider
      value={{
        isCheckoutOpen,
        openCheckout,
        openAuthModal,
        closeCheckout,
        signOut,
        isAuthStandalone,
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        orderType,
        setOrderType,
        orderSettings,
        refreshOrderSettings,
        selectedDate,
        setSelectedDate,
        selectedSlot,
        setSelectedSlot,
        user,
        setUser,
        isLoggedIn,
        contactInfo,
        setContactInfo,
        address,
        setAddress,
        savedAddresses,
        setSavedAddresses,
        refreshUserAndAddresses,
        saveAddressToServer,
        deliveryFee,
        confirmedOrder,
        setConfirmedOrder,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
