import { cn } from "@/lib/utils";

interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
export function PageHeader({ children, className, ...props }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between space-y-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface PageHeaderTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function PageHeaderTitle({
  children,
  className,
  ...props
}: PageHeaderTitleProps) {
  return (
    <h2
      className={cn("text-2xl font-bold tracking-tight", className)}
      {...props}
    >
      {children}
    </h2>
  );
}

interface PageHeaderOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageHeaderOptions({
  children,
  className,
  ...props
}: PageHeaderOptionsProps) {
  return (
    <div
      className={cn(
        "flex sm:items-center sm:flex-row sm:space-x-2 sm:space-y-0 space-y-2 flex-col items-start",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
