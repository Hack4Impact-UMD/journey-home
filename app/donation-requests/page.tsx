import { permanentRedirect } from "next/navigation";

export default function DonationRequestsHome() {
    permanentRedirect("/donation-requests/new");
}
