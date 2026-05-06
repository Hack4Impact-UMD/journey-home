"use client";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
  disabled = false,
}: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded border ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${
        isPrimary
          ? "bg-primary border-primary text-white"
          : "bg-white border-gray-300 text-gray-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

