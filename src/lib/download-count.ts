/**
 * Count of successful PDF downloads this session, stored in sessionStorage only:
 * it survives reloads within the tab and is erased when the tab closes — same
 * lifecycle and philosophy as the draft. One anonymous integer, nothing leaves
 * the device.
 */
const STORAGE_KEY = "invoicely.downloads.v1";

let memoryCount = 0;

/** Bump and return the session download count. If storage is unavailable or
 *  blocked, keep counting in memory for this page load. */
export function bumpDownloadCount(): number {
  let next: number;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : 0;
    next = (Number.isNaN(parsed) ? 0 : parsed) + 1;
    window.sessionStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    next = memoryCount + 1;
  }
  memoryCount = next;
  return next;
}
