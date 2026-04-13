"use client";

import { useMemo } from "react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { AdminCalendarPeople } from "@/components/icons/AdminCalendarPeople";
import { AdminCalendarDriver } from "@/components/icons/AdminCalandarDriver";

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
        .toLowerCase()
        .replaceAll(" ", "");
}

export default function AdminCalendarSummary() {
    const { allTB, isLoading } = useTimeBlocks();

    const upcomingEvents = useMemo(() => {
        const now = new Date();
        return [...allTB].filter((tb) => tb.startTime.toDate() >= now).sort((a,b)=> a.startTime.toDate().getTime() - b.startTime.toDate().getTime()).slice(0,4);

    }, [allTB]);

    return (
        <div className="w-full rounded-2xl border border-[#E7E7E7] bg-white shadow-sm px-4 pb-4 flex flex-col gap-3">
            <div className = "my-[1rem] font-bold text-lg"> Calendar </div>
            <div className="mt-[1rem] border-b border-[#E3E3E3]" />
            {isLoading ? (
                <p className = "flex justify-center"> Loading... </p>
            ) : upcomingEvents.length === 0 ? (
                <p className = "flex justify-center">No Upcoming Timeblocks</p>
            ) : (
                <div className = " flex flex-col">
                    {upcomingEvents.map((tb) => {
                        const start = tb.startTime.toDate()
                        const dayNumber = start.getDate();
                        const month = start.toLocaleDateString("en-US", {month: "short"}).toUpperCase();
                        const weekday = start.toLocaleDateString("en-US", {weekday: "short"}).toUpperCase();
                        const volGroup = tb.volunteerGroups.find(group => group.name === "Volunteers")
                        const volCount = volGroup?.volunterIDs?.length ?? 0; 
                        const lowVol = volCount <= (volGroup?.maxNum ?? 0)/2
                        const driveGroup = tb.volunteerGroups.find(group => group.name === "Lead Drivers ONLY")
                        const lowDrive = (driveGroup?.volunterIDs.length ?? 0) !== driveGroup?.maxNum

                        return (
                            <div key = {tb.id} className = "grid grid-cols-[2.5rem_6rem_1rem_7rem_1fr_3rem_3rem] items-center text-center gap-2 border-b border-[#E3E3E3] py-4">
                                <div className = "h-9 w-9 flex items-center justify-center rounded-full text-sm font-bold bg-[#02AFC7] text-white">
                                    {dayNumber}
                                </div>
                                <span className = "text-[#6B7A99] font-semibold">{month}, {weekday} </span>
                                <span className = {`h-5 w-5 rounded-full ${type_dot_color[tb.type]}`}/>
                                <span> {formatTime(tb.startTime)}-{formatTime(tb.endTime)}</span>
                                <span> {tb.type}</span>
                                <span className={`flex items-center gap-[0.25rem] ${lowVol ? "text-[#E16060]" : "text-[#000000]"}`}>
                                    <AdminCalendarPeople fill={lowVol ? "#E16060" : "#000000"}/>
                                    {volCount}
                                </span>
                                {lowDrive ? (
                                <span className={`flex items-center gap-[0.25rem] ${lowDrive ? "text-[#E16060]" : "text-[#000000]"}`}>
                                    <AdminCalendarDriver fill={lowDrive ? "#E16060" : "#000000"}/>
                                    {volCount}
                                </span>): 
                                (
                                    <div/>
                                )}
                            </div>
                        )
                    })}
                </div>
            )
            
            }
        </div>
    );
}
