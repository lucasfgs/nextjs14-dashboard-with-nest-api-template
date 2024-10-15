import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navigation } from "@/configs/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "hidden md:flex items-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      {navigation.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={cn(
            "text-lg md:text-sm font-medium transition-colors hover:text-primary",
            pathname.includes(item.link) ? "" : "text-muted-foreground"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
