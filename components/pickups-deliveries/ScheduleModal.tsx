import { useState } from "react";
import { TimeBlock, Task, Delivery, Pickup } from "@/types/schedule";
import { useTBs } from "@/lib/queries/timeblocks";
import { Timestamp } from "firebase/firestore";

// will need the props on the item being scheduled? to send into the firestore once i hit set shift 
// would probably have the item identifier, onClose() function 
// taking inspo from item-review, donation request

type scheduleModalProps = {
    scheduleRequest: Task; //donationRequest OR clientRequest
    onClose: () => void;
    finalTB: (timeB: TimeBlock) => void;
};

type DateInfo = {
  weekday: string;
  month: string;
  day: number;
};

export function getDateInfo(timestamp: Timestamp): DateInfo {
  const date = timestamp.toDate();

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
    month: date.toLocaleDateString("en-US", { month: "long" }),
    day: date.getDate(),
  };
}

export default function ScheduleModal({ 
    scheduleRequest,
    onClose,
    finalTB,
 } : scheduleModalProps) { 

    //need to get all the timeBlocks
    const { allTB: timeBlocks, refetch: refetchAllRequests, isLoading, editTB } = useTBs();

    //sorting timeblocks in latest to furthest away
    //doing this for now, should 100 percent find a better way to do this in the future
    const sortedTBs = [...timeBlocks].sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());

    //keeping track of the selected timeBlock
    const [selectedTB, setSelected] = useState<TimeBlock | null>(null);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
            <div className="inset-0 w-full h-full flex bg-black/20" onClick={onClose}> {/*clicking out*/}

                <div className="flex-1 flex-col rounded-[5px] border-light-border m-20 mx-95 z-10 bg-[#FBFCFD] p-6 overflow-y-auto">
                    <h1 className="text-[20px] text-[#565656] font-medium text-left w-full">
                        Available Times
                    </h1>

                    {sortedTBs.map((tb) => (
                        <div key={tb.id} className="border-b pb-4 mb-4 flex-col items-center pt-4">
                            <div className="flex gap-1 items-baseline">
                                <h1 className= "text-[14px] text-[#565656] font-medium">
                                    {getDateInfo(tb.startTime).weekday}
                                </h1>
                                <h1 className= "text-[12px] text-[#7D7D7D]">
                                    {getDateInfo(tb.startTime).day} {getDateInfo(tb.startTime).month}
                                </h1>
                            </div>

                            <div className="flex justify-between mx-5 items-baseline">
                                <h1 className="border-[#02AFC7] border text-[14px] bg-#F5FAFA px-2 py-1 rounded-lg">timeslot...</h1>
                                <button className="text-[#FFFFFF] text-[14px] rounded-lg bg-[#02AFC7] px-3 py-2">+  Add Shift</button>
                            </div>

                            {/*add onClick different color, then submit with the add shift, and also the list of shifts by zip code and stuff*/}
                            

                        </div>
                    ))} 
                </div>
            </div>    
        </div>
    )
}