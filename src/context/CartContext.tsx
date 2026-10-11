"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  getOrderWindowStatus,
  getClientAddons,
  subscribeToLiveCatalogUpdates,
  type Product,
  type Addon,
  type OrderWindowStatusResponse,
} from "@/lib/api";
import { showDishLimitToast } from "@/components/ui/sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartAddonItem {
  addon: Addon;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addons: CartAddonItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  addAddon: (addon: Addon, quantity?: number) => void;
  updateAddonQuantity: (addonId: string, quantity: number) => void;
  removeAddon: (addonId: string) => void;
  getAddonQuantity: (addonId: string) => number;
  availableAddons: Addon[];
  isAddonsLoading: boolean;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalDishesCount: number;
  totalItems: number;
  itemsSubtotal: number;
  addonsSubtotal: number;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  orderWindowStatus: OrderWindowStatusResponse | null;
  refreshOrderWindowStatus: () => Promise<void>;
  maxDishesLimit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nt_cart_items_v1";
// Delivery charges are paid directly by the user upon delivery via Borzo/Porter
const FLAT_DELIVERY_FEE = 0;
const MAX_DISHES_PER_ORDER = 15; // Server MAX_DISHES_PER_ORDER limit

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [addons, setAddons] = useState<CartAddonItem[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);
  const [isAddonsLoading, setIsAddonsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderWindowStatus, setOrderWindowStatus] =
    useState<OrderWindowStatusResponse | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  // 1. Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Legacy format: array of CartItem
          setItems(parsed);
        } else if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.items)) setItems(parsed.items);
          if (Array.isArray(parsed.addons)) setAddons(parsed.addons);
        }
      }
    } catch {
      // Ignore storage errors
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever items or addons change
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({ items, addons })
      );
    } catch {
      // Ignore quota errors
    }
  }, [items, addons, hasHydrated]);

  // 3. Fetch live server order window status
  const fetchStatus = useCallback(async () => {
    try {
      const status = await getOrderWindowStatus();
      if (status) {
        setOrderWindowStatus(status);
      }
    } catch (err) {
      console.warn("[Cart] Could not fetch order window status:", err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 4. Fetch available add-ons from server API
  const fetchAddons = useCallback(async () => {
    try {
      setIsAddonsLoading(true);
      const list = await getClientAddons();
      setAvailableAddons(list);
    } catch (err) {
      console.warn("[Cart] Could not fetch add-ons:", err);
    } finally {
      setIsAddonsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddons();
  }, [fetchAddons]);

  // 5. Real-time synchronization via Server-Sent Events & tab focus
  useEffect(() => {
    const unsubscribe = subscribeToLiveCatalogUpdates(() => {
      fetchStatus();
      fetchAddons();
    });

    const handleFocus = () => {
      fetchStatus();
      fetchAddons();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchStatus, fetchAddons]);

  // Add Item to Cart (Dishes)
  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const currentTotal = prev.reduce((sum, item) => sum + item.quantity, 0);
      if (currentTotal + quantity > MAX_DISHES_PER_ORDER) {
        showDishLimitToast(MAX_DISHES_PER_ORDER);
        return prev;
      }

      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [...prev, { product, quantity }];
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.product.id !== productId);
      }

      const otherItemsCount = prev
        .filter((item) => item.product.id !== productId)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (otherItemsCount + quantity > MAX_DISHES_PER_ORDER) {
        showDishLimitToast(MAX_DISHES_PER_ORDER);
        return prev;
      }

      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  // Remove Item completely
  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  // ─── Add-on Handlers ──────────────────────────────────────────────

  const addAddon = useCallback((addon: Addon, quantity = 1) => {
    setAddons((prev) => {
      const existingIndex = prev.findIndex((i) => i.addon.id === addon.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { addon, quantity }];
    });
  }, []);

  const updateAddonQuantity = useCallback(
    (addonId: string, quantity: number) => {
      setAddons((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => i.addon.id !== addonId);
        }
        return prev.map((i) =>
          i.addon.id === addonId ? { ...i, quantity } : i
        );
      });
    },
    []
  );

  const removeAddon = useCallback((addonId: string) => {
    setAddons((prev) => prev.filter((i) => i.addon.id !== addonId));
  }, []);

  const getAddonQuantity = useCallback(
    (addonId: string) => {
      const found = addons.find((i) => i.addon.id === addonId);
      return found ? found.quantity : 0;
    },
    [addons]
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    setItems([]);
    setAddons([]);
  }, []);

  // Get single product quantity in cart
  const getItemQuantity = useCallback(
    (productId: string) => {
      const found = items.find((item) => item.product.id === productId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const openCart = useCallback(() => {
    setIsCartOpen(true);
    fetchStatus();
    fetchAddons();
  }, [fetchStatus, fetchAddons]);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  // ─── Computed summary ─────────────────────────────────────────────

  const totalDishesCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalAddonsCount = useMemo(
    () => addons.reduce((sum, item) => sum + item.quantity, 0),
    [addons]
  );

  const totalItems = totalDishesCount + totalAddonsCount;

  const itemsSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.product.price || 0) * item.quantity,
        0
      ),
    [items]
  );

  const addonsSubtotal = useMemo(
    () =>
      addons.reduce(
        (sum, item) => sum + (item.addon.price || 0) * item.quantity,
        0
      ),
    [addons]
  );

  const subtotal = itemsSubtotal + addonsSubtotal;
  const deliveryFee = totalItems > 0 ? FLAT_DELIVERY_FEE : 0;
  const totalAmount = subtotal + deliveryFee;

  const value = useMemo(
    () => ({
      items,
      addons,
      addItem,
      updateQuantity,
      removeItem,
      addAddon,
      updateAddonQuantity,
      removeAddon,
      getAddonQuantity,
      availableAddons,
      isAddonsLoading,
      clearCart,
      getItemQuantity,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      totalDishesCount,
      totalItems,
      itemsSubtotal,
      addonsSubtotal,
      subtotal,
      deliveryFee,
      totalAmount,
      orderWindowStatus,
      refreshOrderWindowStatus: fetchStatus,
      maxDishesLimit: MAX_DISHES_PER_ORDER,
    }),
    [
      items,
      addons,
      addItem,
      updateQuantity,
      removeItem,
      addAddon,
      updateAddonQuantity,
      removeAddon,
      getAddonQuantity,
      availableAddons,
      isAddonsLoading,
      clearCart,
      getItemQuantity,
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      totalDishesCount,
      totalItems,
      itemsSubtotal,
      addonsSubtotal,
      subtotal,
      deliveryFee,
      totalAmount,
      orderWindowStatus,
      fetchStatus,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
