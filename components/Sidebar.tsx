"use client";
import React from "react";
import Link from "next/link";

export function Sidebar({ 
  activeSection, 
  setActiveSection 
}: { 
  activeSection: string; 
  setActiveSection: (val: string) => void;
}) {
  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
      <div className="mb-8">
        <div className="w-12 h-12 bg-gray-300 rounded-full mb-2" />
        <p className="text-sm font-semibold">Admin</p>
      </div>
      
      <div className="space-y-1">
        <Link href="/inventory">
          <button 
            onClick={() => setActiveSection("Inventory")}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              activeSection === "Inventory" ? "bg-white shadow-sm" : "hover:bg-white/50"
            }`}
          >
            Inventory
          </button>
        </Link>

        <Link href="/donation-requests">
          <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-white/50">
            Donation Requests
          </button>
        </Link>

        <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-white/50">
          Volunteers
        </button>
        
        <button className="w-full text-left px-3 py-2 rounded text-sm hover:bg-white/50">
          Case managers
        </button>
      </div>
    </div>
  );
}