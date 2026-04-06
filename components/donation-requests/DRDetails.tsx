import { DonationRequest } from "@/types/donations";

function SectionHeader({ title }: { title: string }) {
    return (
        <div className="h-10 bg-[#FAFAFB] border-light-border border flex items-center font-bold text-sm text-primary shrink-0">
            <span className="border-l-2 border-primary px-4">{title}</span>
        </div>
    );
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-h-10 border-light-border border-b border-x flex items-center text-sm text-text-1">
            <span className="w-[40%] px-4 font-bold shrink-0">{label}</span>
            <span className="w-[60%] px-4">{value || "—"}</span>
        </div>
    );
}

export function DRDetails({ dr }: { dr: DonationRequest }) {
    return (
        <div className="w-full min-w-4xl mt-6">
            <SectionHeader title="Contact" />
            <DetailRow
                label="Name"
                value={`${dr.donor.firstName} ${dr.donor.lastName}`}
            />
            <DetailRow label="Phone number" value={dr.donor.phoneNumber} />
            <DetailRow label="Email" value={dr.donor.email} />

            <SectionHeader title="Address" />
            <DetailRow
                label="Street address"
                value={dr.donor.address.streetAddress}
            />
            <DetailRow
                label="City/Town"
                value={`${dr.donor.address.city}, ${dr.donor.address.state}`}
            />
            <DetailRow label="Zipcode" value={dr.donor.address.zipCode} />

            <SectionHeader title="Additional" />
            <DetailRow
                label="Previously donated"
                value={dr.firstTimeDonor ? "No" : "Yes"}
            />
            <DetailRow
                label="Heard about Journey Home through"
                value={dr.howDidYouHear}
            />
            <DetailRow
                label="Able to drop off items"
                value={dr.canDropOff ? "Yes" : "No"}
            />
            <DetailRow label="Notes/comments" value={dr.notes} />
        </div>
    );
}