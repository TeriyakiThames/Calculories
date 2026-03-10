import fs from "fs";
import path from "path";

// A map of translation keys to localized message strings.
export type Messages = Record<string, string>;

// Loads and merges translation messages for a given locale and list of namespaces.
// Merges all namespace files into a single messages object
// Later namespaces overwrite earlier keys if duplicates exist!
export function loadMessages(
  locale: "en" | "th",
  namespaces: string[] = ["common"],
): Messages {
  return namespaces.reduce<Messages>((acc, ns) => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "locales",
      locale,
      `${ns}.json`,
    );

    const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return { ...acc, ...json };
  }, {});
}

// Simple translation helper that returns the localized message for a given key, or falls back to the key itself if not found.
export function t(key: string, messages: Messages) {
  return messages[key] ?? key;
}
