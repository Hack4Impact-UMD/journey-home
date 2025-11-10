import { DonationItem, DonationRequest } from "@/types/donations";
import { Badge } from "../Badge";
import { useState } from "react";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";

export function DRContentsTable({
    request,
}: {
    request: DonationRequest;
}) {
    return (
        <>
            <div className="w-full h-full min-w-4xl">
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                    <span className="w-[25%] border-l-2 border-light-border px-4">
                        Name
                    </span>
                    <span className="w-[15%] border-l-2 border-light-border px-4">
                        Category
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Size
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Quantity
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Date
                    </span>
                    <span className="w-[15%] border-l-2 border-light-border px-4">
                        Status
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Actions
                    </span>
                    
                </div>
                {request.items.map((item) => (
                    <DRContentsTableRow item={item} key={item.item.id+request.id}/>
                ))}
            </div>
        </>
    );
}

function DRContentsTableRow({ item }: { item: DonationItem }) {
    const [selected, setSelected] = useState<boolean>(false);


    return (
        <>
            <div 
                className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            >
                <div className="w-[25%] px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-3 rounded-xs cursor-pointer border-white"
                    ></input>
                    <div className="w-7 h-7 flex items-center mr-3 justify-center">
                        {(item.item.photos.length > 0) ? <img className="max-w-7 max-h-7" src={item.item.photos[0].url}/> : null}
                    </div>
                    <span>
                        {item.item.name}
                    </span>
                </div>
                <div className="w-[15%] px-4 text-xs">
                    <Badge
                        text={item.item.category}
                        color="blue"
                    />
                </div>
                <span className="w-[10%] px-4 text-xs">
                    <Badge text={item.item.size} color={
                        (item.item.size == "Large") ? "pink" :
                        (item.item.size == "Medium") ? "purple" :
                        "yellow"
                    }/>
                </span>
                <span className="w-[10%] px-4 text-xs">
                    <Badge text={item.item.quantity.toString()} color="orange" />
                </span>
                <span className="w-[10%] px-4">
                    {item.item.dateAdded.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    })}
                </span>
                <span className="w-[15%] px-4 text-xs">
                    <Badge text={item.status} color={
                        (item.status == "Approved") ? "green" :
                        (item.status == "Denied") ? "red" :
                        "gray"
                    }/>
                </span>
                <div className="w-[10%] px-4 flex align-center">
                    <ViewIcon />
                    <TrashIcon />
                </div>
                
            </div>
        </>
    );
}
