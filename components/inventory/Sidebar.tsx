"use client";  

import { Package, ChevronRight} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function Sidebar({isOpen, onClose, onOpen, categoryStocks,}: SidebarProps){



    return(
       <>
        <div className ={cn()} />
            testing
       </>
    );
}