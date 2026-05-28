"use client";

import { useEffect, useRef, useState } from "react";
import { useWaivers } from "@/lib/queries/waivers";
import { Badge } from "@/components/inventory/Badge";
import { WaiverPdfViewer } from "@/components/control-panel/WaiverPdfViewer";
import { Plus, Download } from "lucide-react";
import { Waiver } from "@/types/user";

export default function WaiverPage() {
    const { waivers, activeWaiver, uploadWaiver, isMutating } = useWaivers();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedWaiver, setSelectedWaiver] = useState<Waiver | null>(null);
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        if (activeWaiver && !selectedWaiver) setSelectedWaiver(activeWaiver);
    }, [activeWaiver, selectedWaiver]);

    useEffect(() => {
        if (!dateFilter) {
            setSelectedWaiver(activeWaiver);
            return;
        }
        const ts = new Date(dateFilter).getTime() / 1000;
        const match = waivers.find((w) => {
            const started = w.start.seconds <= ts;
            const notEnded = w.end === null || w.end.seconds > ts;
            return started && notEnded;
        });
        if (match) setSelectedWaiver(match);
    }, [dateFilter, waivers, activeWaiver]);

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadWaiver(file);
        e.target.value = "";
    }

    const sorted = [...waivers].sort((a, b) => b.start.seconds - a.start.seconds);

    return (
        <div className="flex flex-col h-full">
            <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="flex mb-4">
                <input
                    type="datetime-local"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="h-8 rounded-xs border border-light-border px-3 text-sm text-text-1"
                />
                <button
                    className="flex items-center gap-1 px-3 py-2 h-8 text-sm rounded-xs bg-primary text-white cursor-pointer ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isMutating}
                >
                    <Plus className="w-4 h-4" /> Update Waiver
                </button>
            </div>

            <div className="flex border border-light-border flex-1 min-h-0">
                <div className="w-64 border-r border-light-border bg-[#FAFAFB] overflow-y-auto">
                    {sorted.map((waiver) => (
                        <div
                            className={`border-b border-light-border p-4 flex flex-col gap-1 cursor-pointer hover:bg-[#F0F0F2] ${selectedWaiver?.id === waiver.id ? "bg-[#F0F0F2]" : ""}`}
                            key={waiver.id}
                            onClick={() => { setDateFilter(""); setSelectedWaiver(waiver); }}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-bold">Version {waiver.id}</span>
                                {waiver.end === null && (
                                    <span className="text-xs">
                                        <Badge text="Current" color="purple" />
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-[#7D7D7D]">
                                Uploaded{" "}
                                {waiver.start.toDate().toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex-1 flex overflow-hidden">
                    {selectedWaiver ? (
                        <div className="p-8 w-full h-full flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex flex-col">
                                    <span className="text-xl font-medium">Version {selectedWaiver.id}</span>
                                    <span className="text-sm text-[#7D7D7D]">
                                {selectedWaiver.end === null
                                    ? `Active since ${selectedWaiver.start.toDate().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                                    : `Active from ${selectedWaiver.start.toDate().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })} to ${selectedWaiver.end.toDate().toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}`
                                }
                                    </span>
                                </div>
                                <button
                                    className="flex items-center gap-1 px-3 py-2 h-8 text-sm rounded-xs bg-primary text-white cursor-pointer shrink-0"
                                    onClick={async () => {
                                        const blob = await fetch(selectedWaiver.file).then((r) => r.blob());
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement("a");
                                        a.href = url;
                                        a.download = `waiver-v${selectedWaiver.id}.pdf`;
                                        a.click();
                                        URL.revokeObjectURL(url);
                                    }}
                                >
                                    <Download className="w-4 h-4" /> Download
                                </button>
                            </div>
                            <WaiverPdfViewer url={selectedWaiver.file} />
                            
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
                            Select a waiver to preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
