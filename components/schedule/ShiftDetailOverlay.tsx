"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
  XCircleIcon,
  UserIcon,
  MapPinIcon,
  CubeIcon,
  SteeringWheelIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { TimeBlock, Task } from "../../types/schedule";
import { DonationRequest } from "../../types/donations";
import { ClientRequest } from "../../types/client-requests";
import { useAllActiveAccounts } from "../../lib/queries/users";
import { useTimeBlocks } from "../../lib/queries/timeblocks";
import { ConfirmModal } from "../general/ConfirmModal";
import { ShiftEditModal } from "./ShiftEditModal";
import { Switch } from "../ui/switch";

function isPickup(task: Task): task is DonationRequest { return "donor" in task; }
function isDelivery(task: Task): task is ClientRequest { return "client" in task; }

function shortenTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12}${ampm}` : `${h12}:${String(m).padStart(2, "0")}${ampm}`;
}

function formatHeaderDate(start: Date): string {
  return start.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatAddress(addr: { streetAddress: string; apt?: string; city: string; state: string; zipCode: string }): string {
  const apt = addr.apt ? ` ${addr.apt}` : "";
  return `${addr.streetAddress}${apt}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
}

interface Props {
  timeBlock: TimeBlock | null;
  onClose: () => void;
}

export function ShiftDetailOverlay({ timeBlock, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { allTB, setTimeblockToast, deleteTimeblockToast } = useTimeBlocks();
  const { allAccounts, isLoading: accountsLoading } = useAllActiveAccounts();

  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{
    userId: string;
    groupName: string;
    name: string;
  } | null>(null);

  // Always derive from live cache so optimistic updates (toggle, volunteer removal) reflect immediately
  const liveTimeBlock = timeBlock
    ? (allTB.find(tb => tb.id === timeBlock.id) ?? timeBlock)
    : null;

  useEffect(() => {
    setShowEdit(false);
    setConfirmDelete(false);
    setRemoveTarget(null);
  }, [timeBlock]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !confirmDelete && !removeTarget) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, confirmDelete, removeTarget]);

  if (!liveTimeBlock) return null;

  if (showEdit) {
    return (
      <ShiftEditModal
        timeBlock={liveTimeBlock}
        onClose={() => setShowEdit(false)}
        onSaved={() => setShowEdit(false)}
      />
    );
  }

  const startDate = liveTimeBlock.startTime.toDate();
  const endDate = liveTimeBlock.endTime.toDate();
  const isPickupType = liveTimeBlock.type === "Pickup/Delivery";

  const handleTogglePublished = async (checked: boolean) => {
    await setTimeblockToast({ ...liveTimeBlock, published: checked });
  };

  const handleDelete = async () => {
    await deleteTimeblockToast(liveTimeBlock);
    onClose();
  };

  const handleRemoveVolunteer = async () => {
    if (!removeTarget) return;
    const updatedGroups = liveTimeBlock.volunteerGroups.map(g =>
      g.name === removeTarget.groupName
        ? { ...g, volunterIDs: g.volunterIDs.filter(id => id !== removeTarget.userId) }
        : g
    );
    await setTimeblockToast({ ...liveTimeBlock, volunteerGroups: updatedGroups });
    setRemoveTarget(null);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <div
          ref={overlayRef}
          className="w-[25em] h-[37.5em] rounded-[0.625em] bg-[#FBFCFD] shadow-2xl flex flex-col px-6 py-4.5 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Icon row */}
          <div className="flex justify-end gap-3 shrink-0">
            <button
              onClick={() => setShowEdit(true)}
              className="text-text-1 hover:opacity-60 transition-opacity"
              aria-label="Edit shift"
            >
              <PencilSimpleIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-text-1 hover:text-red-500 transition-colors"
              aria-label="Delete shift"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-text-1 hover:opacity-60 transition-opacity"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Shift name */}
          <h2 className="text-xl font-bold text-primary shrink-0">
            {liveTimeBlock.name || "Unnamed Shift"}
          </h2>

          {/* Date and time */}
          <p className="text-xs text-gray-500 mt-2 shrink-0">
            {formatHeaderDate(startDate)}&nbsp;|&nbsp;{shortenTime(startDate)}–{shortenTime(endDate)}
          </p>

          {/* Shift type indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="h-[0.75em] w-[0.75em] rounded-full shrink-0"
              style={{ backgroundColor: isPickupType ? "#02AFC7" : "#FBCF0B" }}
            />
            <span className="text-xs text-gray-500">
              {isPickupType ? "Pickups/Deliveries" : "Warehouse"}
            </span>
          </div>

          {/* Published toggle */}
          <div className="flex items-center mt-4 shrink-0">
            <span className="text-sm text-gray-700">Published</span>
            <Switch
              checked={liveTimeBlock.published}
              onCheckedChange={handleTogglePublished}
              className="ml-6 data-[state=unchecked]:bg-[#BFBFBF]"
            />
          </div>

          {/* Section divider */}
          <div className="mt-4 h-px bg-[#E3E3E3] shrink-0" />

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="pt-4 pb-1">

              {/* Volunteer groups */}
              {liveTimeBlock.volunteerGroups.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No volunteer groups</p>
              ) : (
                <div className="space-y-4">
                  {liveTimeBlock.volunteerGroups.map(group => {
                    const groupVolunteers = accountsLoading
                      ? []
                      : allAccounts.filter(u => group.volunterIDs.includes(u.uid));
                    const isDriver = group.name.toLowerCase().includes("drive");
                    const GroupIcon = isDriver ? SteeringWheelIcon : UsersThreeIcon;
                    return (
                      <div key={group.name}>
                        <p className="text-sm font-medium flex items-center gap-1.5 text-[#565656]">
                          <GroupIcon className="w-4 h-4 shrink-0" />
                          {group.name}&nbsp;|&nbsp;{group.volunterIDs.length}/{group.maxNum}
                        </p>
                        {groupVolunteers.length === 0 ? (
                          <p className="text-xs text-gray-400 italic mt-2">No one signed up</p>
                        ) : (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {groupVolunteers.map(v => (
                              <span
                                key={v.uid}
                                className="inline-flex items-center gap-1 py-1 px-2.5 rounded-xs bg-[#D4F0ED] text-[#003530] text-sm"
                              >
                                {v.firstName} {v.lastName}
                                <button
                                  onClick={() => setRemoveTarget({
                                    userId: v.uid,
                                    groupName: group.name,
                                    name: `${v.firstName} ${v.lastName}`,
                                  })}
                                  className="flex items-center"
                                  aria-label={`Remove ${v.firstName} ${v.lastName}`}
                                >
                                  <XCircleIcon className="h-[1em] w-[1em]" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                </div>
              )}

              {/* Divider */}
              <div className="mt-4 -mx-6 h-px bg-[#E3E3E3]" />

              {/* Shift Details */}
              <div className="mt-4">
                <p className="text-sm font-medium text-[#565656]">Shift Details</p>

                {liveTimeBlock.tasks.length === 0 ? (
                  <p className="text-sm text-gray-400 italic mt-3">No tasks assigned</p>
                ) : (
                  <div className="space-y-4 mt-3">
                    {liveTimeBlock.tasks.map((task, idx) => {
                      if (isPickup(task)) {
                        const { donor } = task;
                        return (
                          <div key={task.id ?? idx}>
                            <div className="flex items-center gap-1.5 text-[#383838]">
                              <UserIcon className="h-4 w-4 shrink-0" />
                              <span className="text-sm">
                                <span className="font-bold">Pickup:</span> {donor.firstName} {donor.lastName}
                              </span>
                            </div>
                            <div className="pl-6 mt-1 space-y-1">
                              <div className="flex items-start gap-2 text-[#383838]">
                                <MapPinIcon className="h-4 w-4 shrink-0 mt-px" />
                                <span className="text-xs">
                                  <span className="font-bold">Address:</span> {formatAddress(donor.address)}
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[#383838]">
                                <CubeIcon className="h-4 w-4 shrink-0 mt-px" />
                                <span className="text-xs">
                                  <span className="font-bold">Number of Items:</span> {task.items.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (isDelivery(task)) {
                        const { client } = task;
                        return (
                          <div key={task.id ?? idx}>
                            <div className="flex items-center gap-1.5 text-[#383838]">
                              <UserIcon className="h-4 w-4 shrink-0" />
                              <span className="text-sm">
                                <span className="font-bold">Delivery:</span> {client.firstName} {client.lastName}
                              </span>
                            </div>
                            <div className="pl-6 mt-1 space-y-1">
                              <div className="flex items-start gap-2 text-[#383838]">
                                <MapPinIcon className="h-4 w-4 shrink-0 mt-px" />
                                <span className="text-xs">
                                  <span className="font-bold">Address:</span> {formatAddress(client.address)}
                                </span>
                              </div>
                              <div className="flex items-start gap-2 text-[#383838]">
                                <CubeIcon className="h-4 w-4 shrink-0 mt-px" />
                                <span className="text-xs">
                                  <span className="font-bold">Number of Items:</span> {task.items.length}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="mt-4 -mx-6 h-px bg-[#E3E3E3]" />

              {/* Shift Notes */}
              <div className="mt-4">
                <p className="text-sm font-medium text-[#565656]">Shift Notes</p>
                <p className="text-sm text-gray-500 mt-3 whitespace-pre-wrap">
                  {liveTimeBlock.notes || <span className="italic text-gray-400">No notes</span>}
                </p>
              </div>

              {/* Final divider */}
              <div className="mt-4 -mx-6 h-px bg-[#E3E3E3]" />

            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete Shift"
          message="Are you sure you want to delete this time block?"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {removeTarget && (
        <ConfirmModal
          title="Remove Volunteer"
          message={`Are you sure you want to remove ${removeTarget.name} from ${liveTimeBlock.name || "this shift"}?`}
          onConfirm={handleRemoveVolunteer}
          onCancel={() => setRemoveTarget(null)}
        />
      )}
    </>,
    document.body
  );
}
