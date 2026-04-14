"use client";

import { ViewIcon } from "../icons/ViewIcon";
import { TrashIcon } from "../icons/TrashIcon";
import { LocationContact } from "@/types/general";

type DonorsTableProps = {
    donors: LocationContact[];
    selectedDonorKeys: string[];
    onToggleDonor: (donor: LocationContact) => void;
    onToggleAll: () => void;
};

export function DonorsTable({
    donors,
    selectedDonorKeys,
    onToggleDonor,
    onToggleAll,
}: DonorsTableProps) {
    const allSelected =
        donors.length > 0 &&
        donors.every((donor) => selectedDonorKeys.includes(donor.email));

    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                <span className="w-[20%] border-l-2 border-light-border px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                        checked={allSelected}
                        onChange={onToggleAll}
                    />
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

            <div className="flex-1 overflow-auto min-h-0">
                {donors.map((donor) => (
                    <DonorsTableRow
                        key={donor.email}
                        donor={donor}
                        isSelected={selectedDonorKeys.includes(donor.email)}
                        onToggle={() => onToggleDonor(donor)}
                    />
                ))}
            </div>
        </div>
    );
}

function DonorsTableRow({
    donor,
    isSelected,
    onToggle,
}: {
    donor: LocationContact;
    isSelected: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer">
            <div className="w-[20%] px-4 flex items-center">
                <input
                    type="checkbox"
                    className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    checked={isSelected}
                    onChange={onToggle}
                    onClick={(e) => e.stopPropagation()}
                />
                <span>
                    {donor.firstName} {donor.lastName}
                </span>
            </div>

            <div className="w-[20%] px-4">
                <span>{donor.phoneNumber}</span>
            </div>

            <div className="w-[20%] px-4 flex items-center">
                <span>{donor.email}</span>
            </div>

            <span className="w-[20%] px-4">
                {donor.address.streetAddress}, {donor.address.city}{" "}
                {donor.address.zipCode}
            </span>

            <div
                className="w-[20%] px-4 flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
            >
                <button type="button">
                    <ViewIcon />
                </button>
                <button type="button">
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
}