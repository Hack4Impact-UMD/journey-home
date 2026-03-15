import React from "react";
import { EventProps } from "react-big-calendar";
import { MyEvent } from "../../types/schedule";

export const ShiftBlock = ({ event }: EventProps<MyEvent>) => {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center rounded overflow-hidden">
      <div className="w-full text-black font-bold text-xs text-center mb-1">
        Available
      </div>
      <div className="text-[#6B7A99] text-[10px]">
        {`${formatTime(event.start)} - ${formatTime(event.end)}`}
      </div>
    </div>
  );
};