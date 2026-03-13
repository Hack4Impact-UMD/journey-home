import { DropdownIcon } from "../icons/DropdownIcon";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DRDropdownProps<T extends string> = {
    options: T[];
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
};

export function DRDropdown<T extends string>({ options, selected, setSelected }: DRDropdownProps<T>) {

    const value = selected[0];
    const colorClass =
        value === "Yes"
            ? "bg-[#E7F9E8] border-[#BCDABE]"
            : value === "No"
            ? "bg-[#FBDED9] border-[#D7B7B1]"
            : "bg-white border-light-border";

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
                <DropdownMenuContent className="rounded-sm font-family-roboto text-xs p-0">
                    {options.map(option => 
                        <DropdownMenuCheckboxItem
                            key={option}
                            className="text-xs cursor-pointer"
                            checked={selected.includes(option) }
                            onCheckedChange={checked => {
                                if(checked) {
                                    setSelected([option]);
                                } else {
                                    setSelected(prev => prev.filter(x => x !== option));
                                }
                            }}
                            onSelect={(event) => event.preventDefault()}
                        >
                            {option}
                        </DropdownMenuCheckboxItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
