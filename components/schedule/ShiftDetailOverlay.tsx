"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import {
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
  XCircleIcon,
  PlusCircleIcon,
  UserIcon,
  MapPinIcon,
  CubeIcon,
  SteeringWheelIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react";
import { SearchBox } from "../inventory/SearchBox";
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

function formatAddress(addr: { streetAddress: string; apt: string; city: string; state: string; zipCode: string }): string {
  const aptSuffix = addr.apt ? ` ${addr.apt}` : "";
  return `${addr.streetAddress}${aptSuffix}, ${addr.city}, ${addr.state} ${addr.zipCode}`;
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
  const [addVolunteerGroup, setAddVolunteerGroup] = useState<string | null>(null);
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [selectedVolunteerUids, setSelectedVolunteerUids] = useState<string[]>([]);

  // Always derive from live cache so optimistic updates (toggle, volunteer removal) reflect immediately
  const liveTimeBlock = timeBlock
    ? (allTB.find(tb => tb.id === timeBlock.id) ?? timeBlock)
    : null;

  useEffect(() => {
    setShowEdit(false);
    setConfirmDelete(false);
    setRemoveTarget(null);
    setAddVolunteerGroup(null);
    setVolunteerSearch("");
    setSelectedVolunteerUids([]);
  }, [timeBlock]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (addVolunteerGroup) { setAddVolunteerGroup(null); setVolunteerSearch(""); setSelectedVolunteerUids([]); }
      else if (!confirmDelete && !removeTarget) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, confirmDelete, removeTarget, addVolunteerGroup]);

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

  const currentGroup = addVolunteerGroup
    ? (liveTimeBlock.volunteerGroups.find(g => g.name === addVolunteerGroup) ?? null)
    : null;
  const remainingSpots = currentGroup
    ? currentGroup.maxNum - currentGroup.volunterIDs.length - selectedVolunteerUids.length
    : 0;
  const allAssignedUids = new Set(liveTimeBlock.volunteerGroups.flatMap(g => g.volunterIDs));
  const volunteerSearchResults = volunteerSearch && currentGroup && remainingSpots > 0
    ? allAccounts.filter(u =>
        u.role === "Volunteer" &&
        !allAssignedUids.has(u.uid) &&
        !selectedVolunteerUids.includes(u.uid) &&
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(volunteerSearch.toLowerCase())
      )
    : null;

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

  const handleAddVolunteer = async () => {
    if (!selectedVolunteerUids.length || !addVolunteerGroup) return;
    const updatedGroups = liveTimeBlock.volunteerGroups.map(g =>
      g.name === addVolunteerGroup
        ? { ...g, volunterIDs: [...g.volunterIDs, ...selectedVolunteerUids.filter(uid => !g.volunterIDs.includes(uid))] }
        : g
    );
    await setTimeblockToast({ ...liveTimeBlock, volunteerGroups: updatedGroups });
    setAddVolunteerGroup(null);
    setVolunteerSearch("");
    setSelectedVolunteerUids([]);
  };

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <div className="flex items-start gap-4" onClick={e => e.stopPropagation()}>
          <div
            ref={overlayRef}
            className="w-[25em] h-[37.5em] rounded-[0.625em] bg-[#FBFCFD] shadow-2xl flex flex-col px-6 py-4.5 overflow-hidden"
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
                <p className="text-sm text-gray-400">No volunteer groups</p>
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
                          {group.volunterIDs.length < group.maxNum && (
                            <button
                              onClick={() => { setAddVolunteerGroup(group.name); setVolunteerSearch(""); setSelectedVolunteerUids([]); }}
                              className="inline-flex items-center gap-1 py-1 px-2.5 rounded-xs bg-gray-100 text-black text-sm hover:opacity-70 transition-opacity"
                            >
                              Add volunteer
                              <PlusCircleIcon className="h-[1em] w-[1em]" />
                            </button>
                          )}
                        </div>
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
                  <p className="text-sm italic text-gray-400 mt-3">No tasks assigned</p>
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

          {/* Volunteer selection panel — appears to the right of the shift card */}
          {addVolunteerGroup && (
            <div className="w-56 shrink-0 bg-[#FBFCFD] rounded-[0.625em] shadow-2xl flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 shrink-0 flex items-center justify-between">
                <h2 className="text-xl font-medium font-family-roboto text-[#565656]">Select volunteers</h2>
                <button onClick={() => { setAddVolunteerGroup(null); setVolunteerSearch(""); setSelectedVolunteerUids([]); }} className="text-slate-400 hover:opacity-60 transition-opacity">
                  <XIcon className="w-3.5 h-3.5" />
                </button>
              </div>
              {/* Body */}
              <div className="px-6 pb-4">
                <SearchBox value={volunteerSearch} onChange={setVolunteerSearch} onSubmit={() => {}} inputClassName="w-36" />
                {volunteerSearch && (
                  remainingSpots <= 0 ? (
                    <p className="mt-2 text-xs text-gray-400 px-1">Group is full</p>
                  ) : volunteerSearchResults && volunteerSearchResults.length > 0 ? (
                    <div className="mt-2 border border-light-border rounded-xs max-h-36 overflow-y-auto">
                      {volunteerSearchResults.map(u => (
                        <button
                          key={u.uid}
                          onClick={() => setSelectedVolunteerUids(prev => [...prev, u.uid])}
                          className="w-full text-left px-3 py-1.5 text-sm text-text-1 hover:bg-gray-50 transition-colors"
                        >
                          {u.firstName} {u.lastName}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-gray-400 px-1">No volunteers found</p>
                  )
                )}
                {selectedVolunteerUids.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedVolunteerUids.map(uid => {
                      const u = allAccounts.find(a => a.uid === uid);
                      return (
                        <span key={uid} className="inline-flex items-center gap-1 py-1 px-2.5 rounded-xs bg-[#D4F0ED] text-[#003530] text-sm">
                          <span className="max-w-28 truncate">{u ? `${u.firstName} ${u.lastName}` : uid}</span>
                          <button
                            onClick={() => setSelectedVolunteerUids(prev => prev.filter(id => id !== uid))}
                            className="flex items-center"
                            aria-label={`Deselect ${u ? `${u.firstName} ${u.lastName}` : uid}`}
                          >
                            <XCircleIcon className="h-[1em] w-[1em]" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="flex justify-end px-6 py-4 shrink-0">
                <button
                  onClick={handleAddVolunteer}
                  disabled={!selectedVolunteerUids.length}
                  className="h-8 px-6 bg-primary text-white text-sm rounded-sm hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </div>
          )}

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
