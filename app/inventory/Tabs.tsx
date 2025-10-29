"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

export function Tabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Warehouse", path: "/inventory" },
    { name: "Donation requests", path: "/inventory/donation-requests" },
    { name: "Approved donations", path: "/inventory/approved-donations" },
    { name: "Denied donations", path: "/inventory/denied-donations" },
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.path)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-cyan-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-cyan-500"
                : "text-gray-600 hover:text-cyan-500"
            }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}