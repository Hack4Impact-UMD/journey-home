// components/icons/TrashIcon.tsx
"use client";

import { useState, MouseEvent } from "react";
import { deleteInventoryRecord } from "@/lib/services/inventory";

type TrashIconProps = {
  id: string;
  onDeleted?: (id: string) => void;
  confirm?: boolean;
  className?: string;
};

export function TrashIcon({
  id,
  onDeleted,
  confirm = true,
  className = "",
}: TrashIconProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;

    if (confirm) {
      const ok = window.confirm("Delete this item? This cannot be undone.");
      if (!ok) return;
    }

    try {
      setBusy(true);
      // actually delete from Firestore
      await deleteInventoryRecord(id);
      // tell parent which item was deleted
      onDeleted?.(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete item. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Delete item"
      disabled={busy}
      className="p-0 bg-transparent border-0 cursor-pointer disabled:opacity-50 group"
      title="Delete item"
    >
      <svg
        width="2em"
        height="2em"
        viewBox="0 0 32 32"
        className={`fill-gray-400 group-hover:fill-red-400 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12.6068 8.67654H12.4282C12.5264 8.67654 12.6068 8.59618 12.6068 8.49797V8.67654H19.3925V8.49797C19.3925 8.59618 19.4729 8.67654 19.5711 8.67654H19.3925V10.2837H20.9997V8.49797C20.9997 7.71002 20.359 7.06939 19.5711 7.06939H12.4282C11.6403 7.06939 10.9997 7.71002 10.9997 8.49797V10.2837H12.6068V8.67654ZM23.8568 10.2837H8.14251C7.74742 10.2837 7.42822 10.6029 7.42822 10.998V11.7123C7.42822 11.8105 7.50858 11.8908 7.60679 11.8908H8.95501L9.50635 23.5649C9.54206 24.3261 10.1715 24.9265 10.9327 24.9265H21.0666C21.83 24.9265 22.4572 24.3283 22.493 23.5649L23.0443 11.8908H24.3925C24.4907 11.8908 24.5711 11.8105 24.5711 11.7123V10.998C24.5711 10.6029 24.2519 10.2837 23.8568 10.2837ZM20.8947 23.3194H11.1046L10.5644 11.8908H21.4349L20.8947 23.3194Z" />
      </svg>
    </button>
  );
}
