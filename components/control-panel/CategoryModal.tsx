"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CategoryAttributes } from "@/types/inventory";
import { CloseIcon } from "@/components/icons/CloseIcon";
import Button from "@/components/form/Button";
import { toast } from "sonner";

type Props = {
  category: CategoryAttributes | null;
  categories: CategoryAttributes[];
  setCategoriesWithToast: (cats: CategoryAttributes[]) => Promise<void>;
  onClose: () => void;
};

export function CategoryModal({
  category,
  categories,
  setCategoriesWithToast,
  onClose,
}: Props) {
  const isEdit = category !== null;

  const [name, setName] = useState("");
  const [min, setMin] = useState(0);
  const [mid, setMid] = useState(0);
  const [error, setError] = useState("");

  const sectionWidth = 100 / 3;

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
      setError("Min must be less than Mid");
      return false;
    }

    setError("");
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    if (!isEdit && categories.some((c) => c.name === name)) {
      toast.error("Category name already exists");
      return;
    }

    let updated: CategoryAttributes[];

    if (isEdit && category) {
      updated = categories.map((cat) =>
        cat.name === category.name
          ? { ...cat, name, lowThreshold: min, highThreshold: mid }
          : cat
      );
    } else {
      updated = [
        ...categories,
        { name, lowThreshold: min, highThreshold: mid },
      ];
    }

    await setCategoriesWithToast(updated);

    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-140 p-8 shadow-lg relative">

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
          className="border border-gray-300 w-full px-3 py-2 mb-6 rounded"
          placeholder="Add"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="flex gap-8 mb-6">

          <div>
            <label className="text-gray-600 text-sm block mb-1">
              Min
            </label>

            <input
              type="number"
              min="0"
              placeholder="< Amt"
              className="border border-red-400 px-3 py-2 w-25 rounded"
              value={min === 0 ? "" : min}
              onChange={(e) => setMin(Number(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm block mb-1">
              Mid
            </label>

            <input
              type="number"
              min="0"
              placeholder="< Amt"
              className="border border-yellow-400 px-3 py-2 w-25 rounded"
              value={mid === 0 ? "" : mid}
              onChange={(e) => setMid(Number(e.target.value) || 0)}
            />
          </div>

        </div>

        {/* threshold bar */}

        <div className="mb-8">
          <div className="flex h-1.5 rounded overflow-hidden">

            <div
              className="bg-red-400"
              style={{ width: `${sectionWidth}%` }}
            />

            <div
              className="bg-yellow-400"
              style={{ width: `${sectionWidth}%` }}
            />

            <div
              className="bg-green-500"
              style={{ width: `${sectionWidth}%` }}
            />

          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <div className="mt-6">
          <Button className="px-6 py-2" onClick={save}>
            Save
          </Button>
        </div>

      </div>
    </div>,
    document.body
  );
}