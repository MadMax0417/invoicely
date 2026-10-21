"use client";

import { useRef, useState } from "react";
import { processLogoFile, LogoError } from "@/lib/image-process";

const ACCENT_PRESETS = [
  { hex: "#4f46e5", name: "Indigo" },
  { hex: "#7c3aed", name: "Violet" },
  { hex: "#0d9488", name: "Teal" },
  { hex: "#059669", name: "Emerald" },
  { hex: "#0284c7", name: "Sky" },
  { hex: "#e11d48", name: "Rose" },
  { hex: "#d97706", name: "Amber" },
  { hex: "#111418", name: "Ink" },
];

interface CustomizeBarProps {
  accent: string;
  logo: string | null;
  onAccentChange: (hex: string) => void;
  onLogoChange: (dataUrl: string) => void;
  onLogoRemove: () => void;
}

export default function CustomizeBar({
  accent,
  logo,
  onAccentChange,
  onLogoChange,
  onLogoRemove,
}: CustomizeBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file || busy) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await processLogoFile(file);
      onLogoChange(dataUrl);
    } catch (err) {
      setError(err instanceof LogoError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {/* Accent color */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
            Accent
          </span>
          <div className="flex items-center gap-1.5">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.hex}
                type="button"
                title={preset.name}
                aria-label={`Accent ${preset.name}`}
                onClick={() => onAccentChange(preset.hex)}
                className={`h-6 w-6 rounded-full transition hover:scale-110 ${
                  accent === preset.hex
                    ? "ring-2 ring-gray-900/30 ring-offset-2 ring-offset-white"
                    : ""
                }`}
                style={{ backgroundColor: preset.hex }}
              />
            ))}
            <label
              title="Custom color"
              className="relative ml-1 flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 text-[10px] text-gray-400 transition hover:border-gray-400 hover:text-gray-600"
            >
              +
              <input
                type="color"
                aria-label="Custom accent color"
                value={accent}
                onChange={(e) => onAccentChange(e.target.value)}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </label>
          </div>
        </div>

        <div className="hidden h-6 w-px bg-gray-200 sm:block" />

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
            Logo
          </span>

          {logo ? (
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- local data URL, intentionally un-optimized */}
              <img
                src={logo}
                alt="Your logo"
                className="h-9 max-w-[140px] rounded-md border border-gray-100 bg-white object-contain p-1"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[13px] font-medium text-gray-500 transition hover:text-indigo-600"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onLogoRemove}
                className="text-[13px] font-medium text-gray-400 transition hover:text-red-500"
              >
                Remove
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                void handleFile(e.dataTransfer.files[0]);
              }}
              disabled={busy}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-[13px] font-medium transition disabled:opacity-60 ${
                dragging
                  ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                  : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 17V5" />
                <path d="m7 10 5-5 5 5" />
                <path d="M5 21h14" />
              </svg>
              {busy ? "Processing…" : "Upload logo"}
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              void handleFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      {error ? <p className="mt-2 text-[13px] text-red-500">{error}</p> : null}
    </div>
  );
}
