import { DonationRequest } from "@/types/donations";
import { Badge } from "./Badge";
import { useState } from "react";
import { ViewIcon } from "./icons/ViewIcon";
import { TrashIcon } from "./icons/TrashIcon";
import { InventoryRecord } from "@/types/inventory";

export function TableView({
    inventoryRecords,
    openItem,
    onDelete,
}: {
    inventoryRecords: InventoryRecord[];
    openItem: (item: InventoryRecord) => void;
    onDelete?: (id: string) => void;
}) {
    return (
        <>
            <div className="w-full h-full min-w-3xl">
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                    <span className="w-[30%] border-l-2 border-light-border px-4">
                        Name
                    </span>
                    <span className="w-[12%] border-l-2 border-light-border px-4">
                        Category
                    </span>
                    <span className="w-[12%] border-l-2 border-light-border px-4">
                        Size
                    </span>
                    <span className="w-[12%] border-l-2 border-light-border px-4">
                        Quantity
                    </span>
                    <span className="w-[12%] border-l-2 border-light-border px-4">
                        Date
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Actions
                    </span>
                    
                </div>
                {inventoryRecords.map((record) => (
                    <TableRow record={record} onOpen={() => openItem(record)} key={record.id} onDelete={() => onDelete?.(record.id)} />
                ))}
            </div>
        </>
    );
}

function TableRow({ record, onOpen, onDelete }: { record: InventoryRecord, onOpen: () => void, onDelete?: (id: string) => void;  }) {
    return (
        <>
            <div 
                className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            >
                <div className="w-[30%] px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    ></input>
                    <span>
                        {record.name}
                    </span>
                </div>
                <div className="w-[12%] px-4 text-xs">
                    <Badge text={record.category} color={"blue"} />
                </div>
                <span className="w-[12%] px-4">
                    <Badge text={record.size} color={"yellow"} />
                </span>
                <span className="w-[12%] px-4 text-xs">
                    <Badge text={record.quantity.toString()} color={"orange"} />
                </span>
                
                    <span className="w-[12%] px-4">
                        {record.dateAdded.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                        })}
                    </span>
                <div className="w-[10%] px-4 flex align-center">
                    <div onClick={onOpen}>
                        <ViewIcon />
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); onDelete?.(record.id);}}>
                        <TrashIcon/>
                    </div>
                    
                </div>
                
            </div>
        </>
    );
}
