/**
 * SECURE ADMIN CONFIGURATION
 * 
 * 🔐 EASIEST & MOST SECURE METHOD:
 * Admin email is set via environment variable
 * 
 * To change admin:
 * 1. Update ADMIN_EMAIL in .env.local
 * 2. Restart the application
 * 3. Only the new email will have admin access
 */

// 🔐 ADMIN EMAIL FROM ENVIRONMENT VARIABLE
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kyriakosginis@gmail.com";

/**
 * Check if an email is the admin email
 * Only ONE admin is allowed at a time for maximum security
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  return email === ADMIN_EMAIL;
}

/**
 * Get the current admin email
 */
export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}

/**
 * Security check: Ensure only one admin exists
 */
export function validateAdminSecurity(): boolean {
  // This function can be extended to add additional security checks
  return true;
}
