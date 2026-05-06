"use client";

import { InventoryCategory } from "@/types/inventory";
import { BoxIcon } from "lucide-react";

function getStockColor(quantity: number, low: number, high: number): string {
    if (quantity <= low) return "#E16060";
    if (quantity >= high) return "#208A1E";
    return "#FBCF0B";
}

function getStockBg(quantity: number, low: number, high: number): string {
    if (quantity <= low) return "#FFF5F5";
    if (quantity >= high) return "#F8FFF8";
    return "#FFFCEF";
}

function DialArc({ quantity, low, high }: { quantity: number; low: number; high: number }) {
    const color = getStockColor(quantity, low, high);
    const size = 140;
    const strokeWidth = 10;
    const r = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;

    const startAngle = 225;
    const totalAngle = 270;

    const maxVal = Math.max(high * 1.5, quantity + 1);
    const fillAngle = totalAngle * Math.min(quantity / maxVal, 1);

    function polarToCartesian(angle: number) {
        const rad = ((angle - 90) * Math.PI) / 180;
        return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }

    function arcPath(start: number, end: number) {
        const s = polarToCartesian(start);
        const e = polarToCartesian(end);
        const sweep = ((end - start) % 360 + 360) % 360;
        const large = sweep > 180 ? 1 : 0;
        return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <path
                d={arcPath(startAngle, startAngle + totalAngle)}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
            />
            {quantity > 0 && (
                <path
                    d={arcPath(startAngle, startAngle + fillAngle)}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            )}
        </svg>
    );
}
interface ItemDialProps {
    category: InventoryCategory;
    onClick: () => void;
}

export function ItemDial({ category, onClick }: ItemDialProps) {
    const { name, quantity, lowThreshold, highThreshold } = category;
    const color = getStockColor(quantity, lowThreshold, highThreshold);
    const bg = getStockBg(quantity, lowThreshold, highThreshold);

    return (
        <div
            className="rounded-2xl border border-light-border flex flex-col items-center justify-center pt-4 pb-5 px-4 w-full max-w-60 mx-auto cursor-pointer select-none hover:brightness-95 transition-all"
            style={{ backgroundColor: bg }}
            onClick={onClick}
        >
            <div className="relative flex items-center justify-center">
                <DialArc quantity={quantity} low={lowThreshold} high={highThreshold} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <BoxIcon className="w-10 h-10 text-[#333]" strokeWidth={1.5} />
                    <span className="text-base font-semibold leading-none" style={{ color }}>
                        {quantity}
                    </span>
                </div>
            </div>
            <span className="text-base font-medium text-[#333] text-center mt-1 leading-tight">
                {name}
            </span>
        </div>
    );
}