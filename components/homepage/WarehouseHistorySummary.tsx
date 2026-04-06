"use client";

import { useMemo } from "react";
import { InventoryChange } from "@/types/inventory";
import { AdminWarehousePlus } from "../icons/AdminWarehousePlus";
import { AdminWarehouseMinus } from "../icons/AdminWarehouseMinus";
// import {useInventoryChanges } from "lib/queries/inventory.ts";   <-- waiting on import into this 

export default function WarehouseHistorySummary(){
    // const {data: inventoryChanges = [], isLoading} = useInventoryChanges();

    const now = useMemo(()=> Date.now(), []);
    

    //for text formatting --> temporary
    const sorted = ["something", "something", "something"];
    const isLoading = false;

    //Rest of functionality based on useInventoryChanges 

    return (
        <div className = "w-[30em] h-[18em] rounded-2xl border border-[#E7E7E7] bg-[#FFFFFF] shadow-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <div className = "flex flex-row place-content-between">
                <span>
                    Latest inventory updates
                </span>
                <span>
                     *insert num here* new changes
                </span> 
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ): sorted.length === 0 ? (
                <p>No inventory changes were made</p>
            ) : (
                <div>
                    {/* waiting on data */}
                </div>
            )}
        </div>
    );
}
