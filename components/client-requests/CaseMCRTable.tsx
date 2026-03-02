import { ClientRequest } from "@/types/client-requests";
import { Badge } from "../inventory/Badge";
import { ViewIcon } from "../icons/ViewIcon";

export function CaseMCRTable({
    clientRequests,
    openCR,
}: {
    clientRequests: ClientRequest[];
    openCR: (cr: ClientRequest) => void;
}) {
    return (
        <>
            <div className="w-full h-full min-w-3xl">
                <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                    <span className="w-[20%] border-l-2 border-light-border px-4">
                        Client
                    </span>
                    <span className="w-[20%] border-l-2 border-light-border px-4">
                        Phone Number
                    </span>
                    <span className="w-[25%] border-l-2 border-light-border px-4">
                        HMIS
                    </span>
                    <span className="w-[15%] border-l-2 border-light-border px-4">
                        Status
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Date
                    </span>
                    <span className="w-[10%] border-l-2 border-light-border px-4">
                        Actions
                    </span>
                    
                </div>
                {clientRequests.map((cr) => (
                    <CRTableRow request={cr} key={cr.id} onOpen={() => openCR(cr)}/>
                ))}
            </div>
        </>
    );
}

function CRTableRow({ request, onOpen, }: { request: ClientRequest; onOpen: () => void; }) {
    return (
        <>
            <div 
                className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            >
                <div className="w-[20%] px-4 flex items-center">
                    <input
                        type="checkbox"
                        className="w-4 h-4 mr-4 rounded-xs cursor-pointer border-white"
                    ></input>
                    <span>
                        {request.client.firstName} {request.client.lastName}
                    </span>
                </div>
                <div className="w-[20%] px-4">
                    <span>
                        {request.client.phoneNumber}
                    </span>
                </div>
                <div className="w-[25%] px-4">
                    <span>
                        {request.client.hmis}
                    </span>
                </div>
                <span className="w-[15%] px-4 text-xs">
                    <Badge 
                        text={
                            (request.status == "Not Reviewed") ? "Requested" : 
                            (request.status)
                        } 
                        color={
                            (request.status == "Not Reviewed") ? "yellow" :
                            (request.status == "Approved") ? "green" :
                            "red"
                        }
                    />
                </span>
                <span className="w-[10%] px-4">
                    {/*the date stuff is being a butt so gonna do a conditional thing even tho i shouldn't actually need one */}
                    {request.date
                        ? request.date.toDate().toLocaleDateString("en-US", {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                        })
                        : "—"
                    }
                </span>
                <div className="w-[10%] px-4 flex align-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpen();
                        }}>
                    <ViewIcon />
                    </button>
                </div>
                
            </div>
        </>
    );
}
