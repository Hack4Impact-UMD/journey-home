"use client";
import React, { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { Tabs } from "./Tabs";
import { StockSidebar } from "./Stock_Sidebar";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("Inventory");
  const [stockOpen, setStockOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <TopNav />
        
        {/* INVENTORY HEADER + TABS */}
        <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-cyan-500">Inventory</h1>
            
            <button 
              onClick={() => setStockOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 font-medium text-xl"
            >
              ☰
            </button>
          </div>
          
          <Tabs />
        </div>
        
        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </div>
      
      <StockSidebar isOpen={stockOpen} onClose={() => setStockOpen(false)} />
    </div>
  );
}