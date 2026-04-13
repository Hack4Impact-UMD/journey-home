"use client";

import { useInventoryCategories } from "@/lib/queries/inventory";
import { useAllAccountRequests } from "@/lib/queries/users";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { InventoryIcon } from "@/components/icons/InventoryIcon";
import { DonorRequestsIcon } from "@/components/icons/DonorRequestsIcon";
import { UserManagementIcon } from "@/components/icons/UserManagementIcon";
import { ClientRequestIcon } from "@/components/icons/ClientRequestIcon";

const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function isWithin48Hours(seconds: number): boolean {
    return Date.now() - seconds * 1000 <= FORTY_EIGHT_HOURS_MS;
}

function ArrowIcon() {
    return (
        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 15l6-6M15 9H9M15 9v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type StatCardProps = {
    label: string;
    count: number;
    newCount?: number;
    icon: React.ReactNode;
    iconClassName?: string;
};

function StatCard({ label, count, newCount, icon, iconClassName }: StatCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-light-border p-4 flex flex-col gap-1 relative overflow-hidden h-40">
            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-1">{label}</span>
                <span className="text-text-1 opacity-70"><ArrowIcon /></span>
            </div>
            <span className="text-5xl font-normal text-text-1 mt-1">{count}</span>
            <span className="text-xs text-gray-400 mt-auto">
                {newCount !== undefined ? `${newCount} new today` : ""}
            </span>
            <div className={`absolute opacity-[0.15] text-[#a0c4d8] text-[5rem] ${iconClassName ?? "bottom-[-1.25rem] right-[-1.25rem]"}`}>
                {icon}
            </div>
        </div>
    );
}

export function QuickStatsSummary() {
    const { inventoryCategories, isLoading: invLoading } = useInventoryCategories();
    const { allAccounts: accountRequests, isLoading: usersLoading } = useAllAccountRequests();
    const { clientRequests, isLoading: crLoading } = useClientRequests();
    const { donationRequests, isLoading: drLoading } = useDonationRequests();

    const isLoading = invLoading || usersLoading || crLoading || drLoading;

    const lowStockCount = inventoryCategories.filter((c) => c.quantity <= c.lowThreshold).length;

    const notReviewedCR = clientRequests.filter((cr) => cr.status === "Not Reviewed");
    const newCR = notReviewedCR.filter((cr) => isWithin48Hours(cr.date.seconds)).length;

    const notReviewedDR = donationRequests.filter((dr) =>
        dr.items.some((item) => item.status === "Not Reviewed")
    );
    const newDR = notReviewedDR.filter((dr) => isWithin48Hours(dr.date.seconds)).length;

    if (isLoading) {
        return <div className="grid grid-cols-2 gap-3 animate-pulse">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-sm border border-light-border h-28" />)}
        </div>;
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            <StatCard label="Low stock items" count={lowStockCount} newCount={0} icon={<InventoryIcon />} iconClassName="bottom-[-1.25rem] right-[-1.25rem]" />
            <StatCard label="Donation requests" count={notReviewedDR.length} newCount={newDR} icon={<DonorRequestsIcon />} iconClassName="bottom-[-0.5rem] right-[-1rem]" />
            <StatCard label="Account requests" count={accountRequests.length} newCount={0} icon={<UserManagementIcon />} iconClassName="bottom-[-0.25rem] right-[-1rem]" />
            <StatCard label="Client requests" count={notReviewedCR.length} newCount={newCR} icon={<ClientRequestIcon />} iconClassName="bottom-[-0.75rem] right-[0rem]" />
        </div>
    );
}
