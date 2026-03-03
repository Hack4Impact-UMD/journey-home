"use client";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import { useState, useEffect, useCallback } from "react";
import { TimeBlock, MyEvent } from "../../../types/schedule";
import { fetchAllTB } from "../../../lib/services/timeblocks";
import { CustomToolbar } from "../../../components/schedule/CustomToolbar";

export default function CalendarView() {
    const localizer = momentLocalizer(moment);
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [view, setView] = useState<View>("month");
    const [date, setDate] = useState(new Date());

    const loadEvents = useCallback(async () => {
        const tbs: TimeBlock[] = await fetchAllTB();
        const mapped = tbs.map((tb) => ({
            title: `${tb.startTime.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${tb.endTime.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            start: tb.startTime.toDate(),
            end: tb.endTime.toDate(),
        }));
        setEvents(mapped);
    }, []);

    useEffect(() => { loadEvents(); }, [loadEvents]);

    return (
        <div className="h-full text-[#6B7A99]" style={{ height: 600 }}>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                view={view}
                onView={(v) => setView(v)}
                date={date}
                onNavigate={(d) => setDate(d)}
                components={{
                    toolbar: (props) => <CustomToolbar {...props} onShiftCreated={loadEvents} />,
                    event: ({ event }) => (
                        <span className="text-xs text-[#3D4B6B]">
                            {view === "month" ? event.title : ""}
                        </span>
                    ),
                }}
                eventPropGetter={() => ({
                    style: {
                        height: "auto",
                        minHeight: 30,
                        margin: 0,
                        padding: 0,
                        backgroundColor: "#F5FAFA",
                        border: "1px solid #02AFC7",
                        color: "#3D4B6B",
                        boxSizing: "border-box",
                    },
                })}
            />
        </div>
    );
}