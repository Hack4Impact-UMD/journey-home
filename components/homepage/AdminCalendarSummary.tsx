"use client";

import { useMemo } from "react";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { TimeBlock } from "@/types/schedule";
import { AdminCalendarPeople } from "@/components/icons/AdminCalendarPeople";
import { AdminCalendarDriver } from "@/components/icons/AdminCalendarDriver";

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

    const unfilledCount = useMemo(() => {
        return upcomingEvents.filter((tb) => {
            const driveGroup = tb.volunteerGroups.find((g) => g.name === "Lead Drivers ONLY");
            const volGroup = tb.volunteerGroups.find((g)=> g.name === "Volunteers");
            const lowDrive = (driveGroup?.volunterIDs.length?? 0) !== driveGroup?.maxNum;
            const lowVol = (volGroup?.volunterIDs?.length ?? 0) <= (volGroup?.maxNum ?? 0) /2;
            return lowDrive || lowVol;
        }).length
    },[upcomingEvents]);

    return (
        <div className="w-full h-full rounded-xl border border-[#E7E7E7] shadow-sm px-4 pb-4 flex flex-col gap-3 bg-white/70">
            <div className = "flex flex-row pt-6 justify-between ">
                <div className = "font-semibold text-base"> Calendar </div>
                <div className = "text-sm text-[#383838] "> {unfilledCount}/{upcomingEvents.length} shifts unfilled</div>
            </div>
            {isLoading ? (
                <p className = "flex justify-center"> Loading... </p>
            ) : groupedEvents.length === 0 ? (
                <p className = "flex justify-center">No upcoming shifts!</p>
            ) : (
                <div className = " flex flex-col gap-2">
                    {groupedEvents.map(({dateKey, date, events }) => {
                        const dayNumber = date.getDate()
                        const weekday = date.toLocaleDateString("en-US", {weekday: "short"}).toUpperCase();
                        
                        return (
                            <div key = {dateKey} className = "flex flex-row border border-[#E3E3E3] rounded-sm bg-white">
                                <div className = "flex flex-col items-center justify-center text-center w-14 shrink-0 py-2">
                                    <span className = "font-semibold text-base text-[#6B7A99]">{dayNumber}</span>
                                    <span className = "text-xs text-[#6B7A99]">{weekday}</span>
                                </div>
                                <span className="w-px bg-[#E3E3E3] my-4 " />
                                <div className = "flex flex-col px-3 ">
                                    {events.map((tb, i) => {{

                                    const volGroup = tb.volunteerGroups.find(group => group.name === "Volunteers")
                                    const volCount = volGroup?.volunterIDs?.length ?? 0; 
                                    const lowVol = volCount <= (volGroup?.maxNum ?? 0)/2
                                    const driveGroup = tb.volunteerGroups.find(group => group.name === "Lead Drivers ONLY")
                                    const driveCount = driveGroup?.volunterIDs?.length ?? 0;
                                    const lowDrive = (driveGroup?.volunterIDs.length ?? 0) !== driveGroup?.maxNum

                                    return(
                                        <>
                                        {i > 0 && <div className = "border-t border-dotted border-[#E3E3E3]"/>}
                                        <div key = {tb.id} className = "grid grid-cols-[2rem_5rem_9rem_2rem_2rem] items-center gap-2 py-5">
                                            <span className = {`h-[0.875rem] w-[0.875rem] rounded-full ${type_dot_color[tb.type]}`}/>
                                            <span className = "text-sm"> {formatTime(tb.startTime)}-{formatTime(tb.endTime)}</span>
                                            <span className = "text-sm"> {tb.type}</span>
                                            <span className={`flex text-sm items-center justify-end gap-[0.25rem] ${lowVol ? "text-[#E16060]" : "text-[#000000]"}`}>
                                                <AdminCalendarPeople fill={lowVol ? "#E16060" : "#000000"}/>
                                                {volCount}
                                            </span>
                                            {lowDrive ? (
                                            <span className={`flex text-sm items-center justify-end gap-[0.25rem] ${lowDrive ? "text-[#E16060]" : "text-[#000000]"}`}>
                                                <AdminCalendarDriver fill={lowDrive ? "#E16060" : "#000000"}/>
                                                {driveCount}
                                            </span>): 
                                            (
                                                <div/>
                                            )}
                                        </div>
                                        </>
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
