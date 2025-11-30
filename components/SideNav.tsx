"use client";

import Link from "next/link";

export default function SideNavbar() {
  return (
    <div className="h-full w-50 p-4 flex flex-col font-family-roboto">
      <span className="text-primary font-extrabold pb-4">Admin</span>
      <span className="pb-4 text-sm">Inventory</span>
      <span className="pb-4 text-sm">Volunteers</span>
      <Link
        href="/case-manager"
        className="pb-4 text-sm hover:underline cursor-pointer"
      >
        Case Managers
      </Link>

      <span className="pb-4 text-sm">User Management</span>
    </div>
  );
}
