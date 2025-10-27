"use client";

export default function GalleryItem() {
    return (
        <div className="w-100 aspect-[18/20] flex flex-col justify-start p-4 bg-white border-4 border-grey shadow-lg rounded-lg">
            <div className="w-90 h-80 bg-white border-4 border-black rounded-lg"> 
                picture
            </div>
            <div className="justify-start pyt-2">Name</div>
            <div>
                categories here
            </div>
            <div> Date</div>
        </div>
    )

}
