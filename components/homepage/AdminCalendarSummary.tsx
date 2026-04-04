"use client";

import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { AdminCalendarPeople } from "../icons/AdminCalendarPeople";


// within volunteer group type, there isn't a low volunteer threshold for where the icon turns red
const Low_Volunteer_Threshold = 2;

const type_dot_color: Record<TimeBlock["type"], string> = {
    "Pickup/Delivery":"bg-[#FBCF0B]",
    "Warehouse": "bg-[#02AFC7]",
}

export default function AdminCalendarSummary(){

    const {allTB, isLoading} = useTimeBlocks();

    

    return (
        <div className = "rounded-2xl border border-[#E7E7E7] bg-white shadow-[0_0_4px_0rgba(0,0,0,0.25)]">
            <h2> Calendar </h2>

        </div>
    );
}