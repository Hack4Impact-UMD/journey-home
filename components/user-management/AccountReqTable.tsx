import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";

type AccountReqTableProps = {
    requests: UserData[];
    onAccept: (user: UserData) => void;
};

export function AccountReqTable({ requests, onAccept }: AccountReqTableProps) {
    return (
        <div className="w-full h-full min-w-3xl">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1">
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    First Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Last Name
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Requesting
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Email
                </span>
                <span className="w-[20%] border-l-2 border-light-border px-4">
                    Actions
                </span>
            </div>
            {requests.map((user) => (
                <AccountReqTableRow user={user} key={user.uid} onAccept={onAccept}/>
            ))}
        </div>
    );
}

function AccountReqTableRow({
    user,
    onAccept
}: {
    user: UserData;
    onAccept: (user: UserData) => void
}) {
    return (
        <>
            <div className="h-10 border-light-border border-b border-x flex items-center font-family-roboto text-sm text-text-1 hover:bg-blue-50 cursor-pointer">
                <div className="w-[20%] px-4 flex items-center">
                    <span>{user.firstName}</span>
                </div>
                <div className="w-[20%] px-4 flex items-center">
                    <span>{user.lastName}</span>
                </div>
                <div className="w-[20%] px-4 text-xs">
                    {user.pending && <Badge text={user.pending} color="gray" />}
                </div>
                <div className="w-[20%] px-4 flex items-center">
                    <span>{user.email}</span>
                </div>
                <div className="w-[20%] px-4 flex align-center gap-2.5">
                    <button 
                        className="font-family-roboto bg-primary rounded-xs px-2.5 text-white text-sm h-6 hover:shadow-sm"
                        onClick={() => onAccept(user)}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </>
    );
}
