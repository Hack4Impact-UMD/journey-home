"use client";
import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Tabs } from "./Tabs";
import { StockSidebar } from "./Stock_Sidebar";

import WarehouseTab from "./page";
import DonationRequestsTab from "./DonationRequests";

export default function InventoryPage() {
  const [activeSection, setActiveSection] = useState("Inventory");
  const [activeTab, setActiveTab] = useState("Warehouse");
  const [stockOpen, setStockOpen] = useState(false);
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            
            <button 
              onClick={() => setStockOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {activeTab === "Warehouse" && <WarehouseTab />}
          {activeTab === "Donation requests" && <DonationRequestsTab />}
          {activeTab === "Approved donations" && (
            <div className="text-center py-12 text-gray-500">
              Coming soon: Approved donations list.
            </div>
          )}
          {activeTab === "Denied donations" && (
            <div className="text-center py-12 text-gray-500">
              Coming soon: Denied donations summary.
            </div>
          )}
        </div>
      </div>
      
      <StockSidebar isOpen={stockOpen} onClose={() => setStockOpen(false)} />
    </div>
  );
}