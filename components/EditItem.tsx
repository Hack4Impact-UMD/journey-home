"use client";

import { useEffect, useState } from "react";
import type { InventoryRecord } from "@/types/inventory";
import { setInventoryRecord } from "@/lib/services/inventory"; 

interface EditItemProps {
  item: InventoryRecord | null;
  isOpen: boolean;
  onClose: () => void;
}
const EditItem: React.FC<EditItemProps> = ({ item, isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState<"Small" | "Medium" | "Large" | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");
  useEffect(() => {
    if (!item) return;
    setName(item.name ?? "");
    setCategory(item.category ?? "");
    setSize((item.size as "Small" | "Medium" | "Large") ?? "");
    setQuantity(item.quantity ?? 1);
    setNotes(item.notes ?? "");
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const updated: InventoryRecord = {
      ...item,
      name: name.trim(),
      category,
      size: size as "Small" | "Medium" | "Large",
      quantity,
      notes: notes.trim() || "N/A",
    };

    await setInventoryRecord(updated);
    onClose();
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 w-screen z-50 flex items-center justify-center">
          <div className="bg-white w-screen h-screen p-[1.5em] rounded-[.5em] relative shadow-lg pl-[25em] pr-[25em]">
            <button
              onClick={onClose}
              className="absolute top-[1em] right-[1em] text-gray-400 hover:text-gray-600 text-[1.25em] font-bold"
              aria-label="Close edit dialog"
            >
              X
            </button>

            <h2 className="text-[2em] font-bold mt-[1em] mb-[1em]">Edit Item</h2>

            <form className="space-y-[1em]" onSubmit={onSubmit}>
              <div>
                <label className="block text-sm font-medium">Short description (1-3 words)</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black-600">
                  <span className="text-red-500">*</span> Category
                </label>
                <select
                  className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  <option>Sofa</option>
                  <option>Chair</option>
                  <option>Table</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black-600">
                    <span className="text-red-500">*</span> Size
                  </label>
                  <select
                    className="mt-1 w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={size}
                    onChange={(e) => setSize(e.target.value as "Small" | "Medium" | "Large")}
                    required
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-black-600">
                    <span className="text-red-500">*</span> Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={Number.isFinite(quantity) ? quantity : 0}
                    onChange={(e) => setQuantity(parseInt(e.target.value || "0", 10))}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Notes</label>
                <textarea
                  className="mt-[.25em] w-full border border-gray-300 rounded px-[.75em] py-[.5em] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-[1em]">
                <div className="w-[8em] h-[8em] bg-gray-100 rounded flex items-center justify-center cursor-pointer">
                  <span>Add a photo +</span>
                </div>
              </div>

              <button
                type="submit"
                className="mt-[1em] h-[4em] w-full bg-primary text-white px-[1em] py-[.5em] rounded hover:bg-cyan-600"
              >
                Edit Item
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditItem;
