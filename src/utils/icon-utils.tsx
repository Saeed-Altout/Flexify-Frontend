import { LucideIcon } from "lucide-react";
import { getLucideIcon } from "@/constants/lucide-icons";

/**
 * Get a Lucide icon component by name
 * @deprecated Use getLucideIcon from @/constants/lucide-icons instead
 */
export function getIconComponent(
  iconName: string | null | undefined
): LucideIcon | null {
  if (!iconName) return null;
  return getLucideIcon(iconName);
}

/**
 * Render an icon by name
 */
export function renderIcon(
  iconName: string | null | undefined,
  className?: string
) {
  const IconComponent = getIconComponent(iconName);
  if (!IconComponent) return null;

  return <IconComponent className={className} />;
}
