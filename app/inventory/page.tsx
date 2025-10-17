"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Tabs } from "./Tabs";
import { StockSidebar } from "./Stock_Sidebar";
import WarehouseTab from "./WarehouseTab";
import DonationRequestsTab from "./DonationRequests";

export default function InventoryPage() {
  const [activeSection, setActiveSection] = useState("Inventory");
  const [activeTab, setActiveTab] = useState("Warehouse");
  const [stockOpen, setStockOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-cyan-500">Inventory</h1>
          <button
            onClick={() => setStockOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </button>
        </div>

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-6">
         {activeTab === "Warehouse" && <WarehouseTab />}   
          {activeTab === "Donation requests" && <DonationRequestsTab />}
          {activeTab === "Approved donations" && (
            <p className="mt-6 text-gray-500">Coming soon: Approved donations list.</p>
          )}
          {activeTab === "Denied donations" && (
            <p className="mt-6 text-gray-500">Coming soon: Denied donations summary.</p>
          )}
        </div>
      </main>

      <StockSidebar isOpen={stockOpen} onClose={() => setStockOpen(false)} />
    </div>
  );
}