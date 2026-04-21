"use client";
import { Calendar, momentLocalizer, EventProps, View } from "react-big-calendar";
import moment from "moment";
import { TimeBlock } from "../../types/schedule";
import { cn } from "@/lib/utils";
import { BadgeCheck, BadgeCheckIcon, BanIcon } from "lucide-react";

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


    const totalVols = event.volunteerGroups?.reduce((s, g) => s + g.volunterIDs.length, 0) ?? 0;
    const maxVols   = event.volunteerGroups?.reduce((s, g) => s + g.maxNum, 0) ?? 0;

    if (isMonthView) return <span className="text-xs">{event.title}</span>;

    return (
        <div className={cn(event.type == "Pickup/Delivery" ? "bg-[#F5FAFA] border-primary text-primary" : "bg-[#FFFCED] border-[#FBCF0B] text-[#BE8200]", " p-1.5 h-full flex flex-col rounded-sm cursor-pointer ml-2 border-2 overflow-hidden")}>
            <span className="font-bold text-sm">{event.name}</span>
            <span className="text-text-1 text-xs">{shortenTime(formats.timeGutterFormat(event.start))}-{shortenTime(formats.timeGutterFormat(event.end))}</span>

            {
                (event.published) ?
                <span className="text-xs mt-1 flex text-center items-center"><BadgeCheckIcon className="h-2.5 w-2.5 mx-1"/> Published</span> :
                <span className="text-xs mt-1 flex text-center items-center text-gray-500"><BanIcon className="h-2.5 w-2.5 mx-1"/> Hidden</span>
            }
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
}

export function MasterCalendar({ timeblocks, view, date, onView, onNavigate, onSelectEvent }: MasterCalendarProps) {
    const events: CalendarEvent[] = timeblocks.map((tb) => ({
        ...tb,
        title: tb.name,
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
