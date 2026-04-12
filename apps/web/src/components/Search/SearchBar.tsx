"use client";

import { t, Messages } from "@/lib/internationalisation/i18n-helpers";
import { Input } from "@/components/Shared/Input";
import { useState, FormEvent, useEffect, useCallback } from "react";

interface SearchBarProps {
  messages: Messages;
  onSearch: (query: string) => void;
}

export default function SearchBar({ messages, onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const performSearch = useCallback(
    (query: string) => {
      onSearch(query.trim());
    },
    [onSearch],
  );

  useEffect(() => {
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
    <form onSubmit={handleManualSearch} className="mx-4.5">
      <Input
        placeholder={t("search_placeholder", messages)}
        type={"text"}
        frontImageURL="/Icons/SearchIcon.svg"
        backImageURL="/Icons/Cross.svg"
        onClickBackImage={() => {
          handleInputChange("");
          if (searchQuery.trim() !== "") onSearch("");
        }}
        value={searchQuery}
        onChange={handleInputChange}
      />
    </form>
  );
}
