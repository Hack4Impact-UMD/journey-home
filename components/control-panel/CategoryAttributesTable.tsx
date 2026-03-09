"use client";

import { CategoryAttributes } from "@/types/inventory";
import { EditIcon } from "@/components/icons/EditIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";

type Props = {
  categories: CategoryAttributes[];
  onEdit: (category: CategoryAttributes) => void;
  onDelete: (name: string) => void;
};

export function CategoryAttributesTable({
  categories,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* header */}

      <div className="grid grid-cols-3 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200">
        <span>Items</span>
        <span>Stock Thresholds</span>
        <span className="text-right">Actions</span>
      </div>

      <div className="border-l border-r border-b border-gray-200">
        {categories.map((category, index) => (
          <div
            key={index}
            className="grid grid-cols-3 px-6 py-3 border-b border-gray-200 items-center hover:bg-gray-50"
          >
            {/* name */}

            <span className="text-[14px] text-gray-800">
              {category.name}
            </span>

            {/* thresholds */}

            <div className="flex gap-2">
              <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded">
                Very low: {category.lowThreshold ?? 0}
              </span>

              <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded">
                Low: {category.highThreshold ?? 0}
              </span>
            </div>

            {/* actions */}

            <div className="flex justify-end gap-5 text-gray-400">
              <button
                aria-label="Edit category"
                onClick={() => onEdit(category)}
              >
                <EditIcon />
              </button>

              <button
                aria-label="Delete category"
                onClick={() => onDelete(category.name)}
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}