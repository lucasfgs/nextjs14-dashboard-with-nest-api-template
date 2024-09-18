import { cn } from "@/lib/utils";

interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Page({ children, className, ...props }: PageProps) {
  return (
    <div className={cn("flex-1 space-y-4 p-8 pt-6", className)} {...props}>
      {children}
    </div>
  );
}
