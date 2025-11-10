"use client";

import { DonationRequest } from "@/types/donations";
import { Badge } from "../Badge";
import { useState } from "react";
import { ViewIcon } from "../ViewIcon";
import { TrashIcon } from "../TrashIcon";

export function DRTable({
    donationRequests,
    openDR
}: {
    donationRequests: DonationRequest[];
    openDR: (dr: DonationRequest) => void;
}) {
    return (
        <>
            <div className="w-full h-full min-w-3xl">
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                    <span className="w-[30%] border-l-2 border-light-border px-4">
                        Name
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Quantity
                    </span>
                    <span className="w-[15%] border-l-2 border-light-border px-4">
                        Date
                    </span>
                    <span className="w-[20%] border-l-2 border-light-border px-4">
                        Status
                    </span>
                    <span className="w-[15%] border-l-2 border-light-border px-4">
                        Responded
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Actions
                    </span>
                    
                </div>
                {donationRequests.map((dr) => (
                    <DRTableRow request={dr} onOpen={() => openDR(dr)} key={dr.id} />
                ))}
            </div>
        </>
    );
}

function DRTableRow({ request, onOpen }: { request: DonationRequest, onOpen: () => void }) {
    const [selected, setSelected] = useState<boolean>(false);

    const numNotReviewed = request.items.filter(
        (item) => item.status == "Not Reviewed"
    ).length;
    let statusText: string = "Unfinished";
    let statusColor: string = "orange";

    if (numNotReviewed == 0) {
        statusText = "Finished";
        statusColor = "green";
    } else if (numNotReviewed == request.items.length) {
        statusText = "Not Started";
        statusColor = "red";
    }

    return (
        <>
            <div 
                className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
                onClick={onOpen}
            >
                <div className="w-[30%] px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    ></input>
                    <span>
                        {request.donor.firstName} {request.donor.lastName}
                    </span>
                </div>
                <div className="w-[10%] px-4 text-xs">
                    <Badge
                        text={request.items.length.toString()}
                        color="orange"
                    />
                </div>
                <span className="w-[15%] px-4">
                    {request.date.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    })}
                </span>
                <span className="w-[20%] px-4 text-xs">
                    <Badge text={statusText} color={statusColor} />
                </span>
                <span className="w-[15%] px-4">TBD</span>
                <div className="w-[10%] px-4 flex align-center">
                    <ViewIcon />
                    <TrashIcon />
                </div>
                
            </div>
        </>
    );
}
