import { useEffect } from "react";
import { createPortal } from "react-dom";
import { TimeBlock, Task, Delivery, Pickup } from "@/types/schedule";
import { useTimeBlocks } from "@/lib/queries/timeblocks";
import { Timestamp } from "firebase/firestore";
import { useDonationRequests } from "@/lib/queries/donation-requests";
import { useClientRequests } from "@/lib/queries/client-requests";
import { getTotalItems } from "./Request";
import { Plus } from "lucide-react";
import { toast } from "sonner";

// will need the props on the item being scheduled? to send into the firestore once i hit set shift 
// would probably have the item identifier, onClose() function 
// taking inspo from item-review, donation request

type ScheduleModalProps = {
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
 } : ScheduleModalProps) { 

    const { allTB: timeBlocks, setTimeblock } = useTimeBlocks();
    const { setDonationRequest } = useDonationRequests();
    const { setClientRequest } = useClientRequests();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);


    //sorting timeblocks in latest to furthest away
    //doing this for now, should 100 percent find a better way to do this in the future
    const sortedTBs = [...timeBlocks].sort((a, b) => a.startTime.toMillis() - b.startTime.toMillis());

    const addShift = async (tb: TimeBlock) => {
        const writes: Promise<void>[] = [];

        //remove from old timeblock if rescheduling
        const currentTB = scheduleRequest.associatedTimeBlockID;
        if (currentTB && currentTB !== tb.id) {
            const oldTB = timeBlocks.find(t => t.id === currentTB);
            if (oldTB) {
                writes.push(setTimeblock({
                    ...oldTB,
                    tasks: oldTB.tasks.filter(task => task.id !== scheduleRequest.id),
                }));
            }
        }

        //add to new timeblock
        const alreadyInTB = tb.tasks.some(task => task.id === scheduleRequest.id);
        writes.push(setTimeblock({
            ...tb,
            tasks: alreadyInTB ? tb.tasks : [...tb.tasks, scheduleRequest],
        }));

        //update associated timeblock id on the request
        const updatedReq = { ...scheduleRequest, associatedTimeBlockID: tb.id };
        writes.push(
            "donor" in scheduleRequest
                ? setDonationRequest(updatedReq as Pickup)
                : setClientRequest(updatedReq as Delivery)
        );

        const promise = Promise.all(writes);
        toast.promise(promise, {
            loading: "Assigning task to timeblock...",
            success: "Task assigned!",
            error: "Error: Couldn't assign task",
        });
        await promise;
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
            <div className="inset-0 w-full h-full flex bg-black/20 items-center justify-center" onClick={onClose}> {/*clicking out*/}

                <div
                    className="flex-1 flex flex-col rounded-sm border-light-border max-w-[25em] max-h-[40em] z-10 bg-[#FBFCFD] drop-shadow-md overflow-hidden"
                    onClick={(e) => e.stopPropagation()}>

                    <div className="px-6 pt-6 pb-3 bg-[#FBFCFD]">
                        <h1 className="text-xl text-[#565656] font-medium text-left w-full">
                            Available Times
                        </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6">

                    {sortedTBs.map((tb) => {
                        const { weekday, day, month } = getDateInfo(tb.startTime);
                        const timeSlot = getTimeSlot(tb.startTime, tb.endTime);
                        const sortedTasks = sortTasks(tb);
                        const currentTime = Timestamp.now();
                        const notCurrent = currentTime > tb.startTime

                        const isAlreadyAssigned = scheduleRequest.associatedTimeBlockID === tb.id;

                        if (notCurrent) return null;

                        return(
                            <div key={tb.id} className="border-b pb-4 mb-4 flex-col items-center pt-2">
                                <div className="flex gap-1 items-baseline">
                                    <h1 className= "text-sm text-[#565656] font-medium">
                                        {weekday}
                                    </h1>
                                    <h1 className= "text-xs text-[#7D7D7D]">
                                        {day} {month}
                                    </h1>
                                </div>

                                <div className="flex justify-between items-baseline">
                                    <p className="cursor-pointer text-sm px-2 py-1 mr-auto font-family-roboto rounded-sm border-primary border text-[#565656] bg-[#F5FAFA]">
                                        {timeSlot}
                                    </p>
                                   
                                    <button 
                                    onClick= {isAlreadyAssigned ? undefined : () => addShift(tb)}
                                    disabled= {isAlreadyAssigned}
                                    className={`text-xs rounded-sm px-3 py-2 flex items-center gap-1.5
                                        ${isAlreadyAssigned
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                            : "bg-primary text-white"}`
                                        }>
                                        {isAlreadyAssigned ? <></> : <Plus className="h-3 w-3" />}
                                        <span className="">
                                            {isAlreadyAssigned ? "Assigned" :  "Add To Shift"}
                                        </span>
                                    </button>
                                </div>
                                
                                <div className= "flex-col pt-2">
                                    {/*need to map through each task*/}

                                    {sortedTasks.map((task) => {
                                        const { city, zipCode } = getLocoInfo(task);
                                        
                                        return(
                                            <div key={task.id} className="flex gap-1 pt-2 items-baseline">
                                                <h1 className= "text-sm text-[#565656] font-medium">
                                                    {city}
                                                </h1>
                                                <h1 className= "text-xs text-[#7D7D7D]">
                                                    {zipCode}
                                                </h1>
                                                <h1 className= "bg-[#E6E6E6] text-[#383838] px-2.5 py-1 rounded-sm text-xs">
                                                    {getTotalItems(task)}
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

                    <div className="px-6 py-2 bg-[#FBFCFD] shadow-[0_-2px_6px_rgba(0,0,0,0.08)] flex justify-end">
                        <button onClick={onClose} className="border-light-border border rounded-xs px-4 py">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}