"use client";

export default function SideNavbar() {

    return (
        <div className="h-full w-1/6 p-4 flex flex-col">
            <span className="text-primary font-extrabold pb-4 text-3xl">Admin</span>
            <span className="pb-4  font-light text-2xl">Inventory</span>
            <span className="pb-4 font-light text-2xl">Volunteers</span>
            <span className="pb-4 font-light text-2xl">Case Managers</span>
            <span className="pb-4 font-light text-2xl">User Management</span>
        </div>
    )
}