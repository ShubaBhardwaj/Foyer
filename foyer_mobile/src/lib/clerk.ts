/**
 * Safe, conditional loader for @clerk/clerk-expo.
 *
 * The native binary on the dev device may not include the ExpoCrypto
 * JSI module.  A top-level `import` from @clerk/clerk-expo would
 * crash the entire JS bundle at evaluation time.  Instead we probe
 * for the native module first and only `require()` clerk when it is
 * safe to do so.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClerk: any | null | undefined = undefined; // undefined = not yet probed

/**
 * Returns true when the native ExpoCrypto module is linked into the
 * running binary.  Returns false in Expo Go or dev-client builds
 * that haven't been rebuilt with `bunx expo run:android`.
 */
export function isExpoCryptoAvailable(): boolean {
  try {
    // TurboModuleRegistry is the canonical way to check for a native
    // module without triggering a hard crash.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { TurboModuleRegistry } = require("react-native");
    const mod = TurboModuleRegistry.get("ExpoCrypto");
    return mod != null;
  } catch {
    return false;
  }
}

/**
 * Safely retrieves the @clerk/clerk-expo module.
 * Returns `null` when the native crypto bindings are absent so
 * callers can fall back to a clerk-less UI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClerkModule(): any | null {
  if (cachedClerk !== undefined) return cachedClerk;

  if (!isExpoCryptoAvailable()) {
    console.warn(
      "[Clerk] Native module 'ExpoCrypto' not found in binary. " +
        "Clerk auth is disabled. Rebuild with: bunx expo run:android"
    );
    cachedClerk = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedClerk = require("@clerk/clerk-expo");
    return cachedClerk;
  } catch (err) {
    console.warn("[Clerk] Unable to load @clerk/clerk-expo:", err);
    cachedClerk = null;
    return null;
  }
}

/**
 * Safely retrieves the official tokenCache from @clerk/clerk-expo/token-cache.
 * Returns a no-op fallback when clerk is unavailable.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClerkTokenCache(): any {
  if (!isExpoCryptoAvailable()) {
    return {
      getToken: async () => null,
      saveToken: async () => {},
    };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@clerk/clerk-expo/token-cache").tokenCache;
  } catch {
    return {
      getToken: async () => null,
      saveToken: async () => {},
    };
  }
}
