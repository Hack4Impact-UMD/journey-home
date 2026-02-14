import { DropdownIcon } from "../icons/DropdownIcon";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type DropdownMultiselectProps<T extends string> = {
    label: string;
    options: T[];
    selected: T[];
    setSelected: React.Dispatch<React.SetStateAction<T[]>>;
};

export function DropdownMultiselect<T extends string>({ label, options, selected, setSelected }: DropdownMultiselectProps<T>) {

    const allSelected = JSON.stringify([...selected].sort()) === JSON.stringify([...options].sort());

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild className="outline-0">
                    <button className="border border-light-border rounded-xs flex justify-center items-center pl-4 pr-3 gap-2">
                        <span className="text-sm">{label}</span>
                        <DropdownIcon />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-sm font-family-roboto text-xs p-0">
                    <DropdownMenuCheckboxItem
                            key={"All"}
                            className="text-xs cursor-pointer"
                            checked={allSelected}
                            onCheckedChange={checked => {
                                if(checked) {
                                    setSelected([...options]);
                                } else {
                                    setSelected([]);
                                }
                                
                            }}
                            onSelect={(event) => event.preventDefault()}
                        >
                            All
                        </DropdownMenuCheckboxItem>
                    {options.map(option => 
                        <DropdownMenuCheckboxItem
                            key={option}
                            className="text-xs cursor-pointer"
                            checked={selected.includes(option) && !allSelected}
                            onCheckedChange={checked => {
                                if(checked) {
                                    if(allSelected) {
                                        setSelected([option,]);
                                    } else {
                                        setSelected(prev => [...prev, option]);
                                    }
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
