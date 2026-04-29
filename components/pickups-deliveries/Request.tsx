"use client";

import { useState } from "react";
import ScheduleModal from "./ScheduleModal";
import { PhoneIcon } from "../icons/PhoneIcon";
import { EmailIcon } from "../icons/EmailIcon";
import { Task } from "@/types/schedule";
import { useTimeBlocks } from "@/lib/queries/timeblocks";

type RequestProps = {
    donation: Task;
}

export function getTotalItems(donation: Task) {
  if ("donor" in donation) {
    return donation.items.filter(item => item.status === "Approved").length;
  } else {
    return donation.items.reduce((sum, item) => sum + (item.quantity), 0);
  }
}

export function countItemsInRequest(donation: Task) {
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

export default function PickupDeliveryCard({ donation }: RequestProps) {  
    let firstName, lastName, email, phoneNumber, streetAddress, city, state, zipCode, title, color, text;
    if ("donor" in donation) { 
        //items = donation.items.filter(dItem => dItem.status === 'Approved').map(dItem => ({ name: dItem.item.name }));
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
        text = "#004F7F"
    } else {
        //items = donation.items
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
        text = "#4C2337"
        
    }

    const  itemCounts  = countItemsInRequest(donation);
    const  totalItems = getTotalItems(donation);
    //track the modal opening
    const [isOpen, setOpen] = useState(false);

    const { allTB } = useTimeBlocks();
    const scheduledBlock = donation.associatedTimeBlockID
        ? allTB.find(tb => tb.id === donation.associatedTimeBlockID) ?? null
        : null;
    const scheduledLabel = scheduledBlock
        ? scheduledBlock.startTime.toDate().toLocaleString("en-US", {
            weekday: "short", month: "short", day: "numeric",
            hour: "numeric", minute: "2-digit"
          })
        : null;

    return (
        <div className="w-[18.5em] h-[25em] max-w-full rounded-lg shadow-md flex flex-col">
            <div className="w-fixed h-14 rounded-t-lg text-lg p-4 items-center flex text-center justify-center font-bold" style={{background: color, color: text}}>
                {title} {"donor" in donation ? "From" : "To"} {firstName} {lastName}
            </div>
            <div className="m-2 flex-1">
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
                        <p> {city}, {state} {zipCode}</p>
                    </div>
                </div>
                <div className="p-2 max-h-40">
                    <div className="text-md font-bold">{totalItems} {totalItems == 1 ? "Item" : "Items"} </div>
                    <div className="text-sm ml-2 breakwords line-clamp-4">
                        {itemCounts.map((line, idx) => (
                            <li key={idx}>• {line}</li>
                        ))}
                        
                    </div>
                </div>
            </div>

            <div className="flex items-center px-4 pb-4">
                <div className="flex-1 flex justify-center">
                    {scheduledLabel && (
                        <div className="text-xs text-center">
                            <span className="font-bold">Scheduled:</span>
                            <br />
                            <span>{scheduledLabel}</span>
                        </div>
                    )}
                </div>
                <button onClick={() => setOpen(true)} className="border rounded-xs px-4 py-1">
                    {scheduledBlock ? "Reschedule" : "Schedule"}
                </button>
            </div>
       
            {/*need to adjust for the new changes in the modal*/}
            {isOpen && <ScheduleModal 
                scheduleRequest= {donation}
                onClose={() => setOpen(false)} 
            />}
        </div>
    )
}