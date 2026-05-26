"use client";

import { createContext, useContext, useRef, useState, useCallback, ReactNode } from "react";

type ExportContextType = {
    hasExport: boolean;
    setExportHandler: (fn: (() => void) | null) => void;
    triggerExport: () => void;
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: ReactNode }) {
    const onExportRef = useRef<(() => void) | null>(null);
    const [hasExport, setHasExport] = useState(false);

    const setExportHandler = useCallback((fn: (() => void) | null) => {
        onExportRef.current = fn;
        setHasExport(fn !== null);
    }, []);

    const triggerExport = useCallback(() => {
        onExportRef.current?.();
    }, []);

    return (
        <ExportContext.Provider value={{ hasExport, setExportHandler, triggerExport }}>
            {children}
        </ExportContext.Provider>
    );
}

export function useExport() {
    const context = useContext(ExportContext);
    if (!context) {
        throw new Error("useExport must be used within an ExportProvider");
    }
    return context;
}
