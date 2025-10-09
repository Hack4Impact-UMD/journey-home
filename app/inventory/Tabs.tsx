// inventory/Tabs.tsx
import React from "react";

export function Tabs({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (val: string) => void;
}) {
  const tabs = [
    "Warehouse",
    "Donation requests",
    "Approved donations",
    "Denied donations",
  ];

  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-cyan-500 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-cyan-500"
                : "text-gray-600 hover:text-cyan-500"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
