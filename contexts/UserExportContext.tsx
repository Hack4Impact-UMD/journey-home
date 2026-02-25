"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type ExportContextType = {
    onExport: (() => void) | null;
    setOnExport: (fn: () => void) => void;
};

const ExportContext = createContext<ExportContextType>({
    onExport: null,
    setOnExport: () => {},
});

export function ExportProvider({ children }: { children: ReactNode }) {
    const [onExport, setOnExport] = useState<(() => void) | null>(null);
    return (
        <ExportContext.Provider value={{ onExport, setOnExport }}>
            {children}
        </ExportContext.Provider>
    );
}

export function useExport() {
    return useContext(ExportContext);
}