"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const isPrimary = variant === "primary";
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded border ${
        isPrimary
          ? "bg-primary border-primary text-white"
          : "bg-white border-gray-300 text-gray-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

