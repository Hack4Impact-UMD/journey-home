"use client";

import { useMemo } from "react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { AdminCalendarPeople } from "@/components/icons/AdminCalendarPeople";
import { AdminCalendarDriver } from "@/components/icons/AdminCalendarDriver";

const type_dot_color: Record<TimeBlock["type"], string> = {
    "Pickup/Delivery": "bg-[#02AFC7]",
    "Warehouse": "bg-[#FBCF0B]",
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

    const groupedEvents = useMemo(() => {
        const groups: {dateKey: string; date: Date; events: typeof upcomingEvents}[] = []
        for (const tb of upcomingEvents){
            const date = tb.startTime.toDate();
            const dateKey = date.toDateString();
            const existing = groups.find((g) => g.dateKey == dateKey);
            if(existing){
                existing?.events.push(tb)
            }
            else{
                groups.push({dateKey, date, events:[tb]});
            }
        }
        return groups;
    }, [upcomingEvents]);


    return (
        <div className="w-full h-full rounded-xl border border-[#E7E7E7] shadow-sm px-5 pb-5 flex flex-col gap-3 bg-white/70 overflow-hidden">
            <div className = "flex flex-row pt-6 justify-between ">
                <div className = "font-semibold text-base"> Calendar </div>
            </div>
            {isLoading ? (
                <p className = "flex justify-center"> Loading... </p>
            ) : groupedEvents.length === 0 ? (
                <p className = "flex justify-center">No upcoming shifts!</p>
            ) : (
                <div className="flex flex-col gap-2 overflow-auto">
                    {groupedEvents.map(({dateKey, date, events }) => {
                        const dayNumber = date.getDate()
                        const weekday = date.toLocaleDateString("en-US", {weekday: "short"}).toUpperCase();
                        
                        return (
                            <div key = {dateKey} className = "flex flex-row border border-light-border rounded-sm">
                                <div className = "flex flex-col items-center justify-center text-center w-14 shrink-0 py-2">
                                    <span className = "font-semibold text-base text-[#6B7A99]">{dayNumber}</span>
                                    <span className = "text-xs text-[#6B7A99]">{weekday}</span>
                                </div>
                                <div className="border-l border-dotted border-[#E3E3E3] my-4" />
                                <div className = "flex flex-col pl-3 pr-4 flex-1 min-w-0">
                                    {events.map((tb, i) => {{

                                    const volGroup = tb.volunteerGroups.find(group => group.name === "Volunteers")
                                    const volCount = volGroup?.volunterIDs?.length ?? 0; 
                                    const lowVol = volCount <= (volGroup?.maxNum ?? 0)/2
                                    const driveGroup = tb.volunteerGroups.find(group => group.name.toLowerCase().includes("drive"))
                                    const driveCount = driveGroup?.volunterIDs?.length ?? 0;
                                    const lowDrive = (driveGroup?.volunterIDs.length ?? 0) !== driveGroup?.maxNum

                                    return(
                                        <div key={tb.id}>
                                        {i > 0 && <div className = "border-t border-dotted border-[#E3E3E3]"/>}
                                        <div className = "flex items-center gap-2 py-5">
                                            <span className = {`h-3.5 w-3.5 rounded-full shrink-0 ${type_dot_color[tb.type]}`}/>
                                            <span className = "w-24 shrink-0 text-sm">{formatTime(tb.startTime)}-{formatTime(tb.endTime)}</span>
                                            <span className = "flex-1 text-sm">{tb.type}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`flex text-sm items-center gap-[0.25rem] ${lowVol ? "text-[#E16060]" : "text-[#000000]"}`}>
                                                    <AdminCalendarPeople fill={lowVol ? "#E16060" : "#000000"}/>
                                                    {volCount}
                                                </span>
                                                {lowDrive && (
                                                    <span className={`flex text-sm items-center gap-[0.25rem] text-[#E16060]`}>
                                                        <AdminCalendarDriver fill="#E16060"/>
                                                        {driveCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                    );
                                    }})}
                                </div>
                            </div>  
                        )
                    })}
                </div>
            )}
        </div>
    );
}
