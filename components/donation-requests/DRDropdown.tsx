import { DropdownIcon } from "../icons/DropdownIcon";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { DonationRequest } from "@/types/donations";

type DRDropdownProps<T extends string> = {
    options: T[];
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
    donationRequest: DonationRequest
};

export function DRDropdown<T extends string>({ options, selected, setSelected, donationRequest}: DRDropdownProps<T>) {

    const value = selected[0];
    const colorClass =
        value === "Yes"
            ? "bg-[#E7F9E8] border-[#BCDABE]"
            : value === "No"
            ? "bg-[#FBDED9] border-[#D7B7B1]"
            : "bg-white border-light-border";

    const {setDonationRequest} = useDonationRequests()

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-0">
                    <button className={`border rounded-xs flex items-center justify-between px-[0.5rem] w-[3.62rem] h-[1.375rem] ${colorClass}`}>
                        <span className="text-xs">
                            {selected.length === 1 ? selected[0] : ""}
                        </span>
                        <DropdownIcon />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-sm font-family-roboto text-xs ">
                    {options.map(option => 
                        <DropdownMenuCheckboxItem
                            key={option}
                            className="text-xs cursor-pointer"
                            checked={selected.includes(option) }
                            onCheckedChange={checked => {
                                if (!checked) return;
                                setSelected([option]);

                                setDonationRequest({
                                    ...donationRequest, responded: option === "Yes",
                                });
                            }}
                        >
                            {option}
                        </DropdownMenuCheckboxItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
