"use client";

import { MailIcon } from "../icons/MailIcon";
import { PhoneIcon } from "../icons/PhoneIcon";
import Button from "../form/Button";

export type PickupDeliveryType = "pickup" | "delivery";

export type PickupDeliveryCardData = {
    id: string;
    type: PickupDeliveryType;
    name: string;
    email: string;
    phone: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    items: string[];
    pickupDate?: string; // For scheduled/completed items
    onSchedule?: () => void;
};

type PickupDeliveryCardProps = {
    data: PickupDeliveryCardData;
};

export default function PickupDeliveryCard({ data }: PickupDeliveryCardProps) {
    const isPickup = data.type === "pickup";
    const headerBgColor = isPickup ? "bg-[#d5e7f2]" : "bg-[#f8dfeb]";
    const title = isPickup ? `Pickup From ${data.name}` : `Delivery To ${data.name}`;
    const fullAddress = `${data.address.street}\n${data.address.city}, ${data.address.state} ${data.address.zipCode}`;

    return (
        <div className="border border-[#e1e1e1] rounded-[4px] w-[300px] h-auto relative">
            <div className={`${headerBgColor} h-[58px] rounded-t-[4px] flex items-center px-4`}>
                <h3 className="font-bold text-base text-black">{title}</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
                {/* Contact Section */}
                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-bold text-base text-black mb-2">Contact</p>
                        <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm text-black">{data.email}</span>
                            <MailIcon />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm text-black">{data.phone}</span>
                            <PhoneIcon />
                        </div>
                    </div>

                    {/* Pickup Date (for scheduled/completed) */}
                    {data.pickupDate && (
                        <div>
                            <p className="font-bold text-base text-black mb-1">Pickup Date</p>
                            <p className="text-sm text-black">{data.pickupDate}</p>
                        </div>
                    )}

                    {/* Address Section */}
                    <div>
                        <p className="font-bold text-base text-black mb-2">Address</p>
                        <p className="text-sm text-black whitespace-pre-line">{fullAddress}</p>
                    </div>

                    {/* Items Section */}
                    <div>
                        <p className="font-bold text-base text-black mb-2">
                            {data.items.length} {data.items.length === 1 ? "Item" : "Items"}
                        </p>
                        <div className="flex flex-col gap-1">
                            {data.items.slice(0, 4).map((item, index) => (
                                <p key={index} className="text-sm text-black">
                                    {item}
                                </p>
                            ))}
                            {data.items.length > 4 && (
                                <p className="text-sm text-[#666666]">Show more</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Schedule Button */}
                {data.onSchedule && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={data.onSchedule}
                            className="px-4 py-1.5 text-sm"
                        >
                            Schedule
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

