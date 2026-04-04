"use client";

import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { ClientRequest } from "@/types/client-requests";
import { DonationRequest } from "@/types/donations";
import { TimeBlock } from "@/types/schedule";

function isTodayBlock(tb: TimeBlock): boolean {
    const d = new Date(tb.startTime.seconds * 1000);
    const now = new Date();
    return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
    );
}

function formatTimeRange(tb: TimeBlock): string {
    const fmt = (ts: { seconds: number }) =>
        new Date(ts.seconds * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${fmt(tb.startTime)}-${fmt(tb.endTime)}`;
}

function PersonIcon() {
    return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6" strokeLinecap="round" />
        </svg>
    );
}

function LocationIcon() {
    return (
        <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6c0 3.75 4.5 8.5 4.5 8.5S12.5 9.75 12.5 6c0-2.485-2.015-4.5-4.5-4.5z" />
            <circle cx="8" cy="6" r="1.5" />
        </svg>
    );
}

type DeliveryRow = {
    id: string;
    timeRange: string;
    name: string;
    location: string;
    type: "P" | "D";
};

export function PickupsDeliveriesSummary() {
    const { allTB, isLoading } = useTimeBlocks();
    const todayBlocks = allTB.filter(isTodayBlock);

    const rows: DeliveryRow[] = todayBlocks.flatMap((tb) => {
        const timeRange = formatTimeRange(tb);
        return tb.tasks.map((task) => {
            if ("client" in task) {
                const cr = task as ClientRequest;
                return { id: cr.id, timeRange, name: `${cr.client.firstName} ${cr.client.lastName}`, location: cr.client.address?.city ?? "", type: "D" as const };
            } else {
                const dr = task as DonationRequest;
                return { id: dr.id, timeRange, name: `${dr.donor.firstName} ${dr.donor.lastName}`, location: dr.donor.address?.city ?? "", type: "P" as const };
            }
        });
    });

    return (
        <div className="bg-white rounded-sm border border-light-border p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1">Upcoming pickups/deliveries</span>
                <span className="text-sm text-[#666]"><span className="font-semibold text-text-1">{todayBlocks.length}</span> today</span>
            </div>
            {isLoading ? (
                <span className="text-sm text-[#A2A2A2]">Loading...</span>
            ) : rows.length === 0 ? (
                <span className="text-sm text-[#A2A2A2]">No pickups or deliveries today</span>
            ) : (
                <div className="flex flex-col gap-2">
                    {rows.map((row) => (
                        <div key={row.id} className="flex items-center gap-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${row.type === "P" ? "bg-primary" : "bg-secondary-1"}`}>{row.type}</span>
                            <span className="w-20 shrink-0 text-xs text-[#666]">{row.timeRange}</span>
                            <span className="flex items-center gap-1 flex-1 text-xs text-[#666]"><PersonIcon />{row.name}</span>
                            <span className="flex items-center gap-1 text-xs text-[#666]"><LocationIcon />{row.location}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
