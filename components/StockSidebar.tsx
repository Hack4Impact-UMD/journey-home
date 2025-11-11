"use client";

import { InventoryRecord } from "@/types/inventory";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";

export default function StockSidebar() {

    const [isOpen, setIsOpen] = useState(false);
   const ITEMS: InventoryRecord[] = [
     { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 2, size: "Large",  dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null },
     { id: "2", name: "item2", photos: [], category: "Chairs",  notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null },
     { id: "3", name: "item3", photos: [], category: "Tables",  notes: "N/A", quantity: 3, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null },
     { id: "4", name: "item4", photos: [], category: "Tables",  notes: "N/A", quantity: 1, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null },
     { id: "5", name: "item5", photos: [], category: "Tables",  notes: "N/A", quantity: 5, size: "Small",  dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null },
   ];

    return (
        <div className="h-full w-20 bg-white flex flex-col overflow-auto items-center pt-[1em]">
             <button
                onClick={() => setIsOpen(true)}
                className="p-3 rounded-md hover:bg-gray-100 shadow-non focus:outline-none transition">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.97 6.20146L12.72 1.68739C12.4996 1.5656 12.2518 1.50171 12 1.50171C11.7482 1.50171 11.5004 1.5656 11.28 1.68739L3.03 6.20333C2.7944 6.33224 2.59772 6.52205 2.46052 6.75292C2.32331 6.98379 2.25061 7.24727 2.25 7.51583V16.4821C2.25061 16.7506 2.32331 17.0141 2.46052 17.245C2.59772 17.4759 2.7944 17.6657 3.03 17.7946L11.28 22.3105C11.5004 22.4323 11.7482 22.4962 12 22.4962C12.2518 22.4962 12.4996 22.4323 12.72 22.3105L20.97 17.7946C21.2056 17.6657 21.4023 17.4759 21.5395 17.245C21.6767 17.0141 21.7494 16.7506 21.75 16.4821V7.51677C21.7499 7.24773 21.6774 6.98366 21.5402 6.75225C21.403 6.52084 21.206 6.3306 20.97 6.20146ZM12 2.99989L19.5319 7.12489L16.7409 8.65302L9.20813 4.52802L12 2.99989ZM12 11.2499L4.46812 7.12489L7.64625 5.38489L15.1781 9.5099L12 11.2499ZM3.75 8.4374L11.25 12.5418V20.5846L3.75 16.483V8.4374ZM20.25 16.4793L12.75 20.5846V12.5455L15.75 10.904V14.2499C15.75 14.4488 15.829 14.6396 15.9697 14.7802C16.1103 14.9209 16.3011 14.9999 16.5 14.9999C16.6989 14.9999 16.8897 14.9209 17.0303 14.7802C17.171 14.6396 17.25 14.4488 17.25 14.2499V10.0827L20.25 8.4374V16.4783V16.4793Z" fill="#666666"/>
                </svg>
            </button>
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between p-4">
                    <h2 className="font-semibold text-lg">Stock</h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 space-y-3">
                    {ITEMS.map((item) => (
                        <div key={item.id} className="space-y-1">
                            <span className="block text-sm font-medium text-gray-800">{item.name}</span>
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 h-2 bg-gray-100 rounded">
                                <div
                                    className={`h-2 rounded ${item.quantity < 5 ? "bg-red-500" : "bg-green-500"}`}
                                    style={{ width: `${(item.quantity / 21) * 100}%` }}
                                ></div>
                                </div>
                                <span className="text-sm text-gray-700">{item.quantity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isOpen && (
                <div
                onClick={() => setIsOpen(false)}
                ></div>
            )}
    </div>

    )
}