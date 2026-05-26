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
            className="rounded-sm border border-light-border shadow-md hover:shadow-lg cursor-pointer flex flex-col items-center"
            onClick={onOpen}
        >
            {item.item.photos.length > 0 ? (
                <img
                    src={item.item.photos[0].url}
                    alt={item.item.name}
                    className="h-[16em] w-[16em] object-cover rounded-sm m-3"
                />
            ) : (
                <div className="h-[16em] w-[16em] flex items-center justify-center bg-light-border m-3 rounded-sm">
                    No Image
                </div>
            )}
            <div className="w-full px-3 flex flex-col">
                <span className="font-semibold text-sm truncate w-full">{item.item.name}</span>
                <div className="text-xs flex flex-wrap gap-1 mt-1">
                    <Badge text={item.item.category} color="blue" />
                    <Badge text={item.item.quantity.toString()} color="orange" />
                    <Badge
                        text={item.status}
                        color={
                            item.status === "Approved"
                                ? "green"
                                : item.status === "Denied"
                                  ? "red"
                                  : "gray"
                        }
                    />
                </div>
                <span className="text-xs text-[#818181] mt-2 mb-2">
                    {item.item.dateAdded.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
}
