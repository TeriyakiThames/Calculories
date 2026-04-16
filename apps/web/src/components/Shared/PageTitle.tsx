"use client";

import { Messages } from "@calculories/shared-types";
import { t } from "@/lib/internationalisation/i18n-helpers";
import BackButton from "@/components/Shared/BackButton";

interface PageTitleProps {
  text?: string;
  messages: Messages;
  titleOnly?: boolean;
  backHref?: string;
}

export default function PageTitle({
  text = "Title",
  messages,
  titleOnly,
  backHref,
}: PageTitleProps) {
  return (
    <div className="mb-12.5 flex w-full items-center justify-between pt-7.5">
      <BackButton
        href={backHref}
        containerClassName={`w-14.5 ${!titleOnly ? "invisible" : ""}`}
      />

      <h1 className="text-grey-100 text-center text-xl font-bold">
        {t(text, messages)}
      </h1>

      <BackButton containerClassName="w-14.5 invisible" />
    </div>
  );
}
