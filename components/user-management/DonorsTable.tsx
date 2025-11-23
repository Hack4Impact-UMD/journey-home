"use client";

import { DonorInfo } from "@/types/donations";
import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";

type DonorsTableProps = {
    donors: DonorInfo[];
};

export function DonorsTable({ donors }: DonorsTableProps) {
    return (
        <div className="w-full h-full min-w-3xl">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Phone
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Email
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Address
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Actions
                </span>
            </div>
            {donors.map((donor) => (
                <DonorsTableRow donor={donor} key={donor.email} />
            ))}
        </div>
    );
}

function DonorsTableRow({ donor }: { donor: DonorInfo }) {
    return (
        <>
            <div
                className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            >
                <div className="w-[20%] px-4 flex items-center">
                    <span>
                        {donor.firstName} {donor.lastName}
                    </span>
                </div>
                <div className="w-[20%] px-4 text-xs">
                    <span>{donor.phoneNumber}</span>
                </div>
                <div className="w-[20%] px-4 flex items-center">
                    <span>
                        {donor.email}
                    </span>
                </div>
                <span className="w-[20%] px-4">
                    {donor.address.streetAddress}, {donor.address.city} {donor.address.zipCode}
                </span>
                <div className="w-[20%] px-4 flex align-center">
                    <ViewIcon />
                    <TrashIcon />
                </div>
            </div>
        </>
    );
}
