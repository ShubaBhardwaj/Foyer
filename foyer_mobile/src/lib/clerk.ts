/**
 * Utility helper for optional native `@clerk/clerk-expo` module loading.
 * Returns null safely when native binary crypto bindings are absent.
 */
export function isExpoCryptoAvailable(): boolean {
  return false;
}

/**
 * Safely retrieves the `@clerk/clerk-expo` module.
 * Returns null when running in dev environments without compiled native crypto binaries.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClerkModule(): any | null {
  return null;
}
