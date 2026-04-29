import { ICON_MAP, DEFAULT_ICON_KEY, IconComponent } from "@/lib/icons";

interface PresetIconProps {
  icon: string | undefined;
  size?: number;
  className?: string;
}

export function PresetIcon({ icon, size = 32, className }: PresetIconProps) {
  const Icon: IconComponent = (icon && ICON_MAP[icon]) || ICON_MAP[DEFAULT_ICON_KEY];
  return <Icon size={size} className={className} />;
}
