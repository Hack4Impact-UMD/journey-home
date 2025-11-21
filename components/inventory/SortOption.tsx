import { SortIcon } from "../icons/SortIcon";
import { SortStatus } from "@/types/inventory";

type SortOptionProps = {
    label: string,
    onChange: (status: SortStatus) => void,
    status: SortStatus
}

export function SortOption({label, onChange, status}: SortOptionProps) {

    return <>
        <button 
            className="border border-light-border rounded-xs flex justify-center items-center px-4 gap-1.5"
            onClick={() => {
                if(status == "desc") {
                    onChange("asc");
                } else {
                    onChange("desc");
                }
            }}    
        >
            <span className={`text-sm${(status == "none") ? "" : " font-semibold"}`}>{label}</span>
            <SortIcon status={status}/>
        </button>
    </>
}