"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useQueryParams } from "@/hooks/use-query-params";
import { CreateUserModal } from "./create-user-modal";
import { Plus } from "lucide-react";

interface DataTableToolbarProps {
  onCreateClick?: () => void;
}

export function DataTableToolbar({ onCreateClick }: DataTableToolbarProps) {
  const t = useTranslations("common");
  const { search, setSearch, role, setRole } = useQueryParams();

  const isFiltered = search || role !== "null";

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          placeholder={t("searchPlaceholder")}
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-full sm:w-[150px] lg:w-[250px]"
        />

        <Select value={role || "null"} onValueChange={setRole}>
          <SelectTrigger className="h-8 w-full sm:w-[130px]">
            <SelectValue placeholder={t("selectRole")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="null">{t("all")}</SelectItem>
            <SelectItem value="admin">{t("roles.admin")}</SelectItem>
            <SelectItem value="user">{t("roles.user")}</SelectItem>
            <SelectItem value="super_admin">
              {t("roles.super_admin")}
            </SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setRole("null");
            }}
            className="h-8 w-full px-2 sm:w-auto lg:px-3"
          >
            {t("clear")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <CreateUserModal>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={onCreateClick}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("createUser")}
          </Button>
        </CreateUserModal>
      </div>
    </div>
  );
}
