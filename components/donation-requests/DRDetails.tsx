import { DonationRequest } from "@/types/donations";
import { Badge } from "@/components/inventory/Badge";

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="relative font-bold text-sm text-primary py-3 pl-4 bg-[#FAFAFB] border-t border-b border-light-border before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-light-border after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3.5 after:w-px after:bg-light-border">
            {title}
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <>
            <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">{label}</div>
            <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border whitespace-pre-wrap">{value || "—"}</div>
        </>
    );
}

export function DRDetails({ dr }: { dr: DonationRequest }) {
    return (
        <div className="w-full min-w-4xl flex flex-col border-x border-b border-light-border">
            <div>
                <SectionHeader title="Contact" />
                <div className="grid grid-cols-2">
                    <DetailRow label="Name" value={`${dr.donor.firstName} ${dr.donor.lastName}`} />
                    <DetailRow label="Phone number" value={dr.donor.phoneNumber} />
                    <DetailRow label="Email" value={dr.donor.email} />
                </div>
            </div>
            <div>
                <SectionHeader title="Address" />
                <div className="grid grid-cols-2">
                    <DetailRow label="Street address" value={dr.donor.address.streetAddress} />
                    <DetailRow label="City/Town" value={`${dr.donor.address.city}, ${dr.donor.address.state}`} />
                    <DetailRow label="Zipcode" value={dr.donor.address.zipCode} />
                </div>
            </div>
            <div>
                <SectionHeader title="Additional" />
                <div className="grid grid-cols-2">
                    <DetailRow label="Previously donated" value={dr.firstTimeDonor ? "No" : "Yes"} />
                    <DetailRow label="Heard about Journey Home through" value={dr.howDidYouHear} />
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Acquisition</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border text-sm">
                        <Badge text={dr.canDropOff ? "Can Drop Off" : "Needs Pickup"} color={dr.canDropOff ? "indigo" : "orange"} />
                    </div>
                    <DetailRow label="Notes/comments" value={dr.notes} />
                </div>
            </div>
        </div>
    );
}
