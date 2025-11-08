// app/warehouse/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Timestamp } from "firebase/firestore";
import { setInventoryRecord } from "@/lib/services/inventory";
import type { InventoryRecord } from "@/types/inventory";

export default function AddItemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const record: InventoryRecord = {
      id: crypto.randomUUID(),
      name: name.trim(),
      photos: [],            // wire your uploader later
      category,
      size,
      quantity,
      notes: notes.trim() || "N/A",
      donorEmail: null,
      dateAdded: Timestamp.now(),
    };

    await setInventoryRecord(record);     // <-- write to Firestore
    router.push("/warehouse");            // back to list
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Add Item</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Short description (1–3 words)</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Category *</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="" disabled>Select</option>
              <option value="Couches">Couches</option>
              <option value="Chairs">Chairs</option>
              <option value="Tables">Tables</option>
              {/* add the rest */}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Quantity *</label>
            <input
              type="number"
              min={1}
              className="w-full border rounded-md px-3 py-2"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value || "1", 10))}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Size *</label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            >
              <option value="" disabled>Select</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <input
              className="w-full border rounded-md px-3 py-2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* photo uploader can go here later */}

        <button
          type="submit"
          className="w-full rounded-md px-4 py-3 bg-sky-600 text-white hover:bg-sky-700"
        >
          Add Item
        </button>
      </form>
    </div>
  );
}
