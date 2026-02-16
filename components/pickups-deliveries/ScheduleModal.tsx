import { useState } from "react";
import { DonationRequest } from "@/types/donations";

// will need the props on the item being scheduled? to send into the firestore once i hit set shift 
// would probably have the item identifier, onClose() function 
// taking inspo from item-review, donation request

type scheduleModalProps = {
    // scheduleRequest: DonationRequest;
    onClose: () => void;
    // finalShift: (time: somethingSomething) => void; timeSlot
};

export default function ScheduleModal({ onClose } : scheduleModalProps) { 

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto overflow-y-auto">
            <div className="inset-0 w-full h-full flex bg-black/20" onClick={onClose}>
                <div className="flex-1 rounded-[5px] m-20 mx-90 z-10 border-light-border justify-center flex items-center bg-[#FBFCFD]">
                    <h1>Available Times</h1>
                </div>
            </div>
        </div>
    )
}