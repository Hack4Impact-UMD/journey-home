import { ICON_MAP, DEFAULT_ICON_KEY, IconComponent } from "@/lib/icons";

interface PresetIconProps {
  icon: string | undefined;
  className?: string;
}

export function PresetIcon({ icon, className }: PresetIconProps) {
  const Icon: IconComponent = (icon && ICON_MAP[icon]) || ICON_MAP[DEFAULT_ICON_KEY];
  return <Icon className={className} />;
}
