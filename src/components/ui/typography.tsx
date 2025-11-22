import { cn } from "@/lib/utils";

export function TypographyH1({
  className,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH2({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH3({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH4({
  className,
  ...props
}: React.ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH5({
  className,
  ...props
}: React.ComponentProps<"h5">) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyH6({
  className,
  ...props
}: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

export function TypographyP({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return <p className={cn("leading-7 not-first:mt-6", className)} {...props} />;
}

export function TypographyBlockquote({
  className,
  ...props
}: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic", className)}
      {...props}
    />
  );
}

export function TypographyList({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
      {...props}
    />
  );
}
