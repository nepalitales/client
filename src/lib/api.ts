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
  isTestOnly?: boolean;
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
  windowState?: "before" | "open" | "after";
  message: string;
  currentWindow?: { start: string; end: string } | null;
  canCancelUntil?: string | null;
  todayDateStr?: string;
  todayDay?: string;
  activeWindows?: Array<{ start: string; end: string; maxOrders?: number }>;
  nextWindow?: {
    day: string;
    dayLabel: string;
    start: string;
    end: string;
    timeFormatted: string;
  } | null;
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
const ORDER_WINDOWS_CACHE_TTL_MS = 5 * 1000; // 5 seconds freshness

interface CachedOrderWindowsEntry {
  timestamp: number;
  data: ClientOrderWindowsResponse;
}

let cachedOrderWindowsPromise: Promise<ClientOrderWindowsResponse | null> | null = null;

export async function getClientOrderWindows(
  forceRefresh = false
): Promise<ClientOrderWindowsResponse | null> {
  if (cachedOrderWindowsPromise && !forceRefresh) {
    return cachedOrderWindowsPromise;
  }

  cachedOrderWindowsPromise = (async () => {
    try {
      const res = await clientFetch("/order-windows", {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json: ClientOrderWindowsResponse = await res.json();
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
export interface ClientConfigSnapshotResponse {
  success: boolean;
  configVersion: string;
  orderWindows: OrderWindowDayConfig[];
  weeklyOff: string[];
  holidays: HolidayItem[];
}

let cachedConfigPromise: Promise<ClientConfigSnapshotResponse | null> | null = null;
let cachedCategoriesPromise: Promise<CategoryWithProducts[]> | null = null;
let categoriesCacheTimestamp = 0;
const CATEGORIES_CACHE_TTL_MS = 5_000; // 5s in-memory freshness

export async function getClientConfig(
  forceRefresh = false
): Promise<ClientConfigSnapshotResponse | null> {
  if (cachedConfigPromise && !forceRefresh) {
    return cachedConfigPromise;
  }

  cachedConfigPromise = (async () => {
    try {
      const res = await clientFetch("/config", { cache: "no-store" });
      if (!res.ok) return null;
      const json: ClientConfigSnapshotResponse = await res.json();
      if (json?.success) {
        if (json.configVersion && json.configVersion !== globalKnownVersion) {
          globalKnownVersion = json.configVersion;
        }
      }
      return json;
    } catch (err) {
      console.warn("[Config API] Error fetching config snapshot:", err);
      return null;
    }
  })();

  return cachedConfigPromise;
}

export function invalidateClientConfigCache(): void {
  cachedConfigPromise = null;
  cachedHolidaysPromise = null;
  cachedOrderWindowsPromise = null;
  cachedWeeklyOffPromise = null;
  cachedCategoriesPromise = null;
  categoriesCacheTimestamp = 0;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(HOLIDAYS_CACHE_KEY);
      sessionStorage.removeItem(ORDER_WINDOWS_CACHE_KEY);
      sessionStorage.removeItem(WEEKLY_OFF_CACHE_KEY);
    } catch {
      // Storage access blocked or unavailable
    }
  }
}

export async function getClientHolidays(
  forceRefresh = false
): Promise<ClientHolidaysResponse | null> {
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

  const nextDayMap: Record<string, string> = {
    monday: "tuesday",
    tuesday: "wednesday",
    wednesday: "thursday",
    thursday: "friday",
    friday: "saturday",
    saturday: "sunday",
    sunday: "monday",
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

  // Identify days that are the eve (day before) a recurring weekly off day
  const eveOfWeeklyOffDays = (weeklyOff || [])
    .map((off) => prevDayMap[off.toLowerCase()] || "")
    .filter(Boolean);

  // Check current weekday in IST (Asia/Kolkata)
  const istWeekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
  }).format(new Date()).toLowerCase();

  const formatH = (t: string) => {
    const [hStr, mStr] = t.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || "0", 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return m > 0 ? `${h}:${mStr} ${ampm}` : `${h} ${ampm}`;
  };

  const windowMap = new Map(orderWindows.map((w) => [w.day, w]));
  const openDays: string[] = [];
  const closedDays: string[] = [];
  let timeStr = "";

  // Prioritize TODAY's order window so the banner instantly reflects today's active times
  const todayConfig = windowMap.get(istWeekday as any);
  if (todayConfig && todayConfig.enabled && todayConfig.windows && todayConfig.windows.length > 0) {
    const w = todayConfig.windows[0];
    timeStr = `${formatH(w.start)}–${formatH(w.end)}`;
  }

  for (const day of dayOrder) {
    const isEveOfWeeklyOff = eveOfWeeklyOffDays.includes(day);
    const config = windowMap.get(day);

    if (!isEveOfWeeklyOff && config && config.enabled && config.windows && config.windows.length > 0) {
      openDays.push(day);
    } else {
      closedDays.push(day);
    }

    if (!timeStr && config && config.windows && config.windows.length > 0) {
      const w = config.windows[0];
      timeStr = `${formatH(w.start)}–${formatH(w.end)}`;
    }
  }

  if (!timeStr) {
    timeStr = "2 PM–4 PM";
  }

  function formatDayRanges(days: string[]): string {
    if (days.length === 0) return "CURRENTLY CLOSED";
    if (days.length === 7) return "ALL DAYS";

    const ranges: string[] = [];
    let startIdx = -1;

    for (let i = 0; i <= dayOrder.length; i++) {
      if (i < dayOrder.length && days.includes(dayOrder[i])) {
        if (startIdx === -1) startIdx = i;
      } else if (startIdx !== -1) {
        const prevIdx = i - 1;
        ranges.push(
          startIdx === prevIdx
            ? shortMap[dayOrder[startIdx]]
            : `${shortMap[dayOrder[startIdx]]}–${shortMap[dayOrder[prevIdx]]}`
        );
        startIdx = -1;
      }
    }

    return ranges.join(", ");
  }

  const openRange = formatDayRanges(openDays);

  if (openDays.length === 0) {
    return {
      scheduleText: "ORDER WINDOW · CURRENTLY CLOSED",
      closedText: "",
      holidayInfo: null,
      fullText: "ORDER WINDOW · CURRENTLY CLOSED",
    };
  }

  const istHourMinute = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());

  const todayWindow = todayConfig?.windows?.[0];
  const isAfterTodayWindow = Boolean(todayWindow && istHourMinute > todayWindow.end);
  const isOpenNowToday = Boolean(todayWindow && istHourMinute >= todayWindow.start && istHourMinute <= todayWindow.end);

  let scheduleText = ["ORDER WINDOW", openRange, timeStr].filter(Boolean).join(" · ");
  if (isAfterTodayWindow) {
    const tomorrowConfig = windowMap.get((nextDayMap[istWeekday] || "") as any);
    const tomorrowTimeStr = tomorrowConfig?.windows?.[0]
      ? `${formatH(tomorrowConfig.windows[0].start)}–${formatH(tomorrowConfig.windows[0].end)}`
      : timeStr;
    scheduleText = `ORDER WINDOW CLOSED FOR TODAY · OPENS TOMORROW AT ${tomorrowTimeStr}`;
  } else if (isOpenNowToday) {
    scheduleText = `ORDER WINDOW IS OPEN NOW (${timeStr})`;
  }

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

  const isTodayEveOfWeeklyOff = weeklyOff
    ? weeklyOff.some((off) => prevDayMap[off.toLowerCase()] === istWeekday)
    : false;

  const isTodayWeeklyOff = weeklyOff
    ? weeklyOff.some((off) => off.toLowerCase() === istWeekday)
    : false;

  // Dynamic explanation for weekly off and advance booking
  let dispatchOffText = "";
  if (isTodayEveOfWeeklyOff && weeklyOff && weeklyOff.length > 0) {
    const matchingOff = weeklyOff.filter(
      (off) => prevDayMap[off.toLowerCase()] === istWeekday
    );
    const offNames = matchingOff
      .map((d) => pluralMap[d.toLowerCase()] || d.toUpperCase())
      .join(" & ");
    const nextNames = matchingOff
      .map((d) => (nextDayMap[d.toLowerCase()] || "").toUpperCase())
      .filter(Boolean)
      .join(" & ");
    const bookDays = matchingOff
      .map((d) => d.toUpperCase())
      .join(" & ");

    const todayName = istWeekday.toUpperCase();
    dispatchOffText = `ORDERING CLOSED TODAY (${todayName}) · KITCHEN HAS OFF TOMORROW · NEXT ORDER WINDOW OPENS ${bookDays} (${timeStr})`;
  } else if (isTodayWeeklyOff && weeklyOff && weeklyOff.length > 0) {
    const nextTarget = (nextDayMap[istWeekday] || "TOMORROW").toUpperCase();
    const todayName = istWeekday.toUpperCase();
    if (isAfterTodayWindow) {
      const tomorrowConfig = windowMap.get((nextDayMap[istWeekday] || "") as any);
      const tomorrowTimeStr = tomorrowConfig?.windows?.[0]
        ? `${formatH(tomorrowConfig.windows[0].start)}–${formatH(tomorrowConfig.windows[0].end)}`
        : timeStr;
      const afterTarget = (nextDayMap[nextDayMap[istWeekday] || ""] || "ADVANCE").toUpperCase();
      dispatchOffText = `ORDER WINDOW CLOSED FOR TODAY · OPENS TOMORROW AT ${tomorrowTimeStr} FOR ${afterTarget} DELIVERY · NO DELIVERIES TODAY (${todayName})`;
    } else if (isOpenNowToday) {
      dispatchOffText = `ORDER WINDOW IS OPEN NOW (${timeStr}) FOR ${nextTarget} DELIVERY · NO DELIVERIES TODAY (${todayName})`;
    } else {
      dispatchOffText = `ORDER WINDOW OPENS TODAY AT ${timeStr} FOR ${nextTarget} DELIVERY · NO DELIVERIES TODAY (${todayName})`;
    }
  } else if (weeklyOff && weeklyOff.length > 0) {
    const offNames = weeklyOff
      .map((d) => pluralMap[d.toLowerCase()] || d.toUpperCase())
      .join(" & ");
    const prevNames = weeklyOff
      .map((d) => pluralMap[prevDayMap[d.toLowerCase()] || ""] || "")
      .filter(Boolean)
      .join(" & ");
    const nextNames = weeklyOff
      .map((d) => (nextDayMap[d.toLowerCase()] || "").toUpperCase())
      .filter(Boolean)
      .join(" & ");
    const bookDays = weeklyOff
      .map((d) => d.toUpperCase())
      .join(" & ");

    dispatchOffText = `WE CLOSE ON ${offNames} SO THE ORDERING WINDOW IS CLOSED ON ${prevNames} · FOR ${nextNames}'S ORDER, BOOK ON ${bookDays} (ORDER WINDOW OPEN ${timeStr})`;
  }

  const holidayInfo = formatHolidayNotice(holidays);

  let fullText = "";

  if (isTodayEveOfWeeklyOff || isTodayWeeklyOff) {
    const holidaySuffix = holidayInfo ? ` · ${holidayInfo.text}` : " & HOLIDAYS";
    fullText = `${dispatchOffText}${holidaySuffix}`;
  } else {
    const closureParts = [closedText, dispatchOffText].filter(Boolean);
    let fullClosedSegment = "";
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

    fullText = [scheduleText, fullClosedSegment].filter(Boolean).join(" · ");
  }

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

const WEEKLY_OFF_CACHE_KEY = "nt_client_weekly_off_cache";
let cachedWeeklyOffPromise: Promise<{ success: boolean; weeklyOff: string[] } | null> | null = null;

export async function getClientWeeklyOff(
  forceRefresh = false
): Promise<{ success: boolean; weeklyOff: string[] } | null> {
  if (cachedWeeklyOffPromise && !forceRefresh) {
    return cachedWeeklyOffPromise;
  }

  cachedWeeklyOffPromise = (async () => {
    try {
      const res = await clientFetch("/weekly-off", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn("[WeeklyOff API] Error fetching weekly off:", err);
      return null;
    }
  })();

  return cachedWeeklyOffPromise;
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
    const res = await clientFetch(endpoint, { cache: "default" });
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
      const isTesterInUrl = typeof window !== "undefined" && window.location.search.includes("tester=bhavartheankit");
      const url = isTesterInUrl ? "/categories?tester=bhavartheankit" : "/categories";
      const res = await clientFetch(url, { cache: "no-store" });
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
    const isTesterInUrl = typeof window !== "undefined" && window.location.search.includes("tester=bhavartheankit");
    const url = isTesterInUrl ? `/products/${productId}?tester=bhavartheankit` : `/products/${productId}`;
    const res = await clientFetch(url);
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
    id: "faq_preorder_schedule",
    question: "Why is ordering closed on Sunday if the kitchen is closed on Monday?",
    answer:
      "We close on Monday so the ordering window will be closed on Sunday. For Tuesday’s order, you have to book on Monday when the ordering window will be open at 2:00 PM – 4:00 PM.",
    category: "Ordering",
    displayOrder: 4,
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

const CONFIG_POLL_INTERVAL_MS = 10_000; // Poll every 10s for real-time responsiveness

let globalKnownVersion = "0";
let globalIntervalId: ReturnType<typeof setInterval> | null = null;
let globalVisibilityBound = false;
let globalInFlight = false;
const catalogListeners = new Set<() => void>();

async function pollConfigVersion() {
  if (typeof document !== "undefined" && document.hidden) return;
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
    const res = await clientFetch("/order-settings", { cache: "default" });
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

/**
 * Converts any 24-hour times (e.g. "14:00 - 16:00") within a message string into 12-hour AM/PM format ("02:00 PM - 04:00 PM").
 */
export function formatMessageTime12(message: string): string {
  if (!message) return "";
  return message.replace(/\b([01]?\d|2[0-3]):([0-5]\d)(?!\s*[apAP][mM])\b/g, (_, hStr, mStr) => {
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const padH = h < 10 ? `0${h}` : `${h}`;
    return `${padH}:${mStr} ${ampm}`;
  });
}

/**
 * Formats server order window closure messages into concise, customer-friendly cart notices.
 */
export function formatCartNotice(
  msg?: string,
  status?: OrderWindowStatusResponse | null
): { title: string; subtitle?: string } {
  const effectiveMsg = status?.message || msg;
  if (!effectiveMsg) {
    return {
      title: "Ordering is currently closed",
      subtitle: "Please check back during our regular ordering window.",
    };
  }

  const cleaned = formatMessageTime12(effectiveMsg);

  // If status is OPEN
  if (status?.isOpen) {
    return {
      title: "Ordering is currently open",
      subtitle: status.currentWindow
        ? `Open until ${formatMessageTime12(status.currentWindow.end)}`
        : "Preparing for next dispatch slot",
    };
  }

  // If weekly off closure
  if (/weekly off|kitchen off/i.test(cleaned)) {
    const dayMatch = cleaned.match(/(?:off on|tomorrow\s*\()\s*([A-Za-z]+)/i);
    const dayName = dayMatch ? dayMatch[1] : "";
    return {
      title: dayName ? `Kitchen closed for weekly off on ${dayName}` : "Kitchen closed for weekly off",
      subtitle: cleaned.includes("Opens") || cleaned.includes("reopens")
        ? cleaned
        : dayName
        ? `Ordering reopens ${dayName} for advance delivery.`
        : "Ordering will reopen during the next scheduled window.",
    };
  }

  // If festival holiday
  if (/holiday/i.test(cleaned)) {
    return {
      title: "Kitchen closed for scheduled holiday",
      subtitle: cleaned.includes("Opens") || cleaned.includes("resume")
        ? cleaned
        : "Pre-orders will resume on our next operating day.",
    };
  }

  // If daily order window (after or before or general message)
  if (/closed for today|opens tomorrow|opens today|order window/i.test(cleaned)) {
    return {
      title: cleaned,
      subtitle: "Dishes will be handcrafted fresh for tomorrow's delivery.",
    };
  }

  return {
    title: cleaned,
    subtitle: "Dishes will be handcrafted fresh for tomorrow's delivery.",
  };
}

/**
 * Normalizes an external tracking URL or contact string.
 * Ensures URLs without protocols (e.g. "porter.in/track/123" or "dxdxdcdcdcdcd")
 * are prefixed with "https://" so they open externally rather than navigating relative to nepalitales.com.
 */
export function formatExternalTrackingUrl(url?: string | null): string {
  if (!url) return "#";
  const trimmed = url.trim();
  if (!trimmed) return "#";
  if (/^(https?:\/\/|tel:|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  // Check if it's a telephone number
  if (/^\+?\d{10,15}$/.test(trimmed.replace(/[\s-]/g, ""))) {
    return `tel:${trimmed.replace(/[\s-]/g, "")}`;
  }
  return `https://${trimmed}`;
}

