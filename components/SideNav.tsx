"use client";

export default function SideNavbar() {

    return (
        <div className="h-full w-50 p-4 flex flex-col">
            <span className="text-primary font-extrabold pb-4 text-sm">Admin</span>
            <span className="pb-4  text-sm">Inventory</span>
            <span className="pb-4  text-sm">Volunteers</span>
            <span className="pb-4  text-sm">Case Managers</span>
            <span className="pb-4  text-sm">User Management</span>
        </div>
    )
}