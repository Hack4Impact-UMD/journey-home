"use client";

export function WaiverPdfViewer({ url }: { url: string }) {
    if (!url) return (
        <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
            No waiver available.
        </div>
    );

    return (
        <iframe
            src={url}
            className="w-full h-full border-0 rounded-xl"
            title="Waiver PDF"
        />
    );
}
