import { InventoryRecord } from "@/types/inventory";
import { Badge } from "./Badge";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { EditIcon } from "../icons/EditIcon";

export function WarehouseGallery({
    inventoryRecords,
    openItem,
}: {
    inventoryRecords: InventoryRecord[];
    openItem: (item: InventoryRecord) => void;
}) {
    return (
        <div className="w-full h-full flex flex-wrap gap-x-3 gap-y-6 content-start">
            {inventoryRecords.map((record) => (
                <WarehouseGalleryCard
                    record={record}
                    onOpen={() => openItem(record)}
                    key={record.id}
                />
            ))}
        </div>
    );
}

function WarehouseGalleryCard({
    record,
    onOpen,
}: {
    record: InventoryRecord;
    onOpen: () => void;
}) {
    return (
        <>
            <div 
                className="rounded-sm border border-light-border h-[20em] shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center"
                onClick={onOpen}
            >
                {record.photos.length > 0 ? (
                    <img
                        src={record.photos[0].url}
                        alt={record.name}
                        className="h-[13em] w-[13em] object-cover rounded-sm m-3"
                    />
                ) : (
                    <div className="h-[13em] w-[13em] flex items-center justify-center bg-light-border m-3 rounded-sm">
                        No Image
                    </div>
                )}
                <div className="w-full px-4 flex flex-col">
                    <span className="font-semibold text-sm">{record.name}</span>
                    <div className="text-xs flex flex-wrap gap-1 mt-1">
                        <Badge
                            text={record.size}
                            color={
                                record.size == "Large"
                                    ? "pink"
                                    : record.size == "Medium"
                                    ? "purple"
                                    : "yellow"
                            }
                        />
                        <Badge text={record.category} color={"blue"} />
                        <Badge
                            text={record.quantity.toString()}
                            color={"orange"}
                        />
                    </div>
                    <span className="text-xs text-[#818181] mt-2">
                        {record.dateAdded.toDate().toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                        })}
                    </span>
                </div>
            </div>
        </>
    );
}
