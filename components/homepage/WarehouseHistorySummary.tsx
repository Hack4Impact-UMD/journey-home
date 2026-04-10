"use client";

import { useMemo } from "react";
import { AdminWarehousePlus } from "../icons/AdminWarehousePlus";
import { AdminWarehouseMinus } from "../icons/AdminWarehouseMinus";
import { useWarehouseHistory } from "@/lib/queries/warehouse-history";

export default function WarehouseHistorySummary(){
     const {changes: warehouseChanges = [], isLoading} = useWarehouseHistory();

    const now = useMemo(()=> Date.now(), []);
    const sortedChanges = useMemo(() => 
    [...warehouseChanges].filter((c) => c.change.newQuantity !== c.change.oldQuantity).sort((a,b) => b.timestamp.toDate().getTime() - a.timestamp.toDate().getTime()), [warehouseChanges]
    );
    const twoDaysAfter = useMemo(() => 
        warehouseChanges.filter((c)=> now - c.timestamp.toDate().getTime() <= 48*60*60*1000).length, [warehouseChanges, now]    
    );

    const mostRecent = sortedChanges.slice(0,5);

    return (
        <div className = "w-[95%] h-[47%] rounded-2xl border border-[#E7E7E7] bg-[#FFFFFF] shadow-lg px-[1rem] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <div className = "flex flex-row place-content-between my-[1.5rem]">
                <span className = "font-semibold text-lg">
                    Latest inventory updates
                </span>
                <span>
                     {twoDaysAfter} new changes
                </span> 
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ): mostRecent.length === 0 ? (
                <p>No inventory changes were made</p>
            ) : (
                <div>
                    <div className = "">
                        {mostRecent.map((c)=>{
                            const diff = c.change.newQuantity-c.change.oldQuantity;
                            const isPositive = diff > 0;
                            return(
                                <div key = {c.id} className = {`grid grid-cols-[0.35fr_0.65fr] my-[0.25rem] rounded-lg py-[1rem] items-center border-[#DCDDDD] border-[1px] ${isPositive ? "bg-[#F2FAF2]": "bg-[#FAF2F2]"}`}>
                                    <div className = "flex flex-row ">
                                        <div className = "pl-[1rem] pr-[0.5rem]">
                                            {isPositive?(
                                                <AdminWarehousePlus/>
                                            ):(
                                                <AdminWarehouseMinus/>
                                            )}
                                        </div>
                                        <div className = "pr-[0.5rem] text-[#666666]">
                                            {c.timestamp.toDate().toLocaleDateString("en-US", {weekday: "short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit"})}
                                        </div>
                                    </div>
                                    <div className = "pl-[1rem] border-l border-[#D9D9D9]">
                                        {isPositive?("added "):("removed ")}
                                        {Math.abs(diff)} {c.change.category} ({c.change.oldQuantity} → {c.change.newQuantity})
            
                                    </div>
                                    
                                </div>
                            );
                        })}
                            
                    </div>
                </div>
            )}
        </div>
    );
}
