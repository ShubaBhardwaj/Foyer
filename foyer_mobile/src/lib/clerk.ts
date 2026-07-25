import { NativeModules } from "react-native";

/**
 * Checks if the native ExpoCrypto JSI module is present in the current native binary.
 */
export function isExpoCryptoAvailable(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globalExpo = (global as any).ExpoModules;
    if (globalExpo && (globalExpo.ExpoCrypto || globalExpo.ExpoCryptoModule)) {
      return true;
    }
    if (NativeModules && (NativeModules.ExpoCrypto || NativeModules.ExponentCrypto)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Cached module instance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClerk: any = null;
let loadAttempted = false;

/**
 * Safely retrieves the `@clerk/clerk-expo` module.
 * Returns null if `ExpoCrypto` native module is missing from the compiled app binary.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getClerkModule(): any | null {
  if (loadAttempted) {
    return cachedClerk;
  }
  loadAttempted = true;

  if (!isExpoCryptoAvailable()) {
    console.warn(
      "[Clerk] Native module 'ExpoCrypto' not found in binary. Clerk auth disabled until native rebuild."
    );
    cachedClerk = null;
    return null;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cachedClerk = require("@clerk/clerk-expo");
    return cachedClerk;
  } catch (err) {
    console.warn("[Clerk] Unable to load @clerk/clerk-expo module:", err);
    cachedClerk = null;
    return null;
  }
}
