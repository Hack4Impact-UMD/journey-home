import { permanentRedirect } from "next/navigation";

export default function SchedulePage() {
    permanentRedirect("/schedule/calendar");
}
