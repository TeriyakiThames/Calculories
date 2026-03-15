import "server-only";
import fs from "fs";
import path from "path";
import { Messages } from "./i18n-helpers";

export function loadMessages(
  locale: "en" | "th",
  namespaces: string[] = [],
  subDir: string = "",
): Messages {
  return namespaces.reduce<Messages>((acc, ns) => {
    const filePath = path.join(
      process.cwd(),
      "src",
      "locales",
      locale,
      subDir,
      `${ns}.json`,
    );

    try {
      if (fs.existsSync(filePath)) {
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        return { ...acc, ...json };
      } else {
        console.warn(`[i18n] Missing translation file: ${filePath}`);
        return acc;
      }
    } catch (error) {
      console.error(`[i18n] Error reading or parsing file: ${filePath}`, error);
      return acc;
    }
  }, {});
}
