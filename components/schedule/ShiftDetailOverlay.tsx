"use client";

import React, { useEffect, useRef, useState } from "react";
import { TimeBlock, Task } from "../../types/schedule";
import { DonationRequest } from "../../types/donations";
import { ClientRequest } from "../../types/client-requests";
import { useAllActiveAccounts } from "../../lib/queries/users";
import { EditShiftOverlay } from "./EditShiftOverlay";

interface ShiftDetailOverlayProps {
  timeBlock: TimeBlock | null;
  onClose: () => void;
  onSaved: () => void;
}

function isPickup(task: Task): task is DonationRequest {
  return "donor" in task;
}

function isDelivery(task: Task): task is ClientRequest {
  return "client" in task;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export const ShiftDetailOverlay = ({
  timeBlock,
  onClose,
  onSaved,
}: ShiftDetailOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { allAccounts, isLoading: accountsLoading } = useAllActiveAccounts();
  const [mode, setMode] = useState<"detail" | "edit">("detail");

  // Reset to detail view whenever a new timeblock is opened
  useEffect(() => { setMode("detail"); }, [timeBlock]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (timeBlock) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [timeBlock, onClose]);

  if (!timeBlock) return null;

  if (mode === "edit") {
    return (
      <EditShiftOverlay
        isOpen={true}
        timeBlock={timeBlock}
        onClose={onClose}
        onSaved={onSaved}
      />
    );
  }

  const startDate = timeBlock.startTime.toDate();
  const endDate = timeBlock.endTime.toDate();

  const volunteers = allAccounts.filter((user) =>
    timeBlock.volunteerIDs.includes(user.uid)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={overlayRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        style={{ maxHeight: "85vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <h2 className="text-xl font-bold text-[#02AFC7]">
            Pickups/Deliveries Shift
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(startDate)}&nbsp;&nbsp;|&nbsp;&nbsp;
            {formatTime(startDate)}–{formatTime(endDate)}
          </p>
        </div>

        {/* Volunteers */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-500 mb-3">
            Volunteers
          </h3>
          {accountsLoading ? (
            <p className="text-sm text-gray-400 italic">Loading volunteers…</p>
          ) : volunteers.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No volunteers assigned</p>
          ) : (
            <ul className="space-y-1">
              {volunteers.map((v) => (
                <li key={v.uid} className="text-sm text-gray-800 font-medium">
                  {v.firstName} {v.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Shift Details */}
        <div className="px-6 py-4">
          <h3 className="text-base font-semibold text-gray-500 mb-3">
            Shift details
          </h3>

          {timeBlock.tasks.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No tasks assigned</p>
          ) : (
            <div className="space-y-5">
              {timeBlock.tasks.map((task, idx) => {
                if (isPickup(task)) {
                  const donor = task.donor;
                  return (
                    <div key={task.id ?? idx}>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Pickup:{" "}
                        <span className="font-bold">
                          {donor.firstName} {donor.lastName}
                        </span>
                      </p>
                      <div className="pl-4 space-y-0.5">
                        <p className="text-xs font-semibold text-gray-600">Address:</p>
                        <p className="text-xs text-gray-700">{donor.address.streetAddress}</p>
                        <p className="text-xs text-gray-700">
                          {donor.address.city}, {donor.address.state} {donor.address.zipCode}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          <span className="font-semibold">Number of Items:</span>{" "}
                          {task.items.length}
                        </p>
                      </div>
                    </div>
                  );
                }

                if (isDelivery(task)) {
                  const client = task.client;
                  return (
                    <div key={task.id ?? idx}>
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        Delivery:{" "}
                        <span className="font-bold">
                          {client.firstName} {client.lastName}
                        </span>
                      </p>
                      <div className="pl-4 space-y-0.5">
                        <p className="text-xs font-semibold text-gray-600">Address:</p>
                        <p className="text-xs text-gray-700">{client.address.streetAddress}</p>
                        <p className="text-xs text-gray-700">
                          {client.address.city}, {client.address.state} {client.address.zipCode}
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          <span className="font-semibold">Number of Items:</span>{" "}
                          {task.items.length}
                        </p>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 flex justify-end">
          <button
            onClick={() => setMode("edit")}
            className="px-6 py-2 rounded-lg bg-[#02AFC7] text-white text-sm font-semibold hover:bg-[#0299AE] active:bg-[#027F93] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};