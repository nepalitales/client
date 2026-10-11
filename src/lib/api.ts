/**
 * Nepali Tales - Client API Client
 *
 * Public client API integration for order windows, categories, products, and FAQs.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787/api/client";

/**
 * Fetch wrapper for public client API requests.
 */
async function clientFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("nt_client_token");
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {
      // Storage access blocked
    }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  return fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });
}

// ─── Data Models & Types ──────────────────────────────────────────

export type FoodType = "veg" | "non-veg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  categorySlug: string;
  type: FoodType;
  quantity?: string; // e.g. "6 pcs", "2 pcs"
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryWithProducts {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
  products: Product[];
}

export interface OrderWindowStatusResponse {
  success: boolean;
  isOpen: boolean;
  message: string;
  currentWindow?: { start: string; end: string } | null;
  canCancelUntil?: string | null;
  todayDateStr?: string;
  todayDay?: string;
  activeWindows?: Array<{ start: string; end: string; maxOrders?: number }>;
  nextWindowText?: string;
}

export interface OrderWindowDayConfig {
  day: "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday";
  enabled: boolean;
  windows: Array<{ start: string; end: string; maxOrders?: number }>;
  updatedAt?: string;
}

export interface ClientOrderWindowsResponse {
  success: boolean;
  orderWindows: OrderWindowDayConfig[];
}

export interface ClientFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientAddonsResponse {
  success: boolean;
  addons: Addon[];
}

// ─── 1. Order Window API ──────────────────────────────────────────

export async function getOrderWindowStatus(): Promise<OrderWindowStatusResponse | null> {
  try {
    const res = await clientFetch("/order-window-status", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[OrderWindow API] Error fetching status:", err);
    return null;
  }
}

const ORDER_WINDOWS_CACHE_KEY = "nt_order_windows_cache";
const ORDER_WINDOWS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedOrderWindowsEntry {
  timestamp: number;
  data: ClientOrderWindowsResponse;
}

let cachedOrderWindowsPromise: Promise<ClientOrderWindowsResponse | null> | null = null;

export async function getClientOrderWindows(
  forceRefresh = false
): Promise<ClientOrderWindowsResponse | null> {
  // 1. In-memory promise check (for same-session navigation)
  if (cachedOrderWindowsPromise && !forceRefresh) {
    return cachedOrderWindowsPromise;
  }

  // 2. Client storage check (for page refreshes across tabs/reloads)
  if (!forceRefresh && typeof window !== "undefined") {
    try {
      const raw = sessionStorage.getItem(ORDER_WINDOWS_CACHE_KEY);
      if (raw) {
        const parsed: CachedOrderWindowsEntry = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < ORDER_WINDOWS_CACHE_TTL_MS) {
          cachedOrderWindowsPromise = Promise.resolve(parsed.data);
          return parsed.data;
        }
      }
    } catch {
      // Storage access blocked or unavailable; proceed to network fetch
    }
  }

  // 3. Network fetch
  cachedOrderWindowsPromise = (async () => {
    try {
      const res = await clientFetch("/order-windows", {
        cache: "default",
      });
      if (!res.ok) return null;
      const json: ClientOrderWindowsResponse = await res.json();

      // Cache to sessionStorage if successful
      if (typeof window !== "undefined" && json?.success) {
        try {
          const entry: CachedOrderWindowsEntry = {
            timestamp: Date.now(),
            data: json,
          };
          sessionStorage.setItem(
            ORDER_WINDOWS_CACHE_KEY,
            JSON.stringify(entry)
          );
        } catch {
          // Ignore quota / private-mode exceptions
        }
      }

      return json;
    } catch (err) {
      console.warn("[OrderWindows API] Error fetching windows:", err);
      return null;
    }
  })();

  return cachedOrderWindowsPromise;
}

export interface HolidayItem {
  id?: string;
  date: string; // "YYYY-MM-DD"
  reason?: string;
}

export interface ClientHolidaysResponse {
  success: boolean;
  holidays: HolidayItem[];
}

const HOLIDAYS_CACHE_KEY = "nt_client_holidays_cache";

let cachedHolidaysPromise: Promise<ClientHolidaysResponse | null> | null = null;

export function invalidateClientConfigCache(): void {
  cachedHolidaysPromise = null;
  cachedOrderWindowsPromise = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(HOLIDAYS_CACHE_KEY);
      sessionStorage.removeItem(ORDER_WINDOWS_CACHE_KEY);
    } catch {
      // Storage access blocked or unavailable
    }
  }
}

export async function getClientHolidays(
  forceRefresh = false
): Promise<ClientHolidaysResponse | null> {
  // Purge any legacy sessionStorage cache immediately
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(HOLIDAYS_CACHE_KEY);
    } catch {
      // Storage access blocked or unavailable
    }
  }

  if (cachedHolidaysPromise && !forceRefresh) {
    return cachedHolidaysPromise;
  }

  cachedHolidaysPromise = (async () => {
    try {
      const res = await clientFetch("/holidays", {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json: ClientHolidaysResponse = await res.json();
      return json;
    } catch (err) {
      console.warn("[Holidays API] Error fetching holidays:", err);
      return null;
    }
  })();

  return cachedHolidaysPromise;
}

export interface HolidayBannerDetail {
  text: string;
  isToday: boolean;
  dateFormatted: string;
  reason?: string;
}

export function formatHolidayNotice(
  holidays?: HolidayItem[]
): HolidayBannerDetail | null {
  if (!holidays || holidays.length === 0) return null;

  // Format today's date in IST (Asia/Kolkata)
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayIST = istFormatter.format(now); // "YYYY-MM-DD"

  // Only consider today or future holidays, sorted by date ascending
  const upcoming = holidays
    .filter((h) => h.date >= todayIST)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (upcoming.length === 0) return null;

  const target = upcoming[0];
  const isToday = target.date === todayIST;

  // Format date display (e.g. "OCT 11")
  const [y, m, d] = target.date.split("-").map(Number);
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  const monthStr = dateObj
    .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
    .toUpperCase();
  const dateFormatted = `${monthStr} ${d}`;
  const reasonClean = target.reason ? target.reason.trim().toUpperCase() : "";

  let text = "";
  if (isToday) {
    text = reasonClean
      ? `CLOSED TODAY (${dateFormatted} - ${reasonClean})`
      : `CLOSED TODAY (${dateFormatted})`;
  } else {
    const tomorrowDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowIST = istFormatter.format(tomorrowDate);
    const isTomorrow = target.date === tomorrowIST;

    if (isTomorrow) {
      text = reasonClean
        ? `CLOSED TOMORROW (${dateFormatted} - ${reasonClean})`
        : `CLOSED TOMORROW (${dateFormatted})`;
    } else {
      text = reasonClean
        ? `HOLIDAY ON ${dateFormatted} (${reasonClean})`
        : `HOLIDAY ON ${dateFormatted}`;
    }
  }

  return {
    text,
    isToday,
    dateFormatted,
    reason: target.reason,
  };
}

export function getOrderWindowBannerParts(
  orderWindows: OrderWindowDayConfig[],
  holidays?: HolidayItem[]
): {
  scheduleText: string;
  closedText: string;
  holidayInfo: HolidayBannerDetail | null;
  fullText: string;
} {
  if (!orderWindows || orderWindows.length === 0) {
    return {
      scheduleText: "",
      closedText: "",
      holidayInfo: null,
      fullText: "",
    };
  }

  const dayOrder: (
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday"
  )[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const shortMap: Record<string, string> = {
    monday: "MON",
    tuesday: "TUE",
    wednesday: "WED",
    thursday: "THU",
    friday: "FRI",
    saturday: "SAT",
    sunday: "SUN",
  };

  const pluralMap: Record<string, string> = {
    monday: "MONDAYS",
    tuesday: "TUESDAYS",
    wednesday: "WEDNESDAYS",
    thursday: "THURSDAYS",
    friday: "FRIDAYS",
    saturday: "SATURDAYS",
    sunday: "SUNDAYS",
  };

  const windowMap = new Map(orderWindows.map((w) => [w.day, w]));
  const openDays: string[] = [];
  const closedDays: string[] = [];
  let timeStr = "";

  for (const day of dayOrder) {
    const config = windowMap.get(day);
    if (config && config.enabled && config.windows && config.windows.length > 0) {
      openDays.push(day);
      if (!timeStr) {
        const w = config.windows[0];
        const formatH = (t: string) => {
          const [hStr, mStr] = t.split(":");
          let h = parseInt(hStr, 10);
          const m = parseInt(mStr || "0", 10);
          const ampm = h >= 12 ? "PM" : "AM";
          h = h % 12 || 12;
          return m > 0 ? `${h}:${mStr} ${ampm}` : `${h} ${ampm}`;
        };
        timeStr = `${formatH(w.start)}–${formatH(w.end)}`;
      }
    } else {
      closedDays.push(day);
    }
  }

  if (openDays.length === 0) {
    return {
      scheduleText: "ORDER WINDOW · CURRENTLY CLOSED",
      closedText: "",
      holidayInfo: null,
      fullText: "ORDER WINDOW · CURRENTLY CLOSED",
    };
  }

  let openRange = "";
  if (openDays.length === 7) {
    openRange = "ALL DAYS";
  } else if (openDays.length > 1) {
    openRange = `${shortMap[openDays[0]]}–${shortMap[openDays[openDays.length - 1]]}`;
  } else {
    openRange = shortMap[openDays[0]];
  }

  const scheduleText = ["ORDER WINDOW", openRange, timeStr].filter(Boolean).join(" · ");

  let closedText = "";
  if (closedDays.length > 0) {
    const closedNames = closedDays
      .map((d) => pluralMap[d] || d.toUpperCase())
      .join(" & ");
    closedText = `CLOSED ON ${closedNames}`;
  }

  const holidayInfo = formatHolidayNotice(holidays);

  let fullClosedSegment = "";
  if (closedText) {
    if (holidayInfo) {
      fullClosedSegment = `${closedText} · ${holidayInfo.text}`;
    } else {
      fullClosedSegment = `${closedText} & HOLIDAYS`;
    }
  } else if (holidayInfo) {
    fullClosedSegment = holidayInfo.text;
  }

  const fullText = [scheduleText, fullClosedSegment].filter(Boolean).join(" · ");

  return {
    scheduleText,
    closedText,
    holidayInfo,
    fullText,
  };
}

/**
 * Format order window schedule and holidays into the standardized banner text:
 * ORDER WINDOW · MON–SAT · 10 AM–6 PM · CLOSED ON SUNDAYS & HOLIDAYS
 */
export function formatOrderWindowBannerText(
  orderWindows: OrderWindowDayConfig[],
  holidays?: HolidayItem[]
): string {
  return getOrderWindowBannerParts(orderWindows, holidays).fullText;
}

// ─── 2. Products & Categories API ─────────────────────────────────

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  type?: "veg" | "non-veg" | "all";
  search?: string;
}

export interface PaginatedProductsResponse {
  success: boolean;
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getPaginatedProducts(
  params: GetProductsParams = {}
): Promise<PaginatedProductsResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  if (params.category && params.category !== "all") query.set("category", params.category);
  if (params.type && params.type !== "all") query.set("type", params.type);
  if (params.search && params.search.trim()) query.set("search", params.search.trim());

  const qs = query.toString();
  const endpoint = `/products${qs ? `?${qs}` : ""}`;

  try {
    const res = await clientFetch(endpoint, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("[Products API] Error fetching paginated products:", err);
    return {
      success: false,
      products: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 6,
        total: 0,
        totalPages: 1,
      },
    };
  }
}

export async function getCategoriesWithProducts(): Promise<CategoryWithProducts[]> {
  try {
    const res = await clientFetch("/categories", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.categories || [];
  } catch (err) {
    console.warn("[Menu API] Error fetching categories:", err);
    return [];
  }
}

export async function getProductById(productId: string): Promise<Product | null> {
  try {
    const res = await clientFetch(`/products/${productId}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch (err) {
    console.warn(`[Product API] Error fetching product ${productId}:`, err);
    return null;
  }
}

// ─── 3. FAQs ──────────────────────────────────────────────────────

export const FALLBACK_FAQS: ClientFaq[] = [
  {
    id: "faq_1",
    question: "Where are you located?",
    answer:
      "We operate as an artisanal cloud kitchen from Kasarvadavali, Ghodbunder Road, Thane. Hand-crafted daily, delivered right to your doorstep.",
    category: "General",
    displayOrder: 1,
  },
  {
    id: "faq_2",
    question: "Do you have dine-in facilities?",
    answer:
      "We are currently a delivery-only cloud kitchen focused on bringing you authentic Nepali momo and slow-simmered artisanal chilli oil.",
    category: "General",
    displayOrder: 2,
  },
  {
    id: "faq_3",
    question: "Why do you operate on a pre-order model?",
    answer:
      "Our momo dough is rolled fresh by hand every morning, and our jhol soup simmered for hours. Operating on pre-orders ensures zero food waste, highest quality, and honest craft.",
    category: "Ordering",
    displayOrder: 3,
  },
  {
    id: "faq_4",
    question: "Are your momo spicy?",
    answer:
      "The momo themselves are mildly spiced and flavorful so everyone can enjoy them. Our famous slow-simmered artisanal chilli oil and fiery red chutney are packed separately so you control the heat!",
    category: "Food",
    displayOrder: 4,
  },
];

export async function getClientFaqs(category?: string): Promise<ClientFaq[]> {
  try {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await clientFetch(`/faqs${qs}`);
    if (!res.ok) return FALLBACK_FAQS;
    const data = await res.json();
    return data.faqs && data.faqs.length > 0 ? data.faqs : FALLBACK_FAQS;
  } catch {
    return FALLBACK_FAQS;
  }
}

// ─── 4. Add-ons API ───────────────────────────────────────────────

export async function getClientAddons(): Promise<Addon[]> {
  try {
    const res = await clientFetch("/addons", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data: ClientAddonsResponse = await res.json();
    return data.success && Array.isArray(data.addons) ? data.addons : [];
  } catch (err) {
    console.warn("[Client API] Failed to fetch add-ons:", err);
    return [];
  }
}

// ─── 5. Config Version Polling (Live Catalog Sync) ─────────────────

const CONFIG_POLL_INTERVAL_MS = 60_000; // Poll every 60s

/**
 * Polls the lightweight /config-version endpoint to detect admin changes.
 *
 * Why polling instead of SSE?
 * Cloudflare Workers kill streaming connections after ~30s. Each disconnect
 * counted as an "Error" in Cloudflare metrics and opened a new MongoDB
 * connection. With 100 users that's ~12,000 errors/hour.
 *
 * This approach:
 * - Polls every 60s (edge-cached at Cloudflare, so most polls are free)
 * - Pauses when the browser tab is hidden (saves bandwidth)
 * - Immediately checks on tab focus (instant UX when user returns)
 * - Zero Cloudflare errors, minimal DB load
 */
export function subscribeToLiveCatalogUpdates(
  onUpdate: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  let knownVersion = "0";
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let isClosed = false;

  const poll = async () => {
    try {
      const res = await fetch(`${API_BASE}/config-version`, {
        cache: "no-cache",
      });
      if (!res.ok) return;
      const data = await res.json();
      const serverVersion = data?.version ?? "0";

      if (knownVersion === "0") {
        // First poll — just record the baseline, don't trigger update
        knownVersion = serverVersion;
        return;
      }

      if (serverVersion !== knownVersion) {
        knownVersion = serverVersion;
        invalidateClientConfigCache();
        onUpdate();
      }
    } catch {
      // Network error — skip silently, will retry next interval
    }
  };

  const startPolling = () => {
    if (intervalId || isClosed) return;
    intervalId = setInterval(poll, CONFIG_POLL_INTERVAL_MS);
  };

  const stopPolling = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  // Pause polling when tab is hidden, resume + immediate check on focus
  const handleVisibility = () => {
    if (document.hidden) {
      stopPolling();
    } else {
      poll(); // Immediate check when user returns to tab
      startPolling();
    }
  };

  document.addEventListener("visibilitychange", handleVisibility);

  // Initial poll + start interval
  poll();
  startPolling();

  return () => {
    isClosed = true;
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}

// ─── 6. Dispatch Slots API ────────────────────────────────────────

export interface AvailableSlotItem {
  id: string;
  start: string;
  end: string;
  label: string;
  maxCapacity: number;
  availableCapacity: number;
  confirmedCount?: number;
  heldCount?: number;
  isFull: boolean;
  isActive: boolean;
}

export interface DispatchAvailabilityResponse {
  success: boolean;
  isOpen: boolean;
  message: string;
  targetDate: string;
  targetDay: string;
  displayDate: string;
  isHoliday?: boolean;
  holidayReason?: string;
  isWeeklyOff?: boolean;
  slots: AvailableSlotItem[];
}

export const FALLBACK_DISPATCH_SLOTS: AvailableSlotItem[] = [
  {
    id: "slot_1300_1430",
    start: "13:00",
    end: "14:30",
    label: "01:00 PM - 02:30 PM (Lunch Window)",
    maxCapacity: 40,
    availableCapacity: 28,
    isFull: false,
    isActive: true,
  },
  {
    id: "slot_1800_1930",
    start: "18:00",
    end: "19:30",
    label: "06:00 PM - 07:30 PM (Early Evening Window)",
    maxCapacity: 40,
    availableCapacity: 19,
    isFull: false,
    isActive: true,
  },
  {
    id: "slot_1930_2100",
    start: "19:30",
    end: "21:00",
    label: "07:30 PM - 09:00 PM (Dinner Window)",
    maxCapacity: 40,
    availableCapacity: 12,
    isFull: false,
    isActive: true,
  },
];

export async function getDispatchSlots(
  date?: string
): Promise<DispatchAvailabilityResponse | null> {
  try {
    const qs = date ? `?date=${encodeURIComponent(date)}` : "";
    const res = await clientFetch(`/dispatch-slots${qs}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: DispatchAvailabilityResponse = await res.json();
    return json;
  } catch (err) {
    console.warn("[DispatchSlots API] Error fetching slots:", err);
    return null;
  }
}

// ─── 6b. Order Settings API (Pickup vs Delivery) ──────────────────

export interface ClientOrderSettings {
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  deliveryFee: number;
  pickupInstructions: string;
}

export const DEFAULT_CLIENT_ORDER_SETTINGS: ClientOrderSettings = {
  pickupEnabled: true,
  deliveryEnabled: true,
  deliveryFee: 0,
  pickupInstructions:
    "Collect your order from the kitchen at Metropolis Riveria, Kasarvadavali, Ghodbunder Road, Thane.",
};

export async function getClientOrderSettings(): Promise<ClientOrderSettings> {
  try {
    const res = await clientFetch("/order-settings", { cache: "no-store" });
    if (!res.ok) return DEFAULT_CLIENT_ORDER_SETTINGS;
    const json = await res.json();
    return json?.settings || DEFAULT_CLIENT_ORDER_SETTINGS;
  } catch (err) {
    console.warn("[OrderSettings API] Error fetching settings:", err);
    return DEFAULT_CLIENT_ORDER_SETTINGS;
  }
}

// ─── 7. Customer Auth API ─────────────────────────────────────────

export interface ClientUser {
  id: string;
  email?: string;
  phone?: string;
  username?: string;
  isVerified?: boolean;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  email?: string;
  channel?: string;
  isExistingUser?: boolean;
  devOtp?: string;
  retryAfter?: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: ClientUser;
}

export async function sendClientOtp(
  email: string
): Promise<SendOtpResponse> {
  try {
    const res = await clientFetch("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error sending verification code",
    };
  }
}

export async function verifyClientOtp(
  email: string,
  otp: string,
  username?: string
): Promise<VerifyOtpResponse> {
  try {
    const res = await clientFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        username: username?.trim() || undefined,
      }),
    });
    const data = await res.json();
    if (data.success && data.token && typeof window !== "undefined") {
      try {
        localStorage.setItem("nt_client_token", data.token);
        if (data.user) {
          localStorage.setItem("nt_client_user", JSON.stringify(data.user));
        }
      } catch {
        // Ignore quota
      }
    }
    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error verifying code",
    };
  }
}

export async function getClientMe(): Promise<ClientUser | null> {
  try {
    const res = await clientFetch("/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function clientSignOut(): Promise<void> {
  try {
    await clientFetch("/auth/signout", { method: "POST" });
  } catch {
    // ignore
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nt_client_token");
      localStorage.removeItem("nt_client_user");
    }
  }
}

// ─── 8. Customer Addresses API ────────────────────────────────────

export interface ClientAddress {
  id?: string;
  label?: string;
  street: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  city?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  isDefault?: boolean;
}

export async function getClientAddresses(): Promise<ClientAddress[]> {
  try {
    const res = await clientFetch("/addresses");
    if (!res.ok) return [];
    const data = await res.json();
    return data.addresses || [];
  } catch {
    return [];
  }
}

export async function saveClientAddress(
  address: ClientAddress
): Promise<ClientAddress | null> {
  try {
    const res = await clientFetch("/addresses", {
      method: "POST",
      body: JSON.stringify(address),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.address || null;
  } catch {
    return null;
  }
}

// ─── 9. Customer Orders API ───────────────────────────────────────

export interface CreateOrderPayload {
  orderType: "delivery" | "pickup";
  addressId?: string;
  address?: ClientAddress;
  dispatchSlotId: string;
  dispatchDate?: string;
  items: Array<{
    productId: string;
    quantity: number;
    addons?: Array<{ addonId: string; quantity: number }>;
  }>;
  addons?: Array<{ addonId: string; quantity: number }>;
  notes?: string;
  contactEmail?: string;
  contactPhone?: string;
  customerName?: string;
}

export interface OrderPlacedResult {
  success: boolean;
  message?: string;
  order?: {
    id: string;
    orderNumber?: string;
    orderType: "delivery" | "pickup";
    totalAmount: number;
    subtotal: number;
    deliveryFee: number;
    status: string;
    paymentStatus: string;
    dispatchDate: string;
    dispatchSlotLabel: string;
    customerName?: string;
    contactPhone?: string;
    contactEmail?: string;
    items: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      addons?: Array<{ addonId: string; name: string; price: number; quantity: number }>;
    }>;
    deliveryAddress?: ClientAddress;
    createdAt?: string;
  };
  razorpay?: {
    orderId: string;
    keyId: string;
    amount: number;
    currency: string;
    notes?: Record<string, string>;
  };
}

export async function createClientOrder(
  payload: CreateOrderPayload
): Promise<OrderPlacedResult> {
  try {
    const res = await clientFetch("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      message: "Network error submitting order",
    };
  }
}
