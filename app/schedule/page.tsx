"use client";

import { ProtectedRoute } from "@/components/general/ProtectedRoute";
import { redirect } from "next/navigation";

export default function CalendarView() {
    redirect("/schedule/calendar");
}
