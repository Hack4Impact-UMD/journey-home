import { ClientRequest } from "@/types/client-requests";
import { useAllActiveAccounts } from "@/lib/queries/users";

type ClientProps = {
  client: ClientRequest;
  userRole: string;
};

export function RequestDetailsPage({client, userRole} : ClientProps) {
    const { allAccounts } = useAllActiveAccounts();

    const caseManager = allAccounts.find(
        (user: { uid: string; }) => user.uid === client.caseManagerID
    );
    return (
        <div className="flex flex-col divide-y divide-gray-400 border-2 w-full">
            <div>
                {userRole === "Admin" && (
                    <div>
                        <div className="border-b border-gray-400 text-[#02AFC7] bg-[#FAFAFB] font-bold p-[.75em]"> Case Manager</div>
                        <div className="flex flex-row">
                            <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]">
                                <div className="p-[.75em] font-bold">Name</div>
                                <div className="p-[.75em] font-bold">Email</div>
                                <div className="p-[.75em] font-bold" >Phone Number</div>
                                <div className="border-r border-gray-400 p-[.75em] font-bold">Program</div>
                            </div>
                            <div className="w-3/4 divide-y divide-gray-400 bg-white">
                                <div className="p-[.75em] ">  {caseManager ? `${caseManager.firstName} ${caseManager.lastName}` : "Loading..."}</div>
                                <div className="p-[.75em] ">{caseManager?.email ?? "Loading..."} </div>
                                <div className="p-[.75em] ">{caseManager?.phone ?? "—"}</div>
                                <div className="p-[.75em]">—</div>
                            </div>
                        </div>
                    </div>
                    
                    
                )}
            </div>
            <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-[.75em] bg-[#FAFAFB]">Client</div>
                <div className="divide-x divide-gray-400">
                <div className="flex flex-row">
                    <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]">
                        <div className="p-[.75em] font-bold">Name</div>
                        <div className="p-[.75em] font-bold">Email</div>
                        <div className="p-[.75em] font-bold">HMIS number</div>
                        <div className="p-[.75em] font-bold">Client phone number</div >
                        <div className="p-[.75em] font-bold">Secondary contact number</div>
                        <div className="p-[.75em] font-bold">Name and relationship to secondary contact</div>
                        <div className="p-[.75em] font-bold">Speaks/understands English?</div>
                        <div className="p-[.75em] font-bold">Number of adults in the family</div>
                        <div className="p-[.75em] font-bold">Number of kids in the family</div>
                        <div className="p-[.75em] font-bold">Veteran Status</div>
                        <div className="p-[.75em] font-bold">Pick up items at the warehouse?</div>
                        <div className="p-[.75em] font-bold">Chronic before housing?</div>
                        <div className="p-[.75em] font-bold">Moved in?</div>
                        <div className="border-r border-gray-400 p-[.75em] font-bold">Moved in date</div>
                    </div>
                    <div className="w-3/4 divide-y divide-gray-400 bg-white">
                        <div className="p-[.75em]">{client.client.firstName} {client.client.lastName}</div>
                        <div className="p-[.75em]">{client.client.email} </div>
                        <div className="p-[.75em]">{client.client.hmis}</div>
                        <div className="p-[.75em]"> {client.client.phoneNumber}</div>
                        <div className="p-[.75em]">{client.client.secondaryContact.phone}</div>
                        <div className="p-[.75em]">{client.client.secondaryContact.name} - {client.client.secondaryContact.relationship}</div>
                        <div className="p-[.75em]">{client.client.questions.clientSpeaksEnglish ? "Yes" : "No"}</div>
                        <div className="p-[.75em]">{client.client.questions.adultsInFamily}</div>
                        <div className="p-[.75em]">{client.client.questions.childrenInFamily}</div>
                        <div className="p-[.75em]">{client.client.questions.isVeteran ? "Yes" : "No"}</div>
                        <div className="p-[.75em]">{client.client.questions.canPickUp ? "Yes" : "No"}</div>
                        <div className="p-[.75em]">{client.client.questions.wasChronic ? "Yes" : "No"}</div>
                        <div className="p-[.75em]">{client.client.questions.hasMovedIn ? "Yes" : "No"}</div>
                        <div className="p-[.75em]">{client.client.questions.moveInDate? client.client.questions.moveInDate.toDate().toLocaleDateString(): "N/A"}</div>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-gray-400" >
                <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-2 bg-[#FAFAFB]">Client&apos;s New Home</div>
                <div className="flex flex-row">
                    <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]"> 
                        <div className="p-[.75em] font-bold">Address</div>
                        <div className="p-[.75em] font-bold">Apt, unit, etc.</div>
                        <div className="border-r border-gray-400 p-2 font-bold">Working elevator?</div>
                    </div> 
                    <div className="w-3/4 divide-y divide-gray-400 bg-white">
                        <div className="p-[.75em]">{client.client.address.streetAddress} {client.client.address.city} {client.client.address.state} {client.client.address.zipCode}</div>
                        <div className="p-[.75em]">—</div>
                        <div className="p-[.75em]">{client.client.questions.hasElevator ? "Yes" : "No"}</div>
                    </div>
                 </div>

    
            </div>
            <div>
                <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-1 bg-[#FAFAFB]">Furniture Requests</div>
                <div className="flex flex-col flex-wrap max-h-48 overflow-y-auto w-full bg-white">
                    {client.items.map((item) => (
                        <div key={item.name} className="w-1/3 flex flex-row border-gray-300 p-1">
                            <div className="w-3/4 font-bold">{item.name}</div>
                            <div>{item.quantity}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}