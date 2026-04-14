"use client";

import { t } from "@/lib/internationalisation/i18n-helpers";
import { Locale, Messages } from "@calculories/shared-types";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

interface NavBarProps {
  messages: Messages;
}

export default function NavBar({ messages }: NavBarProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = (params?.locale as Locale) || "en";

  const navLinks = [
    {
      label: t("home", messages),
      href: `/${locale}`,
      icon: <HomeIcon />,
    },
    {
      label: t("search", messages),
      href: `/${locale}/search`,
      icon: <SearchIcon />,
    },
    {
      label: t("history", messages),
      href: `/${locale}/history`,
      icon: <HistoryIcon />,
    },
    {
      label: t("settings", messages),
      href: `/${locale}/settings`,
      icon: <ProfileIcon />,
    },
  ];

  return (
    <nav className="border-grey-40 fixed right-0 bottom-0 left-0 z-40 mx-auto flex w-full max-w-105 items-center justify-between gap-10 border-t-[0.5px] bg-white px-7.5 py-2.5">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-green-100" : "text-grey-60 hover:text-green-100"
            }`}
          >
            {link.icon}
            <span className="text-sm leading-4 font-bold">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const HomeIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21 10.1503V17.9668C21 20.1943 19.2091 22 17 22H7C4.79086 22 3 20.1943 3 17.9668V10.1503C3 8.93937 3.53964 7.7925 4.46986 7.02652L9.46986 2.90935C10.9423 1.69689 13.0577 1.69688 14.5301 2.90935L19.5301 7.02652C20.4604 7.7925 21 8.93937 21 10.1503ZM10 17.25C9.58579 17.25 9.25 17.5858 9.25 18C9.25 18.4142 9.58579 18.75 10 18.75H14C14.4142 18.75 14.75 18.4142 14.75 18C14.75 17.5858 14.4142 17.25 14 17.25H10Z" />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.1719 17.3789C20.943 18.15 20.943 19.4008 20.1719 20.1719C19.4008 20.943 18.15 20.943 17.3789 20.1719L15.5068 18.2988C16.5968 17.5438 17.5438 16.5968 18.2988 15.5068L20.1719 17.3789ZM9.25 0C14.3586 0 18.5 4.14137 18.5 9.25C18.5 14.3586 14.3586 18.5 9.25 18.5C4.14137 18.5 0 14.3586 0 9.25C0 4.14137 4.14137 0 9.25 0ZM9.25 1.5C4.96979 1.5 1.5 4.96979 1.5 9.25C1.5 13.5302 4.96979 17 9.25 17C13.5302 17 17 13.5302 17 9.25C17 4.96979 13.5302 1.5 9.25 1.5Z" />
  </svg>
);

const HistoryIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM12 6v4.5m1.5 3L15 15" />
    <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10H2M8 18H2M6 15H2" />
  </svg>
);

const ProfileIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 13C9.76142 13 12 14.3431 12 16C12 17.6569 9.76142 19 7 19C4.23858 19 2 17.6569 2 16C2 14.3431 4.23858 13 7 13ZM22 16.25C22.4142 16.25 22.75 16.5858 22.75 17C22.75 17.4142 22.4142 17.75 22 17.75H16C15.5858 17.75 15.25 17.4142 15.25 17C15.25 16.5858 15.5858 16.25 16 16.25H22ZM22 11.25C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H14C13.5858 12.75 13.25 12.4142 13.25 12C13.25 11.5858 13.5858 11.25 14 11.25H22ZM7 5C8.65685 5 10 6.34315 10 8C10 9.65685 8.65685 11 7 11C5.34315 11 4 9.65685 4 8C4 6.34315 5.34315 5 7 5ZM22 6.25C22.4142 6.25 22.75 6.58579 22.75 7C22.75 7.41421 22.4142 7.75 22 7.75H14C13.5858 7.75 13.25 7.41421 13.25 7C13.25 6.58579 13.5858 6.25 14 6.25H22Z" />
  </svg>
);
