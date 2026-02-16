import { InventoryRecord } from "@/types/inventory";
import { Badge } from "./Badge";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { EditIcon } from "../icons/EditIcon";

export function WarehouseTable({
    inventoryRecords,
    openItem,
    deleteItem,
    editItem,
}: {
    inventoryRecords: InventoryRecord[];
    openItem: (item: InventoryRecord) => void;
    deleteItem: (item: InventoryRecord) => void;
    editItem: (item: InventoryRecord) => void;
}) {
    return (
        <>
            <div className="w-full h-full min-w-3xl">
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                    <span className="w-[26%] border-l-2 border-light-border px-4">
                        Name
                    </span>
                    <span className="w-[18%] border-l-2 border-light-border px-4">
                        Category
                    </span>
                    <span className="w-[18%] border-l-2 border-light-border px-4">
                        Size
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Quantity
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Date
                    </span>
                    <span className="w-[18%] border-l-2 border-light-border px-4">
                        Actions
                    </span>
                </div>
                {inventoryRecords.map((record) => (
                    <WarehouseTableRow
                        record={record}
                        onOpen={() => openItem(record)}
                        key={record.id}
                        onDelete={() => deleteItem(record)}
                        onEdit={() => editItem(record)}
                    />
                ))}
            </div>
        </>
    );
}

function WarehouseTableRow({
    record,
    onOpen,
    onDelete,
    onEdit,
}: {
    record: InventoryRecord;
    onOpen: () => void;
    onDelete: () => void;
    onEdit: () => void;
}) {
    return (
        <>
            <div className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer">
                <div className="w-[26%] px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    ></input>
                    <div className="w-7 h-7 flex items-center mr-3 justify-center">
                        {(record.photos.length > 0) ? <img className="max-w-7 max-h-7" src={record.photos[0].url} alt="Record photo"/> : null}
                    </div>
                    <span>{record.name}</span>
                </div>
                <div className="w-[18%] px-4 text-xs">
                    <Badge text={record.category} color={"blue"} />
                </div>
                <span className="w-[18%] px-4 text-xs">
                    <Badge text={record.size} color={
                        (record.size == "Large") ? "pink" :
                        (record.size == "Medium") ? "purple" :
                        "yellow"
                    }/>
                </span>
                <span className="w-[10%] px-4 text-xs">
                    <Badge text={record.quantity.toString()} color={"orange"} />
                </span>

                <span className="w-[10%] px-4">
                    {record.dateAdded.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    })}
                </span>
                <div className="w-[18%] px-4 flex align-center items-center gap-3">
                    <div onClick={onOpen} className="text-lg">
                        <ViewIcon />
                    </div>
                    <div onClick={onEdit}>
                        <EditIcon />
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    >
                        <TrashIcon />
                    </div>
                </div>
            </div>
        </>
    );
}
