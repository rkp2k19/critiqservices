import { z } from "zod";

/** Indian mobile numbers: 10 digits starting with 6–9 (an optional +91 / 0 prefix is stripped). */
export function normalizeIndianMobile(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidIndianMobile(input: string) {
  return /^[6-9]\d{9}$/.test(normalizeIndianMobile(input));
}

const emailSchema = z.string().trim().email().max(255);
export function isValidEmail(input: string) {
  return emailSchema.safeParse(input).success;
}

export function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** The visitor may see full details only after BOTH the mobile and the email are verified. */
export function canViewFullDetails(state: { mobileVerified: boolean; emailVerified: boolean }) {
  return state.mobileVerified && state.emailVerified;
}

const STORAGE_KEY = "replad-verified-visitor";

export type VerifiedVisitor = { mobile: string; email: string };

export function loadVerifiedVisitor(): VerifiedVisitor | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VerifiedVisitor;
    return parsed.mobile && parsed.email ? parsed : null;
  } catch {
    return null;
  }
}

export function saveVerifiedVisitor(visitor: VerifiedVisitor) {
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(visitor));
}
