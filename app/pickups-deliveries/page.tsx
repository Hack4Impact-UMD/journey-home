import { permanentRedirect } from "next/navigation";

export default function PickupsDeliveriesHome() {
    permanentRedirect("/pickups-deliveries/unscheduled");
}
