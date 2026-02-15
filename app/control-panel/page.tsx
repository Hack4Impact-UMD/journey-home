"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import SideNavbar from "@/components/general/SideNav";
import TopNavbar from "@/components/general/TopNav";

export default function ControlPanelPage() {
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

                        <section className="mt-6">
                            <h2 className="font-semibold mb-4">Categories</h2>
                            {/* existing categories */}
                            <div>
                                <div className="mb-3">
                                    <span>Category 1</span>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </div>
                                <div className="mb-3">
                                    <span>Category 2</span>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </div>
                            </div>
                            {/* add new category */}
                            <div className="mt-3">
                                <h3>Add Category</h3>
                                <input
                                    type="text"
                                    placeholder="Category Name"
                                />
                                <button>Add</button>
                            </div>
                        </section>

                        <section className="mt-6">
                            <h2 className="font-semibold mb-4">
                                {" "}
                                Inventory Thresholds
                            </h2>
                            <div className="mt-4">
                                <label htmlFor="cat1-low">Category 1 Low</label>
                                <input
                                    id="cat1-low"
                                    type="number"
                                    defaultValue={5}
                                />
                                <button>Save</button>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="cat2-low">Category 2 Low</label>
                                <input
                                    id="cat2-low"
                                    type="number"
                                    defaultValue={10}
                                />
                                <button>Save</button>
                            </div>
                        </section>

                        <section className="mt-6">
                            <button>Add Settings</button>
                        </section>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
