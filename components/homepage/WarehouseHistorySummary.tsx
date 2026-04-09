"use client";

import { useMemo } from "react";
// import { InventoryChange } from "@/types/inventory";
import { AdminWarehousePlus } from "../icons/AdminWarehousePlus";
import { AdminWarehouseMinus } from "../icons/AdminWarehouseMinus";
import { useWarehouseHistory } from "@/lib/queries/warehouse-history";

export default function WarehouseHistorySummary(){
     const {changes: warehouseChanges = [], isLoading} = useWarehouseHistory();

    const now = useMemo(()=> Date.now(), []);
    

    //for text formatting --> temporary
    const sorted = ["something", "something", "something"];

    return (
        <div className = "w-[95%] h-[45%] rounded-2xl border border-[#E7E7E7] bg-[#FFFFFF] shadow-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <div className = "flex flex-row place-content-between my-[1.5rem] mx-[1rem]">
                <span className = "font-semibold">
                    Latest inventory updates
                </span>
                <span>
                     {warehouseChanges.length} new changes
                </span> 
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ): sorted.length === 0 ? (
                <p>No inventory changes were made</p>
            ) : (
                <div>
                    <div className = "">
                            
                    </div>
                </div>
            )}
        </div>
    );
}
