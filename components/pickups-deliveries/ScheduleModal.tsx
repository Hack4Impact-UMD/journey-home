import { useState } from "react";
import { TimeBlock, Task, Delivery, Pickup } from "@/types/schedule";
import { useTBs } from "@/lib/queries/timeblocks";
import { Timestamp } from "firebase/firestore";
import { setDonationRequest } from "@/lib/services/donations";
import { setClientRequest } from "@/lib/services/client-request";
import { useQueryClient } from "@tanstack/react-query";

// will need the props on the item being scheduled? to send into the firestore once i hit set shift 
// would probably have the item identifier, onClose() function 
// taking inspo from item-review, donation request

type scheduleModalProps = {
    scheduleRequest: Task; //donationRequest OR clientRequest
    onClose: () => void;
};

//to do the date stuff my head hurts
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

//getting date info and comparing the times?
export function getTimeSlot(
  start: Timestamp,
  end: Timestamp
): string {
  const startDate = start.toDate();
  const endDate = end.toDate();

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedStart = startDate.toLocaleTimeString("en-US", options);
  const formattedEnd = endDate.toLocaleTimeString("en-US", options);

  return `${formattedStart} to ${formattedEnd}`;
}

//NEED A WAY TO DIFFRENTIATE BETWEEN DONOR AND CLIENT
function getLocoInfo(task: Task) {
    if ("donor" in task) {
        return {
        zipCode: task.donor.address.zipCode,
        city: task.donor.address.city,
        };
    }

    if ("client" in task) {
        return {
        zipCode: task.client.address.zipCode,
        city: task.client.address.city,
        };
    }

    //getting rid of potential undefined
    return {
        zipCode: "",
        city: "",
    };
}
//sorting tb's tasks (sort + locale compare i think)
export function sortTasks(tb: TimeBlock): Task[] {
    return [...tb.tasks].sort((a, b) => {
        const a_stuff = getLocoInfo(a);
        const b_stuff = getLocoInfo(b);
        
        if (a_stuff.zipCode !== b_stuff.zipCode) {
        return a_stuff.zipCode.localeCompare(b_stuff.zipCode);
        }
        
        return a_stuff.city.localeCompare(b_stuff.city);
    });
}

export default function ScheduleModal({ 
    scheduleRequest,
    onClose,
 } : scheduleModalProps) { 

    //need to get all the timeBlocks
    const { allTB: timeBlocks, refetch: refetchAllRequests, isLoading, editTB } = useTBs();
    const queryClient = useQueryClient();

    //sorting timeblocks in latest to furthest away
    //doing this for now, should 100 percent find a better way to do this in the future
    const sortedTBs = [...timeBlocks].sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());

    const addShift = async (tb: TimeBlock) => {

        //remove any old objects during rescheduling if needed
        const currentTB = scheduleRequest.associatedTimeBlockID;
        if (currentTB && currentTB !== tb.id) {
            const oldTB = timeBlocks.find(t => t.id === currentTB);
            if (oldTB) {
                const updatedOldTB = {
                    ...oldTB,
                    tasks: oldTB.tasks.filter(task => task.id !== scheduleRequest.id),
                };
                await editTB(updatedOldTB);
            }
        }

        //add to the task list !
        const alreadyInTB = tb.tasks.some(task => task.id === scheduleRequest.id);
        const updatedTB = {
            ...tb,
            tasks: alreadyInTB ? tb.tasks : [...tb.tasks, scheduleRequest],
        };
        await editTB(updatedTB);

        //change the associated timeblock id
        if ("donor" in scheduleRequest) {
            const updatedReq: Pickup = {
            ...scheduleRequest,
            associatedTimeBlockID: tb.id,
        }
            await setDonationRequest(updatedReq);
        } else {
            const updatedReq: Delivery = {
            ...scheduleRequest,
            associatedTimeBlockID: tb.id,
        }
            await setClientRequest(updatedReq);
        }

        await queryClient.invalidateQueries({ queryKey: ["donationRequest"] });
        await queryClient.invalidateQueries({ queryKey: ["clientRequests"] });
        await queryClient.invalidateQueries({ queryKey: ["timeblocks"] });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
            <div className="inset-0 w-full h-full flex bg-black/20" onClick={onClose}> {/*clicking out*/}

                <div 
                    className="flex-1 flex-col rounded-[5px] border-light-border m-20 mx-95 z-10 bg-[#FBFCFD] p-6 overflow-y-auto drop-shadow-[#ABABAB] [&::-webkit-scrollbar]:hidden"
                    onClick={(e) => e.stopPropagation()}>

                    <h1 className="text-[20px] text-[#565656] font-medium text-left w-full">
                        Available Times
                    </h1>

                    {sortedTBs.map((tb) => {
                        const { weekday, day, month } = getDateInfo(tb.startTime);
                        const timeSlot = getTimeSlot(tb.startTime, tb.endTime);
                        const sortedTasks = sortTasks(tb);

                        return(
                            <div key={tb.id} className="border-b pb-4 mb-4 flex-col items-center pt-1.75">
                                <div className="flex gap-1 items-baseline">
                                    <h1 className= "text-[14px] text-[#565656] font-medium">
                                        {weekday}
                                    </h1>
                                    <h1 className= "text-[12px] text-[#7D7D7D]">
                                        {day} {month}
                                    </h1>
                                </div>

                                <div className="flex justify-between mr-5 items-baseline">
                                    <h1 className="cursor-pointer text-[14px] px-2 py-1 rounded-lg border-[#02AFC7] border text-[#565656] bg-[#F5FAFA]">
                                        {timeSlot}
                                    </h1>
                                   
                                    <button 
                                    onClick= {() => addShift(tb)}
                                    className="text-[#FFFFFF] text-[14px] rounded-lg bg-[#02AFC7] px-3 py-2">
                                        +  Add Shift
                                    </button>
                                </div>
                                
                                <div className= "flex-col pt-2">
                                    {/*need to map through each task*/}

                                    {sortedTasks.map((task) => {
                                        const { city, zipCode } = getLocoInfo(task);
                                        
                                        return(
                                            <div key={task.id} className="flex gap-0.75 pt-2 items-baseline">
                                                <h1 className= "text-[14px] text-[#565656] font-medium">
                                                    {city}
                                                </h1>
                                                <h1 className= "text-[12px] text-[#7D7D7D]">
                                                    {zipCode}
                                                </h1>
                                                <h1 className= "bg-[#E6E6E6] text-[#383838] px-2.5 py-0.75 rounded-[2px] text-[12px]">
                                                    {task.items.length}
                                                </h1>
                                            </div>
                                        );
                                    })}

                                    {/*then submit with the add shift, and also the list of shifts by zip code and stuff*/}
                                </div>
                            </div>
                        );
                    })} 
                </div>
            </div>    
        </div>
    )
}