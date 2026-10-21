/**
 * Client-side logo pipeline — nothing here ever touches a server.
 *
 * Input:  any common image (≤ 5 MB) → validated, decoded, EXIF stripped
 * Output: a small data URL (≤ ~80 KB) sized for an invoice header
 *
 * Transparency is preserved (PNG); opaque images re-encode smaller (JPEG).
 * SVGs are rasterized on purpose: no scripts, no external refs in the PDF.
 */

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
];

/** Reject big uploads before even reading them. */
export const MAX_INPUT_BYTES = 5 * 1024 * 1024; // 5 MB

/** Long-side target — invoices render logos around 200–320 px wide. */
const MAX_DIMENSION = 480;

/** Output ceiling as base64 length (~60 KB actual bytes). */
const MAX_OUTPUT_CHARS = 80 * 1024;

export class LogoError extends Error {}

export function validateLogoFile(file: File): void {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new LogoError("Use a PNG, JPG, WebP or SVG file.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new LogoError("That image is too big — keep it under 5 MB.");
  }
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new LogoError("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new LogoError("That image could not be opened — is it valid?"));
    img.src = src;
  });
}

/** Cheap alpha scan (every 4th pixel is plenty to decide PNG vs JPEG). */
function hasTransparency(ctx: CanvasRenderingContext2D, w: number, h: number): boolean {
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 250) return true;
  }
  return false;
}

function toDataURL(
  canvas: HTMLCanvasElement,
  mime: "image/png" | "image/jpeg",
  quality: number,
): string {
  return canvas.toDataURL(mime, quality);
}

/**
 * Process a picked/dropped file into a compact data URL.
 * Throws LogoError with a user-facing message on any problem.
 */
export async function processLogoFile(file: File): Promise<string> {
  validateLogoFile(file);

  const raw = await readAsDataURL(file);
  const img = await loadImage(raw);

  const naturalW = img.naturalWidth || MAX_DIMENSION;
  const naturalH = img.naturalHeight || MAX_DIMENSION;

  let scale = Math.min(1, MAX_DIMENSION / Math.max(naturalW, naturalH));
  let quality = 0.85;
  let last = "";

  for (let attempt = 0; attempt < 5; attempt++) {
    const w = Math.max(1, Math.round(naturalW * scale));
    const h = Math.max(1, Math.round(naturalH * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new LogoError("Could not process that image.");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, w, h);

    // Re-draw through canvas strips EXIF and any external SVG references.
    const mime = hasTransparency(ctx, w, h) ? "image/png" : "image/jpeg";
    last = toDataURL(canvas, mime, quality);

    if (last.length <= MAX_OUTPUT_CHARS) return last;

    scale *= 0.75;
    quality = Math.max(0.6, quality - 0.1);
  }

  // Still over the ceiling after 5 passes — return the smallest we got.
  return last;
}
