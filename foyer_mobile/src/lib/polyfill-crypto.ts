/* eslint-disable @typescript-eslint/no-explicit-any */
// Polyfill ExpoCrypto native module when running dev build without native rebuild.
// Must be imported before @/lib/clerk (see app/_layout.tsx).
const globalAny: any = global;

if (globalAny) {
  if (!globalAny.ExpoModules) {
    globalAny.ExpoModules = {};
  }

  if (!globalAny.ExpoModules.ExpoCrypto && !globalAny.ExpoModules.ExpoCryptoModule) {
    globalAny.ExpoModules.ExpoCrypto = {
      getRandomBytes: (count: number) => {
        const bytes = new Uint8Array(count);
        for (let i = 0; i < count; i++) {
          bytes[i] = Math.floor(Math.random() * 256);
        }
        return bytes;
      },
      getRandomValues: (array: Uint8Array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = Math.floor(Math.random() * 256);
        }
        return array;
      },
      digestBytesAsync: async () => new Uint8Array(0),
      digestStringAsync: async () => "",
    };
  }
}

if (globalAny && !globalAny.crypto) {
  globalAny.crypto = {};
}

if (globalAny && globalAny.crypto && !globalAny.crypto.getRandomValues) {
  globalAny.crypto.getRandomValues = (array: Uint8Array) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };
}
