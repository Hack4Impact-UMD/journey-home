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
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="10" cy="10" r="8" />
            <path d="M7.5 12.5l5-5M12.5 7.5H7.5M12.5 7.5v5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

type StatCardProps = {
    label: string;
    count: number;
    newCount?: number;
    icon: React.ReactNode;
    href?: string;
};

function StatCard({ label, count, newCount, icon }: StatCardProps) {
    return (
        <div className="bg-white rounded-sm border border-light-border p-4 flex flex-col gap-1 relative overflow-hidden flex-1">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-1">{label}</span>
                <span className="text-text-1 opacity-60"><ArrowIcon /></span>
            </div>
            <span className="text-4xl font-bold text-text-1 mt-1">{count}</span>
            {newCount !== undefined && newCount > 0 && (
                <span className="text-xs text-primary font-medium">{newCount} new</span>
            )}
            {newCount === undefined && <span className="text-xs text-transparent select-none">—</span>}
            <div className="absolute bottom-2 right-3 opacity-[0.07] scale-[2.2] origin-bottom-right">
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
            <StatCard label="Low stock items" count={lowStockCount} icon={<InventoryIcon />} />
            <StatCard label="Donation requests" count={notReviewedDR.length} newCount={newDR} icon={<DonorRequestsIcon />} />
            <StatCard label="Account requests" count={accountRequests.length} icon={<UserManagementIcon />} />
            <StatCard label="Client requests" count={notReviewedCR.length} newCount={newCR} icon={<ClientRequestIcon />} />
        </div>
    );
}
