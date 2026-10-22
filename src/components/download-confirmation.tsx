"use client";

import { useEffect } from "react";

interface DownloadConfirmationProps {
  onClose: () => void;
}

/** Quiet, non-blocking confirmation shown between the full Bio popups: a small
 *  bottom toast that announces the download and fades away on its own. */
export default function DownloadConfirmation({ onClose }: DownloadConfirmationProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    // Entirely non-interactive: no pointer-events anywhere, clicks pass through.
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-6 z-40 flex justify-center sm:inset-x-0"
    >
      <div className="toast-in flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(16,24,40,0.16)]">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-gray-900">Your invoice has downloaded</p>
      </div>
    </div>
  );
}
