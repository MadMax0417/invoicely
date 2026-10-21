"use client";

import { useCallback, useEffect, useState } from "react";
import {
  defaultInvoiceNumber,
  todayISO,
  toISODate,
} from "./format";
import type { InvoiceData, LineItem } from "./types";

/**
 * Drafts live in sessionStorage only: erased automatically when the tab or
 * browser is closed. No timers, no server, nothing leaves the device.
 */
const STORAGE_KEY = "invoicely.draft.v1";

let itemCounter = 0;

/** IDs are only used as React keys / row handles — uniqueness within the tab is enough. */
export function createItem(): LineItem {
  itemCounter += 1;
  return {
    id: `item-${itemCounter}-${Math.random().toString(36).slice(2, 9)}`,
    description: "",
    qty: "1",
    rate: "",
  };
}

export const DEFAULT_ACCENT = "#4f46e5";

/** Blank invoice — dates and number are filled in after mount (avoids SSR/CSR drift). */
export function createEmptyInvoice(): InvoiceData {
  return {
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    toName: "",
    toEmail: "",
    toAddress: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    currency: "INR",
    accent: DEFAULT_ACCENT,
    logo: null,
    // Deterministic id: this runs during SSR/prerender and must match on the client.
    items: [{ id: "item-initial", description: "", qty: "1", rate: "" }],
    discountType: "percent",
    discountValue: "",
    taxRate: "",
    notes: "",
    paymentDetails: "",
  };
}

function plusDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

/** Merge a parsed draft over a blank invoice, dropping anything malformed. */
function sanitize(stored: unknown): InvoiceData {
  const base = createEmptyInvoice();
  if (!stored || typeof stored !== "object") return base;

  const raw = stored as Record<string, unknown>;
  const merged: InvoiceData = { ...base };

  for (const key of Object.keys(base) as (keyof InvoiceData)[]) {
    const value = raw[key];
    if (key === "items" || key === "discountType" || key === "accent") continue;
    if (typeof base[key] === "string" && typeof value === "string") {
      (merged as unknown as Record<string, string>)[key] = value;
    }
  }

  if (typeof raw.accent === "string" && /^#[0-9a-fA-F]{6}$/.test(raw.accent)) {
    merged.accent = raw.accent;
  }

  // Logo: only accept a plausible, size-bounded image data URL.
  if (
    typeof raw.logo === "string" &&
    raw.logo.startsWith("data:image/") &&
    raw.logo.length <= 400_000
  ) {
    merged.logo = raw.logo;
  }

  if (raw.discountType === "percent" || raw.discountType === "flat") {
    merged.discountType = raw.discountType;
  }

  if (Array.isArray(raw.items)) {
    const items = raw.items
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : createItem().id,
        description: typeof item.description === "string" ? item.description : "",
        qty: typeof item.qty === "string" ? item.qty : "1",
        rate: typeof item.rate === "string" ? item.rate : "",
      }));
    merged.items = items.length ? items : [createItem()];
  }

  return merged;
}

export function useInvoiceDraft() {
  const [data, setData] = useState<InvoiceData>(createEmptyInvoice);
  // Persist only after the restore/defaults effect has committed — otherwise a
  // (StrictMode) double-run could write a blank draft and "restore" it over the
  // defaults.
  const [initialized, setInitialized] = useState(false);

  // Restore draft (sessionStorage) or fill sensible defaults — after mount only.
  useEffect(() => {
    let restored = false;
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        setData(sanitize(JSON.parse(raw)));
        restored = true;
      }
    } catch {
      // Corrupt or unavailable storage — start clean.
    }

    if (!restored) {
      setData((prev) => ({
        ...prev,
        invoiceNumber: defaultInvoiceNumber(),
        issueDate: todayISO(),
        dueDate: plusDays(14),
      }));
    }

    setInitialized(true);
  }, []);

  // Persist every change while the tab is open.
  useEffect(() => {
    if (!initialized) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full/blocked — the invoice still works in memory.
    }
  }, [data, initialized]);

  const setField = useCallback(<K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<LineItem>) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }, []);

  const addItem = useCallback(() => {
    setData((prev) => ({ ...prev, items: [...prev.items, createItem()] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setData((prev) => {
      const items = prev.items.filter((item) => item.id !== id);
      return { ...prev, items: items.length ? items : [createItem()] };
    });
  }, []);

  /** Clear the draft and start a fresh invoice. */
  const reset = useCallback(() => {
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setData({
      ...createEmptyInvoice(),
      invoiceNumber: defaultInvoiceNumber(),
      issueDate: todayISO(),
      dueDate: plusDays(14),
    });
  }, []);

  return { data, setField, updateItem, addItem, removeItem, reset };
}
