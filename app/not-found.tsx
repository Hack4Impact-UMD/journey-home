"use client";

import { StatusPage } from "@/components/general/StatusPage";
import { usePageTitle } from "@/lib/usePageTitle";

export default function NotFound() {
    usePageTitle("404 Page Not Found | Journey Home");
    return (
        <StatusPage
            title="404 Page Not Found"
            message="Couldn't find the page you were looking for"
        />
    );
}
