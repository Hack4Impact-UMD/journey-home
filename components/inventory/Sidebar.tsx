import { Package } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface CategoryStock{
    category:string; 
    count:number;
    maxCount:number;
    color:string;
}

interface SidebarProps{
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
    categoryStocks: CategoryStock[];
}

export default function Sidebar({isOpen, onClose, onOpen, categoryStocks,}: SidebarProps}){



    return(
        <div>

        </div>
    );
}