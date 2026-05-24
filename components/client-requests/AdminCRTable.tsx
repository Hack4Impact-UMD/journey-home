"use client";

import { useState } from "react";
import { ClientRequest } from "@/types/client-requests";
import { ReviewStatus } from "@/types/general";
import { useAllActiveAccounts } from "@/lib/queries/users";
import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";
import { ConfirmModal } from "../general/ConfirmModal";

export function AdminCRTable({
    clientRequests,
    openCR,
    onUpdateStatus,
}: {
    clientRequests: ClientRequest[];
    openCR: (cr: ClientRequest) => void;
    onUpdateStatus: (cr: ClientRequest, status: ReviewStatus) => Promise<void>;
}) {
    const { allAccounts } = useAllActiveAccounts();
    const userById = new Map(allAccounts.map((u) => [u.uid, u]));

    const [pendingAction, setPendingAction] = useState<{
        cr: ClientRequest;
        status: "Approved" | "Denied";
    } | null>(null);

    const handleConfirm = async () => {
        if (!pendingAction) return;
        await onUpdateStatus(pendingAction.cr, pendingAction.status);
        setPendingAction(null);
    };

    const pendingCaseManager = pendingAction
        ? (userById.get(pendingAction.cr.caseManagerID) ?? null)
        : null;

    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Client
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Case Manager
                </span>
                <span className="w-[25%] border-l-2 border-light-border px-4">
                    Case Manager Email
                </span>
                <span className="w-[15%] border-l-2 border-light-border px-4">
                    Date
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Approval Status
                </span>
            </div>
            <div className="flex-1 overflow-auto min-h-0">
                {clientRequests.map((cr) => (
                    <CRTableRow
                        request={cr}
                        key={cr.id}
                        caseManager={userById.get(cr.caseManagerID) ?? null}
                        onOpen={() => openCR(cr)}
                        onApprove={() => setPendingAction({ cr, status: "Approved" })}
                        onDeny={() => setPendingAction({ cr, status: "Denied" })}
                    />
                ))}
            </div>
            {pendingAction && (
                <ConfirmModal
                    title={pendingAction.status === "Approved" ? "Approve request?" : "Deny request?"}
                    message={`${pendingAction.status === "Approved" ? "Approve" : "Deny"} ${pendingAction.cr.client.firstName} ${pendingAction.cr.client.lastName}'s request submitted by ${pendingCaseManager ? `${pendingCaseManager.firstName} ${pendingCaseManager.lastName}` : "this case manager"}?`}
                    onConfirm={handleConfirm}
                    onCancel={() => setPendingAction(null)}
                />
            )}
        </div>
    );
}

function CRTableRow({
    request,
    caseManager,
    onOpen,
    onApprove,
    onDeny,
}: {
    request: ClientRequest;
    caseManager: UserData | null;
    onOpen: () => void;
    onApprove: () => void;
    onDeny: () => void;
}) {
    return (
        <div
            className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer"
            onClick={onOpen}
        >
            <div className="w-[20%] px-4">
                <span>
                    {request.client.firstName} {request.client.lastName}
                </span>
            </div>
            <div className="w-[20%] px-4">
                <span>
                    {caseManager?.firstName} {caseManager?.lastName}
                </span>
            </div>
            <div className="w-[25%] px-4">
                <span>{caseManager?.email ?? "—"}</span>
            </div>
            <span className="w-[15%] px-4">
                {request.date
                    ? request.date.toDate().toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    })
                    : "—"
                }
            </span>
            <div className="w-[20%] px-4 flex items-center">
                {request.status === "Not Reviewed" ? (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); onDeny(); }}
                            className="flex items-center gap-1.5 px-2.5 h-[1.375rem] rounded-full bg-[#FBDED9] text-[#4C2422] text-xs font-family-roboto shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.043)]"
                        >
                            <svg width="8" height="8" viewBox="10 7 8 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.7729 13.977C17.8786 14.0827 17.938 14.226 17.938 14.3754C17.938 14.5249 17.8786 14.6682 17.7729 14.7739C17.6673 14.8795 17.524 14.9389 17.3745 14.9389C17.2251 14.9389 17.0817 14.8795 16.9761 14.7739L14 11.7968L11.0229 14.7729C10.9173 14.8786 10.774 14.938 10.6245 14.938C10.4751 14.938 10.3317 14.8786 10.2261 14.7729C10.1204 14.6673 10.061 14.5239 10.061 14.3745C10.061 14.225 10.1204 14.0817 10.2261 13.9761L13.2031 11L10.227 8.02293C10.1213 7.91726 10.062 7.77393 10.062 7.62449C10.062 7.47505 10.1213 7.33173 10.227 7.22605C10.3327 7.12038 10.476 7.06102 10.6254 7.06102C10.7749 7.06102 10.9182 7.12038 11.0239 7.22605L14 10.2031L16.977 7.22558C17.0827 7.11991 17.226 7.06055 17.3754 7.06055C17.5249 7.06055 17.6682 7.11991 17.7739 7.22558C17.8796 7.33126 17.9389 7.47458 17.9389 7.62402C17.9389 7.77347 17.8796 7.91679 17.7739 8.02246L14.7969 11L17.7729 13.977Z" />
                            </svg>
                            Deny
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); onApprove(); }}
                            className="flex items-center gap-1.5 px-2.5 h-[1.375rem] rounded-full bg-[#E7F9E8] text-[#304333] text-xs font-family-roboto shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.043)]"
                        >
                            <svg width="10" height="8" viewBox="80 7 10 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M89.8979 8.7725L83.8979 14.7725C83.8457 14.8249 83.7836 14.8665 83.7152 14.8949C83.6468 14.9233 83.5735 14.9379 83.4995 14.9379C83.4255 14.9379 83.3522 14.9233 83.2838 14.8949C83.2154 14.8665 83.1533 14.8249 83.1011 14.7725L80.4761 12.1475C80.4237 12.0952 80.3822 12.0331 80.3539 11.9647C80.3256 11.8963 80.311 11.8231 80.311 11.7491C80.311 11.6751 80.3256 11.6018 80.3539 11.5334C80.3822 11.4651 80.4237 11.4029 80.4761 11.3506C80.5284 11.2983 80.5905 11.2568 80.6589 11.2285C80.7272 11.2002 80.8005 11.1856 80.8745 11.1856C80.9485 11.1856 81.0218 11.2002 81.0901 11.2285C81.1585 11.2568 81.2206 11.2983 81.2729 11.3506L83.5 13.5777L89.102 7.97656C89.2077 7.87089 89.351 7.81152 89.5004 7.81152C89.6499 7.81152 89.7932 7.87089 89.8989 7.97656C90.0046 8.08223 90.0639 8.22556 90.0639 8.375C90.0639 8.52444 90.0046 8.66776 89.8989 8.77344L89.8979 8.7725Z" />
                            </svg>
                            Approve
                        </button>
                    </div>
                ) : (
                    <Badge
                        text={request.status}
                        color={request.status === "Approved" ? "green" : "red"}
                    />
                )}
            </div>
        </div>
    );
}
