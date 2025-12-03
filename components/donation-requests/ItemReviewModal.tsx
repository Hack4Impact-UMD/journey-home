import {
    DonationItem,
    DonationItemStatus,
    DonationRequest,
} from "@/types/donations";
import { InventoryRecord } from "@/types/inventory";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { Badge } from "../inventory/Badge";

type ItemReviewModalProps = {
    item: DonationItem;
    dr: DonationRequest;
    onClose: () => void;
    setStatus: (status: DonationItemStatus) => void;
};

export function ItemReviewModal({
    dr,
    item,
    onClose,
    setStatus,
}: ItemReviewModalProps) {
    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
                <div className="bg-white w-full h-full flex">
                    <div className="flex-1 border-light-border justify-center flex items-center bg-gray-100">
                        {item.item.photos.length > 0 ? (
                            <img
                                className="w-full h-full object-contain"
                                src={item.item.photos[0].url}
                            />
                        ) : null}
                    </div>
                    <div className="w-[30em] p-10 flex flex-col">
                        <div className="flex">
                            <span className="font-semibold text-xl">
                                {item.item.name}
                            </span>
                            <button
                                className="ml-auto text-2xl"
                                onClick={onClose}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="text-xs flex gap-2 my-2">
                            <Badge text={item.item.category} color="blue" />
                            <Badge
                                text={item.item.size}
                                color={
                                    item.item.size == "Large"
                                        ? "pink"
                                        : item.item.size == "Medium"
                                        ? "purple"
                                        : "yellow"
                                }
                            />
                            <Badge
                                text={item.item.quantity.toString()}
                                color="orange"
                            />
                        </div>
                        <span className="text-[#A2A2A2] text-sm font-family-opensans mb-6">
                            {item.item.dateAdded
                                .toDate()
                                .toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                        </span>
                        <span className="font-semibold">Item Notes</span>
                        <span className="mb-5">{item.item.notes}</span>

                        <span className="font-semibold mb-1">Donor Info</span>
                        <div className="flex gap-4 mb-5">
                            <div className="flex justify-center items-center">
                                <img
                                    className="h-16 w-16"
                                    src="/DefaultProfilePicture.png"
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

                        <span className="font-semibold mb-2">
                            Donor Address
                        </span>
                        <span className="text-sm">
                            {dr.donor.address.streetAddress}
                        </span>
                        <span className="text-sm">
                            {dr.donor.address.city}, {dr.donor.address.state}{" "}
                            {dr.donor.address.zipCode}
                        </span>

                        <div className="flex gap-2 mt-8">
                            <button
                                className="text-sm bg-primary rounded-xs h-8 px-4 text-white"
                                onClick={() => setStatus("Approved")}
                            >
                                Approve
                            </button>
                            <button
                                className="text-sm rounded-xs h-8 px-4 border border-light-border"
                                onClick={() => setStatus("Denied")}
                            >
                                Deny
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
