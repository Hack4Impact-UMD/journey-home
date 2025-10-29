"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/inventory", label: "Inventory" },
  { href: "/donation-requests", label: "Donation Requests" },
  { href: "/reviewed-donations", label: "Reviewed Donations" },
  { href: "/donated", label: "Donated" },
];

export default function HeaderTabs() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <nav className="mx-auto max-w-[1200px] px-4 flex gap-6 py-3 text-sm">
        {TABS.map(({ href, label }) => {
          const active =
            pathname === href || (href !== "/" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "text-foreground font-medium"
                  : "text-foreground/60 hover:text-foreground"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
