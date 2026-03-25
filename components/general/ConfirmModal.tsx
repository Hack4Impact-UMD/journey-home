"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/form/Button"; 

type ConfirmModalProps = {
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
  confirmDisabled?: boolean; 
};

export default function ConfirmModal({
  title,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center font-family-roboto">
      <div
        className="md:w-full md:h-full flex items-center justify-center"
        onClick={onCancel}
      >
        <div
          className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {title}
          </h2>

          <div className="mb-6">{children}</div>

          <Button
            onClick={onConfirm}
            className="w-full py-3 text-lg"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}