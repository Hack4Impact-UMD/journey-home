"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { InventoryCategory } from "@/types/inventory";
import { CloseIcon } from "@/components/icons/CloseIcon";

interface Props {
  category: InventoryCategory | null;
  categories: InventoryCategory[];
  onSave: (category: InventoryCategory) => Promise<void>;
  onClose: () => void;
}

export function CategoryModal({
  category,
  categories,
  onSave,
  onClose,
}: Props) {
  const isEdit = category !== null;

  const [name, setName] = useState("");
  const [min, setMin] = useState(0);
  const [mid, setMid] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setMin(category.lowThreshold ?? 0);
      setMid(category.highThreshold ?? 0);
    }
  }, [category]);

  const validate = () => {
    if (!name.trim()) {
      setError("Category name cannot be empty");
      return false;
    }

    if (min >= mid) {
      setError("Very Low Threshold must be less than Low Threshold");
      return false;
    }

    const duplicate = categories.some(
      (c) => c.name === name && c.id !== category?.id
    );
    if (duplicate) {
      setError("Category name already exists");
      return false;
    }

    setError("");
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    const updated: InventoryCategory = isEdit
      ? { ...category!, name, lowThreshold: min, highThreshold: mid }
      : { id: crypto.randomUUID(), name, quantity: 0, lowThreshold: min, highThreshold: mid };

    await onSave(updated);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-140 p-8 shadow-lg relative font-family-roboto">

        <button
          aria-label="Close modal"
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <h2 className="text-[24px] font-semibold mb-6">
          {isEdit ? "Edit category" : "New category"}
        </h2>

        <label className="text-gray-600 text-sm block mb-2">
          Inventory item
        </label>

        <input
          className="border border-[#D9D9D9] w-full px-3 py-2.5 mb-6 rounded-xs text-sm"
          placeholder="Add"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-8 mb-6">

          <div>
            <label className="text-gray-600 text-sm block mb-1">
              Very Low
            </label>

            <input
              type="number"
              min="0"
              placeholder="< Amt"
              className="border border-red-400 px-3 py-2.5 w-25 rounded-xs text-sm"
              value={min === 0 ? "" : min}
              onChange={(e) => setMin(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm block mb-1">
              Low
            </label>

            <input
              type="number"
              min="0"
              placeholder="< Amt"
              className="border border-yellow-400 px-3 py-2.5 w-25 rounded-xs text-sm"
              value={mid === 0 ? "" : mid}
              onChange={(e) => setMid(Number(e.target.value) || 0)}
            />
          </div>

        </div>

        {/* threshold bar */}

        <div className="relative mb-8 pt-7">

          <div className="absolute top-0 left-1/3 -translate-x-1/2 bg-[#505050] text-white text-xs px-2 h-5 flex items-center rounded-full">
            {min || 0}
          </div>

          <div className="absolute top-0 left-2/3 -translate-x-1/2 bg-[#505050] text-white text-xs px-2 h-5 flex items-center rounded-full">
            {mid || 0}
          </div>

          <div className="flex h-1.5 rounded overflow-hidden">
            <div className="w-1/3 bg-red-400" />
            <div className="w-1/3 bg-yellow-400" />
            <div className="w-1/3 bg-green-500" />
          </div>

          <div className="flex mt-2 text-xs text-[#BFBFBF]">
            <span className="w-1/3 text-center">Very low</span>
            <span className="w-1/3 text-center">Low</span>
            <span className="w-1/3 text-center">Good</span>
          </div>

        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="mt-6">
          <button
            className="bg-primary text-white text-sm px-6 py-2 rounded-xs cursor-pointer"
            onClick={save}
          >
            Save
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
