"use client";

import { useRouter } from "next/navigation";

type MobileHeaderProps = {
    onBack?: () => void;
    backTo?: string;
};

export default function MobileHeader({ onBack, backTo }: MobileHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else if (backTo) {
            router.push(backTo);
        } else {
            router.back();
        }
    };

    return (
        <div className="md:hidden flex justify-between items-center px-4 py-3 bg-white">
            {/* Back button */}
            <button
                type="button"
                onClick={handleBack}
                className="flex items-center text-gray-700 font-medium"
            >
                <span className="text-xl mr-1">←</span>
                <span>Back</span>
            </button>

            {/* JOURNEYHOME text */}
            <div className="flex items-center text-lg font-raleway">
                <span className="text-primary">JOURNEY</span>
                <span className="text-[#FBCF0B]">HOME</span>
            </div>
        </div>
    );
}
