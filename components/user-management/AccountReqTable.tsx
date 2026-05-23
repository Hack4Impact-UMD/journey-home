import { UserData } from "@/types/user";
import { Badge } from "../inventory/Badge";

type AccountReqTableProps = {
    requests: UserData[];
    onAccept: (user: UserData) => void;
};

export function AccountReqTable({ requests, onAccept }: AccountReqTableProps) {
    return (
        <div className="w-full min-w-3xl h-full flex flex-col">
            <div className="h-12 bg-[#FAFAFB] border-light-border border flex items-center font-family-roboto font-bold text-sm text-text-1 shrink-0">
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
            <div className="flex-1 overflow-auto min-h-0">
                {requests.map((user) => (
                    <AccountReqTableRow user={user} key={user.uid} onAccept={onAccept}/>
                ))}
            </div>
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
                    onClick={(e) => { e.stopPropagation(); onAccept(user); }}
                    className="flex items-center gap-1.5 px-2.5 h-[1.375rem] rounded-full bg-[#E7F9E8] text-[#304333] text-xs font-family-roboto shadow-[0_0.125rem_0.125rem_rgba(0,0,0,0.043)]"
                >
                    <svg width="10" height="8" viewBox="80 7 10 8" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M89.8979 8.7725L83.8979 14.7725C83.8457 14.8249 83.7836 14.8665 83.7152 14.8949C83.6468 14.9233 83.5735 14.9379 83.4995 14.9379C83.4255 14.9379 83.3522 14.9233 83.2838 14.8949C83.2154 14.8665 83.1533 14.8249 83.1011 14.7725L80.4761 12.1475C80.4237 12.0952 80.3822 12.0331 80.3539 11.9647C80.3256 11.8963 80.311 11.8231 80.311 11.7491C80.311 11.6751 80.3256 11.6018 80.3539 11.5334C80.3822 11.4651 80.4237 11.4029 80.4761 11.3506C80.5284 11.2983 80.5905 11.2568 80.6589 11.2285C80.7272 11.2002 80.8005 11.1856 80.8745 11.1856C80.9485 11.1856 81.0218 11.2002 81.0901 11.2285C81.1585 11.2568 81.2206 11.2983 81.2729 11.3506L83.5 13.5777L89.102 7.97656C89.2077 7.87089 89.351 7.81152 89.5004 7.81152C89.6499 7.81152 89.7932 7.87089 89.8989 7.97656C90.0046 8.08223 90.0639 8.22556 90.0639 8.375C90.0639 8.52444 90.0046 8.66776 89.8989 8.77344L89.8979 8.7725Z" />
                    </svg>
                    Accept
                </button>
            </div>
        </div>
    );
}
