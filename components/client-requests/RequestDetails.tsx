import { ClientRequest } from "@/types/client-requests";

type ClientProps = {
  client: ClientRequest;
  userRole: string;
};

export function RequestDetailsPage({client, userRole} : ClientProps) {
    return (
        <div className="flex flex-col divide-y divide-gray-400 border-2 w-full">
            <div>
                {userRole === "Admin" && (
                    <div>
                        <div className="border-b border-gray-400 text-[#02AFC7] bg-[#FAFAFB] font-bold p-2"> Case Manager</div>
                        <div className="flex flex-row">
                            <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]">
                                <div className="p-2">Name</div>
                                <div className="p-2">Email</div>
                                <div className="p-2" >Phone Number</div>
                                <div className="border-r border-gray-400 p-2">Program</div>
                            </div>
                            <div className="w-1/2 divide-y divide-gray-400 bg-white">
                                <div className="p-2">{client.client.firstName} {client.client.lastName} </div>
                                <div className="p-2">{client.client.email} </div>
                                <div className="p-2">{client.client.phoneNumber} </div>
                                {/*TO DO: IMPLELMENT PROGRAM FIELD*/}
                                <div className="p-2">{client.client.questions.hasMovedIn ? "Placeholder" : "Placeholder"} </div>
                            </div>
                        </div>
                    </div>
                    
                    
                )}
            </div>
            <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-2 bg-[#FAFAFB]">Client</div>
                <div className="divide-x divide-gray-400">
                <div className="flex flex-row">
                    <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]">
                        <div className="p-2">HMIS number</div>
                        <div className="p-2">Client phone number</div >
                        <div className="p-2">Secondary contact number</div>
                        <div className="p-2">Name and relationship to secondary contact</div>
                        <div className="p-2">Speaks/understands English?</div>
                        <div className="p-2">Number of adults in the family</div>
                        <div className="p-2">Number of kids in the family</div>
                        <div className="p-2">Veteran Status</div>
                        <div className="p-2">Pick up items at the warehouse?</div>
                        <div className="p-2">Chronic before housing?</div>
                        <div className="p-2">Moved in?</div>
                        <div className="border-r border-gray-400 p-2">Moved in date</div>
                    </div>
                    <div className="w-1/2 divide-y divide-gray-400 bg-white">
                        <div className="p-2">{client.client.hmis}</div>
                        <div className="p-2"> {client.client.phoneNumber}</div>
                        <div className="p-2">{client.client.secondaryContact.phone}</div>
                        <div className="p-2">{client.client.secondaryContact.name} - {client.client.secondaryContact.relationship}</div>
                        <div className="p-2">{client.client.questions.clientSpeaksEnglish ? "Yes" : "No"}</div>
                        <div className="p-2">{client.client.questions.adultsInFamily}</div>
                        <div className="p-2">{client.client.questions.childrenInFamily}</div>
                        <div className="p-2">{client.client.questions.isVeteran ? "Yes" : "No"}</div>
                        <div className="p-2">{client.client.questions.canPickUp ? "Yes" : "No"}</div>
                        <div className="p-2">{client.client.questions.wasChronic ? "Yes" : "No"}</div>
                        <div className="p-2">{client.client.questions.hasMovedIn ? "Yes" : "No"}</div>
                        <div className="p-2">{client.client.questions.moveInDate? client.client.questions.moveInDate.toDate().toLocaleDateString(): "N/A"}</div>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-gray-400" >
                <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-2 bg-[#FAFAFB]">Client's New Home</div>
                <div className="flex flex-row">
                    <div className="w-1/2 divide-y divide-x divide-gray-400 bg-[#FAFAFB]"> 
                        <div className="p-2">Address</div>
                        <div className="p-2">Apt, unit, etc.</div>
                        <div className="border-r border-gray-400 p-2">Working elevator?</div>
                    </div> 
                    <div className="w-1/2 divide-y divide-gray-400 bg-white">
                        <div className="p-2">{client.client.address.streetAddress} {client.client.address.city} {client.client.address.state} {client.client.address.zipCode}</div>
                        {/*TO DO: IMPLEMENT FIELD FOR APARTMENT UNITS */}
                        <div className="p-2">N/A</div>
                        <div className="p-2">{client.client.questions.hasElevator ? "Yes" : "No"}</div>
                    </div>
                 </div>

    
            </div>
            <div>
                <div className="border-b border-gray-400 text-[#02AFC7] font-bold p-2 bg-[#FAFAFB]">Furniture Requests</div>
                <div className="flex flex-row flex-wrap w-full bg-white">
                    {client.items.map((item) => (
                        <div key={item.name} className="w-1/3 flex flex-row border-b border-gray-300 p-2">
                            <div className="w-3/4">{item.name}</div>
                            <div>{item.quantity}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}