"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export function WaiverPdfViewer({ url }: { url: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setError(false);
        setPdf(null);

        pdfjsLib.getDocument(url).promise.then((doc) => {
            if (cancelled) return;
            setPdf(doc);
        }).catch(() => {
            if (!cancelled) setError(true);
        });

        return () => { cancelled = true; };
    }, [url]);

    useEffect(() => {
        const container = containerRef.current;
        const scroll = scrollRef.current;
        if (!pdf || !container || !scroll) return;
        let cancelled = false;

        async function render() {
            container!.innerHTML = "";
            const availableWidth = scroll!.clientWidth - 32;
            for (let pageNum = 1; pageNum <= pdf!.numPages; pageNum++) {
                if (cancelled) return;
                const page = await pdf!.getPage(pageNum);
                const naturalViewport = page.getViewport({ scale: 1 });
                const viewport = page.getViewport({ scale: availableWidth / naturalViewport.width });
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.className = "shadow-lg";
                container!.appendChild(canvas);
                await page.render({ canvas, viewport }).promise;
            }
        }

        render();
        return () => { cancelled = true; };
    }, [pdf]);

    if (error) return (
        <div className="flex-1 flex items-center justify-center text-sm text-red-500">
            Failed to load PDF.
        </div>
    );

    if (!pdf) return (
        <div className="flex-1 flex items-center justify-center text-sm text-[#A2A2A2]">
            Loading...
        </div>
    );

    return (
        <div ref={scrollRef} className="w-full h-full overflow-auto bg-[#525659] p-4 rounded-xl border-light-border border-2 shadow-lg">
            <div ref={containerRef} className="flex flex-col gap-4" />
        </div>
    );
}
