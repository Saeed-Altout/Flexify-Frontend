import * as React from "react";
import { getLucideIcon, LUCIDE_ICON_NAMES } from "@/constants/lucide-icons";

/**
 * Dynamically loads an icon from Lucide Icons by name
 * @param iconName - The name of the icon (e.g., "Home", "Briefcase", "briefcase")
 * @returns The icon component or null if not found
 */
export function getIconComponent(
  iconName: string
): React.ComponentType<{ className?: string }> | null {
  if (!iconName) return null;
  
  // Try exact match first
  let icon = getLucideIcon(iconName);
  if (icon) return icon;
  
  // Try case-insensitive match
  const normalizedName = iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase();
  icon = getLucideIcon(normalizedName);
  if (icon) return icon;
  
  // Try finding by case-insensitive search in icon names
  const foundName = LUCIDE_ICON_NAMES.find(
    (name) => name.toLowerCase() === iconName.toLowerCase()
  );
  if (foundName) {
    return getLucideIcon(foundName);
  }
  
  return null;
}
