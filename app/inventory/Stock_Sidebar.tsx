// inventory/StockSidebar.tsx
import React from "react";
import { STOCK } from "./data";

function ProgressBar({ value, max }: { value: number; max: number }) {
  const percentage = (value / max) * 100;
  const tone = percentage >= 80 ? "bg-green-500" : percentage >= 40 ? "bg-yellow-400" : "bg-red-500";
  
  return (
    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${tone} transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function StockSidebar({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded" />
                <h2 className="text-lg font-semibold">Stock</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {STOCK.map((s) => (
              <div key={s.label} className="mb-6">
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{s.label}</span>
                    <span className="text-gray-500">{s.value}</span>
                  </div>
                </div>
                <ProgressBar value={s.value} max={s.max} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}