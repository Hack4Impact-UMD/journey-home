"use client";

import ScheduleButton from "@/components/pickups-deliveries/ScheduleButton";
import { useState } from "react";
import { DonationRequest } from "@/types/donations";
import ScheduleModal from "./ScheduleModal";
import { ClientRequest } from "@/types/client-requests";
import { PhoneIcon } from "../icons/PhoneIcon";
import { EmailIcon } from "../icons/EmailIcon";

type RequestProps = {
    donation: DonationRequest | ClientRequest;
}

export function getTotalItems(donation: DonationRequest | ClientRequest) {
  if ("donor" in donation) {
    return donation.items.filter(item => item.status === "Approved").length;
  } else {
    return donation.items.reduce((sum, item) => sum + (item.quantity), 0);
  }
}

export function countItemsInRequest(donation: DonationRequest | ClientRequest) {
    const counts: Record<string, number> = {};

    if ("donor" in donation) {
        donation.items.filter(item => item.status === "Approved").forEach(item => {
            const name = item.item.name;
            counts[name] = (counts[name] || 0) + 1;
        });
    } else if ("client" in donation) {
        donation.items.forEach(item => {
            const name = item.name;
            counts[name] = (counts[name] || 0) + (item.quantity || 1);
        });
    }
    return Object.entries(counts).map(
        ([name, count]) => `${count} ${name}`
    );
}

export default function Request({ donation }: RequestProps) {  
    let items, firstName, lastName, email, phoneNumber, streetAddress, city, state, zipCode, title, color;
    if ("donor" in donation) { 
        items = donation.items.filter(dItem => dItem.status === 'Approved').map(dItem => ({ name: dItem.item.name }));
        firstName = donation.donor.firstName
        lastName = donation.donor.lastName
        email = donation.donor.email
        phoneNumber = donation.donor.phoneNumber 
        streetAddress = donation.donor.address.streetAddress 
        city = donation.donor.address.city
        state = donation.donor.address.state
        zipCode = donation.donor.address.zipCode
        title = "Pickup"
        color = "#D5e7F2"
    } else {
        items = donation.items
        firstName = donation.client.firstName
        lastName = donation.client.lastName
        email = donation.client.email
        phoneNumber = donation.client.phoneNumber 
        streetAddress = donation.client.address.streetAddress 
        city = donation.client.address.city
        state = donation.client.address.state
        zipCode = donation.client.address.zipCode
        title = "Delivery"
        color = "#F8DFEB"
        
    }

    const  itemCounts  = countItemsInRequest(donation);
    const  totalItems = getTotalItems(donation);
    //track the modal opening
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="w-[19em] h-[24em] max-w-full border-2 rounded-lg shadow-md relative">
            <div className="w-fixed h-14 rounded-t-lg text-lg p-4 items-center flex text-center justify-center font-bold" style={{background: color}}>
                {title} from {firstName} {lastName}
            </div>
            <div className="m-2">
                <div className="p-2">
                    <div className="text-md font-bold">Contact  </div>
                    <div className="text-sm break-words">
                        <a href={`mailto:${email}`} className="flex flex-row items-center gap-1">{email} <EmailIcon/></a>
                        <a href={`tel:${phoneNumber}`} className="flex flex-row items-center gap-1">{phoneNumber} < PhoneIcon/></a>  
                    </div>
                </div>
                <div className="p-2">
                    <div className="text-md font-bold">Address </div>
                    <div className="text-sm break-words">
                        <p>{streetAddress}</p>
                        <p> {city} {state} {zipCode}</p>
                    </div>
                </div>
                <div className="p-2 max-h-[10em] overflow-hidden">
                    <div className="text-md font-bold">{totalItems} Items </div>
                    <div className="text-sm ml-6 breakwords line-clamp-4">
                        {itemCounts.map((line, idx) => (
                            <li key={idx}>{line}</li>
                        ))}
                        
                    </div>
                </div>
            </div>

            <div className="w-22 h-8 absolute bottom-2 right-4">
                <ScheduleButton onOpen={() => setOpen(true)}/>
            </div>
       
            {/*need to adjust for the new changes in the modal*/}
            {isOpen && <ScheduleModal onClose={() => setOpen(false) /*also need to collect timeslot if needed*/}/>}
        </div>
    )
}