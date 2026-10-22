"use client";

import { useEffect, useId, useRef } from "react";

/** "See how your Bio page would look" destination — placeholder until a demo
 *  bio page exists (same link as the footer's "Bio by Saarthi"). */
const BIO_TOOL_URL = "https://bio.saarthistudio.com";

/** Saarthi Studio's main site, linked from the card footnote. */
const STUDIO_URL = "https://www.saarthistudio.com";

interface DownloadPopupProps {
  /** Which card to show: a download confirmation or a failure notice. */
  popup: "success" | "error";
  onClose: () => void;
}

/** Centered confirmation card — shown for every 5th download (and on failure).
 *  Deliberate, not transient: it stays until dismissed and hands focus back to
 *  the page on close. */
export default function DownloadPopup({ popup, onClose }: DownloadPopupProps) {
  const success = popup === "success";
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);

  // Escape closes.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus the card when it opens; hand focus back to the page when it closes.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    cardRef.current?.focus();
    return () => previouslyFocused?.focus();
  }, []);

  // The card blocks page scroll; restore it on close.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Keep Tab/Shift+Tab cycling inside the card.
  function trapTab(event: React.KeyboardEvent) {
    if (event.key !== "Tab") return;
    const container = cardRef.current;
    if (!container) return;
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>("button, a[href]"),
    );
    if (focusables.length === 0) return;
    const first = focusables.at(0);
    const last = focusables.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div
      className="popup-backdrop fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={trapTab}
        onClick={(event) => event.stopPropagation()}
        className="popup-card relative w-full max-w-sm rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-[0_8px_24px_rgba(16,24,40,0.16)] outline-none sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-300 transition hover:bg-gray-50 hover:text-gray-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <span
          aria-hidden
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            success ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          {success ? (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M12 7v6" />
              <path d="M12 16.5h.01" />
            </svg>
          )}
        </span>

        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900">
          {success ? "Your invoice has downloaded" : "Could not generate the PDF"}
        </h2>

        {success ? (
          <>
            <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
              One link for your work, contact and payment details.
            </p>
            <a
              href={BIO_TOOL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              See how your Bio page would look
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M7 17 17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium text-gray-500 transition hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Done
            </button>
            <p className="mt-1.5 text-[11px] text-gray-400">
              Invoicely is a free tool by{" "}
              <a
                href={STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 underline-offset-2 transition hover:text-indigo-600 hover:underline"
              >
                Saarthi Studio
              </a>
            </p>
          </>
        ) : (
          <>
            <p className="mt-1.5 text-[13px] leading-relaxed text-gray-500">
              Your draft is unchanged — please try again.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  );
}
