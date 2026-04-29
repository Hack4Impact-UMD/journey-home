"use client";
import { Calendar, momentLocalizer, EventProps, View } from "react-big-calendar";
import moment from "moment";
import { TimeBlock } from "../../types/schedule";
import { cn } from "@/lib/utils";
import { SteeringWheelIcon, UsersThreeIcon, ProhibitIcon, SealCheckIcon } from "@phosphor-icons/react";

type CalendarEvent = TimeBlock & { title: string; start: Date; end: Date };

const localizer = momentLocalizer(moment);
const minTime = new Date(); minTime.setHours(9, 0, 0, 0);
const maxTime = new Date(); maxTime.setHours(21, 0, 0, 0);

function shortenTime(time: string): string {
    return time.replace(/:00(am|pm)/i, '$1');
}

const formats = {
    timeGutterFormat: (date: Date) => shortenTime(moment(date).format('h:mma')),
    dayFormat: (date: Date) => moment(date).format('dddd D'),
};

function ShiftBlock({ event, isMonthView }: EventProps<CalendarEvent> & { isMonthView: boolean }) {
    const isPickup = event.type === "Pickup/Delivery";
    const borderBg = !event.published
        ? "border-[#BBBDBE] bg-[#F6F6F6]"
        : isPickup
        ? "border-primary bg-[#F5FAFA]"
        : "border-[#FBCF0B] bg-[#FFFCED]";

    if (isMonthView) return (
        <div className={cn(borderBg, "px-1 py-0.5 rounded-sm border-l-2 overflow-hidden truncate text-xs text-[#193347] flex items-center gap-1")}>
            <span className="shrink-0">{shortenTime(formats.timeGutterFormat(event.start))}</span>
            <span className="text-[#BBBDBE]">|</span>
            <span className="truncate font-medium">{event.name || "Unnamed Shift"}</span>
        </div>
    );

    const driverGroups = (event.volunteerGroups ?? []).filter(g => g.name.toLowerCase().includes("drive") && g.maxNum >= 1);
    const otherGroups = (event.volunteerGroups ?? []).filter(g => !g.name.toLowerCase().includes("drive"));
    const driverSigned = driverGroups.reduce((s, g) => s + g.volunterIDs.length, 0);
    const driverMax = driverGroups.reduce((s, g) => s + g.maxNum, 0);
    const otherSigned = otherGroups.reduce((s, g) => s + g.volunterIDs.length, 0);
    const otherMax = otherGroups.reduce((s, g) => s + g.maxNum, 0);
    const driverRed = event.published && driverMax > 0 && driverSigned < driverMax;
    const otherRed = event.published && otherMax > 0 && (otherSigned === 0 || otherSigned < otherMax / 2);

    const infoColor = !event.published ? "#252525" : isPickup ? "#02AFC7" : "#BE8200";

    return (
        <div className={cn(borderBg, "p-1.5 h-full flex flex-col rounded-sm cursor-pointer ml-2 border-2 overflow-hidden")}>
            <span className="font-bold text-xs text-[#193347] truncate">{event.name || "Unnamed Shift"}</span>
            <span className="text-text-1 text-xs">{shortenTime(formats.timeGutterFormat(event.start))}-{shortenTime(formats.timeGutterFormat(event.end))}</span>

            <div className="flex-1" />

            <div className="text-[0.625em]" style={{ color: infoColor }}>
                <span className="font-bold block">{event.type}</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                    {event.published
                        ? <SealCheckIcon className="w-3 h-3 mr-1" />
                        : <ProhibitIcon className="w-3 h-3 mr-1" />
                    }
                    {driverMax > 0 && (
                        <span className="flex items-center gap-0.5" style={{ color: driverRed ? "#D43D3D" : infoColor }}>
                            <SteeringWheelIcon className="w-3 h-3" />
                            {driverSigned}/{driverMax}
                        </span>
                    )}
                    {otherMax > 0 && (
                        <span className="flex items-center gap-0.5" style={{ color: otherRed ? "#D43D3D" : infoColor }}>
                            <UsersThreeIcon className="w-3 h-3" />
                            {otherSigned}/{otherMax}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

interface MasterCalendarProps {
    timeblocks: TimeBlock[];
    view: View;
    date: Date;
    onView: (v: View) => void;
    onNavigate: (d: Date) => void;
    onSelectEvent: (tb: TimeBlock) => void;
    onSelectSlot: (start: Date) => void;
}

export function MasterCalendar({ timeblocks, view, date, onView, onNavigate, onSelectEvent, onSelectSlot }: MasterCalendarProps) {
    const events: CalendarEvent[] = timeblocks.map((tb) => ({
        ...tb,
        title: tb.name || "Unnamed Shift",
        start: tb.startTime.toDate(),
        end: tb.endTime.toDate(),
    }));

    return (
        <div className="flex-1 min-h-0 text-[#6B7A99]">
            <Calendar<CalendarEvent>
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                views={["week", "month"]}
                onView={onView}
                date={date}
                onNavigate={onNavigate}
                onSelectEvent={onSelectEvent}
                selectable
                onSelectSlot={(slot) => onSelectSlot(slot.start)}
                min={minTime}
                max={maxTime}
                formats={formats}
                components={{
                    toolbar: () => null,
                    event: (props) => <ShiftBlock {...props} isMonthView={view === "month"} />,
                }}
                eventPropGetter={() => ({
                    style: {
                        backgroundColor: "transparent",
                        border: "none",
                        padding: 0,
                        borderRadius: 0,
                        boxShadow: "none",
                    },
                })}
            />
        </div>
    );
}
