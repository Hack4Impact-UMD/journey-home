"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/form/Button";

type ConfirmModalProps = {
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
    children?: React.ReactNode;
};

export default function ConfirmModal({
    confirmLabel,
    onConfirm,
    onCancel,
    children,
}: ConfirmModalProps) {
    // prevents background scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 font-family-roboto"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6">{children}</div>

                <Button onClick={onConfirm}     
                    className="w-full text-lg text-white bg-primary flex items-center justify-center">
                    {confirmLabel}
                </Button>
            </div>
        </div>,
        document.body
    );
}
