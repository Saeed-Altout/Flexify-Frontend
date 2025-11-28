"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "light"
                ? "scale-100 rotate-0"
                : "scale-0 -rotate-90 absolute"
            }`}
          />
          <Moon
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "dark"
                ? "scale-100 rotate-0"
                : "scale-0 rotate-90 absolute"
            }`}
          />
          <Monitor
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "neutral"
                ? "scale-100"
                : "scale-0 absolute"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("neutral")}>
          <Monitor className="mr-2 h-4 w-4" />
          Neutral
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
