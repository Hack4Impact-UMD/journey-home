"use client";

import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { ClientRequest } from "@/types/client-requests";
import { DonationRequest } from "@/types/donations";
import { TimeBlock } from "@/types/schedule";
import { PersonIcon } from "@/components/icons/PersonIcon";
import { LocationIcon } from "@/components/icons/LocationIcon";

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

type DeliveryRow = {
    key: string;
    timeRange: string;
    name: string;
    location: string;
    type: "P" | "D";
};

export function PickupsDeliveriesSummary() {
    const { allTB, isLoading, isError } = useTimeBlocks();
    const todayBlocks = allTB.filter(isTodayBlock);

    const rows: DeliveryRow[] = todayBlocks.flatMap((tb) => {
        const timeRange = formatTimeRange(tb);
        return tb.tasks.map((task) => {
            if ("client" in task) {
                const cr = task as ClientRequest;
                return { key: `${tb.id}-${cr.id}`, timeRange, name: `${cr.client.firstName} ${cr.client.lastName}`, location: cr.client.address?.city ?? "", type: "D" as const };
            } else {
                const dr = task as DonationRequest;
                return { key: `${tb.id}-${dr.id}`, timeRange, name: `${dr.donor.firstName} ${dr.donor.lastName}`, location: dr.donor.address?.city ?? "", type: "P" as const };
            }
        });
    });

    const displayRows = rows.slice(0,4);

    return (
        <div className="h-full w-full bg-white/70 rounded-2xl border border-light-border p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-base font-bold text-text-1">Upcoming pickups/deliveries</span>
                <span className="text-sm text-[#383838]">
                    {isLoading ? "..." : <><span className="font-semibold text-text-1">{rows.length}</span> today</>}
                </span>
            </div>
            {isLoading ? (
                <span className="text-sm text-gray-400">Loading...</span>
            ) : isError ? (
                <span className="text-sm text-gray-400">Unable to load pickups or deliveries</span>
            ) : rows.length === 0 ? (
                <span className="text-sm text-gray-400">No pickups or deliveries today</span>
            ) : (
                <div className="flex flex-col gap-2">
                    {displayRows.map((row) => (
                        <div key={row.key} className="flex items-center gap-3 border border-light-border px-3 py-2 rounded-sm">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${row.type === "P" ? "bg-[#D6E8F0] text-[#4A8FA8]" : "bg-[#F5E0E0] text-[#A87070]"}`}>{row.type}</span>
                            <span className="w-20 shrink-0 text-sm">{row.timeRange}</span>
                            <span className="flex items-center gap-1 flex-1 text-sm "><PersonIcon />{row.name}</span>
                            <span className="flex items-center gap-1 text-sm "><LocationIcon />{row.location}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
