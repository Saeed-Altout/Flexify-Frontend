"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Area,
  AreaHeader,
  AreaTable,
  AreaTitle,
  AreaPagination,
  AreaFooter,
  AreaToolbar,
  AreaDescription,
} from "@/components/ui/area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FilterIcon, SearchIcon, SortAscIcon } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export function ProjectsPageClient() {
  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
  ];
  return (
    <Area>
      <AreaHeader>
        <AreaTitle>Projects</AreaTitle>
        <AreaDescription>Manage projects in your organization</AreaDescription>
      </AreaHeader>
      <AreaToolbar>
        <InputGroup className="max-w-sm">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroup>
          <Button variant="destructive">clear filters</Button>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <SortAscIcon />
          </Button>
          <Button variant="outline" size="icon">
            <FilterIcon />
          </Button>
        </ButtonGroup>
      </AreaToolbar>
      <AreaTable columns={columns} data={[]} />
      <AreaPagination>
        <Button>Previous</Button>
        <Button>Next</Button>
      </AreaPagination>
      <AreaFooter>
        <p className="text-sm text-muted-foreground">
          This projects is a list of projects that you have created.
        </p>
      </AreaFooter>
    </Area>
  );
}
