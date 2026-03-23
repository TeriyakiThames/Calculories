"use client";

import { t, Messages } from "@/lib/internationalisation/i18n-helpers";
import { Input } from "@/components/Shared/Input";
import { useState, FormEvent, useEffect, useCallback } from "react";

interface SearchBarProps {
  messages: Messages;
}

export default function SearchBar({ messages }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = useCallback((query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    console.log("Executing search for:", trimmedQuery);
    // TODO: Call backend API here
  }, []);

  useEffect(() => {
    if (!searchQuery) return;

    const delayDebounceFn = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, performSearch]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleManualSearch = (e: FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  return (
    <>
      <h2 className="mt-6 pb-3 text-center text-xs text-[#8E8E93]">
        {t("search_prompt", messages)}
      </h2>

      <form onSubmit={handleManualSearch} className="mx-4.5">
        <Input
          placeholder={t("search_placeholder", messages)}
          type={"text"}
          frontImageURL="/Icons/SearchIcon.svg"
          value={searchQuery}
          onChange={handleInputChange}
        />
      </form>
    </>
  );
}
