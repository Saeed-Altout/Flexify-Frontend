import * as React from "react";
import * as TablerIcons from "@tabler/icons-react";

/**
 * Dynamically loads an icon from Tabler Icons by name
 * @param iconName - The name of the icon (e.g., "IconHome", "IconBriefcase")
 * @returns The icon component or null if not found
 */
export function getIconComponent(
  iconName: string
): React.ComponentType<{ className?: string }> | null {
  // Remove "Icon" prefix if present and add it back to match Tabler naming
  const normalizedName = iconName.startsWith("Icon")
    ? iconName
    : `Icon${iconName}`;

  // @ts-expect-error - Dynamic access to icon exports
  const IconComponent = TablerIcons[normalizedName];

  return IconComponent || null;
}
