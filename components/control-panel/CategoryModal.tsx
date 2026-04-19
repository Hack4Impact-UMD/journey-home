"use client";

import { useState, useMemo } from "react";
import { X, MagnifyingGlass } from "@phosphor-icons/react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { InventoryCategory } from "@/types/inventory";

const WEIGHT_SUFFIXES = ["", "Light", "Thin", "Regular", "Bold", "Fill", "Duotone"];

function isValidIcon(val: unknown): val is React.ComponentType<{ size?: number }> {
  if (!val) return false;
  if (typeof val === "function") return true;
  if (typeof val === "object" && val !== null && "render" in val) return true;
  return false;
}

function resolveIconName(base: string): string | null {
  for (const suffix of WEIGHT_SUFFIXES) {
    const key = base + suffix;
    if (isValidIcon((PhosphorIcons as Record<string, unknown>)[key])) return key;
  }
  return null;
}

const DEFAULT_ICON_BASES = [
  "Rug", "Armchair", "Coffee", "Bed", "PaintBrushHousehold",
  "Chair", "SprayBottle", "Desk", "Basket", "CookingPot",
  "ForkKnife", "ToiletPaper", "Dresser", "Television",
];

const DEFAULT_ICON_NAMES = DEFAULT_ICON_BASES
  .map(resolveIconName)
  .filter((x): x is string => x !== null);

interface CategoryModalProps {
  category: InventoryCategory | null;
  categories: InventoryCategory[];
  onSave: (cat: InventoryCategory) => Promise<void>;
  onClose: () => void;
}

export function CategoryModal({ category, categories, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [icon, setIcon] = useState<string>(
    category?.icon ?? resolveIconName("Dresser") ?? DEFAULT_ICON_NAMES[0] ?? "Package"
  );
  const [lowThreshold, setLowThreshold] = useState(category?.lowThreshold ?? 0);
  const [highThreshold, setHighThreshold] = useState(category?.highThreshold ?? 0);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const sliderMax = 50;

  const iconRecord = PhosphorIcons as Record<string, unknown>;
  const IconComponent = isValidIcon(iconRecord[icon])
    ? (iconRecord[icon] as React.ComponentType<{ size?: number }>)
    : PhosphorIcons.Package;

  const allIconNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const key of Object.keys(PhosphorIcons)) {
      const val = (PhosphorIcons as Record<string, unknown>)[key];
      if (!isValidIcon(val) || key === "createIcon" || key === "IconContext") continue;
      const base = key
        .replace(/(Thin|Light|Regular|Bold|Fill|Duotone)$/, "")
        .replace(/Icon$/, "");
      if (!map.has(base) || key === base || key.replace(/Icon$/, "") === base) {
        map.set(base, key);
      }
    }
    return Array.from(map.values());
  }, []);

  const displayedIcons = useMemo(() => {
    if (!iconSearch.trim()) return DEFAULT_ICON_NAMES;
    const q = iconSearch.toLowerCase();
    return allIconNames
      .filter((key) => {
        const base = key
          .replace(/(Thin|Light|Regular|Bold|Fill|Duotone)$/, "")
          .replace(/Icon$/, "");
        return base.toLowerCase().includes(q);
      })
      .slice(0, 40);
  }, [iconSearch, allIconNames]);

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      id: category?.id || crypto.randomUUID(),
      name: name.trim(),
      icon,
      quantity: category?.quantity ?? 0,
      lowThreshold,
      highThreshold,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative flex items-stretch gap-4">

        {showIconPicker && (
          <div className="bg-white rounded-xl shadow-xl w-[340px] p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-base">Select an icon</span>
              <button
                onClick={() => setShowIconPicker(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2 border border-light-border rounded-md px-3 py-1.5 mb-4">
              <MagnifyingGlass size={16} className="text-gray-400" />
              <input
                className="flex-1 text-sm outline-none bg-transparent"
                placeholder="Search"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 content-start">
              {displayedIcons.map((iconName) => {
                const val = (PhosphorIcons as Record<string, unknown>)[iconName];
                if (!isValidIcon(val)) return null;
                const Icon = val as React.ComponentType<{ size?: number }>;
                return (
                  <button
                    key={iconName}
                    onClick={() => { setIcon(iconName); setShowIconPicker(false); }}
                    className={[
                      "flex items-center justify-center w-full aspect-square rounded-md border transition-colors",
                      icon === iconName
                        ? "border-primary bg-primary/10"
                        : "border-light-border hover:border-primary hover:bg-blue-50",
                    ].join(" ")}
                    title={iconName
                      .replace(/(Thin|Light|Regular|Bold|Fill|Duotone)$/, "")
                      .replace(/Icon$/, "")}
                  >
                    <Icon size={24} />
                  </button>
                );
              })}
              {displayedIcons.length === 0 && (
                <div className="col-span-5 text-center text-sm text-gray-400 py-6">
                  No icons found.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-xl w-[480px] p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>

          <h2 className="text-xl font-bold text-text-1 mb-6">
            {category ? "Edit item category" : "New item category"}
          </h2>

          <label className="block text-sm font-medium text-text-1 mb-1">Item name</label>
          <input
            className="w-full border border-light-border rounded-md px-3 py-2 text-sm mb-5 outline-none focus:border-primary"
            placeholder="Add"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="block text-sm font-medium text-text-1 mb-2">Icon</label>
          <button
            onClick={() => setShowIconPicker((v) => !v)}
            className={[
              "w-14 h-14 flex items-center justify-center border rounded-md transition-colors mb-5",
              showIconPicker
                ? "border-primary bg-primary/10"
                : "border-light-border hover:border-primary hover:bg-blue-50",
            ].join(" ")}
          >
            <IconComponent size={28} />
          </button>

          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text-1 mb-1">Very low</label>
              <input
                type="number"
                className="w-28 border border-red-300 rounded-md px-3 py-2 text-sm outline-none focus:border-red-400"
                placeholder="< Amt"
                value={lowThreshold || ""}
                onChange={(e) => setLowThreshold(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-1 mb-1">low</label>
              <input
                type="number"
                className="w-28 border border-yellow-300 rounded-md px-3 py-2 text-sm outline-none focus:border-yellow-400"
                placeholder="< Amt"
                value={highThreshold || ""}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="relative mb-6">
            <div className="relative w-full h-5 mb-1">
              <span
                className="absolute -translate-x-1/2 bg-gray-700 text-white text-xs rounded-full px-1.5 py-0.5"
                style={{ left: `${Math.min((lowThreshold / sliderMax) * 100, 100)}%` }}
              >
                {lowThreshold}
              </span>
              {highThreshold > 0 && (
                <span
                  className="absolute -translate-x-1/2 bg-gray-700 text-white text-xs rounded-full px-1.5 py-0.5"
                  style={{ left: `${Math.min((highThreshold / sliderMax) * 100, 100)}%` }}
                >
                  {highThreshold}
                </span>
              )}
            </div>
            <div className="relative h-2 rounded-full overflow-hidden bg-gray-100">
              <div
                className="absolute inset-y-0 left-0 bg-red-400"
                style={{ width: `${Math.min((lowThreshold / sliderMax) * 100, 100)}%` }}
              />
              <div
                className="absolute inset-y-0 bg-yellow-400"
                style={{
                  left: `${Math.min((lowThreshold / sliderMax) * 100, 100)}%`,
                  width: `${Math.min(((highThreshold - lowThreshold) / sliderMax) * 100, 100)}%`,
                }}
              />
              <div
                className="absolute inset-y-0 right-0 bg-green-400"
                style={{ left: `${Math.min((highThreshold / sliderMax) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Very low</span>
              <span>Low</span>
              <span>Good</span>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="bg-primary text-white text-sm px-5 py-2 rounded-md disabled:opacity-50 cursor-pointer hover:bg-primary/90"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}