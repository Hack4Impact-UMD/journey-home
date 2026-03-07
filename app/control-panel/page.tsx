"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { useState, useEffect } from "react";
import { useCategories } from "@/lib/queries/categories";
import { CategoryAttributes } from "@/types/inventory";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { EditIcon } from "@/components/icons/EditIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import Button from "@/components/form/Button";
import { toast } from "sonner";

export default function ControlPanelPage() {
    const { allAttrs, isLoading, setCategoriesWithToast } = useCategories();

    const [search, setSearch] = useState("");

    const [categories, setCategories] = useState<CategoryAttributes[]>([]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState<CategoryAttributes | null>(null);

    const [originalName, setOriginalName] = useState("");

    const [newCategoryName, setNewCategoryName] = useState("");

    const [min, setMin] = useState(3);
    const [mid, setMid] = useState(10);
    const [max, setMax] = useState(21);

    useEffect(() => {
        setCategories(allAttrs ?? []);
    }, [allAttrs]);

    if (isLoading) return null;

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const validateAddThresholds = () => {
        if (!(min < mid)) {
            alert("Very low must be less than Low.");
            return false;
        }

        return true;
    };

    const validateEditThresholds = () => {
        if (!(min < mid && mid < max)) {
            alert("Min must be less than Mid & Mid must be less than Max.");
            return false;
        }

        return true;
    };

    // reset add modal
    const resetAddModal = () => {
        setNewCategoryName("");
        setMin(0);
        setMid(0);
        setMax(21);
    };

    // open add modal
    const openAddModal = () => {
        resetAddModal();
        setShowAddModal(true);
    };

    // close add modal
    const closeAddModal = () => {
        resetAddModal();
        setShowAddModal(false);
    };

    // save new category
    const saveNewCategory = async () => {
        if (!newCategoryName) return;

        if (!validateAddThresholds()) return;
        if (categories.some((c) => c.name === newCategoryName)) {
            toast.error("Category name already exists");
            return;
        }

        const newCategory: CategoryAttributes = {
            name: newCategoryName,
            lowThreshold: min,
            highThreshold: mid,
        };

        const updated = [...categories, newCategory];

        setCategories(updated);

        await setCategoriesWithToast(updated);

        setShowAddModal(false);

        resetAddModal();
    };

    // save edit
    const saveEdit = async () => {
        if (!selectedCategory) return;

        if (!validateEditThresholds()) return;

        const updated = categories.map((cat) =>
            cat.name === originalName
                ? {
                      ...cat,
                      name: selectedCategory.name,
                      lowThreshold: min,
                      highThreshold: mid,
                      min,
                      mid,
                      max,
                  }
                : cat
        );

        setCategories(updated);

        await setCategoriesWithToast(updated);

        setShowEditModal(false);
    };

    // delete category
    const deleteCategory = async (name: string) => {
        const updated = categories.filter((cat) => cat.name !== name);

        setCategories(updated);

        await setCategoriesWithToast(updated);
    };

    const safeMax = max || 1;

    // bar width calculations
    const redWidth = (min / safeMax) * 100;
    const yellowWidth = ((mid - min) / safeMax) * 100;
    const greenWidth = ((safeMax - mid) / safeMax) * 100;

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />

                <div className="flex flex-1 bg-[#F3F4F6]">
                    {/* sidebar */}

                    <div className="bg-white border-r border-gray-200 w-62.5 shrink-0">
                        <SideNavbar />
                    </div>

                    {/* main content */}

                    <div className="flex flex-1 p-8 gap-8">
                        <div className="flex-1">
                            <h1 className="text-[28px] font-bold text-primary mb-6">
                                Control panel
                            </h1>

                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                                {/* search + add */}

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex border border-gray-300 h-8.5">
                                        <input
                                            className="px-2 text-sm w-60 outline-none"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                        />

                                        <div className="flex items-center justify-center w-9 border-l border-gray-300 text-gray-500">
                                            <SearchIcon />
                                        </div>
                                    </div>

                                    <Button
                                        className="px-3! py-1! text-sm! h-8.5!"
                                        onClick={openAddModal}
                                    >
                                        + Add
                                    </Button>
                                </div>

                                {/* table header */}

                                <div className="grid grid-cols-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 border border-gray-200">
                                    <span>Items</span>
                                    <span className="text-right">Actions</span>
                                </div>

                                {/* rows */}

                                <div className="border-l border-r border-b border-gray-200">
                                    {filteredCategories.map(
                                        (category, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-2 px-6 py-3 border-b border-gray-200 items-center hover:bg-gray-50"
                                            >
                                                <span className="text-[14px] text-gray-800">
                                                    {category.name}
                                                </span>

                                                <div className="flex justify-end gap-5 text-gray-400">
                                                    <button
                                                        aria-label="Edit category"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                category
                                                            );

                                                            setOriginalName(
                                                                category.name
                                                            );

                                                            setMin(
                                                                category.lowThreshold ??
                                                                    0
                                                            );
                                                            setMid(
                                                                category.highThreshold ??
                                                                    0
                                                            );
                                                            setMax(21);

                                                            setShowEditModal(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <EditIcon />
                                                    </button>

                                                    <button
                                                        aria-label="Delete category"
                                                        onClick={() =>
                                                            deleteCategory(
                                                                category.name
                                                            )
                                                        }
                                                    >
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* stock bar */}
                        <div className="w-[320px]" />
                    </div>
                </div>

                {/* add modal */}

                {showAddModal && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-140 p-8 shadow-lg relative">
                            {/* close modal */}

                            <button
                                aria-label="Close modal"
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
                                onClick={closeAddModal}
                            >
                                <CloseIcon />
                            </button>

                            <h2 className="text-[24px] font-semibold mb-6">
                                New category
                            </h2>

                            <label className="text-gray-600 text-sm block mb-2">
                                Inventory item
                            </label>

                            <input
                                className="border border-gray-300 w-full px-3 py-2 mb-6 rounded"
                                placeholder="Name"
                                value={newCategoryName}
                                onChange={(e) =>
                                    setNewCategoryName(e.target.value)
                                }
                            />

                            <div className="flex gap-8 mb-6">
                                <div>
                                    <label className="text-gray-600 text-sm block mb-1">
                                        Very low
                                    </label>

                                    <input
                                        className="border border-red-400 px-3 py-2 w-25 rounded"
                                        placeholder="Num"
                                        value={min === 0 ? "" : min}
                                        onChange={(e) =>
                                            setMin(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-gray-600 text-sm block mb-1">
                                        Low
                                    </label>

                                    <input
                                        className="border border-yellow-400 px-3 py-2 w-25 rounded"
                                        placeholder="Num"
                                        value={mid === 0 ? "" : mid}
                                        onChange={(e) =>
                                            setMid(Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>

                            {/* threshold bar */}

                            <div className="mb-8">
                                <div className="flex h-1.5 rounded overflow-hidden">
                                    <div
                                        className="bg-red-400"
                                        style={{ width: `${redWidth}%` }}
                                    />

                                    <div
                                        className="bg-yellow-400"
                                        style={{ width: `${yellowWidth}%` }}
                                    />

                                    <div
                                        className="bg-green-500"
                                        style={{ width: `${greenWidth}%` }}
                                    />
                                </div>
                            </div>

                            <Button onClick={saveNewCategory}>Save</Button>
                        </div>
                    </div>
                )}

                {/* edit modal */}

                {showEditModal && selectedCategory && (
                    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl w-130 p-8 shadow-lg relative">
                            <button
                                type="button"
                                aria-label="Close modal"
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowEditModal(false)}
                            >
                                <CloseIcon />
                            </button>

                            <h2 className="text-xl font-semibold mb-5">
                                Edit category
                            </h2>

                            <label className="text-sm text-gray-600 block mb-2">
                                Inventory item
                            </label>

                            <input
                                className="border border-gray-300 w-full px-3 py-2 mb-6"
                                value={selectedCategory.name}
                                onChange={(e) =>
                                    setSelectedCategory({
                                        ...selectedCategory,
                                        name: e.target.value,
                                    })
                                }
                            />

                            <div className="flex gap-5 mb-6">
                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">
                                        Min
                                    </label>

                                    <input
                                        className="border border-gray-300 px-3 py-2 w-20"
                                        value={min}
                                        onChange={(e) =>
                                            setMin(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">
                                        Mid
                                    </label>

                                    <input
                                        className="border border-gray-300 px-3 py-2 w-20"
                                        value={mid}
                                        onChange={(e) =>
                                            setMid(Number(e.target.value))
                                        }
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-600 block mb-1">
                                        Max
                                    </label>

                                    <input
                                        className="border border-gray-300 px-3 py-2 w-20"
                                        value={max}
                                        onChange={(e) =>
                                            setMax(Number(e.target.value))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex h-1.5 rounded overflow-hidden">
                                    <div
                                        className="bg-red-400"
                                        style={{ width: `${redWidth}%` }}
                                    />

                                    <div
                                        className="bg-yellow-400"
                                        style={{ width: `${yellowWidth}%` }}
                                    />

                                    <div
                                        className="bg-green-500"
                                        style={{ width: `${greenWidth}%` }}
                                    />
                                </div>
                            </div>

                            <Button onClick={saveEdit}>Save</Button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}
