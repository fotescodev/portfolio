/**
 * Feature flags for optional / modular parts of the portfolio.
 *
 * This is intentionally simple so the Universal CV feature can be turned on/off
 * without ripping code out when productizing UCV separately.
 */

function envFlag(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null) return defaultValue;
  const v = String(value).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on', 'enable', 'enabled'].includes(v)) return true;
  if (['0', 'false', 'no', 'n', 'off', 'disable', 'disabled'].includes(v)) return false;
  return defaultValue;
}

/**
 * Vite env vars must be prefixed with VITE_.
 *
 * - VITE_FEATURE_UCV=false  -> disables Universal CV routes/pages in production builds
 */
export const FEATURES = {
  ucv: envFlag(import.meta.env.VITE_FEATURE_UCV, true)
};
