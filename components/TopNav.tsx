"use client";

export default function TopNavbar() {

    return (
        <div className="h-12 w-full border-b border-[#EFF3F5] flex items-center justify-end">
            <img 
                src= "/defaultprofilepicture.png"
                alt= "default"
                className= "h-8 w-8 rounded-full"
            />
            <span className="font-family-opensans pr-6 pl-4">Name</span>
        </div>
    )
}