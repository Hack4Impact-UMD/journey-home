import * as PhosphorIcons from "@phosphor-icons/react";

export type PhosphorIconComponent = React.ComponentType<{
  size?: number;
  strokeWidth?: number;
  className?: string;
}>;

export function isValidIcon(val: unknown): val is PhosphorIconComponent {
  if (!val) return false;
  if (typeof val === "function") return true;
  if (typeof val === "object" && val !== null && "render" in val) return true;
  return false;
}

const WEIGHT_SUFFIXES = ["", "Light", "Thin", "Regular", "Bold", "Fill", "Duotone"];

export function resolveIconComponent(base: string): PhosphorIconComponent | null {
  for (const suffix of WEIGHT_SUFFIXES) {
    const key = base + suffix;
    const val = (PhosphorIcons as Record<string, unknown>)[key];
    if (isValidIcon(val)) return val;
  }
  return null;
}
