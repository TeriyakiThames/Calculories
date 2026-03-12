import { loadMessages, t } from "@/lib/i18n";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: "en" | "th" }>;
}) {
  const { locale } = await params;

  const messages = loadMessages(locale, ["common", "home"]);

  return (
    <main>
      <LocaleSwitcher locale={locale} />
      <h1 className="text-xl">{t("home.title", messages)}</h1>
      <p className="text-l">{t("home.subtitle", messages)}</p>

      <a className="text-blue-700" href={`/${locale}/test-login`}>
        {t("home.login", messages)}
      </a>
    </main>
  );
}
