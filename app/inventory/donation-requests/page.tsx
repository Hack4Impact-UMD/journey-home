"use client";

import { DRContentsTable } from "@/components/donation-requests/DRContentsTable";
import { DRTable } from "@/components/donation-requests/DRTable";
import { ItemReviewModal } from "@/components/donation-requests/ItemReviewModal";
import { SearchBox } from "@/components/inventory/SearchBox";
import { SortOption } from "@/components/inventory/SortOption";
import { searchRequest } from "@/lib/services/donations";
import { DonationItem, DonationRequest, DonationSearchParams } from "@/types/donations";
import { useEffect, useState } from "react";

export default function DonationRequestsPage() {
    const [selectedDR, setSelectedDR] = useState<DonationRequest | null>(null);
    const [selectedItem, setSelectedItem] = useState<DonationItem | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchParams, setSearchParams] = useState<DonationSearchParams>({status: [], sortBy: "Date", ascending:false})
    const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);

    const search = () => {
        searchRequest(searchQuery, searchParams).then((res) => {
            setDonationRequests(res);
        });
    }

    useEffect(() => {
        search();
    }, [searchParams])

    return selectedDR ? (
        <>
            {selectedItem && <ItemReviewModal dr={selectedDR} item={selectedDR.items[0]} onClose={() => setSelectedItem(null)}/>}
            <div className="flex flex-col">
                <div className="flex gap-3">
                    <button 
                        className="w-16 h-8 text-white bg-primary rounded-xs text-sm"
                        onClick={() => setSelectedDR(null)}
                    >
                        Back
                    </button>
                    <SearchBox value={""} onChange={()=>{}} onSubmit={() => {}}/>
                    <SortOption label="Date" onChange={()=>{}} status="none"/>
                    <SortOption label="Qnt" onChange={()=>{}} status="none"/>
                </div>

                <span className="font-bold py-4.5">
                    {selectedDR.donor.firstName} {selectedDR.donor.lastName}
                </span>
            </div>
            <DRContentsTable request={selectedDR} openItem={setSelectedItem}/>
        </>
    ) : (
        <>
            <div className="flex flex-col mb-6">
                <div className="flex gap-3">
                    <SearchBox value={searchQuery} onChange={setSearchQuery} 
                    onSubmit={() => {
                        searchRequest(searchQuery, searchParams).then((res) => {
                            setDonationRequests(res);
                        })
                    }}/>
                    <SortOption 
                        label="Date" 
                        status={
                            (searchParams.sortBy != "Date") ? "none" :
                            (searchParams.ascending) ? "asc" : "desc"
                        }
                        onChange={status => {
                            setSearchParams(prev => ({...prev, sortBy: "Date", ascending: (status == "asc")}));
                        }}
                    />
                    <SortOption 
                        label="Qnt" 
                        status={
                            (searchParams.sortBy != "Quantity") ? "none" :
                            (searchParams.ascending) ? "asc" : "desc"
                        }
                        onChange={status => {
                            setSearchParams(prev => ({...prev, sortBy: "Quantity", ascending: (status == "asc")}));
                        }}
                    />
                </div>

            </div>
            <DRTable donationRequests={donationRequests} openDR={setSelectedDR} />
        </>
    );
}
