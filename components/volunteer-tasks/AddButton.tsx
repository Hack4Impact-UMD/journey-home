"use client"

export default function AddButton({ onClick }: { onClick?: () => void }) {
    return (
        <div>
            <button onClick={onClick} className="bg-[#02AFC7] text-white w-[6em] h-[2em]">
                Add 
            </button>
        </div>
    )
}