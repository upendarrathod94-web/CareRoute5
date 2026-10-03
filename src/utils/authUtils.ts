/**
 * Utility helpers for masking Personally Identifiable Information (PII)
 * and validating format per CareRoute security specifications.
 */

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '••••••@••••••.com';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local.charAt(0)}••••••@${domain}`;
  }
  return `${local.charAt(0)}••••••${local.charAt(local.length - 1)}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone) return '+1 ••••••0000';
  // Strip non-digits except initial +
  const clean = phone.replace(/[^\d+]/g, '');
  if (clean.length < 7) return '+1 ••••••0000';

  const last4 = clean.slice(-4);
  const prefix = clean.startsWith('+') ? clean.slice(0, 3) : clean.slice(0, 2);
  return `${prefix} ••••••${last4}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Allow international and standard format numbers with at least 8 digits
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}
