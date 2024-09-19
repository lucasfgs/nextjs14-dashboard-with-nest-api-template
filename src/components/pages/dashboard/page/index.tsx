import { cn } from "@/lib/utils";

export enum ELayout {
  Full,
  Compact,
}
interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  layout: ELayout;
}

export default function Page({
  children,
  className,
  layout,
  ...props
}: PageProps) {
  return (
    <div
      className={cn(
        `flex-1 space-y-4 p-8 pt-6 ${
          layout === ELayout.Compact && "mx-auto w-full max-w-7xl"
        }`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
