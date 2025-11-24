"use client";

import { useState, useMemo } from "react";
import { Search, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LUCIDE_ICON_NAMES, getLucideIcon } from "@/constants/lucide-icons";

// All available icons from constants
const allIcons = LUCIDE_ICON_NAMES;

// Icon renderer component to avoid creating components during render
function IconRenderer({
  icon,
  className,
}: {
  icon: LucideIcon | null;
  className?: string;
}) {
  if (!icon) return null;
  const Icon = icon;
  return <Icon className={className} />;
}

interface IconPickerProps {
  value?: string;
  onSelect: (iconName: string) => void;
  disabled?: boolean;
}

export function IconPicker({ value, onSelect, disabled }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get icon component by name (using constants)
  const getIconComponent = (iconName: string): LucideIcon | null => {
    return getLucideIcon(iconName);
  };

  // Filter icons based on search
  const filteredIcons = search
    ? allIcons.filter((icon) =>
        icon.toLowerCase().includes(search.toLowerCase())
      )
    : allIcons;

  // Filter valid icons that exist in the icon map
  const validIcons = filteredIcons.filter((iconName) => {
    const IconComponent = getIconComponent(iconName);
    return IconComponent !== null;
  });

  // Memoize selected icon component to avoid creating during render
  const SelectedIcon = useMemo(() => {
    return value ? getIconComponent(value) : null;
  }, [value]);

  // Debug
  if (typeof window !== "undefined" && open) {
    console.log("Icon picker opened:", {
      totalIcons: allIcons.length,
      validIcons: validIcons.length,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={disabled}
        >
          {SelectedIcon ? (
            <>
              <IconRenderer icon={SelectedIcon} className="mr-2 h-4 w-4" />
              <span className="flex-1 text-left">{value}</span>
            </>
          ) : (
            <span className="flex-1 text-left text-muted-foreground">
              Select icon...
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Icon</DialogTitle>
          <DialogDescription>
            Choose an icon from Lucide icons library
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {validIcons.length > 0 ? (
              <div className="grid grid-cols-8 gap-2 p-2">
                {validIcons.map((iconName) => {
                  const IconComponent = getIconComponent(iconName);
                  if (!IconComponent) return null;

                  const isSelected = value === iconName;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        onSelect(iconName);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-lg border transition-colors hover:bg-accent",
                        isSelected && "border-primary bg-primary/10"
                      )}
                      title={iconName}
                    >
                      <IconRenderer icon={IconComponent} className="h-5 w-5" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-muted-foreground space-y-2">
                <p>No icons found</p>
                <p className="text-xs">Total icons: {allIcons.length}</p>
                <p className="text-xs">Valid icons: {validIcons.length}</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
