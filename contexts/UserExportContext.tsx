"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ExportContextType = {
    onExport: (() => void) | null;
    setOnExport: React.Dispatch<React.SetStateAction<(() => void) | null>>;
    selectedCount: number;
    setSelectedCount: React.Dispatch<React.SetStateAction<number>>;
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: ReactNode }) {
    const [onExport, setOnExport] = useState<(() => void) | null>(null);
    const [selectedCount, setSelectedCount] = useState<number>(0);

    return (
        <ExportContext.Provider
            value={{
                onExport,
                setOnExport,
                selectedCount,
                setSelectedCount,
            }}
        >
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