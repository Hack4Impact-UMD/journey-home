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
        <div className="w-full h-full flex flex-wrap gap-x-3 gap-y-6 content-start">
            {request.items.map((item) => (
                <DRGalleryCard
                    key={item.item.id + request.id}
                    item={item}
                    onOpen={() => openItem(item)}
                />
            ))}
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
            className="w-[17.59em] rounded-sm border border-light-border h-[22.8em] shadow-md hover:shadow-lg cursor-pointer flex flex-col"
            onClick={onOpen}
        >
            <div className="px-3 pt-3">
                {item.item.photos.length > 0 ? (
                    <img
                        src={item.item.photos[0].url}
                        alt={item.item.name}
                        className="w-full aspect-square object-cover rounded-sm"
                    />
                ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-light-border rounded-sm">
                        No Image
                    </div>
                )}
            </div>
            <div className="w-full px-4 mt-1 flex flex-col">
                <span className="font-semibold text-sm">{item.item.name}</span>
                <div className="text-xs flex flex-wrap gap-1 mt-1">
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
                <span className="text-xs text-[#818181] mt-2">
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
