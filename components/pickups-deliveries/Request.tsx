"use client";

import ScheduleButton from "@/components/pickups-deliveries/ScheduleButton";
import ScheduleModal from "./ScheduleModal";
// import { DonationRequest } from "@/types/donations";
import { useState } from "react";

export default function Request() {

    //track the modal opening
    const [isOpen, setOpen] = useState(false);

    return (
        <div className="w-64 h-32 border-2 rounded-lg shadow-md">
            I AM A BOX! 
            <ScheduleButton onOpen={() => setOpen(true)}/>
            {isOpen && <ScheduleModal onClose={() => setOpen(false) /*also need to collect timeslot if needed*/}/>}
        </div>
    )
}