import { DonationItem, DonationRequest } from "@/types/donations";
<<<<<<< HEAD
import { Badge } from "@/components/inventory/Badge";
import { ViewIcon } from "@/components/icons/ViewIcon";
import { TrashIcon } from "@/components/icons/TrashIcon";
=======
import { Badge } from "../inventory/Badge";
>>>>>>> main

export function DRContentsTable({
    request,
    openItem,
}: {
    request: DonationRequest;
    openItem: (item: DonationItem) => void;
}) {
    return (
        <div className="w-full min-w-4xl flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
<<<<<<< HEAD
                <span className="w-[25%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Name
=======
                <span className="w-[30%] border-l-2 border-light-border px-4">
                    Name
>>>>>>> main
                </span>
                <span className="w-[15%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Category
                </span>
                <span className="w-[10%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Size
                </span>
                <span className="w-[10%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Quantity
                </span>
                <span className="w-[10%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Date
                </span>
<<<<<<< HEAD
                <span className="w-[15%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Status
                </span>
                <span className="w-[10%] px-4 flex items-center gap-2.5">
                    <div className="w-0.5 h-3.5 bg-[#181D1F26] shrink-0" />Actions
                </span>
=======
                <span className="w-[25%] border-l-2 border-light-border px-4">
                    Status
                </span>
>>>>>>> main
            </div>
            <div className="overflow-auto">
                {request.items.map((item) => (
                    <DRContentsTableRow item={item} key={item.item.id+request.id} onOpen={() => openItem(item)}/>
                ))}
            </div>
        </div>
    );
}

function DRContentsTableRow({ item, onOpen }: { item: DonationItem, onOpen: () => void }) {
    return (
        <div
            className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            onClick={onOpen}
        >
            <div className="w-[30%] px-4 flex items-center">
                <div className="w-7 h-7 flex items-center mr-3 justify-center">
                    {(item.item.photos.length > 0) ? <img className="max-w-7 max-h-7" src={item.item.photos[0].url} alt={item.item.name}/> : null}
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
            <span className="w-[25%] px-4 text-xs">
                <Badge text={item.status} color={
                    (item.status == "Approved") ? "green" :
                    (item.status == "Denied") ? "red" :
                    "gray"
                }/>
            </span>
        </div>
    );
}