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

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-0">
                    <button className="border border-light-border rounded-xs flex justify-center items-center pl-4 pr-3 gap-2">
                        <span className="text-sm">
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
