"use client";

import { StatusPage } from "@/components/general/StatusPage";

export default function NotFound() {
    return (
        <StatusPage
            title="404 Page Not Found"
            message="Couldn't find the page you were looking for"
        />
    );
}
