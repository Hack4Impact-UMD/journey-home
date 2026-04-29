"use client";

import { useState } from "react";
import { useInventoryCategories } from "@/lib/queries/inventory";
import { useAuth } from "@/contexts/AuthContext";
import { InventoryCategory } from "@/types/inventory";
import { Plus } from "lucide-react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { EditIcon } from "@/components/icons/EditIcon";
import { SearchBox } from "@/components/inventory/SearchBox";
import { Badge } from "@/components/inventory/Badge";
import { CategoryModal, DEFAULT_ICONS } from "@/components/control-panel/CategoryModal";

function isValidIcon(val: unknown): val is React.ComponentType<{ size?: number; strokeWidth?: number }> {
  if (!val) return false;
  if (typeof val === "function") return true;
  if (typeof val === "object" && val !== null && "render" in val) return true;
  return false;
}

export default function CategoriesPage() {
  const { state: { userData } } = useAuth();
  const { inventoryCategories, isLoading, setInventoryCategoryWithToast, refetch } =
    useInventoryCategories();

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<InventoryCategory | null>(null);

  const filteredCategories = inventoryCategories.filter((category) =>
    category.name.replace(/\s/g, "").toLowerCase().includes(
      search.trim().toLowerCase().replace(/\s/g, "")
    )
  );

  return (
    <>
      <div className="flex flex-wrap mb-6 gap-3">
        <SearchBox
          value={search}
          onChange={setSearch}
          onSubmit={() => refetch}
        />
        <button
          className="flex items-center gap-1 px-3 py-2 h-8 text-sm rounded-xs bg-primary text-white cursor-pointer"
          onClick={() => { setSelectedCategory(null); setShowModal(true); }}
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
          Loading categories...
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col">
          <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
            <span className="w-[58%] border-l-2 border-light-border px-4">Items</span>
            <span className="w-[34%] border-l-2 border-light-border px-4">Stock Thresholds</span>
            <span className="w-[8%] border-l-2 border-light-border px-4">Actions</span>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            {filteredCategories.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-sm text-[#A2A2A2]">
                No categories found.
              </div>
            ) : (
              filteredCategories.map((category) => {
                const iconRecord = PhosphorIcons as Record<string, unknown>;
                const iconVal = category.icon ? iconRecord[category.icon] : null;
                const IconComp = isValidIcon(iconVal)
                  ? (iconVal as React.ComponentType<{ size?: number; strokeWidth?: number }>)
                  : (DEFAULT_ICONS.find((d) => d.key === category.icon)?.Component ?? PhosphorIcons.Package);

                return (
                  <div
                    key={category.id}
                    className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
                    onClick={() => { setSelectedCategory(category); setShowModal(true); }}
                  >
                    <div className="w-[58%] px-4 flex items-center gap-2">
                      <IconComp size={18} strokeWidth={1.5} className="text-gray-500 shrink-0" />
                      {category.name}
                    </div>
                    <div className="w-[34%] px-4 flex gap-2">
                      <Badge text={`Very low: ${category.lowThreshold}`} color="red" />
                      <Badge text={`Low: ${category.highThreshold}`} color="yellow" />
                    </div>
                    <div className="w-[8%] px-4 flex gap-3 text-gray-400">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(category);
                          setShowModal(true);
                        }}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          categories={inventoryCategories}
          onSave={async (cat) => { await setInventoryCategoryWithToast(cat, userData!.uid); }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}