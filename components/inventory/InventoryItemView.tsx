import { DonationItem, DonationRequest } from "@/types/donations";
import { InventoryRecord } from "@/types/inventory";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { Badge } from "./Badge";
import EditItem from "./EditItem";
import { getInventoryRecord } from "@/lib/services/inventory";

type ItemReviewModalProps = {
  item: DonationItem;
  dr: DonationRequest;
  onClose: () => void;
  onUpdatedItem?: (record: InventoryRecord) => void;
};

export function InventoryItemView({
  dr,
  item,
  onClose,
  onUpdatedItem,
}: ItemReviewModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<DonationItem>(item);

  // Load freshest version from Firestore when the modal opens
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const backendRecord = await getInventoryRecord(item.item.id);
        if (!cancelled && backendRecord) {
          setCurrentItem((prev) => ({ ...prev, item: backendRecord }));
        }
      } catch (err) {
        console.error("Failed to load inventory record for modal:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [item.item.id]);

  const rec = currentItem.item;

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
        <div className="bg-white w-full h-full flex">
          <div className="flex-1 border-light-border justify-center flex items-center bg-gray-100">
            {rec.photos.length > 0 ? (
              <img
                className="max-w-full max-h-full"
                src={rec.photos[0].url}
                alt={rec.name}
              />
            ) : null}
          </div>
          <div className="w-[30em] p-10 flex flex-col">
            <div className="flex">
              <span className="font-semibold text-xl">{rec.name}</span>
              <button className="ml-auto text-2xl" onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
            <div className="text-xs flex gap-2 my-2">
              <Badge text={rec.category} color="blue" />
              <Badge
                text={rec.size}
                color={
                  rec.size == "Large"
                    ? "pink"
                    : rec.size == "Medium"
                    ? "purple"
                    : "yellow"
                }
              />
              <Badge text={rec.quantity.toString()} color="orange" />
            </div>
            <span className="text-[#A2A2A2] text-sm font-family-opensans mb-6">
              {rec.dateAdded
                .toDate()
                .toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
            </span>

            <span className="font-semibold">Item Notes</span>
            <span className="mb-5">{rec.notes}</span>

            <span className="font-semibold mb-1">Donor Info</span>
            <div className="flex gap-4 mb-5">
              <div className="flex justify-center items-center">
                <img
                  className="h-16 w-16"
                  src="/DefaultProfilePicture.png"
                  alt="Donor avatar"
                />
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <span>
                  {dr.donor.firstName} {dr.donor.lastName}
                </span>
                <a
                  href={`mailto:${dr.donor.email}`}
                  className="text-blue-500 underline"
                >
                  {dr.donor.email}
                </a>
                <span>{dr.donor.phoneNumber}</span>
              </div>
            </div>

            <span className="font-semibold mb-2">Donor Address</span>
            <span className="text-sm">{dr.donor.address.streetAddress}</span>
            <span className="text-sm">
              {dr.donor.address.city}, {dr.donor.address.state}{" "}
              {dr.donor.address.zipCode}
            </span>

            <div className="flex gap-2 mt-8">
              <button
                className="text-sm rounded-xs h-8 px-4 border border-light-border"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Item
              </button>
              {isEditModalOpen && (
                <EditItem
                  item={rec}
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  onUpdated={(updated) => {
                    setCurrentItem((prev) => ({ ...prev, item: updated }));
                    onUpdatedItem?.(updated);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
