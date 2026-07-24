import UserModel from "../models/User";

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random 6-character alphanumeric Unique ID (0-9, a-z, A-Z)
 * and ensures uniqueness against the MongoDB User collection.
 */
export async function generateUniqueId(): Promise<string> {
  let uniqueId = "";
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    attempts++;
    uniqueId = "";
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * CHARS.length);
      uniqueId += CHARS[randomIndex];
    }

    const existing = await UserModel.findOne({ uniqueId });
    if (!existing) {
      isUnique = true;
    }
  }

  if (!isUnique) {
    throw new Error("Failed to generate a unique 6-character ID. Please try again.");
  }

  return uniqueId;
}
