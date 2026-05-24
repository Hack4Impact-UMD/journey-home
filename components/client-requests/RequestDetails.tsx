import { ClientRequest } from "@/types/client-requests";
import { useAllActiveAccounts } from "@/lib/queries/users";

type ClientProps = {
  client: ClientRequest;
  userRole: string;
};

export function RequestDetailsPage({ client, userRole }: ClientProps) {
    const { allAccounts } = useAllActiveAccounts();

    const caseManager = allAccounts.find(
        (user: { uid: string }) => user.uid === client.caseManagerID
    );

    const { questions, secondaryContact, address } = client.client;

    return (
        <div className="flex flex-col w-full border-x border-b border-light-border">
            {userRole === "Admin" && (
                <div>
                    <div className="relative font-bold text-primary py-3 pl-4 bg-[#FAFAFB] border-t border-b border-light-border before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-light-border after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3.5 after:w-px after:bg-light-border">
                        Case Manager
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Name</div>
                        <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">
                            {caseManager ? `${caseManager.firstName} ${caseManager.lastName}` : "Loading..."}
                        </div>
                        <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Email</div>
                        <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{caseManager?.email ?? "Loading..."}</div>
                        <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Phone Number</div>
                        <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{caseManager?.phone ?? "—"}</div>
                        <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Program</div>
                        <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{client.client.programName || "—"}</div>
                    </div>
                </div>
            )}

            <div>
                <div className="relative font-bold text-primary py-3 pl-4 bg-[#FAFAFB] border-t border-b border-light-border before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-light-border after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3.5 after:w-px after:bg-light-border">
                    Client
                </div>
                <div className="grid grid-cols-2">
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">HMIS number</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{client.client.hmis}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Client phone number</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{client.client.phoneNumber}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Client email</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{client.client.email || "—"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Secondary contact number</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{secondaryContact.phone || "—"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Name and relationship to secondary contact</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">
                        {secondaryContact.name && secondaryContact.relationship
                            ? `${secondaryContact.name} - ${secondaryContact.relationship}`
                            : secondaryContact.name || secondaryContact.relationship || "—"}
                    </div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Speaks/understands English?</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.clientSpeaksEnglish ? "Yes" : "No"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Number of adults in the family</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.adultsInFamily ?? "—"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Number of kids in the family</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.childrenInFamily ?? "—"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Veteran status</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.isVeteran == null ? "—" : questions.isVeteran ? "Yes" : "No"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Pick up items at the warehouse?</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.canPickUp ? "Yes" : "No"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Chronic before housing?</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.wasChronic == null ? "—" : questions.wasChronic ? "Yes" : "No"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Moved in status</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.hasMovedIn ? "Yes" : "No"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Moved in date</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">
                        {questions.moveInDate ? questions.moveInDate.toDate().toLocaleDateString() : "N/A"}
                    </div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Notes</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.notes || "—"}</div>
                </div>
            </div>

            <div>
                <div className="relative font-bold text-primary py-3 pl-4 bg-[#FAFAFB] border-t border-b border-light-border before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-light-border after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3.5 after:w-px after:bg-light-border">
                    Client&apos;s New Home
                </div>
                <div className="grid grid-cols-2">
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Address</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">
                        {address.streetAddress}, {address.city}, {address.state} {address.zipCode}
                    </div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Apt, unit, etc.</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{address.apt ?? "—"}</div>
                    <div className="font-bold text-sm text-black pl-4 min-h-10 bg-[#FAFAFB] flex items-start py-2 border-t border-r border-light-border">Working elevator?</div>
                    <div className="pl-4 min-h-10 flex items-start py-2 border-t border-light-border">{questions.hasElevator ? "Yes" : "No"}</div>
                </div>
            </div>

            <div>
                <div className="relative font-bold text-primary py-3 pl-4 bg-[#FAFAFB] border-t border-b border-light-border before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-3.5 before:w-px before:bg-light-border after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:h-3.5 after:w-px after:bg-light-border">
                    Furniture Requests
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(11rem,1fr))] gap-x-40 gap-y-2 px-10 py-5 border-b border-light-border">
                    {client.items.map((item) => (
                        <div key={item.name} className="flex justify-between">
                            <span className="font-semibold">{item.name}</span>
                            <span>{item.quantity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
