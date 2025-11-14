"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Context for table state
interface DataTableContextValue<TData = unknown> {
  table: ReturnType<typeof useReactTable<TData>>;
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  pageCount: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
}

const DataTableContext =
  React.createContext<DataTableContextValue<unknown> | null>(null);

function useDataTableContext() {
  const context = React.useContext(DataTableContext);
  if (!context) {
    throw new Error("DataTable components must be used within DataTable");
  }
  return context;
}

// Root component
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  pageCount?: number;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  onPaginationChange?: (page: number, pageSize: number) => void;
  children: React.ReactNode;
  className?: string;
}

function DataTableRoot<TData, TValue>({
  columns,
  data,
  isLoading = false,
  pageCount = 1,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPaginationChange,
  children,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: currentPage - 1,
    pageSize,
  });

  React.useEffect(() => {
    setPagination({
      pageIndex: currentPage - 1,
      pageSize,
    });
  }, [currentPage, pageSize]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    manualPagination: !!onPaginationChange,
    pageCount,
    state: {
      sorting,
      pagination,
    },
  });

  const contextValue: DataTableContextValue = {
    table,
    isLoading,
    totalCount,
    currentPage,
    pageSize,
    pageCount,
    onPaginationChange,
  };

  return (
    <DataTableContext.Provider value={contextValue}>
      <div className={cn("space-y-4", className)}>{children}</div>
    </DataTableContext.Provider>
  );
}

// Container component
function DataTableContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("rounded-md border", className)} {...props}>
      {children}
    </div>
  );
}

// Header component
function DataTableHeader() {
  const { table } = useDataTableContext();
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}

// Body component
function DataTableBody({
  emptyMessage = "No results.",
  children,
}: {
  emptyMessage?: string;
  children?: React.ReactNode;
}) {
  const { table } = useDataTableContext();
  const rows = table.getRowModel().rows;

  if (children) {
    return <TableBody>{children}</TableBody>;
  }

  return (
    <TableBody>
      {rows?.length ? (
        rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

// Loading skeleton component
function DataTableLoading({ columns }: { columns: number }) {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: columns }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

// Pagination info component
function DataTablePaginationInfo({
  translations,
  className,
}: {
  translations?: {
    showing?: string;
    noResults?: string;
  };
  className?: string;
}) {
  const { totalCount, currentPage, pageSize } = useDataTableContext();

  if (totalCount === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)}>
        {translations?.noResults || "No results."}
      </div>
    );
  }

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);

  const text = translations?.showing
    ? translations.showing
        .replace(/\{from\}/g, String(from))
        .replace(/\{to\}/g, String(to))
        .replace(/\{total\}/g, String(totalCount))
    : `Showing ${from} to ${to} of ${totalCount} results`;

  return (
    <div className={cn("text-sm text-muted-foreground", className)}>{text}</div>
  );
}

// Pagination controls component
function DataTablePaginationControls({
  translations,
  className,
}: {
  translations?: {
    page?: string;
    firstPage?: string;
    previousPage?: string;
    nextPage?: string;
    lastPage?: string;
  };
  className?: string;
}) {
  const { currentPage, pageCount, pageSize, onPaginationChange } =
    useDataTableContext();

  const handlePageChange = (page: number) => {
    onPaginationChange?.(page, pageSize);
  };

  const pageText = translations?.page
    ? translations.page
        .replace(/\{current\}/g, String(currentPage))
        .replace(/\{total\}/g, String(pageCount))
    : `Page ${currentPage} of ${pageCount}`;

  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-2", className)}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{translations?.firstPage || "First page"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{translations?.previousPage || "Previous page"}</p>
          </TooltipContent>
        </Tooltip>
        <div className="text-sm">{pageText}</div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pageCount}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{translations?.nextPage || "Next page"}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pageCount)}
              disabled={currentPage >= pageCount}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{translations?.lastPage || "Last page"}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

// Pagination wrapper component
function DataTablePagination({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-between", className)}
      {...props}
    >
      {children}
    </div>
  );
}

// Main table component
function DataTableContent() {
  const { isLoading } = useDataTableContext();
  const { table } = useDataTableContext();

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {table.getAllColumns().map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <DataTableLoading columns={table.getAllColumns().length} />
      </Table>
    );
  }

  return (
    <Table>
      <DataTableHeader />
      <DataTableBody />
    </Table>
  );
}

// Export compound components
export const DataTable = Object.assign(DataTableRoot, {
  Container: DataTableContainer,
  Content: DataTableContent,
  Header: DataTableHeader,
  Body: DataTableBody,
  Loading: DataTableLoading,
  Pagination: DataTablePagination,
  PaginationInfo: DataTablePaginationInfo,
  PaginationControls: DataTablePaginationControls,
});
