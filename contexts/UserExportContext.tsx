"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ExportContextType = {
    onExport: (() => void) | null;
    setOnExport: React.Dispatch<React.SetStateAction<(() => void) | null>>;
};

const ExportContext = createContext<ExportContextType | undefined>(undefined);

export function ExportProvider({ children }: { children: ReactNode }) {
    const [onExport, setOnExport] = useState<(() => void) | null>(null);
     
    return (
        <ExportContext.Provider
            value={{
                onExport,
                setOnExport,
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