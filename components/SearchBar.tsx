"use client"
import { Timestamp } from "firebase/firestore";
import { search } from "../lib/services/inventory";
import { InventoryRecord, SearchParams } from "../types/inventory";
import { useState } from "react";

interface SearchBarProps {
  ITEMS: InventoryRecord[];
  setResults: (results: InventoryRecord[]) => void;
}


const ITEMS: InventoryRecord[] = [
    { id: "1", name: "item1", photos: [], category: "Couches", notes: "N/A", quantity: 1, size: "Large", dateAdded: Timestamp.fromDate(new Date("2025-10-27T16:00:00Z")), donorEmail: null},
    { id: "2", name: "item2", photos: [], category: "Chairs", notes: "N/A", quantity: 1, size: "Medium", dateAdded: Timestamp.fromDate(new Date("2025-10-28T16:00:00Z")), donorEmail: null},
    { id: "3", name: "item3", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-29T16:00:00Z")), donorEmail: null},
    { id: "4", name: "item4", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-30T16:00:00Z")), donorEmail: null},
    { id: "5", name: "item5", photos: [], category: "Tables", notes: "N/A", quantity: 1, size: "Small", dateAdded: Timestamp.fromDate(new Date("2025-10-31T16:00:00Z")), donorEmail: null},
];

const params: SearchParams = {
    categories: [],   
    sizes: [],        
    sortBy: "Name",   
    ascending: true   
};

export default function SearchBar({setResults}: {setResults: React.Dispatch<React.SetStateAction<InventoryRecord[] | null>>;}) {
    const [searchQuery, setQuery] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await search(searchQuery, params);
            setResults(res);
            console.log("it's doing something!!!!")
        } catch (err) {
            console.error("Search failed", err);
        }
    };
        
    return (
        <form onSubmit={handleSearch}>
            <div className="w-96 border border-gray-300 flex flex-row">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery} 
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 border border-gray-200 px-3 py-2 text-xl placeholder-gray-300 font-normal"
                />

                <button type="submit" className=" text-black border border-gray-300 px-4 py-2">
                    Search
                </button>
            </div> 
       </form>
    )
}