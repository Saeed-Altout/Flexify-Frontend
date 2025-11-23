/**
 * Lucide Icons Constants
 *
 * This file exports a curated list of 20 important Lucide icons
 * for use in the icon picker and throughout the application.
 */

import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Settings,
  Code,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  User,
  Users,
  FileText,
  Folder,
  Image,
  Video,
  ShoppingCart,
  Home,
  Globe,
  type LucideIcon,
} from "lucide-react";

// 20 Important icons with their names
export const LUCIDE_ICON_NAMES = [
  "HelpCircle",
  "MessageCircle",
  "Mail",
  "Phone",
  "Settings",
  "Code",
  "Database",
  "Server",
  "Cloud",
  "Shield",
  "Lock",
  "User",
  "Users",
  "FileText",
  "Folder",
  "Image",
  "Video",
  "ShoppingCart",
  "Home",
  "Globe",
] as const;

// Icon name to component mapping
export const LUCIDE_ICONS_MAP: Record<string, LucideIcon> = {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Settings,
  Code,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  User,
  Users,
  FileText,
  Folder,
  Image,
  Video,
  ShoppingCart,
  Home,
  Globe,
};

// Helper function to get icon component by name
export function getLucideIcon(name: string): LucideIcon | null {
  return LUCIDE_ICONS_MAP[name] || null;
}

// Popular icons (same as all icons for simplicity)
export const POPULAR_ICONS = LUCIDE_ICON_NAMES;
