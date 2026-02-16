"use client";

import ScheduleButton from "@/components/pickups-deliveries/ScheduleButton";
import { SearchBox } from "../inventory/SearchBox";
import { useState } from "react";
import { DropdownMultiselect } from "../inventory/DropdownMultiselect";
import { SortOption } from "../inventory/SortOption";
import { DonationRequest } from "@/types/donations";
import ScheduleModal from "./ScheduleModal";

type RequestProps = {
    donation: DonationRequest;
}

export default function Request({ donation }: RequestProps) {   
    const items = donation.items.filter(item => item.status == 'Approved')

    //track the modal opening
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="w-75 h-90 border-2 rounded-t-lg shadow-md relative">
            <div className="w-fixed h-14 bg-[#D5E7F2] rounded-t-lg text-lg items-center flex text-center justify-center font-bold">
                Pickup from {donation.donor.firstName} {donation.donor.lastName}
            </div>
            <div className="m-2">
                <div className="p-2">
                    <div className="text-md font-bold">Contact  </div>
                    <div className="text-base">{donation.donor?.email} {donation.donor?.phoneNumber}</div>
                </div>
                <div className="p-2">
                    <div className="text-md font-bold">Address </div>
                    <div className="text-base">{donation.donor.address.streetAddress} {donation.donor.address.city} {donation.donor.address.state} {donation.donor.address.zipCode}</div>
                </div>
                <div className="p-2">
                    <div className="text-md font-bold"> Items </div>
                    <div className="text-base ml-6">
                    {items.map((item, index) => (
                        <li key={index}>
                            {item.item.name} 
                        </li>
                    ))}
                    </div>
                </div>
            </div>

            <div className="w-22 h-8 absolute mb-4 right-4">
                <ScheduleButton onOpen={() => setOpen(true)}/>
            </div>
       
            {isOpen && <ScheduleModal onClose={() => setOpen(false) /*also need to collect timeslot if needed*/}/>}
        </div>
    )
}