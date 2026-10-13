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
let cachedCategoriesPromise: Promise<CategoryWithProducts[]> | null = null;
let categoriesCacheTimestamp = 0;
const CATEGORIES_CACHE_TTL_MS = 60_000; // 60s in-memory freshness

export function invalidateClientConfigCache(): void {
  cachedHolidaysPromise = null;
  cachedOrderWindowsPromise = null;
  cachedCategoriesPromise = null;
  categoriesCacheTimestamp = 0;
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
        ? `ORDERING CLOSED TODAY · KITCHEN CLOSED TOMORROW (${dateFormatted} - ${reasonClean})`
        : `ORDERING CLOSED TODAY · KITCHEN CLOSED TOMORROW (${dateFormatted})`;
    } else {
      const holidayEveDate = new Date(dateObj.getTime() - 24 * 60 * 60 * 1000);
      const eveMonthStr = holidayEveDate
        .toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })
        .toUpperCase();
      const eveFormatted = `${eveMonthStr} ${holidayEveDate.getUTCDate()}`;

      text = reasonClean
        ? `HOLIDAY ON ${dateFormatted} (${reasonClean}) · NO ORDERS ON ${eveFormatted}`
        : `HOLIDAY ON ${dateFormatted} · NO ORDERS ON ${eveFormatted}`;
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
  holidays?: HolidayItem[],
  weeklyOff?: string[]
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

  const prevDayMap: Record<string, string> = {
    monday: "sunday",
    tuesday: "monday",
    wednesday: "tuesday",
    thursday: "wednesday",
    friday: "thursday",
    saturday: "friday",
    sunday: "saturday",
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

  // Identify days that are the eve (day before) a recurring weekly off day
  const eveOfWeeklyOffDays = (weeklyOff || [])
    .map((off) => prevDayMap[off.toLowerCase()] || "")
    .filter(Boolean);

  // Filter out closed days that are already explained by weekly off (e.g. Sunday before Monday)
  const independentClosedDays = closedDays.filter(
    (d) => !eveOfWeeklyOffDays.includes(d.toLowerCase())
  );

  let closedText = "";
  if (independentClosedDays.length > 0) {
    const closedNames = independentClosedDays
      .map((d) => pluralMap[d] || d.toUpperCase())
      .join(" & ");
    closedText = `ORDERING CLOSED ON ${closedNames}`;
  }

  // Check if today in IST is the eve (day before) a weekly off day
  const istWeekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  }).format(new Date()).toLowerCase();

  const isTodayEveOfWeeklyOff = weeklyOff ? weeklyOff.some(
    (off) => prevDayMap[off.toLowerCase()] === istWeekday
  ) : false;

  // Kitchen dispatch closure notice for recurring weekly off days
  let dispatchOffText = "";
  if (isTodayEveOfWeeklyOff && weeklyOff && weeklyOff.length > 0) {
    const matchingOffDays = weeklyOff
      .filter((off) => prevDayMap[off.toLowerCase()] === istWeekday)
      .map((d) => d.toUpperCase())
      .join(" & ");
    dispatchOffText = `ORDERING CLOSED TODAY · KITCHEN CLOSED TOMORROW (${matchingOffDays})`;
  } else if (weeklyOff && weeklyOff.length > 0) {
    const offNames = weeklyOff
      .map((d) => pluralMap[d.toLowerCase()] || d.toUpperCase())
      .join(" & ");
    const prevNames = weeklyOff
      .map((d) => pluralMap[prevDayMap[d.toLowerCase()] || ""] || "")
      .filter(Boolean)
      .join(" & ");
    dispatchOffText = `KITCHEN CLOSED ON ${offNames} (ORDERING CLOSED ON ${prevNames})`;
  }

  const holidayInfo = formatHolidayNotice(holidays);

  let fullClosedSegment = "";
  const closureParts = [closedText, dispatchOffText].filter(Boolean);
  if (closureParts.length > 0) {
    const combinedClosures = closureParts.join(" · ");
    if (holidayInfo) {
      fullClosedSegment = `${combinedClosures} · ${holidayInfo.text}`;
    } else {
      fullClosedSegment = `${combinedClosures} & HOLIDAYS`;
    }
  } else if (holidayInfo) {
    fullClosedSegment = holidayInfo.text;
  }

  const fullText = [scheduleText, fullClosedSegment].filter(Boolean).join(" · ");

  return {
    scheduleText,
    closedText: closedText || dispatchOffText,
    holidayInfo,
    fullText,
  };
}

/**
 * Format order window schedule, weekly off, and holidays into the standardized banner text:
 * ORDER WINDOW · ALL DAYS · 10 AM–9 PM · KITCHEN COOKING CLOSED ON MONDAYS · PRE-ORDERS ACCEPTED FOR NEXT DAY
 */
export function formatOrderWindowBannerText(
  orderWindows: OrderWindowDayConfig[],
  holidays?: HolidayItem[],
  weeklyOff?: string[]
): string {
  return getOrderWindowBannerParts(orderWindows, holidays, weeklyOff).fullText;
}

export async function getClientWeeklyOff(): Promise<{ success: boolean; weeklyOff: string[] } | null> {
  try {
    const res = await clientFetch("/weekly-off");
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("[WeeklyOff API] Error fetching weekly off:", err);
    return null;
  }
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

export async function getCategoriesWithProducts(
  forceRefresh = false
): Promise<CategoryWithProducts[]> {
  const now = Date.now();
  if (
    !forceRefresh &&
    cachedCategoriesPromise &&
    now - categoriesCacheTimestamp < CATEGORIES_CACHE_TTL_MS
  ) {
    return cachedCategoriesPromise;
  }

  cachedCategoriesPromise = (async () => {
    try {
      const res = await clientFetch("/categories");
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      categoriesCacheTimestamp = Date.now();
      return data.categories || [];
    } catch (err) {
      console.warn("[Menu API] Error fetching categories:", err);
      cachedCategoriesPromise = null;
      return [];
    }
  })();

  return cachedCategoriesPromise;
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

// ─── 5. Config Version Polling (Live Catalog Sync - Singleton) ────

const CONFIG_POLL_INTERVAL_MS = 60_000; // Poll every 60s

let globalKnownVersion = "0";
let globalIntervalId: ReturnType<typeof setInterval> | null = null;
let globalVisibilityBound = false;
let globalInFlight = false;
const catalogListeners = new Set<() => void>();

async function pollConfigVersion() {
  if (globalInFlight) return;
  globalInFlight = true;

  try {
    const res = await fetch(`${API_BASE}/config-version`);
    if (!res.ok) return;
    const data = await res.json();
    const serverVersion = data?.version ?? "0";

    if (globalKnownVersion === "0") {
      // First poll — record baseline
      globalKnownVersion = serverVersion;
      return;
    }

    if (serverVersion !== globalKnownVersion) {
      globalKnownVersion = serverVersion;
      invalidateClientConfigCache();
      catalogListeners.forEach((listener) => {
        try {
          listener();
        } catch (err) {
          console.error("Catalog update listener error:", err);
        }
      });
    }
  } catch {
    // Network error — skip silently, next interval will retry
  } finally {
    globalInFlight = false;
  }
}

function startGlobalPolling() {
  if (typeof window === "undefined") return;
  if (globalIntervalId || catalogListeners.size === 0) return;
  globalIntervalId = setInterval(pollConfigVersion, CONFIG_POLL_INTERVAL_MS);
}

function stopGlobalPolling() {
  if (globalIntervalId) {
    clearInterval(globalIntervalId);
    globalIntervalId = null;
  }
}

function handleGlobalVisibility() {
  if (document.hidden) {
    stopGlobalPolling();
  } else {
    pollConfigVersion();
    startGlobalPolling();
  }
}

/**
 * Subscribes a callback to live catalog changes.
 * Managed as a shared singleton across the application to prevent redundant HTTP requests.
 */
export function subscribeToLiveCatalogUpdates(
  onUpdate: () => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  catalogListeners.add(onUpdate);

  if (!globalVisibilityBound) {
    document.addEventListener("visibilitychange", handleGlobalVisibility);
    globalVisibilityBound = true;
  }

  // Trigger poll on initial subscriber
  if (catalogListeners.size === 1) {
    pollConfigVersion();
    startGlobalPolling();
  }

  return () => {
    catalogListeners.delete(onUpdate);
    if (catalogListeners.size === 0) {
      stopGlobalPolling();
    }
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
    "Collect your order from the kitchen at Metropolis Rivera, Shop No 10, Kasarvadavali, Opp to Laxmi Narayan Mandir, 400615.",
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
  isNewUser?: boolean;
  requiresUsername?: boolean;
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

export async function updateClientUsername(
  username: string
): Promise<{ success: boolean; user?: ClientUser; message?: string }> {
  try {
    const res = await clientFetch("/auth/username", {
      method: "POST",
      body: JSON.stringify({ username: username.trim() }),
    });
    const data = await res.json();
    if (data.success && data.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("nt_client_user", JSON.stringify(data.user));
      } catch {}
    }
    return data;
  } catch (err) {
    return { success: false, message: "Network error setting username" };
  }
}

export async function updateClientProfile(data: {
  username?: string;
  phone?: string;
}): Promise<{ success: boolean; user?: ClientUser; message?: string }> {
  try {
    const res = await clientFetch("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (resData.success && resData.user && typeof window !== "undefined") {
      try {
        localStorage.setItem("nt_client_user", JSON.stringify(resData.user));
      } catch {}
    }
    return resData;
  } catch (err) {
    return { success: false, message: "Network error updating profile" };
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
  label?: string; // "Home" | "Work" | "Other"
  flatNumber?: string;
  wing?: string;
  addressLine1?: string;
  addressLine2?: string;
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
  payment?: {
    provider: string;
    razorpayOrderId?: string;
    keyId: string;
    amount: number;
    currency: string;
    isSimulated?: boolean;
  };
  razorpay?: {
    orderId: string;
    keyId: string;
    amount: number;
    currency: string;
    isSimulated?: boolean;
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
    const data: OrderPlacedResult = await res.json();

    // Normalize Razorpay payload whether server returned data.payment or data.razorpay
    if (data?.payment?.razorpayOrderId && !data.razorpay) {
      data.razorpay = {
        orderId: data.payment.razorpayOrderId,
        keyId: data.payment.keyId,
        amount: data.payment.amount,
        currency: data.payment.currency || "INR",
        isSimulated: data.payment.isSimulated,
      };
    }

    return data;
  } catch {
    return {
      success: false,
      message: "Network error submitting order",
    };
  }
}

export interface VerifyPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResult {
  success: boolean;
  message?: string;
  order?: any;
}

export async function verifyClientPayment(
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResult> {
  try {
    const res = await clientFetch("/orders/verify-payment", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data: VerifyPaymentResult = await res.json();
    return data;
  } catch {
    return {
      success: false,
      message: "Network error verifying payment with server",
    };
  }
}

/**
 * Ensures Razorpay Checkout script (checkout.js) is loaded on the page.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as unknown as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── Customer Orders & Cancellation API ──────────────────────────

export type ClientOrderStatus =
  | "pending_payment"
  | "placed"
  | "preparing"
  | "ready"
  | "porter_booked"
  | "porter_failed"
  | "out_for_delivery"
  | "delivered"
  | "cancelled_by_customer"
  | "cancelled_by_admin";

export interface ClientOrderItemAddon {
  addonId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
}

export interface ClientOrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  image?: string;
  kind?: "product" | "addon";
  addonId?: string;
  addons?: ClientOrderItemAddon[];
}

export interface ClientOrder {
  id: string;
  orderNumber: string;
  userId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  deliveryAddress: {
    id?: string;
    label?: string;
    flatNumber?: string;
    wing?: string;
    addressLine1?: string;
    addressLine2?: string;
    street: string;
    building?: string;
    floor?: string;
    apartment?: string;
    landmark?: string;
    city?: string;
    pincode?: string;
    borzoFormat?: {
      address: string;
      note: string;
    };
  };
  orderType: "pickup" | "delivery";
  items: ClientOrderItem[];
  itemTotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  status: ClientOrderStatus;
  canCustomerCancelUntil: string;
  dispatchDate?: string;
  dispatchSlot?: {
    id: string;
    start: string;
    end: string;
    label: string;
  };
  payment?: {
    provider: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    status: string;
    paidAt?: string;
  };
  refund?: {
    status: "none" | "initiated" | "refunded" | "declined";
    amount?: number;
    type?: "full" | "partial" | "decline";
    reason?: string;
    razorpayRefundId?: string;
    refundedAt?: string;
  };
  borzo?: {
    borzoOrderId?: number;
    borzoOrderName?: string;
    trackingUrl?: string;
    status?: string;
    deliveryFee?: string;
  };
  timeline?: Array<{
    status: ClientOrderStatus;
    timestamp: string;
    note?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface GetClientOrdersResult {
  success: boolean;
  orders: ClientOrder[];
  count: number;
  message?: string;
}

export interface CancelOrderResult {
  success: boolean;
  message: string;
  order?: ClientOrder;
  refund?: any;
}

export async function getClientOrders(): Promise<GetClientOrdersResult> {
  try {
    const res = await clientFetch("/orders", {
      method: "GET",
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, orders: [], count: 0, message: err.message || "Failed to load orders" };
    }
    const data = await res.json();
    return data;
  } catch {
    return { success: false, orders: [], count: 0, message: "Network error loading orders" };
  }
}

export async function cancelClientOrder(orderId: string): Promise<CancelOrderResult> {
  try {
    const res = await clientFetch(`/orders/${orderId}/cancel`, {
      method: "POST",
    });
    const data = await res.json();
    return data;
  } catch {
    return { success: false, message: "Network error cancelling order" };
  }
}

export async function downloadClientOrderInvoice(orderId: string, orderNumber: string): Promise<void> {
  const res = await clientFetch(`/orders/${orderId}/invoice.pdf`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to download bill PDF");
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice_${orderNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

