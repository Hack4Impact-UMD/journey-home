"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";
import { useEffect, useState } from "react";
import { useCategories } from "@/lib/queries/categories";
import { CategoryAttributes } from "@/types/inventory";
import FormInput from "@/components/form/FormInput";
import Button from "@/components/form/Button";
import { toast } from "sonner";

export default function ControlPanelPage() {
    const { allAttrs, setCategoriesWithToast, isLoading } = useCategories();

    const [categories, setCategories] = useState<CategoryAttributes[]>([]);

    useEffect(() => {
        setCategories(allAttrs);
    }, [allAttrs]);

    if (isLoading) {
        return (
            <ProtectedRoute allow={["Admin"]}>
                <div className="h-full w-full flex flex-col font-family-roboto">
                    <TopNavbar />
                    <div className="flex flex-1">
                        <SideNavbar />
                        <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                            <h1 className="text-2xl text-primary font-extrabold">
                                Control Panel
                            </h1>
                            <p>Loading...</p>
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    // changing a part of a category
    const handleChange = (
        index: number,
        field: keyof CategoryAttributes,
        value: string | number
    ) => {
        const updated = [...categories];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        setCategories(updated);
    };

    // adding a category
    const handleAdd = () => {
        setCategories([
            ...categories,
            {
                name: "",
                lowThreshold: 0,
                highThreshold: 0,
            },
        ]);
    };

    // deleting an category
    const handleDelete = (index: number) => {
        const updated = categories.filter((_, i) => i !== index);
        setCategories(updated);
    };

    // saving
    const handleSave = async () => {
        for (const category of categories) {
            if (!category.name.trim()) {
                toast.error("Category name can not be empty");
                return;
            }
            if (category.lowThreshold > category.highThreshold) {
                toast.error(
                    "Low threshold cannot be greater than high threshold"
                );
            }
            await setCategoriesWithToast(categories);
        }
    };

    return (
        <ProtectedRoute allow={["Admin"]}>
            <div className="h-full w-full flex flex-col font-family-roboto">
                <TopNavbar />
                <div className="flex flex-1">
                    <SideNavbar />
                    <div className="flex-1 bg-[#F7F7F7] py-4 px-6 flex flex-col">
                        <h1 className="text-2xl text-primary font-extrabold mb-4">
                            Category Settings
                        </h1>

                        <div className="flex flex-col gap-4">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded shadow flex gap-4 items-end"
                                >
                                    <FormInput
                                        label="Category: "
                                        value={category.name}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <FormInput
                                        label="Low Threshold: "
                                        type="number"
                                        value={String(category.lowThreshold)}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "lowThreshold",
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                    <FormInput
                                        label="High Threshold: "
                                        type="number"
                                        value={String(category.highThreshold)}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "highThreshold",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                    <Button
                                        variant="secondary"
                                        onClick={() => handleDelete(index)}
                                    >
                                        {" "}
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-6">
                            <Button onClick={handleAdd}>Add Category</Button>
                            <Button onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
