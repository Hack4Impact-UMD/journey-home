"use client";

import { useMemo } from "react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { AdminCalendarPeople } from "../icons/AdminCalendarPeople";

// within volunteer group type, there isn't a low volunteer threshold for where the icon turns red
const Low_Volunteer_Threshold = 2;

const type_dot_color: Record<TimeBlock["type"], string> = {
    "Pickup/Delivery": "bg-[#FBCF0B]",
    "Warehouse": "bg-[#02AFC7]",
};

function formatTime(ts: { toDate: () => Date }) {
    return ts
        .toDate()
        .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        })
        .replace(":00", "")
        .toLowerCase();
}

export default function AdminCalendarSummary() {
    const { allTB, isLoading } = useTimeBlocks();

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return [...allTB].filter((tb) => tb.startTime.toDate() >= now).sort((a,b)=> a.startTime.toDate().getTime() - b.startTime.toDate().getTime()).slice(0,4);

    }, [allTB]);

    return (
        <div className="w-full h-full rounded-2xl border border-[#E7E7E7] bg-[#FFFFFF] shadow-lg shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
            <h2> Calendar </h2>
            {isLoading ? (
                <p className = "flex justify-center"> Loading... </p>
            ) : upcomingEvents.length === 0 ? (
                <p className = "flex justify-center">No Upcoming Timeblocks</p>
            ) : (
                <div className = "flex flex-col w-">
                    {upcomingEvents.map((tb) => {
                        const start = tb.startTime.toDate()
                        const dayNumber = start.getDate();
                        const month = start.toLocaleDateString("en-US", {month: "short"}).toUpperCase();
                        const weekday = start.toLocaleDateString("en-US", {weekday: "short"}).toUpperCase();
                        const volCount  = tb.volunteerGroups.reduce((sum, group) => sum + (group.volunterIDs?.length ?? 0), 0);
                        const lowVol = volCount <= Low_Volunteer_Threshold;

                        return (
                            <div key = {tb.id} className = "flex items-center ">
                                <div>
                                    <div className = "h-9 w-9 flex items-center justify-center rounded-full text-sm font-bold bg-[#666666] text-white">
                                        {dayNumber}
                                    </div>
                                    <span>
                                        {month}, {weekday}
                                    </span>
                                </div>
                                <span className = {`h-5 w-5 rounded-full ${type_dot_color[tb.type]}`}/>
                                <span> {formatTime(tb.startTime)} - {formatTime(tb.endTime)}</span>
                                <span> {tb.type}</span>
                                <span className={`flex ${lowVol ? "text-[#E16060]" : "text-[#000000]"}`}>
                                    <AdminCalendarPeople fill={lowVol ? "#E16060" : "#000000"}/>
                                    {volCount}
                                </span>
                                <span/>
                            </div>
                        )
                    })}

                </div>
            )

            }
        </div>
    );
}
