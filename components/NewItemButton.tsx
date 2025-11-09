"use client";

import type { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { setInventoryRecord } from "@/lib/services/inventory";
import { useState } from "react";

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 0 1 0-2h6V5z" fill="currentColor" />
    </svg>
  );
}

export default function NewItemButton({
  onCreated,
  onClick,
}: {
  onCreated?: (record: InventoryRecord) => void;
  onClick?: () => void;
}) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    const id =
      (typeof crypto !== "undefined" && "randomUUID" in crypto)
        ? crypto.randomUUID()
        : `item_${Date.now()}`;

    const newRecord: InventoryRecord = {
      id,
      name: "New item",
      photos: [],
      category: "Uncategorized",
      notes: "",
      quantity: 0,
      size: "Small",
      dateAdded: Timestamp.now(),
      donorEmail: null,
    };

    try {
      await setInventoryRecord(newRecord);
      onCreated?.(newRecord);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={[
        "w-[112px] h-[32px]",
        "inline-flex items-center justify-center gap-[10px]",
        "px-[14px] py-[8px]",
        "rounded-[2px]",
        "bg-[#02AFC7] text-white",
        "border border-[#1890FF]",
        "text-base font-medium",
        "cursor-pointer",
        "hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-[#1890FF]/60 disabled:opacity-60",
        "shadow-sm",
      ].join(" ")}

      aria-label="Add new item"
    >
      <span className="whitespace-nowrap">New item</span>
      <PlusIcon />
    </button>
  );
}
