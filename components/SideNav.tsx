"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


export default function SideNavbar() {
    // whichever categories you want to see the categories of when looking through dropdowns, difference in clicking the dropdown icon vs. the name itself?
    // dropdown automatically open when you are on that category? 
    const [expanded, setExpanded] = useState<Record<string, boolean>>({ //on default none are opened? maybe just inventory opened
        inventory: true,
        volunteers: false,
        caseManagers: false,
        userManagement: false
    })

    //track curr page for formatting reasons
    const [currPage, setCurrPage] = useState("inventory")
    const [currSub, setCurrSub] = useState("warehouse")

    const showSection = (pageID: string) => {
        setExpanded(prev => ({
            ...prev,
            [pageID]: !prev[pageID]
        }))
    }

    const navPages = [
        {
            id: "inventory",
            name: "Inventory",
            path: "/inventory",
            subPages: [
                {id: "warehouse", name: "Warehouse", path: "/inventory/warehouse"},
                {id: "donation-requests", name: "Donation Requests", path: "/inventory/donation-requests"},
                {id: "reviewed-reqests", name: "Reviewed Requests", path: "/inventory/reviewed-requests"}, 
                //reviewed requests doesn't exist right now, appears designers changed approved/denied to only reviewed
            ]
        },
        { //inventory warehouse placeholder because we don't have pages yet
        
            id: "volunteers", 
            name: "Volunteers",
            path: "/inventory/warehouse",
            subPages: [],
        }, 
        {
            id: "caseManagers",
            name: "Case Managers", 
            path: "/case-managers",
            subPages: [
                {id: "cm-requests", name: "Case Manager Requests", path:"/inventory/warehouse"},
                {id: "cm-reviewed", name: "Reviewed Requests", path:"/inventory/warehouse"}
            ]
        },
        {
            id: "userManagement",
            name: "User Management",
            path: "/user-management",
            subPages: [
                {id: "all-accounts", name: "All Accounts", path:"/inventory/warehouse"},
                {id: "prev-donors", name: "Previous Donors", path:"/inventory/warehouse"},
                {id: "account-requests", name: "Account Requests", path:"/inventory/warehouse"},
            ]
        }
    ]

    return (
        <div className="h-full w-50 p-4 bg-[#FFFFFF] border-r flex flex-col font-family-roboto">
            <div className= "pb-4">
            <span className="text-primary font-extrabold pb-4">Admin</span>
            </div>

            <div>
            {/*map through the pages*/}
            {navPages.map(page => (
                <div key={page.id} className="pb-4 text-sm">
                    <>
                    <button
                        onClick={() => showSection(page.id)}
                        className = {`flex items-center justify-between w-full 
                            ${currPage === page.id ? 'text-[#02AFC7]' : 'text-black'}`}
                    >
                    {page.name} {expanded[page.id] ? <FaChevronUp className="text-xs"/> : <FaChevronDown className="text-xs"/>}
                    </button>

                    {/*show subpages if subpages exist + toggled*/}
                    <>
                    {expanded[page.id] &&
                        <div className = "text-sm pt-2">
                        {page.subPages.map((subPage) => (
                            <Link
                                key={subPage.id}
                                href={subPage.path}
                                onClick={() => {setCurrSub(subPage.id); setCurrPage(page.id);}}
                                className={`block px-3 py-2 
                                ${
                                    currSub === subPage.id
                                        ? 'bg-[#EBF6F7] text-[#02AFC7] border-r-3 border-[#02AFC7]' //clicked
                                        : 'text-black' //not clicked
                                }`}
                            >
                                <div className= "ml-3">{subPage.name}</div>
                            </Link>
                        ))}
                        </div>
                    }
                    </>
                    </>
                </div> 
            ))}
            </div>
            
        </div>
    )
}