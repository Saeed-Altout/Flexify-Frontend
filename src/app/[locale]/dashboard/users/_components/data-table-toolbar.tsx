"use client";

import { PlusIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableFilter } from "@/components/ui/data-table-filters";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/inputs/search-input";
import { ButtonGroup } from "@/components/ui/button-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryParams } from "@/hooks/use-query-params";
import { CreateUserModal } from "./create-user-modal";

export function DataTableToolbar() {
  const t = useTranslations("common");
  const { search, setSearch, role, setRole, clearFilters, hasFilters } =
    useQueryParams();

  return (
    <div className="p-4 flex items-center justify-between">
      <SearchInput
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ButtonGroup>
        {hasFilters && (
          <Button variant="destructive" onClick={clearFilters}>
            <XIcon />
            <span className="sr-only">{t("clear")}</span>
          </Button>
        )}
        <CreateUserModal>
          <Button variant="outline">
            <PlusIcon />
            <span className="sr-only">{t("createUser")}</span>
          </Button>
        </CreateUserModal>
        <DataTableFilter>
          <SearchInput
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={role} onValueChange={(value) => setRole(value)}>
            <SelectTrigger className="w-full">
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
        </DataTableFilter>
      </ButtonGroup>
    </div>
  );
}
