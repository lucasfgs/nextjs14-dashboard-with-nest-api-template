import { cn } from "@/lib/utils";

interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function PageContent({
  children,
  className,
  ...props
}: PageContentProps) {
  return (
    <div className={cn("flex-1 space-y-4 ", className)} {...props}>
      {children}
    </div>
  );
}
