import * as React from "react";

export function Card({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
