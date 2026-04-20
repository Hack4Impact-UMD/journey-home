import { DonationItem, DonationRequest } from "@/types/donations";
import { Badge } from "@/components/inventory/Badge";

export function DRContentsGallery({
    request,
    openItem,
}: {
    request: DonationRequest;
    openItem: (item: DonationItem) => void;
}) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-4 gap-[10px] pt-2 pb-4">
                {request.items.map((item) => (
                    <DRGalleryCard
                        key={item.item.id + request.id}
                        item={item}
                        onOpen={() => openItem(item)}
                    />
                ))}
            </div>
        </div>
    );
}

function DRGalleryCard({
    item,
    onOpen,
}: {
    item: DonationItem;
    onOpen: () => void;
}) {
    return (
        <div
            className="border border-[#E1E1E1] rounded-[4px] bg-white hover:bg-blue-50 cursor-pointer flex flex-col px-2.5 pt-2.5 pb-3 gap-[10px]"
            onClick={onOpen}
        >
            <div className="w-full aspect-square bg-[#FAFAFB] rounded-[4px] overflow-hidden flex items-center justify-center">
                {item.item.photos.length > 0 ? (
                    <img
                        src={item.item.photos[0].url}
                        alt={item.item.name}
                        className="w-full h-full object-cover rounded-[4px]"
                    />
                ) : (
                    <span className="text-xs text-gray-400">No image</span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-text-1 truncate">
                    {item.item.name}
                </span>

                <div className="flex gap-1 items-center text-xs">
                    <Badge text={item.item.category} color="blue" />
                    <Badge
                        text={item.item.size}
                        color={
                            item.item.size === "Large"
                                ? "pink"
                                : item.item.size === "Medium"
                                  ? "purple"
                                  : "yellow"
                        }
                    />
                    <Badge text={item.item.quantity.toString()} color="orange" />
                </div>

                <span className="text-xs text-gray-500">
                    {item.item.dateAdded.toDate().toLocaleDateString("en-US", {
                        month: "numeric",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
        </div>
    );
}