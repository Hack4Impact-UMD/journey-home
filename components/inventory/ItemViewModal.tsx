import {
    DonationItem,
    DonationItemStatus,
    DonationRequest,
    DonorInfo,
} from "@/types/donations";
import { InventoryRecord } from "@/types/inventory";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "../icons/CloseIcon";
import { Badge } from "./Badge";
import { getDonor } from "@/lib/services/donations";

type ItemViewModalProps = {
    item: InventoryRecord;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
};

export function ItemViewModal(props: ItemViewModalProps) {

    const [donor, setDonor] = useState<DonorInfo | null>(null);

    useEffect(() => {
        if (props.item.donorEmail) {
            getDonor(props.item.donorEmail).then(setDonor);
        }
    }, [props.item.donorEmail]);

    return createPortal(
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
                <div className="bg-white w-full h-full flex">
                    <div className="flex-1 border-light-border justify-center flex items-center bg-gray-100">
                        {props.item.photos.length > 0 ? (
                            <img
                                className="w-full h-full object-contain"
                                src={props.item.photos[0].url}
                            />
                        ) : null}
                    </div>
                    <div className="w-[30em] p-10 flex flex-col">
                        <div className="flex">
                            <span className="font-semibold text-xl">
                                {props.item.name}
                            </span>
                            <button
                                className="ml-auto text-2xl"
                                onClick={props.onClose}
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="text-xs flex gap-2 my-2">
                            <Badge text={props.item.category} color="blue" />
                            <Badge
                                text={props.item.size}
                                color={
                                    props.item.size == "Large"
                                        ? "pink"
                                        : props.item.size == "Medium"
                                        ? "purple"
                                        : "yellow"
                                }
                            />
                            <Badge
                                text={props.item.quantity.toString()}
                                color="orange"
                            />
                        </div>
                        <span className="text-[#A2A2A2] text-sm font-family-opensans mb-6">
                            {props.item.dateAdded
                                .toDate()
                                .toLocaleDateString("en-US", {
                                    month: "2-digit",
                                    day: "2-digit",
                                    year: "numeric",
                                })}
                        </span>
                        <span className="font-semibold">Item Notes</span>
                        <span className="mb-5">{props.item.notes}</span>

                        {donor && (
                            <>
                                <span className="font-semibold mb-1">
                                    Donor Info
                                </span>
                                <div className="flex gap-4 mb-5">
                                    <div className="flex justify-center items-center">
                                        <img
                                            className="h-16 w-16"
                                            src="/DefaultProfilePicture.png"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2 text-sm">
                                        <span>
                                            {donor.firstName}{" "}
                                            {donor.lastName}
                                        </span>
                                        <a
                                            href={`mailto:${donor.email}`}
                                            className="text-blue-500 underline"
                                        >
                                            {donor.email}
                                        </a>
                                        <span>{donor.phoneNumber}</span>
                                    </div>
                                </div>

                                <span className="font-semibold mb-2">
                                    Donor Address
                                </span>
                                <span className="text-sm">
                                    {donor.address.streetAddress}
                                </span>
                                <span className="text-sm">
                                    {donor.address.city},{" "}
                                    {donor.address.state}{" "}
                                    {donor.address.zipCode}
                                </span>
                            </>
                        )}

                        <div className="flex gap-2 mt-8">
                            <button
                                className="text-sm rounded-xs h-8 px-4 border border-light-border"
                                onClick={props.onEdit}
                            >
                                Edit
                            </button>
                            <button
                                className="text-sm rounded-xs h-8 px-4 border border-light-border"
                                onClick={props.onDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
