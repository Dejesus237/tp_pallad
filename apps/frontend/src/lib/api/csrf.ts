import { AuthService } from "@/api/services/AuthService";

let csrfReady = false;

/**
 * Ensure Django CSRF cookie exists.
 * Safe to call many times.
 */
export async function ensureCsrfCookie(force = false): Promise<void> {
  if (csrfReady && !force) return;
  await AuthService.authCsrf();
  csrfReady = true;
}

/**
 * Call this if you suspect cookies got cleared (logout, domain change, etc.)
 */
export function resetCsrfState(): void {
  csrfReady = false;
}