import { Button } from "@/components/Shared/Button";
import PageTitle from "@/components/Shared/PageTitle";
import { loadMessages } from "@/lib/internationalisation/i18n";
import { Locale, Messages } from "@calculories/shared-types";
import Link from "next/link";
import Image from "next/image";
import { t } from "@/lib/internationalisation/i18n-helpers";
import AuthButton from "@/components/Shared/AuthButton";
import { MockAPI } from "@/mocks/mockAPI";
import createClient from "@/lib/supabase/server";
import PageBottom from "@/components/Shared/PageBottom";

interface SettingsButtonProps {
  label: string;
  messages: Messages;
  link: string;
  locale: Locale;
}

function SettingsButton({
  label,
  messages,
  link,
  locale,
}: SettingsButtonProps) {
  return (
    <Link href={`/${locale}${link}`} className="block w-full">
      <Button className="text-grey-100! bg-white! px-5! shadow-[0_0_2px_0_#00000040] active:bg-white! active:shadow-[0_0_2px_0_#4aae9b]">
        <div className="flex w-full items-center justify-between">
          <span>{t(label, messages)}</span>
          <Image
            src="/Icons/Dropdown.svg"
            alt="Dropdown Icon"
            width={24}
            height={24}
            className="rotate-270"
          />
        </div>
      </Button>
    </Link>
  );
}

export default async function Settings({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  let appUser = null;
  if (authUser) {
    appUser = await MockAPI.getUserProfile(authUser.id);
  }

  const name = authUser?.user_metadata?.name || appUser?.username || "User";
  const imageURL =
    authUser?.user_metadata?.avatar_url || "/Home/MockProfilePicture.svg";

  const settingsMessages = await loadMessages(locale, ["Settings"], "Settings");
  const sharedMessages = await loadMessages(locale, ["AuthButton"], "Shared");

  return (
    <main className="bg-background-10">
      <div className="px-5 pb-10">
        <PageTitle messages={settingsMessages} titleOnly={true} />

        <div className="mb-6 flex flex-col items-center gap-6">
          <Image
            src={imageURL}
            alt="Profile Picture"
            width={120}
            height={120}
            className="rounded-full"
          />
          <span className="text-grey-100 text-center text-3xl font-bold">
            {name}
          </span>
        </div>

        <nav className="flex flex-col gap-5">
          <SettingsButton
            label="Edit Profile"
            link="/settings/profile"
            locale={locale}
            messages={settingsMessages}
          />

          <div className="mt-6 flex flex-col gap-5">
            <span className="text-grey-60 text-xl font-bold">Settings</span>
            <SettingsButton
              label="Edit Dietary Restrictions"
              link="/settings/restrictions"
              locale={locale}
              messages={settingsMessages}
            />
            <SettingsButton
              label="Edit Goal"
              link="/settings/goal"
              locale={locale}
              messages={settingsMessages}
            />
            <SettingsButton
              label="Edit Language"
              link="/settings/language"
              locale={locale}
              messages={settingsMessages}
            />
            <AuthButton messages={sharedMessages} />
          </div>
        </nav>
      </div>

      <PageBottom />
    </main>
  );
}
