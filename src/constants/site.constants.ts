export const GITHUB_REPO_URL = "https://github.com/Saeed-Altout";
export const GITHUB_FOLLOWERS = 17;
export const CV_URL = "/Saeed-Altout-CV.pdf";

/**
 * Statistics Constants
 *
 * Centralized constants for portfolio statistics.
 * These values can be replaced with API data later.
 */

export interface Statistic {
  id: string;
  value: number;
  suffix?: string; // e.g., "+", "%", "K"
  label: string;
  icon: string; // Icon name for translation key
}

export const STATISTICS: Statistic[] = [
  {
    id: "years",
    value: 5,
    suffix: "+",
    label: "Years of Experience",
    icon: "briefcase",
  },
  {
    id: "projects",
    value: 50,
    suffix: "+",
    label: "Projects Completed",
    icon: "folder",
  },
  {
    id: "technologies",
    value: 20,
    suffix: "+",
    label: "Technologies Mastered",
    icon: "code",
  },
  {
    id: "clients",
    value: 30,
    suffix: "+",
    label: "Happy Clients",
    icon: "users",
  },
];
