import "server-only";
import fs from "fs/promises";
import path from "path";
import { cache } from "react";
import { Locale, Messages } from "@calculories/shared-types";

export const loadMessages = cache(
  async (
    locale: Locale,
    namespaces: string[] = [],
    subDir: string = "",
  ): Promise<Messages> => {
    const messagesArray = await Promise.all(
      namespaces.map(async (ns) => {
        const filePath = path.join(
          process.cwd(),
          "src",
          "locales",
          locale,
          subDir,
          `${ns}.json`,
        );

        try {
          const fileContents = await fs.readFile(filePath, "utf-8");
          return JSON.parse(fileContents);
        } catch (error: unknown) {
          if (
            error !== null &&
            typeof error === "object" &&
            "code" in error &&
            (error as { code: string }).code === "ENOENT"
          ) {
            console.warn(`[i18n] Missing translation file: ${filePath}`);
          } else {
            console.error(
              `[i18n] Error reading/parsing file: ${filePath}`,
              error,
            );
          }

          return {};
        }
      }),
    );

    return Object.assign({}, ...messagesArray);
  },
);
