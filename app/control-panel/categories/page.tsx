"use client";

import { useState } from "react";
import { useCategories } from "@/lib/queries/categories";
import { CategoryAttributes } from "@/types/inventory";
import { EditIcon } from "@/components/icons/EditIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import Button from "@/components/form/Button";
import { SearchBox } from "@/components/inventory/SearchBox";
import { CategoryModal } from "@/components/control-panel/CategoryModal";

export default function CategoriesPage() {
  const { allAttrs: categories, isLoading, setCategoriesWithToast } =
    useCategories();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryAttributes | null>(null);

  if (isLoading) return null;

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const deleteCategory = async (name: string) => {
    const updated = categories.filter((cat) => cat.name !== name);
    await setCategoriesWithToast(updated);
  };

  return (
    <div className="flex gap-8">

      {/* LEFT: categories section */}

      <div className="flex-1">

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          {/* search + add */}

          <div className="flex items-center gap-4 mb-6">

            <SearchBox
              value={search}
              onChange={setSearch}
              onSubmit={() => {}}
            />

            <Button
              className="px-3! py-1! text-sm! h-8.5!"
              onClick={() => {
                setSelectedCategory(null);
                setShowModal(true);
              }}
            >
              + Add
            </Button>

          </div>

          {/* table header */}

          <div className="grid grid-cols-[2fr_1.2fr_120px] px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200">
            <span>Items</span>
            <span>Stock Thresholds</span>
            <span className="text-right">Actions</span>
          </div>

          {/* rows */}

          <div className="border-l border-r border-b border-gray-200">

            {filteredCategories.map((category) => (

              <div
                key={category.name}
                className="grid grid-cols-[2fr_1.2fr_120px] px-6 py-3 border-b border-gray-200 items-center hover:bg-gray-50"
              >

                {/* item name */}

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
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowModal(true);
                    }}
                  >
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => deleteCategory(category.name)}
                  >
                    <TrashIcon />
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

      {/* blank right sidebar */}

      <div className="w-[320px]" />

      {/* modal */}

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          categories={categories}
          setCategoriesWithToast={setCategoriesWithToast}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}