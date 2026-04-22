"use client";

import { useInventoryCategories } from "@/lib/queries/inventory";
import { useAllAccountRequests } from "@/lib/queries/users";
import { useClientRequests } from "@/lib/queries/client-requests";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { useWarehouseHistory } from "@/lib/queries/warehouse-history";
import { InventoryIcon } from "@/components/icons/InventoryIcon";
import { DonorRequestsIcon } from "@/components/icons/DonorRequestsIcon";
import { UserManagementIcon } from "@/components/icons/UserManagementIcon";
import { ClientRequestIcon } from "@/components/icons/ClientRequestIcon";
import { useMemo } from "react";
import { ArrowDiagonalIcon } from "@/components/icons/ArrowDiagonalIcon";

function isFromToday(seconds: number): boolean {
    const itemDate = new Date(seconds * 1000);
    const now = new Date();
    return (
        itemDate.getFullYear() === now.getFullYear() &&
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getDate() === now.getDate()
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
        <div className="bg-white/70 shadow-sm rounded-2xl border border-light-border p-4 flex flex-col gap-3 relative overflow-hidden h-40">
            <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-text-1">{label}</span>
                <span className="text-text-1"><ArrowDiagonalIcon /></span>
            </div>
            <span className="text-5xl font-normal text-text-1 mt-1">{count}</span>
            <span className="text-base text-[#919393] mt-auto">
                {newCount !== undefined ? `${newCount} new today` : ""}
            </span>
            <div className={`absolute text-[#CBDFE2] text-[5rem] ${iconClassName ?? "bottom-[-1.25rem] right-[-1.25rem]"}`}>
                {icon}
            </div>
        </div>
    );
}

export function QuickStatsSummary() {
    const { inventoryCategories, isLoading: invLoading, isError: invError} = useInventoryCategories();
    const { allAccounts: accountRequests, isLoading: usersLoading, isError: usersError} = useAllAccountRequests();
    const { clientRequests, isLoading: crLoading, isError: crError} = useClientRequests();
    const { donationRequests, isLoading: drLoading, isError: drError } = useDonationRequests();
    const { changes: warehouseHistory, isLoading: whLoading, isError: whError} = useWarehouseHistory();

    const isLoading = invLoading || usersLoading || crLoading || drLoading || whLoading;
    const isError = invError || usersError || crError || drError || whError;

    const lowStockCategories = inventoryCategories.filter((c) => c.quantity <= c.lowThreshold);
    const lowStockCount = lowStockCategories.length;

    const notReviewedCR = clientRequests.filter((cr) => cr.status === "Not Reviewed");
    const newCR = notReviewedCR.filter((cr) => isFromToday(cr.date.seconds)).length;

    const notReviewedDR = donationRequests.filter((dr) =>
        dr.items.some((item) => item.status === "Not Reviewed")
    );
    const newDR = notReviewedDR.filter((dr) => isFromToday(dr.date.seconds)).length;

    const newLowStock = useMemo(() => {
        const oneDayAgo = Date.now() - 25*60*60*1000; 
        const recentChanges = warehouseHistory.filter(
            (entry) => entry.timestamp.toDate().getTime() >= oneDayAgo
        );
        const categoriesGoneLow = new Set(
            recentChanges
            .filter((entry) => {
                const cat = inventoryCategories.find((c) => c.name == entry.change.category);
                return cat && entry.change.newQuantity <= cat.lowThreshold && entry.change.oldQuantity > cat.lowThreshold;

            }).map((entry) => entry.change.category)
        );
        return categoriesGoneLow.size;
    }, [warehouseHistory, inventoryCategories]);


    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 animate-pulse h-full w-full">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/70 rounded-2xl border border-light-border h-40" />
                ))}
            </div>
        );
    }

    if (isError) {
        return (
            <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-white/70 rounded-2xl border border-light-border p-4 flex items-center justify-center h-40">
                    <span className="text-sm text-gray-400">Unable to load stats</span>
                </div>
            </div>
        );
    }

    if(isError){
        return (
            <div className = "h-full w-full flex itmes-center justify-center rounded-xl border border-light-border bg-white/70">
                <p className = "text-sm  text-[#919393]"> Failed to load stats</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-3 h-full w-full">
            <StatCard label="Low stock items" count={lowStockCount} newCount={newLowStock} icon={<InventoryIcon />} iconClassName="bottom-[-1.25rem] right-[-1.25rem]" />
            <StatCard label="Donation requests" count={notReviewedDR.length} newCount={newDR} icon={<DonorRequestsIcon />} iconClassName="bottom-[-0.5rem] right-[-1rem]" />
            <StatCard label="Account requests" count={accountRequests.length} icon={<UserManagementIcon />} iconClassName="bottom-[-0.25rem] right-[-1rem]" />
            <StatCard label="Client requests" count={notReviewedCR.length} newCount={newCR} icon={<ClientRequestIcon />} iconClassName="bottom-[-0.75rem] right-[0rem]" />
        </div>
    );
}
