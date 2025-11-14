import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";

function AreaGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="region"
      data-slot="area-group"
      className={cn("group/area-group flex flex-col", className)}
      {...props}
    />
  );
}

function AreaSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="area-separator"
      orientation="horizontal"
      className={cn("my-0", className)}
      {...props}
    />
  );
}

const areaVariants = cva(
  "h-full w-full transition-colors outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] space-y-6",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        glass:
          "bg-white/80 backdrop-blur-sm text-card-foreground border border-border/50",
        muted: "bg-card text-card-foreground",
        outline: "border border-border bg-transparent",
      },
      size: {
        default: "p-4 md:p-6",
        sm: "p-2 md:p-4 lg:p-6",
        lg: "p-6 md:p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Area({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof areaVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="area"
      data-variant={variant}
      data-size={size}
      className={cn(areaVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function AreaContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-content"
      className={cn("h-full w-full grid gap-6", className)}
      {...props}
    />
  );
}

function AreaHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-header"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function AreaTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-slot="area-title"
      className={cn("text-2xl font-bold leading-tight", className)}
      {...props}
    />
  );
}

function AreaDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="area-description"
      className={cn(
        "text-sm text-muted-foreground leading-normal",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

const areaMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "size-10 border rounded-md bg-muted [&_svg:not([class*='size-'])]:size-5",
        image:
          "size-12 rounded-md overflow-hidden [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function AreaMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof areaMediaVariants>) {
  return (
    <div
      data-slot="area-media"
      data-variant={variant}
      className={cn(areaMediaVariants({ variant, className }))}
      {...props}
    />
  );
}

function AreaIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-icon"
      className={cn(
        "flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  );
}

function AreaActions({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      data-slot="area-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function AreaFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-footer"
      className={cn(
        "flex basis-full items-center justify-center gap-2",
        className
      )}
      {...props}
    />
  );
}

function AreaToolbar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-toolbar"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  );
}

function AreaTable<TData, TValue>({
  ...props
}: React.ComponentProps<typeof DataTable<TData, TValue>>) {
  return (
    <div
      data-slot="area-table"
      className={cn("overflow-hidden rounded-md border")}
    >
      <DataTable {...props} />
    </div>
  );
}

function AreaPagination({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="area-pagination"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  );
}

export {
  Area,
  AreaContent,
  AreaHeader,
  AreaTitle,
  AreaDescription,
  AreaActions,
  AreaMedia,
  AreaIcon,
  AreaFooter,
  AreaToolbar,
  AreaTable,
  AreaPagination,
  AreaGroup,
  AreaSeparator,
};

/**
 * USAGE EXAMPLES
 * ==============
 *
 * Basic Area with Header:
 * ```tsx
 * <Area variant="default" size="default">
 *   <AreaHeader>
 *     <AreaTitle>Dashboard</AreaTitle>
 *     <AreaDescription>Welcome to your dashboard</AreaDescription>
 *   </AreaHeader>
 *   <AreaContent>
 *     <p>Your content here</p>
 *   </AreaContent>
 * </Area>
 * ```
 *
 * Area with Glass Variant and Actions:
 * ```tsx
 * <Area variant="glass" size="lg">
 *   <AreaHeader>
 *     <AreaTitle>Projects</AreaTitle>
 *     <AreaDescription>Manage your projects</AreaDescription>
 *   </AreaHeader>
 *   <AreaActions>
 *     <Button>New Project</Button>
 *   </AreaActions>
 *   <AreaContent>
 *     <div>Project list</div>
 *   </AreaContent>
 * </Area>
 * ```
 *
 * Area with Media/Icon:
 * ```tsx
 * <Area variant="muted">
 *   <AreaHeader>
 *     <AreaMedia variant="icon">
 *       <FolderIcon />
 *     </AreaMedia>
 *     <AreaTitle>Documents</AreaTitle>
 *     <AreaDescription>Your document collection</AreaDescription>
 *   </AreaHeader>
 *   <AreaContent>
 *     <div>Documents list</div>
 *   </AreaContent>
 * </Area>
 * ```
 *
 * Area with Table and Pagination:
 * ```tsx
 * <Area variant="outline" size="default">
 *   <AreaHeader>
 *     <AreaTitle>Users</AreaTitle>
 *     <AreaDescription>Manage user accounts</AreaDescription>
 *   </AreaHeader>
 *   <AreaToolbar>
 *     <Input placeholder="Search..." />
 *     <Button>Filter</Button>
 *   </AreaToolbar>
 *   <AreaTable>
 *     <Table>
 *       <TableHeader>...</TableHeader>
 *       <TableBody>...</TableBody>
 *     </Table>
 *   </AreaTable>
 *   <AreaFooter>
 *     <AreaPagination>
 *       <Pagination />
 *     </AreaPagination>
 *   </AreaFooter>
 * </Area>
 * ```
 *
 * Area Group with Separators:
 * ```tsx
 * <AreaGroup>
 *   <Area variant="default">
 *     <AreaContent>First area</AreaContent>
 *   </Area>
 *   <AreaSeparator />
 *   <Area variant="muted">
 *     <AreaContent>Second area</AreaContent>
 *   </Area>
 *   <AreaSeparator />
 *   <Area variant="glass">
 *     <AreaContent>Third area</AreaContent>
 *   </Area>
 * </AreaGroup>
 * ```
 *
 * Area with asChild Composition:
 * ```tsx
 * <Area asChild variant="glass">
 *   <Link href="/dashboard">
 *     <AreaContent>
 *       <AreaTitle>Go to Dashboard</AreaTitle>
 *     </AreaContent>
 *   </Link>
 * </Area>
 * ```
 *
 * Area with Image Media:
 * ```tsx
 * <Area>
 *   <AreaHeader>
 *     <AreaMedia variant="image">
 *       <img src="/avatar.jpg" alt="Avatar" />
 *     </AreaMedia>
 *     <AreaTitle>Profile</AreaTitle>
 *     <AreaDescription>User profile information</AreaDescription>
 *   </AreaHeader>
 *   <AreaContent>
 *     <div>Profile details</div>
 *   </AreaContent>
 * </Area>
 * ```
 */
