import { redirect } from "next/navigation";
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from "unique-names-generator";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * Generates a unique name based on a UUID
 * @param uuid - A UUID string to use as a seed for name generation
 * @returns A unique name in the format "adjective-color-animal"
 */
export function generateUniqueNameFromUUID(uuid: string): string {
  // Use the UUID as a seed for consistent name generation
  const config = {
    dictionaries: [adjectives, colors, animals],
    separator: " ",
    length: 2,
    seed: uuid,
  };

  return uniqueNamesGenerator(config);
}

/**
 * Generates an emoji based on the input text
 * @param text - The text to generate an emoji from
 * @returns An emoji character, defaulting to 🧙 if no suitable emoji is found
 */
export function generateEmojiFromText(text: string = ""): string {
  const charSum = text
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const index = charSum % 13;

  const wowEmojis = [
    "🧙‍♂️",
    "🧙‍♀️",
    "🗡️",
    "⚔️",
    "🏹",
    "🛡️",
    "⚡",
    "🔥",
    "❄️",
    "🔮",
    "🏰",
    "🐉",
  ];

  return wowEmojis[index] || "🧙";
}
