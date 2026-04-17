import Image from "next/image";
import { t, Messages } from "@/lib/internationalisation/i18n-helpers";

export default function LoginHeader({ messages }: { messages: Messages }) {
  return (
    <>
      <Image
        src="/CalculoriesLogo.svg"
        width={120}
        height={120}
        alt={"Calculories Logo"}
        className="mx-auto mt-20 mb-9.25 block rounded-full"
        unoptimized
      />

      <div className="flex flex-col gap-4.5 text-center font-bold">
        <header>
          <p className="text-green-100">CALCULORIES</p>
          <h1 className="text-text mt-2 text-[36px] leading-10">
            {t("tagline1", messages)}
            <br />
            <span className="text-green-100">{t("tagline2", messages)}</span>
          </h1>
        </header>

        <h2 className="text-grey-60 text-lg">{t("tagline3", messages)}</h2>
      </div>
    </>
  );
}
