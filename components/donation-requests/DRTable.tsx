import { DonationRequest } from "@/types/donations";
import { Badge } from "../inventory/Badge";
import { DogSitIcon } from "@/components/icons/DogSitIcon";
import { DropdownIcon } from "../icons/DropdownIcon";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { useEffect, useState } from "react";

export function DRTable({
    donationRequests,
    openDR,
    showResponded = true,
}: {
    donationRequests: DonationRequest[];
    openDR: (dr: DonationRequest) => void;
    showResponded?: boolean;
}) {
    return (
        <div className="w-full min-w-5xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                {showResponded ? (
                    <>
                        <span className="w-[21.56%] border-l-2 border-light-border px-4">Name</span>
                        <span className="w-[19.29%] border-l-2 border-light-border px-4">Email</span>
                        <span className="w-[12.77%] border-l-2 border-light-border px-4">Phone</span>
                        <span className="w-[12.77%] border-l-2 border-light-border px-4"># Accepted</span>
                        <span className="w-[9.99%] border-l-2 border-light-border px-4">Date</span>
                        <span className="w-[9.89%] border-l-2 border-light-border px-4">Responded</span>
                        <span className="w-[13.70%] border-l-2 border-light-border px-4">Acquisition</span>
                    </>
                ) : (
                    <>
                        <span className="w-[21.73%] border-l-2 border-light-border px-4">Name</span>
                        <span className="w-[19.46%] border-l-2 border-light-border px-4">Email</span>
                        <span className="w-[12.94%] border-l-2 border-light-border px-4">Phone</span>
                        <span className="w-[12.09%] border-l-2 border-light-border px-4">Quantity</span>
                        <span className="w-[18.78%] border-l-2 border-light-border px-4">Review Progress</span>
                        <span className="w-[9.99%] border-l-2 border-light-border px-4">Date</span>
                    </>
                )}
            </div>
            <div className="flex-1 overflow-auto min-h-0">
                {donationRequests.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 py-8">
                        <DogSitIcon />
                        <p className="text-sm text-[#A2A2A2]">No donation requests found.</p>
                    </div>
                ) : donationRequests.map((dr) => (
                    <DRTableRow
                        request={dr}
                        onOpen={() => openDR(dr)}
                        showResponded={showResponded}
                        key={dr.id}
                    />
                ))}
            </div>
        </div>
    );
}

function DRTableRow({
    request,
    onOpen,
    showResponded,
}: {
    request: DonationRequest;
    onOpen: () => void;
    showResponded: boolean;
}) {
    const numReviewed = request.items.filter(
        (item) => item.status === "Approved" || item.status === "Denied",
    ).length;
    const numAccepted = request.items.filter((item) => item.status === "Approved").length;
    const total = request.items.length;

    const [responded, setResponded] = useState(request.responded);

    useEffect(() => {
        setResponded(request.responded);
    }, [request.responded]);

    const { setDonationRequestToast } = useDonationRequests();

    const colorClass = responded
        ? "bg-[#E7F9E8] border-[#BCDABE]"
        : "bg-[#FBDED9] border-[#D7B7B1]";

    const reviewPct = total > 0 ? (numReviewed / total) * 100 : 0;

    return (
        <div
            className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            onClick={onOpen}
        >
            {showResponded ? (
                <>
                    <span className="w-[21.56%] px-4 truncate">
                        {request.donor.firstName} {request.donor.lastName}
                    </span>
                    <span className="w-[19.29%] px-4 truncate">{request.donor.email}</span>
                    <span className="w-[12.77%] px-4 truncate">{request.donor.phoneNumber}</span>
                    <span className="w-[12.77%] px-4 truncate">{numAccepted}/{total}</span>
                    <span className="w-[9.99%] px-4 truncate">
                        {request.date.toDate().toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                        })}
                    </span>
                    <span className="w-[9.89%] px-4" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="outline-0">
                                <button className={`border rounded-xs flex items-center justify-between px-2 w-[3.62rem] h-5.5 ${colorClass}`}>
                                    <span>{responded ? "Yes" : "No"}</span>
                                    <DropdownIcon />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-sm font-family-roboto text-xs p-0">
                                {["Yes", "No"].map((option) => (
                                    <DropdownMenuCheckboxItem
                                        key={option}
                                        className="text-xs cursor-pointer"
                                        checked={(option === "Yes") === responded}
                                        onCheckedChange={async (checked) => {
                                            if (!checked) return;
                                            const value = option === "Yes";
                                            setResponded(value);
                                            await setDonationRequestToast({ ...request, responded: value });
                                        }}
                                    >
                                        {option}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </span>
                    <span className="w-[13.70%] px-4 text-xs">
                        <Badge
                            text={request.canDropOff ? "Can Drop Off" : "Needs Pickup"}
                            color={request.canDropOff ? "indigo" : "orange"}
                        />
                    </span>
                </>
            ) : (
                <>
                    <span className="w-[21.73%] px-4 truncate">
                        {request.donor.firstName} {request.donor.lastName}
                    </span>
                    <span className="w-[19.46%] px-4 truncate">{request.donor.email}</span>
                    <span className="w-[12.94%] px-4 truncate">{request.donor.phoneNumber}</span>
                    <span className="w-[12.09%] px-4 truncate">{total}</span>
                    <span className="w-[18.78%] px-4 flex items-center gap-2">
                        <span className="shrink-0">{numReviewed}/{total}</span>
                        <div className="flex-1 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden shrink-0 outline outline-[#d9d9d9]">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{ width: `${Math.min(reviewPct, 100)}%`, backgroundColor: "#02AFC7" }}
                            />
                        </div>
                    </span>
                    <span className="w-[9.99%] px-4 truncate">
                        {request.date.toDate().toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                        })}
                    </span>
                </>
            )}
        </div>
    );
}

